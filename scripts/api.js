import { formatNumber } from "./utils.js";

export class ActionPackAPI {
    constructor() {
        this.masteryTable = [
            {"level": 1, "mastery": 3},
            {"level": 2, "mastery": 3},
            {"level": 3, "mastery": 3},
            {"level": 4, "mastery": 4},
            {"level": 5, "mastery": 4},
            {"level": 6, "mastery": 4},
            {"level": 7, "mastery": 4},
            {"level": 8, "mastery": 4},
            {"level": 9, "mastery": 4},
            {"level": 10, "mastery": 5},
            {"level": 11, "mastery": 5},
            {"level": 12, "mastery": 5},
            {"level": 13, "mastery": 5},
            {"level": 14, "mastery": 5},
            {"level": 15, "mastery": 5},
            {"level": 16, "mastery": 6},
            {"level": 17, "mastery": 6},
            {"level": 18, "mastery": 6},
            {"level": 19, "mastery": 6},
            {"level": 20, "mastery": 6}
        ]
    }

    /**
     * Updates an actor's HP
     * @param {Actor} actor 
     * @param {number} value 
     */
    async updateHP(actor, value) {
        if (!actor) return;
        return actor.update({ "system.attributes.hp.value": value });
    }

    /**
     * Updates an actor's Temp HP
     * @param {Actor} actor 
     * @param {number} value 
     */
    async updateTempHP(actor, value) {
        if (!actor) return;
        return actor.update({ "system.attributes.hp.temp": value });
    }

    /**
     * Updates an actor's XP
     * @param {Actor} actor 
     * @param {number} value 
     */
    async updateXP(actor, value) {
        if (!actor) return;
        return actor.update({ "system.details.xp.value": value });
    }

    /**
     * Performs a Short Rest
     * @param {Actor} actor 
     */
    async shortRest(actor) {
        if (!actor) return;
        return actor.shortRest();
    }

    /**
     * Performs a Long Rest
     * @param {Actor} actor 
     */
    async longRest(actor) {
        if (!actor) return;
        
        // 1. Perform the standard Long Rest
        const result = await actor.longRest();

        // 2. Check for WM5e Module
        const wm5eActive = game.modules.get('wm5e') && game.modules.get("wm5e")?.active;

        if (wm5eActive && actor.itemTypes.feat.find(f => f.name === "Weapon Mastery" || f.name === "Weapon Master")) {

            // 3. Gather Unique Mastery Choices
            await actor.setFlag("action-pack-enhanced", "masterySelectionPending", true);

            const equippedWeapons = actor.itemTypes.weapon.filter(w => w.system.equipped);
            const choices = new Map();

            const currentMasteries = actor.system.traits.weaponProf.mastery.value;

            equippedWeapons.forEach(w => {
                const mastery = w.system.mastery;
                const baseItem = w.system.type?.baseItem;
                
                if (mastery && baseItem && !choices.has(baseItem)) {
                    choices.set(baseItem, {
                        id: baseItem,
                        label: baseItem.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                        masteryLabel: CONFIG.DND5E.weaponMasteries[mastery]?.label || mastery,
                        selected: currentMasteries.find(m => m === baseItem)
                    });
                }
            });

            // 4. Logic Branch
            const isFighter = actor.itemTypes.class.find(c => c.name === "Fighter");
            const fighterLvl = isFighter ? actor.itemTypes.class.find(c => c.name === "Fighter").system.levels : 0; 

            const isRogue = actor.itemTypes.class.find(c => c.name === "Rogue");

            if(isFighter){
                const masteryLevel = this.masteryTable.find(m => m.level <= fighterLvl);
                if (masteryLevel) {
                    await this.promptMasterySelection(actor, choices, masteryLevel.mastery);
                }
            } else if (isRogue){    
                await this.promptMasterySelection(actor, choices, 2);
            } else {
                await this.promptMasterySelection(actor, choices, 1);
            }
        } else {
            // If module not active, just ensure we are locked (not pending)
            await actor.setFlag("action-pack-enhanced", "masterySelectionPending", false);
            // 2. Clear Weapon Mastery selection to prevent chat log clutter
            await actor.update({ "system.traits.weaponProf.mastery.value": [] });
        }

        return result;
    }

