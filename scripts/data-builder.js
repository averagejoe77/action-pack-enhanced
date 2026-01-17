import { calculateUsesForItem } from "./utils.js";

export class ActionPackDataBuilder {
    constructor() {
        this.settingShowNoUses = game.settings.get("ape", "show-no-uses");
        this.settingShowUnpreparedCantrips = game.settings.get("ape", "show-unprepared-cantrips");
        this.settingSkillMode = game.settings.get("ape", "skill-mode");
        this.settingSortAlphabetically = game.settings.get("ape", "sort-alphabetic");
    }

    build(actors, scrollPosition) {
        return actors.map(actor => this.prepareActor(actor, scrollPosition));
    }

    prepareActor(actor, scrollPosition) {
        const actorData = actor.system;
        const canCastUnpreparedRituals = !!actor.itemTypes.feat.find(i => i.name === "Ritual Adept");

        let sections = {
            equipped: { items: [], title: "ape.category.equipped" },
            inventory: {
                title: "ape.category.inventory",
                groups: {
                    weapon: { items: [], title: "ape.category.weapon" },
                    equipment: { items: [], title: "ape.category.equipment" },
                    consumable: { items: [], title: "ape.category.consumable" },
                    other: { items: [], title: "ape.category.other" }
                }
            },
            feature: { items: [], title: "ape.category.feature", groups: this.systemFeatureGroups() },
            spell: {
                title: "ape.category.spell",
                groups: {
                    innate: { items: [], title: "ape.category.innate" },
                    atwill: { items: [], title: "ape.category.atwill" },
                    pact: { items: [], title: "ape.category.pact" },
                    ...[...Array(10).keys()].reduce((prev, cur) => {
                        prev[`spell${cur}`] = { items: [], title: `ape.category.spell${cur}` }
                        return prev;
                    }, {})
                }
            },
            passive: { items: [], title: "ape.category.passive" }
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
        const isHidden = item.getFlag("ape", "hidden");

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
        // dnd5e wants me to update this to use itemData.method instead of itemData.preparation.mode, but itemData.method does not currently have the correct values, but rather simply "spell" for all spells. Will need to keep an eye on each system update and see if this changes. Same goes for the itemData.preparation.prepared property below.
        const mode = itemData?.preparation?.mode;
        switch (mode) {
            case "prepared":
            case "always":
                const isAlways = mode !== "prepared";
                const isPrepared = itemData?.preparation?.prepared;
                const isCastableRitual = (canCastUnpreparedRituals && itemData.properties?.has("ritual"));
                const isDisplayableCantrip = itemData.level == 0 && this.settingShowUnpreparedCantrips;
                if (isAlways || isPrepared || isCastableRitual || isDisplayableCantrip) {
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
