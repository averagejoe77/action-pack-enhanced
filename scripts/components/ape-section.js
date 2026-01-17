import { LitElement, html, nothing } from 'lit';
import './ape-item.js';

export class ApeSection extends LitElement {
    static properties = {
        title: { type: String },
        items: { type: Array }, // Array of {item, uses} objects
        groups: { type: Object }, // Object of groups
        sectionId: { type: String },
        isOpen: { type: Boolean, state: true },
        api: { type: Object },
        showSpellDots: { type: Boolean },
        showSpellUses: { type: Boolean },
        actor: { type: Object }
    };

    constructor() {
        super();
        this.isOpen = true; // Default open
    }

    createRenderRoot() {
        return this;
    }

    updated(changedProperties) {
        if (changedProperties.has('isOpen')) {
            this.classList.toggle('is-open', this.isOpen);
        }
    }

    _toggleOpen(e) {
        e.stopPropagation();
        this.isOpen = !this.isOpen;
    }

    render() {
        return html`
            ${this.title ? html`
                <h2 @click="${this._toggleOpen}">
                    <i class="fas fa-caret-down"></i> ${game.i18n.localize(this.title)}
                </h2>
            ` : nothing}

            ${this.items && this.items.length > 0 ? html`
                <div class="ape-items">
                    ${this.items.map(entry => html`
                        <ape-item class="ape-item item" data-item-uuid="${entry.item.uuid}" .item="${entry.item}" .uses="${entry.uses}" .api="${this.api}"></ape-item>
                    `)}
                </div>
            ` : nothing}

            ${this.groups ? Object.entries(this.groups).map(([groupName, group]) => html`
                <ape-group 
                    class="ape-group"
                    .group="${group}" 
                    .groupName="${groupName}" 
                    .api="${this.api}"
                    .actor="${this.actor}"
                    .showSpellDots="${this.showSpellDots}"
                    .showSpellUses="${this.showSpellUses}">
                </ape-group>
            `) : nothing}
        `;
    }
}
customElements.define('ape-section', ApeSection);

export class ApeGroup extends LitElement {
    static properties = {
        group: { type: Object },
        groupName: { type: String },
        api: { type: Object },
        actor: { type: Object },
        showSpellDots: { type: Boolean },
        showSpellUses: { type: Boolean },
        isOpen: { type: Boolean, state: true }
    };
    
    constructor() {
        super();
        this.isOpen = true;
    }

    createRenderRoot() { return this; }

    updated(changedProperties) {
        if (changedProperties.has('isOpen')) {
            this.classList.toggle('is-open', this.isOpen);
        }
        if (changedProperties.has('groupName')) {
            this.dataset.groupId = this.groupName;
        }
    }

    _toggleOpen(e) {
        if (e.target.closest('.group-dots')) return;
        this.isOpen = !this.isOpen;
    }

    render() {
        if (!this.group) return nothing;
        const { items, uses, title } = this.group;
        const hasItems = items && items.length > 0;
        const hasSlots = uses && uses.maximum;

        if (!hasItems && !hasSlots) return nothing;

        const displayDots = hasSlots && this.showSpellDots;
        const displayUses = uses && this.showSpellUses;

        const headerClasses = [
            'flexrow',
            'ape-group-header',
            displayDots ? 'has-dots' : '',
            displayUses ? 'has-uses' : ''
        ].filter(Boolean).join(' ');

        return html`
            <div class="${headerClasses}" @click="${this._toggleOpen}">
                <h3>
                    <i class="fas fa-caret-down"></i> ${game.i18n.localize(title)}
                </h3>
                ${displayDots ? this._renderDots(uses) : nothing}
                ${displayUses ? html`<div class="group-uses">${uses.available}/${uses.maximum}</div>` : nothing}
            </div>

            ${hasItems ? html`
                <div class="ape-items">
                    ${items.map(entry => html`
                        <ape-item class="ape-item item" data-item-uuid="${entry.item.uuid}" .item="${entry.item}" .uses="${entry.uses}" .api="${this.api}"></ape-item>
                    `)}
                </div>
            ` : nothing}
        `;
    }

    _renderDots(uses) {
        return html`
            <div class="group-dots" data-group-name="${this.groupName}">
                ${Array.from({length: uses.maximum}).map((_, i) => html`
                    <div class="dot ${i < uses.available ? '' : 'empty'}" 
                         data-slot="${i}"
                         @click="${(e) => { e.stopPropagation(); this.api.adjustSpellSlot(this.actor, this.groupName, i); }}">
                    </div>
                `)}
            </div>
        `;
    }
}
customElements.define('ape-group', ApeGroup);