    async promptMasterySelection(actor, choices, maxMasteries) {
        const { DialogV2 } = foundry.applications.api;
        
        let content = `<p>Select up to ${maxMasteries} Weapon ${maxMasteries === 1 ? "Mastery" : "Masteries"} for the day:</p>`;
        content += `<form class="ape-mastery-dialog">`;
        
        for (const [id, data] of choices) {
            content += `
            <div class="ape-mastery-switch form-group">
                <input id="${id}" class="ape-mastery-checkbox" type="checkbox" name="mastery" value="${id}" data-dtype="String" ${data.selected ? "checked" : ""}>
                <label for="${id}" class="ape-mastery-label">${data.label} (${data.masteryLabel})</label>
            </div>`;
        }
        content += `</form>`;
        
        // Add script for interactivity (limit selection)
        content += `
        <script>
            (function() {
                const form = document.querySelector('.ape-mastery-dialog');
                if (!form) return;
                const inputs = form.querySelectorAll('input[name="mastery"]');
                const max = ${maxMasteries};
                
                function updateState() {
                    const checked = Array.from(inputs).filter(i => i.checked);
                    inputs.forEach(i => {
                        if (!i.checked) {
                            i.disabled = checked.length >= max;
                        } else {
                            i.disabled = false;
                        }
                    });
                }
                
                inputs.forEach(i => i.addEventListener('change', updateState));
                updateState(); // Initial check
            })();
        </script>
        `;

        return DialogV2.wait({
            window: { title: "Weapon Mastery Selection" },
            content: content,
            buttons: [{
                action: "update",
                label: "Update",
                default: true,
                callback: async (event, button, dialog) => {
                    const selected = [];
                    // Use dialog.element to scope the query
                    dialog.element.querySelectorAll('input[name="mastery"]:checked').forEach(el => {
                        selected.push(el.value);
                    });

                    if (selected.length > maxMasteries) {
                        ui.notifications.warn(`You selected more than ${maxMasteries} masteries. Only the first ${maxMasteries} will be applied.`);
                        selected.splice(maxMasteries);
                    }

                    // Update actor data via update() first
                    await actor.update({ "system.traits.weaponProf.mastery.value": selected });
                    
                    await actor.setFlag("action-pack-enhanced", "masterySelectionPending", false);
                    return true; 
                }
            }, {
                action: "cancel",
                label: "Cancel",
                callback: async () => {
                    await actor.setFlag("action-pack-enhanced", "masterySelectionPending", false);
                    return false;
                }
            }],
            submit: (event) => {
                // Default submit handler if Enter is pressed in a single input form, but we have multiple.
                // DialogV2 handles buttons nicely.
            }
        });
    }

    /**
     * Toggles a Weapon Mastery selection
     * @param {Actor} actor 
     * @param {string} masteryId 
     */
    async toggleMastery(actor, masteryId) {
        if (!actor || !masteryId) return;

        const currentMasteries = new Set(actor.system.traits?.weaponProf?.mastery?.value || []);
        
        if (currentMasteries.has(masteryId)) {
            currentMasteries.delete(masteryId);
        } else {
            if (currentMasteries.size >= 2) {
                ui.notifications.warn("You can only select up to 2 Weapon Masteries.");
                return;
            }
            currentMasteries.add(masteryId);
        }

        return actor.update({ "system.traits.weaponProf.mastery.value": Array.from(currentMasteries) });
    }

    /**
     * Locks Weapon Mastery selection
     * @param {Actor} actor 
     */
    async lockMasteries(actor) {
        if (!actor) return;
        return actor.setFlag("action-pack-enhanced", "masterySelectionPending", false);
    }

    /**
     * Rolls Initiative for the actor in the current combat
     * @param {Actor} actor 
     */
    async rollInitiative(actor) {
        if (!game.combat) return;
        const combatant = game.combat.combatants.find(c => c.actor === actor);
        if (combatant) {
            return game.combat.rollInitiative([combatant.id]);
        }
    }

