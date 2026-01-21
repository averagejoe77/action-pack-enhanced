import { LitElement, html, nothing } from 'lit';
import './ape-actor.js';

export class ApeApp extends LitElement {
    static properties = {
        data: { type: Object }, // Contains actors
        globalData: { type: Object }, // Contains abilityColumns, showSpellDots
        api: { type: Object }
    };

    createRenderRoot() { return this; }

    updated(changedProperties) {
        if (changedProperties.has('data')) {
            // Restore scroll position logic
            // The original logic was: onScroll, if 1 actor, save scroll.
            // On render, if same actor, restore.
            // Lit handles rendering, so specific DOM manipulation via updated might be needed for scroll restoration.
            this._restoreScroll();
        }
    }

    _restoreScroll() {
        if (this.data.scrollPosition && this.data.actors.length === 1 && this.data.actors[0].actor.uuid === this.data.scrollPosition.uuid) {
            const container = this.querySelector('.ape-container');
            if (container) {
                container.scrollTop = this.data.scrollPosition.scroll || 0;
            }
        }
    }

    _onScroll(e) {
        if (this.data.actors.length === 1) {
            const uuid = this.data.actors[0].actor.uuid;
            const scroll = e.target.scrollTop;
            const showSkills = !!this.querySelector('.ape-skill-container.is-open');
            this.api.setScrollPosition({ uuid, scroll, showSkills }); // Need to add setScrollPosition to API or callback
        }
    }

    render() {
        if (!this.data) return nothing;
        
        const { actors } = this.data;

        const isEmpty = !actors || actors.length === 0;

        // Container classes
        const classes = [
            'ape-wrapper'
        ];
        
        return html`
            <div class="${classes.join(' ')}" @scroll="${this._onScroll}">
                ${this._renderHeader()}

                <div class="ape-actors">
                    ${isEmpty ? html`
                        <div class="ape-empty-tray">
                            <i class="fas fa-dice-d20"></i>
                        </div>
                    ` : actors.map(actorData => html`
                        <ape-actor 
                            class="ape-actor"
                            .actorData="${actorData}"
                            .globalData="${this.globalData}"
                            .api="${this.api}">
                        </ape-actor>
                    `)}
                </div>

                <div class="ape-end-turn" @click="${() => this.api.endTurn()}">
                    ${game.i18n.localize("action-pack-enhanced.end-turn")}
                </div>
            </div>
        `;
    }
    
    _renderHeader() {
        return nothing; // Header logic was just H1 in render.js? No, render.js container had children.
    }
}
customElements.define('ape-app', ApeApp);
