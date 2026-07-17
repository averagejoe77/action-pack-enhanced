const MODULE_ID = "action-pack-enhanced";
const CHANGELOG_URL = "https://raw.githubusercontent.com/averagejoe77/action-pack-enhanced/main/CHANGELOG.md";
const FETCH_TIMEOUT_MS = 5000;

class VersionCheck {
    constructor() {
        this.installedVersion = null;
        this.latestVersion = null;
        this.hasUpdate = false;
        this.changelogEntries = []; // [{ version, date, items: string[] }], newest first
        this.checked = false;
    }

    /**
     * Fetches the latest published manifest + changelog and compares against the
     * installed version. Only does real work once per session. Never throws - any
     * failure (offline, GitHub unreachable, unexpected format) just leaves hasUpdate
     * false so the badge quietly shows nothing new rather than breaking the tray.
     */
    async check() {
        if (this.checked) return;
        this.checked = true;

        const module = game.modules.get(MODULE_ID);
        this.installedVersion = module?.version ?? null;
        if (!this.installedVersion || !module?.manifest) return;

        try {
            const manifestRes = await fetch(module.manifest, { cache: "no-store", signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
            if (!manifestRes.ok) return;
            const manifest = await manifestRes.json();
            this.latestVersion = manifest.version ?? null;
            if (!this.latestVersion) return;

            this.hasUpdate = foundry.utils.isNewerVersion(this.latestVersion, this.installedVersion);
            if (!this.hasUpdate) return;

            const changelogRes = await fetch(CHANGELOG_URL, { cache: "no-store", signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
            if (!changelogRes.ok) return;
            const text = await changelogRes.text();
            this.changelogEntries = this._parseChangelog(text, this.installedVersion);
        } catch (e) {
            console.warn(`${MODULE_ID} | version check failed`, e);
        }
    }

    /**
     * Parses "## [x.y.z] - date" sections (newest-first, matching this repo's
     * CHANGELOG.md convention) and keeps only entries newer than the installed version.
     */
    _parseChangelog(text, installedVersion) {
        const entries = [];
        const sectionRegex = /^##\s*\[([^\]]+)\]\s*-\s*(.+)$/gm;
        const matches = [...text.matchAll(sectionRegex)];

        for (let i = 0; i < matches.length; i++) {
            const [fullMatch, version, date] = matches[i];
            if (!foundry.utils.isNewerVersion(version, installedVersion)) break;

            const start = matches[i].index + fullMatch.length;
            const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
            const body = text.slice(start, end);
            const items = [...body.matchAll(/^-\s+(.+)$/gm)].map(m => m[1].trim());

            entries.push({ version, date: date.trim(), items });
        }

        return entries;
    }
}

export const versionCheck = new VersionCheck();
