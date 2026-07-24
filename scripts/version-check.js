const MODULE_ID = "action-pack-enhanced";
// Dedicated update-check endpoint that returns only the latest version number,
// avoiding the GitHub API rate limits a raw.githubusercontent.com manifest fetch
// would eventually hit.
const VERSION_CHECK_URL = "https://www.dungeonsandderps.com/foundry-modules/update-check.php?module=action-pack-enhanced";
const FETCH_TIMEOUT_MS = 5000;

class VersionCheck {
    constructor() {
        this.installedVersion = null;
        this.latestVersion = null;
        this.hasUpdate = false;
        this.checked = false;
    }

    /**
     * Fetches the latest published version and compares against the installed
     * version. Only does real work once per session. Never throws - any failure
     * (offline, endpoint unreachable, unexpected format) just leaves hasUpdate
     * false so the badge quietly shows nothing new rather than breaking the tray.
     */
    async check() {
        if (this.checked) return;
        this.checked = true;

        const module = game.modules.get(MODULE_ID);
        this.installedVersion = module?.version ?? null;
        if (!this.installedVersion) return;

        try {
            const versionRes = await fetch(VERSION_CHECK_URL, { cache: "no-store", signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
            if (!versionRes.ok) return;
            const versionData = await versionRes.json();
            this.latestVersion = versionData.version ?? null;
            if (!this.latestVersion) return;

            this.hasUpdate = foundry.utils.isNewerVersion(this.latestVersion, this.installedVersion);
        } catch (e) {
            console.warn(`${MODULE_ID} | version check failed`, e);
        }
    }
}

export const versionCheck = new VersionCheck();
