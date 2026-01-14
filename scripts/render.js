export class ActionPackRenderer {
    constructor(callbacks) {
        this.callbacks = callbacks;
    }

    render(container, data) {
        if (container.querySelector('.action-pack__actors')) {
            this.update(container, data);
        } else {
            this._fullRender(container, data);
        }
    }

    _fullRender(container, data) {
        // Clear container
        container.innerHTML = '';
        // Preserve existing state classes
        const existingClasses = container.className;
        const isOpen = existingClasses.includes('is-open');
        const isAlwaysOn = existingClasses.includes('always-on');
        const isCurrentCombatant = existingClasses.includes('is-current-combatant');
        
        container.className = `action-pack__container ${data.iconSize}`;
        if (isOpen) container.classList.add('is-open');
        if (isAlwaysOn) container.classList.add('always-on');
        if (isCurrentCombatant) container.classList.add('is-current-combatant');
        if (data.traySize) container.classList.add(data.traySize);

        const actorsDiv = document.createElement('div');
        actorsDiv.className = 'action-pack__actors';

        if (!data.actors || data.actors.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'action-pack__empty-tray';
            const icon = document.createElement('i');
            icon.className = 'fas fa-dice-d20';
            emptyDiv.appendChild(icon);
            actorsDiv.appendChild(emptyDiv);
        } else {
            data.actors.forEach(actorData => {
                const actorNode = this.createActorNode(actorData, data);
                actorsDiv.appendChild(actorNode);
            });
        }
        
        container.appendChild(actorsDiv);

        const endTurnDiv = document.createElement('div');
        endTurnDiv.className = 'action-pack__end-turn';
        endTurnDiv.textContent = game.i18n.localize("action-pack-enhanced.end-turn");
        endTurnDiv.addEventListener('click', this.callbacks.onEndTurn);

        container.appendChild(endTurnDiv);

        // Restore scroll position
        if (data.actors.length === 1 && data.scrollPosition && data.scrollPosition.uuid === data.actors[0].actor.uuid) {
            const scrollContainer = container.querySelector('.action-pack__container');
            if (scrollContainer) {
                scrollContainer.scrollTop = data.scrollPosition.scroll || 0;
            }
        }
        
        // Bind scroll event
        container.addEventListener('scroll', this.callbacks.onScroll);
    }

    createActorNode(actorData, globalData) {
        const actorDiv = document.createElement('div');
        actorDiv.className = 'action-pack__actor';
        actorDiv.dataset.actorUuid = actorData.actor.uuid;

		const actorHeader = document.createElement('div');
		actorHeader.className = 'action-pack__actor-header';

        // Name
        const h1 = document.createElement('h1');
        const aName = document.createElement('a');
        aName.className = 'action-pack__actor-name';
        aName.textContent = actorData.name.split(' ')[0];
        aName.addEventListener('click', (e) => this.callbacks.onActorSheet(e, actorData.actor));

        h1.appendChild(aName);

        // ac
        const acNode = this.createAcNode(actorData.actor);
        h1.appendChild(acNode);
        actorHeader.appendChild(h1);

		// actor meta data and functions
		const actorMeta = this.createActorMeta(actorData.actor);
		actorHeader.appendChild(actorMeta);

		actorDiv.appendChild(actorHeader);

		// death saving throws
		const actorHp = actorData.actor.system.attributes.hp.value;
		// get the actor type
		const type = actorData.actor.type;
		if(actorHp <= 0 && type === "character") {
			// show the death saving throw ui
			const deathSavingThrowsHtml = this.createDeathSavingThrows(actorData.actor);
			actorDiv.appendChild(deathSavingThrowsHtml);
		}

        // Initiative
        if (actorData.needsInitiative) {
            const initLink = document.createElement('a');
            initLink.className = 'action-pack__initiative flexrow';
            initLink.innerHTML = `<i class="flex0 fas fa-swords action-pack__initiative-icon"></i><div>${game.i18n.localize("action-pack-enhanced.roll-initiative")}</div>`;
            initLink.addEventListener('click', (e) => this.callbacks.onInitiative(e, actorData.actor));
            actorDiv.appendChild(initLink);
        }

        // Abilities
        const abilitiesDiv = this.createAbilities(actorData.actor, globalData.abilityColumns);
        actorDiv.appendChild(abilitiesDiv);

        // Skills (Dropdown)
        if (actorData.skillMode === "dropdown") {
            actorDiv.appendChild(this.createSkillContainer(actorData, true));
        }

        // Sections
        if (actorData.sections) {
            if (actorData.sections.equipped) actorDiv.appendChild(this.createCategoryNode(actorData.sections.equipped, globalData, actorData.actor, 'equipped'));
            if (actorData.sections.feature) actorDiv.appendChild(this.createCategoryNode(actorData.sections.feature, globalData, actorData.actor, 'feature'));
            if (actorData.sections.spell) actorDiv.appendChild(this.createCategoryNode(actorData.sections.spell, globalData, actorData.actor, 'spell'));
            if (actorData.sections.inventory) actorDiv.appendChild(this.createCategoryNode(actorData.sections.inventory, globalData, actorData.actor, 'inventory'));
            if (actorData.sections.passive) actorDiv.appendChild(this.createCategoryNode(actorData.sections.passive, globalData, actorData.actor, 'passive'));
        }

        // Skills (Append)
        if (actorData.skillMode === "append") {
            actorDiv.appendChild(this.createSkillContainer(actorData, false));
        }

        return actorDiv;
    }

	generateRaceClassDisplay(itemTypes) {
		// in the format (Human - Wizard [Abjurer], Fighter [Defense])
		let raceClass = {};
		let races = itemTypes.race;
		let classes = itemTypes.class;
		let subClasses = itemTypes.subclass;
		
		if (classes.length === subClasses.length) {
            let obj = {race: races[0].name, classes: []};
			for (let i = 0; i < classes.length; i++) {
				obj.classes[i] = {name: classes[i].name, level: classes[i].system.levels, subclass: {name: subClasses[i].name}};
			}
			raceClass = obj;
		} else {
            let obj = {race: races[0].name, classes: []};
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
			raceClassText += `<span class="action-pack__actor-class">${raceClass.classes[i].name}(${raceClass.classes[i].level})</span>`;
			if (raceClass.classes[i].subclass.name !== '' ) {
				raceClassText += `<span class="action-pack__actor-subclass"> - ${raceClass.classes[i].subclass.name}</span>`;
			}
            if(i < raceClass.classes.length - 1) {
                raceClassText += `, `;
            }
        }
        return raceClassText;
	}

    createActorMeta(actor) {
		const metaDiv = document.createElement('div');
		metaDiv.className = 'action-pack__actor-meta';

		// append the actor type
		if(actor.type === "character") {
			const aRaceClass = document.createElement('div');
			aRaceClass.className = 'action-pack__actor-race-class';
			aRaceClass.innerHTML = this.generateRaceClassDisplay(actor.itemTypes);
			metaDiv.appendChild(aRaceClass);
		}

		// short / long rest buttons
		const restButtons = this.createRestButtons(actor);
		metaDiv.appendChild(restButtons);

		// hp
		const hp = actor.system.attributes.hp;

		const hpWrapper = this.createHpBar(hp, actor);

		const tempWrapper = this.createTempBar(hp, actor);
		hpWrapper.appendChild(tempWrapper);

		metaDiv.appendChild(hpWrapper);

		return metaDiv;
	}

	createRestButtons(actor) {
		const restButtons = document.createElement('div');
		restButtons.className = 'action-pack__actor-rest-buttons';
		restButtons.innerHTML = `<button class="action-pack__actor-rest-button" data-type="short"><span class="fas fa-fork-knife"></span></button><button class="action-pack__actor-rest-button" data-type="long"><span class="fas fa-tent"></span></button>`;
		const buttons = restButtons.querySelectorAll('button');
		buttons.forEach(button => {
			button.addEventListener('click', (e) => this.callbacks.onRest(e, actor));
		});
		return restButtons;
	}

    createHpBar(hp, actor) {
        const hpWrapper = document.createElement('div');
		hpWrapper.className = 'action-pack__actor-hp-wrapper';

		const hpDiv = document.createElement('div');
		hpDiv.className = 'action-pack__actor-hp';
		hpDiv.dataset.hpValue = hp.value;
		hpDiv.dataset.hpMax = hp.max;
		hpDiv.style.setProperty('--bar-percent', `${(hp.value / hp.max) * 100}%`);
		hpDiv.innerHTML = `<span class="action-pack__actor-hp-text"><span class="action-pack__actor-hp-display"><span class="action-pack__actor-hp-value">${hp.value}</span><span class="action-pack__actor-hp-separator">/</span><span class="action-pack__actor-hp-max">${hp.max}</span></span><input type="text" class="action-pack__actor-hp-input" value="${hp.value}" style="display:none"></span>`;
		
        const textContainer = hpDiv.querySelector('.action-pack__actor-hp-text');
        const display = hpDiv.querySelector('.action-pack__actor-hp-display');
        const input = hpDiv.querySelector('.action-pack__actor-hp-input');

        textContainer.addEventListener('click', () => {
            if (input.style.display === 'none') {
                display.style.display = 'none';
                input.style.display = 'inline-block';
                input.focus();
                input.select();
            }
        });

        const finishEdit = () => {
            input.style.display = 'none';
            display.removeAttribute('style');
        };

        input.addEventListener('change', (e) => {
            this.callbacks.onHpChange(e, actor);
        });

        input.addEventListener('blur', finishEdit);

        input.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				input.blur();
			}
        });

        hpWrapper.appendChild(hpDiv);

		return hpWrapper;
    }

	createTempBar(hp, actor) {
		const tempDiv = document.createElement('div');
		tempDiv.className = 'action-pack__actor-temp';
		tempDiv.innerHTML = `<span class="action-pack__actor-temp-display">${hp.temp || 0}</span><input type="text" class="action-pack__actor-temp-input" value="${hp.temp || 0}" style="display:none">`;
		
		const display = tempDiv.querySelector('.action-pack__actor-temp-display');
        const input = tempDiv.querySelector('.action-pack__actor-temp-input');

        display.addEventListener('click', () => {
            if (input.style.display === 'none') {
                display.style.display = 'none';
                input.style.display = 'inline-block';
                input.focus();
                input.select();
            }
        });

        const finishEdit = () => {
            input.style.display = 'none';
            display.removeAttribute('style');
        };

        input.addEventListener('change', (e) => {
            this.callbacks.onTempChange(e, actor);
        });

        input.addEventListener('blur', finishEdit);

        input.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				input.blur();
			}
        });

		return tempDiv;
	}

    createAcNode(actor) {
        const ac = document.createElement('span');
		ac.className = 'action-pack__actor-ac';
		const acIcon = document.createElement('img');
		acIcon.className = 'action-pack__actor-ac-icon';
		acIcon.src = 'modules/action-pack-enhanced/images/ac-icon.svg';
        
        const val = actor.system.attributes.ac.value;
        const displayHtml = `<span class="action-pack__actor-ac-display">${val}</span>`;
        
		ac.innerHTML = `${acIcon.outerHTML}${displayHtml}`;
        
        return ac;
    }

    createCategoryNode(section, globalData, actor, sectionId) {
        const div = document.createElement('div');
        div.className = 'action-pack__category';
        div.dataset.sectionId = sectionId;

        if (section.title) {
            const h2 = document.createElement('h2');
            h2.textContent = game.i18n.localize(section.title);
            div.appendChild(h2);
        }

        if (section.items && section.items.length > 0) {
            const ul = this.createItemList(section.items);
            div.appendChild(ul);
        }

        if (section.groups) {
            Object.entries(section.groups).forEach(([groupName, group]) => {
                this.appendItemGroup(div, group, groupName, globalData.showSpellDots, section.title.includes("spell"), actor); 
            });
        }

        return div;
    }

    createAbilities(actor, abilityColumns) {
        const div = document.createElement('div');
        div.className = 'action-pack__abilities';

        abilityColumns.forEach(column => {
            const colDiv = document.createElement('div');
            colDiv.className = 'flex-col';

            // Header
            const headerSpan = document.createElement('span');
            headerSpan.className = 'action-pack__ability';
            headerSpan.innerHTML = `<span class="action-pack__ability-label">&nbsp;</span><span class="action-pack__ability-hdr">check</span><span class="action-pack__ability-hdr">save</span>`;
            colDiv.appendChild(headerSpan);

            column.forEach(col => {
                const details = actor.system.abilities[col.key];
                const span = document.createElement('span');
                span.className = 'action-pack__ability';

                const label = document.createElement('span');
                label.className = 'action-pack__ability-label';
                label.textContent = col.key;
                span.appendChild(label);

                // Check
                const checkA = document.createElement('a');
                checkA.className = 'fas fa-dice-d20 action-pack__ability-check';
                checkA.title = `${col.label} check`;
                checkA.dataset.ability = col.key;
                const checkSpan = document.createElement('span');
                checkSpan.className = 'action-pack__ability-text';
                checkSpan.textContent = this.numberFormat(details.mod);
                checkA.appendChild(checkSpan);
                checkA.addEventListener('click', (e) => this.callbacks.onAbilityCheck(e, actor, col.key));
                span.appendChild(checkA);

                // Save
                const saveA = document.createElement('a');
                saveA.className = 'fas fa-dice-d20 action-pack__ability-save';
                saveA.title = `${col.label} saving throw`;
                saveA.dataset.ability = col.key;
                const saveSpan = document.createElement('span');
                saveSpan.className = 'action-pack__ability-text';
                saveSpan.textContent = this.numberFormat(details.save.value);
                saveA.appendChild(saveSpan);
                saveA.addEventListener('click', (e) => this.callbacks.onAbilitySave(e, actor, col.key));
                span.appendChild(saveA);

                colDiv.appendChild(span);
            });
            div.appendChild(colDiv);
        });

        return div;
    }

    createSkillContainer(actorData, isDropdown) {
        const container = document.createElement('div');
        container.className = `action-pack__skill-container ${actorData.skillMode}`;
        if (actorData.showSkills) container.classList.add('is-open');

        if (isDropdown) {
            const header = document.createElement('a');
            header.className = 'action-pack__skill-header';
            header.innerHTML = `Skills <i class="fas fa-caret-up"></i>`;
            header.addEventListener('click', (e) => this.callbacks.onToggleSkills(e));
            container.appendChild(header);
        }

        const skillsDiv = document.createElement('div');
        skillsDiv.className = 'action-pack__skills';

        const skills = actorData.skills; // CONFIG.DND5E.skills
        const actorSkills = actorData.actor.system.skills;

        Object.keys(actorSkills).forEach(key => {
            const skill = actorSkills[key];
            const config = skills[key];
            if (!config) return;

            const row = document.createElement('a');
            row.className = 'action-pack__skill-row flexrow';
            if (skill.proficient >= 1) row.classList.add('proficient');
            row.dataset.skill = key;

            // Proficiency Icon
            const iconDiv = document.createElement('div');
            iconDiv.className = 'flex0';
            let iconClass = 'far fa-circle';
            if (skill.proficient === 0.5) iconClass = 'fas fa-adjust';
            else if (skill.proficient === 1) iconClass = 'fas fa-check';
            else if (skill.proficient === 2) iconClass = 'fas fa-check-double';
            iconDiv.innerHTML = `<i class="${iconClass}"></i>`;
            row.appendChild(iconDiv);

            // Label
            const labelDiv = document.createElement('div');
            labelDiv.className = 'action-pack__skill-label';
            const labelSpan = document.createElement('span');
            labelSpan.textContent = config.label;
            labelDiv.appendChild(labelSpan);
            row.appendChild(labelDiv);

            // Bonus
            const bonusDiv = document.createElement('div');
            bonusDiv.className = 'flex1 action-pack__skill-bonus';
            bonusDiv.textContent = this.numberFormat(skill.total);
            row.appendChild(bonusDiv);

            // Passive
            const passiveDiv = document.createElement('div');
            passiveDiv.className = 'flex1 action-pack__skill-passive';
            passiveDiv.textContent = `(${skill.passive})`;
            row.appendChild(passiveDiv);

            // Events
            row.addEventListener('click', (e) => this.callbacks.onSkillRoll(e, actorData.actor, key));
            row.addEventListener('contextmenu', (e) => this.callbacks.onSkillRoll(e, actorData.actor, key, true)); // fastForward

            skillsDiv.appendChild(row);
        });

        container.appendChild(skillsDiv);
        return container;
    }

    appendItemGroup(container, group, groupName, showSpellDots, isSpellSection, actor) {
        const hasItems = group.items && group.items.length > 0;
        const hasSlots = group.uses && group.uses.maximum && showSpellDots;
        
        if (hasItems || hasSlots) {
			const flexRow = document.createElement('div');
			flexRow.className = 'flexrow';
			
			const h3 = document.createElement('h3');
			const titleSpan = document.createElement('span');
			titleSpan.textContent = game.i18n.localize(group.title);
			h3.appendChild(titleSpan);

			// Dots
			if (group.uses && showSpellDots) {
				const dotsDiv = document.createElement('div');
				dotsDiv.className = 'group-dots';
				dotsDiv.dataset.groupName = groupName;
				
				for (let i = 0; i < group.uses.maximum; i++) {
					const isAvailable = i < group.uses.available;
					const dot = document.createElement('div');
					dot.className = `dot ${!isAvailable ? 'empty' : ''}`;
					dot.dataset.slot = i;
					
					dot.addEventListener('click', (e) => this.callbacks.onSpellSlotAdjust(e, actor, groupName, i));
					
					dotsDiv.appendChild(dot);
				}
				h3.appendChild(dotsDiv);
			}
			
			flexRow.appendChild(h3);

			// Uses text
			if (group.uses) {
				const usesDiv = document.createElement('div');
				usesDiv.className = 'group-uses';
				usesDiv.textContent = `${group.uses.available}/${group.uses.maximum}`;
				flexRow.appendChild(usesDiv);
			}

			container.appendChild(flexRow);

			if (hasItems) {
				const ul = this.createItemList(group.items);
				container.appendChild(ul);
			}
        }
    }

    createItemList(items) {
        const ul = document.createElement('ul');
        ul.className = 'action-pack__items';
        items.forEach(obj => { // obj is { item, uses }
            const li = this.createItemNode(obj);
            ul.appendChild(li);
        });
        return ul;
    }

    createItemNode({item, uses}) {
        const li = document.createElement('li');
        li.className = 'action-pack__item item';
        li.dataset.itemUuid = item.uuid;
        
        const div = document.createElement('div');
        div.className = 'item-name rollable flexrow';
        
        // Image
        const imgDiv = document.createElement('div');
        imgDiv.className = `item-image ${item.system.rarity || ''}`;
        imgDiv.style.backgroundImage = `url('${item.img}')`;
        imgDiv.innerHTML = '<i class="fa fa-dice-d20"></i>';
        imgDiv.addEventListener('mousedown', (e) => this.callbacks.onItemRoll(e, item));
        div.appendChild(imgDiv);

        // Header
        const h4 = document.createElement('h4');
        const nameSpan = document.createElement('span');
        nameSpan.className = `item-text ${item.system.rarity || ''}`;
        nameSpan.textContent = item.name;
        h4.appendChild(nameSpan);

        const isSpell = item.type === 'spell';
        const isInnate = item.system?.method === 'innate';
        if (uses && (!isSpell || isInnate)) {
			const usesText = document.createTextNode(` (${uses.available}${uses.maximum ? '/' + uses.maximum : ''})`);
			h4.appendChild(usesText);
        }
        div.appendChild(h4);

        const actor = item.parent;
        const canCastUnpreparedRituals = !!actor.itemTypes.feat.find(i => i.name === "Ritual Adept");
        // Flags
        const sys = item.system;
        
        if (sys.properties.has("ritual")) {
            const f = document.createElement('div');
            f.className = 'ritual flag';
            f.title = game.i18n.localize("action-pack-enhanced.flag.ritual-title");
            div.appendChild(f);
        }
        if (sys.properties.has("concentration")) {
            const f = document.createElement('div');
            f.className = 'concentration flag';
            f.title = game.i18n.localize("action-pack-enhanced.flag.concentration-title");
            div.appendChild(f);
        }
        
        if (sys.activation?.type === 'bonus') {
            const f = document.createElement('div');
            f.className = 'bonus flag';
            f.title = game.i18n.localize("action-pack-enhanced.flag.bonus-title");
            f.textContent = game.i18n.localize("action-pack-enhanced.flag.bonus");
            div.appendChild(f);
        }
        if (sys.activation?.type === 'reaction') {
            const f = document.createElement('div');
            f.className = 'reaction flag';
            f.title = game.i18n.localize("action-pack-enhanced.flag.reaction-title");
            f.textContent = game.i18n.localize("action-pack-enhanced.flag.reaction");
            div.appendChild(f);
        }
        if (sys.activation?.type === 'legendary') {
            const f = document.createElement('div');
            f.className = 'legendary flag';
            f.title = game.i18n.localize("action-pack-enhanced.flag.legendary-title");
            f.textContent = game.i18n.localize("action-pack-enhanced.flag.legendary");
            div.appendChild(f);
        }

        // Recharge
        if (sys.recharge?.value) {
            if (sys.recharge.charged) {
                const f = document.createElement('div');
                f.className = 'flag';
                f.innerHTML = '<i class="fas fa-bolt"></i>';
                div.appendChild(f);
            } else {
                const f = document.createElement('div');
                f.className = 'flag';
                const a = document.createElement('a');
                a.className = 'rollable item-recharge';
                a.innerHTML = `<i class="fas fa-dice-six"></i> ${sys.recharge.value}+`;
                a.addEventListener('mousedown', (e) => this.callbacks.onItemRecharge(e, item));
                f.appendChild(a);
                div.appendChild(f);
            }
        }

        // Unprepared
        if (sys.method === 'prepared' && !sys.prepared && sys.level !== 0 && !canCastUnpreparedRituals) {
            const f = document.createElement('div');
            f.className = 'unprepared flag';
            f.title = game.i18n.localize("action-pack-enhanced.flag.unprepared-title");
            div.appendChild(f);
        }

        // Bind Main Item Interactions
        div.addEventListener('mouseenter', (e) => this.callbacks.onItemHoverIn(e, item));
        div.addEventListener('mouseleave', (e) => this.callbacks.onItemHoverOut(e, item));
        h4.addEventListener('mousedown', (e) => this.callbacks.onItemClick(e, item, li));

        // Drag Handle
        const dragHandle = document.createElement('div');
        dragHandle.className = 'item-drag-handle';
        dragHandle.innerHTML = '<i class="fas fa-grip-vertical"></i>';
        dragHandle.draggable = true;
        dragHandle.title = game.i18n.localize("action-pack-enhanced.drag-to-target");
        
        dragHandle.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData("text/plain", JSON.stringify({
                type: "ActionPackItem",
                uuid: item.uuid,
                actionPack: true
            }));
            e.stopPropagation();
        });

        li.appendChild(div);
        li.appendChild(dragHandle);
        return li;
    }

	createDeathSavingThrows(actor) {
		const div = document.createElement('div');
		div.className = 'action-pack__death-saving';
		const deathFails = actor.system.attributes.death.failure;
		const deathSaves = actor.system.attributes.death.success;

		let failTemplate = '';
		for (let i = 0; i < 3; i++) {
			if (i < deathFails) {
				failTemplate += '<span class="action-pack__death-dot filled"><span class="fas fa-skull-crossbones"></span></span>';
			} else {
				failTemplate += '<span class="action-pack__death-dot"></span>';
			}
		}
		let saveTemplate = '';
		for (let i = 0; i < 3; i++) {
			if (i < deathSaves) {
				saveTemplate += '<span class="action-pack__death-dot filled"><span class="fas fa-check"></span></span>';
			} else {
				saveTemplate += '<span class="action-pack__death-dot"></span>';
			}
		}
		const template = `<span class="action-pack__death-throws failed">${failTemplate}</span> <span class="action-pack__death-icon"></span> <span class="action-pack__death-throws saved">${saveTemplate}</span>`;
		div.innerHTML = template;

		const icon = div.querySelector('.action-pack__death-icon');
        // Only bind if not dead/stabilized? Logic as before: active if fail/save < 3
		if(deathFails < 3 && deathSaves < 3) {
            icon.addEventListener('mousedown', (e) => this.callbacks.onDeathSavingThrow(e, actor));
            icon.style.cursor = 'pointer';
		} else {
            icon.style.cursor = 'default';
        }

		return div;
	}

    numberFormat(val) {
        if (val === undefined || val === null) return "0";
        const sign = val >= 0 ? '+' : '';
        return `${sign}${val}`;
    }

    update(container, data) {
        // Update Container Classes
        const existingClasses = container.className;
        const isOpen = existingClasses.includes('is-open');
        const isAlwaysOn = existingClasses.includes('always-on');
        const isCurrentCombatant = existingClasses.includes('is-current-combatant');

        container.className = `action-pack__container ${data.iconSize}`;
        if (isOpen) container.classList.add('is-open');
        if (isAlwaysOn) container.classList.add('always-on');
        if (isCurrentCombatant) container.classList.add('is-current-combatant');
        if (data.traySize) container.classList.add(data.traySize);

        let actorsDiv = container.querySelector('.action-pack__actors');
        if (!actorsDiv) {
            actorsDiv = document.createElement('div');
            actorsDiv.className = 'action-pack__actors';
            container.appendChild(actorsDiv);
        }

        // Handle Empty Tray State
        const emptyTray = actorsDiv.querySelector('.action-pack__empty-tray');
        if (data.actors && data.actors.length > 0) {
            if (emptyTray) emptyTray.remove();
        } else {
            if (!emptyTray) {
                const emptyDiv = document.createElement('div');
                emptyDiv.className = 'action-pack__empty-tray';
                const icon = document.createElement('i');
                icon.className = 'fas fa-dice-d20';
                emptyDiv.appendChild(icon);
                actorsDiv.appendChild(emptyDiv);
            }
            // If empty, we can skip node sync specifics as they will be removed below or essentially no-op
        }
        
        // Sync Actors
        const currentActorNodes = Array.from(actorsDiv.querySelectorAll('.action-pack__actor'));
        const newActorUuids = data.actors.map(a => a.actor.uuid);
        
        // Remove old
        currentActorNodes.forEach(node => {
            if (!newActorUuids.includes(node.dataset.actorUuid)) {
                node.remove();
            }
        });

        // Add/Update
        data.actors.forEach((actorData, index) => {
            let node = actorsDiv.querySelector(`.action-pack__actor[data-actor-uuid="${actorData.actor.uuid}"]`);
            
            if (!node) {
                // New Actor - Create and Insert
                node = this.createActorNode(actorData, data);
                if (index < actorsDiv.children.length) {
                    actorsDiv.insertBefore(node, actorsDiv.children[index]);
                } else {
                    actorsDiv.appendChild(node);
                }
            } else {
                // Update
                this.updateActorNode(node, actorData, data);
                 if (actorsDiv.children[index] !== node) {
                    if (index < actorsDiv.children.length) {
                        actorsDiv.insertBefore(node, actorsDiv.children[index]);
                    } else {
                        actorsDiv.appendChild(node);
                    }
                 }
            }
        });
    }

    updateActorNode(node, actorData, globalData) {
        // Name
        const nameEl = node.querySelector('.action-pack__actor-name');
        const newName = actorData.name.split(' ')[0];
        if (nameEl && nameEl.textContent !== newName) nameEl.textContent = newName;

        // AC
        const acDisplay = node.querySelector('.action-pack__actor-ac-display');
        const newAc = String(actorData.actor.system.attributes.ac.value);
        
        if (acDisplay && acDisplay.textContent !== newAc) acDisplay.textContent = newAc;

        // HP - Check for Wrapper
        const hpDiv = node.querySelector('.action-pack__actor-hp');
        if (hpDiv) {
            const hp = actorData.actor.system.attributes.hp;
            // Update Bar
            // Check current values
            const oldVal = hpDiv.dataset.hpValue;
            const oldMax = hpDiv.dataset.hpMax;

            if (oldVal != hp.value || oldMax != hp.max) {
                hpDiv.dataset.hpValue = hp.value;
                hpDiv.dataset.hpMax = hp.max;
                hpDiv.style.setProperty('--bar-percent', `${(hp.value / hp.max) * 100}%`);
                
                const valDisplay = hpDiv.querySelector('.action-pack__actor-hp-value');
                if (valDisplay) valDisplay.textContent = hp.value;

                const valInput = hpDiv.querySelector('.action-pack__actor-hp-input');
                if (valInput && document.activeElement !== valInput) valInput.value = hp.value;
                
                const maxSpan = hpDiv.querySelector('.action-pack__actor-hp-max');
                if (maxSpan) maxSpan.textContent = hp.max;
            }
        }
        
        // Temp HP
        const tempSpan = node.querySelector('.action-pack__actor-temp-display');
        const hpTemp = actorData.actor.system.attributes.hp.temp || 0;
        if (tempSpan && tempSpan.textContent != hpTemp) tempSpan.textContent = hpTemp;

        // Death Saves
        const existingDS = node.querySelector('.action-pack__death-saving');
        const actorHp = actorData.actor.system.attributes.hp.value;
        const type = actorData.actor.type;
        const showDS = actorHp <= 0 && type === "character";

        const header = node.querySelector('.action-pack__actor-header');
        
        if (showDS) {
            if (!existingDS) {
                const dsNode = this.createDeathSavingThrows(actorData.actor);
                if (header && header.nextSibling) {
                    node.insertBefore(dsNode, header.nextSibling);
                } else {
                    node.appendChild(dsNode);
                }
            } else {
                const newDS = this.createDeathSavingThrows(actorData.actor);
                existingDS.replaceWith(newDS);
            }
        } else if (existingDS) {
            existingDS.remove();
        }

        // Initiative
        const existingInit = node.querySelector('.action-pack__initiative');
        if (actorData.needsInitiative) {
            if (!existingInit) {
				const initLink = document.createElement('a');
				initLink.className = 'action-pack__initiative flexrow';
				initLink.innerHTML = `<i class="flex0 fas fa-swords action-pack__initiative-icon"></i><div>${game.i18n.localize("action-pack-enhanced.roll-initiative")}</div>`;
				initLink.addEventListener('click', (e) => this.callbacks.onInitiative(e, actorData.actor));
				
				// Insert after DeathSaves or H1
				const ref = node.querySelector('.action-pack__abilities') 
						|| node.querySelector('.action-pack__death-saving + *')
						|| node.children[1]; 
				if (ref) node.insertBefore(initLink, ref);
				else node.appendChild(initLink);
            }
        } else if (existingInit) {
            existingInit.remove();
        }

        // Abilities
        this.updateAbilities(node, actorData.actor, globalData);

        // Skills
        this.updateSkills(node, actorData);

        // Sections
        this.updateSections(node, actorData, globalData);
    }

    updateAbilities(node, actor, globalData) {
        const div = node.querySelector('.action-pack__abilities');
        if (div) {
             const newDiv = this.createAbilities(actor, globalData.abilityColumns);
             div.replaceWith(newDiv);
        }
    }

    updateSkills(node, actorData) {
        // Find skills container
        // It might be in different places depending on mode, but simplified:
        const container = node.querySelector('.action-pack__skill-container');
        if (container) {
             // Preserve open connection?
             const wasOpen = container.classList.contains('is-open');
             const newContainer = this.createSkillContainer(actorData, actorData.skillMode === "dropdown");
             if (wasOpen) newContainer.classList.add('is-open');
             container.replaceWith(newContainer);
        } else {
            // If mode switched or it appeared/disappeared, createActorNode handles creation.
            // update logic usually assumes same structure, 
            // if mode changed, createActorNode likely would have been called if I wiped the node.
            // But I didn't wipe the node.
            // So if settings changed mode, we might need to remove old container and add new one.
            // Check 'actorData.skillMode' vs current class?
            // This is extensive. For now assume mode constant, or reload required for settings.
        }
    }

    updateSections(node, actorData, globalData) {
        const sections = ['equipped', 'feature', 'spell', 'inventory', 'passive'];
        
        // To maintain order, we need anchor points.
        // But simply replacing existing ones is 90% of the work.
        sections.forEach(secId => {
            const sectionData = actorData.sections ? actorData.sections[secId] : null;
            const existingSec = node.querySelector(`.action-pack__category[data-section-id="${secId}"]`);
            
            if (sectionData) {
                const newSec = this.createCategoryNode(sectionData, globalData, actorData.actor, secId);
                if (existingSec) {
                    existingSec.replaceWith(newSec);
                } else {
                    // Append... 
                    // To be safe, insert before 'append' skills if exists?
                    const skillsAppend = node.querySelector('.action-pack__skill-container.append');
                    if (skillsAppend) {
                        node.insertBefore(newSec, skillsAppend);
                    } else {
                        node.appendChild(newSec);
                    }
                }
            } else {
                if (existingSec) existingSec.remove();
            }
        });
    }
}
