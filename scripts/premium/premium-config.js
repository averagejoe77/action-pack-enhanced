// Backend is the self-contained PHP service under /patreon on
// www.dungeonsandderps.com (see that folder's README.md). clientId is still a
// placeholder until the Patreon OAuth client is registered - fill it in once
// you have it (safe to be public; it's meant to be embedded client-side).
export const PREMIUM_CONFIG = Object.freeze({
    patreon: {
        clientId: "h8DeKFx_s9YWM1IIUqD1eBqc9toW3FqxBzs2Z9tg2P3n_ScxT9agAuKFTNG2gRkf",
        redirectUri: "https://www.dungeonsandderps.com/patreon/callback.php",
        scopes: "identity%20identity%5Bemail%5D%20identity.memberships",
        authUrl: "https://www.patreon.com/oauth2/authorize"
    },
    backend: {
        authCheckUrl: "https://www.dungeonsandderps.com/patreon/authcheck.php",
        entitlementsUrl: "https://www.dungeonsandderps.com/patreon/entitlements.php"
    },
    polling: {
        intervalMs: 3000,
        maxAttempts: 20
    },
    featureId: "spell-inventory-management"
});
