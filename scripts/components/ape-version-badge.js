import { LitElement, html, nothing } from 'lit';

export class ApeVersionBadge extends LitElement {
    static properties = {
        installedVersion: { type: String },
        hasUpdate: { type: Boolean },
        latestVersion: { type: String }
    };

    createRenderRoot() {
        return this;
    }

    render() {
        if (!game.user.isGM || !this.installedVersion) return nothing;

        return html`
            <div class="ape-version-badge ${this.hasUpdate ? 'has-update' : 'up-to-date'}">
                v${this.installedVersion}
                ${this.hasUpdate ? html`
                    <div class="ape-version-tooltip">
                        ${game.i18n.format("action-pack-enhanced.version.update-available", { version: this.latestVersion })}
                    </div>
                ` : nothing}
            </div>
        `;
    }
}
customElements.define('ape-version-badge', ApeVersionBadge);
