var De = Object.defineProperty;
var Ne = (i, e, t) => e in i ? De(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var C = (i, e, t) => Ne(i, typeof e != "symbol" ? e + "" : e, t);
class ze {
  constructor() {
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
  /**
   * Performs a Long Rest
   * @param {Actor} actor 
   */
  async longRest(e) {
    if (e)
      return e.longRest();
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
function F(i) {
  return i == null ? "0" : `${i >= 0 ? "+" : ""}${i}`;
}
function Me(i) {
  const e = je(i), t = Be(i), s = Le(i);
  return { castingTime: e, range: t, duration: s };
}
function je(i) {
  var s, a, n, o;
  const e = ((a = (s = i.system) == null ? void 0 : s.activation) == null ? void 0 : a.type) || "", t = ((o = (n = i.system) == null ? void 0 : n.activation) == null ? void 0 : o.value) || "";
  return t === "" && e !== "" ? game.i18n.localize(`action-pack-enhanced.action-type.${e}`) : t && e ? `${t} ${e.charAt(0).toUpperCase() + e.slice(1)}` : "";
}
function Be(i) {
  var a, n, o, r, l, c, p, u;
  const e = ((n = (a = i.system) == null ? void 0 : a.range) == null ? void 0 : n.long) || null, t = (r = (o = i.system) == null ? void 0 : o.range) == null ? void 0 : r.units;
  let s;
  return t !== "touch" && t !== "self" ? s = ((c = (l = i.system) == null ? void 0 : l.range) == null ? void 0 : c.value) || ((u = (p = i.system) == null ? void 0 : p.range) == null ? void 0 : u.reach) || 5 : s = null, s && e && t ? `${s} ${t} / ${e} ${t}` : s && t ? `${s} ${t}` : t ? game.i18n.localize(`action-pack-enhanced.range.${t}`) : "";
}
function Le(i) {
  var s, a, n, o;
  const e = (a = (s = i.system) == null ? void 0 : s.duration) == null ? void 0 : a.value, t = (o = (n = i.system) == null ? void 0 : n.duration) == null ? void 0 : o.units;
  return e && t ? `${e} ${e > 1 ? t + "s" : t}` : t ? game.i18n.localize(`action-pack-enhanced.duration.${t}`) : "";
}
function qe(i) {
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
      for (let u = 0; u < a.length; u++)
        c.classes[p].subclass.name = a[u].name;
    }
    e = c;
  }
  let o = `${e.race}, `;
  for (let c = 0; c < e.classes.length; c++)
    o += `<span class="ape-actor-class">${e.classes[c].name}(${e.classes[c].level})</span>`, e.classes[c].subclass.name !== "" && (o += `<span class="ape-actor-subclass"> - ${e.classes[c].subclass.name}</span>`), c < e.classes.length - 1 && (o += ", ");
  return o;
}
const Fe = (i) => {
  const e = i.system, t = e.consume;
  if (t && t.target)
    return Xe(i.actor, t);
  const s = e.uses;
  if (s && (s.max > 0 || s.value > 0))
    return Ae(e);
  const a = i.type;
  return a === "feat" ? We() : a === "consumable" ? {
    available: e.quantity
  } : a === "weapon" ? Ke(e) : null;
};
function Xe(i, e) {
  let t = null, s = null;
  if (e.type === "attribute") {
    const a = getProperty(i.system, e.target);
    typeof a == "number" ? t = a : t = 0;
  } else if (e.type === "ammo" || e.type === "material") {
    const a = i.items.get(e.target);
    a ? t = a.system.quantity : t = 0;
  } else if (e.type === "charges") {
    const a = i.items.get(e.target);
    a ? { available: t, maximum: s } = Ae(a.system) : t = 0;
  }
  return t !== null ? (e.amount > 1 && (t = Math.floor(t / e.amount), s !== null && (s = Math.floor(s / e.amount))), { available: t, maximum: s }) : null;
}
function Ae(i) {
  let e = i.uses.value, t = i.uses.max;
  const s = i.quantity;
  return s && (e = e + (s - 1) * t, t = t * s), { available: e, maximum: t };
}
function We(i) {
  return null;
}
function Ke(i) {
  return i.properties.thr && !i.properties.ret ? { available: i.quantity, maximum: null } : null;
}
class Ve {
  constructor() {
  }
  build(e, t) {
    return this.settingShowNoUses = game.settings.get("action-pack-enhanced", "show-no-uses"), this.settingShowUnpreparedCantrips = game.settings.get("action-pack-enhanced", "show-unprepared-cantrips"), this.settingShowUnpreparedSpells = game.settings.get("action-pack-enhanced", "show-unprepared-spells"), this.settingSkillMode = game.settings.get("action-pack-enhanced", "skill-mode"), this.settingSortAlphabetically = game.settings.get("action-pack-enhanced", "sort-alphabetic"), e.map((s) => this.prepareActor(s, t));
  }
  prepareActor(e, t) {
    var m;
    const s = e.system, a = !!e.itemTypes.feat.find((g) => g.name === "Ritual Adept");
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
          ...[...Array(10).keys()].reduce((g, f) => (g[`spell${f}`] = { items: [], title: `action-pack-enhanced.category.spell${f}` }, g), {})
        }
      },
      passive: { items: [], title: "action-pack-enhanced.category.passive" }
    };
    const o = ["consumable", "container", "equipment", "feat", "loot", "spell", "tool", "weapon"];
    for (const [g, f] of Object.entries(e.itemTypes))
      if (o.includes(g))
        for (const M of f)
          this._processItem(M, g, n, e, a);
    const r = (m = game.combat) == null ? void 0 : m.combatants.find((g) => g.actor === e), l = r && !r.initiative;
    let c = !1;
    const { uuid: p, showSkills: u } = t || {};
    return e.uuid === p && u && (c = !0), {
      actor: e,
      name: e.name,
      sections: this.addSpellLevelUses(this.sortItems(this.removeEmptySections(n)), s),
      needsInitiative: l,
      skills: CONFIG.DND5E.skills,
      skillMode: this.settingSkillMode,
      showSkills: c
    };
  }
  _processItem(e, t, s, a, n) {
    var u;
    const o = e.system, r = Fe(e), l = this.settingShowNoUses || !r || r.available, c = ((u = o == null ? void 0 : o.activities) == null ? void 0 : u.size) > 0, p = e.getFlag("action-pack-enhanced", "hidden");
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
        const l = (t == null ? void 0 : t.prepared) === 1, c = (t == null ? void 0 : t.prepared) === 2, p = n && ((r = t.properties) == null ? void 0 : r.has("ritual")), u = t.level == 0 && this.settingShowUnpreparedCantrips, m = t.level > 0 && this.settingShowUnpreparedSpells;
        (c || l || p || u || m) && a.spell.groups[`spell${t.level}`].items.push({ item: e, uses: s });
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
function Ge(i) {
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
const j = globalThis, Q = j.ShadowRoot && (j.ShadyCSS === void 0 || j.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Se = Symbol(), pe = /* @__PURE__ */ new WeakMap();
let Je = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== Se) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (Q && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = pe.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && pe.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ze = (i) => new Je(typeof i == "string" ? i : i + "", void 0, Se), Qe = (i, e) => {
  if (Q) i.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), a = j.litNonce;
    a !== void 0 && s.setAttribute("nonce", a), s.textContent = t.cssText, i.appendChild(s);
  }
}, he = Q ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return Ze(t);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ye, defineProperty: et, getOwnPropertyDescriptor: tt, getOwnPropertyNames: st, getOwnPropertySymbols: at, getPrototypeOf: it } = Object, b = globalThis, ue = b.trustedTypes, nt = ue ? ue.emptyScript : "", X = b.reactiveElementPolyfillSupport, P = (i, e) => i, J = { toAttribute(i, e) {
  switch (e) {
    case Boolean:
      i = i ? nt : null;
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
} }, we = (i, e) => !Ye(i, e), de = { attribute: !0, type: String, converter: J, reflect: !1, useDefault: !1, hasChanged: we };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), b.litPropertyMetadata ?? (b.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let E = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = de) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = Symbol(), a = this.getPropertyDescriptor(e, s, t);
      a !== void 0 && et(this.prototype, e, a);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: a, set: n } = tt(this.prototype, e) ?? { get() {
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
    return this.elementProperties.get(e) ?? de;
  }
  static _$Ei() {
    if (this.hasOwnProperty(P("elementProperties"))) return;
    const e = it(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(P("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(P("properties"))) {
      const t = this.properties, s = [...st(t), ...at(t)];
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
      for (const a of s) t.unshift(he(a));
    } else e !== void 0 && t.push(he(e));
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
    return Qe(e, this.constructor.elementStyles), e;
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
      const o = (((n = s.converter) == null ? void 0 : n.toAttribute) !== void 0 ? s.converter : J).toAttribute(t, s.type);
      this._$Em = e, o == null ? this.removeAttribute(a) : this.setAttribute(a, o), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var n, o;
    const s = this.constructor, a = s._$Eh.get(e);
    if (a !== void 0 && this._$Em !== a) {
      const r = s.getPropertyOptions(a), l = typeof r.converter == "function" ? { fromAttribute: r.converter } : ((n = r.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? r.converter : J;
      this._$Em = a;
      const c = l.fromAttribute(t, r.type);
      this[a] = c ?? ((o = this._$Ej) == null ? void 0 : o.get(a)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, t, s, a = !1, n) {
    var o;
    if (e !== void 0) {
      const r = this.constructor;
      if (a === !1 && (n = this[e]), s ?? (s = r.getPropertyOptions(e)), !((s.hasChanged ?? we)(n, t) || s.useDefault && s.reflect && n === ((o = this._$Ej) == null ? void 0 : o.get(e)) && !this.hasAttribute(r._$Eu(e, s)))) return;
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
E.elementStyles = [], E.shadowRootOptions = { mode: "open" }, E[P("elementProperties")] = /* @__PURE__ */ new Map(), E[P("finalized")] = /* @__PURE__ */ new Map(), X == null || X({ ReactiveElement: E }), (b.reactiveElementVersions ?? (b.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const U = globalThis, ge = (i) => i, B = U.trustedTypes, me = B ? B.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, xe = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, Ce = "?" + v, ot = `<${Ce}>`, w = document, I = () => w.createComment(""), R = (i) => i === null || typeof i != "object" && typeof i != "function", Y = Array.isArray, rt = (i) => Y(i) || typeof (i == null ? void 0 : i[Symbol.iterator]) == "function", W = `[ 	
\f\r]`, T = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, fe = /-->/g, ye = />/g, k = RegExp(`>|${W}(?:([^\\s"'>=/]+)(${W}*=${W}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), $e = /'/g, ve = /"/g, Ee = /^(?:script|style|textarea|title)$/i, lt = (i) => (e, ...t) => ({ _$litType$: i, strings: e, values: t }), d = lt(1), x = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), be = /* @__PURE__ */ new WeakMap(), A = w.createTreeWalker(w, 129);
function Oe(i, e) {
  if (!Y(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return me !== void 0 ? me.createHTML(e) : e;
}
const ct = (i, e) => {
  const t = i.length - 1, s = [];
  let a, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = T;
  for (let r = 0; r < t; r++) {
    const l = i[r];
    let c, p, u = -1, m = 0;
    for (; m < l.length && (o.lastIndex = m, p = o.exec(l), p !== null); ) m = o.lastIndex, o === T ? p[1] === "!--" ? o = fe : p[1] !== void 0 ? o = ye : p[2] !== void 0 ? (Ee.test(p[2]) && (a = RegExp("</" + p[2], "g")), o = k) : p[3] !== void 0 && (o = k) : o === k ? p[0] === ">" ? (o = a ?? T, u = -1) : p[1] === void 0 ? u = -2 : (u = o.lastIndex - p[2].length, c = p[1], o = p[3] === void 0 ? k : p[3] === '"' ? ve : $e) : o === ve || o === $e ? o = k : o === fe || o === ye ? o = T : (o = k, a = void 0);
    const g = o === k && i[r + 1].startsWith("/>") ? " " : "";
    n += o === T ? l + ot : u >= 0 ? (s.push(c), l.slice(0, u) + xe + l.slice(u) + v + g) : l + v + (u === -2 ? r : g);
  }
  return [Oe(i, n + (i[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class H {
  constructor({ strings: e, _$litType$: t }, s) {
    let a;
    this.parts = [];
    let n = 0, o = 0;
    const r = e.length - 1, l = this.parts, [c, p] = ct(e, t);
    if (this.el = H.createElement(c, s), A.currentNode = this.el.content, t === 2 || t === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (a = A.nextNode()) !== null && l.length < r; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const u of a.getAttributeNames()) if (u.endsWith(xe)) {
          const m = p[o++], g = a.getAttribute(u).split(v), f = /([.?@])?(.*)/.exec(m);
          l.push({ type: 1, index: n, name: f[2], strings: g, ctor: f[1] === "." ? ht : f[1] === "?" ? ut : f[1] === "@" ? dt : q }), a.removeAttribute(u);
        } else u.startsWith(v) && (l.push({ type: 6, index: n }), a.removeAttribute(u));
        if (Ee.test(a.tagName)) {
          const u = a.textContent.split(v), m = u.length - 1;
          if (m > 0) {
            a.textContent = B ? B.emptyScript : "";
            for (let g = 0; g < m; g++) a.append(u[g], I()), A.nextNode(), l.push({ type: 2, index: ++n });
            a.append(u[m], I());
          }
        }
      } else if (a.nodeType === 8) if (a.data === Ce) l.push({ type: 2, index: n });
      else {
        let u = -1;
        for (; (u = a.data.indexOf(v, u + 1)) !== -1; ) l.push({ type: 7, index: n }), u += v.length - 1;
      }
      n++;
    }
  }
  static createElement(e, t) {
    const s = w.createElement("template");
    return s.innerHTML = e, s;
  }
}
function O(i, e, t = i, s) {
  var o, r;
  if (e === x) return e;
  let a = s !== void 0 ? (o = t._$Co) == null ? void 0 : o[s] : t._$Cl;
  const n = R(e) ? void 0 : e._$litDirective$;
  return (a == null ? void 0 : a.constructor) !== n && ((r = a == null ? void 0 : a._$AO) == null || r.call(a, !1), n === void 0 ? a = void 0 : (a = new n(i), a._$AT(i, t, s)), s !== void 0 ? (t._$Co ?? (t._$Co = []))[s] = a : t._$Cl = a), a !== void 0 && (e = O(i, a._$AS(i, e.values), a, s)), e;
}
class pt {
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
    const { el: { content: t }, parts: s } = this._$AD, a = ((e == null ? void 0 : e.creationScope) ?? w).importNode(t, !0);
    A.currentNode = a;
    let n = A.nextNode(), o = 0, r = 0, l = s[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let c;
        l.type === 2 ? c = new N(n, n.nextSibling, this, e) : l.type === 1 ? c = new l.ctor(n, l.name, l.strings, this, e) : l.type === 6 && (c = new gt(n, this, e)), this._$AV.push(c), l = s[++r];
      }
      o !== (l == null ? void 0 : l.index) && (n = A.nextNode(), o++);
    }
    return A.currentNode = w, a;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class N {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, s, a) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = a, this._$Cv = (a == null ? void 0 : a.isConnected) ?? !0;
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
    e = O(this, e, t), R(e) ? e === h || e == null || e === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : e !== this._$AH && e !== x && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : rt(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== h && R(this._$AH) ? this._$AA.nextSibling.data = e : this.T(w.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var n;
    const { values: t, _$litType$: s } = e, a = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = H.createElement(Oe(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === a) this._$AH.p(t);
    else {
      const o = new pt(a, this), r = o.u(this.options);
      o.p(t), this.T(r), this._$AH = o;
    }
  }
  _$AC(e) {
    let t = be.get(e.strings);
    return t === void 0 && be.set(e.strings, t = new H(e)), t;
  }
  k(e) {
    Y(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, a = 0;
    for (const n of e) a === t.length ? t.push(s = new N(this.O(I()), this.O(I()), this, this.options)) : s = t[a], s._$AI(n), a++;
    a < t.length && (this._$AR(s && s._$AB.nextSibling, a), t.length = a);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, t); e !== this._$AB; ) {
      const a = ge(e).nextSibling;
      ge(e).remove(), e = a;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class q {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, a, n) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = e, this.name = t, this._$AM = a, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = h;
  }
  _$AI(e, t = this, s, a) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) e = O(this, e, t, 0), o = !R(e) || e !== this._$AH && e !== x, o && (this._$AH = e);
    else {
      const r = e;
      let l, c;
      for (e = n[0], l = 0; l < n.length - 1; l++) c = O(this, r[s + l], t, l), c === x && (c = this._$AH[l]), o || (o = !R(c) || c !== this._$AH[l]), c === h ? e = h : e !== h && (e += (c ?? "") + n[l + 1]), this._$AH[l] = c;
    }
    o && !a && this.j(e);
  }
  j(e) {
    e === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class ht extends q {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === h ? void 0 : e;
  }
}
class ut extends q {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== h);
  }
}
class dt extends q {
  constructor(e, t, s, a, n) {
    super(e, t, s, a, n), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = O(this, e, t, 0) ?? h) === x) return;
    const s = this._$AH, a = e === h && s !== h || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, n = e !== h && (s === h || a);
    a && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class gt {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    O(this, e);
  }
}
const K = U.litHtmlPolyfillSupport;
K == null || K(H, N), (U.litHtmlVersions ?? (U.litHtmlVersions = [])).push("3.3.2");
const mt = (i, e, t) => {
  const s = (t == null ? void 0 : t.renderBefore) ?? e;
  let a = s._$litPart$;
  if (a === void 0) {
    const n = (t == null ? void 0 : t.renderBefore) ?? null;
    s._$litPart$ = a = new N(e.insertBefore(I(), n), n, void 0, t ?? {});
  }
  return a._$AI(i), a;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const S = globalThis;
let y = class extends E {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = mt(t, this.renderRoot, this.renderOptions);
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
    return x;
  }
};
var ke;
y._$litElement$ = !0, y.finalized = !0, (ke = S.litElementHydrateSupport) == null || ke.call(S, { LitElement: y });
const V = S.litElementPolyfillSupport;
V == null || V({ LitElement: y });
(S.litElementVersions ?? (S.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ft = { CHILD: 2 }, yt = (i) => (...e) => ({ _$litDirective$: i, values: e });
class $t {
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
class Z extends $t {
  constructor(e) {
    if (super(e), this.it = h, e.type !== ft.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(e) {
    if (e === h || e == null) return this._t = void 0, this.it = e;
    if (e === x) return e;
    if (typeof e != "string") throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (e === this.it) return this._t;
    this.it = e;
    const t = [e];
    return t.raw = t, this._t = { _$litType$: this.constructor.resultType, strings: t, values: [] };
  }
}
Z.directiveName = "unsafeHTML", Z.resultType = 1;
const vt = yt(Z);
class Te extends y {
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
    if (e.shiftKey) {
      this.api.rollItem(this.item, e);
      return;
    }
    this.expanded = !this.expanded, this.expanded && !this.description && (this.description = await this.api.getItemDescription(this.item));
  }
  render() {
    var M, ie, ne, oe, re, le, ce;
    if (!this.item) return h;
    const e = this.item.system, t = e.rarity || "", s = this.item.type === "spell", a = e.method === "innate", n = this.uses && (!s || a), o = (M = e.properties) == null ? void 0 : M.has("ritual"), r = (ie = e.properties) == null ? void 0 : ie.has("concentration"), l = ((ne = e.activation) == null ? void 0 : ne.type) === "bonus", c = ((oe = e.activation) == null ? void 0 : oe.type) === "reaction", p = ((re = e.activation) == null ? void 0 : re.type) === "legendary", u = (le = e.recharge) == null ? void 0 : le.value, m = (ce = e.recharge) == null ? void 0 : ce.charged, g = !!this.item.parent.itemTypes.feat.find((He) => He.name === "Ritual Adept"), f = e.prepared === 0 && !(o && g);
    return d`
            <div class="item-name rollable flexrow ${f ? "unprepared" : ""}">
                <div class="item-image ${t}${f ? " unprepared" : ""}" 
                        style="background-image: url('${this.item.img}')"
                        @mousedown="${this._onRoll}">
                    <i class="fa fa-dice-d20"></i>
                </div>
                
                <h4 @mousedown="${this._onClick}">
                    <span class="item-text ${t}">${this.item.name}</span>
                    ${n ? d` (${this.uses.available}${this.uses.maximum ? "/" + this.uses.maximum : ""})` : h}
                </h4>

                ${o ? d`<div class="ritual flag" title="${game.i18n.localize("action-pack-enhanced.flag.ritual-title")}"></div>` : h}
                ${r ? d`<div class="concentration flag" title="${game.i18n.localize("action-pack-enhanced.flag.concentration-title")}"></div>` : h}
                ${l ? d`<div class="bonus flag" title="${game.i18n.localize("action-pack-enhanced.flag.bonus-title")}">${game.i18n.localize("action-pack-enhanced.flag.bonus")}</div>` : h}
                ${c ? d`<div class="reaction flag" title="${game.i18n.localize("action-pack-enhanced.flag.reaction-title")}">${game.i18n.localize("action-pack-enhanced.flag.reaction")}</div>` : h}
                ${p ? d`<div class="legendary flag" title="${game.i18n.localize("action-pack-enhanced.flag.legendary-title")}">${game.i18n.localize("action-pack-enhanced.flag.legendary")}</div>` : h}

                ${u ? m ? d`<div class="flag"><i class="fas fa-bolt"></i></div>` : d`<div class="flag"><a class="rollable item-recharge" @mousedown="${this._onRecharge}"><i class="fas fa-dice-six"></i> ${e.recharge.value}+</a></div>` : h}

                ${f ? d`<div class="unprepared flag" title="${game.i18n.localize("action-pack-enhanced.flag.unprepared-title")}">${game.i18n.localize("action-pack-enhanced.flag.unprepared")}</div>` : h}
            </div>
            
            <div class="item-drag-handle" 
                    draggable="true" 
                    title="${game.i18n.localize("action-pack-enhanced.drag-to-target")}"
                    @dragstart="${this._onDragStart}">
                <i class="fas fa-grip-vertical"></i>
            </div>

            ${this.expanded ? d`
                <div class="item-summary" style="display:block">
                    ${this._renderItemDetails()}
                    ${this.description ? d`<p>${vt(this.description.description)}</p>` : d`<i class="fas fa-spinner fa-spin"></i>`}
                </div>
            ` : h}
        `;
  }
  _renderItemDetails() {
    const e = Me(this.item);
    return d`
            ${e.castingTime ? d`<p><strong>Casting Time:</strong> ${e.castingTime}</p>` : h}
            ${e.range ? d`<p><strong>Range:</strong> ${e.range}</p>` : h}
            ${e.duration ? d`<p><strong>Duration:</strong> ${e.duration}</p>` : h}
        `;
  }
}
C(Te, "properties", {
  item: { type: Object },
  uses: { type: Object },
  api: { type: Object },
  expanded: { type: Boolean, state: !0 },
  description: { type: Object, state: !0 }
});
customElements.define("ape-item", Te);
class Pe extends y {
  constructor() {
    super(), this.isOpen = !0;
  }
  createRenderRoot() {
    return this;
  }
  updated(e) {
    e.has("isOpen") && this.classList.toggle("is-open", this.isOpen);
  }
  _toggleOpen(e) {
    e.stopPropagation(), this.isOpen = !this.isOpen;
  }
  render() {
    return d`
            ${this.title ? d`
                <h2 @click="${this._toggleOpen}">
                    <i class="fas fa-caret-down"></i> ${game.i18n.localize(this.title)}
                </h2>
            ` : h}

            ${this.items && this.items.length > 0 ? d`
                <div class="ape-items">
                    ${this.items.map((e) => d`
                        <ape-item class="ape-item item" data-item-uuid="${e.item.uuid}" .item="${e.item}" .uses="${e.uses}" .api="${this.api}"></ape-item>
                    `)}
                </div>
            ` : h}

            ${this.groups ? Object.entries(this.groups).map(([e, t]) => d`
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
C(Pe, "properties", {
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
  actor: { type: Object }
});
customElements.define("ape-section", Pe);
class Ue extends y {
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
    if (!this.group) return h;
    const { items: e, uses: t, title: s } = this.group, a = e && e.length > 0, n = t && t.maximum;
    if (!a && !n) return h;
    const o = n && this.showSpellDots, r = t && this.showSpellUses, l = [
      "flexrow",
      "ape-group-header",
      o ? "has-dots" : "",
      r ? "has-uses" : ""
    ].filter(Boolean).join(" ");
    return d`
            <div class="${l}" @click="${this._toggleOpen}">
                <h3>
                    <i class="fas fa-caret-down"></i> ${game.i18n.localize(s)}
                </h3>
                ${o ? this._renderDots(t) : h}
                ${r ? d`<div class="group-uses">${t.available}/${t.maximum}</div>` : h}
            </div>

            ${a ? d`
                <div class="ape-items">
                    ${e.map((c) => d`
                        <ape-item class="ape-item item" data-item-uuid="${c.item.uuid}" .item="${c.item}" .uses="${c.uses}" .api="${this.api}"></ape-item>
                    `)}
                </div>
            ` : h}
        `;
  }
  _renderDots(e) {
    return d`
            <div class="group-dots" data-group-name="${this.groupName}">
                ${Array.from({ length: e.maximum }).map((t, s) => d`
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
C(Ue, "properties", {
  group: { type: Object },
  groupName: { type: String },
  api: { type: Object },
  actor: { type: Object },
  showSpellDots: { type: Boolean },
  showSpellUses: { type: Boolean },
  isOpen: { type: Boolean, state: !0 }
});
customElements.define("ape-group", Ue);
class Ie extends y {
  createRenderRoot() {
    return this;
  }
  updated(e) {
    e.has("actorData") && this.actorData && (this.dataset.actorUuid = this.actorData.actor.uuid);
  }
  render() {
    if (!this.actorData) return h;
    const { actor: e, name: t, sections: s, needsInitiative: a, skillMode: n, showSkills: o } = this.actorData, r = e.system.attributes.hp, l = e.system.attributes.ac.value, c = e.type, p = r.value <= 0 && c === "character";
    return d`
            <div class="ape-actor-header">
                <h1>
                    <a class="ape-actor-name" @click="${(u) => this.api.openSheet(e)}">${t.split(" ")[0]}</a>
                    <span class="ape-actor-ac">
                        <img class="ape-actor-ac-icon" src="/modules/action-pack-enhanced/images/ac-icon.svg">
                        <span class="ape-actor-ac-display">${l}</span>
                    </span>
                </h1>

                ${c === "character" ? d`
                    <div class="ape-actor-race-class">
                        ${this._renderRaceClass(e)}
                    </div>
                ` : h}

                ${game.settings.get("action-pack-enhanced", "show-xp-info") && c === "character" ? this._renderExperience(e) : h}

                <div class="ape-actor-rest-buttons">
                    <button class="ape-actor-rest-button" @click="${() => this.api.shortRest(e)}"><span class="fas fa-fork-knife"></span></button>
                    <button class="ape-actor-rest-button" @click="${() => this.api.longRest(e)}"><span class="fas fa-tent"></span></button>
                </div>

                ${this._renderHpBar(e, r)}
                
            </div>

            ${p ? this._renderDeathSaves(e) : h}

            ${a ? d`
                <div class="ape-initiative" @click="${() => this.api.rollInitiative(e)}">
                    <i class="fas fa-swords ape-initiative-icon"></i>
                    <span class="ape-initiative-text">${game.i18n.localize("action-pack-enhanced.roll-initiative")}</span>
                </div>
            ` : h}

            ${this._renderAbilities(e)}

            ${n === "dropdown" ? this._renderSkills(e, o, !0) : h}

            <!-- Sections -->
            ${this._renderSections(e, s)}

            ${n === "append" ? this._renderSkills(e, o, !1) : h}
        `;
  }
  _renderExperience(e) {
    const t = e.system.details, s = t.xp.pct, a = t.xp.max;
    t.xp.min;
    const n = t.xp.value;
    return d`
            <div class="ape-actor-xp">
                <div class="ape-actor-xp-bar" style="--bar-percent: ${s}%"></div>
                <div class="ape-actor-xp-info">
                    <span class="ape-actor-xp-current" @click="${this._toggleXpActions}">${n}</span>
                    <span class="ape-actor-xp-separator">/</span>
                    <span class="ape-actor-xp-max">${a}</span>
                </div>
                <div class="ape-actor-xp-actions ${this._xpActionsOpen ? "active" : "inactive"}">
                    <button class="ape-actor-xp-close" @click="${this._toggleXpActions}">close</button>
                    <p>Choose an amount to add to or subtract from ${e.name}'s XP</p>
                    <div class="ape-actor-xp-increment">
                        <button class="ape-actor-xp-button" @click="${() => this.api.updateXP(e, n + 1)}">+1</button>
                        <button class="ape-actor-xp-button" @click="${() => this.api.updateXP(e, n + 10)}">+10</button>
                        <button class="ape-actor-xp-button" @click="${() => this.api.updateXP(e, n + 100)}">+100</button>
                        <button class="ape-actor-xp-button" @click="${() => this.api.updateXP(e, n + 1e3)}">+1000</button>
                    </div>
                    <div class="ape-actor-xp-decrement">
                        <button class="ape-actor-xp-button" @click="${() => this.api.updateXP(e, n - 1)}">-1</button>
                        <button class="ape-actor-xp-button" @click="${() => this.api.updateXP(e, n - 10)}">-10</button>
                        <button class="ape-actor-xp-button" @click="${() => this.api.updateXP(e, n - 100)}">-100</button>
                        <button class="ape-actor-xp-button" @click="${() => this.api.updateXP(e, n - 1e3)}">-1000</button>
                    </div>
                    <div class="ape-actor-xp-max">
                        <button class="ape-actor-xp-button" @click="${() => this.api.updateXP(e, a)}">Max</button>
                    </div>
                </div>
            </div>
        `;
  }
  _toggleXpActions() {
    this._xpActionsOpen = !this._xpActionsOpen;
  }
  _renderRaceClass(e) {
    const t = qe(e);
    return d`<div style="display:contents" .innerHTML="${t.replace(/,/g, "<br />")}"></div>`;
  }
  _renderHpBar(e, t) {
    const s = Math.min(100, Math.max(0, t.value / t.max * 100));
    return d`
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
    return d`
            <div class="ape-abilities">
                ${t.map((s) => d`
                    <div class="flex-col">
                        <span class="ape-ability">
                             <span class="ape-ability-label">&nbsp;</span>
                             <span class="ape-ability-hdr">check</span>
                             <span class="ape-ability-hdr">save</span>
                        </span>
                        ${s.map((a) => {
      const n = e.system.abilities[a.key];
      return d`
                                <span class="ape-ability">
                                    <span class="ape-ability-label">${a.key}</span>
                                    <a class="fas fa-dice-d20 ape-ability-check" 
                                       title="${a.label} check"
                                       @click="${(o) => this.api.rollAbilityCheck(e, a.key, o)}">
                                        <span class="ape-ability-text">${F(n.mod)}</span>
                                    </a>
                                    <a class="fas fa-dice-d20 ape-ability-save" 
                                       title="${a.label} saving throw"
                                       @click="${(o) => this.api.rollSavingThrow(e, a.key, o)}">
                                        <span class="ape-ability-text">${F(n.save.value)}</span>
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
    return d`
            <div class="ape-skill-container ${this.actorData.skillMode} ${t ? "is-open" : ""}">
                ${s ? d`
                    <h2 class="ape-skill-header" @click="${this._toggleSkills}">
                        <i class="fas fa-caret-down"></i> Skills
                    </h2>
                ` : h}

                <div class="ape-skills">
                    ${Object.keys(n).map((o) => {
      const r = n[o], l = a[o];
      if (!l) return h;
      let c = "far fa-circle";
      return r.proficient === 0.5 ? c = "fas fa-adjust" : r.proficient === 1 ? c = "fas fa-check" : r.proficient === 2 && (c = "fas fa-star"), d`
                            <div class="ape-skill-row flexrow ${r.proficient === 1 ? "proficient" : r.proficient === 2 ? "expert" : ""}"
                               @click="${(p) => this.api.rollSkill(e, o, p)}"
                               @contextmenu="${(p) => this.api.rollSkill(e, o, p, !0)}">
                                <span class="ape-skill-icon ${c}"></span>
                                <span class="ape-skill-ability">${r.ability}</span>
                                <span class="ape-skill-label">${l.label}</span>
                                <span class="ape-skill-bonus">${F(r.total)}</span>
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
    const t = e.system.attributes.death.failure, s = e.system.attributes.death.success, a = (o, r, l) => Array.from({ length: 3 }).map((c, p) => d`
                <span class="ape-death-dot ${p < o ? "filled" : ""}">
                    ${p < o ? d`<span class="fas ${l}"></span>` : h}
                </span>
             `), n = t < 3 && s < 3;
    return d`
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
      return n ? d`
                <ape-section 
                    class="ape-category"
                    .title="${n.title}" 
                    .items="${n.items}"
                    .groups="${n.groups}"
                    .sectionId="${a}"
                    .api="${this.api}"
                    .actor="${e}"
                    .showSpellDots="${this.globalData.showSpellDots}"
                    .showSpellUses="${this.globalData.showSpellUses}">
                </ape-section>
            ` : h;
    });
  }
}
C(Ie, "properties", {
  actorData: { type: Object },
  // The object returned by data-builder
  globalData: { type: Object },
  // Global settings/options
  api: { type: Object },
  _xpActionsOpen: { state: !1 }
});
customElements.define("ape-actor", Ie);
class Re extends y {
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
    if (!this.data) return h;
    const { actors: e } = this.data, t = !e || e.length === 0;
    return d`
            <div class="${[
      "ape-wrapper"
    ].join(" ")}" @scroll="${this._onScroll}">
                ${this._renderHeader()}

                <div class="ape-actors">
                    ${t ? d`
                        <div class="ape-empty-tray">
                            <i class="fas fa-dice-d20"></i>
                        </div>
                    ` : e.map((a) => d`
                        <ape-actor 
                            class="ape-actor"
                            .actorData="${a}"
                            .globalData="${this.globalData}"
                            .api="${this.api}">
                        </ape-actor>
                    `)}
                </div>

                <div class="ape-end-turn" @click="${() => this.api.endTurn()}">
                    ${game.i18n.localize("ape.end-turn")}
                </div>
            </div>
        `;
  }
  _renderHeader() {
    return h;
  }
}
C(Re, "properties", {
  data: { type: Object },
  // Contains actors
  globalData: { type: Object },
  // Contains abilityColumns, showSpellDots
  api: { type: Object }
});
customElements.define("ape-app", Re);
let L, D, _e, G;
function bt(i) {
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
function xt(i) {
  if (i instanceof CONFIG.Actor.documentClass)
    return i;
  if (i instanceof CONFIG.Token.documentClass)
    return i.object.actor;
}
function ee() {
  const i = canvas.tokens.controlled.map((t) => t.actor), e = document.querySelector("#ape-app");
  e && (game.combat && i.includes(D) ? e.classList.add("is-current-combatant") : e.classList.remove("is-current-combatant"));
}
Hooks.on("ready", () => {
  var i, e;
  if (!document.querySelector("#ape-app")) {
    const t = document.createElement("ape-app");
    t.id = "ape-app", t.classList.add("ape-container");
    const s = document.getElementById("interface");
    s && document.body.insertBefore(t, s), _e = new ze(), t.api = _e;
  }
  L = (e = (i = game.combat) == null ? void 0 : i.turns.find((t) => {
    var s;
    return t.id == ((s = game.combat) == null ? void 0 : s.current.combatantId);
  })) == null ? void 0 : e.actor, D = L, te() && $("#ape-app").addClass("is-open always-on"), ae();
});
function _t() {
  const i = game.settings.get("action-pack-enhanced", "tray-display");
  return i === "selected" || i === "auto";
}
function te() {
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
  ae();
});
Hooks.on("updateActor", (i) => {
  z().includes(i) && _();
});
function se(i) {
  z().includes(i.actor) && _();
}
Hooks.on("updateItem", (i) => {
  se(i);
});
Hooks.on("deleteItem", (i) => {
  se(i);
});
Hooks.on("createItem", (i) => {
  se(i);
});
Hooks.on("updateCombat", (i) => {
  var e;
  D = (e = i.turns.find((t) => t.id == i.current.combatantId)) == null ? void 0 : e.actor, ee(), L = D;
});
Hooks.on("createCombatant", (i) => {
  z().includes(i.actor) && _();
});
Hooks.on("updateCombatant", (i, e) => {
  z().includes(i.actor) && _();
});
Hooks.on("deleteCombat", (i) => {
  game.combat || (D = null, L = null, ee());
});
Hooks.on("init", () => {
  Ge({
    updateTray: _,
    updateTrayState: ae,
    resetScroll: () => {
      document.querySelector("ape-app");
    }
  });
});
Hooks.on("getSceneControlButtons", (i) => {
  if (game.settings.get("action-pack-enhanced", "use-control-button") && !te()) {
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
function ae() {
  const i = $("#ape-app");
  _t() && (canvas.tokens.controlled.filter((t) => {
    var s;
    return ["character", "npc"].includes((s = t.actor) == null ? void 0 : s.type);
  }).length ? i.addClass("is-open") : i.removeClass("is-open")), te() ? i.addClass("is-open always-on") : i.removeClass("always-on"), ee(), _();
}
async function _() {
  G || (G = new Ve());
  const i = z(), e = G.build(i, {
    /* scrollPosition stub */
  });
  function t(p, u) {
    return p && [u, p].join("-");
  }
  const s = t(game.settings.get("action-pack-enhanced", "icon-size"), "icon"), a = t(game.settings.get("action-pack-enhanced", "tray-size"), "tray"), n = game.settings.get("action-pack-enhanced", "show-spell-dots"), o = game.settings.get("action-pack-enhanced", "show-spell-uses"), r = Object.entries(CONFIG.DND5E.abilities), l = [
    r.slice(0, 3).map(([p, u]) => ({ key: p, label: u.label })),
    r.slice(3, 6).map(([p, u]) => ({ key: p, label: u.label }))
  ], c = document.querySelector("#ape-app");
  Array.from(c.classList).forEach((p) => {
    (p.startsWith("tray-") || p.startsWith("icon-")) && c.classList.remove(p);
  }), c.classList.add(s), c.classList.add(a), c && (c.data = {
    actors: e
  }, c.globalData = {
    abilityColumns: l,
    showSpellDots: n,
    showSpellUses: o
  });
}
Hooks.on("dnd5e.getItemContextOptions", (i, e) => {
  var t;
  (t = i.system.activation) != null && t.type && i.system.activation.type !== "none" && (i.getFlag("action-pack-enhanced", "hidden") ? e.push({
    name: game.i18n.localize("action-pack-enhanced.item-context.show"),
    icon: "<i class='fas fa-eye'></i>",
    callback: async () => {
      await i.setFlag("action-pack-enhanced", "hidden", !1), _();
    }
  }) : e.push({
    name: game.i18n.localize("action-pack-enhanced.item-context.hide"),
    icon: "<i class='fas fa-eye-slash'></i>",
    callback: async () => {
      await i.setFlag("ape", "hidden", !0), _();
    }
  }));
});
Hooks.on("dropCanvasData", (i, e) => {
  if (e.type === "ActionPackItem" && e.uuid) {
    const t = bt(e.uuid);
    if (!t) return;
    const s = i.tokens.placeables.find((a) => e.x >= a.x && e.x <= a.x + a.w && e.y >= a.y && e.y <= a.y + a.h);
    if (s)
      return s.setTarget(!0, { user: game.user, releaseOthers: !0, groupSelection: !1 }), t.use(), !1;
  }
});
export {
  xt as fudgeToActor
};
