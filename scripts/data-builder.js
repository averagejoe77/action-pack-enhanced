import { calculateUsesForItem } from "./utils.js";

export class ActionPackDataBuilder {
    constructor() {
    }

    build(actors, scrollPosition) {
        this.settingShowNoUses = game.settings.get("action-pack-enhanced", "show-no-uses");
        this.settingShowUnpreparedCantrips = game.settings.get("action-pack-enhanced", "show-unprepared-cantrips");
        this.settingShowUnpreparedSpells = game.settings.get("action-pack-enhanced", "show-unprepared-spells");
        this.settingSkillMode = game.settings.get("action-pack-enhanced", "skill-mode");
        this.settingSortAlphabetically = game.settings.get("action-pack-enhanced", "sort-alphabetic");
        this.settingShowWeaponMastery = game.settings.get("action-pack-enhanced", "show-weapon-mastery");

        return actors.map(actor => this.prepareActor(actor, scrollPosition));
    }

    prepareActor(actor, scrollPosition) {
        const actorData = actor.system;
        const canCastUnpreparedRituals = !!actor.itemTypes.feat.find(i => i.name === "Ritual Adept");

        let sections = {
            equipped: { items: [], title: "action-pack-enhanced.category.equipped" },
            inventory: {
                title: "action-pack-enhanced.category.inventory",
                groups: {
                    weapon: { items: [], title: "action-pack-enhanced.category.weapon" },
                    equipment: { items: [], title: "action-pack-enhanced.category.equipment" },
                    consumable: { items: [], title: "action-pack-enhanced.category.consumable" },
                    other: { items: [], title: "action-pack-enhanced.category.other" }
                }
            },
            feature: { items: [], title: "action-pack-enhanced.category.feature", groups: this.systemFeatureGroups() },
            spell: {
                title: "action-pack-enhanced.category.spell",
                groups: {
                    innate: { items: [], title: "action-pack-enhanced.category.innate" },
                    atwill: { items: [], title: "action-pack-enhanced.category.atwill" },
                    pact: { items: [], title: "action-pack-enhanced.category.pact" },
                    ...[...Array(10).keys()].reduce((prev, cur) => {
                        prev[`spell${cur}`] = { items: [], title: `action-pack-enhanced.category.spell${cur}` }
                        return prev;
                    }, {})
                }
            },
            passive: { items: [], title: "action-pack-enhanced.category.passive" }
        };

        const itemMap = ["consumable", "container", "equipment", "feat", "loot", "spell", "tool", "weapon"];

        for (const [type, items] of Object.entries(actor.itemTypes)) {
            if (!itemMap.includes(type)) {
                continue;
            }
            for (const item of items) {
                this._processItem(item, type, sections, actor, canCastUnpreparedRituals);
            }
        }

        const wm5eActive = game.modules.find(m => m.id === "wm5e") && game.modules.get("wm5e")?.active;
        if (actor.type === "character" && wm5eActive) {
            const weaponMaster = actor.itemTypes.feat.find(i => i.name === "Weapon Mastery" || i.name === "Weapon Master");
            if (weaponMaster) {
               // Determine if we should force open the section (e.g. pending selection)
                const isPending = actor.getFlag("action-pack-enhanced", "masterySelectionPending");
                sections.equipped.forceOpen = isPending;
            }
        }

        const combatant = game.combat?.combatants.find(c => c.actor === actor);
        const needsInitiative = combatant && !combatant.initiative;

        let doShowSkills = false;
        const { uuid, showSkills } = scrollPosition || {};
        if (actor.uuid === uuid && showSkills) {
            doShowSkills = true;
        }

        return {
            actor: actor,
            name: actor.name,
            sections: this.addSpellLevelUses(this.sortItems(this.removeEmptySections(sections)), actorData),
            needsInitiative,
            skills: CONFIG.DND5E.skills,
            skillMode: this.settingSkillMode,
            showSkills: doShowSkills
        };
    }

    _processItem(item, type, sections, actor, canCastUnpreparedRituals) {
        const itemData = item.system;
        const uses = calculateUsesForItem(item);

        const hasUses = this.settingShowNoUses || !uses || uses.available;
        const hasActivities = itemData?.activities?.size > 0 ? true : false;
        const isHidden = item.getFlag("action-pack-enhanced", "hidden");

        if (hasUses && hasActivities && !isHidden) {
            switch (type) {
                case "feat":
                    this._prepareFeat(item, itemData, uses, sections);
                    break;
                case "spell":
                    this._prepareSpell(item, itemData, uses, sections, canCastUnpreparedRituals);
                    break;
                case "weapon":
                    this._prepareWeapon(item, itemData, uses, sections);
                    break;
                case "equipment":
                    this._prepareEquipment(item, itemData, uses, sections);
                    break;
                case "consumable":
                    this._prepareConsumable(item, itemData, uses, sections);
                    break;
                case "facility":
                    break;
                default:
                    this._prepareOther(item, itemData, uses, sections);
                    break;
            }
        } else if (actor.type === "npc") {
            sections.passive.items.push({ item, uses });
        }
    }