    /**
     * End the current turn
     */
    async endTurn() {
        if (game.combat) {
            return game.combat.nextTurn();
        }
    }

    /**
     * Opens the Actor Sheet
     * @param {Actor} actor 
     */
    openSheet(actor) {
        if (actor) {
            actor.sheet.render(true);
        }
    }

    /**
     * Rolls a Death Saving Throw
     * @param {Actor} actor 
     */
    async rollDeathSave(actor, event) {
        return actor.rollDeathSave({ event });
    }

    /**
     * Rolls an Ability Check
     * @param {Actor} actor 
     * @param {string} abilityId 
     */
    async rollAbilityCheck(actor, abilityId, event) {
        return actor.rollAbilityCheck({ event, ability: abilityId });
    }

    /**
     * Rolls a Saving Throw
     * @param {Actor} actor 
     * @param {string} abilityId 
     */
    async rollSavingThrow(actor, abilityId, event) {
        return actor.rollSavingThrow({ event, ability: abilityId });
    }

    /**
     * Rolls a Skill
     * @param {Actor} actor 
     * @param {string} skillId 
     * @param {boolean} fastForward 
     */
    async rollSkill(actor, skillId, event, fastForward = false) {
        return actor.rollSkill({ event, skill: skillId }, { fastForward });
    }

    /**
     * Adjusts Spell Slots
     * @param {Actor} actor 
     * @param {string} groupName 
     * @param {number} slotIndex 
     */
    async adjustSpellSlot(actor, groupName, slotIndex) {
        const slot = slotIndex + 1;
        const current = actor.system.spells?.[groupName]?.value;
        if (current !== undefined) {
            const key = `system.spells.${groupName}.value`;
            const newValue = current !== slot ? slot : slot - 1;
            return actor.update({ [key]: newValue });
        }
    }

    /**
     * Rolls an Item
     * @param {Item} item 
     */
    async rollItem(item, event) {
        if (!item) return;

        // Item Macro Support
        if (!game.modules.get("wire")?.active && game.modules.get("itemacro")?.active && game.settings.get("itemacro", "defaultmacro")) {
            if (item.hasMacro()) {
                item.executeMacro();
                return;
            }
        }
        return item.use({}, event);
    }

    /**
     * Rolls Item Recharge
     * @param {Item} item 
     */
    async rollRecharge(item) {
        return item.rollRecharge();
    }

    /**
     * Gets Item Chat Data for Description
     * @param {Item} item 
     */
    async getItemDescription(item) {
        const chatData = await item.getChatData({ secrets: item.actor.isOwner });
        
        // Helper to format properties
        const activationType = item.system?.activation?.type || "";
        const activationValue = item.system?.activation?.value || "";
        
        let castingTime = "";
        if (activationValue === "") {
            castingTime = activationType.charAt(0).toUpperCase() + activationType.slice(1);
        } else if (activationValue && activationType) {
            castingTime = `${activationValue} ${activationType.charAt(0).toUpperCase() + activationType.slice(1)}`;
        }

        return {
            description: chatData.description,
            properties: {
                castingTime,
                range: this._formatRange(item),
                duration: this._formatDuration(item)
            }
        };
    }

    /**
     * Toggles inspiration on an actor
     * @param {Actor} actor 
     */
    async toggleInspiration(actor) {
        if (!actor) return;
        return actor.update({ "system.attributes.inspiration": !actor.system.attributes.inspiration });
    }

    _formatRange(item) {
        const value = item.system?.range?.value;
        const units = item.system?.range?.units;
        if (value && units) return `${value} ${units}`;
        if (units) return units;
        return "";
    }

    _formatDuration(item) {
        const value = item.system?.duration?.value;
        const units = item.system?.duration?.units;
        if (value && units) return `${value} ${units}`;
        if (units) return units === "inst" ? "Instantaneous" : units;
        return "";
    }
}
