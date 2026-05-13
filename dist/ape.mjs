var Ke = Object.defineProperty;
var Ze = (n, e, t) => e in n ? Ke(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var R = (n, e, t) => Ze(n, typeof e != "symbol" ? e + "" : e, t);
class Je {
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
        let i = 0;
        if (s.type === "constant")
          i = s.value;
        else if (s.type === "table") {
          const r = a.system.levels, o = s.values.find((l) => l.level === r);
          i = o ? o.mastery : 0;
        }
        i > t && (t = i);
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
    if (game.modules.get("wm5e") && ((s = game.modules.get("wm5e")) == null ? void 0 : s.active) && e.itemTypes.feat.find((i) => i.name === "Weapon Mastery" || i.name === "Weapon Master")) {
      await e.setFlag("action-pack-enhanced", "masterySelectionPending", !0);
      const i = e.itemTypes.weapon.filter((d) => d.name !== "Unarmed Strike"), r = /* @__PURE__ */ new Map(), o = e.system.traits.weaponProf.mastery.value;
      i.forEach((d) => {
        var g, m;
        const p = d.system.mastery, c = (g = d.system.type) == null ? void 0 : g.baseItem;
        p && c && !r.has(c) && r.set(c, {
          id: c,
          label: c.replace(/-/g, " ").replace(/\b\w/g, (y) => y.toUpperCase()),
          masteryLabel: ((m = CONFIG.DND5E.weaponMasteries[p]) == null ? void 0 : m.label) || p,
          selected: o.find((y) => y === c)
        });
      });
      const l = this.calculateMaxMasteries(e);
      await this.promptMasterySelection(e, r, l);
    } else
      await e.setFlag("action-pack-enhanced", "masterySelectionPending", !1), await e.update({ "system.traits.weaponProf.mastery.value": [] });
    return t;
  }
  async promptMasterySelection(e, t, a) {
    const { DialogV2: s } = foundry.applications.api;
    let i = `<p>Select up to ${a} ${a === 1 ? "weapon" : "weapons"} to use ${a === 1 ? "its" : "their"} weapon mastery for the day:</p>`;
    i += '<form class="ape-mastery-dialog">';
    for (const [r, o] of t)
      i += `
            <div class="ape-mastery-switch form-group">
                <input id="${r}" class="ape-mastery-checkbox" type="checkbox" name="mastery" value="${r}" data-dtype="String" ${o.selected ? "checked" : ""}>
                <label for="${r}" class="ape-mastery-label">${o.label} (${o.masteryLabel})</label>
            </div>`;
    return i += "</form>", i += `
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
      content: i,
      buttons: [{
        action: "update",
        label: "Update",
        default: !0,
        callback: async (r, o, l) => {
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
      submit: (r) => {
      }
    });
  }
  /**
   * Toggles a Weapon Mastery selection
   * @param {Actor} actor 
   * @param {string} masteryId 
   */
  async toggleMastery(e, t) {
    var s, i, r;
    if (!e || !t) return;
    const a = new Set(((r = (i = (s = e.system.traits) == null ? void 0 : s.weaponProf) == null ? void 0 : i.mastery) == null ? void 0 : r.value) || []);
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
    var r, o;
    const s = a + 1, i = (o = (r = e.system.spells) == null ? void 0 : r[t]) == null ? void 0 : o.value;
    if (i !== void 0) {
      const l = `system.spells.${t}.value`, d = i !== s ? s : s - 1;
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
      return e.use({}, t);
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
    var r, o, l, d;
    const t = await e.getChatData({ secrets: e.actor.isOwner }), a = ((o = (r = e.system) == null ? void 0 : r.activation) == null ? void 0 : o.type) || "", s = ((d = (l = e.system) == null ? void 0 : l.activation) == null ? void 0 : d.value) || "";
    let i = "";
    return s === "" ? i = a.charAt(0).toUpperCase() + a.slice(1) : s && a && (i = `${s} ${a.charAt(0).toUpperCase() + a.slice(1)}`), {
      description: t.description,
      properties: {
        castingTime: i,
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
    var s, i, r, o;
    const t = (i = (s = e.system) == null ? void 0 : s.range) == null ? void 0 : i.value, a = (o = (r = e.system) == null ? void 0 : r.range) == null ? void 0 : o.units;
    return t && a ? `${t} ${a}` : a || "";
  }
  _formatDuration(e) {
    var s, i, r, o;
    const t = (i = (s = e.system) == null ? void 0 : s.duration) == null ? void 0 : i.value, a = (o = (r = e.system) == null ? void 0 : r.duration) == null ? void 0 : o.units;
    return t && a ? `${t} ${a}` : a ? a === "inst" ? "Instantaneous" : a : "";
  }
  /**
   * Sets a weapon set item
   * @param {Actor} actor 
   * @param {number} setIndex 
   * @param {string} slot 'main' or 'off'
   * @param {string} itemUuid 
   */
  async setWeaponSetItem(e, t, a, s, i) {
    var l, d, p;
    if (!e) return;
    const r = e.getFlag("action-pack-enhanced", "weaponSets") || [];
    for (let c = 0; c <= t; c++)
      r[c] || (r[c] = { main: null, off: null, active: !1 });
    const o = fromUuidSync(s);
    if (o) {
      const c = a === "main" ? "off" : "main", g = r[t][c], m = [];
      if (g === s && ((l = o.system) == null ? void 0 : l.quantity) === 1 && m.push(game.i18n.localize("action-pack-enhanced.warning.quantity-limit") || "Not enough quantity to equip in both slots."), (d = o.system.properties) != null && d.has("two") && g) {
        const y = fromUuidSync(g);
        y && ((p = y.system.properties) != null && p.has("two")) && m.push(game.i18n.localize("action-pack-enhanced.warning.two-handed") || "You cannot have two two-handed weapons in the same set.");
      }
      if (m.length > 0) {
        m.forEach((y) => ui.notifications.warn(y));
        return;
      }
    }
    if (r[t][a] = s, await e.setFlag("action-pack-enhanced", "weaponSets", r), r[t].active)
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
    const i = a.map((p, c) => ({ ...p, active: c === t }));
    await e.setFlag("action-pack-enhanced", "weaponSets", i);
    const r = [], o = e.itemTypes.weapon.filter((p) => p.name !== "Unarmed Strike"), l = e.itemTypes.equipment.find((p) => p.name.includes("Shield"));
    l && o.push(l);
    const d = /* @__PURE__ */ new Set();
    s.main && d.add(s.main), s.off && d.add(s.off);
    for (const p of o) {
      const c = d.has(p.uuid);
      p.system.equipped !== c && r.push({ _id: p.id, "system.equipped": c });
    }
    r.length > 0 && await e.updateEmbeddedDocuments("Item", r);
  }
}
function Y(n) {
  return n == null ? "0" : `${n >= 0 ? "+" : ""}${n}`;
}
function Ye(n) {
  const e = n.type === "spell" ? st(n) : "", t = Qe(n), a = et(n), s = tt(n), i = n.type === "spell" ? at(n) : "";
  return { school: e, castingTime: t, range: a, duration: s, materials: i };
}
function Qe(n) {
  var a, s, i, r;
  const e = ((s = (a = n.system) == null ? void 0 : a.activation) == null ? void 0 : s.type) || "", t = ((r = (i = n.system) == null ? void 0 : i.activation) == null ? void 0 : r.value) || "";
  return t === "" && e !== "" ? game.i18n.localize(`action-pack-enhanced.action-type.${e}`) : t && e ? `${t} ${e.charAt(0).toUpperCase() + e.slice(1)}` : "";
}
function et(n) {
  var s, i, r, o, l, d, p, c;
  const e = ((i = (s = n.system) == null ? void 0 : s.range) == null ? void 0 : i.long) || null, t = (o = (r = n.system) == null ? void 0 : r.range) == null ? void 0 : o.units;
  let a;
  return t !== "touch" && t !== "self" ? a = ((d = (l = n.system) == null ? void 0 : l.range) == null ? void 0 : d.value) || ((c = (p = n.system) == null ? void 0 : p.range) == null ? void 0 : c.reach) || 5 : a = null, a && e && t ? `${a} ${t} / ${e} ${t}` : a && t ? `${a} ${t}` : t ? game.i18n.localize(`action-pack-enhanced.range.${t}`) : "";
}
function tt(n) {
  var a, s, i, r;
  const e = (s = (a = n.system) == null ? void 0 : a.duration) == null ? void 0 : s.value, t = (r = (i = n.system) == null ? void 0 : i.duration) == null ? void 0 : r.units;
  return e && t ? `${e} ${e > 1 ? t + "s" : t}` : t ? game.i18n.localize(`action-pack-enhanced.duration.${t}`) : "";
}
function at(n) {
  var t, a;
  const e = (a = (t = n.system) == null ? void 0 : t.materials) == null ? void 0 : a.value;
  return e || "";
}
function st(n) {
  var t, a;
  if ((t = n.labels) != null && t.school)
    return n.labels.school;
  const e = (a = n.system) == null ? void 0 : a.school;
  if (e) {
    const s = CONFIG.DND5E.spellSchools[e];
    return s ? s.label || s : e;
  }
  return "";
}
function it(n) {
  var l, d;
  let e = {}, t = n.itemTypes.race, a = n.itemTypes.class, s = n.itemTypes.subclass;
  const i = n.system.details.level;
  if (a.length === s.length) {
    let p = { race: `<span>${(l = t[0]) == null ? void 0 : l.name} - ${i}</span>` || "Unknown", classes: [] };
    for (let c = 0; c < a.length; c++)
      p.classes[c] = { name: a[c].name, level: a[c].system.levels, subclass: { name: s[c].name } };
    e = p;
  } else {
    let p = { race: `<span>${(d = t[0]) == null ? void 0 : d.name} - ${i}</span>` || "Unknown", classes: [] };
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
  let r = `${e.race}`, o = [];
  for (let p = 0; p < e.classes.length; p++) {
    let c = "", g = "";
    e.classes[p].subclass.name !== "" ? (c = e.classes[p].subclass.icon, g = `${e.classes[p].subclass.name} ${e.classes[p].name} (${e.classes[p].level})`) : (c = e.classes[p].icon, g = `${e.classes[p].name} (${e.classes[p].level})`), o.push(`<img class="ape-actor-class-icon" src="${c}" title="${g}">`);
  }
  return r + `<span class="ape-actor-class-icons">${o.join("")}</span>`;
}
const nt = (n) => {
  const e = n.system, t = e.consume;
  if (t && t.target)
    return rt(n.actor, t);
  const a = e.uses;
  if (a && (a.max > 0 || a.value > 0))
    return De(e);
  const s = n.type;
  return s === "feat" ? ot() : s === "consumable" ? {
    available: e.quantity
  } : s === "weapon" ? lt(e) : null;
};
function rt(n, e) {
  let t = null, a = null;
  if (e.type === "attribute") {
    const s = getProperty(n.system, e.target);
    typeof s == "number" ? t = s : t = 0;
  } else if (e.type === "ammo" || e.type === "material") {
    const s = n.items.get(e.target);
    s ? t = s.system.quantity : t = 0;
  } else if (e.type === "charges") {
    const s = n.items.get(e.target);
    s ? { available: t, maximum: a } = De(s.system) : t = 0;
  }
  return t !== null ? (e.amount > 1 && (t = Math.floor(t / e.amount), a !== null && (a = Math.floor(a / e.amount))), { available: t, maximum: a }) : null;
}
function De(n) {
  let e = n.uses.value, t = n.uses.max;
  const a = n.quantity;
  return a && (e = e + (a - 1) * t, t = t * a), { available: e, maximum: t };
}
function ot(n) {
  return null;
}
function lt(n) {
  return n.properties.thr && !n.properties.ret ? { available: n.quantity, maximum: null } : null;
}
class ct {
  constructor() {
  }
  build(e, t) {
    return this.settingShowNoUses = game.settings.get("action-pack-enhanced", "show-no-uses"), this.settingShowUnpreparedCantrips = game.settings.get("action-pack-enhanced", "show-unprepared-cantrips"), this.settingShowUnpreparedSpells = game.settings.get("action-pack-enhanced", "show-unprepared-spells"), this.settingSortAlphabetically = game.settings.get("action-pack-enhanced", "sort-alphabetic"), this.settingShowWeaponMastery = game.settings.get("action-pack-enhanced", "show-weapon-mastery"), e.map((a) => this.prepareActor(a, t));
  }
  prepareActor(e, t) {
    var S, E;
    const a = e.system, s = !!e.itemTypes.feat.find((f) => f.name === "Ritual Adept"), i = e.getFlag("action-pack-enhanced", "weaponSets") || [], r = [];
    for (let f = 0; f < 3; f++) {
      const b = i[f] || { main: null, off: null, active: !1 }, P = { index: f, main: null, off: null, active: b.active };
      if (b.main) {
        const v = fromUuidSync(b.main);
        v && (P.main = { uuid: b.main, img: v.img, rarity: v.system.rarity, name: v.name });
      }
      if (b.off) {
        const v = fromUuidSync(b.off);
        v && (P.off = { uuid: b.off, img: v.img, rarity: v.system.rarity, name: v.name });
      }
      r.push(P);
    }
    let o = {
      equipped: {
        items: [],
        title: "action-pack-enhanced.category.weapon",
        weaponSets: r,
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
        for (const P of b)
          this._processItem(P, f, o, e, s);
    const d = game.modules.find((f) => f.id === "wm5e") && ((S = game.modules.get("wm5e")) == null ? void 0 : S.active);
    if (e.type === "character" && d && e.itemTypes.feat.find((b) => b.name === "Weapon Mastery" || b.name === "Weapon Master")) {
      const b = e.getFlag("action-pack-enhanced", "masterySelectionPending");
      o.equipped.forceOpen = b;
    }
    const p = (E = game.combat) == null ? void 0 : E.combatants.find((f) => f.actor === e), c = p && !p.initiative, g = game.modules.get("dnd5e-spellpoints"), m = g && (g != null && g.active) ? getSpellPointsItem(e) : null, y = this.sortItems(this.removeEmptySections(o)), _ = m ? this.addSpellPointUses(y, m, a) : this.addSpellLevelUses(y, a);
    return {
      actor: e,
      name: e.name,
      sections: _,
      needsInitiative: c,
      skills: CONFIG.DND5E.skills
    };
  }
  _processItem(e, t, a, s, i) {
    var c;
    const r = e.system, o = nt(e), l = this.settingShowNoUses || !o || o.available, d = ((c = r == null ? void 0 : r.activities) == null ? void 0 : c.size) > 0, p = e.getFlag("action-pack-enhanced", "hidden");
    if (e.type === "equipment" && (r.identified && r.identifier === "shield" || e.name.includes("Shield")) && (r.equipped ? a.equipped.groups.shield.items.push({ item: e, uses: o }) : a.equipped.groups.unequipped.items.push({ item: e, uses: o })), l && d && !p)
      switch (t) {
        case "feat":
          this._prepareFeat(e, r, o, a);
          break;
        case "spell":
          this._prepareSpell(e, r, o, a, i);
          break;
        case "weapon":
          this._prepareWeapon(e, r, o, a);
          break;
        case "equipment":
          this._prepareEquipment(e, r, o, a);
          break;
        case "consumable":
          this._prepareConsumable(e, r, o, a);
          break;
        case "facility":
          break;
        default:
          this._prepareOther(e, r, o, a);
          break;
      }
    else s.type === "npc" && a.passive.items.push({ item: e, uses: o });
  }
  _prepareFeat(e, t, a, s) {
    var o, l;
    const i = (o = t.type) == null ? void 0 : o.value, r = (l = t.type) == null ? void 0 : l.subtype;
    r && s.feature.groups[r] ? s.feature.groups[r].items.push({ item: e, uses: a }) : i && s.feature.groups[i] ? s.feature.groups[i].items.push({ item: e, uses: a }) : s.feature.groups.general.items.push({ item: e, uses: a });
  }
  _prepareSpell(e, t, a, s, i) {
    var o;
    switch (t == null ? void 0 : t.method) {
      case "spell":
        const l = (t == null ? void 0 : t.prepared) === 1, d = (t == null ? void 0 : t.prepared) === 2, p = i && ((o = t.properties) == null ? void 0 : o.has("ritual")), c = t.level == 0 && this.settingShowUnpreparedCantrips, g = t.level > 0 && this.settingShowUnpreparedSpells;
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
    const i = e.name === "Unarmed Strike";
    t.equipped || i ? s.equipped.items.push({ item: e, uses: a }) : s.equipped.groups.unequipped.items.push({ item: e, uses: a });
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
      return s.includes("groups") && Object.values(a.groups).some((i) => t(i)) ? !0 : s.includes("items") ? !!a.items.length : Object.values(a).some((i) => t(i));
    };
    return Object.entries(e).reduce((a, [s, i]) => (t(i) && (a[s] = i), a), {});
  }
  addSpellPointUses(e, t, a) {
    var r, o, l, d, p, c, g, m, y;
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
    }, i = {
      available: ((o = (r = t.system) == null ? void 0 : r.uses) == null ? void 0 : o.value) || 0,
      maximum: ((d = (l = t.system) == null ? void 0 : l.uses) == null ? void 0 : d.max) || 0
    };
    if (e.spell) {
      e.spell.uses = i;
      for (let _ = 1; _ <= 9; _++) {
        const S = (p = e.spell) == null ? void 0 : p.groups[`spell${_}`];
        S && (S.cost = s[_]);
      }
    }
    return (g = (c = a.spells) == null ? void 0 : c.pact) != null && g.max && ((y = (m = e.spell) == null ? void 0 : m.groups) != null && y.pact) && (e.spell.groups.pact.uses = {
      available: a.spells.pact.value,
      maximum: a.spells.pact.max
    }), e;
  }
  addSpellLevelUses(e, t) {
    var a, s, i, r, o;
    for (let l = 1; l <= 9; l++) {
      const d = (a = e.spell) == null ? void 0 : a.groups[`spell${l}`];
      if (d) {
        const p = t.spells[`spell${l}`];
        d.uses = { available: p.value, maximum: p.max };
      }
    }
    return (i = (s = t.spells) == null ? void 0 : s.pact) != null && i.max && ((o = (r = e.spell) == null ? void 0 : r.groups) != null && o.pact) && (e.spell.groups.pact.uses = {
      available: t.spells.pact.value,
      maximum: t.spells.pact.max
    }), e;
  }
  sortItems(e) {
    return Object.entries(e).forEach(([t, a]) => {
      t === "items" ? a.sort((s, i) => this.settingSortAlphabetically ? s.item.name.localeCompare(i.item.name) : s.item.sort - i.item.sort) : a && typeof a == "object" && this.sortItems(a);
    }), e;
  }
}
function pt(n) {
  var i;
  const { updateTray: e, updateTrayState: t } = n, a = !!((i = game.modules.get("dnd5e-spellpoints")) != null && i.active);
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
    "show-death-saves",
    {
      name: "action-pack-enhanced.settings.show-death-saves",
      hint: "action-pack-enhanced.settings.show-death-saves-hint",
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
    onDown: (r) => {
      s() || ($("#ape-app").toggleClass("is-open"), $("#ape-app .ape-skill-container").removeClass("is-open"));
    }
  });
}
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const V = globalThis, re = V.ShadowRoot && (V.ShadyCSS === void 0 || V.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, He = Symbol(), Se = /* @__PURE__ */ new WeakMap();
let dt = class {
  constructor(e, t, a) {
    if (this._$cssResult$ = !0, a !== He) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (re && e === void 0) {
      const a = t !== void 0 && t.length === 1;
      a && (e = Se.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), a && Se.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ut = (n) => new dt(typeof n == "string" ? n : n + "", void 0, He), ht = (n, e) => {
  if (re) n.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const a = document.createElement("style"), s = V.litNonce;
    s !== void 0 && a.setAttribute("nonce", s), a.textContent = t.cssText, n.appendChild(a);
  }
}, Ae = re ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const a of e.cssRules) t += a.cssText;
  return ut(t);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: gt, defineProperty: mt, getOwnPropertyDescriptor: yt, getOwnPropertyNames: ft, getOwnPropertySymbols: bt, getPrototypeOf: vt } = Object, x = globalThis, xe = x.trustedTypes, $t = xe ? xe.emptyScript : "", Q = x.reactiveElementPolyfillSupport, z = (n, e) => n, ie = { toAttribute(n, e) {
  switch (e) {
    case Boolean:
      n = n ? $t : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, e) {
  let t = n;
  switch (e) {
    case Boolean:
      t = n !== null;
      break;
    case Number:
      t = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(n);
      } catch {
        t = null;
      }
  }
  return t;
} }, ze = (n, e) => !gt(n, e), Ce = { attribute: !0, type: String, converter: ie, reflect: !1, useDefault: !1, hasChanged: ze };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), x.litPropertyMetadata ?? (x.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let M = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Ce) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const a = Symbol(), s = this.getPropertyDescriptor(e, a, t);
      s !== void 0 && mt(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, a) {
    const { get: s, set: i } = yt(this.prototype, e) ?? { get() {
      return this[t];
    }, set(r) {
      this[t] = r;
    } };
    return { get: s, set(r) {
      const o = s == null ? void 0 : s.call(this);
      i == null || i.call(this, r), this.requestUpdate(e, o, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Ce;
  }
  static _$Ei() {
    if (this.hasOwnProperty(z("elementProperties"))) return;
    const e = vt(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(z("properties"))) {
      const t = this.properties, a = [...ft(t), ...bt(t)];
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
    return ht(e, this.constructor.elementStyles), e;
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
    var i;
    const a = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, a);
    if (s !== void 0 && a.reflect === !0) {
      const r = (((i = a.converter) == null ? void 0 : i.toAttribute) !== void 0 ? a.converter : ie).toAttribute(t, a.type);
      this._$Em = e, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var i, r;
    const a = this.constructor, s = a._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const o = a.getPropertyOptions(s), l = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((i = o.converter) == null ? void 0 : i.fromAttribute) !== void 0 ? o.converter : ie;
      this._$Em = s;
      const d = l.fromAttribute(t, o.type);
      this[s] = d ?? ((r = this._$Ej) == null ? void 0 : r.get(s)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, t, a, s = !1, i) {
    var r;
    if (e !== void 0) {
      const o = this.constructor;
      if (s === !1 && (i = this[e]), a ?? (a = o.getPropertyOptions(e)), !((a.hasChanged ?? ze)(i, t) || a.useDefault && a.reflect && i === ((r = this._$Ej) == null ? void 0 : r.get(e)) && !this.hasAttribute(o._$Eu(e, a)))) return;
      this.C(e, t, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: a, reflect: s, wrapped: i }, r) {
    a && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, r ?? t ?? this[e]), i !== !0 || r !== void 0) || (this._$AL.has(e) || (this.hasUpdated || a || (t = void 0), this._$AL.set(e, t)), s === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
        for (const [i, r] of this._$Ep) this[i] = r;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [i, r] of s) {
        const { wrapped: o } = r, l = this[i];
        o !== !0 || this._$AL.has(i) || l === void 0 || this.C(i, void 0, r, l);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (a = this._$EO) == null || a.forEach((s) => {
        var i;
        return (i = s.hostUpdate) == null ? void 0 : i.call(s);
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
M.elementStyles = [], M.shadowRootOptions = { mode: "open" }, M[z("elementProperties")] = /* @__PURE__ */ new Map(), M[z("finalized")] = /* @__PURE__ */ new Map(), Q == null || Q({ ReactiveElement: M }), (x.reactiveElementVersions ?? (x.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const N = globalThis, Ee = (n) => n, G = N.trustedTypes, Pe = G ? G.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, Ne = "$lit$", A = `lit$${Math.random().toFixed(9).slice(2)}$`, je = "?" + A, kt = `<${je}>`, U = document, j = () => U.createComment(""), B = (n) => n === null || typeof n != "object" && typeof n != "function", oe = Array.isArray, wt = (n) => oe(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", ee = `[ 	
\f\r]`, H = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Oe = /-->/g, qe = />/g, O = RegExp(`>|${ee}(?:([^\\s"'>=/]+)(${ee}*=${ee}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Te = /'/g, Ue = /"/g, Be = /^(?:script|style|textarea|title)$/i, _t = (n) => (e, ...t) => ({ _$litType$: n, strings: e, values: t }), u = _t(1), I = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), Ie = /* @__PURE__ */ new WeakMap(), q = U.createTreeWalker(U, 129);
function Le(n, e) {
  if (!oe(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Pe !== void 0 ? Pe.createHTML(e) : e;
}
const St = (n, e) => {
  const t = n.length - 1, a = [];
  let s, i = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = H;
  for (let o = 0; o < t; o++) {
    const l = n[o];
    let d, p, c = -1, g = 0;
    for (; g < l.length && (r.lastIndex = g, p = r.exec(l), p !== null); ) g = r.lastIndex, r === H ? p[1] === "!--" ? r = Oe : p[1] !== void 0 ? r = qe : p[2] !== void 0 ? (Be.test(p[2]) && (s = RegExp("</" + p[2], "g")), r = O) : p[3] !== void 0 && (r = O) : r === O ? p[0] === ">" ? (r = s ?? H, c = -1) : p[1] === void 0 ? c = -2 : (c = r.lastIndex - p[2].length, d = p[1], r = p[3] === void 0 ? O : p[3] === '"' ? Ue : Te) : r === Ue || r === Te ? r = O : r === Oe || r === qe ? r = H : (r = O, s = void 0);
    const m = r === O && n[o + 1].startsWith("/>") ? " " : "";
    i += r === H ? l + kt : c >= 0 ? (a.push(d), l.slice(0, c) + Ne + l.slice(c) + A + m) : l + A + (c === -2 ? o : m);
  }
  return [Le(n, i + (n[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), a];
};
class L {
  constructor({ strings: e, _$litType$: t }, a) {
    let s;
    this.parts = [];
    let i = 0, r = 0;
    const o = e.length - 1, l = this.parts, [d, p] = St(e, t);
    if (this.el = L.createElement(d, a), q.currentNode = this.el.content, t === 2 || t === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (s = q.nextNode()) !== null && l.length < o; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const c of s.getAttributeNames()) if (c.endsWith(Ne)) {
          const g = p[r++], m = s.getAttribute(c).split(A), y = /([.?@])?(.*)/.exec(g);
          l.push({ type: 1, index: i, name: y[2], strings: m, ctor: y[1] === "." ? xt : y[1] === "?" ? Ct : y[1] === "@" ? Et : Z }), s.removeAttribute(c);
        } else c.startsWith(A) && (l.push({ type: 6, index: i }), s.removeAttribute(c));
        if (Be.test(s.tagName)) {
          const c = s.textContent.split(A), g = c.length - 1;
          if (g > 0) {
            s.textContent = G ? G.emptyScript : "";
            for (let m = 0; m < g; m++) s.append(c[m], j()), q.nextNode(), l.push({ type: 2, index: ++i });
            s.append(c[g], j());
          }
        }
      } else if (s.nodeType === 8) if (s.data === je) l.push({ type: 2, index: i });
      else {
        let c = -1;
        for (; (c = s.data.indexOf(A, c + 1)) !== -1; ) l.push({ type: 7, index: i }), c += A.length - 1;
      }
      i++;
    }
  }
  static createElement(e, t) {
    const a = U.createElement("template");
    return a.innerHTML = e, a;
  }
}
function D(n, e, t = n, a) {
  var r, o;
  if (e === I) return e;
  let s = a !== void 0 ? (r = t._$Co) == null ? void 0 : r[a] : t._$Cl;
  const i = B(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== i && ((o = s == null ? void 0 : s._$AO) == null || o.call(s, !1), i === void 0 ? s = void 0 : (s = new i(n), s._$AT(n, t, a)), a !== void 0 ? (t._$Co ?? (t._$Co = []))[a] = s : t._$Cl = s), s !== void 0 && (e = D(n, s._$AS(n, e.values), s, a)), e;
}
class At {
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
    let i = q.nextNode(), r = 0, o = 0, l = a[0];
    for (; l !== void 0; ) {
      if (r === l.index) {
        let d;
        l.type === 2 ? d = new F(i, i.nextSibling, this, e) : l.type === 1 ? d = new l.ctor(i, l.name, l.strings, this, e) : l.type === 6 && (d = new Pt(i, this, e)), this._$AV.push(d), l = a[++o];
      }
      r !== (l == null ? void 0 : l.index) && (i = q.nextNode(), r++);
    }
    return q.currentNode = U, s;
  }
  p(e) {
    let t = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(e, a, t), t += a.strings.length - 2) : a._$AI(e[t])), t++;
  }
}
class F {
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
    e = D(this, e, t), B(e) ? e === h || e == null || e === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : e !== this._$AH && e !== I && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : wt(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== h && B(this._$AH) ? this._$AA.nextSibling.data = e : this.T(U.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var i;
    const { values: t, _$litType$: a } = e, s = typeof a == "number" ? this._$AC(e) : (a.el === void 0 && (a.el = L.createElement(Le(a.h, a.h[0]), this.options)), a);
    if (((i = this._$AH) == null ? void 0 : i._$AD) === s) this._$AH.p(t);
    else {
      const r = new At(s, this), o = r.u(this.options);
      r.p(t), this.T(o), this._$AH = r;
    }
  }
  _$AC(e) {
    let t = Ie.get(e.strings);
    return t === void 0 && Ie.set(e.strings, t = new L(e)), t;
  }
  k(e) {
    oe(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let a, s = 0;
    for (const i of e) s === t.length ? t.push(a = new F(this.O(j()), this.O(j()), this, this.options)) : a = t[s], a._$AI(i), s++;
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
class Z {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, a, s, i) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = e, this.name = t, this._$AM = s, this.options = i, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = h;
  }
  _$AI(e, t = this, a, s) {
    const i = this.strings;
    let r = !1;
    if (i === void 0) e = D(this, e, t, 0), r = !B(e) || e !== this._$AH && e !== I, r && (this._$AH = e);
    else {
      const o = e;
      let l, d;
      for (e = i[0], l = 0; l < i.length - 1; l++) d = D(this, o[a + l], t, l), d === I && (d = this._$AH[l]), r || (r = !B(d) || d !== this._$AH[l]), d === h ? e = h : e !== h && (e += (d ?? "") + i[l + 1]), this._$AH[l] = d;
    }
    r && !s && this.j(e);
  }
  j(e) {
    e === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class xt extends Z {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === h ? void 0 : e;
  }
}
class Ct extends Z {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== h);
  }
}
class Et extends Z {
  constructor(e, t, a, s, i) {
    super(e, t, a, s, i), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = D(this, e, t, 0) ?? h) === I) return;
    const a = this._$AH, s = e === h && a !== h || e.capture !== a.capture || e.once !== a.once || e.passive !== a.passive, i = e !== h && (a === h || s);
    s && this.element.removeEventListener(this.name, this, a), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
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
    D(this, e);
  }
}
const te = N.litHtmlPolyfillSupport;
te == null || te(L, F), (N.litHtmlVersions ?? (N.litHtmlVersions = [])).push("3.3.2");
const Ot = (n, e, t) => {
  const a = (t == null ? void 0 : t.renderBefore) ?? e;
  let s = a._$litPart$;
  if (s === void 0) {
    const i = (t == null ? void 0 : t.renderBefore) ?? null;
    a._$litPart$ = s = new F(e.insertBefore(j(), i), i, void 0, t ?? {});
  }
  return s._$AI(n), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const T = globalThis;
let w = class extends M {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ot(t, this.renderRoot, this.renderOptions);
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
    return I;
  }
};
var Me;
w._$litElement$ = !0, w.finalized = !0, (Me = T.litElementHydrateSupport) == null || Me.call(T, { LitElement: w });
const ae = T.litElementPolyfillSupport;
ae == null || ae({ LitElement: w });
(T.litElementVersions ?? (T.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const qt = { CHILD: 2 }, Tt = (n) => (...e) => ({ _$litDirective$: n, values: e });
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
class ne extends Ut {
  constructor(e) {
    if (super(e), this.it = h, e.type !== qt.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(e) {
    if (e === h || e == null) return this._t = void 0, this.it = e;
    if (e === I) return e;
    if (typeof e != "string") throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (e === this.it) return this._t;
    this.it = e;
    const t = [e];
    return t.raw = t, this._t = { _$litType$: this.constructor.resultType, strings: t, values: [] };
  }
}
ne.directiveName = "unsafeHTML", ne.resultType = 1;
const It = Tt(ne);
class We extends w {
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
    var ue, he, ge, me, ye, fe, be, ve, $e, ke, we, _e;
    if (!this.item) return h;
    const e = this.item.system, t = this.item.actor, a = e.rarity !== "" ? e.rarity : this.item.type === "weapon" ? "common" : "", s = this.item.type === "spell", i = e.method === "innate", r = this.uses && (!s || i), o = (ue = e.properties) == null ? void 0 : ue.has("ritual"), l = (he = e.properties) == null ? void 0 : he.has("concentration"), d = ((ge = e.activation) == null ? void 0 : ge.type) === "bonus", p = ((me = e.activation) == null ? void 0 : me.type) === "reaction", c = ((ye = e.activation) == null ? void 0 : ye.type) === "legendary", g = (fe = this.item) == null ? void 0 : fe.hasRecharge, m = !this.item.isOnCooldown, y = e.equipped, _ = this.item.type === "equipment" && (e.identified && e.identifier === "shield" || this.item.name.includes("Shield"));
    let S = null;
    if (g && ((be = e.uses) != null && be.recovery)) {
      const k = e.uses.recovery.find((J) => J.period === "recharge");
      k && (S = k.formula);
    }
    let E = !1, f = !1, b = "";
    if (game.modules.find((k) => k.id === "wm5e") && ((ve = game.modules.get("wm5e")) != null && ve.active) && (E = e.mastery || !1, E && this.item.type === "weapon")) {
      const k = ($e = e.type) == null ? void 0 : $e.baseItem, J = new Set(this.masteryIds || ((_e = (we = (ke = t.system.traits) == null ? void 0 : ke.weaponProf) == null ? void 0 : we.mastery) == null ? void 0 : _e.value) || []);
      f = k && J.has(k), b = game.i18n.localize(`action-pack-enhanced.masteries.${E}`);
    }
    const P = !!t.itemTypes.feat.find((k) => k.name === "Ritual Adept"), v = e.prepared === 0 && !(o && P);
    return u`
            <div class="item-name rollable flexrow ${v ? "unprepared" : ""}">
                <div class="item-image ${a}${v ? " unprepared" : ""}" 
                        style="background-image: url('${this.item.img}')"
                        @mousedown="${this._onRoll}">
                    <i class="fa fa-dice-d20"></i>
                </div>
                
                <div class="item-name-wrap flexrow">
                    <h4 @mousedown="${this._onClick}">
                        <span class="item-text ${a}">${this.item.name}</span>
                        ${r ? u` (${this.uses.available}${this.uses.maximum ? "/" + this.uses.maximum : ""})` : h}
                    </h4>
                    ${this.showWeaponMastery ? this._renderWeaponMastery(E, f, b) : h}
                </div>

                ${o ? u`<div class="ritual flag" title="${game.i18n.localize("action-pack-enhanced.flag.ritual-title")}"></div>` : h}
                ${l ? u`<div class="concentration flag" title="${game.i18n.localize("action-pack-enhanced.flag.concentration-title")}"></div>` : h}
                ${d ? u`<div class="bonus flag" title="${game.i18n.localize("action-pack-enhanced.flag.bonus-title")}">${game.i18n.localize("action-pack-enhanced.flag.bonus")}</div>` : h}
                ${p ? u`<div class="reaction flag" title="${game.i18n.localize("action-pack-enhanced.flag.reaction-title")}">${game.i18n.localize("action-pack-enhanced.flag.reaction")}</div>` : h}
                ${c ? u`<div class="legendary flag" title="${game.i18n.localize("action-pack-enhanced.flag.legendary-title")}">${game.i18n.localize("action-pack-enhanced.flag.legendary")}</div>` : h}

                ${g ? m ? u`<div class="flag"><i class="fas fa-bolt"></i></div>` : u`<div class="flag"><a class="rollable item-recharge" @mousedown="${this._onRecharge}"><i class="fas fa-dice-six"></i> ${S}+</a></div>` : h}

                ${v ? u`<div class="unprepared flag" title="${game.i18n.localize("action-pack-enhanced.flag.unprepared-title")}">${game.i18n.localize("action-pack-enhanced.flag.unprepared")}</div>` : h}
                ${(this.item.type === "weapon" || _) && !y ? u`<div class="unequipped flag" title="${game.i18n.localize("action-pack-enhanced.flag.unequipped-title")}" @mousedown="${this._onEquip}">${game.i18n.localize("action-pack-enhanced.flag.unequipped")}</div>` : h}
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
                    ${this.description ? u`<p>${It(this.description.description)}</p>` : u`<i class="fas fa-spinner fa-spin"></i>`}
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
    const e = Ye(this.item);
    return u`
            ${e.school ? u`<p><strong>School:</strong> ${e.school}</p>` : h}
            ${e.castingTime ? u`<p><strong>Casting Time:</strong> ${e.castingTime}</p>` : h}
            ${e.range ? u`<p><strong>Range:</strong> ${e.range}</p>` : h}
            ${e.duration ? u`<p><strong>Duration:</strong> ${e.duration}</p>` : h}
            ${e.materials ? u`<p><strong>Materials:</strong> ${e.materials}</p>` : h}
        `;
  }
  _renderItemProperties(e) {
    var i, r, o, l, d;
    const t = ((i = e == null ? void 0 : e.labels) == null ? void 0 : i.properties) || [], a = e.labels.hasOwnProperty("damageTypes") ? (o = (r = e == null ? void 0 : e.labels) == null ? void 0 : r.damageTypes) != null && o.includes(",") ? (l = e == null ? void 0 : e.labels) == null ? void 0 : l.damageTypes.split(",") : [(d = e == null ? void 0 : e.labels) == null ? void 0 : d.damageTypes] : [], s = [];
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
}
R(We, "properties", {
  item: { type: Object },
  uses: { type: Object },
  api: { type: Object },
  masteryIds: { type: Array },
  expanded: { type: Boolean, state: !0 },
  description: { type: Object, state: !0 },
  showWeaponMastery: { type: Boolean }
});
customElements.define("ape-item", We);
class Fe extends w {
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
      var t, a, s, i, r;
      return u`
                        <ape-item class="ape-item item" 
                            data-item-uuid="${e.item.uuid}" 
                            .item="${e.item}" 
                            .uses="${e.uses}" 
                            .api="${this.api}"
                            .masteryIds="${(r = (i = (s = (a = (t = this.actor) == null ? void 0 : t.system) == null ? void 0 : a.traits) == null ? void 0 : s.weaponProf) == null ? void 0 : i.mastery) == null ? void 0 : r.value}"
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
R(Fe, "properties", {
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
customElements.define("ape-section", Fe);
class Xe extends w {
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
    const { items: e, uses: t, title: a, cost: s } = this.group, i = e && e.length > 0, r = t && t.maximum, o = s || null;
    if (!i && !r) return h;
    const l = r && this.showSpellDots, d = t && this.showSpellUses, p = o && this.showCost, c = [
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

            ${i ? u`
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
R(Xe, "properties", {
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
customElements.define("ape-group", Xe);
class Ve extends w {
  createRenderRoot() {
    return this;
  }
  updated(e) {
    e.has("actorData") && this.actorData && (this.dataset.actorUuid = this.actorData.actor.uuid);
  }
  render() {
    if (!this.actorData) return h;
    const { actor: e, name: t, sections: a, needsInitiative: s } = this.actorData, i = e.system.attributes.hp, r = e.system.attributes.ac.value, o = e.type, l = i.value <= 0 && o === "character", d = e.system.attributes.inspiration;
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
                        <span class="ape-actor-ac-display">${r}</span>
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

                    ${game.settings.get("action-pack-enhanced", "show-xp-info") && o === "character" ? this._renderExperience(e) : h}

                    ${this._renderHpBar(e, i)}

                    <div class="ape-actor-rest-buttons rest-row">
                        <button class="btn ape-actor-rest-button" @click="${() => this.api.shortRest(e)}"><i class="fa-solid fa-utensils"></i> Short Rest</button>
                        <button class="btn ape-actor-rest-button" @click="${() => this.api.longRest(e)}"><i class="fa-solid fa-campground"></i> Long Rest</button>
                    </div>
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

                        ${game.settings.get("action-pack-enhanced", "show-xp-info") && o === "character" ? this._renderExperience(e) : h}

                        ${this._renderHpBar(e, i)}

                        <div class="ape-actor-rest-buttons rest-row">
                            <button class="btn ape-actor-rest-button" @click="${() => this.api.shortRest(e)}"><i class="fa-solid fa-utensils"></i> Short Rest</button>
                            <button class="btn ape-actor-rest-button" @click="${() => this.api.longRest(e)}"><i class="fa-solid fa-campground"></i> Long Rest</button>
                        </div>
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
    const t = e.system.details, a = t.xp.pct, s = t.xp.max, i = t.xp.min, r = t.xp.value;
    return u`
            <div class="ape-actor-xp bar-group">
                <div class="bar-label">
                    <span>XP</span>
                    <span class="ape-actor-xp-info">
                        <span class="ape-actor-xp-current" @click="${this._toggleXpActions}">${r}</span>
                        <span class="ape-actor-xp-separator"> / </span>
                        <span class="ape-actor-xp-max">${s}</span>
                    </span>
                </div>
                <div class="bar-track ape-actor-xp-bar"><div class="bar-fill xp-fill" style="width: ${a}%"></div></div>
                <div class="ape-actor-xp-actions ${this._xpActionsOpen ? "active" : "inactive"}">
                    <button class="ape-actor-xp-close" @click="${this._toggleXpActions}">close</button>
                    <p>Choose an amount to add to or subtract from ${e.name}'s XP</p>
                    <div class="ape-actor-xp-increment">
                        <button class="ape-actor-xp-button" ?disabled="${r >= s}" @click="${() => this.api.updateXP(e, r + 1)}">+1</button>
                        <button class="ape-actor-xp-button" ?disabled="${r >= s}" @click="${() => this.api.updateXP(e, r + 10)}">+10</button>
                        <button class="ape-actor-xp-button" ?disabled="${r >= s}" @click="${() => this.api.updateXP(e, r + 100)}">+100</button>
                        <button class="ape-actor-xp-button" ?disabled="${r >= s}" @click="${() => this.api.updateXP(e, r + 1e3)}">+1000</button>
                    </div>
                    <div class="ape-actor-xp-decrement">
                        <button class="ape-actor-xp-button" ?disabled="${r <= i}" @click="${() => this.api.updateXP(e, r - 1)}">-1</button>
                        <button class="ape-actor-xp-button" ?disabled="${r <= i}" @click="${() => this.api.updateXP(e, r - 10)}">-10</button>
                        <button class="ape-actor-xp-button" ?disabled="${r <= i}" @click="${() => this.api.updateXP(e, r - 100)}">-100</button>
                        <button class="ape-actor-xp-button" ?disabled="${r <= i}" @click="${() => this.api.updateXP(e, r - 1e3)}">-1000</button>
                    </div>
                    <div class="ape-actor-xp-max">
                        <button class="ape-actor-xp-button" ?disabled="${r >= s}" @click="${() => this.api.updateXP(e, s)}">Max</button>
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
    const t = it(e);
    return u`<div style="display:contents" .innerHTML="${t}"></div>`;
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
      const i = e.system.abilities[s.key];
      return u`
                                <span class="ape-ability">
                                    <span class="ape-ability-label">${s.key}</span>
                                    <a class="fas fa-dice-d20 ape-ability-check" 
                                       title="${s.label} check"
                                       @click="${(r) => this.api.rollAbilityCheck(e, s.key, r)}">
                                        <span class="ape-ability-text">${Y(i.mod)}</span>
                                    </a>
                                    <a class="fas fa-dice-d20 ape-ability-save" 
                                       title="${s.label} saving throw"
                                       @click="${(r) => this.api.rollSavingThrow(e, s.key, r)}">
                                        <span class="ape-ability-text">${Y(i.save.value)}</span>
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
      const i = a[s], r = t[s];
      if (!r) return h;
      let o = "far fa-circle";
      return i.proficient === 0.5 ? o = "fas fa-adjust" : i.proficient === 1 ? o = "fas fa-check" : i.proficient === 2 && (o = "fas fa-star"), u`
                            <div class="ape-skill-row flexrow ${i.proficient === 1 ? "proficient" : i.proficient === 2 ? "expert" : ""}"
                               @click="${(l) => this.api.rollSkill(e, s, l)}"
                               @contextmenu="${(l) => this.api.rollSkill(e, s, l, !0)}">
                                <span class="ape-skill-icon ${o}"></span>
                                <span class="ape-skill-ability">${i.ability}</span>
                                <span class="ape-skill-label">${r.label}</span>
                                <span class="ape-skill-bonus">${Y(i.total)}</span>
                                <span class="ape-skill-passive">(${i.passive})</span>
                            </div>
                        `;
    })}
                </div>
            </div>
        `;
  }
  _renderDeathSaves(e) {
    const t = e.system.attributes.death.failure, a = e.system.attributes.death.success, s = (r, o, l) => Array.from({ length: 3 }).map((d, p) => u`
                <span class="ape-death-dot ${p < r ? "filled" : ""}">
                    ${p < r ? u`<span class="fas ${l}"></span>` : h}
                </span>
             `), i = t < 3 && a < 3;
    return u`
             <div class="ape-death-saving">
                <span class="ape-death-throws failed">
                    ${s(t, "failed", "fa-skull-crossbones")}
                </span>
                <span class="ape-death-icon" 
                      style="${i ? "cursor:pointer" : "cursor:default"}"
                      @mousedown="${i ? (r) => this.api.rollDeathSave(e, r) : null}"></span>
                <span class="ape-death-throws saved">
                    ${s(a, "saved", "fa-check")}
                </span>
             </div>
        `;
  }
  _renderSections(e, t) {
    return ["equipped", "feature", "spell", "inventory", "passive"].map((s) => {
      const i = t[s];
      return i ? u`
                <ape-section 
                    class="ape-category"
                    .title="${i.title}" 
                    .uses="${i.uses}"
                    .items="${i.items}"
                    .weaponSets="${i.weaponSets}"
                    .groups="${i.groups}"
                    .sectionId="${s}"
                    .api="${this.api}"
                    .actor="${e}"
                    .showSpellDots="${this.globalData.showSpellDots}"
                    .showSpellUses="${this.globalData.showSpellUses}"
                    .showWeaponMastery="${this.globalData.showWeaponMastery}"
                    .forceOpen="${i.forceOpen}">
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
  _abilitiesOpen: { state: !1 }
});
customElements.define("ape-actor", Ve);
class Ge extends w {
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
R(Ge, "properties", {
  data: { type: Object },
  // Contains actors
  globalData: { type: Object },
  // Contains abilityColumns, showSpellDots
  api: { type: Object }
});
customElements.define("ape-app", Ge);
let K, W, Re, se;
function Rt(n) {
  var r;
  if (!n || n === "") return null;
  let e = n.split(".");
  if (e[0] === "Compendium")
    return null;
  const [t, a] = e.slice(0, 2);
  e = e.slice(2);
  const s = (r = CONFIG[t]) == null ? void 0 : r.collection.instance;
  if (!s) return null;
  let i = s.get(a);
  for (; i && e.length > 1; ) {
    const [o, l] = e.slice(0, 2);
    i = i.getEmbeddedDocument(o, l), e = e.slice(2);
  }
  return i || null;
}
function jt(n) {
  if (n instanceof CONFIG.Actor.documentClass)
    return n;
  if (n instanceof CONFIG.Token.documentClass)
    return n.object.actor;
}
function le() {
  const n = canvas.tokens.controlled.map((t) => t.actor), e = document.querySelector("#ape-app");
  e && (game.combat && n.includes(W) ? e.classList.add("is-current-combatant") : e.classList.remove("is-current-combatant"));
}
Hooks.on("ready", () => {
  var n, e;
  if (!document.querySelector("#ape-app")) {
    const t = document.createElement("ape-app");
    t.id = "ape-app", t.classList.add("ape-container"), game.modules.get("foundry-taskbar") && t.classList.add("has-taskbar");
    const a = document.getElementById("interface");
    a && document.body.insertBefore(t, a), Re = new Je(), t.api = Re;
  }
  K = (e = (n = game.combat) == null ? void 0 : n.turns.find((t) => {
    var a;
    return t.id == ((a = game.combat) == null ? void 0 : a.current.combatantId);
  })) == null ? void 0 : e.actor, W = K, ce() && $("#ape-app").addClass("is-open always-on"), de();
});
function Mt() {
  const n = game.settings.get("action-pack-enhanced", "tray-display");
  return n === "selected" || n === "auto";
}
function ce() {
  return game.settings.get("action-pack-enhanced", "tray-display") === "always";
}
function X() {
  const n = canvas.tokens.controlled.filter((e) => {
    var t;
    return ["character", "npc"].includes((t = e.actor) == null ? void 0 : t.type);
  });
  return n.length ? n.map((e) => e.actor) : game.user.character && game.settings.get("action-pack-enhanced", "assume-default-character") ? [game.user.character] : [];
}
Hooks.on("controlToken", async () => {
  de();
});
Hooks.on("updateActor", (n) => {
  X().includes(n) && C();
});
function pe(n) {
  X().includes(n.actor) && C();
}
Hooks.on("updateItem", (n) => {
  pe(n);
});
Hooks.on("deleteItem", (n) => {
  pe(n);
});
Hooks.on("createItem", (n) => {
  pe(n);
});
Hooks.on("updateCombat", (n) => {
  var e;
  W = (e = n.turns.find((t) => t.id == n.current.combatantId)) == null ? void 0 : e.actor, le(), K = W;
});
Hooks.on("createCombatant", (n) => {
  X().includes(n.actor) && C();
});
Hooks.on("updateCombatant", (n, e) => {
  X().includes(n.actor) && C();
});
Hooks.on("deleteCombat", (n) => {
  game.combat || (W = null, K = null, le());
});
Hooks.on("init", () => {
  pt({
    updateTray: C,
    updateTrayState: de
  });
});
Hooks.on("getSceneControlButtons", (n) => {
  if (game.settings.get("action-pack-enhanced", "use-control-button") && !ce()) {
    const e = n.tokens.tools;
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
function de() {
  const n = $("#ape-app");
  Mt() && (canvas.tokens.controlled.filter((t) => {
    var a;
    return ["character", "npc"].includes((a = t.actor) == null ? void 0 : a.type);
  }).length ? n.addClass("is-open") : n.removeClass("is-open")), ce() ? n.addClass("is-open always-on") : n.removeClass("always-on"), le(), C();
}
async function C() {
  se || (se = new ct());
  const n = X(), e = se.build(n, {
    /* scrollPosition stub */
  });
  function t(g, m) {
    return g && [m, g].join("-");
  }
  const a = t(game.settings.get("action-pack-enhanced", "icon-size"), "icon"), s = t(game.settings.get("action-pack-enhanced", "tray-size"), "tray"), i = game.settings.get("action-pack-enhanced", "show-spell-dots"), r = game.settings.get("action-pack-enhanced", "show-spell-uses"), o = game.settings.get("action-pack-enhanced", "show-weapon-mastery"), l = game.settings.get("action-pack-enhanced", "static-info"), d = Object.entries(CONFIG.DND5E.abilities), p = [
    d.slice(0, 3).map(([g, m]) => ({ key: g, label: m.label })),
    d.slice(3, 6).map(([g, m]) => ({ key: g, label: m.label }))
  ], c = document.querySelector("#ape-app");
  Array.from(c.classList).forEach((g) => {
    (g.startsWith("tray-") || g.startsWith("icon-")) && c.classList.remove(g);
  }), c.classList.add(a), c.classList.add(s), c && (c.data = {
    actors: e
  }, c.globalData = {
    abilityColumns: p,
    showSpellDots: i,
    showSpellUses: r,
    showWeaponMastery: o,
    staticInfo: l
  });
}
Hooks.on("dnd5e.getItemContextOptions", (n, e) => {
  var t;
  (t = n.system.activation) != null && t.type && n.system.activation.type !== "none" && (n.getFlag("action-pack-enhanced", "hidden") ? e.push({
    name: game.i18n.localize("action-pack-enhanced.item-context.show"),
    icon: "<i class='fas fa-eye'></i>",
    callback: async () => {
      await n.setFlag("action-pack-enhanced", "hidden", !1), C();
    }
  }) : e.push({
    name: game.i18n.localize("action-pack-enhanced.item-context.hide"),
    icon: "<i class='fas fa-eye-slash'></i>",
    callback: async () => {
      await n.setFlag("ape", "hidden", !0), C();
    }
  }));
});
Hooks.on("dropCanvasData", (n, e) => {
  var t;
  if (e.type === "ActionPackItem" && e.uuid) {
    const a = Rt(e.uuid);
    if (!a) return;
    const s = n.tokens.placeables.find((i) => e.x >= i.x && e.x <= i.x + i.w && e.y >= i.y && e.y <= i.y + i.h);
    if (s) {
      const i = (t = a.system) == null ? void 0 : t.activities;
      if (!i) return;
      (i.contents[0].target.affects.count || 1) === 1 && s.setTarget(!0, { user: game.user, releaseOthers: !0, groupSelection: !0 });
    }
    return a.use(), !1;
  }
});
export {
  jt as fudgeToActor
};
//# sourceMappingURL=ape.mjs.map
