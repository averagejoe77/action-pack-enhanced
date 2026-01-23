import { LitElement, html, nothing } from 'lit';
import { formatNumber, generateRaceClassDisplay } from '../utils.js';
import './ape-section.js';

export class ApeActor extends LitElement {
    static properties = {
        actorData: { type: Object }, // The object returned by data-builder
        globalData: { type: Object }, // Global settings/options
        api: { type: Object },
        _xpActionsOpen: { state: false }
    };

    createRenderRoot() { return this; }

    updated(changedProperties) {
        if (changedProperties.has('actorData') && this.actorData) {
            this.dataset.actorUuid = this.actorData.actor.uuid;
        }
    }

    render() {
        if (!this.actorData) return nothing;
        const { actor, name, sections, needsInitiative, skillMode, showSkills } = this.actorData;
        const hp = actor.system.attributes.hp;
        const ac = actor.system.attributes.ac.value;
        const type = actor.type;
        const isDead = hp.value <= 0 && type === "character";

        return html`
            <div class="ape-actor-header">
                <h1>
                    <a class="ape-actor-name" @click="${(e) => this.api.openSheet(actor)}">${name.split(' ')[0]}</a>
                    <span class="ape-actor-ac">
                        <img class="ape-actor-ac-icon" src="/modules/action-pack-enhanced/images/ac-icon.svg">
                        <span class="ape-actor-ac-display">${ac}</span>
                    </span>
                </h1>

                ${type === "character" ? html`
                    <div class="ape-actor-race-class">
                        ${this._renderRaceClass(actor)}
                    </div>
                ` : nothing}

                ${game.settings.get("action-pack-enhanced", "show-xp-info") && type === "character" ? this._renderExperience(actor) : nothing}

                <div class="ape-actor-rest-buttons">
                    <button class="ape-actor-rest-button" @click="${() => this.api.shortRest(actor)}"><span class="fas fa-fork-knife"></span></button>
                    <button class="ape-actor-rest-button" @click="${() => this.api.longRest(actor)}"><span class="fas fa-tent"></span></button>
                </div>

                ${this._renderHpBar(actor, hp)}
                
            </div>

            ${isDead ? this._renderDeathSaves(actor) : nothing}

            ${needsInitiative ? html`
                <div class="ape-initiative" @click="${() => this.api.rollInitiative(actor)}">
                    <i class="fas fa-swords ape-initiative-icon"></i>
                    <span class="ape-initiative-text">${game.i18n.localize("action-pack-enhanced.roll-initiative")}</span>
                </div>
            ` : nothing}

            ${this._renderAbilities(actor)}

            ${skillMode === "dropdown" ? this._renderSkills(actor, showSkills, true) : nothing}

            <!-- Sections -->
            ${this._renderSections(actor, sections)}

            ${skillMode === "append" ? this._renderSkills(actor, showSkills, false) : nothing}
        `;
    }

    _renderExperience(actor) {
        const details = actor.system.details;
        const percent = details.xp.pct;
        const maxXP = details.xp.max;
        const minXP = details.xp.min;
        const currentXP = details.xp.value;
        return html`
            <div class="ape-actor-xp">
                <div class="ape-actor-xp-bar" style="--bar-percent: ${percent}%"></div>
                <div class="ape-actor-xp-info">
                    <span class="ape-actor-xp-current" @click="${this._toggleXpActions}">${currentXP}</span>
                    <span class="ape-actor-xp-separator">/</span>
                    <span class="ape-actor-xp-max">${maxXP}</span>
                </div>
                <div class="ape-actor-xp-actions ${this._xpActionsOpen ? 'active' : 'inactive'}">
                    <button class="ape-actor-xp-close" @click="${this._toggleXpActions}">close</button>
                    <p>Choose an amount to add to or subtract from ${actor.name}'s XP</p>
                    <div class="ape-actor-xp-increment">
                        <button class="ape-actor-xp-button" @click="${() => this.api.updateXP(actor, currentXP + 1)}">+1</button>
                        <button class="ape-actor-xp-button" @click="${() => this.api.updateXP(actor, currentXP + 10)}">+10</button>
                        <button class="ape-actor-xp-button" @click="${() => this.api.updateXP(actor, currentXP + 100)}">+100</button>
                        <button class="ape-actor-xp-button" @click="${() => this.api.updateXP(actor, currentXP + 1000)}">+1000</button>
                    </div>
                    <div class="ape-actor-xp-decrement">
                        <button class="ape-actor-xp-button" @click="${() => this.api.updateXP(actor, currentXP - 1)}">-1</button>
                        <button class="ape-actor-xp-button" @click="${() => this.api.updateXP(actor, currentXP - 10)}">-10</button>
                        <button class="ape-actor-xp-button" @click="${() => this.api.updateXP(actor, currentXP - 100)}">-100</button>
                        <button class="ape-actor-xp-button" @click="${() => this.api.updateXP(actor, currentXP - 1000)}">-1000</button>
                    </div>
                    <div class="ape-actor-xp-max">
                        <button class="ape-actor-xp-button" @click="${() => this.api.updateXP(actor, maxXP)}">Max</button>
                    </div>
                </div>
            </div>
        `;
    }



