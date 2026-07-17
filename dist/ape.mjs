var $t = Object.defineProperty;
var kt = (o, e, t) => e in o ? $t(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t;
var E = (o, e, t) => kt(o, typeof e != "symbol" ? e + "" : e, t);
const q = Object.freeze({
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
    intervalMs: 3e3,
    maxAttempts: 20
  },
  featureId: "spell-inventory-management"
}), ee = "action-pack-enhanced", wt = "patreon-auth-data", oe = "patreon-gm-entitlement";
class _t {
  constructor() {
    this._entitlements = {};
  }
  getAuthData() {
    return game.settings.get(ee, wt);
  }
  isAuthenticated() {
    const e = this.getAuthData();
    return !!(e && e.authenticated && e.state);
  }
  /**
   * Synchronous, cache-only check. A single GM subscription unlocks the feature for
   * their whole table: the GM checks their own freshly-fetched entitlements, while
   * players read the copy the GM's client published to a world-scoped setting (world
   * settings are GM-write-only in Foundry, so players can only ever read this).
   * @param {string} featureId
   */
  can(e) {
    var a;
    if (game.user.isGM)
      return !!this._entitlements[e];
    const t = game.settings.get(ee, oe);
    return !!((a = t == null ? void 0 : t.entitlements) != null && a[e]);
  }
  /**
   * Ensures entitlement for a feature, revalidating with the backend first if requested
   * or if nothing has been fetched yet. No-op network-wise for non-GM users - see refresh().
   * @param {string} featureId
   */
  async require(e, { revalidate: t = !1 } = {}) {
    return !t && this.can(e) ? !0 : (await this.refresh({ force: t }), this.can(e));
  }
  /**
   * Refreshes cached entitlements from the backend using the GM's own stored auth state,
   * then publishes the result to a world-scoped setting so every player's client can read
   * it. Only a GM's connection can unlock the table, so this is a no-op for players.
   */
  async refresh({ force: e = !1 } = {}) {
    if (!game.user.isGM) return;
    if (!this.isAuthenticated()) {
      this._entitlements = {}, await this._publishToTable();
      return;
    }
    const t = this.getAuthData();
    try {
      const a = await fetch(`${q.backend.entitlementsUrl}?state=${encodeURIComponent(t.state)}`);
      if (!a.ok) throw new Error(`Entitlement check failed: ${a.status}`);
      const s = await a.json();
      this._entitlements = (s == null ? void 0 : s.entitlements) ?? {};
    } catch (a) {
      console.warn("action-pack-enhanced | premium-gate refresh failed", a), this._entitlements = {};
    }
    await this._publishToTable();
  }
  /**
   * Writes the GM's current entitlements to the world-scoped setting players read from.
   * Skips the write (and the update-hook/re-render churn it triggers table-wide) when
   * nothing actually changed.
   */
  async _publishToTable() {
    var s;
    const e = game.settings.get(ee, oe), t = {
      entitlements: this._entitlements,
      tier: ((s = this.getAuthData()) == null ? void 0 : s.tier) ?? null,
      updatedAt: Date.now()
    };
    JSON.stringify((e == null ? void 0 : e.entitlements) ?? {}) === JSON.stringify(t.entitlements) && ((e == null ? void 0 : e.tier) ?? null) === t.tier || await game.settings.set(ee, oe, t);
  }
  /**
   * Clears cached entitlements (e.g. on disconnect) and, for a GM, publishes that
   * cleared state to the table too.
   */
  async clear() {
    this._entitlements = {}, game.user.isGM && await this._publishToTable();
  }
}
const H = new _t();
class St {
  constructor() {
    this.masteryRules = {
      Fighter: {
        type: "table",
        values: [
          { level: 1, mastery: 3 },
          { level: 2, mastery: 3 },
          { level: 3, mastery: 3 },
          { level: 4, mastery: 4 },
          { level: 5, mastery: 4 },
          { level: 6, mastery: 4 },
          { level: 7, mastery: 4 },
          { level: 8, mastery: 4 },
          { level: 9, mastery: 4 },
          { level: 10, mastery: 5 },
          { level: 11, mastery: 5 },
          { level: 12, mastery: 5 },
          { level: 13, mastery: 5 },
          { level: 14, mastery: 5 },
          { level: 15, mastery: 5 },
          { level: 16, mastery: 6 },
          { level: 17, mastery: 6 },
          { level: 18, mastery: 6 },
          { level: 19, mastery: 6 },
          { level: 20, mastery: 6 }
        ]
      },
      Barbarian: {
        type: "table",
        values: [
          { level: 1, mastery: 2 },
          { level: 2, mastery: 2 },
          { level: 3, mastery: 2 },
          { level: 4, mastery: 3 },
          { level: 5, mastery: 3 },
          { level: 6, mastery: 3 },
          { level: 7, mastery: 3 },
          { level: 8, mastery: 3 },
          { level: 9, mastery: 3 },
          { level: 10, mastery: 4 },
          { level: 11, mastery: 4 },
          { level: 12, mastery: 4 },
          { level: 13, mastery: 4 },
          { level: 14, mastery: 4 },
          { level: 15, mastery: 4 },
          { level: 16, mastery: 4 },
          { level: 17, mastery: 4 },
          { level: 18, mastery: 4 },
          { level: 19, mastery: 4 },
          { level: 20, mastery: 4 }
        ]
      },
      Ranger: { type: "constant", value: 2 },
      Rogue: { type: "constant", value: 2 },
      Paladin: { type: "constant", value: 2 }
    };
  }
  /**
   * Updates an actor's HP
   * @param {Actor} actor 
   * @param {number} value 
   */
  async updateHP(e, t) {
    if (e)
      return e.update({ "system.attributes.hp.value": t });
  }
  /**
   * Updates an actor's Temp HP
   * @param {Actor} actor 
   * @param {number} value 
   */
  async updateTempHP(e, t) {
    if (e)
      return e.update({ "system.attributes.hp.temp": t });
  }
  /**
   * Updates an actor's XP
   * @param {Actor} actor 
   * @param {number} value 
   */
  async updateXP(e, t) {
    if (e)
      return e.update({ "system.details.xp.value": t });
  }
  /**
   * Performs a Short Rest
   * @param {Actor} actor 
   */
  async shortRest(e) {
    if (e)
      return e.shortRest();
  }
  calculateMaxMasteries(e) {
    let t = 1;
    for (const a of e.itemTypes.class) {
      const s = this.masteryRules[a.name];
      if (s) {
        let n = 0;
        if (s.type === "constant")
          n = s.value;
        else if (s.type === "table") {
          const i = a.system.levels, r = s.values.find((l) => l.level === i);
          n = r ? r.mastery : 0;
        }
        n > t && (t = n);
      }
    }
    return t;
  }
  /**
   * Performs a Long Rest
   * @param {Actor} actor 
   */
  async longRest(e) {
    var s;
    if (!e) return;
    const t = await e.longRest();
    if (game.modules.get("wm5e") && ((s = game.modules.get("wm5e")) == null ? void 0 : s.active) && e.itemTypes.feat.find((n) => n.name === "Weapon Mastery" || n.name === "Weapon Master")) {
      await e.setFlag("action-pack-enhanced", "masterySelectionPending", !0);
      const n = e.itemTypes.weapon.filter((d) => d.name !== "Unarmed Strike"), i = /* @__PURE__ */ new Map(), r = e.system.traits.weaponProf.mastery.value;
      n.forEach((d) => {
        var m, g;
        const c = d.system.mastery, p = (m = d.system.type) == null ? void 0 : m.baseItem;
        c && p && !i.has(p) && i.set(p, {
          id: p,
          label: p.replace(/-/g, " ").replace(/\b\w/g, (y) => y.toUpperCase()),
          masteryLabel: ((g = CONFIG.DND5E.weaponMasteries[c]) == null ? void 0 : g.label) || c,
          selected: r.find((y) => y === p)
        });
      });
      const l = this.calculateMaxMasteries(e);
      await this.promptMasterySelection(e, i, l);
    } else
      await e.setFlag("action-pack-enhanced", "masterySelectionPending", !1), await e.update({ "system.traits.weaponProf.mastery.value": [] });
    return t;
  }
  async promptMasterySelection(e, t, a) {
    const { DialogV2: s } = foundry.applications.api;
    let n = `<p>Select up to ${a} ${a === 1 ? "weapon" : "weapons"} to use ${a === 1 ? "its" : "their"} weapon mastery for the day:</p>`;
    n += '<form class="ape-mastery-dialog">';
    for (const [i, r] of t)
      n += `
            <div class="ape-mastery-switch form-group">
                <input id="${i}" class="ape-mastery-checkbox" type="checkbox" name="mastery" value="${i}" data-dtype="String" ${r.selected ? "checked" : ""}>
                <label for="${i}" class="ape-mastery-label">${r.label} (${r.masteryLabel})</label>
            </div>`;
    return n += "</form>", n += `
        <script>
            (function() {
                const form = document.querySelector('.ape-mastery-dialog');
                if (!form) return;
                const inputs = form.querySelectorAll('input[name="mastery"]');
                const max = ${a};
                
                function updateState() {
                    const checked = Array.from(inputs).filter(i => i.checked);
                    inputs.forEach(i => {
                        if (!i.checked) {
                            i.disabled = checked.length >= max;
                        } else {
                            i.disabled = false;
                        }
                    });
                }
                
                inputs.forEach(i => i.addEventListener('change', updateState));
                updateState(); // Initial check
            })();
        <\/script>
        `, s.wait({
      window: { title: "Weapon Mastery Selection" },
      content: n,
      buttons: [{
        action: "update",
        label: "Update",
        default: !0,
        callback: async (i, r, l) => {
          const d = [];
          return l.element.querySelectorAll('input[name="mastery"]:checked').forEach((c) => {
            d.push(c.value);
          }), d.length > a && (ui.notifications.warn(`You selected more than ${a} masteries. Only the first ${a} will be applied.`), d.splice(a)), await e.update({ "system.traits.weaponProf.mastery.value": d }), await e.setFlag("action-pack-enhanced", "masterySelectionPending", !1), !0;
        }
      }, {
        action: "cancel",
        label: "Cancel",
        callback: async () => (await e.setFlag("action-pack-enhanced", "masterySelectionPending", !1), !1)
      }],
      submit: (i) => {
      }
    });
  }
  /**
   * Toggles a Weapon Mastery selection
   * @param {Actor} actor 
   * @param {string} masteryId 
   */
  async toggleMastery(e, t) {
    var s, n, i;
    if (!e || !t) return;
    const a = new Set(((i = (n = (s = e.system.traits) == null ? void 0 : s.weaponProf) == null ? void 0 : n.mastery) == null ? void 0 : i.value) || []);
    if (a.has(t))
      a.delete(t);
    else {
      if (a.size >= 2) {
        ui.notifications.warn("You can only select up to 2 Weapon Masteries.");
        return;
      }
      a.add(t);
    }
    return e.update({ "system.traits.weaponProf.mastery.value": Array.from(a) });
  }
  /**
   * Locks Weapon Mastery selection
   * @param {Actor} actor 
   */
  async lockMasteries(e) {
    if (e)
      return e.setFlag("action-pack-enhanced", "masterySelectionPending", !1);
  }
  /**
   * Rolls Initiative for the actor in the current combat
   * @param {Actor} actor 
   */
  async rollInitiative(e) {
    if (!game.combat) return;
    const t = game.combat.combatants.find((a) => a.actor === e);
    if (t)
      return game.combat.rollInitiative([t.id]);
  }
  /**
   * End the current turn
   */
  async endTurn() {
    if (game.combat)
      return game.combat.nextTurn();
  }
  /**
   * Opens the Actor Sheet
   * @param {Actor} actor 
   */
  openSheet(e) {
    e && e.sheet.render(!0);
  }
  /**
   * Rolls a Death Saving Throw
   * @param {Actor} actor 
   */
  async rollDeathSave(e, t) {
    return e.rollDeathSave({ event: t });
  }
  /**
   * Rolls an Ability Check
   * @param {Actor} actor 
   * @param {string} abilityId 
   */
  async rollAbilityCheck(e, t, a) {
    return e.rollAbilityCheck({ event: a, ability: t });
  }
  /**
   * Rolls a Saving Throw
   * @param {Actor} actor 
   * @param {string} abilityId 
   */
  async rollSavingThrow(e, t, a) {
    return e.rollSavingThrow({ event: a, ability: t });
  }
  /**
   * Rolls a Skill
   * @param {Actor} actor 
   * @param {string} skillId 
   * @param {boolean} fastForward 
   */
  async rollSkill(e, t, a, s = !1) {
    return e.rollSkill({ event: a, skill: t }, { fastForward: s });
  }
  /**
   * Adjusts Spell Slots
   * @param {Actor} actor 
   * @param {string} groupName 
   * @param {number} slotIndex 
   */
  async adjustSpellSlot(e, t, a) {
    var i, r;
    const s = a + 1, n = (r = (i = e.system.spells) == null ? void 0 : i[t]) == null ? void 0 : r.value;
    if (n !== void 0) {
      const l = `system.spells.${t}.value`, d = n !== s ? s : s - 1;
      return e.update({ [l]: d });
    }
  }
  /**
   * Rolls an Item
   * @param {Item} item 
   */
  async rollItem(e, t) {
    var a, s;
    if (e) {
      if (!((a = game.modules.get("wire")) != null && a.active) && ((s = game.modules.get("itemacro")) != null && s.active) && game.settings.get("itemacro", "defaultmacro") && e.hasMacro()) {
        e.executeMacro();
        return;
      }
      return e.use({ event: t });
    }
  }
  /**
   * Rolls Item Recharge
   * @param {Item} item 
   */
  async rollRecharge(e) {
    return e.system.uses.rollRecharge();
  }
  /**
   * Gets Item Chat Data for Description
   * @param {Item} item 
   */
  async getItemDescription(e) {
    var i, r, l, d;
    const t = await e.getChatData({ secrets: e.actor.isOwner }), a = ((r = (i = e.system) == null ? void 0 : i.activation) == null ? void 0 : r.type) || "", s = ((d = (l = e.system) == null ? void 0 : l.activation) == null ? void 0 : d.value) || "";
    let n = "";
    return s === "" ? n = a.charAt(0).toUpperCase() + a.slice(1) : s && a && (n = `${s} ${a.charAt(0).toUpperCase() + a.slice(1)}`), {
      description: t.description,
      properties: {
        castingTime: n,
        range: this._formatRange(e),
        duration: this._formatDuration(e)
      }
    };
  }
  /**
   * Toggles inspiration on an actor
   * @param {Actor} actor 
   */
  async toggleInspiration(e) {
    if (e)
      return e.update({ "system.attributes.inspiration": !e.system.attributes.inspiration });
  }
  _formatRange(e) {
    var s, n, i, r;
    const t = (n = (s = e.system) == null ? void 0 : s.range) == null ? void 0 : n.value, a = (r = (i = e.system) == null ? void 0 : i.range) == null ? void 0 : r.units;
    return t && a ? `${t} ${a}` : a || "";
  }
  _formatDuration(e) {
    var s, n, i, r;
    const t = (n = (s = e.system) == null ? void 0 : s.duration) == null ? void 0 : n.value, a = (r = (i = e.system) == null ? void 0 : i.duration) == null ? void 0 : r.units;
    return t && a ? `${t} ${a}` : a ? a === "inst" ? "Instantaneous" : a : "";
  }
  /**
   * Sets a weapon set item
   * @param {Actor} actor 
   * @param {number} setIndex 
   * @param {string} slot 'main' or 'off'
   * @param {string} itemUuid 
   */
  async setWeaponSetItem(e, t, a, s, n) {
    var l, d, c;
    if (!e) return;
    const i = e.getFlag("action-pack-enhanced", "weaponSets") || [];
    for (let p = 0; p <= t; p++)
      i[p] || (i[p] = { main: null, off: null, active: !1 });
    const r = fromUuidSync(s);
    if (r) {
      const p = a === "main" ? "off" : "main", m = i[t][p], g = [];
      if (m === s && ((l = r.system) == null ? void 0 : l.quantity) === 1 && g.push(game.i18n.localize("action-pack-enhanced.warning.quantity-limit") || "Not enough quantity to equip in both slots."), (d = r.system.properties) != null && d.has("two") && m) {
        const y = fromUuidSync(m);
        y && ((c = y.system.properties) != null && c.has("two")) && g.push(game.i18n.localize("action-pack-enhanced.warning.two-handed") || "You cannot have two two-handed weapons in the same set.");
      }
      if (g.length > 0) {
        g.forEach((y) => ui.notifications.warn(y));
        return;
      }
    }
    if (i[t][a] = s, await e.setFlag("action-pack-enhanced", "weaponSets", i), i[t].active)
      return this.equipWeaponSet(e, t);
  }
  /**
   * Clears a weapon set item
   * @param {Actor} actor 
   * @param {number} setIndex 
   * @param {string} slot 'main' or 'off'
   */
  async clearWeaponSetItem(e, t, a) {
    if (!e) return;
    const s = e.getFlag("action-pack-enhanced", "weaponSets") || [];
    if (s[t])
      return s[t][a] = null, !s[t].main && !s[t].off && (s[t].active = !1), e.setFlag("action-pack-enhanced", "weaponSets", s);
  }
  /**
   * Equips a weapon set
   * @param {Actor} actor 
   * @param {number} setIndex 
   */
  async equipWeaponSet(e, t) {
    if (!e) return;
    const a = e.getFlag("action-pack-enhanced", "weaponSets");
    if (!a || !a[t]) return;
    const s = a[t];
    if (!s.main && !s.off) return;
    const n = a.map((c, p) => ({ ...c, active: p === t }));
    await e.setFlag("action-pack-enhanced", "weaponSets", n);
    const i = [], r = e.itemTypes.weapon.filter((c) => c.name !== "Unarmed Strike"), l = e.itemTypes.equipment.find((c) => c.name.includes("Shield"));
    l && r.push(l);
    const d = /* @__PURE__ */ new Set();
    s.main && d.add(s.main), s.off && d.add(s.off);
    for (const c of r) {
      const p = d.has(c.uuid);
      c.system.equipped !== p && i.push({ _id: c.id, "system.equipped": p });
    }
    i.length > 0 && await e.updateEmbeddedDocuments("Item", i);
  }
  /**
   * Update Exhaustion Level
   * @param {Actor} actor 
   * @param {number} level 
   */
  async updateExhaustion(e, t) {
    if (e)
      return e.update({ "system.attributes.exhaustion": t });
  }
  /**
   * Toggle a condition on/off for an actor
   * @param {Actor} actor
   * @param {string} conditionId
   */
  async toggleCondition(e, t) {
    if (e)
      return e.toggleStatusEffect(t);
  }
  /**
   * Checks whether the current user has spell/inventory management entitlement,
   * warning the user if not.
   */
  _checkManageAccess() {
    return H.can(q.featureId) ? !0 : (ui.notifications.warn(game.i18n.localize("action-pack-enhanced.warning.premium-locked")), !1);
  }
  /**
   * Opens the system compendium browser and adds the selected item to the actor
   * @param {Actor} actor
   * @param {"spell"|"inventory"} category
   */
  async addItemFromCompendium(e, t) {
    if (!e) return;
    if (!this._checkManageAccess()) return null;
    const a = {
      spell: ["spell"],
      inventory: ["weapon", "equipment", "consumable", "tool", "loot", "container"]
    }, s = a[t] ?? a.inventory, n = await dnd5e.applications.CompendiumBrowser.selectOne({
      filters: { locked: { documentClass: "Item", types: new Set(s) } }
    });
    if (!n) return null;
    const i = await fromUuid(n);
    if (!i)
      return ui.notifications.warn(game.i18n.localize("action-pack-enhanced.warning.item-not-found")), null;
    const r = game.items.fromCompendium(i, { keepId: !0 });
    e.items.has(r._id) && delete r._id;
    const [l] = await e.createEmbeddedDocuments("Item", [r]);
    return l;
  }
  /**
   * Updates an item's quantity
   * @param {Item} item
   * @param {number} quantity
   */
  async updateItemQuantity(e, t) {
    if (!e || !this._checkManageAccess()) return;
    const a = Math.max(0, Math.floor(Number(t) || 0));
    if (a !== e.system.quantity)
      return e.update({ "system.quantity": a });
  }
  /**
   * Toggles a spell between prepared/unprepared. No-op for non-"spell" methods
   * or spells that are always prepared.
   * @param {Item} item
   */
  async toggleSpellPrepared(e) {
    if (!(!e || e.type !== "spell") && this._checkManageAccess() && !(e.system.method !== "spell" || e.system.prepared === 2))
      return e.update({ "system.prepared": e.system.prepared === 1 ? 0 : 1 });
  }
  /**
   * Deletes an item from its actor after a confirmation dialog
   * @param {Item} item
   */
  async deleteItem(e) {
    if (!(!e || !this._checkManageAccess() || !await foundry.applications.api.DialogV2.confirm({
      window: { title: game.i18n.localize("action-pack-enhanced.dialog.delete-item-title") },
      content: `<p>${game.i18n.format("action-pack-enhanced.dialog.delete-item-content", { name: e.name })}</p>`,
      modal: !0,
      rejectClose: !1,
      yes: { icon: "fas fa-trash", label: game.i18n.localize("action-pack-enhanced.dialog.delete") },
      no: { icon: "fas fa-times", label: game.i18n.localize("action-pack-enhanced.dialog.cancel") }
    })))
      return e.delete();
  }
}
function re(o) {
  return o == null ? "0" : `${o >= 0 ? "+" : ""}${o}`;
}
function et(o) {
  var t;
  const e = (t = o.system) == null ? void 0 : t.activities;
  return e ? new Set(Array.from(e, (a) => {
    var s;
    return (s = a.activation) == null ? void 0 : s.type;
  }).filter(Boolean)) : /* @__PURE__ */ new Set();
}
function At(o) {
  const e = o.type === "spell" ? Ot(o) : "", t = Ct(o), a = xt(o), s = Et(o), n = o.type === "spell" ? Tt(o) : "";
  return { school: e, castingTime: t, range: a, duration: s, materials: n };
}
function Ct(o) {
  var a, s, n, i;
  const e = ((s = (a = o.system) == null ? void 0 : a.activation) == null ? void 0 : s.type) || "", t = ((i = (n = o.system) == null ? void 0 : n.activation) == null ? void 0 : i.value) || "";
  return t === "" && e !== "" ? game.i18n.localize(`action-pack-enhanced.action-type.${e}`) : t && e ? `${t} ${e.charAt(0).toUpperCase() + e.slice(1)}` : "";
}
function xt(o) {
  var s, n, i, r, l, d, c, p;
  const e = ((n = (s = o.system) == null ? void 0 : s.range) == null ? void 0 : n.long) || null, t = (r = (i = o.system) == null ? void 0 : i.range) == null ? void 0 : r.units;
  let a;
  return t !== "touch" && t !== "self" ? a = ((d = (l = o.system) == null ? void 0 : l.range) == null ? void 0 : d.value) || ((p = (c = o.system) == null ? void 0 : c.range) == null ? void 0 : p.reach) || 5 : a = null, a && e && t ? `${a} ${t} / ${e} ${t}` : a && t ? `${a} ${t}` : t ? game.i18n.localize(`action-pack-enhanced.range.${t}`) : "";
}
function Et(o) {
  var a, s, n, i;
  const e = (s = (a = o.system) == null ? void 0 : a.duration) == null ? void 0 : s.value, t = (i = (n = o.system) == null ? void 0 : n.duration) == null ? void 0 : i.units;
  return e && t ? `${e} ${e > 1 ? t + "s" : t}` : t ? game.i18n.localize(`action-pack-enhanced.duration.${t}`) : "";
}
function Tt(o) {
  var t, a;
  const e = (a = (t = o.system) == null ? void 0 : t.materials) == null ? void 0 : a.value;
  return e || "";
}
function Ot(o) {
  var t, a;
  if ((t = o.labels) != null && t.school)
    return o.labels.school;
  const e = (a = o.system) == null ? void 0 : a.school;
  if (e) {
    const s = CONFIG.DND5E.spellSchools[e];
    return s ? s.label || s : e;
  }
  return "";
}
function Pt(o) {
  var l, d;
  let e = {}, t = o.itemTypes.race, a = o.itemTypes.class, s = o.itemTypes.subclass;
  const n = o.system.details.level;
  if (a.length === s.length) {
    let c = { race: `<span>${(l = t[0]) == null ? void 0 : l.name} - ${n}</span>` || "Unknown", classes: [] };
    for (let p = 0; p < a.length; p++)
      c.classes[p] = { name: a[p].name, level: a[p].system.levels, subclass: { name: s[p].name } };
    e = c;
  } else {
    let c = { race: `<span>${(d = t[0]) == null ? void 0 : d.name} - ${n}</span>` || "Unknown", classes: [] };
    for (let p = 0; p < a.length; p++) {
      c.classes[p] = { name: a[p].name, level: a[p].system.levels, subclass: { name: "" } };
      for (let m = 0; m < s.length; m++)
        s[m].system.class === a[p].name && (c.classes[p].subclass.name = s[m].name);
    }
    e = c;
  }
  a.length === s.length ? a.forEach((c, p) => {
    e.classes[p].icon = c.img, e.classes[p].subclass.icon = c.subclass.img;
  }) : a.forEach((c, p) => {
    e.classes[p].icon = c.img, e.classes[p].subclass.name !== "" && s.forEach((m) => {
      m.system.class === c.name && (e.classes[p].subclass.icon = m.img);
    });
  });
  let i = `${e.race}`, r = [];
  for (let c = 0; c < e.classes.length; c++) {
    let p = "", m = "";
    e.classes[c].subclass.name !== "" ? (p = e.classes[c].subclass.icon, m = `${e.classes[c].subclass.name} ${e.classes[c].name} (${e.classes[c].level})`) : (p = e.classes[c].icon, m = `${e.classes[c].name} (${e.classes[c].level})`), r.push(`<img class="ape-actor-class-icon" src="${p}" title="${m}">`);
  }
  return i + `<span class="ape-actor-class-icons">${r.join("")}</span>`;
}
const It = (o) => {
  const e = o.system, t = e.consume;
  if (t && t.target)
    return Mt(o.actor, t);
  const a = e.uses;
  if (a && (a.max > 0 || a.value > 0))
    return tt(e);
  const s = o.type;
  return s === "feat" ? qt() : s === "consumable" ? {
    available: e.quantity
  } : s === "weapon" ? Ut(e) : null;
};
function Mt(o, e) {
  let t = null, a = null;
  if (e.type === "attribute") {
    const s = getProperty(o.system, e.target);
    typeof s == "number" ? t = s : t = 0;
  } else if (e.type === "ammo" || e.type === "material") {
    const s = o.items.get(e.target);
    s ? t = s.system.quantity : t = 0;
  } else if (e.type === "charges") {
    const s = o.items.get(e.target);
    s ? { available: t, maximum: a } = tt(s.system) : t = 0;
  }
  return t !== null ? (e.amount > 1 && (t = Math.floor(t / e.amount), a !== null && (a = Math.floor(a / e.amount))), { available: t, maximum: a }) : null;
}
function tt(o) {
  let e = o.uses.value, t = o.uses.max;
  const a = o.quantity;
  return a && (e = e + (a - 1) * t, t = t * a), { available: e, maximum: t };
}
function qt(o) {
  return null;
}
function Ut(o) {
  return o.properties.thr && !o.properties.ret ? { available: o.quantity, maximum: null } : null;
}
class Dt {
  constructor() {
  }
  build(e, t) {
    return this.settingShowNoUses = game.settings.get("action-pack-enhanced", "show-no-uses"), this.settingShowUnpreparedCantrips = game.settings.get("action-pack-enhanced", "show-unprepared-cantrips"), this.settingShowUnpreparedSpells = game.settings.get("action-pack-enhanced", "show-unprepared-spells"), this.settingSortAlphabetically = game.settings.get("action-pack-enhanced", "sort-alphabetic"), this.settingShowWeaponMastery = game.settings.get("action-pack-enhanced", "show-weapon-mastery"), e.map((a) => this.prepareActor(a, t));
  }
  prepareActor(e, t) {
    var P, v;
    const a = e.system, s = !!e.itemTypes.feat.find((f) => f.name === "Ritual Adept"), n = e.getFlag("action-pack-enhanced", "weaponSets") || [], i = [];
    for (let f = 0; f < 3; f++) {
      const b = n[f] || { main: null, off: null, active: !1 }, w = { index: f, main: null, off: null, active: b.active };
      if (b.main) {
        const k = fromUuidSync(b.main);
        k && (w.main = { uuid: b.main, img: k.img, rarity: k.system.rarity, name: k.name });
      }
      if (b.off) {
        const k = fromUuidSync(b.off);
        k && (w.off = { uuid: b.off, img: k.img, rarity: k.system.rarity, name: k.name });
      }
      i.push(w);
    }
    let r = {
      equipped: {
        items: [],
        title: "action-pack-enhanced.category.weapon",
        weaponSets: i,
        groups: {
          unequipped: { items: [], title: "action-pack-enhanced.flag.unequipped-title" },
          shield: { items: [], title: "action-pack-enhanced.flag.shield-title" }
        }
      },
      inventory: {
        title: "action-pack-enhanced.category.inventory",
        groups: {
          equipment: { items: [], title: "action-pack-enhanced.category.equipment" },
          consumable: { items: [], title: "action-pack-enhanced.category.consumable" },
          other: { items: [], title: "action-pack-enhanced.category.other" }
        }
      },
      feature: { items: [], title: "action-pack-enhanced.category.feature", groups: this.systemFeatureGroups() },
      legendary: { items: [], title: "action-pack-enhanced.category.legendary" },
      lair: { items: [], title: "action-pack-enhanced.category.lair" },
      spell: {
        title: "action-pack-enhanced.category.spell",
        groups: {
          innate: { items: [], title: "action-pack-enhanced.category.innate" },
          atwill: { items: [], title: "action-pack-enhanced.category.atwill" },
          pact: { items: [], title: "action-pack-enhanced.category.pact" },
          ...[...Array(10).keys()].reduce((f, b) => (f[`spell${b}`] = { items: [], title: `action-pack-enhanced.category.spell${b}`, cost: 0 }, f), {})
        }
      },
      passive: { items: [], title: "action-pack-enhanced.category.passive" }
    };
    const l = ["consumable", "container", "equipment", "feat", "loot", "spell", "tool", "weapon"];
    for (const [f, b] of Object.entries(e.itemTypes))
      if (l.includes(f))
        for (const w of b)
          this._processItem(w, f, r, e, s);
    const d = Object.values(e.spellcastingClasses ?? {}).reduce((f, b) => {
      var k;
      const w = (k = b.system.spellcasting) == null ? void 0 : k.preparation;
      return w != null && w.max && (f.value += w.value ?? 0, f.max += w.max), f;
    }, { value: 0, max: 0 });
    d.max > 0 && (r.spell.prepared = d);
    const c = game.modules.find((f) => f.id === "wm5e") && ((P = game.modules.get("wm5e")) == null ? void 0 : P.active);
    if (e.type === "character" && c && e.itemTypes.feat.find((b) => b.name === "Weapon Mastery" || b.name === "Weapon Master")) {
      const b = e.getFlag("action-pack-enhanced", "masterySelectionPending");
      r.equipped.forceOpen = b;
    }
    const p = (v = game.combat) == null ? void 0 : v.combatants.find((f) => f.actor === e), m = p && !p.initiative, g = game.modules.get("dnd5e-spellpoints"), y = g && (g != null && g.active) ? getSpellPointsItem(e) : null, S = this.sortItems(this.removeEmptySections(r)), x = this.addLegendaryActionUses(
      y ? this.addSpellPointUses(S, y, a) : this.addSpellLevelUses(S, a),
      a
    );
    return {
      actor: e,
      name: e.name,
      sections: x,
      needsInitiative: m,
      skills: CONFIG.DND5E.skills
    };
  }
  _processItem(e, t, a, s, n) {
    var p;
    const i = e.system, r = It(e), l = this.settingShowNoUses || !r || r.available, d = ((p = i == null ? void 0 : i.activities) == null ? void 0 : p.size) > 0, c = e.getFlag("action-pack-enhanced", "hidden");
    if (e.type === "equipment" && (i.identified && i.identifier === "shield" || e.name.includes("Shield")) && (i.equipped ? a.equipped.groups.shield.items.push({ item: e, uses: r }) : a.equipped.groups.unequipped.items.push({ item: e, uses: r })), l && d && !c)
      switch (t) {
        case "feat":
          this._prepareFeat(e, i, r, a);
          break;
        case "spell":
          this._prepareSpell(e, i, r, a, n);
          break;
        case "weapon":
          this._prepareWeapon(e, i, r, a);
          break;
        case "equipment":
          this._prepareEquipment(e, i, r, a);
          break;
        case "consumable":
          this._prepareConsumable(e, i, r, a);
          break;
        case "facility":
          break;
        default:
          this._prepareOther(e, i, r, a);
          break;
      }
    else s.type === "npc" && a.passive.items.push({ item: e, uses: r });
  }
  _prepareFeat(e, t, a, s) {
    var l, d;
    const n = et(e);
    if (n.has("legendary")) {
      s.legendary.items.push({ item: e, uses: a });
      return;
    }
    if (n.has("lair")) {
      s.lair.items.push({ item: e, uses: a });
      return;
    }
    const i = (l = t.type) == null ? void 0 : l.value, r = (d = t.type) == null ? void 0 : d.subtype;
    r && s.feature.groups[r] ? s.feature.groups[r].items.push({ item: e, uses: a }) : i && s.feature.groups[i] ? s.feature.groups[i].items.push({ item: e, uses: a }) : s.feature.groups.general.items.push({ item: e, uses: a });
  }
  _prepareSpell(e, t, a, s, n) {
    var r;
    switch (t == null ? void 0 : t.method) {
      case "spell":
        const l = (t == null ? void 0 : t.prepared) === 1, d = (t == null ? void 0 : t.prepared) === 2, c = n && ((r = t.properties) == null ? void 0 : r.has("ritual")), p = t.level == 0 && this.settingShowUnpreparedCantrips, m = t.level > 0 && this.settingShowUnpreparedSpells;
        (d || l || c || p || m) && s.spell.groups[`spell${t.level}`].items.push({ item: e, uses: a });
        break;
      case "atwill":
        s.spell.groups.atwill.items.push({ item: e, uses: a });
        break;
      case "innate":
        s.spell.groups.innate.items.push({ item: e, uses: a });
        break;
      case "pact":
        s.spell.groups.pact.items.push({ item: e, uses: a });
        break;
    }
  }
  _prepareWeapon(e, t, a, s) {
    const n = e.name === "Unarmed Strike";
    t.equipped || n ? s.equipped.items.push({ item: e, uses: a }) : s.equipped.groups.unequipped.items.push({ item: e, uses: a });
  }
  _prepareEquipment(e, t, a, s) {
    s.inventory.groups.equipment.items.push({ item: e, uses: a });
  }
  _prepareConsumable(e, t, a, s) {
    t.consumableType !== "ammo" && s.inventory.groups.consumable.items.push({ item: e, uses: a });
  }
  _prepareOther(e, t, a, s) {
    s.inventory.groups.other.items.push({ item: e, uses: a });
  }
  systemFeatureGroups() {
    const e = {
      general: {
        items: [],
        title: "General Features"
      }
    };
    return Object.entries(CONFIG.DND5E.featureTypes).reduce((t, a) => {
      if (t[a[0]] = {
        items: [],
        title: a[1].label
      }, a[1].subtypes)
        for (const s in a[1].subtypes)
          t[s] = {
            items: [],
            title: a[1].subtypes[s]
          };
      return t;
    }, e);
  }
  removeEmptySections(e) {
    const t = (a) => {
      if (!a || typeof a != "object")
        return !1;
      const s = Object.keys(a);
      return s.includes("groups") && Object.values(a.groups).some((n) => t(n)) ? !0 : s.includes("items") ? !!a.items.length : Object.values(a).some((n) => t(n));
    };
    return Object.entries(e).reduce((a, [s, n]) => (t(n) && (a[s] = n), a), {});
  }
  addSpellPointUses(e, t, a) {
    var i, r, l, d, c, p, m, g, y;
    const s = {
      0: 0,
      1: 2,
      2: 3,
      3: 5,
      4: 6,
      5: 7,
      6: 9,
      7: 10,
      8: 11,
      9: 13
    }, n = {
      available: ((r = (i = t.system) == null ? void 0 : i.uses) == null ? void 0 : r.value) || 0,
      maximum: ((d = (l = t.system) == null ? void 0 : l.uses) == null ? void 0 : d.max) || 0
    };
    if (e.spell) {
      e.spell.uses = n;
      for (let S = 1; S <= 9; S++) {
        const x = (c = e.spell) == null ? void 0 : c.groups[`spell${S}`];
        x && (x.cost = s[S]);
      }
    }
    return (m = (p = a.spells) == null ? void 0 : p.pact) != null && m.max && ((y = (g = e.spell) == null ? void 0 : g.groups) != null && y.pact) && (e.spell.groups.pact.uses = {
      available: a.spells.pact.value,
      maximum: a.spells.pact.max
    }), e;
  }
  addSpellLevelUses(e, t) {
    var a, s, n, i, r;
    for (let l = 1; l <= 9; l++) {
      const d = (a = e.spell) == null ? void 0 : a.groups[`spell${l}`];
      if (d) {
        const c = t.spells[`spell${l}`];
        d.uses = { available: c.value, maximum: c.max };
      }
    }
    return (n = (s = t.spells) == null ? void 0 : s.pact) != null && n.max && ((r = (i = e.spell) == null ? void 0 : i.groups) != null && r.pact) && (e.spell.groups.pact.uses = {
      available: t.spells.pact.value,
      maximum: t.spells.pact.max
    }), e;
  }
  addLegendaryActionUses(e, t) {
    var s;
    const a = (s = t.resources) == null ? void 0 : s.legact;
    return e.legendary && (a != null && a.max) && (e.legendary.uses = {
      available: Math.max(0, a.max - a.spent),
      maximum: a.max
    }), e;
  }
  sortItems(e) {
    return Object.entries(e).forEach(([t, a]) => {
      t === "items" ? a.sort((s, n) => this.settingSortAlphabetically ? s.item.name.localeCompare(n.item.name) : s.item.sort - n.item.sort) : a && typeof a == "object" && this.sortItems(a);
    }), e;
  }
}
function Rt(o) {
  var n;
  const { updateTray: e, updateTrayState: t } = o, a = !!((n = game.modules.get("dnd5e-spellpoints")) != null && n.active);
  function s() {
    return game.settings.get("action-pack-enhanced", "tray-display") === "always";
  }
  game.settings.register(
    "action-pack-enhanced",
    "tray-display",
    {
      name: "action-pack-enhanced.settings.tray-display",
      hint: "action-pack-enhanced.settings.tray-display-hint",
      scope: "client",
      config: !0,
      default: "auto",
      choices: {
        auto: "action-pack-enhanced.settings.tray-display-auto",
        toggle: "action-pack-enhanced.settings.tray-display-toggle",
        selected: "action-pack-enhanced.settings.tray-display-selected",
        always: "action-pack-enhanced.settings.tray-display-always"
      },
      type: String,
      onChange: () => {
        ui.controls.initialize(), t();
      }
    }
  ), game.settings.register(
    "action-pack-enhanced",
    "assume-default-character",
    {
      name: "action-pack-enhanced.settings.assume-default-character",
      hint: "action-pack-enhanced.settings.assume-default-character-hint",
      scope: "client",
      config: !0,
      default: !0,
      type: Boolean,
      onChange: () => t()
    }
  ), game.settings.register(
    "action-pack-enhanced",
    "icon-size",
    {
      name: "action-pack-enhanced.settings.icon-size",
      scope: "client",
      config: !0,
      default: "medium",
      choices: {
        small: "action-pack-enhanced.settings.icon-size-small",
        medium: "action-pack-enhanced.settings.icon-size-medium",
        large: "action-pack-enhanced.settings.icon-size-large"
      },
      type: String,
      onChange: () => e()
    }
  ), game.settings.register(
    "action-pack-enhanced",
    "tray-size",
    {
      name: "action-pack-enhanced.settings.tray-size",
      scope: "client",
      config: !0,
      default: "large",
      choices: {
        small: "action-pack-enhanced.settings.tray-size-small",
        medium: "action-pack-enhanced.settings.tray-size-medium",
        large: "action-pack-enhanced.settings.tray-size-large"
      },
      type: String,
      onChange: () => e()
    }
  ), game.settings.register(
    "action-pack-enhanced",
    "show-inspiration-animation",
    {
      name: "action-pack-enhanced.settings.show-inspiration-animation",
      hint: "action-pack-enhanced.settings.show-inspiration-animation-hint",
      scope: "client",
      config: !0,
      default: !0,
      type: Boolean,
      onChange: () => e()
    }
  ), game.settings.register(
    "action-pack-enhanced",
    "show-xp-info",
    {
      name: "action-pack-enhanced.settings.show-xp-info",
      hint: "action-pack-enhanced.settings.show-xp-info-hint",
      scope: "client",
      config: !0,
      default: !0,
      type: Boolean,
      onChange: () => e()
    }
  ), game.settings.register(
    "action-pack-enhanced",
    "static-info",
    {
      name: "action-pack-enhanced.settings.static-info",
      hint: "action-pack-enhanced.settings.static-info-hint",
      scope: "client",
      config: !0,
      default: !1,
      type: Boolean,
      onChange: () => e()
    }
  ), game.settings.register(
    "action-pack-enhanced",
    "show-detailed-info",
    {
      name: "action-pack-enhanced.settings.show-detailed-info",
      hint: "action-pack-enhanced.settings.show-detailed-info-hint",
      scope: "client",
      config: !0,
      default: !0,
      type: Boolean,
      onChange: () => e()
    }
  ), game.settings.register(
    "action-pack-enhanced",
    "show-death-saves",
    {
      name: "action-pack-enhanced.settings.show-death-saves",
      hint: "action-pack-enhanced.settings.show-death-saves-hint",
      scope: "client",
      config: !0,
      default: !1,
      type: Boolean,
      onChange: () => e()
    }
  ), game.settings.register(
    "action-pack-enhanced",
    "show-spell-dots",
    {
      name: "action-pack-enhanced.settings.show-spell-dots",
      hint: "action-pack-enhanced.settings.show-spell-dots-hint",
      scope: "client",
      config: !0,
      default: !0,
      type: Boolean,
      onChange: () => e()
    }
  ), game.settings.register(
    "action-pack-enhanced",
    "show-spell-uses",
    {
      name: "action-pack-enhanced.settings.show-spell-uses",
      hint: "action-pack-enhanced.settings.show-spell-uses-hint",
      scope: "client",
      config: !0,
      default: !0,
      type: Boolean,
      onChange: () => e()
    }
  ), game.settings.register(
    "action-pack-enhanced",
    "spellPointsTextColor",
    {
      name: "action-pack-enhanced.settings.spell-points-text-color",
      hint: "action-pack-enhanced.settings.spell-points-text-color-hint",
      scope: "client",
      config: a,
      default: "white",
      choices: {
        aliceblue: "aliceblue",
        antiquewhite: "antiquewhite",
        aqua: "aqua",
        aquamarine: "aquamarine",
        azure: "azure",
        beige: "beige",
        bisque: "bisque",
        black: "black",
        blanchedalmond: "blanchedalmond",
        blue: "blue",
        blueviolet: "blueviolet",
        brown: "brown",
        burlywood: "burlywood",
        cadetblue: "cadetblue",
        chartreuse: "chartreuse",
        chocolate: "chocolate",
        coral: "coral",
        cornflowerblue: "cornflowerblue",
        cornsilk: "cornsilk",
        crimson: "crimson",
        cyan: "cyan",
        darkblue: "darkblue",
        darkcyan: "darkcyan",
        darkgoldenrod: "darkgoldenrod",
        darkgray: "darkgray",
        darkgreen: "darkgreen",
        darkgrey: "darkgrey",
        darkkhaki: "darkkhaki",
        darkmagenta: "darkmagenta",
        darkolivegreen: "darkolivegreen",
        darkorange: "darkorange",
        darkorchid: "darkorchid",
        darkred: "darkred",
        darksalmon: "darksalmon",
        darkseagreen: "darkseagreen",
        darkslateblue: "darkslateblue",
        darkslategray: "darkslategray",
        darkslategrey: "darkslategrey",
        darkturquoise: "darkturquoise",
        darkviolet: "darkviolet",
        deeppink: "deeppink",
        deepskyblue: "deepskyblue",
        dimgray: "dimgray",
        dimgrey: "dimgrey",
        dodgerblue: "dodgerblue",
        firebrick: "firebrick",
        floralwhite: "floralwhite",
        forestgreen: "forestgreen",
        fuchsia: "fuchsia",
        gainsboro: "gainsboro",
        ghostwhite: "ghostwhite",
        gold: "gold",
        goldenrod: "goldenrod",
        gray: "gray",
        green: "green",
        greenyellow: "greenyellow",
        hotpink: "hotpink",
        indianred: "indianred",
        indigo: "indigo",
        ivory: "ivory",
        khaki: "khaki",
        lavender: "lavender",
        lavenderblush: "lavenderblush",
        lawngreen: "lawngreen",
        lemonchiffon: "lemonchiffon",
        lightblue: "lightblue",
        lightcoral: "lightcoral",
        lightcyan: "lightcyan",
        lightgoldenrodyellow: "lightgoldenrodyellow",
        lightgray: "lightgray",
        lightgreen: "lightgreen",
        lightgrey: "lightgrey",
        lightpink: "lightpink",
        lightsalmon: "lightsalmon",
        lightseagreen: "lightseagreen",
        lightskyblue: "lightskyblue",
        lightslategray: "lightslategray",
        lightslategrey: "lightslategrey",
        lightsteelblue: "lightsteelblue",
        lightyellow: "lightyellow",
        lime: "lime",
        limegreen: "limegreen",
        linen: "linen",
        magenta: "magenta",
        maroon: "maroon",
        mediumaquamarine: "mediumaquamarine",
        mediumblue: "mediumblue",
        mediumorchid: "mediumorchid",
        mediumpurple: "mediumpurple",
        mediumseagreen: "mediumseagreen",
        mediumslateblue: "mediumslateblue",
        mediumspringgreen: "mediumspringgreen",
        mediumturquoise: "mediumturquoise",
        mediumvioletred: "mediumvioletred",
        midnightblue: "midnightblue",
        mintcream: "mintcream",
        mistyrose: "mistyrose",
        moccasin: "moccasin",
        navajowhite: "navajowhite",
        navy: "navy",
        oldlace: "oldlace",
        olive: "olive",
        olivedrab: "olivedrab",
        orange: "orange",
        orangered: "orangered",
        orchid: "orchid",
        palegoldenrod: "palegoldenrod",
        palegreen: "palegreen",
        palevioletred: "palevioletred",
        papayawhip: "papayawhip",
        peachpuff: "peachpuff",
        peru: "peru",
        pink: "pink",
        plum: "plum",
        powderblue: "powderblue",
        purple: "purple",
        rebeccapurple: "rebeccapurple",
        red: "red",
        rosybrown: "rosybrown",
        royalblue: "royalblue",
        saddlebrown: "saddlebrown",
        salmon: "salmon",
        sandybrown: "sandybrown",
        seagreen: "seagreen",
        seashell: "seashell",
        sienna: "sienna",
        silver: "silver",
        skyblue: "skyblue",
        slateblue: "slateblue",
        slategray: "slategray",
        slategrey: "slategrey",
        snow: "snow",
        springgreen: "springgreen",
        steelblue: "steelblue",
        tan: "tan",
        teal: "teal",
        thistle: "thistle",
        tomato: "tomato",
        turquoise: "turquoise",
        violet: "violet",
        wheat: "wheat",
        white: "white",
        whitesmoke: "whitesmoke",
        yellow: "yellow",
        yellowgreen: "yellowgreen"
      },
      type: String,
      onChange: () => e()
    }
  ), game.settings.register(
    "action-pack-enhanced",
    "spellPointsBarColorStart",
    {
      name: "action-pack-enhanced.settings.spell-points-bar-color-start",
      hint: "action-pack-enhanced.settings.spell-points-bar-color-start-hint",
      scope: "client",
      config: a,
      default: "black",
      choices: {
        aliceblue: "aliceblue",
        antiquewhite: "antiquewhite",
        aqua: "aqua",
        aquamarine: "aquamarine",
        azure: "azure",
        beige: "beige",
        bisque: "bisque",
        black: "black",
        blanchedalmond: "blanchedalmond",
        blue: "blue",
        blueviolet: "blueviolet",
        brown: "brown",
        burlywood: "burlywood",
        cadetblue: "cadetblue",
        chartreuse: "chartreuse",
        chocolate: "chocolate",
        coral: "coral",
        cornflowerblue: "cornflowerblue",
        cornsilk: "cornsilk",
        crimson: "crimson",
        cyan: "cyan",
        darkblue: "darkblue",
        darkcyan: "darkcyan",
        darkgoldenrod: "darkgoldenrod",
        darkgray: "darkgray",
        darkgreen: "darkgreen",
        darkgrey: "darkgrey",
        darkkhaki: "darkkhaki",
        darkmagenta: "darkmagenta",
        darkolivegreen: "darkolivegreen",
        darkorange: "darkorange",
        darkorchid: "darkorchid",
        darkred: "darkred",
        darksalmon: "darksalmon",
        darkseagreen: "darkseagreen",
        darkslateblue: "darkslateblue",
        darkslategray: "darkslategray",
        darkslategrey: "darkslategrey",
        darkturquoise: "darkturquoise",
        darkviolet: "darkviolet",
        deeppink: "deeppink",
        deepskyblue: "deepskyblue",
        dimgray: "dimgray",
        dimgrey: "dimgrey",
        dodgerblue: "dodgerblue",
        firebrick: "firebrick",
        floralwhite: "floralwhite",
        forestgreen: "forestgreen",
        fuchsia: "fuchsia",
        gainsboro: "gainsboro",
        ghostwhite: "ghostwhite",
        gold: "gold",
        goldenrod: "goldenrod",
        gray: "gray",
        green: "green",
        greenyellow: "greenyellow",
        hotpink: "hotpink",
        indianred: "indianred",
        indigo: "indigo",
        ivory: "ivory",
        khaki: "khaki",
        lavender: "lavender",
        lavenderblush: "lavenderblush",
        lawngreen: "lawngreen",
        lemonchiffon: "lemonchiffon",
        lightblue: "lightblue",
        lightcoral: "lightcoral",
        lightcyan: "lightcyan",
        lightgoldenrodyellow: "lightgoldenrodyellow",
        lightgray: "lightgray",
        lightgreen: "lightgreen",
        lightgrey: "lightgrey",
        lightpink: "lightpink",
        lightsalmon: "lightsalmon",
        lightseagreen: "lightseagreen",
        lightskyblue: "lightskyblue",
        lightslategray: "lightslategray",
        lightslategrey: "lightslategrey",
        lightsteelblue: "lightsteelblue",
        lightyellow: "lightyellow",
        lime: "lime",
        limegreen: "limegreen",
        linen: "linen",
        magenta: "magenta",
        maroon: "maroon",
        mediumaquamarine: "mediumaquamarine",
        mediumblue: "mediumblue",
        mediumorchid: "mediumorchid",
        mediumpurple: "mediumpurple",
        mediumseagreen: "mediumseagreen",
        mediumslateblue: "mediumslateblue",
        mediumspringgreen: "mediumspringgreen",
        mediumturquoise: "mediumturquoise",
        mediumvioletred: "mediumvioletred",
        midnightblue: "midnightblue",
        mintcream: "mintcream",
        mistyrose: "mistyrose",
        moccasin: "moccasin",
        navajowhite: "navajowhite",
        navy: "navy",
        oldlace: "oldlace",
        olive: "olive",
        olivedrab: "olivedrab",
        orange: "orange",
        orangered: "orangered",
        orchid: "orchid",
        palegoldenrod: "palegoldenrod",
        palegreen: "palegreen",
        palevioletred: "palevioletred",
        papayawhip: "papayawhip",
        peachpuff: "peachpuff",
        peru: "peru",
        pink: "pink",
        plum: "plum",
        powderblue: "powderblue",
        purple: "purple",
        rebeccapurple: "rebeccapurple",
        red: "red",
        rosybrown: "rosybrown",
        royalblue: "royalblue",
        saddlebrown: "saddlebrown",
        salmon: "salmon",
        sandybrown: "sandybrown",
        seagreen: "seagreen",
        seashell: "seashell",
        sienna: "sienna",
        silver: "silver",
        skyblue: "skyblue",
        slateblue: "slateblue",
        slategray: "slategray",
        slategrey: "slategrey",
        snow: "snow",
        springgreen: "springgreen",
        steelblue: "steelblue",
        tan: "tan",
        teal: "teal",
        thistle: "thistle",
        tomato: "tomato",
        turquoise: "turquoise",
        violet: "violet",
        wheat: "wheat",
        white: "white",
        whitesmoke: "whitesmoke",
        yellow: "yellow",
        yellowgreen: "yellowgreen"
      },
      type: String,
      onChange: () => e()
    }
  ), game.settings.register(
    "action-pack-enhanced",
    "spellPointsBarColorEnd",
    {
      name: "action-pack-enhanced.settings.spell-points-bar-color-end",
      hint: "action-pack-enhanced.settings.spell-points-bar-color-end-hint",
      scope: "client",
      config: a,
      default: "gray",
      choices: {
        aliceblue: "aliceblue",
        antiquewhite: "antiquewhite",
        aqua: "aqua",
        aquamarine: "aquamarine",
        azure: "azure",
        beige: "beige",
        bisque: "bisque",
        black: "black",
        blanchedalmond: "blanchedalmond",
        blue: "blue",
        blueviolet: "blueviolet",
        brown: "brown",
        burlywood: "burlywood",
        cadetblue: "cadetblue",
        chartreuse: "chartreuse",
        chocolate: "chocolate",
        coral: "coral",
        cornflowerblue: "cornflowerblue",
        cornsilk: "cornsilk",
        crimson: "crimson",
        cyan: "cyan",
        darkblue: "darkblue",
        darkcyan: "darkcyan",
        darkgoldenrod: "darkgoldenrod",
        darkgray: "darkgray",
        darkgreen: "darkgreen",
        darkgrey: "darkgrey",
        darkkhaki: "darkkhaki",
        darkmagenta: "darkmagenta",
        darkolivegreen: "darkolivegreen",
        darkorange: "darkorange",
        darkorchid: "darkorchid",
        darkred: "darkred",
        darksalmon: "darksalmon",
        darkseagreen: "darkseagreen",
        darkslateblue: "darkslateblue",
        darkslategray: "darkslategray",
        darkslategrey: "darkslategrey",
        darkturquoise: "darkturquoise",
        darkviolet: "darkviolet",
        deeppink: "deeppink",
        deepskyblue: "deepskyblue",
        dimgray: "dimgray",
        dimgrey: "dimgrey",
        dodgerblue: "dodgerblue",
        firebrick: "firebrick",
        floralwhite: "floralwhite",
        forestgreen: "forestgreen",
        fuchsia: "fuchsia",
        gainsboro: "gainsboro",
        ghostwhite: "ghostwhite",
        gold: "gold",
        goldenrod: "goldenrod",
        gray: "gray",
        green: "green",
        greenyellow: "greenyellow",
        hotpink: "hotpink",
        indianred: "indianred",
        indigo: "indigo",
        ivory: "ivory",
        khaki: "khaki",
        lavender: "lavender",
        lavenderblush: "lavenderblush",
        lawngreen: "lawngreen",
        lemonchiffon: "lemonchiffon",
        lightblue: "lightblue",
        lightcoral: "lightcoral",
        lightcyan: "lightcyan",
        lightgoldenrodyellow: "lightgoldenrodyellow",
        lightgray: "lightgray",
        lightgreen: "lightgreen",
        lightgrey: "lightgrey",
        lightpink: "lightpink",
        lightsalmon: "lightsalmon",
        lightseagreen: "lightseagreen",
        lightskyblue: "lightskyblue",
        lightslategray: "lightslategray",
        lightslategrey: "lightslategrey",
        lightsteelblue: "lightsteelblue",
        lightyellow: "lightyellow",
        lime: "lime",
        limegreen: "limegreen",
        linen: "linen",
        magenta: "magenta",
        maroon: "maroon",
        mediumaquamarine: "mediumaquamarine",
        mediumblue: "mediumblue",
        mediumorchid: "mediumorchid",
        mediumpurple: "mediumpurple",
        mediumseagreen: "mediumseagreen",
        mediumslateblue: "mediumslateblue",
        mediumspringgreen: "mediumspringgreen",
        mediumturquoise: "mediumturquoise",
        mediumvioletred: "mediumvioletred",
        midnightblue: "midnightblue",
        mintcream: "mintcream",
        mistyrose: "mistyrose",
        moccasin: "moccasin",
        navajowhite: "navajowhite",
        navy: "navy",
        oldlace: "oldlace",
        olive: "olive",
        olivedrab: "olivedrab",
        orange: "orange",
        orangered: "orangered",
        orchid: "orchid",
        palegoldenrod: "palegoldenrod",
        palegreen: "palegreen",
        palevioletred: "palevioletred",
        papayawhip: "papayawhip",
        peachpuff: "peachpuff",
        peru: "peru",
        pink: "pink",
        plum: "plum",
        powderblue: "powderblue",
        purple: "purple",
        rebeccapurple: "rebeccapurple",
        red: "red",
        rosybrown: "rosybrown",
        royalblue: "royalblue",
        saddlebrown: "saddlebrown",
        salmon: "salmon",
        sandybrown: "sandybrown",
        seagreen: "seagreen",
        seashell: "seashell",
        sienna: "sienna",
        silver: "silver",
        skyblue: "skyblue",
        slateblue: "slateblue",
        slategray: "slategray",
        slategrey: "slategrey",
        snow: "snow",
        springgreen: "springgreen",
        steelblue: "steelblue",
        tan: "tan",
        teal: "teal",
        thistle: "thistle",
        tomato: "tomato",
        turquoise: "turquoise",
        violet: "violet",
        wheat: "wheat",
        white: "white",
        whitesmoke: "whitesmoke",
        yellow: "yellow",
        yellowgreen: "yellowgreen"
      },
      type: String,
      onChange: () => e()
    }
  ), game.settings.register(
    "action-pack-enhanced",
    "show-no-uses",
    {
      name: "action-pack-enhanced.settings.show-no-uses",
      hint: "action-pack-enhanced.settings.show-no-uses-hint",
      scope: "client",
      config: !0,
      default: !1,
      type: Boolean,
      onChange: () => e()
    }
  ), game.settings.register(
    "action-pack-enhanced",
    "sort-alphabetic",
    {
      name: "action-pack-enhanced.settings.sort-alphabetic",
      hint: "action-pack-enhanced.settings.sort-alphabetic-hint",
      scope: "client",
      config: !0,
      default: !1,
      type: Boolean,
      onChange: () => e()
    }
  ), game.settings.register(
    "action-pack-enhanced",
    "show-unprepared-cantrips",
    {
      name: "action-pack-enhanced.settings.show-unprepared-cantrips",
      hint: "action-pack-enhanced.settings.show-unprepared-cantrips-hint",
      scope: "client",
      config: !0,
      default: !1,
      type: Boolean,
      onChange: () => e()
    }
  ), game.settings.register(
    "action-pack-enhanced",
    "show-unprepared-spells",
    {
      name: "action-pack-enhanced.settings.show-unprepared-spells",
      hint: "action-pack-enhanced.settings.show-unprepared-spells-hint",
      scope: "client",
      config: !0,
      default: !1,
      type: Boolean,
      onChange: () => e()
    }
  ), game.settings.register(
    "action-pack-enhanced",
    "show-weapon-mastery",
    {
      name: "action-pack-enhanced.settings.show-weapon-mastery",
      hint: "action-pack-enhanced.settings.show-weapon-mastery-hint",
      scope: "client",
      config: !0,
      default: !1,
      type: Boolean,
      onChange: () => e()
    }
  ), game.settings.register(
    "action-pack-enhanced",
    "use-control-button",
    {
      name: "action-pack-enhanced.settings.use-control-button",
      hint: "action-pack-enhanced.settings.use-control-button-hint",
      scope: "client",
      config: !0,
      default: !0,
      type: Boolean,
      onChange: () => window.location.reload()
    }
  ), game.settings.register(
    "action-pack-enhanced",
    "patreon-auth-data",
    {
      scope: "client",
      config: !1,
      default: null,
      type: Object
    }
  ), game.settings.register(
    "action-pack-enhanced",
    "patreon-gm-entitlement",
    {
      scope: "world",
      config: !1,
      default: null,
      type: Object
    }
  ), game.keybindings.register("action-pack-enhanced", "toggle-tray", {
    name: "action-pack-enhanced.keybindings.toggle-tray",
    editable: [
      { key: "KeyE", modifiers: [] }
    ],
    onDown: (i) => {
      s() || ($("#ape-app").toggleClass("is-open"), $("#ape-app .ape-skill-container").removeClass("is-open"));
    }
  });
}
const De = "action-pack-enhanced", at = "https://raw.githubusercontent.com/averagejoe77/action-pack-enhanced/main", zt = `${at}/module.json`, Nt = `${at}/CHANGELOG.md`, Re = 5e3;
class Ht {
  constructor() {
    this.installedVersion = null, this.latestVersion = null, this.hasUpdate = !1, this.changelogEntries = [], this.checked = !1;
  }
  /**
   * Fetches the latest published manifest + changelog and compares against the
   * installed version. Only does real work once per session. Never throws - any
   * failure (offline, GitHub unreachable, unexpected format) just leaves hasUpdate
   * false so the badge quietly shows nothing new rather than breaking the tray.
   */
  async check() {
    if (this.checked) return;
    this.checked = !0;
    const e = game.modules.get(De);
    if (this.installedVersion = (e == null ? void 0 : e.version) ?? null, !!this.installedVersion)
      try {
        const t = await fetch(zt, { cache: "no-store", signal: AbortSignal.timeout(Re) });
        if (!t.ok) return;
        const a = await t.json();
        if (this.latestVersion = a.version ?? null, !this.latestVersion || (this.hasUpdate = foundry.utils.isNewerVersion(this.latestVersion, this.installedVersion), !this.hasUpdate)) return;
        const s = await fetch(Nt, { cache: "no-store", signal: AbortSignal.timeout(Re) });
        if (!s.ok) return;
        const n = await s.text();
        this.changelogEntries = this._parseChangelog(n, this.installedVersion);
      } catch (t) {
        console.warn(`${De} | version check failed`, t);
      }
  }
  /**
   * Parses "## [x.y.z] - date" sections (newest-first, matching this repo's
   * CHANGELOG.md convention) and keeps only entries newer than the installed version.
   */
  _parseChangelog(e, t) {
    const a = [], s = /^##\s*\[([^\]]+)\]\s*-\s*(.+)$/gm, n = [...e.matchAll(s)];
    for (let i = 0; i < n.length; i++) {
      const [r, l, d] = n[i];
      if (!foundry.utils.isNewerVersion(l, t)) break;
      const c = n[i].index + r.length, p = i + 1 < n.length ? n[i + 1].index : e.length, g = [...e.slice(c, p).matchAll(/^-\s+(.+)$/gm)].map((y) => y[1].trim());
      a.push({ version: l, date: d.trim(), items: g });
    }
    return a;
  }
}
const G = new Ht();
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const te = globalThis, ge = te.ShadowRoot && (te.ShadyCSS === void 0 || te.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, st = Symbol(), ze = /* @__PURE__ */ new WeakMap();
let jt = class {
  constructor(e, t, a) {
    if (this._$cssResult$ = !0, a !== st) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (ge && e === void 0) {
      const a = t !== void 0 && t.length === 1;
      a && (e = ze.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), a && ze.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Bt = (o) => new jt(typeof o == "string" ? o : o + "", void 0, st), Lt = (o, e) => {
  if (ge) o.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const a = document.createElement("style"), s = te.litNonce;
    s !== void 0 && a.setAttribute("nonce", s), a.textContent = t.cssText, o.appendChild(a);
  }
}, Ne = ge ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const a of e.cssRules) t += a.cssText;
  return Bt(t);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ft, defineProperty: Wt, getOwnPropertyDescriptor: Gt, getOwnPropertyNames: Vt, getOwnPropertySymbols: Xt, getPrototypeOf: Kt } = Object, O = globalThis, He = O.trustedTypes, Zt = He ? He.emptyScript : "", le = O.reactiveElementPolyfillSupport, V = (o, e) => o, he = { toAttribute(o, e) {
  switch (e) {
    case Boolean:
      o = o ? Zt : null;
      break;
    case Object:
    case Array:
      o = o == null ? o : JSON.stringify(o);
  }
  return o;
}, fromAttribute(o, e) {
  let t = o;
  switch (e) {
    case Boolean:
      t = o !== null;
      break;
    case Number:
      t = o === null ? null : Number(o);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(o);
      } catch {
        t = null;
      }
  }
  return t;
} }, nt = (o, e) => !Ft(o, e), je = { attribute: !0, type: String, converter: he, reflect: !1, useDefault: !1, hasChanged: nt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), O.litPropertyMetadata ?? (O.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let N = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = je) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const a = Symbol(), s = this.getPropertyDescriptor(e, a, t);
      s !== void 0 && Wt(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, a) {
    const { get: s, set: n } = Gt(this.prototype, e) ?? { get() {
      return this[t];
    }, set(i) {
      this[t] = i;
    } };
    return { get: s, set(i) {
      const r = s == null ? void 0 : s.call(this);
      n == null || n.call(this, i), this.requestUpdate(e, r, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? je;
  }
  static _$Ei() {
    if (this.hasOwnProperty(V("elementProperties"))) return;
    const e = Kt(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(V("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(V("properties"))) {
      const t = this.properties, a = [...Vt(t), ...Xt(t)];
      for (const s of a) this.createProperty(s, t[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [a, s] of t) this.elementProperties.set(a, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, a] of this.elementProperties) {
      const s = this._$Eu(t, a);
      s !== void 0 && this._$Eh.set(s, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const a = new Set(e.flat(1 / 0).reverse());
      for (const s of a) t.unshift(Ne(s));
    } else e !== void 0 && t.push(Ne(e));
    return t;
  }
  static _$Eu(e, t) {
    const a = t.attribute;
    return a === !1 ? void 0 : typeof a == "string" ? a : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((t) => t(this));
  }
  addController(e) {
    var t;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((t = e.hostConnected) == null || t.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$EO) == null || t.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const a of t.keys()) this.hasOwnProperty(a) && (e.set(a, this[a]), delete this[a]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Lt(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((t) => {
      var a;
      return (a = t.hostConnected) == null ? void 0 : a.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var a;
      return (a = t.hostDisconnected) == null ? void 0 : a.call(t);
    });
  }
  attributeChangedCallback(e, t, a) {
    this._$AK(e, a);
  }
  _$ET(e, t) {
    var n;
    const a = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, a);
    if (s !== void 0 && a.reflect === !0) {
      const i = (((n = a.converter) == null ? void 0 : n.toAttribute) !== void 0 ? a.converter : he).toAttribute(t, a.type);
      this._$Em = e, i == null ? this.removeAttribute(s) : this.setAttribute(s, i), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var n, i;
    const a = this.constructor, s = a._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const r = a.getPropertyOptions(s), l = typeof r.converter == "function" ? { fromAttribute: r.converter } : ((n = r.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? r.converter : he;
      this._$Em = s;
      const d = l.fromAttribute(t, r.type);
      this[s] = d ?? ((i = this._$Ej) == null ? void 0 : i.get(s)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, t, a, s = !1, n) {
    var i;
    if (e !== void 0) {
      const r = this.constructor;
      if (s === !1 && (n = this[e]), a ?? (a = r.getPropertyOptions(e)), !((a.hasChanged ?? nt)(n, t) || a.useDefault && a.reflect && n === ((i = this._$Ej) == null ? void 0 : i.get(e)) && !this.hasAttribute(r._$Eu(e, a)))) return;
      this.C(e, t, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: a, reflect: s, wrapped: n }, i) {
    a && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, i ?? t ?? this[e]), n !== !0 || i !== void 0) || (this._$AL.has(e) || (this.hasUpdated || a || (t = void 0), this._$AL.set(e, t)), s === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var a;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, i] of this._$Ep) this[n] = i;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [n, i] of s) {
        const { wrapped: r } = i, l = this[n];
        r !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, i, l);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (a = this._$EO) == null || a.forEach((s) => {
        var n;
        return (n = s.hostUpdate) == null ? void 0 : n.call(s);
      }), this.update(t)) : this._$EM();
    } catch (s) {
      throw e = !1, this._$EM(), s;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((a) => {
      var s;
      return (s = a.hostUpdated) == null ? void 0 : s.call(a);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t) => this._$ET(t, this[t]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
N.elementStyles = [], N.shadowRootOptions = { mode: "open" }, N[V("elementProperties")] = /* @__PURE__ */ new Map(), N[V("finalized")] = /* @__PURE__ */ new Map(), le == null || le({ ReactiveElement: N }), (O.reactiveElementVersions ?? (O.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const X = globalThis, Be = (o) => o, ae = X.trustedTypes, Le = ae ? ae.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, it = "$lit$", T = `lit$${Math.random().toFixed(9).slice(2)}$`, ot = "?" + T, Jt = `<${ot}>`, D = document, K = () => D.createComment(""), Z = (o) => o === null || typeof o != "object" && typeof o != "function", fe = Array.isArray, Qt = (o) => fe(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", ce = `[ 	
\f\r]`, W = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Fe = /-->/g, We = />/g, I = RegExp(`>|${ce}(?:([^\\s"'>=/]+)(${ce}*=${ce}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ge = /'/g, Ve = /"/g, rt = /^(?:script|style|textarea|title)$/i, Yt = (o) => (e, ...t) => ({ _$litType$: o, strings: e, values: t }), u = Yt(1), R = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), Xe = /* @__PURE__ */ new WeakMap(), M = D.createTreeWalker(D, 129);
function lt(o, e) {
  if (!fe(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Le !== void 0 ? Le.createHTML(e) : e;
}
const ea = (o, e) => {
  const t = o.length - 1, a = [];
  let s, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", i = W;
  for (let r = 0; r < t; r++) {
    const l = o[r];
    let d, c, p = -1, m = 0;
    for (; m < l.length && (i.lastIndex = m, c = i.exec(l), c !== null); ) m = i.lastIndex, i === W ? c[1] === "!--" ? i = Fe : c[1] !== void 0 ? i = We : c[2] !== void 0 ? (rt.test(c[2]) && (s = RegExp("</" + c[2], "g")), i = I) : c[3] !== void 0 && (i = I) : i === I ? c[0] === ">" ? (i = s ?? W, p = -1) : c[1] === void 0 ? p = -2 : (p = i.lastIndex - c[2].length, d = c[1], i = c[3] === void 0 ? I : c[3] === '"' ? Ve : Ge) : i === Ve || i === Ge ? i = I : i === Fe || i === We ? i = W : (i = I, s = void 0);
    const g = i === I && o[r + 1].startsWith("/>") ? " " : "";
    n += i === W ? l + Jt : p >= 0 ? (a.push(d), l.slice(0, p) + it + l.slice(p) + T + g) : l + T + (p === -2 ? r : g);
  }
  return [lt(o, n + (o[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), a];
};
class J {
  constructor({ strings: e, _$litType$: t }, a) {
    let s;
    this.parts = [];
    let n = 0, i = 0;
    const r = e.length - 1, l = this.parts, [d, c] = ea(e, t);
    if (this.el = J.createElement(d, a), M.currentNode = this.el.content, t === 2 || t === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (s = M.nextNode()) !== null && l.length < r; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const p of s.getAttributeNames()) if (p.endsWith(it)) {
          const m = c[i++], g = s.getAttribute(p).split(T), y = /([.?@])?(.*)/.exec(m);
          l.push({ type: 1, index: n, name: y[2], strings: g, ctor: y[1] === "." ? aa : y[1] === "?" ? sa : y[1] === "@" ? na : ne }), s.removeAttribute(p);
        } else p.startsWith(T) && (l.push({ type: 6, index: n }), s.removeAttribute(p));
        if (rt.test(s.tagName)) {
          const p = s.textContent.split(T), m = p.length - 1;
          if (m > 0) {
            s.textContent = ae ? ae.emptyScript : "";
            for (let g = 0; g < m; g++) s.append(p[g], K()), M.nextNode(), l.push({ type: 2, index: ++n });
            s.append(p[m], K());
          }
        }
      } else if (s.nodeType === 8) if (s.data === ot) l.push({ type: 2, index: n });
      else {
        let p = -1;
        for (; (p = s.data.indexOf(T, p + 1)) !== -1; ) l.push({ type: 7, index: n }), p += T.length - 1;
      }
      n++;
    }
  }
  static createElement(e, t) {
    const a = D.createElement("template");
    return a.innerHTML = e, a;
  }
}
function j(o, e, t = o, a) {
  var i, r;
  if (e === R) return e;
  let s = a !== void 0 ? (i = t._$Co) == null ? void 0 : i[a] : t._$Cl;
  const n = Z(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== n && ((r = s == null ? void 0 : s._$AO) == null || r.call(s, !1), n === void 0 ? s = void 0 : (s = new n(o), s._$AT(o, t, a)), a !== void 0 ? (t._$Co ?? (t._$Co = []))[a] = s : t._$Cl = s), s !== void 0 && (e = j(o, s._$AS(o, e.values), s, a)), e;
}
class ta {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: a } = this._$AD, s = ((e == null ? void 0 : e.creationScope) ?? D).importNode(t, !0);
    M.currentNode = s;
    let n = M.nextNode(), i = 0, r = 0, l = a[0];
    for (; l !== void 0; ) {
      if (i === l.index) {
        let d;
        l.type === 2 ? d = new Y(n, n.nextSibling, this, e) : l.type === 1 ? d = new l.ctor(n, l.name, l.strings, this, e) : l.type === 6 && (d = new ia(n, this, e)), this._$AV.push(d), l = a[++r];
      }
      i !== (l == null ? void 0 : l.index) && (n = M.nextNode(), i++);
    }
    return M.currentNode = D, s;
  }
  p(e) {
    let t = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(e, a, t), t += a.strings.length - 2) : a._$AI(e[t])), t++;
  }
}
class Y {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, a, s) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = a, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = j(this, e, t), Z(e) ? e === h || e == null || e === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : e !== this._$AH && e !== R && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Qt(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== h && Z(this._$AH) ? this._$AA.nextSibling.data = e : this.T(D.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var n;
    const { values: t, _$litType$: a } = e, s = typeof a == "number" ? this._$AC(e) : (a.el === void 0 && (a.el = J.createElement(lt(a.h, a.h[0]), this.options)), a);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === s) this._$AH.p(t);
    else {
      const i = new ta(s, this), r = i.u(this.options);
      i.p(t), this.T(r), this._$AH = i;
    }
  }
  _$AC(e) {
    let t = Xe.get(e.strings);
    return t === void 0 && Xe.set(e.strings, t = new J(e)), t;
  }
  k(e) {
    fe(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let a, s = 0;
    for (const n of e) s === t.length ? t.push(a = new Y(this.O(K()), this.O(K()), this, this.options)) : a = t[s], a._$AI(n), s++;
    s < t.length && (this._$AR(a && a._$AB.nextSibling, s), t.length = s);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var a;
    for ((a = this._$AP) == null ? void 0 : a.call(this, !1, !0, t); e !== this._$AB; ) {
      const s = Be(e).nextSibling;
      Be(e).remove(), e = s;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class ne {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, a, s, n) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = e, this.name = t, this._$AM = s, this.options = n, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = h;
  }
  _$AI(e, t = this, a, s) {
    const n = this.strings;
    let i = !1;
    if (n === void 0) e = j(this, e, t, 0), i = !Z(e) || e !== this._$AH && e !== R, i && (this._$AH = e);
    else {
      const r = e;
      let l, d;
      for (e = n[0], l = 0; l < n.length - 1; l++) d = j(this, r[a + l], t, l), d === R && (d = this._$AH[l]), i || (i = !Z(d) || d !== this._$AH[l]), d === h ? e = h : e !== h && (e += (d ?? "") + n[l + 1]), this._$AH[l] = d;
    }
    i && !s && this.j(e);
  }
  j(e) {
    e === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class aa extends ne {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === h ? void 0 : e;
  }
}
class sa extends ne {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== h);
  }
}
class na extends ne {
  constructor(e, t, a, s, n) {
    super(e, t, a, s, n), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = j(this, e, t, 0) ?? h) === R) return;
    const a = this._$AH, s = e === h && a !== h || e.capture !== a.capture || e.once !== a.once || e.passive !== a.passive, n = e !== h && (a === h || s);
    s && this.element.removeEventListener(this.name, this, a), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class ia {
  constructor(e, t, a) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    j(this, e);
  }
}
const pe = X.litHtmlPolyfillSupport;
pe == null || pe(J, Y), (X.litHtmlVersions ?? (X.litHtmlVersions = [])).push("3.3.2");
const oa = (o, e, t) => {
  const a = (t == null ? void 0 : t.renderBefore) ?? e;
  let s = a._$litPart$;
  if (s === void 0) {
    const n = (t == null ? void 0 : t.renderBefore) ?? null;
    a._$litPart$ = s = new Y(e.insertBefore(K(), n), n, void 0, t ?? {});
  }
  return s._$AI(o), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const U = globalThis;
let A = class extends N {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t;
    const e = super.createRenderRoot();
    return (t = this.renderOptions).renderBefore ?? (t.renderBefore = e.firstChild), e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = oa(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return R;
  }
};
var Ye;
A._$litElement$ = !0, A.finalized = !0, (Ye = U.litElementHydrateSupport) == null || Ye.call(U, { LitElement: A });
const de = U.litElementPolyfillSupport;
de == null || de({ LitElement: A });
(U.litElementVersions ?? (U.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ra = { CHILD: 2 }, la = (o) => (...e) => ({ _$litDirective$: o, values: e });
class ca {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, t, a) {
    this._$Ct = e, this._$AM = t, this._$Ci = a;
  }
  _$AS(e, t) {
    return this.update(e, t);
  }
  update(e, t) {
    return this.render(...t);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class me extends ca {
  constructor(e) {
    if (super(e), this.it = h, e.type !== ra.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(e) {
    if (e === h || e == null) return this._t = void 0, this.it = e;
    if (e === R) return e;
    if (typeof e != "string") throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (e === this.it) return this._t;
    this.it = e;
    const t = [e];
    return t.raw = t, this._t = { _$litType$: this.constructor.resultType, strings: t, values: [] };
  }
}
me.directiveName = "unsafeHTML", me.resultType = 1;
const pa = la(me), da = [
  { name: "Elf", type: "Elf Lineage", values: ["Drow", "High", "Wood"] },
  { name: "Tiefling", type: "Fiendish Legacy", values: ["Abyssal", "Chthonic", "Infernal"] }
];
class ct extends A {
  // Use Light DOM to inherit global styles
  createRenderRoot() {
    return this;
  }
  _onRoll(e) {
    e.preventDefault(), e.stopPropagation(), this.api.rollItem(this.item, e);
  }
  _onRecharge(e) {
    e.preventDefault(), e.stopPropagation(), this.api.rollRecharge(this.item);
  }
  _onDragStart(e) {
    e.dataTransfer.setData("text/plain", JSON.stringify({
      type: "ActionPackItem",
      uuid: this.item.uuid,
      actionPack: !0
    })), e.stopPropagation();
  }
  async _onClick(e) {
    this.expanded = !this.expanded, this.expanded && !this.description && (this.description = await this.api.getItemDescription(this.item));
  }
  _toggleQtyInput(e) {
    e.stopPropagation();
    const t = e.currentTarget, a = t.nextElementSibling;
    t.style.display = "none", a.style.display = "inline-block", a.focus(), a.select();
  }
  _finishQtyEdit(e) {
    const t = e.currentTarget, a = t.previousElementSibling;
    t.style.display = "none", a.style.display = "";
  }
  _qtyInputKey(e) {
    e.key === "Enter" && e.currentTarget.blur();
  }
  _onTogglePrepared(e) {
    e.preventDefault(), e.stopPropagation(), this.api.toggleSpellPrepared(this.item);
  }
  _onDelete(e) {
    e.preventDefault(), e.stopPropagation(), this.api.deleteItem(this.item);
  }
  render() {
    var we, _e, Se, Ae, Ce, xe, Ee, Te, Oe, Pe, Ie, Me, qe;
    if (!this.item) return h;
    const e = this.item.system, t = this.item.actor, a = e.rarity !== "" ? e.rarity : this.item.type === "weapon" ? "common" : "", s = this.item.type === "spell", n = e.method === "innate", i = this.uses && (!s || n), r = (we = e.properties) == null ? void 0 : we.has("ritual"), l = (_e = e.properties) == null ? void 0 : _e.has("concentration"), d = et(this.item), c = d.has("bonus"), p = d.has("reaction"), m = d.has("legendary"), g = d.has("lair"), y = (Se = this.item) == null ? void 0 : Se.hasRecharge, S = !this.item.isOnCooldown, x = e.equipped, P = this.item.type === "equipment" && (e.identified && e.identifier === "shield" || this.item.name.includes("Shield"));
    let v = null;
    if (this.item.type === "weapon" && ((Ae = e.ammunition) != null && Ae.type)) {
      const F = (e.ammunitionOptions ?? []).reduce((bt, vt) => bt + (vt.item.system.quantity || 0), 0), Ue = (Ee = (xe = (Ce = CONFIG.DND5E.consumableTypes) == null ? void 0 : Ce.ammo) == null ? void 0 : xe.subtypes) == null ? void 0 : Ee[e.ammunition.type];
      v = { label: Ue ? game.i18n.localize(Ue) : e.ammunition.type, total: F };
    }
    let f = null;
    if (y && ((Te = e.uses) != null && Te.recovery)) {
      const _ = e.uses.recovery.find((F) => F.period === "recharge");
      _ && (f = _.formula);
    }
    let b = !1, w = !1, k = "";
    if (game.modules.find((_) => _.id === "wm5e") && ((Oe = game.modules.get("wm5e")) != null && Oe.active) && (b = e.mastery || !1, b && this.item.type === "weapon")) {
      const _ = (Pe = e.type) == null ? void 0 : Pe.baseItem, F = new Set(this.masteryIds || ((qe = (Me = (Ie = t.system.traits) == null ? void 0 : Ie.weaponProf) == null ? void 0 : Me.mastery) == null ? void 0 : qe.value) || []);
      w = _ && F.has(_), k = game.i18n.localize(`action-pack-enhanced.masteries.${b}`);
    }
    const z = !!t.itemTypes.feat.find((_) => _.name === "Ritual Adept"), L = e.prepared === 0 && !(r && z);
    let ie = !1;
    L && !this.canManage && (ie = !0, `${game.i18n.localize("action-pack-enhanced.flag.unprepared-title")}${game.i18n.localize("action-pack-enhanced.flag.unprepared")}`);
    const ft = this.canManage && e.quantity !== void 0, yt = this.canManage && s && e.method === "spell" && e.prepared !== 2;
    return u`
            <div class="item-name rollable flexrow ${L && !this.canManage ? "unprepared" : ""}">
                ${this.canManage ? u`
                    <div class="delete-item flag" title="${game.i18n.localize("action-pack-enhanced.manage.delete-item-title")}" @mousedown="${this._onDelete}">
                        <i class="fas fa-trash"></i>
                    </div>
                ` : h}
                <div class="item-image ${a}${L && !this.canManage ? " unprepared" : ""}"
                        style="background-image: url('${this.item.img}')"
                        @mousedown="${this._onRoll}">
                    <i class="fa fa-dice-d20"></i>
                </div>

                <div class="item-name-wrap flexrow">
                    <h4 @mousedown="${this._onClick}">
                        <span class="item-text ${a}">${this.item.name}</span>
                        ${i ? u` (${this.uses.available}${this.uses.maximum ? "/" + this.uses.maximum : ""})` : h}
                        ${v ? u` <span class="item-ammo">(${v.label}: ${v.total})</span>` : h}
                    </h4>
                    ${this.showWeaponMastery ? this._renderWeaponMastery(b, w, k) : h}
                </div>

                ${ft ? u`
                    <span class="item-qty" title="${game.i18n.localize("action-pack-enhanced.manage.quantity-title")}">
                        <span class="item-qty-display" @mousedown="${(_) => _.stopPropagation()}" @click="${this._toggleQtyInput}">x${e.quantity}</span>
                        <input type="text" class="item-qty-input" value="${e.quantity}"
                            style="display:none"
                            @mousedown="${(_) => _.stopPropagation()}"
                            @blur="${this._finishQtyEdit}"
                            @keydown="${this._qtyInputKey}"
                            @change="${(_) => this.api.updateItemQuantity(this.item, parseInt(_.target.value))}">
                    </span>
                ` : h}

                ${r ? u`<div class="ritual flag" title="${game.i18n.localize("action-pack-enhanced.flag.ritual-title")}"></div>` : h}
                ${l ? u`<div class="concentration flag" title="${game.i18n.localize("action-pack-enhanced.flag.concentration-title")}"></div>` : h}
                ${c ? u`<div class="bonus flag" title="${game.i18n.localize("action-pack-enhanced.flag.bonus-title")}">${game.i18n.localize("action-pack-enhanced.flag.bonus")}</div>` : h}
                ${p ? u`<div class="reaction flag" title="${game.i18n.localize("action-pack-enhanced.flag.reaction-title")}">${game.i18n.localize("action-pack-enhanced.flag.reaction")}</div>` : h}
                ${m ? u`<div class="legendary flag" title="${game.i18n.localize("action-pack-enhanced.flag.legendary-title")}">${game.i18n.localize("action-pack-enhanced.flag.legendary")}</div>` : h}
                ${g ? u`<div class="lair flag" title="${game.i18n.localize("action-pack-enhanced.flag.lair-title")}">${game.i18n.localize("action-pack-enhanced.flag.lair")}</div>` : h}

                ${y ? S ? u`<div class="flag"><i class="fas fa-bolt"></i></div>` : u`<div class="flag"><a class="rollable item-recharge" @mousedown="${this._onRecharge}"><i class="fas fa-dice-six"></i> ${f}+</a></div>` : h}

                ${yt && !ie ? u`
                    <div class="prepared-toggle flag ${L ? "unprepared" : "prepared"}"
                        title="${game.i18n.localize(L ? "action-pack-enhanced.manage.unprepared-toggle-title" : "action-pack-enhanced.manage.prepared-title")}"
                        @mousedown="${this._onTogglePrepared}">
                        <i class="${e.prepared === 1 ? "fas" : "far"} fa-sun"></i>
                    </div>
                ` : ie ? u`<div class="unprepared flag" title="${game.i18n.localize("action-pack-enhanced.flag.unprepared-title")}">${game.i18n.localize("action-pack-enhanced.flag.unprepared")}</div>` : h}
                ${(this.item.type === "weapon" || P) && !x ? u`<div class="unequipped flag" title="${game.i18n.localize("action-pack-enhanced.flag.unequipped-title")}" @mousedown="${this._onEquip}">${game.i18n.localize("action-pack-enhanced.flag.unequipped")}</div>` : h}
                
            </div>

            <div class="item-drag-handle"
                    draggable="true"
                    title="${game.i18n.localize("action-pack-enhanced.drag-to-target")}"
                    @dragstart="${this._onDragStart}">
                <i class="fas fa-grip-vertical"></i>
            </div>

            ${this.expanded ? u`
                <div class="item-summary" style="display:block">
                    ${this._renderItemDetails()}
                    ${this.description ? u`<p>${pa(this.description.description)}</p>` : u`<i class="fas fa-spinner fa-spin"></i>`}
                    <div class="item-properties">
                        ${this._renderItemProperties(this.item)}
                    </div>
                </div>
            ` : h}
        `;
  }
  _onEquip(e) {
    e.preventDefault(), e.stopPropagation(), this.item.update({ "system.equipped": !0 });
  }
  _renderItemDetails() {
    const e = this.item, t = e.actor;
    let a = At(e), s = null;
    return e.type === "spell" && e.getFlag("dnd5e", "advancementOrigin") && (s = this._getItemSource(e, t)), u`
            ${s ? u`<p><strong>Source:</strong> ${s.name} (${s.type})</p>` : h}
            ${a.school ? u`<p><strong>School:</strong> ${a.school}</p>` : h}
            ${a.castingTime ? u`<p><strong>Casting Time:</strong> ${a.castingTime}</p>` : h}
            ${a.range ? u`<p><strong>Range:</strong> ${a.range}</p>` : h}
            ${a.duration ? u`<p><strong>Duration:</strong> ${a.duration}</p>` : h}
            ${a.materials ? u`<p><strong>Materials:</strong> ${a.materials}</p>` : h}
        `;
  }
  _renderItemProperties(e) {
    var n, i, r, l, d;
    const t = ((n = e == null ? void 0 : e.labels) == null ? void 0 : n.properties) || [], a = e.labels.hasOwnProperty("damageTypes") ? (r = (i = e == null ? void 0 : e.labels) == null ? void 0 : i.damageTypes) != null && r.includes(",") ? (l = e == null ? void 0 : e.labels) == null ? void 0 : l.damageTypes.split(",") : [(d = e == null ? void 0 : e.labels) == null ? void 0 : d.damageTypes] : [], s = [];
    if (a.length > 0) {
      const p = a.map((m) => ({ label: m })).map((m) => m.label);
      s.push(...p);
    }
    if (t.length > 0) {
      const c = t.map((p) => p.label);
      c.sort((p, m) => p.toLowerCase().localeCompare(m.toLowerCase())), s.push(...c);
    }
    return s.length === 0 ? h : u`
            ${s ? u`${s.map((c) => u`<span class="tag">${c}</span>`)} ` : h}
        `;
  }
  _renderWeaponMastery(e, t, a) {
    var s;
    return (s = game.modules.get("wm5e")) != null && s.active && e ? u`<div class="mastery ${t ? "active" : "inactive"} flag">${a}</div>` : h;
  }
  _getItemSource(e, t) {
    var n, i;
    let a = null;
    const s = (i = (n = e.flags) == null ? void 0 : n.dnd5e) == null ? void 0 : i.advancementOrigin;
    if (s) {
      const r = s.split(".");
      if (r.length >= 1) {
        const l = r[0], d = t.items.get(l);
        if (d && d.type === "feat")
          a = { name: `${d.name}`, type: `${d.system.type.label}` };
        else if (d && d.type === "race") {
          const c = d.name;
          let p = "";
          const m = c.split(", ")[0], g = c.split(", ")[1], y = da.find((S) => S.name === m && S.values.includes(g));
          y ? p = `${g} ${y.type}` : p = "Species Trait", a = { name: `${m}`, type: `${p}` };
        } else
          a = null;
      }
    }
    return a;
  }
}
E(ct, "properties", {
  // Foundry mutates Item documents in place, so the reference passed down never
  // changes even when system.prepared/quantity/etc. do. Force a re-render on every
  // reassignment instead of relying on Lit's default reference-equality check.
  item: { type: Object, hasChanged: () => !0 },
  uses: { type: Object },
  api: { type: Object },
  masteryIds: { type: Array },
  expanded: { type: Boolean, state: !0 },
  description: { type: Object, state: !0 },
  showWeaponMastery: { type: Boolean },
  canManage: { type: Boolean }
});
customElements.define("ape-item", ct);
class pt extends A {
  _openJournal(e) {
    fromUuid(e).then((t) => {
      var a;
      return (a = t == null ? void 0 : t.sheet) == null ? void 0 : a.render(!0);
    });
  }
  constructor() {
    super(), this.isOpen = !0;
  }
  createRenderRoot() {
    return this;
  }
  updated(e) {
    this.classList.toggle("is-open", this.isOpen), e.has("forceOpen") && this.forceOpen && (this.isOpen || (this.isOpen = !0));
  }
  _toggleOpen(e) {
    e.stopPropagation(), this.isOpen = !this.isOpen;
  }
  _onAddItem(e) {
    e.stopPropagation(), this.api.addItemFromCompendium(this.actor, this.sectionId === "spell" ? "spell" : "inventory");
  }
  _onDrop(e, t, a) {
    e.preventDefault();
    const s = JSON.parse(e.dataTransfer.getData("text/plain"));
    s.uuid && this.api.setWeaponSetItem(this.actor, t, a, s.uuid, s.rarity);
  }
  _renderWeaponSets() {
    return this.weaponSets ? u`
            <div class="ape-weapon-sets">
                ${this.weaponSets.map((e) => u`
                    <div class="ape-weapon-set ${e.active ? "active" : ""}" @click="${() => this.api.equipWeaponSet(this.actor, e.index)}">
                        <div class="ape-weapon-slot ${e.main ? "filled " + e.main.rarity : "empty"}" 
                                @drop="${(t) => this._onDrop(t, e.index, "main")}" 
                                @dragover="${(t) => t.preventDefault()}"
                                @contextmenu="${(t) => this.api.clearWeaponSetItem(this.actor, e.index, "main")}">
                            ${e.main ? u`<img src="${e.main.img}" title="${e.main.name}">` : u`<i class="fas fa-sword"></i>`}
                        </div>
                        <div class="ape-weapon-slot ${e.off ? "filled " + e.off.rarity : "empty"}" 
                                @drop="${(t) => this._onDrop(t, e.index, "off")}" 
                                @dragover="${(t) => t.preventDefault()}"
                                @contextmenu="${(t) => this.api.clearWeaponSetItem(this.actor, e.index, "off")}">
                            ${e.off ? u`<img src="${e.off.img}" title="${e.off.name}" style="height: 100%; width: auto;">` : u`<i class="fas fa-shield"></i>`}
                        </div>
                    </div>
                `)}
            </div>
        ` : h;
  }
  _getReversedPercent(e, t) {
    return Math.floor((t - e) / t * 100);
  }
  render() {
    const e = this.canManage && (this.sectionId === "inventory" || this.sectionId === "spell");
    return u`
            ${this.title ? u`
                <h2 @click="${this._toggleOpen}">
                    <span class="ape-section-arrow"><i class="fas fa-caret-down"></i> ${game.i18n.localize(this.title)}</span>
                    ${this.prepared ? u`
                        <span class="section-prepared" title="${game.i18n.localize("action-pack-enhanced.manage.prepared-count-title")}">${this.prepared.value}/${this.prepared.max} prepared</span>
                    ` : h}
                    ${e ? u`
                        <span class="ape-add-item" title="${game.i18n.localize(this.sectionId === "spell" ? "action-pack-enhanced.manage.add-spell-title" : "action-pack-enhanced.manage.add-item-title")}" @click="${this._onAddItem}">
                            <i class="fas fa-plus"></i>
                        </span>
                    ` : h}
                </h2>
            ` : h}

            ${this.uses ? u`<div class="section-uses" style="--percent: ${this._getReversedPercent(this.uses.available, this.uses.maximum)}%; --spellPointsTextColor: ${game.settings.get("action-pack-enhanced", "spellPointsTextColor")}; --spellPointsBarColorStart: ${game.settings.get("action-pack-enhanced", "spellPointsBarColorStart")}; --spellPointsBarColorEnd: ${game.settings.get("action-pack-enhanced", "spellPointsBarColorEnd")}">
                <div class="section-uses-text">${this.uses.available} / ${this.uses.maximum}</div>
                <div class="section-uses-bar"></div>
            </div>` : h}

            ${this._renderWeaponSets()}

            ${this.items && this.items.length > 0 ? u`
                <div class="ape-items">
                    ${this.items.map((t) => {
      var a, s, n, i, r;
      return u`
                        <ape-item class="ape-item item"
                            data-item-uuid="${t.item.uuid}"
                            .item="${t.item}"
                            .uses="${t.uses}"
                            .api="${this.api}"
                            .masteryIds="${(r = (i = (n = (s = (a = this.actor) == null ? void 0 : a.system) == null ? void 0 : s.traits) == null ? void 0 : n.weaponProf) == null ? void 0 : i.mastery) == null ? void 0 : r.value}"
                            .showWeaponMastery="${this.showWeaponMastery}"
                            .canManage="${this.canManage}">
                        </ape-item>
                    `;
    })}
                </div>
            ` : h}

            ${this.groups ? Object.entries(this.groups).map(([t, a]) => u`
                <ape-group
                    class="ape-group"
                    .group="${a}"
                    .groupName="${t}"
                    .api="${this.api}"
                    .actor="${this.actor}"
                    .showSpellDots="${this.showSpellDots}"
                    .showSpellUses="${this.showSpellUses}"
                    .canManage="${this.canManage}">
                </ape-group>
            `) : h}
        `;
  }
}
E(pt, "properties", {
  title: { type: String },
  uses: { type: Object },
  prepared: { type: Object },
  // { value, max } - prepared spell count/limit (spell section only)
  items: { type: Array },
  // Array of {item, uses} objects
  weaponSets: { type: Array },
  // Array of Weapon Sets
  groups: { type: Object },
  // Object of groups
  sectionId: { type: String },
  isOpen: { type: Boolean, state: !0 },
  api: { type: Object },
  showSpellDots: { type: Boolean },
  showSpellUses: { type: Boolean },
  actor: { type: Object },
  masteries: { type: Object },
  forceOpen: { type: Boolean },
  showWeaponMastery: { type: Boolean },
  canManage: { type: Boolean }
});
customElements.define("ape-section", pt);
class dt extends A {
  constructor() {
    var e;
    super(), this.isOpen = !0, this.showCost = !!((e = game.modules.get("dnd5e-spellpoints")) != null && e.active);
  }
  createRenderRoot() {
    return this;
  }
  updated(e) {
    e.has("isOpen") && this.classList.toggle("is-open", this.isOpen), e.has("groupName") && (this.dataset.groupId = this.groupName);
  }
  _toggleOpen(e) {
    e.target.closest(".group-dots") || (this.isOpen = !this.isOpen);
  }
  render() {
    if (!this.group) return h;
    const { items: e, uses: t, title: a, cost: s } = this.group, n = e && e.length > 0, i = t && t.maximum, r = s || null;
    if (!n && !i) return h;
    const l = i && this.showSpellDots, d = t && this.showSpellUses, c = r && this.showCost, p = [
      "flexrow",
      "ape-group-header",
      l ? "has-dots" : "",
      d ? "has-uses" : "",
      c ? "has-cost" : ""
    ].filter(Boolean).join(" ");
    return u`
            <div class="${p}" @click="${this._toggleOpen}">
                <h3>
                    <i class="fas fa-caret-down"></i> ${game.i18n.localize(a)}
                </h3>
                ${l ? this._renderDots(t) : h}
                ${d ? u`<div class="group-uses">${t.available}/${t.maximum}</div>` : h}
                ${c ? u`<div class="group-cost">Cost: ${s} SP</div>` : h}
            </div>

            ${n ? u`
                <div class="ape-items">
                    ${e.map((m) => u`
                        <ape-item class="ape-item item" data-item-uuid="${m.item.uuid}" .item="${m.item}" .uses="${m.uses}" .api="${this.api}" .canManage="${this.canManage}"></ape-item>
                    `)}
                </div>
            ` : h}
        `;
  }
  _renderDots(e) {
    return u`
            <div class="group-dots" data-group-name="${this.groupName}">
                ${Array.from({ length: e.maximum }).map((t, a) => u`
                    <div class="dot ${a < e.available ? "" : "empty"}" 
                        data-slot="${a}"
                        @click="${(s) => {
      s.stopPropagation(), this.api.adjustSpellSlot(this.actor, this.groupName, a);
    }}">
                    </div>
                `)}
            </div>
        `;
  }
}
E(dt, "properties", {
  group: { type: Object },
  groupName: { type: String },
  api: { type: Object },
  actor: { type: Object },
  showSpellDots: { type: Boolean },
  showSpellUses: { type: Boolean },
  showCost: { type: Boolean },
  isOpen: { type: Boolean, state: !0 },
  forceOpen: { type: Boolean },
  canManage: { type: Boolean }
});
customElements.define("ape-group", dt);
class ut extends A {
  createRenderRoot() {
    return this;
  }
  updated(e) {
    e.has("actorData") && this.actorData && (this.dataset.actorUuid = this.actorData.actor.uuid);
  }
  render() {
    if (!this.actorData) return h;
    const { actor: e, name: t, sections: a, needsInitiative: s } = this.actorData, n = e.system.attributes.hp, i = e.system.attributes.ac.value, r = e.type, l = n.value <= 0 && r === "character", d = e.system.attributes.inspiration;
    return u`
            <div class="ape-actor-header">
                <div class="ape-actor-header-wrap">
                    <a class="ape-actor-name" @click="${(c) => this.api.openSheet(e)}">${t.split(" ")[0]}</a>
                    <a class="ape-actor-inspiration ${d ? "ape-actor-inspiration-active" : ""}" title="${t} is ${d ? "inspired" : "not inspired"}!" @mousedown="${(c) => this.api.toggleInspiration(e, c)}">
                        <svg width="100%" height="100%" viewBox="0 0 163 191" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
                            <path class="${game.settings.get("action-pack-enhanced", "show-inspiration-animation") ? "animated" : ""}" d="M58.699,71.415l0,63.404"/>
                            <path class="${game.settings.get("action-pack-enhanced", "show-inspiration-animation") ? "animated" : ""}" d="M78.624,71.415l0,63.404"/>
                            <path class="${game.settings.get("action-pack-enhanced", "show-inspiration-animation") ? "animated" : ""}" d="M97.63,71.415l0,63.404"/>
                            <path class="${game.settings.get("action-pack-enhanced", "show-inspiration-animation") ? "animated" : ""}" d="M35.88,149.717c-4.526,3.624 -16.665,18.643 -20.574,22.552c30.949,15.518 96.969,17.912 122.372,-1.233c-4.18,-4.18 -18.011,-21.744 -18.295,-22.22c-0.881,9.201 -82.394,9.898 -83.502,0.9Zm-0.489,-101.365l83.626,0.267c0,0 0.366,79.504 0.366,100.197c0,9.081 -83.502,9.982 -83.502,0.9c0,-14.9 -0.489,-101.365 -0.489,-101.365Zm83.714,16.03c0,0 29.622,-0.424 33.244,2.76c4.154,3.651 6.015,31.36 0.334,41.72c-5.681,10.36 -33.166,19.636 -33.166,19.636l-0.412,-64.116Z"/>
                            <path id="foam" class="ape-actor-inspiration-foam ${d ? "ape-actor-inspiration-foam-active" : "ape-actor-inspiration-foam-hidden"} ${game.settings.get("action-pack-enhanced", "show-inspiration-animation") ? "animated" : ""}" d="M26.53,76.061c0,0 -24.573,-12.245 -19.621,-37.499c4.953,-25.254 36.384,-1.701 38.194,-0.34c1.81,1.361 -8.286,-33.928 21.049,-31.887c29.336,2.041 31.382,19.982 31.478,26.19c0.095,6.207 8.138,-23.223 34.718,-8.503c17.811,9.864 8.665,25.224 5.33,29.251c-3.364,4.062 -9.328,9.305 -14.471,11.091c-4.583,1.591 -20.853,3.096 -29.719,-11.516c-1.238,-2.041 -0.932,15.302 -9.097,16.357c-3.908,0.505 -14.578,3.667 -23.477,-13.095c-10.105,33.947 -34.384,19.951 -34.384,19.951Z"/>
                        </svg>
                    </a>
                    <span class="ape-actor-ac">
                        <img class="ape-actor-ac-icon" src="/modules/action-pack-enhanced/images/ac-icon.svg">
                        <span class="ape-actor-ac-display">${i}</span>
                    </span>
                </div>
            </div>

            ${this.globalData.staticInfo ? u`
                <div class="ape-static-info">
                    ${r === "character" ? u`
                        <div class="ape-actor-race-class">
                            ${this._renderRaceClass(e)}
                        </div>
                    ` : h}

                    ${game.settings.get("action-pack-enhanced", "show-detailed-info") ? this._renderPlayerInfo(e) : h}

                    ${game.settings.get("action-pack-enhanced", "show-xp-info") && r === "character" ? this._renderExperience(e) : h}

                    ${this._renderHpBar(e, n)}

                    ${this._renderRestButtons(e)}
                    
                </div>
            ` : u`
                <div class="ape-accordion ${this._infoOpen ? "is-open" : ""}">
                    <h2 class="ape-accordion-header" @click="${() => this._toggleAccordion("info")}">
                        <i class="fas fa-caret-down"></i> XP/HP/Rest
                    </h2>
                    <div class="ape-accordion-body">
                        ${r === "character" ? u`
                            <div class="ape-actor-race-class">
                                ${this._renderRaceClass(e)}
                            </div>
                        ` : h}

                        ${game.settings.get("action-pack-enhanced", "show-detailed-info") ? this._renderPlayerInfo(e) : h}

                        ${game.settings.get("action-pack-enhanced", "show-xp-info") ? this._renderExperience(e) : h}

                        ${this._renderHpBar(e, n)}

                        ${this._renderRestButtons(e)}
                    </div>
                </div>
            `}

            ${l && !game.settings.get("action-pack-enhanced", "show-death-saves") ? this._renderDeathSaves(e) : h}

            ${s ? u`
                <div class="ape-initiative" @click="${() => this.api.rollInitiative(e)}">
                    <i class="fas fa-swords ape-initiative-icon"></i>
                    <span class="ape-initiative-text">${game.i18n.localize("action-pack-enhanced.roll-initiative")}</span>
                </div>
            ` : h}

            ${this._renderConditions(e)}

            <div class="ape-accordion ${this._abilitiesOpen ? "is-open" : ""}">
                <h2 class="ape-accordion-header" @click="${() => this._toggleAccordion("abilities")}">
                    <i class="fas fa-caret-down"></i> Ability Checks/Saves
                </h2>
                <div class="ape-accordion-body">
                    ${this._renderAbilities(e)}
                </div>
            </div>


            ${this._renderSkills(e)}

            <!-- Sections -->
            ${this._renderSections(e, a)}
        `;
  }
  _renderExperience(e) {
    const t = e.system.details, a = t.xp.pct, s = t.xp.max, n = t.xp.min, i = t.xp.value;
    return u`
            <div class="ape-actor-xp bar-group">
                <div class="bar-label">
                    <span>XP</span>
                    <span class="ape-actor-xp-info">
                        <span class="ape-actor-xp-current" @click="${this._toggleXpActions}">${i}</span>
                        <span class="ape-actor-xp-separator"> / </span>
                        <span class="ape-actor-xp-max">${s}</span>
                    </span>
                </div>
                <div class="bar-track ape-actor-xp-bar"><div class="bar-fill xp-fill" style="width: ${a}%"></div></div>
                <div class="ape-actor-xp-actions ${this._xpActionsOpen ? "active" : "inactive"}">
                    <button class="ape-actor-xp-close" @click="${this._toggleXpActions}">close</button>
                    <p>Choose an amount to add to or subtract from ${e.name}'s XP</p>
                    <div class="ape-actor-xp-increment">
                        <button class="ape-actor-xp-button" ?disabled="${i >= s}" @click="${() => this.api.updateXP(e, i + 1)}">+1</button>
                        <button class="ape-actor-xp-button" ?disabled="${i >= s}" @click="${() => this.api.updateXP(e, i + 10)}">+10</button>
                        <button class="ape-actor-xp-button" ?disabled="${i >= s}" @click="${() => this.api.updateXP(e, i + 100)}">+100</button>
                        <button class="ape-actor-xp-button" ?disabled="${i >= s}" @click="${() => this.api.updateXP(e, i + 1e3)}">+1000</button>
                    </div>
                    <div class="ape-actor-xp-decrement">
                        <button class="ape-actor-xp-button" ?disabled="${i <= n}" @click="${() => this.api.updateXP(e, i - 1)}">-1</button>
                        <button class="ape-actor-xp-button" ?disabled="${i <= n}" @click="${() => this.api.updateXP(e, i - 10)}">-10</button>
                        <button class="ape-actor-xp-button" ?disabled="${i <= n}" @click="${() => this.api.updateXP(e, i - 100)}">-100</button>
                        <button class="ape-actor-xp-button" ?disabled="${i <= n}" @click="${() => this.api.updateXP(e, i - 1e3)}">-1000</button>
                    </div>
                    <div class="ape-actor-xp-max">
                        <button class="ape-actor-xp-button" ?disabled="${i >= s}" @click="${() => this.api.updateXP(e, s)}">Max</button>
                    </div>
                </div>
            </div>
        `;
  }
  _toggleXpActions() {
    this._xpActionsOpen = !this._xpActionsOpen, this.requestUpdate();
  }
  _toggleAccordion(e) {
    this[`_${e}Open`] = !this[`_${e}Open`], this.requestUpdate();
  }
  _renderRaceClass(e) {
    const t = Pt(e);
    return u`<div style="display:contents" .innerHTML="${t}"></div>`;
  }
  _renderPlayerInfo(e) {
    var g, y, S, x, P;
    const t = e.system.traits ?? {}, a = ((g = e.system.attributes) == null ? void 0 : g.senses) ?? {}, s = (v, f) => {
      const b = t[v], w = Array.from((b == null ? void 0 : b.value) ?? []).map((z) => dnd5e.documents.Trait.keyLabel(z, { trait: f })), k = dnd5e.utils.splitSemicolons((b == null ? void 0 : b.custom) ?? "");
      return [...w, ...k];
    }, n = a.units ?? "ft", i = Object.entries(a.ranges ?? {}).filter(([, v]) => v > 0).map(([v, f]) => `${CONFIG.DND5E.senses[v] ?? v}: ${f}${n}`), r = ((y = e.system.attributes) == null ? void 0 : y.movement) ?? {}, l = r.units ?? "ft", d = Object.entries(CONFIG.DND5E.movementTypes).filter(([v, f]) => !f.hidden && (r[v] || v === "walk")).map(([v, f]) => `${v === "fly" && r.hover ? game.i18n.format("DND5E.MOVEMENT.HoverSpeed", { speed: f.label }) : f.label}: ${r[v] ?? 0}${l}`), c = /* @__PURE__ */ new Map();
    for (const v of e.itemTypes.weapon) {
      const f = (S = v.system.type) == null ? void 0 : S.baseItem;
      f && !c.has(f) && c.set(f, v);
    }
    const p = Array.from(((P = (x = t.weaponProf) == null ? void 0 : x.mastery) == null ? void 0 : P.value) ?? []).map((v) => {
      var k, z;
      const f = dnd5e.documents.Trait.keyLabel(v, { trait: "weapon" }), b = (k = c.get(v)) == null ? void 0 : k.system.mastery, w = b ? game.i18n.localize(((z = CONFIG.DND5E.weaponMasteries[b]) == null ? void 0 : z.label) ?? b) : null;
      return w ? `${f}: ${w}` : f;
    }), m = [
      { trait: "speed", icon: "fas fa-person-running", label: "Speed", values: d },
      { trait: "dr", icon: "fas fa-shield-halved", label: "Damage Resistances", values: s("dr", "dr") },
      { trait: "di", icon: "fas fa-shield-alt", label: "Damage Immunities", values: s("di", "di") },
      { trait: "dv", icon: "fas fa-heart-crack", label: "Damage Vulnerabilities", values: s("dv", "dv") },
      { trait: "ci", icon: "fas fa-slash", label: "Condition Immunities", values: s("ci", "ci") },
      { trait: "languages", icon: "fas fa-flag", label: "Languages", values: s("languages", "languages") },
      { trait: "armor", icon: "fas fa-shield", label: "Armor Proficiencies", values: s("armorProf", "armor") },
      { trait: "weapon", icon: "fas fa-swords", label: "Weapon Proficiencies", values: s("weaponProf", "weapon") },
      { trait: "senses", icon: "fas fa-eye", label: "Senses", values: i },
      { trait: "mastery", icon: "fas fa-award", label: "Weapon Masteries", values: p }
    ];
    return u`
            <div class="ape-actor-player-info">
                ${m.map((v) => v.values.length === 0 ? h : u`
                        <div class="ape-actor-player-info-row">
                            <span class="ape-actor-player-info-label">
                                ${v.icon ? u`<i class="${v.icon}"></i>` : h}
                                ${v.label}
                            </span>
                            <div class="ape-actor-player-info-values">
                                ${v.values.map((f) => u`<span class="ape-actor-player-info-value ${v.trait}">${f}</span>`)}
                            </div>
                        </div>
                    `)}
            </div>
        `;
  }
  _renderHpBar(e, t) {
    const a = Math.min(100, Math.max(0, t.value / t.max * 100));
    return u`
            <div class="ape-actor-hp-wrapper hp-container">
                <div class="hp-main">
                    <div class="bar-label">
                        <span style="color:#34d399;">HP</span>
                        <span class="ape-actor-hp-text" style="color:#f8fafc;">
                            <span class="ape-actor-hp-display" @click="${this._toggleHpInput}">
                                <span class="ape-actor-hp-value">${t.value}</span>
                                <span class="ape-actor-hp-separator"> / </span>
                                <span class="ape-actor-hp-max">${t.max}</span>
                            </span>
                            <input type="text" class="ape-actor-hp-input" value="${t.value}" 
                                style="display:none"
                                @blur="${this._finishHpEdit}"
                                @keydown="${this._hpInputKey}"
                                @change="${(s) => this.api.updateHP(e, parseInt(s.target.value))}">
                        </span>
                    </div>
                    <div class="bar-track ape-actor-hp"><div class="bar-fill hp-fill" style="width: ${a}%"></div></div>
                </div>
                <div class="ape-actor-temp hp-temp">
                    <span class="ape-actor-temp-display hp-temp-val" @click="${this._toggleTempInput}">${t.temp || 0}</span>
                    <input type="text" class="ape-actor-temp-input hp-temp-val" value="${t.temp || 0}" 
                            style="display:none; width: 100%; text-align: center; background: transparent; border: none; color: inherit; font-family: inherit;padding:0;line-height:1;height:fit-content"
                            @blur="${this._finishTempEdit}"
                            @keydown="${this._hpInputKey}"
                            @change="${(s) => this.api.updateTempHP(e, parseInt(s.target.value))}">
                    <span class="hp-temp-lbl">Temp</span>
                </div>
            </div>
        `;
  }
  _renderExhaustion(e) {
    const t = e.system.attributes.exhaustion;
    return u`
            <p>Exhaustion Level</p>
            <div class="ape-actor-exhaustion">
                ${Array.from({ length: 6 }).map((a, s) => u`
                    <span class="ape-exhaustion-dot ${s + 1 <= t ? "filled" : ""}" title="${game.i18n.localize(`DND5E.Exhaustion${s + 1}`)}" @click="${() => this.api.updateExhaustion(e, s + 1)}">
                        ${s + 1}
                    </span>
                `)}
            </div>
        `;
  }
  _renderConditions(e) {
    const t = Object.entries(CONFIG.DND5E.conditionTypes).filter(([a, s]) => !s.pseudo && a !== "exhaustion");
    return u`
            <div class="ape-accordion ${this._conditionsOpen ? "is-open" : ""}">
                <h2 class="ape-accordion-header" @click="${() => this._toggleAccordion("conditions")}">
                    <i class="fas fa-caret-down"></i> Conditions
                </h2>
                <div class="ape-accordion-body">
                    <div class="ape-conditions">
                        ${t.map(([a, s]) => {
      const n = e.statuses.has(a), i = game.i18n.localize(s.name);
      return u`
                                <span class="ape-condition-chip ${n ? "active" : ""}"
                                    title="${i}"
                                    @click="${() => this.api.toggleCondition(e, a)}">
                                    <img class="ape-condition-icon" src="${s.img}">
                                    <span class="ape-condition-label">${i}</span>
                                </span>
                            `;
    })}
                    </div>
                    ${this._renderExhaustion(e)}
                </div>
            </div>
        `;
  }
  _renderRestButtons(e) {
    return u`
            <div class="ape-actor-rest-buttons rest-row">
                <button class="btn ape-actor-rest-button" @click="${() => this.api.shortRest(e)}"><i class="fa-solid fa-utensils"></i> Short Rest</button>
                <button class="btn ape-actor-rest-button" @click="${() => this.api.longRest(e)}"><i class="fa-solid fa-campground"></i> Long Rest</button>
            </div>
        `;
  }
  _toggleHpInput(e) {
    const t = e.currentTarget, a = t.nextElementSibling;
    t.style.display = "none", a.style.display = "inline-block", a.focus(), a.select();
  }
  _finishHpEdit(e) {
    const t = e.currentTarget, a = t.previousElementSibling;
    t.style.display = "none", a.style.display = "";
  }
  _toggleTempInput(e) {
    const t = e.currentTarget, a = t.nextElementSibling;
    t.style.display = "none", a.style.display = "inline-block", a.focus(), a.select();
  }
  _finishTempEdit(e) {
    const t = e.currentTarget, a = t.previousElementSibling;
    t.style.display = "none", a.style.display = "";
  }
  _hpInputKey(e) {
    e.key === "Enter" && e.currentTarget.blur();
  }
  _renderAbilities(e) {
    const t = this.globalData.abilityColumns;
    return u`
            <div class="ape-abilities">
                ${t.map((a) => u`
                    <div class="flex-col">
                        <span class="ape-ability">
                            <span class="ape-ability-label">&nbsp;</span>
                            <span class="ape-ability-hdr">check</span>
                            <span class="ape-ability-hdr">save</span>
                        </span>
                        ${a.map((s) => {
      const n = e.system.abilities[s.key];
      return u`
                                <span class="ape-ability">
                                    <span class="ape-ability-label">${s.key}<br>${n.value}</span>
                                    <a class="fas fa-dice-d20 ape-ability-check" 
                                        title="${s.label} check"
                                        @click="${(i) => this.api.rollAbilityCheck(e, s.key, i)}">
                                        <span class="ape-ability-text">${re(n.mod)}</span>
                                    </a>
                                    <a class="fas fa-dice-d20 ape-ability-save" 
                                        title="${s.label} saving throw"
                                        @click="${(i) => this.api.rollSavingThrow(e, s.key, i)}">
                                        <span class="ape-ability-text">${re(n.save.value)}</span>
                                    </a>
                                </span>
                            `;
    })}
                    </div>
                `)}
            </div>
        `;
  }
  _renderSkills(e) {
    const t = this.actorData.skills, a = e.system.skills;
    return u`
            <div class="ape-accordion ape-skill-container ${this._skillsOpen ? "is-open" : ""}">
                <h2 class="ape-accordion-header ape-skill-header" @click="${() => this._toggleAccordion("skills")}">
                    <i class="fas fa-caret-down"></i> Skills
                </h2>
                <div class="ape-accordion-body ape-skills">
                    ${Object.keys(a).map((s) => {
      const n = a[s], i = t[s];
      if (!i) return h;
      let r = "far fa-circle";
      return n.proficient === 0.5 ? r = "fas fa-adjust" : n.proficient === 1 ? r = "fas fa-check" : n.proficient === 2 && (r = "fas fa-star"), u`
                            <div class="ape-skill-row flexrow ${n.proficient === 1 ? "proficient" : n.proficient === 2 ? "expert" : ""}"
                                @click="${(l) => this.api.rollSkill(e, s, l)}"
                                @contextmenu="${(l) => this.api.rollSkill(e, s, l, !0)}">
                                <span class="ape-skill-icon ${r}"></span>
                                <span class="ape-skill-ability">${n.ability}</span>
                                <span class="ape-skill-label">${i.label}</span>
                                <span class="ape-skill-bonus">${re(n.total)}</span>
                                <span class="ape-skill-passive">(${n.passive})</span>
                            </div>
                        `;
    })}
                </div>
            </div>
        `;
  }
  _renderDeathSaves(e) {
    const t = e.system.attributes.death.failure, a = e.system.attributes.death.success, s = (i, r, l) => Array.from({ length: 3 }).map((d, c) => u`
                <span class="ape-death-dot ${c < i ? "filled" : ""}">
                    ${c < i ? u`<span class="fas ${l}"></span>` : h}
                </span>
            `), n = t < 3 && a < 3;
    return u`
            <div class="ape-death-saving">
                <span class="ape-death-throws failed">
                    ${s(t, "failed", "fa-skull-crossbones")}
                </span>
                <span class="ape-death-icon" 
                    style="${n ? "cursor:pointer" : "cursor:default"}"
                    @mousedown="${n ? (i) => this.api.rollDeathSave(e, i) : null}"></span>
                <span class="ape-death-throws saved">
                    ${s(a, "saved", "fa-check")}
                </span>
            </div>
        `;
  }
  _renderSections(e, t) {
    return ["equipped", "feature", "legendary", "lair", "spell", "inventory", "passive"].map((s) => {
      const n = t[s];
      return n ? u`
                <ape-section 
                    class="ape-category"
                    .title="${n.title}"
                    .uses="${n.uses}"
                    .prepared="${n.prepared}"
                    .items="${n.items}"
                    .weaponSets="${n.weaponSets}"
                    .groups="${n.groups}"
                    .sectionId="${s}"
                    .api="${this.api}"
                    .actor="${e}"
                    .showSpellDots="${this.globalData.showSpellDots}"
                    .showSpellUses="${this.globalData.showSpellUses}"
                    .showWeaponMastery="${this.globalData.showWeaponMastery}"
                    .canManage="${this.globalData.canManage}"
                    .forceOpen="${n.forceOpen}">
                </ape-section>
            ` : h;
    });
  }
}
E(ut, "properties", {
  actorData: { type: Object },
  // The object returned by data-builder
  globalData: { type: Object },
  // Global settings/options
  api: { type: Object },
  _xpActionsOpen: { state: !1 },
  _infoOpen: { state: !1 },
  _skillsOpen: { state: !1 },
  _abilitiesOpen: { state: !1 },
  _conditionsOpen: { state: !1 }
});
customElements.define("ape-actor", ut);
const Ke = "action-pack-enhanced", Ze = "patreon-auth-data";
class ua {
  _generateState() {
    return foundry.utils.randomID();
  }
  _getAuthUrl(e) {
    const { clientId: t, redirectUri: a, scopes: s, authUrl: n } = q.patreon;
    return `${n}?response_type=code&client_id=${encodeURIComponent(t)}&redirect_uri=${encodeURIComponent(a)}&scope=${s}&state=${e}`;
  }
  _delay(e) {
    return new Promise((t) => setTimeout(t, e));
  }
  async _pollForAuth(e, t) {
    const { intervalMs: a, maxAttempts: s } = q.polling;
    for (let n = 1; n <= s; n++) {
      await this._delay(a), t == null || t(n, s);
      try {
        const i = await fetch(`${q.backend.authCheckUrl}?state=${encodeURIComponent(e)}`);
        if (!i.ok) continue;
        const r = await i.json();
        if (r != null && r.authenticated)
          return { authenticated: !0, tier: r.tier, source: r.source ?? "patreon", timestamp: Date.now(), state: e };
      } catch (i) {
        console.warn("action-pack-enhanced | patreon auth poll failed", i);
      }
    }
    return null;
  }
  async _persistAuth(e) {
    await game.settings.set(Ke, Ze, e), await H.refresh({ force: !0 });
  }
  /**
   * Opens a dialog that walks the user through connecting their Patreon account.
   */
  async connect() {
    const { DialogV2: e } = foundry.applications.api;
    return e.wait({
      window: { title: game.i18n.localize("action-pack-enhanced.premium.connect-title") },
      content: `
                <div class="ape-patreon-connect">
                    <p class="ape-patreon-status">${game.i18n.localize("action-pack-enhanced.premium.connect-intro")}</p>
                </div>
            `,
      modal: !0,
      rejectClose: !1,
      buttons: [{
        action: "start",
        label: game.i18n.localize("action-pack-enhanced.premium.start-auth"),
        icon: "fab fa-patreon",
        default: !0,
        callback: async (t, a, s) => {
          const n = s.element.querySelector(".ape-patreon-status"), i = this._generateState(), r = this._getAuthUrl(i);
          window.open(r, "_blank"), n && (n.textContent = game.i18n.localize("action-pack-enhanced.premium.waiting"));
          const l = await this._pollForAuth(i, (d, c) => {
            n && (n.textContent = game.i18n.format("action-pack-enhanced.premium.waiting-attempt", { attempt: d, max: c }));
          });
          return l ? (await this._persistAuth(l), n && (n.textContent = game.i18n.format("action-pack-enhanced.premium.connected", { tier: l.tier ?? "" })), !0) : (ui.notifications.warn(game.i18n.localize("action-pack-enhanced.premium.auth-failed")), !1);
        }
      }, {
        action: "cancel",
        label: game.i18n.localize("action-pack-enhanced.dialog.cancel"),
        callback: () => !1
      }]
    });
  }
  /**
   * Confirms and clears the stored Patreon connection.
   */
  async disconnect() {
    const { DialogV2: e } = foundry.applications.api;
    await e.confirm({
      window: { title: game.i18n.localize("action-pack-enhanced.premium.disconnect-title") },
      content: `<p>${game.i18n.localize("action-pack-enhanced.premium.disconnect-content")}</p>`,
      modal: !0,
      rejectClose: !1,
      yes: { label: game.i18n.localize("action-pack-enhanced.premium.disconnect") },
      no: { label: game.i18n.localize("action-pack-enhanced.dialog.cancel") }
    }) && (await game.settings.set(Ke, Ze, null), await H.clear());
  }
}
const Je = new ua();
class ht extends A {
  createRenderRoot() {
    return this;
  }
  _onConnect(e) {
    e.stopPropagation(), Je.connect();
  }
  _onDisconnect(e) {
    e.stopPropagation(), Je.disconnect();
  }
  render() {
    return game.user.isGM ? this._renderGmBadge() : this._renderPlayerBadge();
  }
  _renderGmBadge() {
    const e = !!(this.authData && this.authData.authenticated);
    return u`
            <div class="ape-premium-badge ${e ? "connected" : ""}">
                ${e ? u`
                    <span class="ape-premium-tier"><i class="fab fa-patreon"></i> ${game.i18n.format("action-pack-enhanced.premium.supporter-tier", { tier: this.authData.tier ?? "" })}</span>
                    <span class="ape-premium-action" @click="${this._onDisconnect}">${game.i18n.localize("action-pack-enhanced.premium.disconnect")}</span>
                ` : u`
                    <span class="ape-premium-action ape-premium-connect" @click="${this._onConnect}">
                        <i class="fab fa-patreon"></i> ${game.i18n.localize("action-pack-enhanced.premium.connect")}
                    </span>
                `}
            </div>
        `;
  }
  _renderPlayerBadge() {
    var t, a;
    return !((a = (t = this.tableEntitlement) == null ? void 0 : t.entitlements) != null && a[q.featureId]) ? h : u`
            <div class="ape-premium-badge connected">
                <span class="ape-premium-tier"><i class="fab fa-patreon"></i> ${game.i18n.localize("action-pack-enhanced.premium.table-unlocked")}</span>
            </div>
        `;
  }
}
E(ht, "properties", {
  authData: { type: Object },
  // this browser's own connection (GM-relevant)
  tableEntitlement: { type: Object }
  // world setting the GM publishes to (player-relevant)
});
customElements.define("ape-premium-badge", ht);
class mt extends A {
  createRenderRoot() {
    return this;
  }
  render() {
    return !game.user.isGM || !this.installedVersion ? h : u`
            <div class="ape-version-badge ${this.hasUpdate ? "has-update" : "up-to-date"}">
                v${this.installedVersion}
                ${this.hasUpdate ? this._renderTooltip() : h}
            </div>
        `;
  }
  _renderTooltip() {
    return u`
            <div class="ape-version-tooltip">
                <div class="ape-version-tooltip-header">
                    ${game.i18n.format("action-pack-enhanced.version.update-available", { version: this.latestVersion })}
                </div>
                ${this.changelogEntries.map((e) => u`
                    <div class="ape-version-entry">
                        <div class="ape-version-entry-title">
                            ${e.version}${e.date ? u` <span class="ape-version-entry-date">${e.date}</span>` : h}
                        </div>
                        <ul>${e.items.map((t) => u`<li>${t}</li>`)}</ul>
                    </div>
                `)}
            </div>
        `;
  }
}
E(mt, "properties", {
  installedVersion: { type: String },
  hasUpdate: { type: Boolean },
  latestVersion: { type: String },
  changelogEntries: { type: Array }
});
customElements.define("ape-version-badge", mt);
class gt extends A {
  createRenderRoot() {
    return this;
  }
  updated(e) {
    e.has("data") && this._restoreScroll();
  }
  _restoreScroll() {
    if (this.data.scrollPosition && this.data.actors.length === 1 && this.data.actors[0].actor.uuid === this.data.scrollPosition.uuid) {
      const e = this.querySelector(".ape-container");
      e && (e.scrollTop = this.data.scrollPosition.scroll || 0);
    }
  }
  _onScroll(e) {
    if (this.data.actors.length === 1) {
      const t = this.data.actors[0].actor.uuid, a = e.target.scrollTop, s = !!this.querySelector(".ape-skill-container.is-open");
      this.api.setScrollPosition({ uuid: t, scroll: a, showSkills: s });
    }
  }
  render() {
    if (!this.data || !this.globalData) return h;
    const { actors: e } = this.data, t = !e || e.length === 0;
    return u`
            <div class="${[
      "ape-wrapper"
    ].join(" ")}" @scroll="${this._onScroll}">
                ${this._renderHeader()}

                <div class="ape-actors">
                    ${t ? u`
                        <div class="ape-empty-tray">
                            <i class="fas fa-dice-d20"></i>
                        </div>
                    ` : e.map((s) => u`
                        <ape-actor 
                            class="ape-actor"
                            .actorData="${s}"
                            .globalData="${this.globalData}"
                            .api="${this.api}">
                        </ape-actor>
                    `)}
                </div>

                <div class="ape-end-turn" @click="${() => this.api.endTurn()}">
                    ${game.i18n.localize("action-pack-enhanced.end-turn")}
                </div>
            </div>
        `;
  }
  _renderHeader() {
    return u`
            <div class="ape-header-bar">
                <ape-version-badge
                    .installedVersion="${G.installedVersion}"
                    .hasUpdate="${G.hasUpdate}"
                    .latestVersion="${G.latestVersion}"
                    .changelogEntries="${G.changelogEntries}">
                </ape-version-badge>
                <ape-premium-badge
                    .authData="${game.settings.get("action-pack-enhanced", "patreon-auth-data")}"
                    .tableEntitlement="${game.settings.get("action-pack-enhanced", "patreon-gm-entitlement")}">
                </ape-premium-badge>
            </div>
        `;
  }
}
E(gt, "properties", {
  data: { type: Object },
  // Contains actors
  globalData: { type: Object },
  // Contains abilityColumns, showSpellDots
  api: { type: Object }
});
customElements.define("ape-app", gt);
let se, Q, Qe, ue;
function ha(o) {
  var i;
  if (!o || o === "") return null;
  let e = o.split(".");
  if (e[0] === "Compendium")
    return null;
  const [t, a] = e.slice(0, 2);
  e = e.slice(2);
  const s = (i = CONFIG[t]) == null ? void 0 : i.collection.instance;
  if (!s) return null;
  let n = s.get(a);
  for (; n && e.length > 1; ) {
    const [r, l] = e.slice(0, 2);
    n = n.getEmbeddedDocument(r, l), e = e.slice(2);
  }
  return n || null;
}
function $a(o) {
  if (o instanceof CONFIG.Actor.documentClass)
    return o;
  if (o instanceof CONFIG.Token.documentClass)
    return o.object.actor;
}
function ye() {
  const o = canvas.tokens.controlled.map((t) => t.actor), e = document.querySelector("#ape-app");
  e && (game.combat && o.includes(Q) ? e.classList.add("is-current-combatant") : e.classList.remove("is-current-combatant"));
}
Hooks.on("ready", async () => {
  var o, e;
  if (!document.querySelector("#ape-app")) {
    const t = document.createElement("ape-app");
    t.id = "ape-app", t.classList.add("ape-container"), game.modules.get("foundry-taskbar") && t.classList.add("has-taskbar");
    const a = document.getElementById("interface");
    a && document.body.insertBefore(t, a), Qe = new St(), t.api = Qe;
  }
  se = (e = (o = game.combat) == null ? void 0 : o.turns.find((t) => {
    var a;
    return t.id == ((a = game.combat) == null ? void 0 : a.current.combatantId);
  })) == null ? void 0 : e.actor, Q = se, be() && $("#ape-app").addClass("is-open always-on"), game.user.isGM && H.isAuthenticated() && await H.refresh(), ke(), game.user.isGM && G.check().then(() => C());
});
function ma() {
  const o = game.settings.get("action-pack-enhanced", "tray-display");
  return o === "selected" || o === "auto";
}
function be() {
  return game.settings.get("action-pack-enhanced", "tray-display") === "always";
}
function B() {
  const o = canvas.tokens.controlled.filter((e) => {
    var t;
    return ["character", "npc"].includes((t = e.actor) == null ? void 0 : t.type);
  });
  return o.length ? o.map((e) => e.actor) : game.user.character && game.settings.get("action-pack-enhanced", "assume-default-character") ? [game.user.character] : [];
}
Hooks.on("controlToken", async () => {
  ke();
});
Hooks.on("updateActor", (o) => {
  B().includes(o) && C();
});
function ga(o) {
  const e = document.querySelector(`ape-actor[data-actor-uuid="${o.uuid}"]`);
  e && e.requestUpdate();
}
function ve(o) {
  B().includes(o.parent) && ga(o.parent);
}
Hooks.on("createActiveEffect", (o) => {
  ve(o);
});
Hooks.on("updateActiveEffect", (o) => {
  ve(o);
});
Hooks.on("deleteActiveEffect", (o) => {
  ve(o);
});
function $e(o) {
  B().includes(o.actor) && C();
}
Hooks.on("updateItem", (o) => {
  $e(o);
});
Hooks.on("deleteItem", (o) => {
  $e(o);
});
Hooks.on("createItem", (o) => {
  $e(o);
});
Hooks.on("updateSetting", (o) => {
  (o.key === "action-pack-enhanced.patreon-auth-data" || o.key === "action-pack-enhanced.patreon-gm-entitlement") && C();
});
Hooks.on("updateCombat", (o) => {
  var e;
  Q = (e = o.turns.find((t) => t.id == o.current.combatantId)) == null ? void 0 : e.actor, ye(), se = Q;
});
Hooks.on("createCombatant", (o) => {
  B().includes(o.actor) && C();
});
Hooks.on("updateCombatant", (o, e) => {
  B().includes(o.actor) && C();
});
Hooks.on("deleteCombat", (o) => {
  game.combat || (Q = null, se = null, ye());
});
Hooks.on("init", () => {
  Rt({
    updateTray: C,
    updateTrayState: ke
  });
});
Hooks.on("getSceneControlButtons", (o) => {
  if (game.settings.get("action-pack-enhanced", "use-control-button") && !be()) {
    const e = o.tokens.tools;
    e && (e.apeApp = {
      name: "apeApp",
      title: game.i18n.localize("action-pack-enhanced.control-icon"),
      icon: "fas fa-user-shield",
      visible: !0,
      onClick: () => {
        $("#ape-app").toggleClass("is-open"), $("#ape-app .ape-skill-container").removeClass("is-open");
      },
      button: 1
    });
  }
});
function ke() {
  const o = $("#ape-app");
  ma() && (canvas.tokens.controlled.filter((t) => {
    var a;
    return ["character", "npc"].includes((a = t.actor) == null ? void 0 : a.type);
  }).length ? o.addClass("is-open") : o.removeClass("is-open")), be() ? o.addClass("is-open always-on") : o.removeClass("always-on"), ye(), C();
}
async function C() {
  ue || (ue = new Dt());
  const o = B(), e = ue.build(o, {
    /* scrollPosition stub */
  });
  function t(g, y) {
    return g && [y, g].join("-");
  }
  const a = t(game.settings.get("action-pack-enhanced", "icon-size"), "icon"), s = t(game.settings.get("action-pack-enhanced", "tray-size"), "tray"), n = game.settings.get("action-pack-enhanced", "show-spell-dots"), i = game.settings.get("action-pack-enhanced", "show-spell-uses"), r = game.settings.get("action-pack-enhanced", "show-weapon-mastery"), l = game.settings.get("action-pack-enhanced", "static-info"), d = Object.entries(CONFIG.DND5E.abilities), c = [
    d.slice(0, 3).map(([g, y]) => ({ key: g, label: y.label })),
    d.slice(3, 6).map(([g, y]) => ({ key: g, label: y.label }))
  ];
  let p = !1;
  try {
    p = H.can(q.featureId);
  } catch (g) {
    console.error("action-pack-enhanced | premiumGate.can() failed, defaulting to locked", g);
  }
  const m = document.querySelector("#ape-app");
  Array.from(m.classList).forEach((g) => {
    (g.startsWith("tray-") || g.startsWith("icon-")) && m.classList.remove(g);
  }), m.classList.add(a), m.classList.add(s), m && (m.data = {
    actors: e
  }, m.globalData = {
    abilityColumns: c,
    showSpellDots: n,
    showSpellUses: i,
    showWeaponMastery: r,
    staticInfo: l,
    canManage: p
  });
}
Hooks.on("dnd5e.getItemContextOptions", (o, e) => {
  var t;
  (t = o.system.activation) != null && t.type && o.system.activation.type !== "none" && (o.getFlag("action-pack-enhanced", "hidden") ? e.push({
    name: game.i18n.localize("action-pack-enhanced.item-context.show"),
    icon: "<i class='fas fa-eye'></i>",
    callback: async () => {
      await o.setFlag("action-pack-enhanced", "hidden", !1), C();
    }
  }) : e.push({
    name: game.i18n.localize("action-pack-enhanced.item-context.hide"),
    icon: "<i class='fas fa-eye-slash'></i>",
    callback: async () => {
      await o.setFlag("ape", "hidden", !0), C();
    }
  }));
});
Hooks.on("dropCanvasData", (o, e, t) => {
  var a;
  if (e.type === "ActionPackItem" && e.uuid) {
    const s = ha(e.uuid);
    if (!s) return;
    const n = o.tokens.placeables.find((i) => e.x >= i.x && e.x <= i.x + i.w && e.y >= i.y && e.y <= i.y + i.h);
    if (n) {
      const i = (a = s.system) == null ? void 0 : a.activities;
      if (!i) return;
      (i.contents[0].target.affects.count || 1) === 1 && n.setTarget(!0, { user: game.user, releaseOthers: !0, groupSelection: !0 });
    }
    return s.use({ event: t }), !1;
  }
});
export {
  $a as fudgeToActor
};
//# sourceMappingURL=ape.mjs.map
