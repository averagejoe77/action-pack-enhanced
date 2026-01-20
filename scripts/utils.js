import { ActionPackAPI } from "./api.js";

export function formatNumber(val) {
    if (val === undefined || val === null) return "0";
    const sign = val >= 0 ? '+' : '';
    return `${sign}${val}`;
}

export function getItemDetails(item) {
    const castingTime = _formatCastingTime(item);
    const range = _formatRange(item);
    const duration = _formatDuration(item);
    return { castingTime, range, duration };
}

function _formatCastingTime(item) {
    const activationType = item.system?.activation?.type || "";
    const activationValue = item.system?.activation?.value || "";

    if (activationValue === "" && activationType !== "") {
        return game.i18n.localize(`action-pack-enhanced.action-type.${activationType}`);
    } else if (activationValue && activationType) {
        return `${activationValue} ${activationType.charAt(0).toUpperCase() + activationType.slice(1)}`;
    }
    return "";
}

function _formatRange(item) {
    const value = item.system?.range?.value || item.system?.range?.reach || 5;
    const long = item.system?.range?.long || null;
    const units = item.system?.range?.units;
    if (value && long && units) return `${value} ${units} / ${long} ${units}`;
    if (value && units) return `${value} ${units}`;
    if (units) return game.i18n.localize(`action-pack-enhanced.range.${units}`);
    return "";
}

function _formatDuration(item) {
    const value = item.system?.duration?.value;
    const units = item.system?.duration?.units;
    if (value && units) return `${value} ${value > 1 ? units + 's' : units}`;
    if (units) return game.i18n.localize(`action-pack-enhanced.duration.${units}`);
    return "";
}

export function generateRaceClassDisplay(actor) {
    // in the format (Human - Wizard [Abjurer], Fighter [Defense])
    let raceClass = {};
    let races = actor.itemTypes.race;
    let classes = actor.itemTypes.class;
    let subClasses = actor.itemTypes.subclass;
    const level = actor.system.details.level;
    
    if (classes.length === subClasses.length) {
        let obj = {race: `<span>${races[0]?.name} - ${level}</span>` || "Unknown", classes: []};
        for (let i = 0; i < classes.length; i++) {
            obj.classes[i] = {name: classes[i].name, level: classes[i].system.levels, subclass: {name: subClasses[i].name}};
        }
        raceClass = obj;
    } else {
        let obj = {race: `<span>${races[0]?.name} - ${level}</span>` || "Unknown", classes: []};
        for (let i = 0; i < classes.length; i++) {
            obj.classes[i] = {name: classes[i].name, level: classes[i].system.levels, subclass: {name: ''}};
            for(let j = 0; j < subClasses.length; j++) {
                obj.classes[i].subclass.name = subClasses[j].name;
            }
        }
        raceClass = obj;
    }

    // create the race, class(lvl) - subclass, class(lvl) - subclass format from the data
    let raceClassText = `${raceClass.race}, `;
    for (let i = 0; i < raceClass.classes.length; i++) {
        raceClassText += `<span class="ape-actor-class">${raceClass.classes[i].name}(${raceClass.classes[i].level})</span>`;
        if (raceClass.classes[i].subclass.name !== '' ) {
            raceClassText += `<span class="ape-actor-subclass"> - ${raceClass.classes[i].subclass.name}</span>`;
        }
        if(i < raceClass.classes.length - 1) {
            raceClassText += `, `;
        }
    }
    return raceClassText;
}

// From Illandril's NPC Quick Actions by Joe Spandrusyszyn

export const calculateUsesForItem = (item) => {
    const itemData = item.system;
    const consume = itemData.consume;
    if (consume && consume.target) {
        return calculateConsumeUses(item.actor, consume);
    }
    const uses = itemData.uses;
    if (uses && (uses.max > 0 || uses.value > 0)) {
        return calculateLimitedUses(itemData);
    }

    const itemType = item.type;
    if (itemType === 'feat') {
        return calculateFeatUses(itemData);
    } else if (itemType === 'consumable') {
        return {
            available: itemData.quantity,
        };
    // } else if (itemType === 'spell') {
    //     return calculateSpellUses(item);
    } else if (itemType === 'weapon') {
        return calculateWeaponUses(itemData);
    }
    return null;
};

function calculateConsumeUses(actor, consume) {
    let available = null;
    let maximum = null;
    if (consume.type === 'attribute') {
        const value = getProperty(actor.system, consume.target);
        if (typeof value === 'number') {
            available = value;
        } else {
            available = 0;
        }
    } else if (consume.type === 'ammo' || consume.type === 'material') {
        const targetItem = actor.items.get(consume.target);
        if (targetItem) {
            available = targetItem.system.quantity;
        } else {
            available = 0;
        }
    } else if (consume.type === 'charges') {
        const targetItem = actor.items.get(consume.target);
        if (targetItem) {
            ({ available, maximum } = calculateLimitedUses(targetItem.system));
        } else {
            available = 0;
        }
    }
    if (available !== null) {
        if (consume.amount > 1) {
            available = Math.floor(available / consume.amount);
            if (maximum !== null) {
                maximum = Math.floor(maximum / consume.amount);
            }
        }
        return { available, maximum };
    }
    return null;
}

function calculateLimitedUses(itemData) {
    let available = itemData.uses.value;
    let maximum = itemData.uses.max;
    const quantity = itemData.quantity;
    if (quantity) {
        available = available + (quantity - 1) * maximum;
        maximum = maximum * quantity;
    }
    return { available, maximum };
}

function calculateFeatUses(itemData) {
    // if (itemData.recharge && itemData.recharge.value) {
    //     return { available: itemData.recharge.charged ? 1 : 0, maximum: 1 };
    // }
    return null;
}

function calculateSpellUses(item) {
    const itemData = item.system;
    const actorData = item.actor.system;
    let available = null;
    let maximum = null;
    const preparationMode = itemData.preparation.mode;
    if (preparationMode === 'pact') {
        available = actorData.spells['pact'].value;
        maximum = actorData.spells['pact'].max;
    } else if (preparationMode === 'innate' || preparationMode === 'atwill') {
        // None
    } else {
        let level = itemData.level;
        if (level > 0) {
            available = actorData.spells['spell' + level].value;
            maximum = actorData.spells['spell' + level].max;
        }
    }
    if (available === null) {
        return null;
    } else {
        return { available, maximum };
    }
}

function calculateWeaponUses(itemData) {
    // If the weapon is a thrown weapon, but not a returning weapon, show quantity
    if (itemData.properties.thr && !itemData.properties.ret) {
        return { available: itemData.quantity, maximum: null };
    }
    return null;
}
