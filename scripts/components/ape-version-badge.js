import { LitElement, html, nothing } from 'lit';

export class ApeVersionBadge extends LitElement {
    static properties = {
        installedVersion: { type: String },
        hasUpdate: { type: Boolean },
        latestVersion: { type: String },
        changelogEntries: { type: Array }
    };

    createRenderRoot() {
        return this;
    }

    render() {
        if (!game.user.isGM || !this.installedVersion) return nothing;

        return html`
            <div class="ape-version-badge ${this.hasUpdate ? 'has-update' : 'up-to-date'}">
                v${this.installedVersion}
                ${this.hasUpdate ? this._renderTooltip() : nothing}
            </div>
        `;
    }

    _renderTooltip() {
        return html`
            <div class="ape-version-tooltip">
                <div class="ape-version-tooltip-header">
                    ${game.i18n.format("action-pack-enhanced.version.update-available", { version: this.latestVersion })}
                </div>
                ${this.changelogEntries.map(entry => html`
                    <div class="ape-version-entry">
                        <div class="ape-version-entry-title">
                            ${entry.version}${entry.date ? html` <span class="ape-version-entry-date">${entry.date}</span>` : nothing}
                        </div>
                        <ul>${entry.items.map(item => html`<li>${item}</li>`)}</ul>
                    </div>
                `)}
            </div>
        `;
    }
}
customElements.define('ape-version-badge', ApeVersionBadge);
