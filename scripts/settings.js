export function registerSettings(callbacks) {
    const { updateTray, updateTrayState, resetScroll } = callbacks;

    function isTrayAlwaysOn() {
        const config = game.settings.get("action-pack", "tray-display");
        return config === "always";
    }

    game.settings.register(
        "action-pack",
        "tray-display",
        {
            name: "action-pack.settings.tray-display",
            hint: "action-pack.settings.tray-display-hint",
            scope: "client",
            config: true,
            default: "auto",
            choices: {
                auto: "action-pack.settings.tray-display-auto",
                toggle: "action-pack.settings.tray-display-toggle",
                selected: "action-pack.settings.tray-display-selected",
                always: "action-pack.settings.tray-display-always"
            },
            type: String,
            onChange: () => {
                ui.controls.initialize();
                updateTrayState();
            }
        }
    );

    game.settings.register(
        "action-pack",
        "assume-default-character",
        {
            name: "action-pack.settings.assume-default-character",
            hint: "action-pack.settings.assume-default-character-hint",
            scope: "client",
            config: true,
            default: true,
            type: Boolean,
            onChange: () => updateTrayState()
        }
    );

    game.settings.register(
        "action-pack",
        "icon-size",
        {
            name: "action-pack.settings.icon-size",
            scope: "client",
            config: true,
            default: "medium",
            choices: {
                small: "action-pack.settings.icon-size-small",
                medium: "action-pack.settings.icon-size-medium",
                large: "action-pack.settings.icon-size-large"
            },
            type: String,
            onChange: () => updateTray()
        }
    );

    game.settings.register(
        "action-pack",
        "tray-size",
        {
            name: "action-pack.settings.tray-size",
            scope: "client",
            config: true,
            default: "large",
            choices: {
                small: "action-pack.settings.tray-size-small",
                medium: "action-pack.settings.tray-size-medium",
                large: "action-pack.settings.tray-size-large"
            },
            type: String,
            onChange: () => updateTray()
        }
    );

    game.settings.register(
        "action-pack",
        "skill-mode",
        {
            name: "action-pack.settings.skill-mode",
            hint: "action-pack.settings.skill-mode-hint",
            scope: "client",
            config: true,
            default: "dropdown",
            choices: {
                dropdown: "action-pack.settings.skill-mode-dropdown",
                append: "action-pack.settings.skill-mode-append"
            },
            type: String,
            onChange: () => updateTray()
        }
    );

    game.settings.register(
        "action-pack",
        "show-spell-dots",
        {
            name: "action-pack.settings.show-spell-dots",
            scope: "client",
            config: true,
            default: true,
            type: Boolean,
            onChange: () => updateTray()
        }
    );

    game.settings.register(
        "action-pack",
        "show-no-uses",
        {
            name: "action-pack.settings.show-no-uses",
            scope: "client",
            config: true,
            default: false,
            type: Boolean,
            onChange: () => updateTray()
        }
    );

    game.settings.register(
        "action-pack",
        "sort-alphabetic",
        {
            name: "action-pack.settings.sort-alphabetic",
            scope: "client",
            config: true,
            default: false,
            type: Boolean,
            onChange: () => updateTray()
        }
    );

    game.settings.register(
        "action-pack",
        "show-unprepared-cantrips",
        {
            name: "action-pack.settings.show-unprepared-cantrips",
            scope: "client",
            config: true,
            default: false,
            type: Boolean,
            onChange: () => updateTray()
        }
    );

    game.settings.register(
        "action-pack",
        "use-control-button",
        {
            name: "action-pack.settings.use-control-button",
            scope: "client",
            config: true,
            default: true,
            type: Boolean,
            onChange: () => window.location.reload()
        }
    );

    game.keybindings.register("action-pack", "toggle-tray", {
        name: "action-pack.keybindings.toggle-tray",
        editable: [
            { key: "KeyE", modifiers: [] }
        ],
        onDown: (ctx) => {
            if (!isTrayAlwaysOn()) {
                $('#action-pack').toggleClass("is-open");
                $('#action-pack .action-pack__skill-container').removeClass("is-open");
            }
        }
    });

    game.keybindings.register("action-pack", "toggle-skills", {
        name: "action-pack.keybindings.toggle-skills",
        hint: "action-pack.keybindings.toggle-skills-hint",
        editable: [
            { key: "KeyK", modifiers: [] }
        ],
        onDown: (ctx) => {
            if (game.settings.get("action-pack", "skill-mode") === "dropdown") {
                const wasSkillsOpen = $('#action-pack .action-pack__skill-container').hasClass("is-open");
                if ($('#action-pack').hasClass("is-open")) {
                    $('#action-pack .action-pack__skill-container').toggleClass("is-open");
                } else {
                    $('#action-pack').toggleClass("is-open");
                    $('#action-pack .action-pack__skill-container').addClass("is-open");
                }

                if (!wasSkillsOpen) {
                    if (resetScroll) resetScroll();
                    const container = $('.action-pack__container');
                    if (container.length) {
                        container[0].scrollTop = 0;
                    }
                }
            } else {
                if (!$('#action-pack').hasClass("is-open")) {
                    $('#action-pack').toggleClass("is-open");
                }
                $('.action-pack__container')[0].scrollTop = $('#action-pack .action-pack__skill-container').offset().top;
            }
        }
    });
}
