import { formatNumber } from "./utils.js";

export class ActionPackAPI {
    constructor() {}

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
        return actor.longRest();
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
