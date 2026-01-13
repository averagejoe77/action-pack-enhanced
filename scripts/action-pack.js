import { ActionPackRenderer } from "./render.js";
import { ActionPackDataBuilder } from "./data-builder.js";
import { ActionPackInteractions } from "./interactions.js";
import { registerSettings } from "./settings.js";

let lastKnownActiveActor;
let currentlyActiveActor;

// Single instance of interactions to maintain state
let interactions;
let dataBuilder;

function fromUuid(uuid) {
    if (!uuid || uuid === '') return null;
    let parts = uuid.split('.');
    let doc;

    const [docName, docId] = parts.slice(0, 2);
    parts = parts.slice(2);
    const collection = CONFIG[docName]?.collection.instance;
    if (!collection) return null;
    doc = collection.get(docId);

    // Embedded Documents
    while (doc && parts.length > 1) {
        const [embeddedName, embeddedId] = parts.slice(0, 2);
        doc = doc.getEmbeddedDocument(embeddedName, embeddedId);
        parts = parts.slice(2);
    }
    return doc || null;
}

export function fudgeToActor(candidate) {
    // Token actors have the same UUID for the token document and the actor, try to get the actor
    if (candidate instanceof CONFIG.Actor.documentClass) {
        return candidate;
    } else if (candidate instanceof CONFIG.Token.documentClass) {
        return candidate.object.actor;
    } else {
        console.warn('Expected', candidate, 'to be actor');
    }
}

function updateCombatStatus() {
    const actors = canvas.tokens.controlled.map(t => t.actor);
    if (game.combat && actors.includes(currentlyActiveActor)) {
        $('#action-pack').addClass("is-current-combatant");
    } else {
        $('#action-pack').removeClass("is-current-combatant");
    }
}

Hooks.on("ready", () => {
    const trayHtml = `
        <div id="action-pack">
        </div>
    `;
    $('body').prepend(trayHtml);

    lastKnownActiveActor = game.combat?.turns.find(c => c.id == game.combat?.current.combatantId)?.actor;
    currentlyActiveActor = lastKnownActiveActor;

    if (isTrayAlwaysOn()) {
        $('#action-pack').addClass("is-open always-on");
    }

    updateTrayState();
});

function isTrayAutoHide() {
    const config = game.settings.get("action-pack", "tray-display");
    return config === "selected" || config === "auto";
}

function isTrayAlwaysOn() {
    const config = game.settings.get("action-pack", "tray-display");
    return config === "always";
}

function getActiveActors() {
    const controlled = canvas.tokens.controlled.filter(t => ["character", "npc"].includes(t.actor?.type))
    if (controlled.length) {
        return controlled.map(token => token.actor);
    }
    if (game.user.character && game.settings.get("action-pack", "assume-default-character")) {
        return [game.user.character];
    }
    return [];
}

Hooks.on("controlToken", async () => {
    updateTrayState();
});

Hooks.on("updateActor", (actor) => {
    if (getActiveActors().includes(actor)) {
        updateTray();
    }
});

function checkItemUpdate(item) {
    if (getActiveActors().includes(item.actor)) {
        updateTray();
    }
}

Hooks.on("updateItem", (item) => {
    checkItemUpdate(item);
});

Hooks.on("deleteItem", (item) => {
    checkItemUpdate(item);
});

Hooks.on("createItem", (item) => {
    checkItemUpdate(item);
});

Hooks.on("updateCombat", (combat) => {
    currentlyActiveActor = combat.turns.find(c => c.id == combat.current.combatantId)?.actor
    updateCombatStatus();
    lastKnownActiveActor = currentlyActiveActor;
});

Hooks.on("createCombatant", (combatant) => {
    if (getActiveActors().includes(combatant.actor)) {
        updateTray();
    }
});

Hooks.on("updateCombatant", (combatant, changes) => {
    if (getActiveActors().includes(combatant.actor)) {
        updateTray();
    }
});

Hooks.on("deleteCombat", (combat) => {
    if (!game.combat) {
        currentlyActiveActor = null;
        lastKnownActiveActor = null;
        updateCombatStatus();
    }
})

Hooks.on("init", () => {
    registerSettings({
        updateTray,
        updateTrayState,
        resetScroll: () => {
            if (interactions) interactions.scrollPosition = {};
        }
    });
});

