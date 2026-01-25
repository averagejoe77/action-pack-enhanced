var Xe = Object.defineProperty;
var Ve = (i, e, t) => e in i ? Xe(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var P = (i, e, t) => Ve(i, typeof e != "symbol" ? e + "" : e, t);
class Ge {
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
    for (const s of e.itemTypes.class) {
      const a = this.masteryRules[s.name];
      if (a) {
        let n = 0;
        if (a.type === "constant")
          n = a.value;
        else if (a.type === "table") {
          const o = s.system.levels, r = a.values.find((l) => l.level === o);
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
    var a;
    if (!e) return;
    const t = await e.longRest();
    if (game.modules.get("wm5e") && ((a = game.modules.get("wm5e")) == null ? void 0 : a.active) && e.itemTypes.feat.find((n) => n.name === "Weapon Mastery" || n.name === "Weapon Master")) {
      await e.setFlag("action-pack-enhanced", "masterySelectionPending", !0);
      const n = e.itemTypes.weapon.filter((c) => c.system.equipped), o = /* @__PURE__ */ new Map(), r = e.system.traits.weaponProf.mastery.value;
      n.forEach((c) => {
        var m, g;
        const p = c.system.mastery, h = (m = c.system.type) == null ? void 0 : m.baseItem;
        p && h && !o.has(h) && o.set(h, {
          id: h,
          label: h.replace(/-/g, " ").replace(/\b\w/g, (f) => f.toUpperCase()),
          masteryLabel: ((g = CONFIG.DND5E.weaponMasteries[p]) == null ? void 0 : g.label) || p,
          selected: r.find((f) => f === h)
        });
      });
      const l = this.calculateMaxMasteries(e);
      await this.promptMasterySelection(e, o, l);
    } else
      await e.setFlag("action-pack-enhanced", "masterySelectionPending", !1), await e.update({ "system.traits.weaponProf.mastery.value": [] });
    return t;
  }
  async promptMasterySelection(e, t, s) {
    const { DialogV2: a } = foundry.applications.api;
    let n = `<p>Select up to ${s} ${s === 1 ? "weapon" : "weapons"} to use ${s === 1 ? "its" : "their"} weapon mastery for the day:</p>`;
    n += '<form class="ape-mastery-dialog">';
    for (const [o, r] of t)
      n += `
            <div class="ape-mastery-switch form-group">
                <input id="${o}" class="ape-mastery-checkbox" type="checkbox" name="mastery" value="${o}" data-dtype="String" ${r.selected ? "checked" : ""}>
                <label for="${o}" class="ape-mastery-label">${r.label} (${r.masteryLabel})</label>
            </div>`;
    return n += "</form>", n += `
        <script>
            (function() {
                const form = document.querySelector('.ape-mastery-dialog');
                if (!form) return;
                const inputs = form.querySelectorAll('input[name="mastery"]');
                const max = ${s};
                
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
        `, a.wait({
      window: { title: "Weapon Mastery Selection" },
      content: n,
      buttons: [{
        action: "update",
        label: "Update",
        default: !0,
        callback: async (o, r, l) => {
          const c = [];
          return l.element.querySelectorAll('input[name="mastery"]:checked').forEach((p) => {
            c.push(p.value);
          }), c.length > s && (ui.notifications.warn(`You selected more than ${s} masteries. Only the first ${s} will be applied.`), c.splice(s)), await e.update({ "system.traits.weaponProf.mastery.value": c }), await e.setFlag("action-pack-enhanced", "masterySelectionPending", !1), !0;
        }
      }, {
        action: "cancel",
        label: "Cancel",
        callback: async () => (await e.setFlag("action-pack-enhanced", "masterySelectionPending", !1), !1)
      }],
      submit: (o) => {
      }
    });
  }
  /**
   * Toggles a Weapon Mastery selection
   * @param {Actor} actor 
   * @param {string} masteryId 
   */
  async toggleMastery(e, t) {
    var a, n, o;
    if (!e || !t) return;
    const s = new Set(((o = (n = (a = e.system.traits) == null ? void 0 : a.weaponProf) == null ? void 0 : n.mastery) == null ? void 0 : o.value) || []);
    if (s.has(t))
      s.delete(t);
    else {
      if (s.size >= 2) {
        ui.notifications.warn("You can only select up to 2 Weapon Masteries.");
        return;
      }
      s.add(t);
    }
    return e.update({ "system.traits.weaponProf.mastery.value": Array.from(s) });
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
    const t = game.combat.combatants.find((s) => s.actor === e);
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
  async rollAbilityCheck(e, t, s) {
    return e.rollAbilityCheck({ event: s, ability: t });
  }
  /**
   * Rolls a Saving Throw
   * @param {Actor} actor 
   * @param {string} abilityId 
   */
  async rollSavingThrow(e, t, s) {
    return e.rollSavingThrow({ event: s, ability: t });
  }
  /**
   * Rolls a Skill
   * @param {Actor} actor 
   * @param {string} skillId 
   * @param {boolean} fastForward 
   */
  async rollSkill(e, t, s, a = !1) {
    return e.rollSkill({ event: s, skill: t }, { fastForward: a });
  }
  /**
   * Adjusts Spell Slots
   * @param {Actor} actor 
   * @param {string} groupName 
   * @param {number} slotIndex 
   */
  async adjustSpellSlot(e, t, s) {
    var o, r;
    const a = s + 1, n = (r = (o = e.system.spells) == null ? void 0 : o[t]) == null ? void 0 : r.value;
    if (n !== void 0) {
      const l = `system.spells.${t}.value`, c = n !== a ? a : a - 1;
      return e.update({ [l]: c });
    }
  }
  /**
   * Rolls an Item
   * @param {Item} item 
   */
  async rollItem(e, t) {
    var s, a;
    if (e) {
      if (!((s = game.modules.get("wire")) != null && s.active) && ((a = game.modules.get("itemacro")) != null && a.active) && game.settings.get("itemacro", "defaultmacro") && e.hasMacro()) {
        e.executeMacro();
        return;
      }
      return e.use({}, t);
    }
  }
  /**
   * Rolls Item Recharge
   * @param {Item} item 
   */
  async rollRecharge(e) {
    return e.rollRecharge();
  }
  /**
   * Gets Item Chat Data for Description
   * @param {Item} item 
   */
  async getItemDescription(e) {
    var o, r, l, c;
    const t = await e.getChatData({ secrets: e.actor.isOwner }), s = ((r = (o = e.system) == null ? void 0 : o.activation) == null ? void 0 : r.type) || "", a = ((c = (l = e.system) == null ? void 0 : l.activation) == null ? void 0 : c.value) || "";
    let n = "";
    return a === "" ? n = s.charAt(0).toUpperCase() + s.slice(1) : a && s && (n = `${a} ${s.charAt(0).toUpperCase() + s.slice(1)}`), {
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
    var a, n, o, r;
    const t = (n = (a = e.system) == null ? void 0 : a.range) == null ? void 0 : n.value, s = (r = (o = e.system) == null ? void 0 : o.range) == null ? void 0 : r.units;
    return t && s ? `${t} ${s}` : s || "";
  }
  _formatDuration(e) {
    var a, n, o, r;
    const t = (n = (a = e.system) == null ? void 0 : a.duration) == null ? void 0 : n.value, s = (r = (o = e.system) == null ? void 0 : o.duration) == null ? void 0 : r.units;
    return t && s ? `${t} ${s}` : s ? s === "inst" ? "Instantaneous" : s : "";
  }
}
function G(i) {
  return i == null ? "0" : `${i >= 0 ? "+" : ""}${i}`;
}
function Ke(i) {
  const e = Ze(i), t = Je(i), s = Ye(i), a = i.type === "spell" ? Qe(i) : "";
  return { castingTime: e, range: t, duration: s, materials: a };
}
function Ze(i) {
  var s, a, n, o;
  const e = ((a = (s = i.system) == null ? void 0 : s.activation) == null ? void 0 : a.type) || "", t = ((o = (n = i.system) == null ? void 0 : n.activation) == null ? void 0 : o.value) || "";
  return t === "" && e !== "" ? game.i18n.localize(`action-pack-enhanced.action-type.${e}`) : t && e ? `${t} ${e.charAt(0).toUpperCase() + e.slice(1)}` : "";
}
function Je(i) {
  var a, n, o, r, l, c, p, h;
  const e = ((n = (a = i.system) == null ? void 0 : a.range) == null ? void 0 : n.long) || null, t = (r = (o = i.system) == null ? void 0 : o.range) == null ? void 0 : r.units;
  let s;
  return t !== "touch" && t !== "self" ? s = ((c = (l = i.system) == null ? void 0 : l.range) == null ? void 0 : c.value) || ((h = (p = i.system) == null ? void 0 : p.range) == null ? void 0 : h.reach) || 5 : s = null, s && e && t ? `${s} ${t} / ${e} ${t}` : s && t ? `${s} ${t}` : t ? game.i18n.localize(`action-pack-enhanced.range.${t}`) : "";
}
function Ye(i) {
  var s, a, n, o;
  const e = (a = (s = i.system) == null ? void 0 : s.duration) == null ? void 0 : a.value, t = (o = (n = i.system) == null ? void 0 : n.duration) == null ? void 0 : o.units;
  return e && t ? `${e} ${e > 1 ? t + "s" : t}` : t ? game.i18n.localize(`action-pack-enhanced.duration.${t}`) : "";
}
function Qe(i) {
  var t, s;
  const e = (s = (t = i.system) == null ? void 0 : t.materials) == null ? void 0 : s.value;
  return e || "";
}
function et(i) {
  var r, l;
  let e = {}, t = i.itemTypes.race, s = i.itemTypes.class, a = i.itemTypes.subclass;
  const n = i.system.details.level;
  if (s.length === a.length) {
    let c = { race: `<span>${(r = t[0]) == null ? void 0 : r.name} - ${n}</span>` || "Unknown", classes: [] };
    for (let p = 0; p < s.length; p++)
      c.classes[p] = { name: s[p].name, level: s[p].system.levels, subclass: { name: a[p].name } };
    e = c;
  } else {
    let c = { race: `<span>${(l = t[0]) == null ? void 0 : l.name} - ${n}</span>` || "Unknown", classes: [] };
    for (let p = 0; p < s.length; p++) {
      c.classes[p] = { name: s[p].name, level: s[p].system.levels, subclass: { name: "" } };
      for (let h = 0; h < a.length; h++)
        c.classes[p].subclass.name = a[h].name;
    }
    e = c;
  }
  let o = `${e.race}, `;
  for (let c = 0; c < e.classes.length; c++)
    o += `<span class="ape-actor-class">${e.classes[c].name}(${e.classes[c].level})</span>`, e.classes[c].subclass.name !== "" && (o += `<span class="ape-actor-subclass"> - ${e.classes[c].subclass.name}</span>`), c < e.classes.length - 1 && (o += ", ");
  return o;
}
const tt = (i) => {
  const e = i.system, t = e.consume;
  if (t && t.target)
    return st(i.actor, t);
  const s = e.uses;
  if (s && (s.max > 0 || s.value > 0))
    return Ue(e);
  const a = i.type;
  return a === "feat" ? at() : a === "consumable" ? {
    available: e.quantity
  } : a === "weapon" ? it(e) : null;
};
function st(i, e) {
  let t = null, s = null;
  if (e.type === "attribute") {
    const a = getProperty(i.system, e.target);
    typeof a == "number" ? t = a : t = 0;
  } else if (e.type === "ammo" || e.type === "material") {
    const a = i.items.get(e.target);
    a ? t = a.system.quantity : t = 0;
  } else if (e.type === "charges") {
    const a = i.items.get(e.target);
    a ? { available: t, maximum: s } = Ue(a.system) : t = 0;
  }
  return t !== null ? (e.amount > 1 && (t = Math.floor(t / e.amount), s !== null && (s = Math.floor(s / e.amount))), { available: t, maximum: s }) : null;
}
function Ue(i) {
  let e = i.uses.value, t = i.uses.max;
  const s = i.quantity;
  return s && (e = e + (s - 1) * t, t = t * s), { available: e, maximum: t };
}
function at(i) {
  return null;
}
function it(i) {
  return i.properties.thr && !i.properties.ret ? { available: i.quantity, maximum: null } : null;
}
class nt {
  constructor() {
  }
  build(e, t) {
    return this.settingShowNoUses = game.settings.get("action-pack-enhanced", "show-no-uses"), this.settingShowUnpreparedCantrips = game.settings.get("action-pack-enhanced", "show-unprepared-cantrips"), this.settingShowUnpreparedSpells = game.settings.get("action-pack-enhanced", "show-unprepared-spells"), this.settingSkillMode = game.settings.get("action-pack-enhanced", "skill-mode"), this.settingSortAlphabetically = game.settings.get("action-pack-enhanced", "sort-alphabetic"), this.settingShowWeaponMastery = game.settings.get("action-pack-enhanced", "show-weapon-mastery"), e.map((s) => this.prepareActor(s, t));
  }
  prepareActor(e, t) {
    var g, f;
    const s = e.system, a = !!e.itemTypes.feat.find((y) => y.name === "Ritual Adept");
    let n = {
      equipped: { items: [], title: "action-pack-enhanced.category.equipped" },
      inventory: {
        title: "action-pack-enhanced.category.inventory",
        groups: {
          weapon: { items: [], title: "action-pack-enhanced.category.weapon" },
          equipment: { items: [], title: "action-pack-enhanced.category.equipment" },
          consumable: { items: [], title: "action-pack-enhanced.category.consumable" },
          other: { items: [], title: "action-pack-enhanced.category.other" }
        }
      },
      feature: { items: [], title: "action-pack-enhanced.category.feature", groups: this.systemFeatureGroups() },
      spell: {
        title: "action-pack-enhanced.category.spell",
        groups: {
          innate: { items: [], title: "action-pack-enhanced.category.innate" },
          atwill: { items: [], title: "action-pack-enhanced.category.atwill" },
          pact: { items: [], title: "action-pack-enhanced.category.pact" },
          ...[...Array(10).keys()].reduce((y, v) => (y[`spell${v}`] = { items: [], title: `action-pack-enhanced.category.spell${v}` }, y), {})
        }
      },
      passive: { items: [], title: "action-pack-enhanced.category.passive" }
    };
    const o = ["consumable", "container", "equipment", "feat", "loot", "spell", "tool", "weapon"];
    for (const [y, v] of Object.entries(e.itemTypes))
      if (o.includes(y))
        for (const X of v)
          this._processItem(X, y, n, e, a);
    const r = game.modules.find((y) => y.id === "wm5e") && ((g = game.modules.get("wm5e")) == null ? void 0 : g.active);
    if (e.type === "character" && r && e.itemTypes.feat.find((v) => v.name === "Weapon Mastery" || v.name === "Weapon Master")) {
      const v = e.getFlag("action-pack-enhanced", "masterySelectionPending");
      n.equipped.forceOpen = v;
    }
    const l = (f = game.combat) == null ? void 0 : f.combatants.find((y) => y.actor === e), c = l && !l.initiative;
    let p = !1;
    const { uuid: h, showSkills: m } = t || {};
    return e.uuid === h && m && (p = !0), {
      actor: e,
      name: e.name,
      sections: this.addSpellLevelUses(this.sortItems(this.removeEmptySections(n)), s),
      needsInitiative: c,
      skills: CONFIG.DND5E.skills,
      skillMode: this.settingSkillMode,
      showSkills: p
    };
  }
  _processItem(e, t, s, a, n) {
    var h;
    const o = e.system, r = tt(e), l = this.settingShowNoUses || !r || r.available, c = ((h = o == null ? void 0 : o.activities) == null ? void 0 : h.size) > 0, p = e.getFlag("action-pack-enhanced", "hidden");
    if (l && c && !p)
      switch (t) {
        case "feat":
          this._prepareFeat(e, o, r, s);
          break;
        case "spell":
          this._prepareSpell(e, o, r, s, n);
          break;
        case "weapon":
          this._prepareWeapon(e, o, r, s);
          break;
        case "equipment":
          this._prepareEquipment(e, o, r, s);
          break;
        case "consumable":
          this._prepareConsumable(e, o, r, s);
          break;
        case "facility":
          break;
        default:
          this._prepareOther(e, o, r, s);
          break;
      }
    else a.type === "npc" && s.passive.items.push({ item: e, uses: r });
  }
  _prepareFeat(e, t, s, a) {
    var r, l;
    const n = (r = t.type) == null ? void 0 : r.value, o = (l = t.type) == null ? void 0 : l.subtype;
    o && a.feature.groups[o] ? a.feature.groups[o].items.push({ item: e, uses: s }) : n && a.feature.groups[n] ? a.feature.groups[n].items.push({ item: e, uses: s }) : a.feature.items.push({ item: e, uses: s });
  }
  _prepareSpell(e, t, s, a, n) {
    var r;
    switch (t == null ? void 0 : t.method) {
      case "spell":
        const l = (t == null ? void 0 : t.prepared) === 1, c = (t == null ? void 0 : t.prepared) === 2, p = n && ((r = t.properties) == null ? void 0 : r.has("ritual")), h = t.level == 0 && this.settingShowUnpreparedCantrips, m = t.level > 0 && this.settingShowUnpreparedSpells;
        (c || l || p || h || m) && a.spell.groups[`spell${t.level}`].items.push({ item: e, uses: s });
        break;
      case "atwill":
        a.spell.groups.atwill.items.push({ item: e, uses: s });
        break;
      case "innate":
        a.spell.groups.innate.items.push({ item: e, uses: s });
        break;
      case "pact":
        a.spell.groups.pact.items.push({ item: e, uses: s });
        break;
    }
  }
  _prepareWeapon(e, t, s, a) {
    t.equipped ? a.equipped.items.push({ item: e, uses: s }) : a.inventory.groups.weapon.items.push({ item: e, uses: s });
  }
  _prepareEquipment(e, t, s, a) {
    a.inventory.groups.equipment.items.push({ item: e, uses: s });
  }
  _prepareConsumable(e, t, s, a) {
    t.consumableType !== "ammo" && a.inventory.groups.consumable.items.push({ item: e, uses: s });
  }
  _prepareOther(e, t, s, a) {
    a.inventory.groups.other.items.push({ item: e, uses: s });
  }
  systemFeatureGroups() {
    return Object.entries(CONFIG.DND5E.featureTypes).reduce((e, t) => {
      if (e[t[0]] = {
        items: [],
        title: t[1].label
      }, t[1].subtypes)
        for (const s in t[1].subtypes)
          e[s] = {
            items: [],
            title: t[1].subtypes[s]
          };
      return e;
    }, {});
  }
  removeEmptySections(e) {
    const t = (s) => {
      if (!s || typeof s != "object")
        return !1;
      const a = Object.keys(s);
      return a.includes("groups") && Object.values(s.groups).some((n) => t(n)) ? !0 : a.includes("items") ? !!s.items.length : Object.values(s).some((n) => t(n));
    };
    return Object.entries(e).reduce((s, [a, n]) => (t(n) && (s[a] = n), s), {});
  }
  addSpellLevelUses(e, t) {
    var s;
    for (let a = 1; a <= 9; a++) {
      const n = (s = e.spell) == null ? void 0 : s.groups[`spell${a}`];
      if (n) {
        const o = t.spells[`spell${a}`];
        n.uses = { available: o.value, maximum: o.max };
      }
    }
    return t.spells.pact.max && (e.spell.groups.pact.uses = {
      available: t.spells.pact.value,
      maximum: t.spells.pact.max
    }), e;
  }
  sortItems(e) {
    return Object.entries(e).forEach(([t, s]) => {
      t === "items" ? s.sort((a, n) => this.settingSortAlphabetically ? a.item.name.localeCompare(n.item.name) : a.item.sort - n.item.sort) : typeof s == "object" && this.sortItems(s);
    }), e;
  }
}
function ot(i) {
  const { updateTray: e, updateTrayState: t, resetScroll: s } = i;
  function a() {
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
    "skill-mode",
    {
      name: "action-pack-enhanced.settings.skill-mode",
      hint: "action-pack-enhanced.settings.skill-mode-hint",
      scope: "client",
      config: !0,
      default: "dropdown",
      choices: {
        dropdown: "action-pack-enhanced.settings.skill-mode-dropdown",
        append: "action-pack-enhanced.settings.skill-mode-append"
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
    "show-spell-dots",
    {
      name: "action-pack-enhanced.settings.show-spell-dots",
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
      scope: "client",
      config: !0,
      default: !0,
      type: Boolean,
      onChange: () => e()
    }
  ), game.settings.register(
    "action-pack-enhanced",
    "show-no-uses",
    {
      name: "action-pack-enhanced.settings.show-no-uses",
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
      scope: "client",
      config: !0,
      default: !0,
      type: Boolean,
      onChange: () => window.location.reload()
    }
  ), game.keybindings.register("action-pack-enhanced", "toggle-tray", {
    name: "action-pack-enhanced.keybindings.toggle-tray",
    editable: [
      { key: "KeyE", modifiers: [] }
    ],
    onDown: (n) => {
      a() || ($("#ape-app").toggleClass("is-open"), $("#ape-app .ape-skill-container").removeClass("is-open"));
    }
  }), game.keybindings.register("action-pack-enhanced", "toggle-skills", {
    name: "action-pack-enhanced.keybindings.toggle-skills",
    hint: "action-pack-enhanced.keybindings.toggle-skills-hint",
    editable: [
      { key: "KeyK", modifiers: [] }
    ],
    onDown: (n) => {
      if (game.settings.get("action-pack-enhanced", "skill-mode") === "dropdown") {
        const o = $("#ape-app .ape-skill-container").hasClass("is-open");
        if ($("#ape-app").hasClass("is-open") ? $("#ape-app .ape-skill-container").toggleClass("is-open") : ($("#ape-app").toggleClass("is-open"), $("#ape-app .ape-skill-container").addClass("is-open")), !o) {
          s && s();
          const r = $(".ape-container");
          r.length && (r[0].scrollTop = 0);
        }
      } else
        $("#ape-app").hasClass("is-open") || $("#ape-app").toggleClass("is-open"), $(".ape-container")[0].scrollTop = $("#ape-app .ape-skill-container").offset().top;
    }
  });
}
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const L = globalThis, se = L.ShadowRoot && (L.ShadyCSS === void 0 || L.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ie = Symbol(), be = /* @__PURE__ */ new WeakMap();
let rt = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== Ie) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (se && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = be.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && be.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const lt = (i) => new rt(typeof i == "string" ? i : i + "", void 0, Ie), ct = (i, e) => {
  if (se) i.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), a = L.litNonce;
    a !== void 0 && s.setAttribute("nonce", a), s.textContent = t.cssText, i.appendChild(s);
  }
}, ke = se ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return lt(t);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: pt, defineProperty: ht, getOwnPropertyDescriptor: dt, getOwnPropertyNames: ut, getOwnPropertySymbols: mt, getPrototypeOf: gt } = Object, _ = globalThis, _e = _.trustedTypes, ft = _e ? _e.emptyScript : "", K = _.reactiveElementPolyfillSupport, I = (i, e) => i, ee = { toAttribute(i, e) {
  switch (e) {
    case Boolean:
      i = i ? ft : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, e) {
  let t = i;
  switch (e) {
    case Boolean:
      t = i !== null;
      break;
    case Number:
      t = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(i);
      } catch {
        t = null;
      }
  }
  return t;
} }, Re = (i, e) => !pt(i, e), we = { attribute: !0, type: String, converter: ee, reflect: !1, useDefault: !1, hasChanged: Re };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), _.litPropertyMetadata ?? (_.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let T = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = we) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = Symbol(), a = this.getPropertyDescriptor(e, s, t);
      a !== void 0 && ht(this.prototype, e, a);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: a, set: n } = dt(this.prototype, e) ?? { get() {
      return this[t];
    }, set(o) {
      this[t] = o;
    } };
    return { get: a, set(o) {
      const r = a == null ? void 0 : a.call(this);
      n == null || n.call(this, o), this.requestUpdate(e, r, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? we;
  }
  static _$Ei() {
    if (this.hasOwnProperty(I("elementProperties"))) return;
    const e = gt(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(I("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(I("properties"))) {
      const t = this.properties, s = [...ut(t), ...mt(t)];
      for (const a of s) this.createProperty(a, t[a]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [s, a] of t) this.elementProperties.set(s, a);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, s] of this.elementProperties) {
      const a = this._$Eu(t, s);
      a !== void 0 && this._$Eh.set(a, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const a of s) t.unshift(ke(a));
    } else e !== void 0 && t.push(ke(e));
    return t;
  }
  static _$Eu(e, t) {
    const s = t.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof e == "string" ? e.toLowerCase() : void 0;
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
    for (const s of t.keys()) this.hasOwnProperty(s) && (e.set(s, this[s]), delete this[s]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return ct(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((t) => {
      var s;
      return (s = t.hostConnected) == null ? void 0 : s.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var s;
      return (s = t.hostDisconnected) == null ? void 0 : s.call(t);
    });
  }
  attributeChangedCallback(e, t, s) {
    this._$AK(e, s);
  }
  _$ET(e, t) {
    var n;
    const s = this.constructor.elementProperties.get(e), a = this.constructor._$Eu(e, s);
    if (a !== void 0 && s.reflect === !0) {
      const o = (((n = s.converter) == null ? void 0 : n.toAttribute) !== void 0 ? s.converter : ee).toAttribute(t, s.type);
      this._$Em = e, o == null ? this.removeAttribute(a) : this.setAttribute(a, o), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var n, o;
    const s = this.constructor, a = s._$Eh.get(e);
    if (a !== void 0 && this._$Em !== a) {
      const r = s.getPropertyOptions(a), l = typeof r.converter == "function" ? { fromAttribute: r.converter } : ((n = r.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? r.converter : ee;
      this._$Em = a;
      const c = l.fromAttribute(t, r.type);
      this[a] = c ?? ((o = this._$Ej) == null ? void 0 : o.get(a)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, t, s, a = !1, n) {
    var o;
    if (e !== void 0) {
      const r = this.constructor;
      if (a === !1 && (n = this[e]), s ?? (s = r.getPropertyOptions(e)), !((s.hasChanged ?? Re)(n, t) || s.useDefault && s.reflect && n === ((o = this._$Ej) == null ? void 0 : o.get(e)) && !this.hasAttribute(r._$Eu(e, s)))) return;
      this.C(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: s, reflect: a, wrapped: n }, o) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, o ?? t ?? this[e]), n !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)), a === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const a = this.constructor.elementProperties;
      if (a.size > 0) for (const [n, o] of a) {
        const { wrapped: r } = o, l = this[n];
        r !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, o, l);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (s = this._$EO) == null || s.forEach((a) => {
        var n;
        return (n = a.hostUpdate) == null ? void 0 : n.call(a);
      }), this.update(t)) : this._$EM();
    } catch (a) {
      throw e = !1, this._$EM(), a;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((s) => {
      var a;
      return (a = s.hostUpdated) == null ? void 0 : a.call(s);
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
T.elementStyles = [], T.shadowRootOptions = { mode: "open" }, T[I("elementProperties")] = /* @__PURE__ */ new Map(), T[I("finalized")] = /* @__PURE__ */ new Map(), K == null || K({ ReactiveElement: T }), (_.reactiveElementVersions ?? (_.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const R = globalThis, Se = (i) => i, q = R.trustedTypes, Ae = q ? q.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, De = "$lit$", k = `lit$${Math.random().toFixed(9).slice(2)}$`, He = "?" + k, yt = `<${He}>`, C = document, D = () => C.createComment(""), H = (i) => i === null || typeof i != "object" && typeof i != "function", ae = Array.isArray, $t = (i) => ae(i) || typeof (i == null ? void 0 : i[Symbol.iterator]) == "function", Z = `[ 	
\f\r]`, U = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, xe = /-->/g, Ce = />/g, S = RegExp(`>|${Z}(?:([^\\s"'>=/]+)(${Z}*=${Z}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ee = /'/g, Oe = /"/g, Ne = /^(?:script|style|textarea|title)$/i, vt = (i) => (e, ...t) => ({ _$litType$: i, strings: e, values: t }), u = vt(1), E = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), Pe = /* @__PURE__ */ new WeakMap(), A = C.createTreeWalker(C, 129);
function ze(i, e) {
  if (!ae(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ae !== void 0 ? Ae.createHTML(e) : e;
}
const bt = (i, e) => {
  const t = i.length - 1, s = [];
  let a, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = U;
  for (let r = 0; r < t; r++) {
    const l = i[r];
    let c, p, h = -1, m = 0;
    for (; m < l.length && (o.lastIndex = m, p = o.exec(l), p !== null); ) m = o.lastIndex, o === U ? p[1] === "!--" ? o = xe : p[1] !== void 0 ? o = Ce : p[2] !== void 0 ? (Ne.test(p[2]) && (a = RegExp("</" + p[2], "g")), o = S) : p[3] !== void 0 && (o = S) : o === S ? p[0] === ">" ? (o = a ?? U, h = -1) : p[1] === void 0 ? h = -2 : (h = o.lastIndex - p[2].length, c = p[1], o = p[3] === void 0 ? S : p[3] === '"' ? Oe : Ee) : o === Oe || o === Ee ? o = S : o === xe || o === Ce ? o = U : (o = S, a = void 0);
    const g = o === S && i[r + 1].startsWith("/>") ? " " : "";
    n += o === U ? l + yt : h >= 0 ? (s.push(c), l.slice(0, h) + De + l.slice(h) + k + g) : l + k + (h === -2 ? r : g);
  }
  return [ze(i, n + (i[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class N {
  constructor({ strings: e, _$litType$: t }, s) {
    let a;
    this.parts = [];
    let n = 0, o = 0;
    const r = e.length - 1, l = this.parts, [c, p] = bt(e, t);
    if (this.el = N.createElement(c, s), A.currentNode = this.el.content, t === 2 || t === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (a = A.nextNode()) !== null && l.length < r; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const h of a.getAttributeNames()) if (h.endsWith(De)) {
          const m = p[o++], g = a.getAttribute(h).split(k), f = /([.?@])?(.*)/.exec(m);
          l.push({ type: 1, index: n, name: f[2], strings: g, ctor: f[1] === "." ? _t : f[1] === "?" ? wt : f[1] === "@" ? St : F }), a.removeAttribute(h);
        } else h.startsWith(k) && (l.push({ type: 6, index: n }), a.removeAttribute(h));
        if (Ne.test(a.tagName)) {
          const h = a.textContent.split(k), m = h.length - 1;
          if (m > 0) {
            a.textContent = q ? q.emptyScript : "";
            for (let g = 0; g < m; g++) a.append(h[g], D()), A.nextNode(), l.push({ type: 2, index: ++n });
            a.append(h[m], D());
          }
        }
      } else if (a.nodeType === 8) if (a.data === He) l.push({ type: 2, index: n });
      else {
        let h = -1;
        for (; (h = a.data.indexOf(k, h + 1)) !== -1; ) l.push({ type: 7, index: n }), h += k.length - 1;
      }
      n++;
    }
  }
  static createElement(e, t) {
    const s = C.createElement("template");
    return s.innerHTML = e, s;
  }
}
function M(i, e, t = i, s) {
  var o, r;
  if (e === E) return e;
  let a = s !== void 0 ? (o = t._$Co) == null ? void 0 : o[s] : t._$Cl;
  const n = H(e) ? void 0 : e._$litDirective$;
  return (a == null ? void 0 : a.constructor) !== n && ((r = a == null ? void 0 : a._$AO) == null || r.call(a, !1), n === void 0 ? a = void 0 : (a = new n(i), a._$AT(i, t, s)), s !== void 0 ? (t._$Co ?? (t._$Co = []))[s] = a : t._$Cl = a), a !== void 0 && (e = M(i, a._$AS(i, e.values), a, s)), e;
}
class kt {
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
    const { el: { content: t }, parts: s } = this._$AD, a = ((e == null ? void 0 : e.creationScope) ?? C).importNode(t, !0);
    A.currentNode = a;
    let n = A.nextNode(), o = 0, r = 0, l = s[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let c;
        l.type === 2 ? c = new j(n, n.nextSibling, this, e) : l.type === 1 ? c = new l.ctor(n, l.name, l.strings, this, e) : l.type === 6 && (c = new At(n, this, e)), this._$AV.push(c), l = s[++r];
      }
      o !== (l == null ? void 0 : l.index) && (n = A.nextNode(), o++);
    }
    return A.currentNode = C, a;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class j {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, s, a) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = a, this._$Cv = (a == null ? void 0 : a.isConnected) ?? !0;
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
    e = M(this, e, t), H(e) ? e === d || e == null || e === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : e !== this._$AH && e !== E && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : $t(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== d && H(this._$AH) ? this._$AA.nextSibling.data = e : this.T(C.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var n;
    const { values: t, _$litType$: s } = e, a = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = N.createElement(ze(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === a) this._$AH.p(t);
    else {
      const o = new kt(a, this), r = o.u(this.options);
      o.p(t), this.T(r), this._$AH = o;
    }
  }
  _$AC(e) {
    let t = Pe.get(e.strings);
    return t === void 0 && Pe.set(e.strings, t = new N(e)), t;
  }
  k(e) {
    ae(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, a = 0;
    for (const n of e) a === t.length ? t.push(s = new j(this.O(D()), this.O(D()), this, this.options)) : s = t[a], s._$AI(n), a++;
    a < t.length && (this._$AR(s && s._$AB.nextSibling, a), t.length = a);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, t); e !== this._$AB; ) {
      const a = Se(e).nextSibling;
      Se(e).remove(), e = a;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class F {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, a, n) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = e, this.name = t, this._$AM = a, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = d;
  }
  _$AI(e, t = this, s, a) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) e = M(this, e, t, 0), o = !H(e) || e !== this._$AH && e !== E, o && (this._$AH = e);
    else {
      const r = e;
      let l, c;
      for (e = n[0], l = 0; l < n.length - 1; l++) c = M(this, r[s + l], t, l), c === E && (c = this._$AH[l]), o || (o = !H(c) || c !== this._$AH[l]), c === d ? e = d : e !== d && (e += (c ?? "") + n[l + 1]), this._$AH[l] = c;
    }
    o && !a && this.j(e);
  }
  j(e) {
    e === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class _t extends F {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === d ? void 0 : e;
  }
}
class wt extends F {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== d);
  }
}
class St extends F {
  constructor(e, t, s, a, n) {
    super(e, t, s, a, n), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = M(this, e, t, 0) ?? d) === E) return;
    const s = this._$AH, a = e === d && s !== d || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, n = e !== d && (s === d || a);
    a && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class At {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    M(this, e);
  }
}
const J = R.litHtmlPolyfillSupport;
J == null || J(N, j), (R.litHtmlVersions ?? (R.litHtmlVersions = [])).push("3.3.2");
const xt = (i, e, t) => {
  const s = (t == null ? void 0 : t.renderBefore) ?? e;
  let a = s._$litPart$;
  if (a === void 0) {
    const n = (t == null ? void 0 : t.renderBefore) ?? null;
    s._$litPart$ = a = new j(e.insertBefore(D(), n), n, void 0, t ?? {});
  }
  return a._$AI(i), a;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x = globalThis;
let b = class extends T {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = xt(t, this.renderRoot, this.renderOptions);
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
    return E;
  }
};
var Me;
b._$litElement$ = !0, b.finalized = !0, (Me = x.litElementHydrateSupport) == null || Me.call(x, { LitElement: b });
const Y = x.litElementPolyfillSupport;
Y == null || Y({ LitElement: b });
(x.litElementVersions ?? (x.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ct = { CHILD: 2 }, Et = (i) => (...e) => ({ _$litDirective$: i, values: e });
class Ot {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, t, s) {
    this._$Ct = e, this._$AM = t, this._$Ci = s;
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
class te extends Ot {
  constructor(e) {
    if (super(e), this.it = d, e.type !== Ct.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(e) {
    if (e === d || e == null) return this._t = void 0, this.it = e;
    if (e === E) return e;
    if (typeof e != "string") throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (e === this.it) return this._t;
    this.it = e;
    const t = [e];
    return t.raw = t, this._t = { _$litType$: this.constructor.resultType, strings: t, values: [] };
  }
}
te.directiveName = "unsafeHTML", te.resultType = 1;
const Pt = Et(te);
class je extends b {
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
  render() {
    var le, ce, pe, he, de, ue, me, ge, fe, ye, $e, ve;
    if (!this.item) return d;
    const e = this.item.system, t = this.item.actor, s = e.rarity !== "" ? e.rarity : this.item.type === "weapon" ? "common" : "", a = this.item.type === "spell", n = e.method === "innate", o = this.uses && (!a || n), r = (le = e.properties) == null ? void 0 : le.has("ritual"), l = (ce = e.properties) == null ? void 0 : ce.has("concentration"), c = ((pe = e.activation) == null ? void 0 : pe.type) === "bonus", p = ((he = e.activation) == null ? void 0 : he.type) === "reaction", h = ((de = e.activation) == null ? void 0 : de.type) === "legendary", m = (ue = e.recharge) == null ? void 0 : ue.value, g = (me = e.recharge) == null ? void 0 : me.charged;
    let f = !1, y = !1, v = "";
    if (game.modules.find((O) => O.id === "wm5e") && ((ge = game.modules.get("wm5e")) != null && ge.active) && (f = e.mastery || !1, f && this.item.type === "weapon")) {
      const O = (fe = e.type) == null ? void 0 : fe.baseItem, Fe = new Set(this.masteryIds || ((ve = ($e = (ye = t.system.traits) == null ? void 0 : ye.weaponProf) == null ? void 0 : $e.mastery) == null ? void 0 : ve.value) || []);
      y = O && Fe.has(O), v = game.i18n.localize(`action-pack-enhanced.masteries.${f}`);
    }
    const X = !!t.itemTypes.feat.find((O) => O.name === "Ritual Adept"), V = e.prepared === 0 && !(r && X);
    return u`
            <div class="item-name rollable flexrow ${V ? "unprepared" : ""}">
                <div class="item-image ${s}${V ? " unprepared" : ""}" 
                        style="background-image: url('${this.item.img}')"
                        @mousedown="${this._onRoll}">
                    <i class="fa fa-dice-d20"></i>
                </div>
                
                <div class="item-name-wrap flexrow">
                    <h4 @mousedown="${this._onClick}">
                        <span class="item-text ${s}">${this.item.name}</span>
                        ${o ? u` (${this.uses.available}${this.uses.maximum ? "/" + this.uses.maximum : ""})` : d}
                    </h4>
                    ${this.showWeaponMastery ? this._renderWeaponMastery(f, y, v) : d}
                </div>

                ${r ? u`<div class="ritual flag" title="${game.i18n.localize("action-pack-enhanced.flag.ritual-title")}"></div>` : d}
                ${l ? u`<div class="concentration flag" title="${game.i18n.localize("action-pack-enhanced.flag.concentration-title")}"></div>` : d}
                ${c ? u`<div class="bonus flag" title="${game.i18n.localize("action-pack-enhanced.flag.bonus-title")}">${game.i18n.localize("action-pack-enhanced.flag.bonus")}</div>` : d}
                ${p ? u`<div class="reaction flag" title="${game.i18n.localize("action-pack-enhanced.flag.reaction-title")}">${game.i18n.localize("action-pack-enhanced.flag.reaction")}</div>` : d}
                ${h ? u`<div class="legendary flag" title="${game.i18n.localize("action-pack-enhanced.flag.legendary-title")}">${game.i18n.localize("action-pack-enhanced.flag.legendary")}</div>` : d}

                ${m ? g ? u`<div class="flag"><i class="fas fa-bolt"></i></div>` : u`<div class="flag"><a class="rollable item-recharge" @mousedown="${this._onRecharge}"><i class="fas fa-dice-six"></i> ${e.recharge.value}+</a></div>` : d}

                ${V ? u`<div class="unprepared flag" title="${game.i18n.localize("action-pack-enhanced.flag.unprepared-title")}">${game.i18n.localize("action-pack-enhanced.flag.unprepared")}</div>` : d}
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
                    ${this.description ? u`<p>${Pt(this.description.description)}</p>` : u`<i class="fas fa-spinner fa-spin"></i>`}
                    <div class="item-properties">
                        ${this._renderItemProperties(this.item)}
                    </div>
                </div>
            ` : d}
        `;
  }
  _renderItemDetails() {
    const e = Ke(this.item);
    return u`
            ${e.castingTime ? u`<p><strong>Casting Time:</strong> ${e.castingTime}</p>` : d}
            ${e.range ? u`<p><strong>Range:</strong> ${e.range}</p>` : d}
            ${e.duration ? u`<p><strong>Duration:</strong> ${e.duration}</p>` : d}
            ${e.materials ? u`<p><strong>Materials:</strong> ${e.materials}</p>` : d}
        `;
  }
  _renderItemProperties(e) {
    var n, o, r, l, c;
    const t = ((n = e == null ? void 0 : e.labels) == null ? void 0 : n.properties) || [], s = e.labels.hasOwnProperty("damageTypes") ? (r = (o = e == null ? void 0 : e.labels) == null ? void 0 : o.damageTypes) != null && r.includes(",") ? (l = e == null ? void 0 : e.labels) == null ? void 0 : l.damageTypes.split(",") : [(c = e == null ? void 0 : e.labels) == null ? void 0 : c.damageTypes] : [], a = [];
    if (s.length > 0) {
      const h = s.map((m) => ({ label: m })).map((m) => m.label);
      a.push(...h);
    }
    if (t.length > 0) {
      const p = t.map((h) => h.label);
      p.sort((h, m) => h.toLowerCase().localeCompare(m.toLowerCase())), a.push(...p);
    }
    return a.length === 0 ? d : u`
            ${a ? u`${a.map((p) => u`<span class="tag">${p}</span>`)} ` : d}
        `;
  }
  _renderWeaponMastery(e, t, s) {
    var a;
    return (a = game.modules.get("wm5e")) != null && a.active && e ? u`<div class="mastery ${t ? "active" : "inactive"} flag">${s}</div>` : d;
  }
}
P(je, "properties", {
  item: { type: Object },
  uses: { type: Object },
  api: { type: Object },
  masteryIds: { type: Array },
  expanded: { type: Boolean, state: !0 },
  description: { type: Object, state: !0 },
  showWeaponMastery: { type: Boolean }
});
customElements.define("ape-item", je);
class Be extends b {
  _openJournal(e) {
    fromUuid(e).then((t) => {
      var s;
      return (s = t == null ? void 0 : t.sheet) == null ? void 0 : s.render(!0);
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
  render() {
    return u`
            ${this.title ? u`
                <h2 @click="${this._toggleOpen}">
                    <i class="fas fa-caret-down"></i> ${game.i18n.localize(this.title)}
                </h2>
            ` : d}

            ${this.items && this.items.length > 0 ? u`
                <div class="ape-items">
                    ${this.items.map((e) => {
      var t, s, a, n, o;
      return u`
                        <ape-item class="ape-item item" 
                            data-item-uuid="${e.item.uuid}" 
                            .item="${e.item}" 
                            .uses="${e.uses}" 
                            .api="${this.api}"
                            .masteryIds="${(o = (n = (a = (s = (t = this.actor) == null ? void 0 : t.system) == null ? void 0 : s.traits) == null ? void 0 : a.weaponProf) == null ? void 0 : n.mastery) == null ? void 0 : o.value}"
                            .showWeaponMastery="${this.showWeaponMastery}">
                        </ape-item>
                    `;
    })}
                </div>
            ` : d}

            ${this.groups ? Object.entries(this.groups).map(([e, t]) => u`
                <ape-group 
                    class="ape-group"
                    .group="${t}" 
                    .groupName="${e}" 
                    .api="${this.api}"
                    .actor="${this.actor}"
                    .showSpellDots="${this.showSpellDots}"
                    .showSpellUses="${this.showSpellUses}">
                </ape-group>
            `) : d}
        `;
  }
}
P(Be, "properties", {
  title: { type: String },
  items: { type: Array },
  // Array of {item, uses} objects
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
  showWeaponMastery: { type: Boolean }
});
customElements.define("ape-section", Be);
class Le extends b {
  constructor() {
    super(), this.isOpen = !0;
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
    if (!this.group) return d;
    const { items: e, uses: t, title: s } = this.group, a = e && e.length > 0, n = t && t.maximum;
    if (!a && !n) return d;
    const o = n && this.showSpellDots, r = t && this.showSpellUses, l = [
      "flexrow",
      "ape-group-header",
      o ? "has-dots" : "",
      r ? "has-uses" : ""
    ].filter(Boolean).join(" ");
    return u`
            <div class="${l}" @click="${this._toggleOpen}">
                <h3>
                    <i class="fas fa-caret-down"></i> ${game.i18n.localize(s)}
                </h3>
                ${o ? this._renderDots(t) : d}
                ${r ? u`<div class="group-uses">${t.available}/${t.maximum}</div>` : d}
            </div>

            ${a ? u`
                <div class="ape-items">
                    ${e.map((c) => u`
                        <ape-item class="ape-item item" data-item-uuid="${c.item.uuid}" .item="${c.item}" .uses="${c.uses}" .api="${this.api}"></ape-item>
                    `)}
                </div>
            ` : d}
        `;
  }
  _renderDots(e) {
    return u`
            <div class="group-dots" data-group-name="${this.groupName}">
                ${Array.from({ length: e.maximum }).map((t, s) => u`
                    <div class="dot ${s < e.available ? "" : "empty"}" 
                         data-slot="${s}"
                         @click="${(a) => {
      a.stopPropagation(), this.api.adjustSpellSlot(this.actor, this.groupName, s);
    }}">
                    </div>
                `)}
            </div>
        `;
  }
}
P(Le, "properties", {
  group: { type: Object },
  groupName: { type: String },
  api: { type: Object },
  actor: { type: Object },
  showSpellDots: { type: Boolean },
  showSpellUses: { type: Boolean },
  isOpen: { type: Boolean, state: !0 },
  forceOpen: { type: Boolean }
});
customElements.define("ape-group", Le);
class qe extends b {
  createRenderRoot() {
    return this;
  }
  updated(e) {
    e.has("actorData") && this.actorData && (this.dataset.actorUuid = this.actorData.actor.uuid);
  }
  render() {
    if (!this.actorData) return d;
    const { actor: e, name: t, sections: s, needsInitiative: a, skillMode: n, showSkills: o } = this.actorData, r = e.system.attributes.hp, l = e.system.attributes.ac.value, c = e.type, p = r.value <= 0 && c === "character", h = e.system.attributes.inspiration;
    return u`
            <div class="ape-actor-header">
                <h1>
                    <a class="ape-actor-name" @click="${(m) => this.api.openSheet(e)}">${t.split(" ")[0]}</a>
                    <a class="ape-actor-inspiration ${h ? "ape-actor-inspiration-active" : ""}" title="${t} is ${h ? "inspired" : "not inspired"}!" @mousedown="${(m) => this.api.toggleInspiration(e, m)}">
                        <svg width="100%" height="100%" viewBox="0 0 163 191" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
                            <path class="${game.settings.get("action-pack-enhanced", "show-inspiration-animation") ? "animated" : ""}" d="M58.699,71.415l0,63.404"/>
                            <path class="${game.settings.get("action-pack-enhanced", "show-inspiration-animation") ? "animated" : ""}" d="M78.624,71.415l0,63.404"/>
                            <path class="${game.settings.get("action-pack-enhanced", "show-inspiration-animation") ? "animated" : ""}" d="M97.63,71.415l0,63.404"/>
                            <path class="${game.settings.get("action-pack-enhanced", "show-inspiration-animation") ? "animated" : ""}" d="M35.88,149.717c-4.526,3.624 -16.665,18.643 -20.574,22.552c30.949,15.518 96.969,17.912 122.372,-1.233c-4.18,-4.18 -18.011,-21.744 -18.295,-22.22c-0.881,9.201 -82.394,9.898 -83.502,0.9Zm-0.489,-101.365l83.626,0.267c0,0 0.366,79.504 0.366,100.197c0,9.081 -83.502,9.982 -83.502,0.9c0,-14.9 -0.489,-101.365 -0.489,-101.365Zm83.714,16.03c0,0 29.622,-0.424 33.244,2.76c4.154,3.651 6.015,31.36 0.334,41.72c-5.681,10.36 -33.166,19.636 -33.166,19.636l-0.412,-64.116Z"/>
                            <path id="foam" class="ape-actor-inspiration-foam ${h ? "ape-actor-inspiration-foam-active" : "ape-actor-inspiration-foam-hidden"} ${game.settings.get("action-pack-enhanced", "show-inspiration-animation") ? "animated" : ""}" d="M26.53,76.061c0,0 -24.573,-12.245 -19.621,-37.499c4.953,-25.254 36.384,-1.701 38.194,-0.34c1.81,1.361 -8.286,-33.928 21.049,-31.887c29.336,2.041 31.382,19.982 31.478,26.19c0.095,6.207 8.138,-23.223 34.718,-8.503c17.811,9.864 8.665,25.224 5.33,29.251c-3.364,4.062 -9.328,9.305 -14.471,11.091c-4.583,1.591 -20.853,3.096 -29.719,-11.516c-1.238,-2.041 -0.932,15.302 -9.097,16.357c-3.908,0.505 -14.578,3.667 -23.477,-13.095c-10.105,33.947 -34.384,19.951 -34.384,19.951Z"/>
                        </svg>
                    </a>
                    <span class="ape-actor-ac">
                        <img class="ape-actor-ac-icon" src="/modules/action-pack-enhanced/images/ac-icon.svg">
                        <span class="ape-actor-ac-display">${l}</span>
                    </span>
                </h1>

                ${c === "character" ? u`
                    <div class="ape-actor-race-class">
                        ${this._renderRaceClass(e)}
                    </div>
                ` : d}

                ${game.settings.get("action-pack-enhanced", "show-xp-info") && c === "character" ? this._renderExperience(e) : d}

                <div class="ape-actor-rest-buttons">
                    <button class="ape-actor-rest-button" @click="${() => this.api.shortRest(e)}"><span class="fas fa-fork-knife"></span></button>
                    <button class="ape-actor-rest-button" @click="${() => this.api.longRest(e)}"><span class="fas fa-tent"></span></button>
                </div>

                ${this._renderHpBar(e, r)}
                
            </div>

            ${p ? this._renderDeathSaves(e) : d}

            ${a ? u`
                <div class="ape-initiative" @click="${() => this.api.rollInitiative(e)}">
                    <i class="fas fa-swords ape-initiative-icon"></i>
                    <span class="ape-initiative-text">${game.i18n.localize("action-pack-enhanced.roll-initiative")}</span>
                </div>
            ` : d}

            ${this._renderAbilities(e)}

            ${n === "dropdown" ? this._renderSkills(e, o, !0) : d}

            <!-- Sections -->
            ${this._renderSections(e, s)}

            ${n === "append" ? this._renderSkills(e, o, !1) : d}
        `;
  }
  _renderExperience(e) {
    const t = e.system.details, s = t.xp.pct, a = t.xp.max, n = t.xp.min, o = t.xp.value;
    return u`
            <div class="ape-actor-xp">
                <div class="ape-actor-xp-bar" style="--bar-percent: ${s}%"></div>
                <div class="ape-actor-xp-info">
                    <span class="ape-actor-xp-current" @click="${this._toggleXpActions}">${o}</span>
                    <span class="ape-actor-xp-separator">/</span>
                    <span class="ape-actor-xp-max">${a}</span>
                </div>
                <div class="ape-actor-xp-actions ${this._xpActionsOpen ? "active" : "inactive"}">
                    <button class="ape-actor-xp-close" @click="${this._toggleXpActions}">close</button>
                    <p>Choose an amount to add to or subtract from ${e.name}'s XP</p>
                    <div class="ape-actor-xp-increment">
                        <button class="ape-actor-xp-button" ?disabled="${o >= a}" @click="${() => this.api.updateXP(e, o + 1)}">+1</button>
                        <button class="ape-actor-xp-button" ?disabled="${o >= a}" @click="${() => this.api.updateXP(e, o + 10)}">+10</button>
                        <button class="ape-actor-xp-button" ?disabled="${o >= a}" @click="${() => this.api.updateXP(e, o + 100)}">+100</button>
                        <button class="ape-actor-xp-button" ?disabled="${o >= a}" @click="${() => this.api.updateXP(e, o + 1e3)}">+1000</button>
                    </div>
                    <div class="ape-actor-xp-decrement">
                        <button class="ape-actor-xp-button" ?disabled="${o <= n}" @click="${() => this.api.updateXP(e, o - 1)}">-1</button>
                        <button class="ape-actor-xp-button" ?disabled="${o <= n}" @click="${() => this.api.updateXP(e, o - 10)}">-10</button>
                        <button class="ape-actor-xp-button" ?disabled="${o <= n}" @click="${() => this.api.updateXP(e, o - 100)}">-100</button>
                        <button class="ape-actor-xp-button" ?disabled="${o <= n}" @click="${() => this.api.updateXP(e, o - 1e3)}">-1000</button>
                    </div>
                    <div class="ape-actor-xp-max">
                        <button class="ape-actor-xp-button" ?disabled="${o >= a}" @click="${() => this.api.updateXP(e, a)}">Max</button>
                    </div>
                </div>
            </div>
        `;
  }
  _toggleXpActions() {
    this._xpActionsOpen = !this._xpActionsOpen;
  }
  _renderRaceClass(e) {
    const t = et(e);
    return u`<div style="display:contents" .innerHTML="${t.replace(/,/g, "<br />")}"></div>`;
  }
  _renderHpBar(e, t) {
    const s = Math.min(100, Math.max(0, t.value / t.max * 100));
    return u`
             <div class="ape-actor-hp-wrapper">
                <div class="ape-actor-hp" style="--bar-percent: ${s}%">
                    <span class="ape-actor-hp-text">
                        <span class="ape-actor-hp-display" @click="${this._toggleHpInput}">
                            <span class="ape-actor-hp-value">${t.value}</span>
                            <span class="ape-actor-hp-separator">/</span>
                            <span class="ape-actor-hp-max">${t.max}</span>
                        </span>
                        <input type="text" class="ape-actor-hp-input" value="${t.value}" 
                               style="display:none"
                               @blur="${this._finishHpEdit}"
                               @keydown="${this._hpInputKey}"
                               @change="${(a) => this.api.updateHP(e, parseInt(a.target.value))}">
                    </span>
                </div>
                <div class="ape-actor-temp">
                     <span class="ape-actor-temp-display" @click="${this._toggleTempInput}">${t.temp || 0}</span>
                     <input type="text" class="ape-actor-temp-input" value="${t.temp || 0}" 
                            style="display:none"
                            @blur="${this._finishTempEdit}"
                            @keydown="${this._hpInputKey}"
                            @change="${(a) => this.api.updateTempHP(e, parseInt(a.target.value))}">
                </div>
             </div>
        `;
  }
  _toggleHpInput(e) {
    const t = e.currentTarget, s = t.nextElementSibling;
    t.style.display = "none", s.style.display = "inline-block", s.focus(), s.select();
  }
  _finishHpEdit(e) {
    const t = e.currentTarget, s = t.previousElementSibling;
    t.style.display = "none", s.style.display = "";
  }
  _toggleTempInput(e) {
    const t = e.currentTarget, s = t.nextElementSibling;
    t.style.display = "none", s.style.display = "inline-block", s.focus(), s.select();
  }
  _finishTempEdit(e) {
    const t = e.currentTarget, s = t.previousElementSibling;
    t.style.display = "none", s.style.display = "";
  }
  _hpInputKey(e) {
    e.key === "Enter" && e.currentTarget.blur();
  }
  _renderAbilities(e) {
    const t = this.globalData.abilityColumns;
    return u`
            <div class="ape-abilities">
                ${t.map((s) => u`
                    <div class="flex-col">
                        <span class="ape-ability">
                             <span class="ape-ability-label">&nbsp;</span>
                             <span class="ape-ability-hdr">check</span>
                             <span class="ape-ability-hdr">save</span>
                        </span>
                        ${s.map((a) => {
      const n = e.system.abilities[a.key];
      return u`
                                <span class="ape-ability">
                                    <span class="ape-ability-label">${a.key}</span>
                                    <a class="fas fa-dice-d20 ape-ability-check" 
                                       title="${a.label} check"
                                       @click="${(o) => this.api.rollAbilityCheck(e, a.key, o)}">
                                        <span class="ape-ability-text">${G(n.mod)}</span>
                                    </a>
                                    <a class="fas fa-dice-d20 ape-ability-save" 
                                       title="${a.label} saving throw"
                                       @click="${(o) => this.api.rollSavingThrow(e, a.key, o)}">
                                        <span class="ape-ability-text">${G(n.save.value)}</span>
                                    </a>
                                </span>
                            `;
    })}
                    </div>
                `)}
            </div>
        `;
  }
  _renderSkills(e, t, s) {
    const a = this.actorData.skills, n = e.system.skills;
    return u`
            <div class="ape-skill-container ${this.actorData.skillMode} ${t ? "is-open" : ""}">
                ${s ? u`
                    <h2 class="ape-skill-header" @click="${this._toggleSkills}">
                        <i class="fas fa-caret-down"></i> Skills
                    </h2>
                ` : d}

                <div class="ape-skills">
                    ${Object.keys(n).map((o) => {
      const r = n[o], l = a[o];
      if (!l) return d;
      let c = "far fa-circle";
      return r.proficient === 0.5 ? c = "fas fa-adjust" : r.proficient === 1 ? c = "fas fa-check" : r.proficient === 2 && (c = "fas fa-star"), u`
                            <div class="ape-skill-row flexrow ${r.proficient === 1 ? "proficient" : r.proficient === 2 ? "expert" : ""}"
                               @click="${(p) => this.api.rollSkill(e, o, p)}"
                               @contextmenu="${(p) => this.api.rollSkill(e, o, p, !0)}">
                                <span class="ape-skill-icon ${c}"></span>
                                <span class="ape-skill-ability">${r.ability}</span>
                                <span class="ape-skill-label">${l.label}</span>
                                <span class="ape-skill-bonus">${G(r.total)}</span>
                                <span class="ape-skill-passive">(${r.passive})</span>
                            </div>
                        `;
    })}
                </div>
            </div>
        `;
  }
  _toggleSkills(e) {
    e.currentTarget.parentElement.classList.toggle("is-open");
  }
  _renderDeathSaves(e) {
    const t = e.system.attributes.death.failure, s = e.system.attributes.death.success, a = (o, r, l) => Array.from({ length: 3 }).map((c, p) => u`
                <span class="ape-death-dot ${p < o ? "filled" : ""}">
                    ${p < o ? u`<span class="fas ${l}"></span>` : d}
                </span>
             `), n = t < 3 && s < 3;
    return u`
             <div class="ape-death-saving">
                <span class="ape-death-throws failed">
                    ${a(t, "failed", "fa-skull-crossbones")}
                </span>
                <span class="ape-death-icon" 
                      style="${n ? "cursor:pointer" : "cursor:default"}"
                      @mousedown="${n ? (o) => this.api.rollDeathSave(e, o) : null}"></span>
                <span class="ape-death-throws saved">
                    ${a(s, "saved", "fa-check")}
                </span>
             </div>
        `;
  }
  _renderSections(e, t) {
    return ["equipped", "feature", "spell", "inventory", "passive"].map((a) => {
      const n = t[a];
      return n ? u`
                <ape-section 
                    class="ape-category"
                    .title="${n.title}" 
                    .items="${n.items}"
                    .groups="${n.groups}"
                    .sectionId="${a}"
                    .api="${this.api}"
                    .actor="${e}"
                    .showSpellDots="${this.globalData.showSpellDots}"
                    .showSpellUses="${this.globalData.showSpellUses}"
                    .showWeaponMastery="${this.globalData.showWeaponMastery}"
                    .forceOpen="${n.forceOpen}">
                </ape-section>
            ` : d;
    });
  }
}
P(qe, "properties", {
  actorData: { type: Object },
  // The object returned by data-builder
  globalData: { type: Object },
  // Global settings/options
  api: { type: Object },
  _xpActionsOpen: { state: !1 }
});
customElements.define("ape-actor", qe);
class We extends b {
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
      const t = this.data.actors[0].actor.uuid, s = e.target.scrollTop, a = !!this.querySelector(".ape-skill-container.is-open");
      this.api.setScrollPosition({ uuid: t, scroll: s, showSkills: a });
    }
  }
  render() {
    if (!this.data) return d;
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
                    ` : e.map((a) => u`
                        <ape-actor 
                            class="ape-actor"
                            .actorData="${a}"
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
    return d;
  }
}
P(We, "properties", {
  data: { type: Object },
  // Contains actors
  globalData: { type: Object },
  // Contains abilityColumns, showSpellDots
  api: { type: Object }
});
customElements.define("ape-app", We);
let W, z, Te, Q;
function Tt(i) {
  var o;
  if (!i || i === "") return null;
  let e = i.split(".");
  if (e[0] === "Compendium")
    return null;
  const [t, s] = e.slice(0, 2);
  e = e.slice(2);
  const a = (o = CONFIG[t]) == null ? void 0 : o.collection.instance;
  if (!a) return null;
  let n = a.get(s);
  for (; n && e.length > 1; ) {
    const [r, l] = e.slice(0, 2);
    n = n.getEmbeddedDocument(r, l), e = e.slice(2);
  }
  return n || null;
}
function Ht(i) {
  if (i instanceof CONFIG.Actor.documentClass)
    return i;
  if (i instanceof CONFIG.Token.documentClass)
    return i.object.actor;
}
function ie() {
  const i = canvas.tokens.controlled.map((t) => t.actor), e = document.querySelector("#ape-app");
  e && (game.combat && i.includes(z) ? e.classList.add("is-current-combatant") : e.classList.remove("is-current-combatant"));
}
Hooks.on("ready", () => {
  var i, e;
  if (!document.querySelector("#ape-app")) {
    const t = document.createElement("ape-app");
    t.id = "ape-app", t.classList.add("ape-container");
    const s = document.getElementById("interface");
    s && document.body.insertBefore(t, s), Te = new Ge(), t.api = Te;
  }
  W = (e = (i = game.combat) == null ? void 0 : i.turns.find((t) => {
    var s;
    return t.id == ((s = game.combat) == null ? void 0 : s.current.combatantId);
  })) == null ? void 0 : e.actor, z = W, ne() && $("#ape-app").addClass("is-open always-on"), re();
});
function Mt() {
  const i = game.settings.get("action-pack-enhanced", "tray-display");
  return i === "selected" || i === "auto";
}
function ne() {
  return game.settings.get("action-pack-enhanced", "tray-display") === "always";
}
function B() {
  const i = canvas.tokens.controlled.filter((e) => {
    var t;
    return ["character", "npc"].includes((t = e.actor) == null ? void 0 : t.type);
  });
  return i.length ? i.map((e) => e.actor) : game.user.character && game.settings.get("action-pack-enhanced", "assume-default-character") ? [game.user.character] : [];
}
Hooks.on("controlToken", async () => {
  re();
});
Hooks.on("updateActor", (i) => {
  B().includes(i) && w();
});
function oe(i) {
  B().includes(i.actor) && w();
}
Hooks.on("updateItem", (i) => {
  oe(i);
});
Hooks.on("deleteItem", (i) => {
  oe(i);
});
Hooks.on("createItem", (i) => {
  oe(i);
});
Hooks.on("updateCombat", (i) => {
  var e;
  z = (e = i.turns.find((t) => t.id == i.current.combatantId)) == null ? void 0 : e.actor, ie(), W = z;
});
Hooks.on("createCombatant", (i) => {
  B().includes(i.actor) && w();
});
Hooks.on("updateCombatant", (i, e) => {
  B().includes(i.actor) && w();
});
Hooks.on("deleteCombat", (i) => {
  game.combat || (z = null, W = null, ie());
});
Hooks.on("init", () => {
  ot({
    updateTray: w,
    updateTrayState: re,
    resetScroll: () => {
      document.querySelector("ape-app");
    }
  });
});
Hooks.on("getSceneControlButtons", (i) => {
  if (game.settings.get("action-pack-enhanced", "use-control-button") && !ne()) {
    const e = i.tokens.tools;
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
function re() {
  const i = $("#ape-app");
  Mt() && (canvas.tokens.controlled.filter((t) => {
    var s;
    return ["character", "npc"].includes((s = t.actor) == null ? void 0 : s.type);
  }).length ? i.addClass("is-open") : i.removeClass("is-open")), ne() ? i.addClass("is-open always-on") : i.removeClass("always-on"), ie(), w();
}
async function w() {
  Q || (Q = new nt());
  const i = B(), e = Q.build(i, {
    /* scrollPosition stub */
  });
  function t(h, m) {
    return h && [m, h].join("-");
  }
  const s = t(game.settings.get("action-pack-enhanced", "icon-size"), "icon"), a = t(game.settings.get("action-pack-enhanced", "tray-size"), "tray"), n = game.settings.get("action-pack-enhanced", "show-spell-dots"), o = game.settings.get("action-pack-enhanced", "show-spell-uses"), r = game.settings.get("action-pack-enhanced", "show-weapon-mastery"), l = Object.entries(CONFIG.DND5E.abilities), c = [
    l.slice(0, 3).map(([h, m]) => ({ key: h, label: m.label })),
    l.slice(3, 6).map(([h, m]) => ({ key: h, label: m.label }))
  ], p = document.querySelector("#ape-app");
  Array.from(p.classList).forEach((h) => {
    (h.startsWith("tray-") || h.startsWith("icon-")) && p.classList.remove(h);
  }), p.classList.add(s), p.classList.add(a), p && (p.data = {
    actors: e
  }, p.globalData = {
    abilityColumns: c,
    showSpellDots: n,
    showSpellUses: o,
    showWeaponMastery: r
  });
}
Hooks.on("dnd5e.getItemContextOptions", (i, e) => {
  var t;
  (t = i.system.activation) != null && t.type && i.system.activation.type !== "none" && (i.getFlag("action-pack-enhanced", "hidden") ? e.push({
    name: game.i18n.localize("action-pack-enhanced.item-context.show"),
    icon: "<i class='fas fa-eye'></i>",
    callback: async () => {
      await i.setFlag("action-pack-enhanced", "hidden", !1), w();
    }
  }) : e.push({
    name: game.i18n.localize("action-pack-enhanced.item-context.hide"),
    icon: "<i class='fas fa-eye-slash'></i>",
    callback: async () => {
      await i.setFlag("ape", "hidden", !0), w();
    }
  }));
});
Hooks.on("dropCanvasData", (i, e) => {
  var t;
  if (e.type === "ActionPackItem" && e.uuid) {
    const s = Tt(e.uuid);
    if (!s) return;
    const a = i.tokens.placeables.find((n) => e.x >= n.x && e.x <= n.x + n.w && e.y >= n.y && e.y <= n.y + n.h);
    if (a) {
      const n = (t = s.system) == null ? void 0 : t.activities;
      if (!n) return;
      (n.contents[0].target.affects.count || 1) === 1 && a.setTarget(!0, { user: game.user, releaseOthers: !0, groupSelection: !0 });
    }
    return s.use(), !1;
  }
});
export {
  Ht as fudgeToActor
};
//# sourceMappingURL=ape.mjs.map
