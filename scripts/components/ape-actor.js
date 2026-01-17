import { LitElement, html, nothing } from 'lit';
import { formatNumber, generateRaceClassDisplay } from '../utils.js';
import './ape-section.js';

export class ApeActor extends LitElement {
    static properties = {
        actorData: { type: Object }, // The object returned by data-builder
        globalData: { type: Object }, // Global settings/options
        api: { type: Object },
        // Internal state for UI toggles if needed, though most are handled by sub-components or CSS
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
                        <img class="ape-actor-ac-icon" src="/modules/ape/images/ac-icon.svg">
                        <span class="ape-actor-ac-display">${ac}</span>
                    </span>
                </h1>
                
                <div class="ape-actor-meta">
                    ${type === "character" ? html`
                        <div class="ape-actor-race-class">
                            ${this._renderRaceClass(actor.itemTypes)}
                        </div>
                    ` : nothing}

                    <div class="ape-actor-rest-buttons">
                        <button class="ape-actor-rest-button" @click="${() => this.api.shortRest(actor)}"><span class="fas fa-fork-knife"></span></button>
                        <button class="ape-actor-rest-button" @click="${() => this.api.longRest(actor)}"><span class="fas fa-tent"></span></button>
                    </div>

                    ${this._renderHpBar(actor, hp)}
                </div>
            </div>

            ${isDead ? this._renderDeathSaves(actor) : nothing}

            ${needsInitiative ? html`
                <div class="ape-initiative" @click="${() => this.api.rollInitiative(actor)}">
                    <i class="fas fa-swords ape-initiative-icon"></i>
                    <span class="ape-initiative-text">${game.i18n.localize("ape.roll-initiative")}</span>
                </div>
            ` : nothing}

            ${this._renderAbilities(actor)}

            ${skillMode === "dropdown" ? this._renderSkills(actor, showSkills, true) : nothing}

            <!-- Sections -->
            ${this._renderSections(actor, sections)}

            ${skillMode === "append" ? this._renderSkills(actor, showSkills, false) : nothing}
        `;
    }

    _renderRaceClass(itemTypes) {
        const htmlString = generateRaceClassDisplay(itemTypes);
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
                    .showSpellUses="${this.globalData.showSpellUses}">
                </ape-section>
            `;
        });
    }
}
customElements.define('ape-actor', ApeActor);