Hooks.on('getSceneControlButtons', (controls) => {
    console.log("getSceneControlButtons", controls);
    if (game.settings.get("action-pack", "use-control-button") && !isTrayAlwaysOn()) {
        const tokenTools = controls.tokens.tools;
        if (tokenTools) {
            tokenTools.actionPack = {
                name: "actionPack",
                title: "action-pack.control-icon",
                icon: 'fas fa-hand-point-left',
                visible: true,
                onClick: () => {
                    $('#action-pack').toggleClass("is-open");
                    $('#action-pack .action-pack__skill-container').removeClass("is-open");
                },
                button: 1
            };
        }
    }
});

function updateTrayState() {
    if (isTrayAutoHide()) {
        const controlled = canvas.tokens.controlled.filter(t => ["character", "npc"].includes(t.actor?.type));
        if (controlled.length) {
            $('#action-pack').addClass("is-open");
        } else {
            $('#action-pack').removeClass("is-open");
        }
    }

    if (isTrayAlwaysOn()) {
        $('#action-pack').addClass("is-open always-on");
    } else {
        $('#action-pack').removeClass("always-on");
    }

    updateCombatStatus();
    updateTray();
}

async function updateTray() {
    if (!dataBuilder) dataBuilder = new ActionPackDataBuilder();
    if (!interactions) interactions = new ActionPackInteractions(updateTray, getActiveActors);

    const actors = getActiveActors();

    // Use current settings/data to build actor data
    const builtData = dataBuilder.build(actors, interactions.scrollPosition);

    function prefix(tgt, str) {
        return tgt ? [str, tgt].join("-") : tgt;
    }

    const iconSize = prefix(game.settings.get("action-pack", "icon-size"), "icon");
    const traySize = prefix(game.settings.get("action-pack", "tray-size"), "tray");
    const showSpellDots = game.settings.get("action-pack", "show-spell-dots");
    const allAbilities = Object.entries(CONFIG.DND5E.abilities);
    const abilityColumns = [
        allAbilities.slice(0, 3).map(([key, config]) => ({ key, label: config.label })),
        allAbilities.slice(3, 6).map(([key, config]) => ({ key, label: config.label }))
    ];

    const callbacks = interactions.getCallbacks();

    const container = document.getElementById('action-pack');
    if (container) {
        const renderer = new ActionPackRenderer(callbacks);
        renderer.render(container, {
            actors: builtData, 
            iconSize, 
            traySize, 
            showSpellDots, 
            abilityColumns,
            scrollPosition: interactions.scrollPosition
        });
    }

    // Wrap the container in jQuery for legacy hook support if needed, or just pass the element
    const $container = $('#action-pack'); 
    Hooks.call('action-pack.updateTray', $container, builtData); // Passing builtData for compatibility with render.js expectation?
    // Wait, ActionsPackRenderer expects { actors: [ ... ] }.
    // builtData is array of actors.
    // The previous code passed { actors, ... } to render.
    // My new code passes { actors: builtData, ... } to render.
    // But the Hook call previously passed raw DOM container + actors?
    // Original Hook call: Hooks.call('action-pack.updateTray', $container, actors);
    // where actors was `getActiveActors().map(...)`.
    // So `builtData` is the correct equivalent.
}

Hooks.on("dnd5e.getItemContextOptions", (item, options) => {
    if (item.system.activation?.type && item.system.activation.type !== "none") {
        if (item.getFlag("action-pack", "hidden")) {
            options.push({
                name: "action-pack.item-context.show",
                icon: "<i class='fas fa-eye'></i>",
                callback: () => {
                    item.setFlag("action-pack", "hidden", false);
                    updateTray();
                }
            });
        } else {
            options.push({
                name: "action-pack.item-context.hide",
                icon: "<i class='fas fa-eye-slash'></i>",
                callback: () => {
                    item.setFlag("action-pack", "hidden", true);
                    updateTray();
                }
            });
        }
    }
});

Hooks.on("dropCanvasData", (canvas, data) => {
    if (data.type === "ActionPackItem" && data.uuid) {
        const item = fromUuid(data.uuid);
        if (!item) return;

        const dropTarget = canvas.tokens.placeables.find(token => {
             return (data.x >= token.x && data.x <= (token.x + token.w) &&
                     data.y >= token.y && data.y <= (token.y + token.h));
        });

        if (dropTarget) {
            dropTarget.setTarget(true, { user: game.user, releaseOthers: true, groupSelection: false });
            item.use();
            return false;
        }
    }
});
