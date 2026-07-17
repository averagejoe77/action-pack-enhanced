import { LitElement, html, nothing } from 'lit';
import { patreonAuthService } from '../premium/patreon-auth-service.js';
import { PREMIUM_CONFIG } from '../premium/premium-config.js';

export class ApePremiumBadge extends LitElement {
    static properties = {
        authData: { type: Object }, // this browser's own connection (GM-relevant)
        tableEntitlement: { type: Object } // world setting the GM publishes to (player-relevant)
    };

    createRenderRoot() {
        return this;
    }

    _onConnect(e) {
        e.stopPropagation();
        patreonAuthService.connect();
    }

    _onDisconnect(e) {
        e.stopPropagation();
        patreonAuthService.disconnect();
    }

    render() {
        // A single GM subscription unlocks the feature for the whole table, so only the
        // GM has anything to connect/disconnect - players just see whether it's unlocked.
        return game.user.isGM ? this._renderGmBadge() : this._renderPlayerBadge();
    }

    _renderGmBadge() {
        const connected = !!(this.authData && this.authData.authenticated);
        return html`
            <div class="ape-premium-badge ${connected ? 'connected' : ''}">
                ${connected ? html`
                    <span class="ape-premium-tier"><i class="fab fa-patreon"></i> ${game.i18n.format("action-pack-enhanced.premium.supporter-tier", { tier: this.authData.tier ?? "" })}</span>
                    <span class="ape-premium-action" @click="${this._onDisconnect}">${game.i18n.localize("action-pack-enhanced.premium.disconnect")}</span>
                ` : html`
                    <span class="ape-premium-action ape-premium-connect" @click="${this._onConnect}">
                        <i class="fab fa-patreon"></i> ${game.i18n.localize("action-pack-enhanced.premium.connect")}
                    </span>
                `}
            </div>
        `;
    }

    _renderPlayerBadge() {
        const unlocked = !!this.tableEntitlement?.entitlements?.[PREMIUM_CONFIG.featureId];
        if (!unlocked) return nothing;
        return html`
            <div class="ape-premium-badge connected">
                <span class="ape-premium-tier"><i class="fab fa-patreon"></i> ${game.i18n.localize("action-pack-enhanced.premium.table-unlocked")}</span>
            </div>
        `;
    }
}
customElements.define('ape-premium-badge', ApePremiumBadge);