    _prepareFeat(item, itemData, uses, sections) {
        const type = itemData.type?.value;
        const subtype = itemData.type?.subtype;

        if (subtype && sections.feature.groups[subtype]) {
            sections.feature.groups[subtype].items.push({ item, uses });
        } else if (type && sections.feature.groups[type]) {
            sections.feature.groups[type].items.push({ item, uses });
        } else {
            sections.feature.items.push({ item, uses });
        }
    }

    _prepareSpell(item, itemData, uses, sections, canCastUnpreparedRituals) {

        const mode = itemData?.method;

        switch (mode) {
            case "spell":
                const isPrepared = itemData?.prepared === 1;
                const isAlways = itemData?.prepared === 2;
                const isCastableRitual = (canCastUnpreparedRituals && itemData.properties?.has("ritual"));
                const isDisplayableCantrip = itemData.level == 0 && this.settingShowUnpreparedCantrips;
                const isDisplayableUnpreparedSpell = itemData.level > 0 && this.settingShowUnpreparedSpells;
                if (isAlways || isPrepared || isCastableRitual || isDisplayableCantrip || isDisplayableUnpreparedSpell) {
                    sections.spell.groups[`spell${itemData.level}`].items.push({ item, uses });
                }
                break;
            case "atwill":
                sections.spell.groups.atwill.items.push({ item, uses });
                break;
            case "innate":
                sections.spell.groups.innate.items.push({ item, uses });
                break;
            case "pact":
                sections.spell.groups.pact.items.push({ item, uses });
                break;
        }
    }

    _prepareWeapon(item, itemData, uses, sections) {
        if (itemData.equipped) {
            sections.equipped.items.push({ item, uses });
        } else {
            sections.inventory.groups.weapon.items.push({ item, uses });
        }
    }

    _prepareEquipment(item, itemData, uses, sections) {
        sections.inventory.groups.equipment.items.push({ item, uses });
    }

    _prepareConsumable(item, itemData, uses, sections) {
        if (itemData.consumableType !== "ammo") {
            sections.inventory.groups.consumable.items.push({ item, uses });
        }
    }

    _prepareOther(item, itemData, uses, sections) {
        sections.inventory.groups.other.items.push({ item, uses });
    }

    systemFeatureGroups() {
        return Object.entries(CONFIG.DND5E.featureTypes).reduce((prev, cur) => {
            prev[cur[0]] = {
                items: [],
                title: cur[1].label
            }
            if (cur[1].subtypes) {
                for (const sub in cur[1].subtypes) {
                    prev[sub] = {
                        items: [],
                        title: cur[1].subtypes[sub]
                    }
                }
            }
            return prev;
        }, {});
    }

    removeEmptySections(sections) {
        const hasItems = (object) => {
            if (!object || typeof object !== "object") { return false; }
            const keys = Object.keys(object);
            if (keys.includes("groups") && Object.values(object.groups).some(g => hasItems(g))) { return true; }
            if (keys.includes("items")) { return !!object.items.length; }
            return Object.values(object).some(v => hasItems(v));
        }

        return Object.entries(sections).reduce((acc, [key, value]) => {
            if (hasItems(value)) {
                acc[key] = value;
            }
            return acc;
        }, {});
    }

    addSpellLevelUses(sections, actorData) {
        for (let l = 1; l <= 9; l++) {
            const group = sections.spell?.groups[`spell${l}`];
            if (group) {
                const sl = actorData.spells[`spell${l}`];
                group.uses = { available: sl.value, maximum: sl.max };
            }
        }

        if (actorData.spells.pact.max) {
            sections.spell.groups.pact.uses = {
                available: actorData.spells.pact.value,
                maximum: actorData.spells.pact.max
            }
        }

        return sections;
    }

    sortItems(sections) {
        Object.entries(sections).forEach(([key, value]) => {
            if (key === "items") {
                value.sort((a, b) => {
                    if (this.settingSortAlphabetically) {
                        return a.item.name.localeCompare(b.item.name);
                    } else {
                        return a.item.sort - b.item.sort;
                    }
                });
            } else if (typeof value === "object") {
                this.sortItems(value);
            }
        });
        return sections;
    }
}