    _toggleXpActions() {
        this._xpActionsOpen = !this._xpActionsOpen;
    }

    _renderRaceClass(actor) {
        const htmlString = generateRaceClassDisplay(actor);
        return html`<div style="display:contents" .innerHTML="${htmlString.replace(/,/g, '<br />')}"></div>`;
    }

    _renderHpBar(actor, hp) {
        const percent = Math.min(100, Math.max(0, (hp.value / hp.max) * 100));
        return html`
             <div class="ape-actor-hp-wrapper">
                <div class="ape-actor-hp" style="--bar-percent: ${percent}%">
                    <span class="ape-actor-hp-text">
                        <span class="ape-actor-hp-display" @click="${this._toggleHpInput}">
                            <span class="ape-actor-hp-value">${hp.value}</span>
                            <span class="ape-actor-hp-separator">/</span>
                            <span class="ape-actor-hp-max">${hp.max}</span>
                        </span>
                        <input type="text" class="ape-actor-hp-input" value="${hp.value}" 
                               style="display:none"
                               @blur="${this._finishHpEdit}"
                               @keydown="${this._hpInputKey}"
                               @change="${(e) => this.api.updateHP(actor, parseInt(e.target.value))}">
                    </span>
                </div>
                <div class="ape-actor-temp">
                     <span class="ape-actor-temp-display" @click="${this._toggleTempInput}">${hp.temp || 0}</span>
                     <input type="text" class="ape-actor-temp-input" value="${hp.temp || 0}" 
                            style="display:none"
                            @blur="${this._finishTempEdit}"
                            @keydown="${this._hpInputKey}"
                            @change="${(e) => this.api.updateTempHP(actor, parseInt(e.target.value))}">
                </div>
             </div>
        `;
    }

    _toggleHpInput(e) {
        const display = e.currentTarget;
        const input = display.nextElementSibling;
        display.style.display = 'none';
        input.style.display = 'inline-block';
        input.focus();
        input.select();
    }

    _finishHpEdit(e) {
        const input = e.currentTarget;
        const display = input.previousElementSibling;
        input.style.display = 'none';
        display.style.display = '';
    }

    _toggleTempInput(e) {
        const display = e.currentTarget;
        const input = display.nextElementSibling;
        display.style.display = 'none';
        input.style.display = 'inline-block';
        input.focus();
        input.select();
    }

    _finishTempEdit(e) {
        // Same logic, different structure? Temp display has input next to it
        const input = e.currentTarget;
        const display = input.previousElementSibling;
        input.style.display = 'none';
        display.style.display = '';
    }

    _hpInputKey(e) {
        if (e.key === 'Enter') e.currentTarget.blur();
    }

    _renderAbilities(actor) {
        const columns = this.globalData.abilityColumns;
        return html`
            <div class="ape-abilities">
                ${columns.map(col => html`
                    <div class="flex-col">
                        <span class="ape-ability">
                             <span class="ape-ability-label">&nbsp;</span>
                             <span class="ape-ability-hdr">check</span>
                             <span class="ape-ability-hdr">save</span>
                        </span>
                        ${col.map(c => {
                            const details = actor.system.abilities[c.key];
                            return html`
                                <span class="ape-ability">
                                    <span class="ape-ability-label">${c.key}</span>
                                    <a class="fas fa-dice-d20 ape-ability-check" 
                                       title="${c.label} check"
                                       @click="${(e) => this.api.rollAbilityCheck(actor, c.key, e)}">
                                        <span class="ape-ability-text">${formatNumber(details.mod)}</span>
                                    </a>
                                    <a class="fas fa-dice-d20 ape-ability-save" 
                                       title="${c.label} saving throw"
                                       @click="${(e) => this.api.rollSavingThrow(actor, c.key, e)}">
                                        <span class="ape-ability-text">${formatNumber(details.save.value)}</span>
                                    </a>
                                </span>
                            `;
                        })}
                    </div>
                `)}
            </div>
        `;
    }

