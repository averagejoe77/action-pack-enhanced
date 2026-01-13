export class ActionPackInteractions {
    constructor(updateTrayCallback, getActiveActorsCallback) {
        this.updateTray = updateTrayCallback;
        this.getActiveActors = getActiveActorsCallback;
        this.scrollPosition = {};
    }

    getCallbacks() {
        return {
            onEndTurn: (e) => {
                game.combat?.nextTurn();
            },
            onScroll: (e) => {
                const activeActors = this.getActiveActors();
                if (activeActors.length == 1) {
                    const uuid = activeActors[0].uuid;
                    const scroll = e.currentTarget.scrollTop;
                    const showSkills = $('.action-pack__skill-container').hasClass("is-open");
                    this.scrollPosition = { uuid, scroll, showSkills };
                } else {
                    this.scrollPosition = {};
                }
            },
            onActorSheet: (e, actor) => {
                if (actor) {
                    if (!actor.sheet.rendered) actor.sheet.render(true);
                    else actor.sheet.close();
                }
            },
            onHpChange: (e, actor) => {
                const newVal = parseInt(e.target.value);
                if (!isNaN(newVal)) {
                    actor.update({ "system.attributes.hp.value": newVal });
                }
            },
            onTempChange: (e, actor) => {
                const newVal = parseInt(e.target.value);
                if (!isNaN(newVal)) {
                    actor.update({ "system.attributes.hp.temp": newVal });
                }
            },
            onRest: (e, actor) => {
                const type = e.currentTarget.dataset.type;
                type === "long" ? actor.longRest() : actor.shortRest();
            },
            onInitiative: (e, actor) => {
                const combatantId = game.combat?.combatants.find(c => c.actor === actor).id;
                game.combat?.rollInitiative([combatantId]);
            },
            onDeathSavingThrow: (e, actor) => {
                actor.rollDeathSave({ event: e });
            },
            onAbilityCheck: (e, actor, abilityId) => {
                actor.rollAbilityCheck({ event: e, ability: abilityId });
            },
            onAbilitySave: (e, actor, abilityId) => {
                actor.rollSavingThrow({ event: e, ability: abilityId });
            },
            onToggleSkills: (e) => {
                e.target.closest('.action-pack__skill-container').classList.toggle("is-open");
            },
            onSkillRoll: (e, actor, skillId, fastForward) => {
                return actor.rollSkill({ event: e, skill: skillId }, { fastForward });
            },
            onSpellSlotAdjust: (e, actor, groupName, slotIndex) => {
                const slot = slotIndex + 1;
                const current = actor.system.spells?.[groupName]?.value;
                if (current !== undefined) {
                    const key = `system.spells.${groupName}.value`;
                    const newValue = current !== slot ? slot : slot - 1;
                    actor.update({ [key]: newValue });
                }
            },
            onItemRoll: (e, item) => {
                e.preventDefault();
                if (item) {
                    if (!game.modules.get("wire")?.active && game.modules.get("itemacro")?.active && game.settings.get("itemacro", "defaultmacro")) {
                        if (item.hasMacro()) {
                            item.executeMacro();
                            return false;
                        }
                    }
                    item.use({}, e);
                }
                return false;
            },
            onItemClick: async (e, item, liElement) => {
                if (e.which == 2) { // Middle click -> Sheet
                    e.preventDefault();
                    if (item) item.sheet.render(true);
                    return false;
                }

                if (e.shiftKey || e.which == 3) { // Shift or Right click -> Roll
                    e.preventDefault();
                    this.getCallbacks().onItemRoll(e, item);
                    return;
                }

                // Left Click -> Expand Summary
                e.preventDefault();
                const li = $(liElement);
                if (li.hasClass("expanded")) {
                    let summary = li.children(".item-summary");
                    summary.slideUp(200, () => summary.remove());
                } else {
                    const desc = await this.buildItemDescription(item);
                    li.append(desc);
                    desc.slideDown(200);
                }
                li.toggleClass("expanded");
            },
            onItemHoverIn: (e, item) => {
                Hooks.callAll("actorItemHoverIn", item, $(e.currentTarget));
            },
            onItemHoverOut: (e, item) => {
                Hooks.callAll("actorItemHoverOut", item, $(e.currentTarget));
            },
            onItemRecharge: (e, item) => {
                e.preventDefault();
                item.rollRecharge();
                return false;
            }
        };
    }

    async buildItemDescription(item) {
        const chatData = await item.getChatData({ secrets: item.actor.isOwner });
        let activationType = item.system?.activation?.type !== null ? item.system?.activation?.type : "";
        let activationValue = item.system?.activation?.value !== null ? item.system?.activation?.value : "";

        let rangeValue = item.system?.range?.value !== null ? item.system?.range?.value : "";
        let rangeUnits = item.system?.range?.units !== null ? item.system?.range?.units : "";

        let durationValue = item.system?.duration?.value !== null ? item.system?.duration?.value : "";
        let durationUnits = item.system?.duration?.units !== null ? item.system?.duration?.units : "";

        let castingTime;
        if (activationValue === "") {
            castingTime = activationType.charAt(0).toUpperCase() + activationType.slice(1);
        } else if (activationValue && activationType) {
            castingTime = `${activationValue} ${activationType.charAt(0).toUpperCase() + activationType.slice(1)}`;
        }

        let range = '';
        if (rangeValue === "") {
            range = rangeUnits;
        } else if (rangeValue && rangeUnits) {
            range = `${rangeValue} ${rangeUnits}`;
        }   

        let duration = '';
        if (durationValue === "") {
            duration = durationUnits === "inst" ? "Instantaneous" : durationUnits.charAt(0).toUpperCase() + durationUnits.slice(1);
        } else if (durationValue && durationUnits) {
            duration = `${durationValue} ${durationUnits}`;
        }

        let description = $(`<div class="item-summary">${chatData.description}</div>`);
        if (duration) description.prepend(`<p><strong>Duration:</strong> ${duration}</p>`);
        if (range) description.prepend(`<p><strong>Range:</strong> ${range}</p>`);
        if (castingTime) description.prepend(`<p><strong>Casting Time:</strong> ${castingTime}</p>`);
        
        return description;
    }
}
