import { LitElement, html, nothing } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { getItemDetails } from '../utils.js';

export class ApeItem extends LitElement {
    static properties = {
        item: { type: Object },
        uses: { type: Object },
        api: { type: Object },
        masteryIds: { type: Array },
        expanded: { type: Boolean, state: true },
        description: { type: Object, state: true }
    };

    // Use Light DOM to inherit global styles
    createRenderRoot() {
        return this;
    }

    _onRoll(e) {
        e.preventDefault();
        e.stopPropagation(); // Prevent toggling when clicking the die
        this.api.rollItem(this.item, e);
    }

    _onRecharge(e) {
        e.preventDefault();
        e.stopPropagation();
        this.api.rollRecharge(this.item);
    }

    _onDragStart(e) {
        e.dataTransfer.setData("text/plain", JSON.stringify({
            type: "ActionPackItem",
            uuid: this.item.uuid,
            actionPack: true
        }));
        e.stopPropagation();
    }

    async _onClick(e) {
        if (e.shiftKey) { 
            this.api.rollItem(this.item, e);
            return;
        }
        
        this.expanded = !this.expanded;
        if (this.expanded && !this.description) {
            this.description = await this.api.getItemDescription(this.item);
        }
    }

    render() {
        if (!this.item) return nothing;
        const sys = this.item.system;
        const actor = this.item.actor;
        const rarity = sys.rarity !== '' ? sys.rarity : this.item.type === 'weapon' ? 'common' : '';
        const isSpell = this.item.type === 'spell';
        const isInnate = sys.method === 'innate';
        const showUses = this.uses && (!isSpell || isInnate);
        
        // Flags
        const isRitual = sys.properties?.has("ritual");
        const isConcentration = sys.properties?.has("concentration");
        const isBonus = sys.activation?.type === 'bonus';
        const isReaction = sys.activation?.type === 'reaction';
        const isLegendary = sys.activation?.type === 'legendary';
        const isRecharge = sys.recharge?.value;
        const isCharged = sys.recharge?.charged;

        let itemMastery = false;
        let isMastered = false;
        let localizedMastery = '';

        if(game.modules.find(i => i.id === 'wm5e') && game.modules.get('wm5e')?.active) {   
            itemMastery = sys.mastery || false;

            if (itemMastery && this.item.type === 'weapon') {
                const baseItem = sys.type?.baseItem;
                // Use the passed masteryIds if available, otherwise fallback to actor data
                const currentMasteries = new Set(this.masteryIds || actor.system.traits?.weaponProf?.mastery?.value || []);
                isMastered = baseItem && currentMasteries.has(baseItem);
                localizedMastery = game.i18n.localize(`action-pack-enhanced.masteries.${itemMastery}`);
            }
        }
        
        // Unprepared Check (simplistic)
        const canCastUnpreparedRituals = !!actor.itemTypes.feat.find(i => i.name === "Ritual Adept");
        const isUnprepared = sys.prepared === 0 && !(isRitual && canCastUnpreparedRituals);

        return html`
            <div class="item-name rollable flexrow ${isUnprepared ? 'unprepared' : ''}">
                <div class="item-image ${rarity}${isUnprepared ? ' unprepared' : ''}" 
                        style="background-image: url('${this.item.img}')"
                        @mousedown="${this._onRoll}">
                    <i class="fa fa-dice-d20"></i>
                </div>
                
                <div class="item-name-wrap flexrow">
                    <h4 @mousedown="${this._onClick}">
                        <span class="item-text ${rarity}">${this.item.name}</span>
                        ${showUses ? html` (${this.uses.available}${this.uses.maximum ? '/' + this.uses.maximum : ''})` : nothing}
                    </h4>

                    ${game.modules.find(i => i.id === 'wm5e') && game.modules.get('wm5e')?.active && itemMastery ? html`<div class="mastery ${isMastered ? 'active' : 'inactive'} flag">${localizedMastery}</div>` : nothing}
                </div>

                ${isRitual ? html`<div class="ritual flag" title="${game.i18n.localize("action-pack-enhanced.flag.ritual-title")}"></div>` : nothing}
                ${isConcentration ? html`<div class="concentration flag" title="${game.i18n.localize("action-pack-enhanced.flag.concentration-title")}"></div>` : nothing}
                ${isBonus ? html`<div class="bonus flag" title="${game.i18n.localize("action-pack-enhanced.flag.bonus-title")}">${game.i18n.localize("action-pack-enhanced.flag.bonus")}</div>` : nothing}
                ${isReaction ? html`<div class="reaction flag" title="${game.i18n.localize("action-pack-enhanced.flag.reaction-title")}">${game.i18n.localize("action-pack-enhanced.flag.reaction")}</div>` : nothing}
                ${isLegendary ? html`<div class="legendary flag" title="${game.i18n.localize("action-pack-enhanced.flag.legendary-title")}">${game.i18n.localize("action-pack-enhanced.flag.legendary")}</div>` : nothing}

                ${isRecharge ? (isCharged ? 
                    html`<div class="flag"><i class="fas fa-bolt"></i></div>` : 
                    html`<div class="flag"><a class="rollable item-recharge" @mousedown="${this._onRecharge}"><i class="fas fa-dice-six"></i> ${sys.recharge.value}+</a></div>`
                ) : nothing}

                ${isUnprepared ? html`<div class="unprepared flag" title="${game.i18n.localize("action-pack-enhanced.flag.unprepared-title")}">${game.i18n.localize("action-pack-enhanced.flag.unprepared")}</div>` : nothing}
            </div>
            
            <div class="item-drag-handle" 
                    draggable="true" 
                    title="${game.i18n.localize("action-pack-enhanced.drag-to-target")}"
                    @dragstart="${this._onDragStart}">
                <i class="fas fa-grip-vertical"></i>
            </div>

            ${this.expanded ? html`
                <div class="item-summary" style="display:block">
                    ${this._renderItemDetails()}
                    ${this.description ? html`<p>${unsafeHTML(this.description.description)}</p>` : html`<i class="fas fa-spinner fa-spin"></i>`}
                </div>
            ` : nothing}
        `;
    }

    _renderItemDetails() {
        const details = getItemDetails(this.item);
        return html`
            ${details.castingTime ? html`<p><strong>Casting Time:</strong> ${details.castingTime}</p>` : nothing}
            ${details.range ? html`<p><strong>Range:</strong> ${details.range}</p>` : nothing}
            ${details.duration ? html`<p><strong>Duration:</strong> ${details.duration}</p>` : nothing}
        `;
    }
}
customElements.define('ape-item', ApeItem);
