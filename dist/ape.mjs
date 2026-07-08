var Ze = Object.defineProperty;
var Je = (i, e, t) => e in i ? Ze(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var R = (i, e, t) => Je(i, typeof e != "symbol" ? e + "" : e, t);
class Ye {
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
        let r = 0;
        if (s.type === "constant")
          r = s.value;
        else if (s.type === "table") {
          const n = a.system.levels, o = s.values.find((l) => l.level === n);
          r = o ? o.mastery : 0;
        }
        r > t && (t = r);
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
    if (game.modules.get("wm5e") && ((s = game.modules.get("wm5e")) == null ? void 0 : s.active) && e.itemTypes.feat.find((r) => r.name === "Weapon Mastery" || r.name === "Weapon Master")) {
      await e.setFlag("action-pack-enhanced", "masterySelectionPending", !0);
      const r = e.itemTypes.weapon.filter((d) => d.name !== "Unarmed Strike"), n = /* @__PURE__ */ new Map(), o = e.system.traits.weaponProf.mastery.value;
      r.forEach((d) => {
        var g, f;
        const p = d.system.mastery, c = (g = d.system.type) == null ? void 0 : g.baseItem;
        p && c && !n.has(c) && n.set(c, {
          id: c,
          label: c.replace(/-/g, " ").replace(/\b\w/g, (b) => b.toUpperCase()),
          masteryLabel: ((f = CONFIG.DND5E.weaponMasteries[p]) == null ? void 0 : f.label) || p,
          selected: o.find((b) => b === c)
        });
      });
      const l = this.calculateMaxMasteries(e);
      await this.promptMasterySelection(e, n, l);
    } else
      await e.setFlag("action-pack-enhanced", "masterySelectionPending", !1), await e.update({ "system.traits.weaponProf.mastery.value": [] });
    return t;
  }
  async promptMasterySelection(e, t, a) {
    const { DialogV2: s } = foundry.applications.api;
    let r = `<p>Select up to ${a} ${a === 1 ? "weapon" : "weapons"} to use ${a === 1 ? "its" : "their"} weapon mastery for the day:</p>`;
    r += '<form class="ape-mastery-dialog">';
    for (const [n, o] of t)
      r += `
            <div class="ape-mastery-switch form-group">
                <input id="${n}" class="ape-mastery-checkbox" type="checkbox" name="mastery" value="${n}" data-dtype="String" ${o.selected ? "checked" : ""}>
                <label for="${n}" class="ape-mastery-label">${o.label} (${o.masteryLabel})</label>
            </div>`;
    return r += "</form>", r += `
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
      content: r,
      buttons: [{
        action: "update",
        label: "Update",
        default: !0,
        callback: async (n, o, l) => {
          const d = [];
          return l.element.querySelectorAll('input[name="mastery"]:checked').forEach((p) => {
            d.push(p.value);
          }), d.length > a && (ui.notifications.warn(`You selected more than ${a} masteries. Only the first ${a} will be applied.`), d.splice(a)), await e.update({ "system.traits.weaponProf.mastery.value": d }), await e.setFlag("action-pack-enhanced", "masterySelectionPending", !1), !0;
        }
      }, {
        action: "cancel",
        label: "Cancel",
        callback: async () => (await e.setFlag("action-pack-enhanced", "masterySelectionPending", !1), !1)
      }],
      submit: (n) => {
      }
    });
  }
  /**
   * Toggles a Weapon Mastery selection
   * @param {Actor} actor 
   * @param {string} masteryId 
   */
  async toggleMastery(e, t) {
    var s, r, n;
    if (!e || !t) return;
    const a = new Set(((n = (r = (s = e.system.traits) == null ? void 0 : s.weaponProf) == null ? void 0 : r.mastery) == null ? void 0 : n.value) || []);
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
    var n, o;
    const s = a + 1, r = (o = (n = e.system.spells) == null ? void 0 : n[t]) == null ? void 0 : o.value;
    if (r !== void 0) {
      const l = `system.spells.${t}.value`, d = r !== s ? s : s - 1;
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
    var n, o, l, d;
    const t = await e.getChatData({ secrets: e.actor.isOwner }), a = ((o = (n = e.system) == null ? void 0 : n.activation) == null ? void 0 : o.type) || "", s = ((d = (l = e.system) == null ? void 0 : l.activation) == null ? void 0 : d.value) || "";
    let r = "";
    return s === "" ? r = a.charAt(0).toUpperCase() + a.slice(1) : s && a && (r = `${s} ${a.charAt(0).toUpperCase() + a.slice(1)}`), {
      description: t.description,
      properties: {
        castingTime: r,
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
    var s, r, n, o;
    const t = (r = (s = e.system) == null ? void 0 : s.range) == null ? void 0 : r.value, a = (o = (n = e.system) == null ? void 0 : n.range) == null ? void 0 : o.units;
    return t && a ? `${t} ${a}` : a || "";
  }
  _formatDuration(e) {
    var s, r, n, o;
    const t = (r = (s = e.system) == null ? void 0 : s.duration) == null ? void 0 : r.value, a = (o = (n = e.system) == null ? void 0 : n.duration) == null ? void 0 : o.units;
    return t && a ? `${t} ${a}` : a ? a === "inst" ? "Instantaneous" : a : "";
  }
  /**
   * Sets a weapon set item
   * @param {Actor} actor 
   * @param {number} setIndex 
   * @param {string} slot 'main' or 'off'
   * @param {string} itemUuid 
   */
  async setWeaponSetItem(e, t, a, s, r) {
    var l, d, p;
    if (!e) return;
    const n = e.getFlag("action-pack-enhanced", "weaponSets") || [];
    for (let c = 0; c <= t; c++)
      n[c] || (n[c] = { main: null, off: null, active: !1 });
    const o = fromUuidSync(s);
    if (o) {
      const c = a === "main" ? "off" : "main", g = n[t][c], f = [];
      if (g === s && ((l = o.system) == null ? void 0 : l.quantity) === 1 && f.push(game.i18n.localize("action-pack-enhanced.warning.quantity-limit") || "Not enough quantity to equip in both slots."), (d = o.system.properties) != null && d.has("two") && g) {
        const b = fromUuidSync(g);
        b && ((p = b.system.properties) != null && p.has("two")) && f.push(game.i18n.localize("action-pack-enhanced.warning.two-handed") || "You cannot have two two-handed weapons in the same set.");
      }
      if (f.length > 0) {
        f.forEach((b) => ui.notifications.warn(b));
        return;
      }
    }
    if (n[t][a] = s, await e.setFlag("action-pack-enhanced", "weaponSets", n), n[t].active)
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
    const r = a.map((p, c) => ({ ...p, active: c === t }));
    await e.setFlag("action-pack-enhanced", "weaponSets", r);
    const n = [], o = e.itemTypes.weapon.filter((p) => p.name !== "Unarmed Strike"), l = e.itemTypes.equipment.find((p) => p.name.includes("Shield"));
    l && o.push(l);
    const d = /* @__PURE__ */ new Set();
    s.main && d.add(s.main), s.off && d.add(s.off);
    for (const p of o) {
      const c = d.has(p.uuid);
      p.system.equipped !== c && n.push({ _id: p.id, "system.equipped": c });
    }
    n.length > 0 && await e.updateEmbeddedDocuments("Item", n);
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
}
function ee(i) {
  return i == null ? "0" : `${i >= 0 ? "+" : ""}${i}`;
}
function Re(i) {
  var t;
  const e = (t = i.system) == null ? void 0 : t.activities;
  return e ? new Set(Array.from(e, (a) => {
    var s;
    return (s = a.activation) == null ? void 0 : s.type;
  }).filter(Boolean)) : /* @__PURE__ */ new Set();
}
function Qe(i) {
  const e = i.type === "spell" ? it(i) : "", t = et(i), a = tt(i), s = at(i), r = i.type === "spell" ? st(i) : "";
  return { school: e, castingTime: t, range: a, duration: s, materials: r };
}
function et(i) {
  var a, s, r, n;
  const e = ((s = (a = i.system) == null ? void 0 : a.activation) == null ? void 0 : s.type) || "", t = ((n = (r = i.system) == null ? void 0 : r.activation) == null ? void 0 : n.value) || "";
  return t === "" && e !== "" ? game.i18n.localize(`action-pack-enhanced.action-type.${e}`) : t && e ? `${t} ${e.charAt(0).toUpperCase() + e.slice(1)}` : "";
}
function tt(i) {
  var s, r, n, o, l, d, p, c;
  const e = ((r = (s = i.system) == null ? void 0 : s.range) == null ? void 0 : r.long) || null, t = (o = (n = i.system) == null ? void 0 : n.range) == null ? void 0 : o.units;
  let a;
  return t !== "touch" && t !== "self" ? a = ((d = (l = i.system) == null ? void 0 : l.range) == null ? void 0 : d.value) || ((c = (p = i.system) == null ? void 0 : p.range) == null ? void 0 : c.reach) || 5 : a = null, a && e && t ? `${a} ${t} / ${e} ${t}` : a && t ? `${a} ${t}` : t ? game.i18n.localize(`action-pack-enhanced.range.${t}`) : "";
}
function at(i) {
  var a, s, r, n;
  const e = (s = (a = i.system) == null ? void 0 : a.duration) == null ? void 0 : s.value, t = (n = (r = i.system) == null ? void 0 : r.duration) == null ? void 0 : n.units;
  return e && t ? `${e} ${e > 1 ? t + "s" : t}` : t ? game.i18n.localize(`action-pack-enhanced.duration.${t}`) : "";
}
function st(i) {
  var t, a;
  const e = (a = (t = i.system) == null ? void 0 : t.materials) == null ? void 0 : a.value;
  return e || "";
}
function it(i) {
  var t, a;
  if ((t = i.labels) != null && t.school)
    return i.labels.school;
  const e = (a = i.system) == null ? void 0 : a.school;
  if (e) {
    const s = CONFIG.DND5E.spellSchools[e];
    return s ? s.label || s : e;
  }
  return "";
}
function nt(i) {
  var l, d;
  let e = {}, t = i.itemTypes.race, a = i.itemTypes.class, s = i.itemTypes.subclass;
  const r = i.system.details.level;
  if (a.length === s.length) {
    let p = { race: `<span>${(l = t[0]) == null ? void 0 : l.name} - ${r}</span>` || "Unknown", classes: [] };
    for (let c = 0; c < a.length; c++)
      p.classes[c] = { name: a[c].name, level: a[c].system.levels, subclass: { name: s[c].name } };
    e = p;
  } else {
    let p = { race: `<span>${(d = t[0]) == null ? void 0 : d.name} - ${r}</span>` || "Unknown", classes: [] };
    for (let c = 0; c < a.length; c++) {
      p.classes[c] = { name: a[c].name, level: a[c].system.levels, subclass: { name: "" } };
      for (let g = 0; g < s.length; g++)
        s[g].system.class === a[c].name && (p.classes[c].subclass.name = s[g].name);
    }
    e = p;
  }
  a.length === s.length ? a.forEach((p, c) => {
    e.classes[c].icon = p.img, e.classes[c].subclass.icon = p.subclass.img;
  }) : a.forEach((p, c) => {
    e.classes[c].icon = p.img, e.classes[c].subclass.name !== "" && s.forEach((g) => {
      g.system.class === p.name && (e.classes[c].subclass.icon = g.img);
    });
  });
  let n = `${e.race}`, o = [];
  for (let p = 0; p < e.classes.length; p++) {
    let c = "", g = "";
    e.classes[p].subclass.name !== "" ? (c = e.classes[p].subclass.icon, g = `${e.classes[p].subclass.name} ${e.classes[p].name} (${e.classes[p].level})`) : (c = e.classes[p].icon, g = `${e.classes[p].name} (${e.classes[p].level})`), o.push(`<img class="ape-actor-class-icon" src="${c}" title="${g}">`);
  }
  return n + `<span class="ape-actor-class-icons">${o.join("")}</span>`;
}
const rt = (i) => {
  const e = i.system, t = e.consume;
  if (t && t.target)
    return ot(i.actor, t);
  const a = e.uses;
  if (a && (a.max > 0 || a.value > 0))
    return He(e);
  const s = i.type;
  return s === "feat" ? lt() : s === "consumable" ? {
    available: e.quantity
  } : s === "weapon" ? ct(e) : null;
};
function ot(i, e) {
  let t = null, a = null;
  if (e.type === "attribute") {
    const s = getProperty(i.system, e.target);
    typeof s == "number" ? t = s : t = 0;
  } else if (e.type === "ammo" || e.type === "material") {
    const s = i.items.get(e.target);
    s ? t = s.system.quantity : t = 0;
  } else if (e.type === "charges") {
    const s = i.items.get(e.target);
    s ? { available: t, maximum: a } = He(s.system) : t = 0;
  }
  return t !== null ? (e.amount > 1 && (t = Math.floor(t / e.amount), a !== null && (a = Math.floor(a / e.amount))), { available: t, maximum: a }) : null;
}
function He(i) {
  let e = i.uses.value, t = i.uses.max;
  const a = i.quantity;
  return a && (e = e + (a - 1) * t, t = t * a), { available: e, maximum: t };
}
function lt(i) {
  return null;
}
function ct(i) {
  return i.properties.thr && !i.properties.ret ? { available: i.quantity, maximum: null } : null;
}
class pt {
  constructor() {
  }
  build(e, t) {
    return this.settingShowNoUses = game.settings.get("action-pack-enhanced", "show-no-uses"), this.settingShowUnpreparedCantrips = game.settings.get("action-pack-enhanced", "show-unprepared-cantrips"), this.settingShowUnpreparedSpells = game.settings.get("action-pack-enhanced", "show-unprepared-spells"), this.settingSortAlphabetically = game.settings.get("action-pack-enhanced", "sort-alphabetic"), this.settingShowWeaponMastery = game.settings.get("action-pack-enhanced", "show-weapon-mastery"), e.map((a) => this.prepareActor(a, t));
  }
  prepareActor(e, t) {
    var _, P;
    const a = e.system, s = !!e.itemTypes.feat.find((m) => m.name === "Ritual Adept"), r = e.getFlag("action-pack-enhanced", "weaponSets") || [], n = [];
    for (let m = 0; m < 3; m++) {
      const y = r[m] || { main: null, off: null, active: !1 }, v = { index: m, main: null, off: null, active: y.active };
      if (y.main) {
        const k = fromUuidSync(y.main);
        k && (v.main = { uuid: y.main, img: k.img, rarity: k.system.rarity, name: k.name });
      }
      if (y.off) {
        const k = fromUuidSync(y.off);
        k && (v.off = { uuid: y.off, img: k.img, rarity: k.system.rarity, name: k.name });
      }
      n.push(v);
    }
    let o = {
      equipped: {
        items: [],
        title: "action-pack-enhanced.category.weapon",
        weaponSets: n,
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
          ...[...Array(10).keys()].reduce((m, y) => (m[`spell${y}`] = { items: [], title: `action-pack-enhanced.category.spell${y}`, cost: 0 }, m), {})
        }
      },
      passive: { items: [], title: "action-pack-enhanced.category.passive" }
    };
    const l = ["consumable", "container", "equipment", "feat", "loot", "spell", "tool", "weapon"];
    for (const [m, y] of Object.entries(e.itemTypes))
      if (l.includes(m))
        for (const v of y)
          this._processItem(v, m, o, e, s);
    const d = game.modules.find((m) => m.id === "wm5e") && ((_ = game.modules.get("wm5e")) == null ? void 0 : _.active);
    if (e.type === "character" && d && e.itemTypes.feat.find((y) => y.name === "Weapon Mastery" || y.name === "Weapon Master")) {
      const y = e.getFlag("action-pack-enhanced", "masterySelectionPending");
      o.equipped.forceOpen = y;
    }
    const p = (P = game.combat) == null ? void 0 : P.combatants.find((m) => m.actor === e), c = p && !p.initiative, g = game.modules.get("dnd5e-spellpoints"), f = g && (g != null && g.active) ? getSpellPointsItem(e) : null, b = this.sortItems(this.removeEmptySections(o)), w = this.addLegendaryActionUses(
      f ? this.addSpellPointUses(b, f, a) : this.addSpellLevelUses(b, a),
      a
    );
    return {
      actor: e,
      name: e.name,
      sections: w,
      needsInitiative: c,
      skills: CONFIG.DND5E.skills
    };
  }
  _processItem(e, t, a, s, r) {
    var c;
    const n = e.system, o = rt(e), l = this.settingShowNoUses || !o || o.available, d = ((c = n == null ? void 0 : n.activities) == null ? void 0 : c.size) > 0, p = e.getFlag("action-pack-enhanced", "hidden");
    if (e.type === "equipment" && (n.identified && n.identifier === "shield" || e.name.includes("Shield")) && (n.equipped ? a.equipped.groups.shield.items.push({ item: e, uses: o }) : a.equipped.groups.unequipped.items.push({ item: e, uses: o })), l && d && !p)
      switch (t) {
        case "feat":
          this._prepareFeat(e, n, o, a);
          break;
        case "spell":
          this._prepareSpell(e, n, o, a, r);
          break;
        case "weapon":
          this._prepareWeapon(e, n, o, a);
          break;
        case "equipment":
          this._prepareEquipment(e, n, o, a);
          break;
        case "consumable":
          this._prepareConsumable(e, n, o, a);
          break;
        case "facility":
          break;
        default:
          this._prepareOther(e, n, o, a);
          break;
      }
    else s.type === "npc" && a.passive.items.push({ item: e, uses: o });
  }
  _prepareFeat(e, t, a, s) {
    var l, d;
    const r = Re(e);
    if (r.has("legendary")) {
      s.legendary.items.push({ item: e, uses: a });
      return;
    }
    if (r.has("lair")) {
      s.lair.items.push({ item: e, uses: a });
      return;
    }
    const n = (l = t.type) == null ? void 0 : l.value, o = (d = t.type) == null ? void 0 : d.subtype;
    o && s.feature.groups[o] ? s.feature.groups[o].items.push({ item: e, uses: a }) : n && s.feature.groups[n] ? s.feature.groups[n].items.push({ item: e, uses: a }) : s.feature.groups.general.items.push({ item: e, uses: a });
  }
  _prepareSpell(e, t, a, s, r) {
    var o;
    switch (t == null ? void 0 : t.method) {
      case "spell":
        const l = (t == null ? void 0 : t.prepared) === 1, d = (t == null ? void 0 : t.prepared) === 2, p = r && ((o = t.properties) == null ? void 0 : o.has("ritual")), c = t.level == 0 && this.settingShowUnpreparedCantrips, g = t.level > 0 && this.settingShowUnpreparedSpells;
        (d || l || p || c || g) && s.spell.groups[`spell${t.level}`].items.push({ item: e, uses: a });
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
    const r = e.name === "Unarmed Strike";
    t.equipped || r ? s.equipped.items.push({ item: e, uses: a }) : s.equipped.groups.unequipped.items.push({ item: e, uses: a });
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
      return s.includes("groups") && Object.values(a.groups).some((r) => t(r)) ? !0 : s.includes("items") ? !!a.items.length : Object.values(a).some((r) => t(r));
    };
    return Object.entries(e).reduce((a, [s, r]) => (t(r) && (a[s] = r), a), {});
  }
  addSpellPointUses(e, t, a) {
    var n, o, l, d, p, c, g, f, b;
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
    }, r = {
      available: ((o = (n = t.system) == null ? void 0 : n.uses) == null ? void 0 : o.value) || 0,
      maximum: ((d = (l = t.system) == null ? void 0 : l.uses) == null ? void 0 : d.max) || 0
    };
    if (e.spell) {
      e.spell.uses = r;
      for (let w = 1; w <= 9; w++) {
        const _ = (p = e.spell) == null ? void 0 : p.groups[`spell${w}`];
        _ && (_.cost = s[w]);
      }
    }
    return (g = (c = a.spells) == null ? void 0 : c.pact) != null && g.max && ((b = (f = e.spell) == null ? void 0 : f.groups) != null && b.pact) && (e.spell.groups.pact.uses = {
      available: a.spells.pact.value,
      maximum: a.spells.pact.max
    }), e;
  }
  addSpellLevelUses(e, t) {
    var a, s, r, n, o;
    for (let l = 1; l <= 9; l++) {
      const d = (a = e.spell) == null ? void 0 : a.groups[`spell${l}`];
      if (d) {
        const p = t.spells[`spell${l}`];
        d.uses = { available: p.value, maximum: p.max };
      }
    }
    return (r = (s = t.spells) == null ? void 0 : s.pact) != null && r.max && ((o = (n = e.spell) == null ? void 0 : n.groups) != null && o.pact) && (e.spell.groups.pact.uses = {
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
      t === "items" ? a.sort((s, r) => this.settingSortAlphabetically ? s.item.name.localeCompare(r.item.name) : s.item.sort - r.item.sort) : a && typeof a == "object" && this.sortItems(a);
    }), e;
  }
}
function dt(i) {
  var r;
  const { updateTray: e, updateTrayState: t } = i, a = !!((r = game.modules.get("dnd5e-spellpoints")) != null && r.active);
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
  ), game.keybindings.register("action-pack-enhanced", "toggle-tray", {
    name: "action-pack-enhanced.keybindings.toggle-tray",
    editable: [
      { key: "KeyE", modifiers: [] }
    ],
    onDown: (n) => {
      s() || ($("#ape-app").toggleClass("is-open"), $("#ape-app .ape-skill-container").removeClass("is-open"));
    }
  });
}
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const K = globalThis, le = K.ShadowRoot && (K.ShadyCSS === void 0 || K.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ne = Symbol(), Se = /* @__PURE__ */ new WeakMap();
let ut = class {
  constructor(e, t, a) {
    if (this._$cssResult$ = !0, a !== Ne) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (le && e === void 0) {
      const a = t !== void 0 && t.length === 1;
      a && (e = Se.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), a && Se.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ht = (i) => new ut(typeof i == "string" ? i : i + "", void 0, Ne), gt = (i, e) => {
  if (le) i.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const a = document.createElement("style"), s = K.litNonce;
    s !== void 0 && a.setAttribute("nonce", s), a.textContent = t.cssText, i.appendChild(a);
  }
}, Ae = le ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const a of e.cssRules) t += a.cssText;
  return ht(t);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: mt, defineProperty: yt, getOwnPropertyDescriptor: ft, getOwnPropertyNames: bt, getOwnPropertySymbols: vt, getPrototypeOf: $t } = Object, E = globalThis, xe = E.trustedTypes, kt = xe ? xe.emptyScript : "", te = E.reactiveElementPolyfillSupport, j = (i, e) => i, re = { toAttribute(i, e) {
  switch (e) {
    case Boolean:
      i = i ? kt : null;
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
} }, ze = (i, e) => !mt(i, e), Ce = { attribute: !0, type: String, converter: re, reflect: !1, useDefault: !1, hasChanged: ze };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), E.litPropertyMetadata ?? (E.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let H = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Ce) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const a = Symbol(), s = this.getPropertyDescriptor(e, a, t);
      s !== void 0 && yt(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, a) {
    const { get: s, set: r } = ft(this.prototype, e) ?? { get() {
      return this[t];
    }, set(n) {
      this[t] = n;
    } };
    return { get: s, set(n) {
      const o = s == null ? void 0 : s.call(this);
      r == null || r.call(this, n), this.requestUpdate(e, o, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Ce;
  }
  static _$Ei() {
    if (this.hasOwnProperty(j("elementProperties"))) return;
    const e = $t(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(j("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(j("properties"))) {
      const t = this.properties, a = [...bt(t), ...vt(t)];
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
      for (const s of a) t.unshift(Ae(s));
    } else e !== void 0 && t.push(Ae(e));
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
    return gt(e, this.constructor.elementStyles), e;
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
    var r;
    const a = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, a);
    if (s !== void 0 && a.reflect === !0) {
      const n = (((r = a.converter) == null ? void 0 : r.toAttribute) !== void 0 ? a.converter : re).toAttribute(t, a.type);
      this._$Em = e, n == null ? this.removeAttribute(s) : this.setAttribute(s, n), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var r, n;
    const a = this.constructor, s = a._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const o = a.getPropertyOptions(s), l = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((r = o.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? o.converter : re;
      this._$Em = s;
      const d = l.fromAttribute(t, o.type);
      this[s] = d ?? ((n = this._$Ej) == null ? void 0 : n.get(s)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, t, a, s = !1, r) {
    var n;
    if (e !== void 0) {
      const o = this.constructor;
      if (s === !1 && (r = this[e]), a ?? (a = o.getPropertyOptions(e)), !((a.hasChanged ?? ze)(r, t) || a.useDefault && a.reflect && r === ((n = this._$Ej) == null ? void 0 : n.get(e)) && !this.hasAttribute(o._$Eu(e, a)))) return;
      this.C(e, t, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: a, reflect: s, wrapped: r }, n) {
    a && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, n ?? t ?? this[e]), r !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || a || (t = void 0), this._$AL.set(e, t)), s === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
        for (const [r, n] of this._$Ep) this[r] = n;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, n] of s) {
        const { wrapped: o } = n, l = this[r];
        o !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, n, l);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (a = this._$EO) == null || a.forEach((s) => {
        var r;
        return (r = s.hostUpdate) == null ? void 0 : r.call(s);
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
H.elementStyles = [], H.shadowRootOptions = { mode: "open" }, H[j("elementProperties")] = /* @__PURE__ */ new Map(), H[j("finalized")] = /* @__PURE__ */ new Map(), te == null || te({ ReactiveElement: H }), (E.reactiveElementVersions ?? (E.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const L = globalThis, Ee = (i) => i, Z = L.trustedTypes, Oe = Z ? Z.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, Be = "$lit$", C = `lit$${Math.random().toFixed(9).slice(2)}$`, je = "?" + C, wt = `<${je}>`, U = document, W = () => U.createComment(""), F = (i) => i === null || typeof i != "object" && typeof i != "function", ce = Array.isArray, _t = (i) => ce(i) || typeof (i == null ? void 0 : i[Symbol.iterator]) == "function", ae = `[ 	
\f\r]`, B = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Pe = /-->/g, Te = />/g, T = RegExp(`>|${ae}(?:([^\\s"'>=/]+)(${ae}*=${ae}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), qe = /'/g, Ie = /"/g, Le = /^(?:script|style|textarea|title)$/i, St = (i) => (e, ...t) => ({ _$litType$: i, strings: e, values: t }), u = St(1), D = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), Ue = /* @__PURE__ */ new WeakMap(), q = U.createTreeWalker(U, 129);
function We(i, e) {
  if (!ce(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Oe !== void 0 ? Oe.createHTML(e) : e;
}
const At = (i, e) => {
  const t = i.length - 1, a = [];
  let s, r = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = B;
  for (let o = 0; o < t; o++) {
    const l = i[o];
    let d, p, c = -1, g = 0;
    for (; g < l.length && (n.lastIndex = g, p = n.exec(l), p !== null); ) g = n.lastIndex, n === B ? p[1] === "!--" ? n = Pe : p[1] !== void 0 ? n = Te : p[2] !== void 0 ? (Le.test(p[2]) && (s = RegExp("</" + p[2], "g")), n = T) : p[3] !== void 0 && (n = T) : n === T ? p[0] === ">" ? (n = s ?? B, c = -1) : p[1] === void 0 ? c = -2 : (c = n.lastIndex - p[2].length, d = p[1], n = p[3] === void 0 ? T : p[3] === '"' ? Ie : qe) : n === Ie || n === qe ? n = T : n === Pe || n === Te ? n = B : (n = T, s = void 0);
    const f = n === T && i[o + 1].startsWith("/>") ? " " : "";
    r += n === B ? l + wt : c >= 0 ? (a.push(d), l.slice(0, c) + Be + l.slice(c) + C + f) : l + C + (c === -2 ? o : f);
  }
  return [We(i, r + (i[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), a];
};
class X {
  constructor({ strings: e, _$litType$: t }, a) {
    let s;
    this.parts = [];
    let r = 0, n = 0;
    const o = e.length - 1, l = this.parts, [d, p] = At(e, t);
    if (this.el = X.createElement(d, a), q.currentNode = this.el.content, t === 2 || t === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (s = q.nextNode()) !== null && l.length < o; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const c of s.getAttributeNames()) if (c.endsWith(Be)) {
          const g = p[n++], f = s.getAttribute(c).split(C), b = /([.?@])?(.*)/.exec(g);
          l.push({ type: 1, index: r, name: b[2], strings: f, ctor: b[1] === "." ? Ct : b[1] === "?" ? Et : b[1] === "@" ? Ot : Y }), s.removeAttribute(c);
        } else c.startsWith(C) && (l.push({ type: 6, index: r }), s.removeAttribute(c));
        if (Le.test(s.tagName)) {
          const c = s.textContent.split(C), g = c.length - 1;
          if (g > 0) {
            s.textContent = Z ? Z.emptyScript : "";
            for (let f = 0; f < g; f++) s.append(c[f], W()), q.nextNode(), l.push({ type: 2, index: ++r });
            s.append(c[g], W());
          }
        }
      } else if (s.nodeType === 8) if (s.data === je) l.push({ type: 2, index: r });
      else {
        let c = -1;
        for (; (c = s.data.indexOf(C, c + 1)) !== -1; ) l.push({ type: 7, index: r }), c += C.length - 1;
      }
      r++;
    }
  }
  static createElement(e, t) {
    const a = U.createElement("template");
    return a.innerHTML = e, a;
  }
}
function N(i, e, t = i, a) {
  var n, o;
  if (e === D) return e;
  let s = a !== void 0 ? (n = t._$Co) == null ? void 0 : n[a] : t._$Cl;
  const r = F(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== r && ((o = s == null ? void 0 : s._$AO) == null || o.call(s, !1), r === void 0 ? s = void 0 : (s = new r(i), s._$AT(i, t, a)), a !== void 0 ? (t._$Co ?? (t._$Co = []))[a] = s : t._$Cl = s), s !== void 0 && (e = N(i, s._$AS(i, e.values), s, a)), e;
}
class xt {
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
    const { el: { content: t }, parts: a } = this._$AD, s = ((e == null ? void 0 : e.creationScope) ?? U).importNode(t, !0);
    q.currentNode = s;
    let r = q.nextNode(), n = 0, o = 0, l = a[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let d;
        l.type === 2 ? d = new V(r, r.nextSibling, this, e) : l.type === 1 ? d = new l.ctor(r, l.name, l.strings, this, e) : l.type === 6 && (d = new Pt(r, this, e)), this._$AV.push(d), l = a[++o];
      }
      n !== (l == null ? void 0 : l.index) && (r = q.nextNode(), n++);
    }
    return q.currentNode = U, s;
  }
  p(e) {
    let t = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(e, a, t), t += a.strings.length - 2) : a._$AI(e[t])), t++;
  }
}
class V {
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
    e = N(this, e, t), F(e) ? e === h || e == null || e === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : e !== this._$AH && e !== D && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : _t(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== h && F(this._$AH) ? this._$AA.nextSibling.data = e : this.T(U.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var r;
    const { values: t, _$litType$: a } = e, s = typeof a == "number" ? this._$AC(e) : (a.el === void 0 && (a.el = X.createElement(We(a.h, a.h[0]), this.options)), a);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === s) this._$AH.p(t);
    else {
      const n = new xt(s, this), o = n.u(this.options);
      n.p(t), this.T(o), this._$AH = n;
    }
  }
  _$AC(e) {
    let t = Ue.get(e.strings);
    return t === void 0 && Ue.set(e.strings, t = new X(e)), t;
  }
  k(e) {
    ce(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let a, s = 0;
    for (const r of e) s === t.length ? t.push(a = new V(this.O(W()), this.O(W()), this, this.options)) : a = t[s], a._$AI(r), s++;
    s < t.length && (this._$AR(a && a._$AB.nextSibling, s), t.length = s);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var a;
    for ((a = this._$AP) == null ? void 0 : a.call(this, !1, !0, t); e !== this._$AB; ) {
      const s = Ee(e).nextSibling;
      Ee(e).remove(), e = s;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class Y {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, a, s, r) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = e, this.name = t, this._$AM = s, this.options = r, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = h;
  }
  _$AI(e, t = this, a, s) {
    const r = this.strings;
    let n = !1;
    if (r === void 0) e = N(this, e, t, 0), n = !F(e) || e !== this._$AH && e !== D, n && (this._$AH = e);
    else {
      const o = e;
      let l, d;
      for (e = r[0], l = 0; l < r.length - 1; l++) d = N(this, o[a + l], t, l), d === D && (d = this._$AH[l]), n || (n = !F(d) || d !== this._$AH[l]), d === h ? e = h : e !== h && (e += (d ?? "") + r[l + 1]), this._$AH[l] = d;
    }
    n && !s && this.j(e);
  }
  j(e) {
    e === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ct extends Y {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === h ? void 0 : e;
  }
}
class Et extends Y {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== h);
  }
}
class Ot extends Y {
  constructor(e, t, a, s, r) {
    super(e, t, a, s, r), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = N(this, e, t, 0) ?? h) === D) return;
    const a = this._$AH, s = e === h && a !== h || e.capture !== a.capture || e.once !== a.once || e.passive !== a.passive, r = e !== h && (a === h || s);
    s && this.element.removeEventListener(this.name, this, a), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Pt {
  constructor(e, t, a) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    N(this, e);
  }
}
const se = L.litHtmlPolyfillSupport;
se == null || se(X, V), (L.litHtmlVersions ?? (L.litHtmlVersions = [])).push("3.3.2");
const Tt = (i, e, t) => {
  const a = (t == null ? void 0 : t.renderBefore) ?? e;
  let s = a._$litPart$;
  if (s === void 0) {
    const r = (t == null ? void 0 : t.renderBefore) ?? null;
    a._$litPart$ = s = new V(e.insertBefore(W(), r), r, void 0, t ?? {});
  }
  return s._$AI(i), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const I = globalThis;
let A = class extends H {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Tt(t, this.renderRoot, this.renderOptions);
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
    return D;
  }
};
var Me;
A._$litElement$ = !0, A.finalized = !0, (Me = I.litElementHydrateSupport) == null || Me.call(I, { LitElement: A });
const ie = I.litElementPolyfillSupport;
ie == null || ie({ LitElement: A });
(I.litElementVersions ?? (I.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const qt = { CHILD: 2 }, It = (i) => (...e) => ({ _$litDirective$: i, values: e });
class Ut {
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
class oe extends Ut {
  constructor(e) {
    if (super(e), this.it = h, e.type !== qt.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(e) {
    if (e === h || e == null) return this._t = void 0, this.it = e;
    if (e === D) return e;
    if (typeof e != "string") throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (e === this.it) return this._t;
    this.it = e;
    const t = [e];
    return t.raw = t, this._t = { _$litType$: this.constructor.resultType, strings: t, values: [] };
  }
}
oe.directiveName = "unsafeHTML", oe.resultType = 1;
const Dt = It(oe), Mt = [
  { name: "Elf", type: "Elf Lineage", values: ["Drow", "High", "Wood"] },
  { name: "Tiefling", type: "Fiendish Legacy", values: ["Abyssal", "Chthonic", "Infernal"] }
];
class Fe extends A {
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
    var me, ye, fe, be, ve, $e, ke, we, _e;
    if (!this.item) return h;
    const e = this.item.system, t = this.item.actor, a = e.rarity !== "" ? e.rarity : this.item.type === "weapon" ? "common" : "", s = this.item.type === "spell", r = e.method === "innate", n = this.uses && (!s || r), o = (me = e.properties) == null ? void 0 : me.has("ritual"), l = (ye = e.properties) == null ? void 0 : ye.has("concentration"), d = Re(this.item), p = d.has("bonus"), c = d.has("reaction"), g = d.has("legendary"), f = d.has("lair"), b = (fe = this.item) == null ? void 0 : fe.hasRecharge, w = !this.item.isOnCooldown, _ = e.equipped, P = this.item.type === "equipment" && (e.identified && e.identifier === "shield" || this.item.name.includes("Shield"));
    let m = null;
    if (b && ((be = e.uses) != null && be.recovery)) {
      const S = e.uses.recovery.find((Q) => Q.period === "recharge");
      S && (m = S.formula);
    }
    let y = !1, v = !1, k = "";
    if (game.modules.find((S) => S.id === "wm5e") && ((ve = game.modules.get("wm5e")) != null && ve.active) && (y = e.mastery || !1, y && this.item.type === "weapon")) {
      const S = ($e = e.type) == null ? void 0 : $e.baseItem, Q = new Set(this.masteryIds || ((_e = (we = (ke = t.system.traits) == null ? void 0 : ke.weaponProf) == null ? void 0 : we.mastery) == null ? void 0 : _e.value) || []);
      v = S && Q.has(S), k = game.i18n.localize(`action-pack-enhanced.masteries.${y}`);
    }
    const M = !!t.itemTypes.feat.find((S) => S.name === "Ritual Adept"), x = e.prepared === 0 && !(o && M);
    return u`
            <div class="item-name rollable flexrow ${x ? "unprepared" : ""}">
                <div class="item-image ${a}${x ? " unprepared" : ""}" 
                        style="background-image: url('${this.item.img}')"
                        @mousedown="${this._onRoll}">
                    <i class="fa fa-dice-d20"></i>
                </div>
                
                <div class="item-name-wrap flexrow">
                    <h4 @mousedown="${this._onClick}">
                        <span class="item-text ${a}">${this.item.name}</span>
                        ${n ? u` (${this.uses.available}${this.uses.maximum ? "/" + this.uses.maximum : ""})` : h}
                    </h4>
                    ${this.showWeaponMastery ? this._renderWeaponMastery(y, v, k) : h}
                </div>

                ${o ? u`<div class="ritual flag" title="${game.i18n.localize("action-pack-enhanced.flag.ritual-title")}"></div>` : h}
                ${l ? u`<div class="concentration flag" title="${game.i18n.localize("action-pack-enhanced.flag.concentration-title")}"></div>` : h}
                ${p ? u`<div class="bonus flag" title="${game.i18n.localize("action-pack-enhanced.flag.bonus-title")}">${game.i18n.localize("action-pack-enhanced.flag.bonus")}</div>` : h}
                ${c ? u`<div class="reaction flag" title="${game.i18n.localize("action-pack-enhanced.flag.reaction-title")}">${game.i18n.localize("action-pack-enhanced.flag.reaction")}</div>` : h}
                ${g ? u`<div class="legendary flag" title="${game.i18n.localize("action-pack-enhanced.flag.legendary-title")}">${game.i18n.localize("action-pack-enhanced.flag.legendary")}</div>` : h}
                ${f ? u`<div class="lair flag" title="${game.i18n.localize("action-pack-enhanced.flag.lair-title")}">${game.i18n.localize("action-pack-enhanced.flag.lair")}</div>` : h}

                ${b ? w ? u`<div class="flag"><i class="fas fa-bolt"></i></div>` : u`<div class="flag"><a class="rollable item-recharge" @mousedown="${this._onRecharge}"><i class="fas fa-dice-six"></i> ${m}+</a></div>` : h}

                ${x ? u`<div class="unprepared flag" title="${game.i18n.localize("action-pack-enhanced.flag.unprepared-title")}">${game.i18n.localize("action-pack-enhanced.flag.unprepared")}</div>` : h}
                ${(this.item.type === "weapon" || P) && !_ ? u`<div class="unequipped flag" title="${game.i18n.localize("action-pack-enhanced.flag.unequipped-title")}" @mousedown="${this._onEquip}">${game.i18n.localize("action-pack-enhanced.flag.unequipped")}</div>` : h}
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
                    ${this.description ? u`<p>${Dt(this.description.description)}</p>` : u`<i class="fas fa-spinner fa-spin"></i>`}
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
    let a = Qe(e), s = null;
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
    var r, n, o, l, d;
    const t = ((r = e == null ? void 0 : e.labels) == null ? void 0 : r.properties) || [], a = e.labels.hasOwnProperty("damageTypes") ? (o = (n = e == null ? void 0 : e.labels) == null ? void 0 : n.damageTypes) != null && o.includes(",") ? (l = e == null ? void 0 : e.labels) == null ? void 0 : l.damageTypes.split(",") : [(d = e == null ? void 0 : e.labels) == null ? void 0 : d.damageTypes] : [], s = [];
    if (a.length > 0) {
      const c = a.map((g) => ({ label: g })).map((g) => g.label);
      s.push(...c);
    }
    if (t.length > 0) {
      const p = t.map((c) => c.label);
      p.sort((c, g) => c.toLowerCase().localeCompare(g.toLowerCase())), s.push(...p);
    }
    return s.length === 0 ? h : u`
            ${s ? u`${s.map((p) => u`<span class="tag">${p}</span>`)} ` : h}
        `;
  }
  _renderWeaponMastery(e, t, a) {
    var s;
    return (s = game.modules.get("wm5e")) != null && s.active && e ? u`<div class="mastery ${t ? "active" : "inactive"} flag">${a}</div>` : h;
  }
  _getItemSource(e, t) {
    var r, n;
    let a = null;
    const s = (n = (r = e.flags) == null ? void 0 : r.dnd5e) == null ? void 0 : n.advancementOrigin;
    if (s) {
      const o = s.split(".");
      if (o.length >= 1) {
        const l = o[0], d = t.items.get(l);
        if (d && d.type === "feat")
          a = { name: `${d.name}`, type: `${d.system.type.label}` };
        else if (d && d.type === "race") {
          const p = d.name;
          let c = "";
          const g = p.split(", ")[0], f = p.split(", ")[1], b = Mt.find((w) => w.name === g && w.values.includes(f));
          b ? c = `${f} ${b.type}` : c = "Species Trait", a = { name: `${g}`, type: `${c}` };
        } else
          a = null;
      }
    }
    return a;
  }
}
R(Fe, "properties", {
  item: { type: Object },
  uses: { type: Object },
  api: { type: Object },
  masteryIds: { type: Array },
  expanded: { type: Boolean, state: !0 },
  description: { type: Object, state: !0 },
  showWeaponMastery: { type: Boolean }
});
customElements.define("ape-item", Fe);
class Xe extends A {
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
    return u`
            ${this.title ? u`
                <h2 @click="${this._toggleOpen}">
                    <span><i class="fas fa-caret-down"></i> ${game.i18n.localize(this.title)}</span>
                </h2>
            ` : h}

            ${this.uses ? u`<div class="section-uses" style="--percent: ${this._getReversedPercent(this.uses.available, this.uses.maximum)}%; --spellPointsTextColor: ${game.settings.get("action-pack-enhanced", "spellPointsTextColor")}; --spellPointsBarColorStart: ${game.settings.get("action-pack-enhanced", "spellPointsBarColorStart")}; --spellPointsBarColorEnd: ${game.settings.get("action-pack-enhanced", "spellPointsBarColorEnd")}">
                <div class="section-uses-text">${this.uses.available} / ${this.uses.maximum}</div>
                <div class="section-uses-bar"></div>
            </div>` : h}

            ${this._renderWeaponSets()}

            ${this.items && this.items.length > 0 ? u`
                <div class="ape-items">
                    ${this.items.map((e) => {
      var t, a, s, r, n;
      return u`
                        <ape-item class="ape-item item" 
                            data-item-uuid="${e.item.uuid}" 
                            .item="${e.item}" 
                            .uses="${e.uses}" 
                            .api="${this.api}"
                            .masteryIds="${(n = (r = (s = (a = (t = this.actor) == null ? void 0 : t.system) == null ? void 0 : a.traits) == null ? void 0 : s.weaponProf) == null ? void 0 : r.mastery) == null ? void 0 : n.value}"
                            .showWeaponMastery="${this.showWeaponMastery}">
                        </ape-item>
                    `;
    })}
                </div>
            ` : h}

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
            `) : h}
        `;
  }
}
R(Xe, "properties", {
  title: { type: String },
  uses: { type: Object },
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
  showWeaponMastery: { type: Boolean }
});
customElements.define("ape-section", Xe);
class Ge extends A {
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
    const { items: e, uses: t, title: a, cost: s } = this.group, r = e && e.length > 0, n = t && t.maximum, o = s || null;
    if (!r && !n) return h;
    const l = n && this.showSpellDots, d = t && this.showSpellUses, p = o && this.showCost, c = [
      "flexrow",
      "ape-group-header",
      l ? "has-dots" : "",
      d ? "has-uses" : "",
      p ? "has-cost" : ""
    ].filter(Boolean).join(" ");
    return u`
            <div class="${c}" @click="${this._toggleOpen}">
                <h3>
                    <i class="fas fa-caret-down"></i> ${game.i18n.localize(a)}
                </h3>
                ${l ? this._renderDots(t) : h}
                ${d ? u`<div class="group-uses">${t.available}/${t.maximum}</div>` : h}
                ${p ? u`<div class="group-cost">Cost: ${s} SP</div>` : h}
            </div>

            ${r ? u`
                <div class="ape-items">
                    ${e.map((g) => u`
                        <ape-item class="ape-item item" data-item-uuid="${g.item.uuid}" .item="${g.item}" .uses="${g.uses}" .api="${this.api}"></ape-item>
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
R(Ge, "properties", {
  group: { type: Object },
  groupName: { type: String },
  api: { type: Object },
  actor: { type: Object },
  showSpellDots: { type: Boolean },
  showSpellUses: { type: Boolean },
  showCost: { type: Boolean },
  isOpen: { type: Boolean, state: !0 },
  forceOpen: { type: Boolean }
});
customElements.define("ape-group", Ge);
class Ve extends A {
  createRenderRoot() {
    return this;
  }
  updated(e) {
    e.has("actorData") && this.actorData && (this.dataset.actorUuid = this.actorData.actor.uuid);
  }
  render() {
    if (!this.actorData) return h;
    const { actor: e, name: t, sections: a, needsInitiative: s } = this.actorData, r = e.system.attributes.hp, n = e.system.attributes.ac.value, o = e.type, l = r.value <= 0 && o === "character", d = e.system.attributes.inspiration;
    return u`
            <div class="ape-actor-header">
                <div class="ape-actor-header-wrap">
                    <a class="ape-actor-name" @click="${(p) => this.api.openSheet(e)}">${t.split(" ")[0]}</a>
                    <a class="ape-actor-inspiration ${d ? "ape-actor-inspiration-active" : ""}" title="${t} is ${d ? "inspired" : "not inspired"}!" @mousedown="${(p) => this.api.toggleInspiration(e, p)}">
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
                        <span class="ape-actor-ac-display">${n}</span>
                    </span>
                </div>
            </div>

            ${this.globalData.staticInfo ? u`
                <div class="ape-static-info">
                    ${o === "character" ? u`
                        <div class="ape-actor-race-class">
                            ${this._renderRaceClass(e)}
                        </div>
                    ` : h}

                    ${game.settings.get("action-pack-enhanced", "show-detailed-info") ? this._renderPlayerInfo(e) : h}

                    ${game.settings.get("action-pack-enhanced", "show-xp-info") && o === "character" ? this._renderExperience(e) : h}

                    ${this._renderHpBar(e, r)}

                    ${this._renderRestButtons(e)}
                    
                </div>
            ` : u`
                <div class="ape-accordion ${this._infoOpen ? "is-open" : ""}">
                    <h2 class="ape-accordion-header" @click="${() => this._toggleAccordion("info")}">
                        <i class="fas fa-caret-down"></i> XP/HP/Rest
                    </h2>
                    <div class="ape-accordion-body">
                        ${o === "character" ? u`
                            <div class="ape-actor-race-class">
                                ${this._renderRaceClass(e)}
                            </div>
                        ` : h}

                        ${game.settings.get("action-pack-enhanced", "show-detailed-info") ? this._renderPlayerInfo(e) : h}

                        ${game.settings.get("action-pack-enhanced", "show-xp-info") ? this._renderExperience(e) : h}

                        ${this._renderHpBar(e, r)}

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
    const t = e.system.details, a = t.xp.pct, s = t.xp.max, r = t.xp.min, n = t.xp.value;
    return u`
            <div class="ape-actor-xp bar-group">
                <div class="bar-label">
                    <span>XP</span>
                    <span class="ape-actor-xp-info">
                        <span class="ape-actor-xp-current" @click="${this._toggleXpActions}">${n}</span>
                        <span class="ape-actor-xp-separator"> / </span>
                        <span class="ape-actor-xp-max">${s}</span>
                    </span>
                </div>
                <div class="bar-track ape-actor-xp-bar"><div class="bar-fill xp-fill" style="width: ${a}%"></div></div>
                <div class="ape-actor-xp-actions ${this._xpActionsOpen ? "active" : "inactive"}">
                    <button class="ape-actor-xp-close" @click="${this._toggleXpActions}">close</button>
                    <p>Choose an amount to add to or subtract from ${e.name}'s XP</p>
                    <div class="ape-actor-xp-increment">
                        <button class="ape-actor-xp-button" ?disabled="${n >= s}" @click="${() => this.api.updateXP(e, n + 1)}">+1</button>
                        <button class="ape-actor-xp-button" ?disabled="${n >= s}" @click="${() => this.api.updateXP(e, n + 10)}">+10</button>
                        <button class="ape-actor-xp-button" ?disabled="${n >= s}" @click="${() => this.api.updateXP(e, n + 100)}">+100</button>
                        <button class="ape-actor-xp-button" ?disabled="${n >= s}" @click="${() => this.api.updateXP(e, n + 1e3)}">+1000</button>
                    </div>
                    <div class="ape-actor-xp-decrement">
                        <button class="ape-actor-xp-button" ?disabled="${n <= r}" @click="${() => this.api.updateXP(e, n - 1)}">-1</button>
                        <button class="ape-actor-xp-button" ?disabled="${n <= r}" @click="${() => this.api.updateXP(e, n - 10)}">-10</button>
                        <button class="ape-actor-xp-button" ?disabled="${n <= r}" @click="${() => this.api.updateXP(e, n - 100)}">-100</button>
                        <button class="ape-actor-xp-button" ?disabled="${n <= r}" @click="${() => this.api.updateXP(e, n - 1e3)}">-1000</button>
                    </div>
                    <div class="ape-actor-xp-max">
                        <button class="ape-actor-xp-button" ?disabled="${n >= s}" @click="${() => this.api.updateXP(e, s)}">Max</button>
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
    const t = nt(e);
    return u`<div style="display:contents" .innerHTML="${t}"></div>`;
  }
  _renderPlayerInfo(e) {
    var f, b, w, _, P;
    const t = e.system.traits ?? {}, a = ((f = e.system.attributes) == null ? void 0 : f.senses) ?? {}, s = (m, y) => {
      const v = t[m], k = Array.from((v == null ? void 0 : v.value) ?? []).map((x) => dnd5e.documents.Trait.keyLabel(x, { trait: y })), M = dnd5e.utils.splitSemicolons((v == null ? void 0 : v.custom) ?? "");
      return [...k, ...M];
    }, r = a.units ?? "ft", n = Object.entries(a.ranges ?? {}).filter(([, m]) => m > 0).map(([m, y]) => `${CONFIG.DND5E.senses[m] ?? m}: ${y}${r}`), o = ((b = e.system.attributes) == null ? void 0 : b.movement) ?? {}, l = o.units ?? "ft", d = Object.entries(CONFIG.DND5E.movementTypes).filter(([m, y]) => !y.hidden && (o[m] || m === "walk")).map(([m, y]) => `${m === "fly" && o.hover ? game.i18n.format("DND5E.MOVEMENT.HoverSpeed", { speed: y.label }) : y.label}: ${o[m] ?? 0}${l}`), p = /* @__PURE__ */ new Map();
    for (const m of e.itemTypes.weapon) {
      const y = (w = m.system.type) == null ? void 0 : w.baseItem;
      y && !p.has(y) && p.set(y, m);
    }
    const c = Array.from(((P = (_ = t.weaponProf) == null ? void 0 : _.mastery) == null ? void 0 : P.value) ?? []).map((m) => {
      var M, x;
      const y = dnd5e.documents.Trait.keyLabel(m, { trait: "weapon" }), v = (M = p.get(m)) == null ? void 0 : M.system.mastery, k = v ? game.i18n.localize(((x = CONFIG.DND5E.weaponMasteries[v]) == null ? void 0 : x.label) ?? v) : null;
      return k ? `${y}: ${k}` : y;
    }), g = [
      { trait: "speed", icon: "fas fa-person-running", label: "Speed", values: d },
      { trait: "dr", icon: "fas fa-shield-halved", label: "Damage Resistances", values: s("dr", "dr") },
      { trait: "di", icon: "fas fa-shield-alt", label: "Damage Immunities", values: s("di", "di") },
      { trait: "dv", icon: "fas fa-heart-crack", label: "Damage Vulnerabilities", values: s("dv", "dv") },
      { trait: "ci", icon: "fas fa-slash", label: "Condition Immunities", values: s("ci", "ci") },
      { trait: "languages", icon: "fas fa-flag", label: "Languages", values: s("languages", "languages") },
      { trait: "armor", icon: "fas fa-shield", label: "Armor Proficiencies", values: s("armorProf", "armor") },
      { trait: "weapon", icon: "fas fa-swords", label: "Weapon Proficiencies", values: s("weaponProf", "weapon") },
      { trait: "senses", icon: "fas fa-eye", label: "Senses", values: n },
      { trait: "mastery", icon: "fas fa-award", label: "Weapon Masteries", values: c }
    ];
    return u`
            <div class="ape-actor-player-info">
                ${g.map((m) => m.values.length === 0 ? h : u`
                        <div class="ape-actor-player-info-row">
                            <span class="ape-actor-player-info-label">
                                ${m.icon ? u`<i class="${m.icon}"></i>` : h}
                                ${m.label}
                            </span>
                            <div class="ape-actor-player-info-values">
                                ${m.values.map((y) => u`<span class="ape-actor-player-info-value ${m.trait}">${y}</span>`)}
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
      const r = e.statuses.has(a), n = game.i18n.localize(s.name);
      return u`
                                <span class="ape-condition-chip ${r ? "active" : ""}"
                                    title="${n}"
                                    @click="${() => this.api.toggleCondition(e, a)}">
                                    <img class="ape-condition-icon" src="${s.img}">
                                    <span class="ape-condition-label">${n}</span>
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
      const r = e.system.abilities[s.key];
      return u`
                                <span class="ape-ability">
                                    <span class="ape-ability-label">${s.key}<br>${r.value}</span>
                                    <a class="fas fa-dice-d20 ape-ability-check" 
                                        title="${s.label} check"
                                        @click="${(n) => this.api.rollAbilityCheck(e, s.key, n)}">
                                        <span class="ape-ability-text">${ee(r.mod)}</span>
                                    </a>
                                    <a class="fas fa-dice-d20 ape-ability-save" 
                                        title="${s.label} saving throw"
                                        @click="${(n) => this.api.rollSavingThrow(e, s.key, n)}">
                                        <span class="ape-ability-text">${ee(r.save.value)}</span>
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
      const r = a[s], n = t[s];
      if (!n) return h;
      let o = "far fa-circle";
      return r.proficient === 0.5 ? o = "fas fa-adjust" : r.proficient === 1 ? o = "fas fa-check" : r.proficient === 2 && (o = "fas fa-star"), u`
                            <div class="ape-skill-row flexrow ${r.proficient === 1 ? "proficient" : r.proficient === 2 ? "expert" : ""}"
                                @click="${(l) => this.api.rollSkill(e, s, l)}"
                                @contextmenu="${(l) => this.api.rollSkill(e, s, l, !0)}">
                                <span class="ape-skill-icon ${o}"></span>
                                <span class="ape-skill-ability">${r.ability}</span>
                                <span class="ape-skill-label">${n.label}</span>
                                <span class="ape-skill-bonus">${ee(r.total)}</span>
                                <span class="ape-skill-passive">(${r.passive})</span>
                            </div>
                        `;
    })}
                </div>
            </div>
        `;
  }
  _renderDeathSaves(e) {
    const t = e.system.attributes.death.failure, a = e.system.attributes.death.success, s = (n, o, l) => Array.from({ length: 3 }).map((d, p) => u`
                <span class="ape-death-dot ${p < n ? "filled" : ""}">
                    ${p < n ? u`<span class="fas ${l}"></span>` : h}
                </span>
            `), r = t < 3 && a < 3;
    return u`
            <div class="ape-death-saving">
                <span class="ape-death-throws failed">
                    ${s(t, "failed", "fa-skull-crossbones")}
                </span>
                <span class="ape-death-icon" 
                    style="${r ? "cursor:pointer" : "cursor:default"}"
                    @mousedown="${r ? (n) => this.api.rollDeathSave(e, n) : null}"></span>
                <span class="ape-death-throws saved">
                    ${s(a, "saved", "fa-check")}
                </span>
            </div>
        `;
  }
  _renderSections(e, t) {
    return ["equipped", "feature", "legendary", "lair", "spell", "inventory", "passive"].map((s) => {
      const r = t[s];
      return r ? u`
                <ape-section 
                    class="ape-category"
                    .title="${r.title}" 
                    .uses="${r.uses}"
                    .items="${r.items}"
                    .weaponSets="${r.weaponSets}"
                    .groups="${r.groups}"
                    .sectionId="${s}"
                    .api="${this.api}"
                    .actor="${e}"
                    .showSpellDots="${this.globalData.showSpellDots}"
                    .showSpellUses="${this.globalData.showSpellUses}"
                    .showWeaponMastery="${this.globalData.showWeaponMastery}"
                    .forceOpen="${r.forceOpen}">
                </ape-section>
            ` : h;
    });
  }
}
R(Ve, "properties", {
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
customElements.define("ape-actor", Ve);
class Ke extends A {
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
    if (!this.data) return h;
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
    return h;
  }
}
R(Ke, "properties", {
  data: { type: Object },
  // Contains actors
  globalData: { type: Object },
  // Contains abilityColumns, showSpellDots
  api: { type: Object }
});
customElements.define("ape-app", Ke);
let J, G, De, ne;
function Rt(i) {
  var n;
  if (!i || i === "") return null;
  let e = i.split(".");
  if (e[0] === "Compendium")
    return null;
  const [t, a] = e.slice(0, 2);
  e = e.slice(2);
  const s = (n = CONFIG[t]) == null ? void 0 : n.collection.instance;
  if (!s) return null;
  let r = s.get(a);
  for (; r && e.length > 1; ) {
    const [o, l] = e.slice(0, 2);
    r = r.getEmbeddedDocument(o, l), e = e.slice(2);
  }
  return r || null;
}
function Wt(i) {
  if (i instanceof CONFIG.Actor.documentClass)
    return i;
  if (i instanceof CONFIG.Token.documentClass)
    return i.object.actor;
}
function pe() {
  const i = canvas.tokens.controlled.map((t) => t.actor), e = document.querySelector("#ape-app");
  e && (game.combat && i.includes(G) ? e.classList.add("is-current-combatant") : e.classList.remove("is-current-combatant"));
}
Hooks.on("ready", () => {
  var i, e;
  if (!document.querySelector("#ape-app")) {
    const t = document.createElement("ape-app");
    t.id = "ape-app", t.classList.add("ape-container"), game.modules.get("foundry-taskbar") && t.classList.add("has-taskbar");
    const a = document.getElementById("interface");
    a && document.body.insertBefore(t, a), De = new Ye(), t.api = De;
  }
  J = (e = (i = game.combat) == null ? void 0 : i.turns.find((t) => {
    var a;
    return t.id == ((a = game.combat) == null ? void 0 : a.current.combatantId);
  })) == null ? void 0 : e.actor, G = J, de() && $("#ape-app").addClass("is-open always-on"), ge();
});
function Ht() {
  const i = game.settings.get("action-pack-enhanced", "tray-display");
  return i === "selected" || i === "auto";
}
function de() {
  return game.settings.get("action-pack-enhanced", "tray-display") === "always";
}
function z() {
  const i = canvas.tokens.controlled.filter((e) => {
    var t;
    return ["character", "npc"].includes((t = e.actor) == null ? void 0 : t.type);
  });
  return i.length ? i.map((e) => e.actor) : game.user.character && game.settings.get("action-pack-enhanced", "assume-default-character") ? [game.user.character] : [];
}
Hooks.on("controlToken", async () => {
  ge();
});
Hooks.on("updateActor", (i) => {
  z().includes(i) && O();
});
function Nt(i) {
  const e = document.querySelector(`ape-actor[data-actor-uuid="${i.uuid}"]`);
  e && e.requestUpdate();
}
function ue(i) {
  z().includes(i.parent) && Nt(i.parent);
}
Hooks.on("createActiveEffect", (i) => {
  ue(i);
});
Hooks.on("updateActiveEffect", (i) => {
  ue(i);
});
Hooks.on("deleteActiveEffect", (i) => {
  ue(i);
});
function he(i) {
  z().includes(i.actor) && O();
}
Hooks.on("updateItem", (i) => {
  he(i);
});
Hooks.on("deleteItem", (i) => {
  he(i);
});
Hooks.on("createItem", (i) => {
  he(i);
});
Hooks.on("updateCombat", (i) => {
  var e;
  G = (e = i.turns.find((t) => t.id == i.current.combatantId)) == null ? void 0 : e.actor, pe(), J = G;
});
Hooks.on("createCombatant", (i) => {
  z().includes(i.actor) && O();
});
Hooks.on("updateCombatant", (i, e) => {
  z().includes(i.actor) && O();
});
Hooks.on("deleteCombat", (i) => {
  game.combat || (G = null, J = null, pe());
});
Hooks.on("init", () => {
  dt({
    updateTray: O,
    updateTrayState: ge
  });
});
Hooks.on("getSceneControlButtons", (i) => {
  if (game.settings.get("action-pack-enhanced", "use-control-button") && !de()) {
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
function ge() {
  const i = $("#ape-app");
  Ht() && (canvas.tokens.controlled.filter((t) => {
    var a;
    return ["character", "npc"].includes((a = t.actor) == null ? void 0 : a.type);
  }).length ? i.addClass("is-open") : i.removeClass("is-open")), de() ? i.addClass("is-open always-on") : i.removeClass("always-on"), pe(), O();
}
async function O() {
  ne || (ne = new pt());
  const i = z(), e = ne.build(i, {
    /* scrollPosition stub */
  });
  function t(g, f) {
    return g && [f, g].join("-");
  }
  const a = t(game.settings.get("action-pack-enhanced", "icon-size"), "icon"), s = t(game.settings.get("action-pack-enhanced", "tray-size"), "tray"), r = game.settings.get("action-pack-enhanced", "show-spell-dots"), n = game.settings.get("action-pack-enhanced", "show-spell-uses"), o = game.settings.get("action-pack-enhanced", "show-weapon-mastery"), l = game.settings.get("action-pack-enhanced", "static-info"), d = Object.entries(CONFIG.DND5E.abilities), p = [
    d.slice(0, 3).map(([g, f]) => ({ key: g, label: f.label })),
    d.slice(3, 6).map(([g, f]) => ({ key: g, label: f.label }))
  ], c = document.querySelector("#ape-app");
  Array.from(c.classList).forEach((g) => {
    (g.startsWith("tray-") || g.startsWith("icon-")) && c.classList.remove(g);
  }), c.classList.add(a), c.classList.add(s), c && (c.data = {
    actors: e
  }, c.globalData = {
    abilityColumns: p,
    showSpellDots: r,
    showSpellUses: n,
    showWeaponMastery: o,
    staticInfo: l
  });
}
Hooks.on("dnd5e.getItemContextOptions", (i, e) => {
  var t;
  (t = i.system.activation) != null && t.type && i.system.activation.type !== "none" && (i.getFlag("action-pack-enhanced", "hidden") ? e.push({
    name: game.i18n.localize("action-pack-enhanced.item-context.show"),
    icon: "<i class='fas fa-eye'></i>",
    callback: async () => {
      await i.setFlag("action-pack-enhanced", "hidden", !1), O();
    }
  }) : e.push({
    name: game.i18n.localize("action-pack-enhanced.item-context.hide"),
    icon: "<i class='fas fa-eye-slash'></i>",
    callback: async () => {
      await i.setFlag("ape", "hidden", !0), O();
    }
  }));
});
Hooks.on("dropCanvasData", (i, e, t) => {
  var a;
  if (e.type === "ActionPackItem" && e.uuid) {
    const s = Rt(e.uuid);
    if (!s) return;
    const r = i.tokens.placeables.find((n) => e.x >= n.x && e.x <= n.x + n.w && e.y >= n.y && e.y <= n.y + n.h);
    if (r) {
      const n = (a = s.system) == null ? void 0 : a.activities;
      if (!n) return;
      (n.contents[0].target.affects.count || 1) === 1 && r.setTarget(!0, { user: game.user, releaseOthers: !0, groupSelection: !0 });
    }
    return s.use({ event: t }), !1;
  }
});
export {
  Wt as fudgeToActor
};
//# sourceMappingURL=ape.mjs.map
