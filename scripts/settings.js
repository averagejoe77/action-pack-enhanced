export function registerSettings(callbacks) {
    const { updateTray, updateTrayState, resetScroll } = callbacks;

    function isTrayAlwaysOn() {
        const config = game.settings.get("ape", "tray-display");
        return config === "always";
    }

    game.settings.register(
        "ape",
        "tray-display",
        {
            name: "ape.settings.tray-display",
            hint: "ape.settings.tray-display-hint",
            scope: "client",
            config: true,
            default: "auto",
            choices: {
                auto: "ape.settings.tray-display-auto",
                toggle: "ape.settings.tray-display-toggle",
                selected: "ape.settings.tray-display-selected",
                always: "ape.settings.tray-display-always"
            },
            type: String,
            onChange: () => {
                ui.controls.initialize();
                updateTrayState();
            }
        }
    );

    game.settings.register(
        "ape",
        "assume-default-character",
        {
            name: "ape.settings.assume-default-character",
            hint: "ape.settings.assume-default-character-hint",
            scope: "client",
            config: true,
            default: true,
            type: Boolean,
            onChange: () => updateTrayState()
        }
    );

    game.settings.register(
        "ape",
        "icon-size",
        {
            name: "ape.settings.icon-size",
            scope: "client",
            config: true,
            default: "medium",
            choices: {
                small: "ape.settings.icon-size-small",
                medium: "ape.settings.icon-size-medium",
                large: "ape.settings.icon-size-large"
            },
            type: String,
            onChange: () => updateTray()
        }
    );

    game.settings.register(
        "ape",
        "tray-size",
        {
            name: "ape.settings.tray-size",
            scope: "client",
            config: true,
            default: "large",
            choices: {
                small: "ape.settings.tray-size-small",
                medium: "ape.settings.tray-size-medium",
                large: "ape.settings.tray-size-large"
            },
            type: String,
            onChange: () => updateTray()
        }
    );

    game.settings.register(
        "ape",
        "skill-mode",
        {
            name: "ape.settings.skill-mode",
            hint: "ape.settings.skill-mode-hint",
            scope: "client",
            config: true,
            default: "dropdown",
            choices: {
                dropdown: "ape.settings.skill-mode-dropdown",
                append: "ape.settings.skill-mode-append"
            },
            type: String,
            onChange: () => updateTray()
        }
    );

    game.settings.register(
        "ape",
        "show-spell-dots",
        {
            name: "ape.settings.show-spell-dots",
            scope: "client",
            config: true,
            default: true,
            type: Boolean,
            onChange: () => updateTray()
        }
    );

    game.settings.register(
        "ape",
        "show-spell-uses",
        {
            name: "ape.settings.show-spell-uses",
            scope: "client",
            config: true,
            default: true,
            type: Boolean,
            onChange: () => updateTray()
        }
    );

    game.settings.register(
        "ape",
        "show-no-uses",
        {
            name: "ape.settings.show-no-uses",
            scope: "client",
            config: true,
            default: false,
            type: Boolean,
            onChange: () => updateTray()
        }
    );

    game.settings.register(
        "ape",
        "sort-alphabetic",
        {
            name: "ape.settings.sort-alphabetic",
            scope: "client",
            config: true,
            default: false,
            type: Boolean,
            onChange: () => updateTray()
        }
    );

    game.settings.register(
        "ape",
        "show-unprepared-cantrips",
        {
            name: "ape.settings.show-unprepared-cantrips",
            scope: "client",
            config: true,
            default: false,
            type: Boolean,
            onChange: () => updateTray()
        }
    );

    game.settings.register(
        "ape",
        "use-control-button",
        {
            name: "ape.settings.use-control-button",
            scope: "client",
            config: true,
            default: true,
            type: Boolean,
            onChange: () => window.location.reload()
        }
    );

    game.keybindings.register("ape", "toggle-tray", {
        name: "ape.keybindings.toggle-tray",
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

    game.keybindings.register("ape", "toggle-skills", {
        name: "ape.keybindings.toggle-skills",
        hint: "ape.keybindings.toggle-skills-hint",
        editable: [
            { key: "KeyK", modifiers: [] }
        ],
        onDown: (ctx) => {
            if (game.settings.get("ape", "skill-mode") === "dropdown") {
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