    _renderSkills(actor, showSkills, isDropdown) {
        const skillsObj = this.actorData.skills;
        const actorSkills = actor.system.skills;

        return html`
            <div class="ape-skill-container ${this.actorData.skillMode} ${showSkills ? 'is-open' : ''}">
                ${isDropdown ? html`
                    <h2 class="ape-skill-header" @click="${this._toggleSkills}">
                        <i class="fas fa-caret-down"></i> Skills
                    </h2>
                ` : nothing}

                <div class="ape-skills">
                    ${Object.keys(actorSkills).map(key => {
                        const skill = actorSkills[key];
                        const config = skillsObj[key];
                        if (!config) return nothing;
                        
                        let iconClass = 'far fa-circle';
                        if (skill.proficient === 0.5) iconClass = 'fas fa-adjust';
                        else if (skill.proficient === 1) iconClass = 'fas fa-check';
                        else if (skill.proficient === 2) iconClass = 'fas fa-star';




                        return html`
                            <div class="ape-skill-row flexrow ${skill.proficient === 1 ? 'proficient' : skill.proficient === 2 ? 'expert' : ''}"
                               @click="${(e) => this.api.rollSkill(actor, key, e)}"
                               @contextmenu="${(e) => this.api.rollSkill(actor, key, e, true)}">
                                <span class="ape-skill-icon ${iconClass}"></span>
                                <span class="ape-skill-ability">${skill.ability}</span>
                                <span class="ape-skill-label">${config.label}</span>
                                <span class="ape-skill-bonus">${formatNumber(skill.total)}</span>
                                <span class="ape-skill-passive">(${skill.passive})</span>
                            </div>
                        `;
                    })}
                </div>
            </div>
        `;
    }

    _toggleSkills(e) {
        e.currentTarget.parentElement.classList.toggle('is-open');
    }

    _renderDeathSaves(actor) {
        const deathFails = actor.system.attributes.death.failure;
        const deathSaves = actor.system.attributes.death.success;
        
        // Helper to render dots
        const renderDots = (count, filledClass, icon) => {
             return Array.from({length: 3}).map((_, i) => html`
                <span class="ape-death-dot ${i < count ? 'filled' : ''}">
                    ${i < count ? html`<span class="fas ${icon}"></span>` : nothing}
                </span>
             `);
        };

        const canRoll = deathFails < 3 && deathSaves < 3;

        return html`
             <div class="ape-death-saving">
                <span class="ape-death-throws failed">
                    ${renderDots(deathFails, 'failed', 'fa-skull-crossbones')}
                </span>
                <span class="ape-death-icon" 
                      style="${canRoll ? 'cursor:pointer' : 'cursor:default'}"
                      @mousedown="${canRoll ? (e) => this.api.rollDeathSave(actor, e) : null}"></span>
                <span class="ape-death-throws saved">
                    ${renderDots(deathSaves, 'saved', 'fa-check')}
                </span>
             </div>
        `;
    }

    _renderSections(actor, sections) {
        // Sections: equipped, feature, spell, inventory, passive
        const list = ['equipped', 'feature', 'spell', 'inventory', 'passive'];
        return list.map(id => {
            const data = sections[id];
            if (!data) return nothing;
            return html`
                <ape-section 
                    class="ape-category"
                    .title="${data.title}" 
                    .items="${data.items}"
                    .groups="${data.groups}"
                    .sectionId="${id}"
                    .api="${this.api}"
                    .actor="${actor}"
                    .showSpellDots="${this.globalData.showSpellDots}"
                    .showSpellUses="${this.globalData.showSpellUses}"
                    .forceOpen="${data.forceOpen}">
                </ape-section>
            `;
        });
    }
}
customElements.define('ape-actor', ApeActor);
