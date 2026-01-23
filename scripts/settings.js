export function registerSettings(callbacks) {
    const { updateTray, updateTrayState, resetScroll } = callbacks;

    function isTrayAlwaysOn() {
        const config = game.settings.get("action-pack-enhanced", "tray-display");
        return config === "always";
    }

    game.settings.register(
        "action-pack-enhanced",
        "tray-display",
        {
            name: "action-pack-enhanced.settings.tray-display",
            hint: "action-pack-enhanced.settings.tray-display-hint",
            scope: "client",
            config: true,
            default: "auto",
            choices: {
                auto: "action-pack-enhanced.settings.tray-display-auto",
                toggle: "action-pack-enhanced.settings.tray-display-toggle",
                selected: "action-pack-enhanced.settings.tray-display-selected",
                always: "action-pack-enhanced.settings.tray-display-always"
            },
            type: String,
            onChange: () => {
                ui.controls.initialize();
                updateTrayState();
            }
        }
    );

    game.settings.register(
        "action-pack-enhanced",
        "assume-default-character",
        {
            name: "action-pack-enhanced.settings.assume-default-character",
            hint: "action-pack-enhanced.settings.assume-default-character-hint",
            scope: "client",
            config: true,
            default: true,
            type: Boolean,
            onChange: () => updateTrayState()
        }
    );

    game.settings.register(
        "action-pack-enhanced",
        "icon-size",
        {
            name: "action-pack-enhanced.settings.icon-size",
            scope: "client",
            config: true,
            default: "medium",
            choices: {
                small: "action-pack-enhanced.settings.icon-size-small",
                medium: "action-pack-enhanced.settings.icon-size-medium",
                large: "action-pack-enhanced.settings.icon-size-large"
            },
            type: String,
            onChange: () => updateTray()
        }
    );

    game.settings.register(
        "action-pack-enhanced",
        "tray-size",
        {
            name: "action-pack-enhanced.settings.tray-size",
            scope: "client",
            config: true,
            default: "large",
            choices: {
                small: "action-pack-enhanced.settings.tray-size-small",
                medium: "action-pack-enhanced.settings.tray-size-medium",
                large: "action-pack-enhanced.settings.tray-size-large"
            },
            type: String,
            onChange: () => updateTray()
        }
    );

    game.settings.register(
        "action-pack-enhanced",
        "skill-mode",
        {
            name: "action-pack-enhanced.settings.skill-mode",
            hint: "action-pack-enhanced.settings.skill-mode-hint",
            scope: "client",
            config: true,
            default: "dropdown",
            choices: {
                dropdown: "action-pack-enhanced.settings.skill-mode-dropdown",
                append: "action-pack-enhanced.settings.skill-mode-append"
            },
            type: String,
            onChange: () => updateTray()
        }
    );

    game.settings.register(
        "action-pack-enhanced",
        "show-xp-info",
        {
            name: "action-pack-enhanced.settings.show-xp-info",
            hint: "action-pack-enhanced.settings.show-xp-info-hint",
            scope: "client",
            config: true,
            default: true,
            type: Boolean,
            onChange: () => updateTray()
        }
    );

    game.settings.register(
        "action-pack-enhanced",
        "show-spell-dots",
        {
            name: "action-pack-enhanced.settings.show-spell-dots",
            scope: "client",
            config: true,
            default: true,
            type: Boolean,
            onChange: () => updateTray()
        }
    );

    game.settings.register(
        "action-pack-enhanced",
        "show-spell-uses",
        {
            name: "action-pack-enhanced.settings.show-spell-uses",
            scope: "client",
            config: true,
            default: true,
            type: Boolean,
            onChange: () => updateTray()
        }
    );

    game.settings.register(
        "action-pack-enhanced",
        "show-no-uses",
        {
            name: "action-pack-enhanced.settings.show-no-uses",
            scope: "client",
            config: true,
            default: false,
            type: Boolean,
            onChange: () => updateTray()
        }
    );

    game.settings.register(
        "action-pack-enhanced",
        "sort-alphabetic",
        {
            name: "action-pack-enhanced.settings.sort-alphabetic",
            scope: "client",
            config: true,
            default: false,
            type: Boolean,
            onChange: () => updateTray()
        }
    );

    game.settings.register(
        "action-pack-enhanced",
        "show-unprepared-cantrips",
        {
            name: "action-pack-enhanced.settings.show-unprepared-cantrips",
            scope: "client",
            config: true,
            default: false,
            type: Boolean,
            onChange: () => updateTray()
        }
    );

    game.settings.register(
        "action-pack-enhanced",
        "show-unprepared-spells",
        {
            name: "action-pack-enhanced.settings.show-unprepared-spells",
            scope: "client",
            config: true,
            default: false,
            type: Boolean,
            onChange: () => updateTray()
        }
    );

    game.settings.register(
        "action-pack-enhanced",
        "show-weapon-mastery",
        {
            name: "action-pack-enhanced.settings.show-weapon-mastery",
            hint: "action-pack-enhanced.settings.show-weapon-mastery-hint",
            scope: "client",
            config: true,
            default: false,
            type: Boolean,
            onChange: () => updateTray()
        }
    );

    game.settings.register(
        "action-pack-enhanced",
        "use-control-button",
        {
            name: "action-pack-enhanced.settings.use-control-button",
            scope: "client",
            config: true,
            default: true,
            type: Boolean,
            onChange: () => window.location.reload()
        }
    );

    game.keybindings.register("action-pack-enhanced", "toggle-tray", {
        name: "action-pack-enhanced.keybindings.toggle-tray",
        editable: [
            { key: "KeyE", modifiers: [] }
        ],
        onDown: (ctx) => {
            if (!isTrayAlwaysOn()) {
                $('#ape-app').toggleClass("is-open");
                $('#ape-app .ape-skill-container').removeClass("is-open");
            }
        }
    });

    game.keybindings.register("action-pack-enhanced", "toggle-skills", {
        name: "action-pack-enhanced.keybindings.toggle-skills",
        hint: "action-pack-enhanced.keybindings.toggle-skills-hint",
        editable: [
            { key: "KeyK", modifiers: [] }
        ],
        onDown: (ctx) => {
            if (game.settings.get("action-pack-enhanced", "skill-mode") === "dropdown") {
                const wasSkillsOpen = $('#ape-app .ape-skill-container').hasClass("is-open");
                if ($('#ape-app').hasClass("is-open")) {
                    $('#ape-app .ape-skill-container').toggleClass("is-open");
                } else {
                    $('#ape-app').toggleClass("is-open");
                    $('#ape-app .ape-skill-container').addClass("is-open");
                }

                if (!wasSkillsOpen) {
                    if (resetScroll) resetScroll();
                    const container = $('.ape-container');
                    if (container.length) {
                        container[0].scrollTop = 0;
                    }
                }
            } else {
                if (!$('#ape-app').hasClass("is-open")) {
                    $('#ape-app').toggleClass("is-open");
                }
                $('.ape-container')[0].scrollTop = $('#ape-app .ape-skill-container').offset().top;
            }
        }
    });
}
