import { PREMIUM_CONFIG } from "./premium-config.js";
import { premiumGate } from "./premium-gate.js";

const SETTING_NAMESPACE = "action-pack-enhanced";
const SETTING_KEY = "patreon-auth-data";

class PatreonAuthService {
    _generateState() {
        return foundry.utils.randomID();
    }

    _getAuthUrl(state) {
        const { clientId, redirectUri, scopes, authUrl } = PREMIUM_CONFIG.patreon;
        return `${authUrl}?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&state=${state}`;
    }

    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async _pollForAuth(state, onProgress) {
        const { intervalMs, maxAttempts } = PREMIUM_CONFIG.polling;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            await this._delay(intervalMs);
            onProgress?.(attempt, maxAttempts);
            try {
                const res = await fetch(`${PREMIUM_CONFIG.backend.authCheckUrl}?state=${encodeURIComponent(state)}`);
                if (!res.ok) continue; // not completed yet (e.g. 404), keep polling
                const data = await res.json();
                if (data?.authenticated) {
                    return { authenticated: true, tier: data.tier, source: data.source ?? "patreon", timestamp: Date.now(), state };
                }
            } catch (e) {
                console.warn("action-pack-enhanced | patreon auth poll failed", e);
            }
        }
        return null;
    }

    async _persistAuth(authData) {
        await game.settings.set(SETTING_NAMESPACE, SETTING_KEY, authData);
        await premiumGate.refresh({ force: true });
    }

    /**
     * Opens a dialog that walks the user through connecting their Patreon account.
     */
    async connect() {
        const { DialogV2 } = foundry.applications.api;

        return DialogV2.wait({
            window: { title: game.i18n.localize("action-pack-enhanced.premium.connect-title") },
            content: `
                <div class="ape-patreon-connect">
                    <p class="ape-patreon-status">${game.i18n.localize("action-pack-enhanced.premium.connect-intro")}</p>
                </div>
            `,
            modal: true,
            rejectClose: false,
            buttons: [{
                action: "start",
                label: game.i18n.localize("action-pack-enhanced.premium.start-auth"),
                icon: "fab fa-patreon",
                default: true,
                callback: async (event, button, dialog) => {
                    const statusEl = dialog.element.querySelector(".ape-patreon-status");
                    const state = this._generateState();
                    const authUrl = this._getAuthUrl(state);
                    window.open(authUrl, "_blank");
                    if (statusEl) statusEl.textContent = game.i18n.localize("action-pack-enhanced.premium.waiting");

                    const result = await this._pollForAuth(state, (attempt, max) => {
                        if (statusEl) statusEl.textContent = game.i18n.format("action-pack-enhanced.premium.waiting-attempt", { attempt, max });
                    });

                    if (result) {
                        await this._persistAuth(result);
                        if (statusEl) statusEl.textContent = game.i18n.format("action-pack-enhanced.premium.connected", { tier: result.tier ?? "" });
                        return true;
                    }

                    ui.notifications.warn(game.i18n.localize("action-pack-enhanced.premium.auth-failed"));
                    return false;
                }
            }, {
                action: "cancel",
                label: game.i18n.localize("action-pack-enhanced.dialog.cancel"),
                callback: () => false
            }]
        });
    }

    /**
     * Confirms and clears the stored Patreon connection.
     */
    async disconnect() {
        const { DialogV2 } = foundry.applications.api;

        const confirmed = await DialogV2.confirm({
            window: { title: game.i18n.localize("action-pack-enhanced.premium.disconnect-title") },
            content: `<p>${game.i18n.localize("action-pack-enhanced.premium.disconnect-content")}</p>`,
            modal: true,
            rejectClose: false,
            yes: { label: game.i18n.localize("action-pack-enhanced.premium.disconnect") },
            no: { label: game.i18n.localize("action-pack-enhanced.dialog.cancel") }
        });
        if (!confirmed) return;

        await game.settings.set(SETTING_NAMESPACE, SETTING_KEY, null);
        await premiumGate.clear();
    }
}

export const patreonAuthService = new PatreonAuthService();
