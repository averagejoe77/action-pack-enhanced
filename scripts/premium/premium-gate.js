import { PREMIUM_CONFIG } from "./premium-config.js";

const SETTING_NAMESPACE = "action-pack-enhanced";
const AUTH_SETTING_KEY = "patreon-auth-data"; // client-scoped: is *this* browser connected
const TABLE_SETTING_KEY = "patreon-gm-entitlement"; // world-scoped: shared with every player
const DEV_UNLOCK_KEY = "dev-unlock";

class PremiumGate {
    constructor() {
        this._entitlements = {};
    }

    getAuthData() {
        return game.settings.get(SETTING_NAMESPACE, AUTH_SETTING_KEY);
    }

    isAuthenticated() {
        const data = this.getAuthData();
        return !!(data && data.authenticated && data.state);
    }

    /**
     * Synchronous, cache-only check. A single GM subscription unlocks the feature for
     * their whole table: the GM checks their own freshly-fetched entitlements, while
     * players read the copy the GM's client published to a world-scoped setting (world
     * settings are GM-write-only in Foundry, so players can only ever read this).
     * @param {string} featureId
     */
    can(featureId) {

        if (game.user.isGM) {
            return !!this._entitlements[featureId];
        }

        const shared = game.settings.get(SETTING_NAMESPACE, TABLE_SETTING_KEY);
        return !!shared?.entitlements?.[featureId];
    }

    /**
     * Ensures entitlement for a feature, revalidating with the backend first if requested
     * or if nothing has been fetched yet. No-op network-wise for non-GM users - see refresh().
     * @param {string} featureId
     */
    async require(featureId, { revalidate = false } = {}) {
        if (!revalidate && this.can(featureId)) return true;
        await this.refresh({ force: revalidate });
        return this.can(featureId);
    }

    /**
     * Refreshes cached entitlements from the backend using the GM's own stored auth state,
     * then publishes the result to a world-scoped setting so every player's client can read
     * it. Only a GM's connection can unlock the table, so this is a no-op for players.
     */
    async refresh({ force = false } = {}) {
        if (!game.user.isGM) return;

        if (!this.isAuthenticated()) {
            this._entitlements = {};
            await this._publishToTable();
            return;
        }

        const data = this.getAuthData();
        try {
            const res = await fetch(`${PREMIUM_CONFIG.backend.entitlementsUrl}?state=${encodeURIComponent(data.state)}`);
            if (!res.ok) throw new Error(`Entitlement check failed: ${res.status}`);
            const payload = await res.json();
            this._entitlements = payload?.entitlements ?? {};
        } catch (e) {
            console.warn("action-pack-enhanced | premium-gate refresh failed", e);
            this._entitlements = {};
        }

        await this._publishToTable();
    }

    /**
     * Writes the GM's current entitlements to the world-scoped setting players read from.
     * Skips the write (and the update-hook/re-render churn it triggers table-wide) when
     * nothing actually changed.
     */
    async _publishToTable() {
        const current = game.settings.get(SETTING_NAMESPACE, TABLE_SETTING_KEY);
        const next = {
            entitlements: this._entitlements,
            tier: this.getAuthData()?.tier ?? null,
            updatedAt: Date.now()
        };

        const unchanged = JSON.stringify(current?.entitlements ?? {}) === JSON.stringify(next.entitlements)
            && (current?.tier ?? null) === next.tier;
        if (unchanged) return;

        await game.settings.set(SETTING_NAMESPACE, TABLE_SETTING_KEY, next);
    }

    /**
     * Clears cached entitlements (e.g. on disconnect) and, for a GM, publishes that
     * cleared state to the table too.
     */
    async clear() {
        this._entitlements = {};
        if (game.user.isGM) {
            await this._publishToTable();
        }
    }
}

export const premiumGate = new PremiumGate();
