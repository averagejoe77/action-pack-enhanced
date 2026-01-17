var He = Object.defineProperty;
var Ne = (a, e, t) => e in a ? He(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t;
var E = (a, e, t) => Ne(a, typeof e != "symbol" ? e + "" : e, t);
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
  async rollSkill(e, t, s, i = !1) {
    return e.rollSkill({ event: s, skill: t }, { fastForward: i });
  }
  /**
   * Adjusts Spell Slots
   * @param {Actor} actor 
   * @param {string} groupName 
   * @param {number} slotIndex 
   */
  async adjustSpellSlot(e, t, s) {
    var r, o;
    const i = s + 1, n = (o = (r = e.system.spells) == null ? void 0 : r[t]) == null ? void 0 : o.value;
    if (n !== void 0) {
      const l = `system.spells.${t}.value`, c = n !== i ? i : i - 1;
      return e.update({ [l]: c });
    }
  }
  /**
   * Rolls an Item
   * @param {Item} item 
   */
  async rollItem(e, t) {
    var s, i;
    if (e) {
      if (!((s = game.modules.get("wire")) != null && s.active) && ((i = game.modules.get("itemacro")) != null && i.active) && game.settings.get("itemacro", "defaultmacro") && e.hasMacro()) {
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
    var r, o, l, c;
    const t = await e.getChatData({ secrets: e.actor.isOwner }), s = ((o = (r = e.system) == null ? void 0 : r.activation) == null ? void 0 : o.type) || "", i = ((c = (l = e.system) == null ? void 0 : l.activation) == null ? void 0 : c.value) || "";
    let n = "";
    return i === "" ? n = s.charAt(0).toUpperCase() + s.slice(1) : i && s && (n = `${i} ${s.charAt(0).toUpperCase() + s.slice(1)}`), {
      description: t.description,
      properties: {
        castingTime: n,
        range: this._formatRange(e),
        duration: this._formatDuration(e)
      }
    };
  }
  _formatRange(e) {
    var i, n, r, o;
    const t = (n = (i = e.system) == null ? void 0 : i.range) == null ? void 0 : n.value, s = (o = (r = e.system) == null ? void 0 : r.range) == null ? void 0 : o.units;
    return t && s ? `${t} ${s}` : s || "";
  }
  _formatDuration(e) {
    var i, n, r, o;
    const t = (n = (i = e.system) == null ? void 0 : i.duration) == null ? void 0 : n.value, s = (o = (r = e.system) == null ? void 0 : r.duration) == null ? void 0 : o.units;
    return t && s ? `${t} ${s}` : s ? s === "inst" ? "Instantaneous" : s : "";
  }
}
function F(a) {
  return a == null ? "0" : `${a >= 0 ? "+" : ""}${a}`;
}
function Me(a) {
  const e = je(a), t = Be(a), s = Le(a);
  return { castingTime: e, range: t, duration: s };
}
function je(a) {
  var s, i, n, r;
  const e = ((i = (s = a.system) == null ? void 0 : s.activation) == null ? void 0 : i.type) || "", t = ((r = (n = a.system) == null ? void 0 : n.activation) == null ? void 0 : r.value) || "";
  return t === "" && e !== "" ? game.i18n.localize(`ape.action-type.${e}`) : t && e ? `${t} ${e.charAt(0).toUpperCase() + e.slice(1)}` : "";
}
function Be(a) {
  var s, i, n, r;
  const e = (i = (s = a.system) == null ? void 0 : s.range) == null ? void 0 : i.value, t = (r = (n = a.system) == null ? void 0 : n.range) == null ? void 0 : r.units;
  return e && t ? `${e} ${t}` : t ? game.i18n.localize(`ape.range.${t}`) : "";
}
function Le(a) {
  var s, i, n, r;
  const e = (i = (s = a.system) == null ? void 0 : s.duration) == null ? void 0 : i.value, t = (r = (n = a.system) == null ? void 0 : n.duration) == null ? void 0 : r.units;
  return e && t ? `${e} ${e > 1 ? t + "s" : t}` : t ? game.i18n.localize(`ape.duration.${t}`) : "";
}
function qe(a) {
  var r, o;
  let e = {}, t = a.race, s = a.class, i = a.subclass;
  if (s.length === i.length) {
    let l = { race: ((r = t[0]) == null ? void 0 : r.name) || "Unknown", classes: [] };
    for (let c = 0; c < s.length; c++)
      l.classes[c] = { name: s[c].name, level: s[c].system.levels, subclass: { name: i[c].name } };
    e = l;
  } else {
    let l = { race: ((o = t[0]) == null ? void 0 : o.name) || "Unknown", classes: [] };
    for (let c = 0; c < s.length; c++) {
      l.classes[c] = { name: s[c].name, level: s[c].system.levels, subclass: { name: "" } };
      for (let h = 0; h < i.length; h++)
        l.classes[c].subclass.name = i[h].name;
    }
    e = l;
  }
  let n = `${e.race}, `;
  for (let l = 0; l < e.classes.length; l++)
    n += `<span class="ape-actor-class">${e.classes[l].name}(${e.classes[l].level})</span>`, e.classes[l].subclass.name !== "" && (n += `<span class="ape-actor-subclass"> - ${e.classes[l].subclass.name}</span>`), l < e.classes.length - 1 && (n += ", ");
  return n;
}
const Fe = (a) => {
  const e = a.system, t = e.consume;
  if (t && t.target)
    return We(a.actor, t);
  const s = e.uses;
  if (s && (s.max > 0 || s.value > 0))
    return Se(e);
  const i = a.type;
  return i === "feat" ? Ke() : i === "consumable" ? {
    available: e.quantity
  } : i === "weapon" ? Ve(e) : null;
};
function We(a, e) {
  let t = null, s = null;
  if (e.type === "attribute") {
    const i = getProperty(a.system, e.target);
    typeof i == "number" ? t = i : t = 0;
  } else if (e.type === "ammo" || e.type === "material") {
    const i = a.items.get(e.target);
    i ? t = i.system.quantity : t = 0;
  } else if (e.type === "charges") {
    const i = a.items.get(e.target);
    i ? { available: t, maximum: s } = Se(i.system) : t = 0;
  }
  return t !== null ? (e.amount > 1 && (t = Math.floor(t / e.amount), s !== null && (s = Math.floor(s / e.amount))), { available: t, maximum: s }) : null;
}
function Se(a) {
  let e = a.uses.value, t = a.uses.max;
  const s = a.quantity;
  return s && (e = e + (s - 1) * t, t = t * s), { available: e, maximum: t };
}
function Ke(a) {
  return null;
}
function Ve(a) {
  return a.properties.thr && !a.properties.ret ? { available: a.quantity, maximum: null } : null;
}
class Ge {
  constructor() {
    this.settingShowNoUses = game.settings.get("ape", "show-no-uses"), this.settingShowUnpreparedCantrips = game.settings.get("ape", "show-unprepared-cantrips"), this.settingSkillMode = game.settings.get("ape", "skill-mode"), this.settingSortAlphabetically = game.settings.get("ape", "sort-alphabetic");
  }
  build(e, t) {
    return e.map((s) => this.prepareActor(s, t));
  }
  prepareActor(e, t) {
    var m;
    const s = e.system, i = !!e.itemTypes.feat.find((g) => g.name === "Ritual Adept");
    let n = {
      equipped: { items: [], title: "ape.category.equipped" },
      inventory: {
        title: "ape.category.inventory",
        groups: {
          weapon: { items: [], title: "ape.category.weapon" },
          equipment: { items: [], title: "ape.category.equipment" },
          consumable: { items: [], title: "ape.category.consumable" },
          other: { items: [], title: "ape.category.other" }
        }
      },
      feature: { items: [], title: "ape.category.feature", groups: this.systemFeatureGroups() },
      spell: {
        title: "ape.category.spell",
        groups: {
          innate: { items: [], title: "ape.category.innate" },
          atwill: { items: [], title: "ape.category.atwill" },
          pact: { items: [], title: "ape.category.pact" },
          ...[...Array(10).keys()].reduce((g, f) => (g[`spell${f}`] = { items: [], title: `ape.category.spell${f}` }, g), {})
        }
      },
      passive: { items: [], title: "ape.category.passive" }
    };
    const r = ["consumable", "container", "equipment", "feat", "loot", "spell", "tool", "weapon"];
    for (const [g, f] of Object.entries(e.itemTypes))
      if (r.includes(g))
        for (const M of f)
          this._processItem(M, g, n, e, i);
    const o = (m = game.combat) == null ? void 0 : m.combatants.find((g) => g.actor === e), l = o && !o.initiative;
    let c = !1;
    const { uuid: h, showSkills: d } = t || {};
    return e.uuid === h && d && (c = !0), {
      actor: e,
      name: e.name,
      sections: this.addSpellLevelUses(this.sortItems(this.removeEmptySections(n)), s),
      needsInitiative: l,
      skills: CONFIG.DND5E.skills,
      skillMode: this.settingSkillMode,
      showSkills: c
    };
  }
  _processItem(e, t, s, i, n) {
    var d;
    const r = e.system, o = Fe(e), l = this.settingShowNoUses || !o || o.available, c = ((d = r == null ? void 0 : r.activities) == null ? void 0 : d.size) > 0, h = e.getFlag("ape", "hidden");
    if (l && c && !h)
      switch (t) {
        case "feat":
          this._prepareFeat(e, r, o, s);
          break;
        case "spell":
          this._prepareSpell(e, r, o, s, n);
          break;
        case "weapon":
          this._prepareWeapon(e, r, o, s);
          break;
        case "equipment":
          this._prepareEquipment(e, r, o, s);
          break;
        case "consumable":
          this._prepareConsumable(e, r, o, s);
          break;
        case "facility":
          break;
        default:
          this._prepareOther(e, r, o, s);
          break;
      }
    else i.type === "npc" && s.passive.items.push({ item: e, uses: o });
  }
  _prepareFeat(e, t, s, i) {
    var o, l;
    const n = (o = t.type) == null ? void 0 : o.value, r = (l = t.type) == null ? void 0 : l.subtype;
    r && i.feature.groups[r] ? i.feature.groups[r].items.push({ item: e, uses: s }) : n && i.feature.groups[n] ? i.feature.groups[n].items.push({ item: e, uses: s }) : i.feature.items.push({ item: e, uses: s });
  }
  _prepareSpell(e, t, s, i, n) {
    var o, l, c;
    const r = (o = t == null ? void 0 : t.preparation) == null ? void 0 : o.mode;
    switch (r) {
      case "prepared":
      case "always":
        const h = r !== "prepared", d = (l = t == null ? void 0 : t.preparation) == null ? void 0 : l.prepared, m = n && ((c = t.properties) == null ? void 0 : c.has("ritual")), g = t.level == 0 && this.settingShowUnpreparedCantrips;
        (h || d || m || g) && i.spell.groups[`spell${t.level}`].items.push({ item: e, uses: s });
        break;
      case "atwill":
        i.spell.groups.atwill.items.push({ item: e, uses: s });
        break;
      case "innate":
        i.spell.groups.innate.items.push({ item: e, uses: s });
        break;
      case "pact":
        i.spell.groups.pact.items.push({ item: e, uses: s });
        break;
    }
  }
  _prepareWeapon(e, t, s, i) {
    t.equipped ? i.equipped.items.push({ item: e, uses: s }) : i.inventory.groups.weapon.items.push({ item: e, uses: s });
  }
  _prepareEquipment(e, t, s, i) {
    i.inventory.groups.equipment.items.push({ item: e, uses: s });
  }
  _prepareConsumable(e, t, s, i) {
    t.consumableType !== "ammo" && i.inventory.groups.consumable.items.push({ item: e, uses: s });
  }
  _prepareOther(e, t, s, i) {
    i.inventory.groups.other.items.push({ item: e, uses: s });
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
      const i = Object.keys(s);
      return i.includes("groups") && Object.values(s.groups).some((n) => t(n)) ? !0 : i.includes("items") ? !!s.items.length : Object.values(s).some((n) => t(n));
    };
    return Object.entries(e).reduce((s, [i, n]) => (t(n) && (s[i] = n), s), {});
  }
  addSpellLevelUses(e, t) {
    var s;
    for (let i = 1; i <= 9; i++) {
      const n = (s = e.spell) == null ? void 0 : s.groups[`spell${i}`];
      if (n) {
        const r = t.spells[`spell${i}`];
        n.uses = { available: r.value, maximum: r.max };
      }
    }
    return t.spells.pact.max && (e.spell.groups.pact.uses = {
      available: t.spells.pact.value,
      maximum: t.spells.pact.max
    }), e;
  }
  sortItems(e) {
    return Object.entries(e).forEach(([t, s]) => {
      t === "items" ? s.sort((i, n) => this.settingSortAlphabetically ? i.item.name.localeCompare(n.item.name) : i.item.sort - n.item.sort) : typeof s == "object" && this.sortItems(s);
    }), e;
  }
}
function Je(a) {
  const { updateTray: e, updateTrayState: t, resetScroll: s } = a;
  function i() {
    return game.settings.get("ape", "tray-display") === "always";
  }
  game.settings.register(
    "ape",
    "tray-display",
    {
      name: "ape.settings.tray-display",
      hint: "ape.settings.tray-display-hint",
      scope: "client",
      config: !0,
      default: "auto",
      choices: {
        auto: "ape.settings.tray-display-auto",
        toggle: "ape.settings.tray-display-toggle",
        selected: "ape.settings.tray-display-selected",
        always: "ape.settings.tray-display-always"
      },
      type: String,
      onChange: () => {
        ui.controls.initialize(), t();
      }
    }
  ), game.settings.register(
    "ape",
    "assume-default-character",
    {
      name: "ape.settings.assume-default-character",
      hint: "ape.settings.assume-default-character-hint",
      scope: "client",
      config: !0,
      default: !0,
      type: Boolean,
      onChange: () => t()
    }
  ), game.settings.register(
    "ape",
    "icon-size",
    {
      name: "ape.settings.icon-size",
      scope: "client",
      config: !0,
      default: "medium",
      choices: {
        small: "ape.settings.icon-size-small",
        medium: "ape.settings.icon-size-medium",
        large: "ape.settings.icon-size-large"
      },
      type: String,
      onChange: () => e()
    }
  ), game.settings.register(
    "ape",
    "tray-size",
    {
      name: "ape.settings.tray-size",
      scope: "client",
      config: !0,
      default: "large",
      choices: {
        small: "ape.settings.tray-size-small",
        medium: "ape.settings.tray-size-medium",
        large: "ape.settings.tray-size-large"
      },
      type: String,
      onChange: () => e()
    }
  ), game.settings.register(
    "ape",
    "skill-mode",
    {
      name: "ape.settings.skill-mode",
      hint: "ape.settings.skill-mode-hint",
      scope: "client",
      config: !0,
      default: "dropdown",
      choices: {
        dropdown: "ape.settings.skill-mode-dropdown",
        append: "ape.settings.skill-mode-append"
      },
      type: String,
      onChange: () => e()
    }
  ), game.settings.register(
    "ape",
    "show-spell-dots",
    {
      name: "ape.settings.show-spell-dots",
      scope: "client",
      config: !0,
      default: !0,
      type: Boolean,
      onChange: () => e()
    }
  ), game.settings.register(
    "ape",
    "show-spell-uses",
    {
      name: "ape.settings.show-spell-uses",
      scope: "client",
      config: !0,
      default: !0,
      type: Boolean,
      onChange: () => e()
    }
  ), game.settings.register(
    "ape",
    "show-no-uses",
    {
      name: "ape.settings.show-no-uses",
      scope: "client",
      config: !0,
      default: !1,
      type: Boolean,
      onChange: () => e()
    }
  ), game.settings.register(
    "ape",
    "sort-alphabetic",
    {
      name: "ape.settings.sort-alphabetic",
      scope: "client",
      config: !0,
      default: !1,
      type: Boolean,
      onChange: () => e()
    }
  ), game.settings.register(
    "ape",
    "show-unprepared-cantrips",
    {
      name: "ape.settings.show-unprepared-cantrips",
      scope: "client",
      config: !0,
      default: !1,
      type: Boolean,
      onChange: () => e()
    }
  ), game.settings.register(
    "ape",
    "use-control-button",
    {
      name: "ape.settings.use-control-button",
      scope: "client",
      config: !0,
      default: !0,
      type: Boolean,
      onChange: () => window.location.reload()
    }
  ), game.keybindings.register("ape", "toggle-tray", {
    name: "ape.keybindings.toggle-tray",
    editable: [
      { key: "KeyE", modifiers: [] }
    ],
    onDown: (n) => {
      i() || ($("#ape-app").toggleClass("is-open"), $("#ape-app .ape-skill-container").removeClass("is-open"));
    }
  }), game.keybindings.register("ape", "toggle-skills", {
    name: "ape.keybindings.toggle-skills",
    hint: "ape.keybindings.toggle-skills-hint",
    editable: [
      { key: "KeyK", modifiers: [] }
    ],
    onDown: (n) => {
      if (game.settings.get("ape", "skill-mode") === "dropdown") {
        const r = $("#ape-app .ape-skill-container").hasClass("is-open");
        if ($("#ape-app").hasClass("is-open") ? $("#ape-app .ape-skill-container").toggleClass("is-open") : ($("#ape-app").toggleClass("is-open"), $("#ape-app .ape-skill-container").addClass("is-open")), !r) {
          s && s();
          const o = $(".ape-container");
          o.length && (o[0].scrollTop = 0);
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
const j = globalThis, X = j.ShadowRoot && (j.ShadyCSS === void 0 || j.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, we = Symbol(), pe = /* @__PURE__ */ new WeakMap();
let Ze = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== we) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (X && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = pe.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && pe.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Qe = (a) => new Ze(typeof a == "string" ? a : a + "", void 0, we), Xe = (a, e) => {
  if (X) a.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), i = j.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = t.cssText, a.appendChild(s);
  }
}, ue = X ? (a) => a : (a) => a instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return Qe(t);
})(a) : a;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ye, defineProperty: et, getOwnPropertyDescriptor: tt, getOwnPropertyNames: st, getOwnPropertySymbols: it, getPrototypeOf: at } = Object, b = globalThis, he = b.trustedTypes, nt = he ? he.emptyScript : "", W = b.reactiveElementPolyfillSupport, U = (a, e) => a, Z = { toAttribute(a, e) {
  switch (e) {
    case Boolean:
      a = a ? nt : null;
      break;
    case Object:
    case Array:
      a = a == null ? a : JSON.stringify(a);
  }
  return a;
}, fromAttribute(a, e) {
  let t = a;
  switch (e) {
    case Boolean:
      t = a !== null;
      break;
    case Number:
      t = a === null ? null : Number(a);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(a);
      } catch {
        t = null;
      }
  }
  return t;
} }, ke = (a, e) => !Ye(a, e), de = { attribute: !0, type: String, converter: Z, reflect: !1, useDefault: !1, hasChanged: ke };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), b.litPropertyMetadata ?? (b.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let x = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = de) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(e, s, t);
      i !== void 0 && et(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: i, set: n } = tt(this.prototype, e) ?? { get() {
      return this[t];
    }, set(r) {
      this[t] = r;
    } };
    return { get: i, set(r) {
      const o = i == null ? void 0 : i.call(this);
      n == null || n.call(this, r), this.requestUpdate(e, o, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? de;
  }
  static _$Ei() {
    if (this.hasOwnProperty(U("elementProperties"))) return;
    const e = at(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(U("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(U("properties"))) {
      const t = this.properties, s = [...st(t), ...it(t)];
      for (const i of s) this.createProperty(i, t[i]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [s, i] of t) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, s] of this.elementProperties) {
      const i = this._$Eu(t, s);
      i !== void 0 && this._$Eh.set(i, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const i of s) t.unshift(ue(i));
    } else e !== void 0 && t.push(ue(e));
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
    return Xe(e, this.constructor.elementStyles), e;
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
    const s = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, s);
    if (i !== void 0 && s.reflect === !0) {
      const r = (((n = s.converter) == null ? void 0 : n.toAttribute) !== void 0 ? s.converter : Z).toAttribute(t, s.type);
      this._$Em = e, r == null ? this.removeAttribute(i) : this.setAttribute(i, r), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var n, r;
    const s = this.constructor, i = s._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const o = s.getPropertyOptions(i), l = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((n = o.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? o.converter : Z;
      this._$Em = i;
      const c = l.fromAttribute(t, o.type);
      this[i] = c ?? ((r = this._$Ej) == null ? void 0 : r.get(i)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, t, s, i = !1, n) {
    var r;
    if (e !== void 0) {
      const o = this.constructor;
      if (i === !1 && (n = this[e]), s ?? (s = o.getPropertyOptions(e)), !((s.hasChanged ?? ke)(n, t) || s.useDefault && s.reflect && n === ((r = this._$Ej) == null ? void 0 : r.get(e)) && !this.hasAttribute(o._$Eu(e, s)))) return;
      this.C(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: s, reflect: i, wrapped: n }, r) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, r ?? t ?? this[e]), n !== !0 || r !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
        for (const [n, r] of this._$Ep) this[n] = r;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, r] of i) {
        const { wrapped: o } = r, l = this[n];
        o !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, r, l);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (s = this._$EO) == null || s.forEach((i) => {
        var n;
        return (n = i.hostUpdate) == null ? void 0 : n.call(i);
      }), this.update(t)) : this._$EM();
    } catch (i) {
      throw e = !1, this._$EM(), i;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((s) => {
      var i;
      return (i = s.hostUpdated) == null ? void 0 : i.call(s);
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
x.elementStyles = [], x.shadowRootOptions = { mode: "open" }, x[U("elementProperties")] = /* @__PURE__ */ new Map(), x[U("finalized")] = /* @__PURE__ */ new Map(), W == null || W({ ReactiveElement: x }), (b.reactiveElementVersions ?? (b.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const I = globalThis, ge = (a) => a, B = I.trustedTypes, me = B ? B.createPolicy("lit-html", { createHTML: (a) => a }) : void 0, Ce = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, Ee = "?" + v, rt = `<${Ee}>`, k = document, P = () => k.createComment(""), D = (a) => a === null || typeof a != "object" && typeof a != "function", Y = Array.isArray, ot = (a) => Y(a) || typeof (a == null ? void 0 : a[Symbol.iterator]) == "function", K = `[ 	
\f\r]`, T = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, fe = /-->/g, ye = />/g, A = RegExp(`>|${K}(?:([^\\s"'>=/]+)(${K}*=${K}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), $e = /'/g, ve = /"/g, xe = /^(?:script|style|textarea|title)$/i, lt = (a) => (e, ...t) => ({ _$litType$: a, strings: e, values: t }), u = lt(1), C = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), be = /* @__PURE__ */ new WeakMap(), S = k.createTreeWalker(k, 129);
function Oe(a, e) {
  if (!Y(a) || !a.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return me !== void 0 ? me.createHTML(e) : e;
}
const ct = (a, e) => {
  const t = a.length - 1, s = [];
  let i, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = T;
  for (let o = 0; o < t; o++) {
    const l = a[o];
    let c, h, d = -1, m = 0;
    for (; m < l.length && (r.lastIndex = m, h = r.exec(l), h !== null); ) m = r.lastIndex, r === T ? h[1] === "!--" ? r = fe : h[1] !== void 0 ? r = ye : h[2] !== void 0 ? (xe.test(h[2]) && (i = RegExp("</" + h[2], "g")), r = A) : h[3] !== void 0 && (r = A) : r === A ? h[0] === ">" ? (r = i ?? T, d = -1) : h[1] === void 0 ? d = -2 : (d = r.lastIndex - h[2].length, c = h[1], r = h[3] === void 0 ? A : h[3] === '"' ? ve : $e) : r === ve || r === $e ? r = A : r === fe || r === ye ? r = T : (r = A, i = void 0);
    const g = r === A && a[o + 1].startsWith("/>") ? " " : "";
    n += r === T ? l + rt : d >= 0 ? (s.push(c), l.slice(0, d) + Ce + l.slice(d) + v + g) : l + v + (d === -2 ? o : g);
  }
  return [Oe(a, n + (a[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class R {
  constructor({ strings: e, _$litType$: t }, s) {
    let i;
    this.parts = [];
    let n = 0, r = 0;
    const o = e.length - 1, l = this.parts, [c, h] = ct(e, t);
    if (this.el = R.createElement(c, s), S.currentNode = this.el.content, t === 2 || t === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (i = S.nextNode()) !== null && l.length < o; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const d of i.getAttributeNames()) if (d.endsWith(Ce)) {
          const m = h[r++], g = i.getAttribute(d).split(v), f = /([.?@])?(.*)/.exec(m);
          l.push({ type: 1, index: n, name: f[2], strings: g, ctor: f[1] === "." ? ut : f[1] === "?" ? ht : f[1] === "@" ? dt : q }), i.removeAttribute(d);
        } else d.startsWith(v) && (l.push({ type: 6, index: n }), i.removeAttribute(d));
        if (xe.test(i.tagName)) {
          const d = i.textContent.split(v), m = d.length - 1;
          if (m > 0) {
            i.textContent = B ? B.emptyScript : "";
            for (let g = 0; g < m; g++) i.append(d[g], P()), S.nextNode(), l.push({ type: 2, index: ++n });
            i.append(d[m], P());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Ee) l.push({ type: 2, index: n });
      else {
        let d = -1;
        for (; (d = i.data.indexOf(v, d + 1)) !== -1; ) l.push({ type: 7, index: n }), d += v.length - 1;
      }
      n++;
    }
  }
  static createElement(e, t) {
    const s = k.createElement("template");
    return s.innerHTML = e, s;
  }
}
function O(a, e, t = a, s) {
  var r, o;
  if (e === C) return e;
  let i = s !== void 0 ? (r = t._$Co) == null ? void 0 : r[s] : t._$Cl;
  const n = D(e) ? void 0 : e._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== n && ((o = i == null ? void 0 : i._$AO) == null || o.call(i, !1), n === void 0 ? i = void 0 : (i = new n(a), i._$AT(a, t, s)), s !== void 0 ? (t._$Co ?? (t._$Co = []))[s] = i : t._$Cl = i), i !== void 0 && (e = O(a, i._$AS(a, e.values), i, s)), e;
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
    const { el: { content: t }, parts: s } = this._$AD, i = ((e == null ? void 0 : e.creationScope) ?? k).importNode(t, !0);
    S.currentNode = i;
    let n = S.nextNode(), r = 0, o = 0, l = s[0];
    for (; l !== void 0; ) {
      if (r === l.index) {
        let c;
        l.type === 2 ? c = new N(n, n.nextSibling, this, e) : l.type === 1 ? c = new l.ctor(n, l.name, l.strings, this, e) : l.type === 6 && (c = new gt(n, this, e)), this._$AV.push(c), l = s[++o];
      }
      r !== (l == null ? void 0 : l.index) && (n = S.nextNode(), r++);
    }
    return S.currentNode = k, i;
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
  constructor(e, t, s, i) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
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
    e = O(this, e, t), D(e) ? e === p || e == null || e === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : e !== this._$AH && e !== C && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : ot(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== p && D(this._$AH) ? this._$AA.nextSibling.data = e : this.T(k.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var n;
    const { values: t, _$litType$: s } = e, i = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = R.createElement(Oe(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === i) this._$AH.p(t);
    else {
      const r = new pt(i, this), o = r.u(this.options);
      r.p(t), this.T(o), this._$AH = r;
    }
  }
  _$AC(e) {
    let t = be.get(e.strings);
    return t === void 0 && be.set(e.strings, t = new R(e)), t;
  }
  k(e) {
    Y(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, i = 0;
    for (const n of e) i === t.length ? t.push(s = new N(this.O(P()), this.O(P()), this, this.options)) : s = t[i], s._$AI(n), i++;
    i < t.length && (this._$AR(s && s._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, t); e !== this._$AB; ) {
      const i = ge(e).nextSibling;
      ge(e).remove(), e = i;
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
  constructor(e, t, s, i, n) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = p;
  }
  _$AI(e, t = this, s, i) {
    const n = this.strings;
    let r = !1;
    if (n === void 0) e = O(this, e, t, 0), r = !D(e) || e !== this._$AH && e !== C, r && (this._$AH = e);
    else {
      const o = e;
      let l, c;
      for (e = n[0], l = 0; l < n.length - 1; l++) c = O(this, o[s + l], t, l), c === C && (c = this._$AH[l]), r || (r = !D(c) || c !== this._$AH[l]), c === p ? e = p : e !== p && (e += (c ?? "") + n[l + 1]), this._$AH[l] = c;
    }
    r && !i && this.j(e);
  }
  j(e) {
    e === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class ut extends q {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === p ? void 0 : e;
  }
}
class ht extends q {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== p);
  }
}
class dt extends q {
  constructor(e, t, s, i, n) {
    super(e, t, s, i, n), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = O(this, e, t, 0) ?? p) === C) return;
    const s = this._$AH, i = e === p && s !== p || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, n = e !== p && (s === p || i);
    i && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
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
const V = I.litHtmlPolyfillSupport;
V == null || V(R, N), (I.litHtmlVersions ?? (I.litHtmlVersions = [])).push("3.3.2");
const mt = (a, e, t) => {
  const s = (t == null ? void 0 : t.renderBefore) ?? e;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = (t == null ? void 0 : t.renderBefore) ?? null;
    s._$litPart$ = i = new N(e.insertBefore(P(), n), n, void 0, t ?? {});
  }
  return i._$AI(a), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w = globalThis;
let y = class extends x {
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
    return C;
  }
};
var Ae;
y._$litElement$ = !0, y.finalized = !0, (Ae = w.litElementHydrateSupport) == null || Ae.call(w, { LitElement: y });
const G = w.litElementPolyfillSupport;
G == null || G({ LitElement: y });
(w.litElementVersions ?? (w.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ft = { CHILD: 2 }, yt = (a) => (...e) => ({ _$litDirective$: a, values: e });
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
class Q extends $t {
  constructor(e) {
    if (super(e), this.it = p, e.type !== ft.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(e) {
    if (e === p || e == null) return this._t = void 0, this.it = e;
    if (e === C) return e;
    if (typeof e != "string") throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (e === this.it) return this._t;
    this.it = e;
    const t = [e];
    return t.raw = t, this._t = { _$litType$: this.constructor.resultType, strings: t, values: [] };
  }
}
Q.directiveName = "unsafeHTML", Q.resultType = 1;
const vt = yt(Q);
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
    var M, ae, ne, re, oe, le, ce;
    if (!this.item) return p;
    const e = this.item.system, t = e.rarity || "", s = this.item.type === "spell", i = e.method === "innate", n = this.uses && (!s || i), r = (M = e.properties) == null ? void 0 : M.has("ritual"), o = (ae = e.properties) == null ? void 0 : ae.has("concentration"), l = ((ne = e.activation) == null ? void 0 : ne.type) === "bonus", c = ((re = e.activation) == null ? void 0 : re.type) === "reaction", h = ((oe = e.activation) == null ? void 0 : oe.type) === "legendary", d = (le = e.recharge) == null ? void 0 : le.value, m = (ce = e.recharge) == null ? void 0 : ce.charged, g = !!this.item.parent.itemTypes.feat.find((Re) => Re.name === "Ritual Adept"), f = e.method === "prepared" && !e.prepared && e.level !== 0 && !g;
    return u`
            <div class="item-name rollable flexrow">
                <div class="item-image ${t}" 
                        style="background-image: url('${this.item.img}')"
                        @mousedown="${this._onRoll}">
                    <i class="fa fa-dice-d20"></i>
                </div>
                
                <h4 @mousedown="${this._onClick}">
                    <span class="item-text ${t}">${this.item.name}</span>
                    ${n ? u` (${this.uses.available}${this.uses.maximum ? "/" + this.uses.maximum : ""})` : p}
                </h4>

                ${r ? u`<div class="ritual flag" title="${game.i18n.localize("ape.flag.ritual-title")}"></div>` : p}
                ${o ? u`<div class="concentration flag" title="${game.i18n.localize("ape.flag.concentration-title")}"></div>` : p}
                ${l ? u`<div class="bonus flag" title="${game.i18n.localize("ape.flag.bonus-title")}">${game.i18n.localize("ape.flag.bonus")}</div>` : p}
                ${c ? u`<div class="reaction flag" title="${game.i18n.localize("ape.flag.reaction-title")}">${game.i18n.localize("ape.flag.reaction")}</div>` : p}
                ${h ? u`<div class="legendary flag" title="${game.i18n.localize("ape.flag.legendary-title")}">${game.i18n.localize("ape.flag.legendary")}</div>` : p}

                ${d ? m ? u`<div class="flag"><i class="fas fa-bolt"></i></div>` : u`<div class="flag"><a class="rollable item-recharge" @mousedown="${this._onRecharge}"><i class="fas fa-dice-six"></i> ${e.recharge.value}+</a></div>` : p}

                ${f ? u`<div class="unprepared flag" title="${game.i18n.localize("ape.flag.unprepared-title")}"></div>` : p}
            </div>
            
            <div class="item-drag-handle" 
                    draggable="true" 
                    title="${game.i18n.localize("ape.drag-to-target")}"
                    @dragstart="${this._onDragStart}">
                <i class="fas fa-grip-vertical"></i>
            </div>

            ${this.expanded ? u`
                <div class="item-summary" style="display:block">
                    ${this._renderItemDetails()}
                    ${this.description ? u`<p>${vt(this.description.description)}</p>` : u`<i class="fas fa-spinner fa-spin"></i>`}
                </div>
            ` : p}
        `;
  }
  _renderItemDetails() {
    const e = Me(this.item);
    return u`
            ${e.castingTime ? u`<p><strong>Casting Time:</strong> ${e.castingTime}</p>` : p}
            ${e.range ? u`<p><strong>Range:</strong> ${e.range}</p>` : p}
            ${e.duration ? u`<p><strong>Duration:</strong> ${e.duration}</p>` : p}
        `;
  }
}
E(Te, "properties", {
  item: { type: Object },
  uses: { type: Object },
  api: { type: Object },
  expanded: { type: Boolean, state: !0 },
  description: { type: Object, state: !0 }
});
customElements.define("ape-item", Te);
class Ue extends y {
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
    return u`
            ${this.title ? u`
                <h2 @click="${this._toggleOpen}">
                    <i class="fas fa-caret-down"></i> ${game.i18n.localize(this.title)}
                </h2>
            ` : p}

            ${this.items && this.items.length > 0 ? u`
                <div class="ape-items">
                    ${this.items.map((e) => u`
                        <ape-item class="ape-item item" data-item-uuid="${e.item.uuid}" .item="${e.item}" .uses="${e.uses}" .api="${this.api}"></ape-item>
                    `)}
                </div>
            ` : p}

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
            `) : p}
        `;
  }
}
E(Ue, "properties", {
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
customElements.define("ape-section", Ue);
class Ie extends y {
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
    if (!this.group) return p;
    const { items: e, uses: t, title: s } = this.group, i = e && e.length > 0, n = t && t.maximum;
    if (!i && !n) return p;
    const r = n && this.showSpellDots, o = t && this.showSpellUses, l = [
      "flexrow",
      "ape-group-header",
      r ? "has-dots" : "",
      o ? "has-uses" : ""
    ].filter(Boolean).join(" ");
    return u`
            <div class="${l}" @click="${this._toggleOpen}">
                <h3>
                    <i class="fas fa-caret-down"></i> ${game.i18n.localize(s)}
                </h3>
                ${r ? this._renderDots(t) : p}
                ${o ? u`<div class="group-uses">${t.available}/${t.maximum}</div>` : p}
            </div>

            ${i ? u`
                <div class="ape-items">
                    ${e.map((c) => u`
                        <ape-item class="ape-item item" data-item-uuid="${c.item.uuid}" .item="${c.item}" .uses="${c.uses}" .api="${this.api}"></ape-item>
                    `)}
                </div>
            ` : p}
        `;
  }
  _renderDots(e) {
    return u`
            <div class="group-dots" data-group-name="${this.groupName}">
                ${Array.from({ length: e.maximum }).map((t, s) => u`
                    <div class="dot ${s < e.available ? "" : "empty"}" 
                         data-slot="${s}"
                         @click="${(i) => {
      i.stopPropagation(), this.api.adjustSpellSlot(this.actor, this.groupName, s);
    }}">
                    </div>
                `)}
            </div>
        `;
  }
}
E(Ie, "properties", {
  group: { type: Object },
  groupName: { type: String },
  api: { type: Object },
  actor: { type: Object },
  showSpellDots: { type: Boolean },
  showSpellUses: { type: Boolean },
  isOpen: { type: Boolean, state: !0 }
});
customElements.define("ape-group", Ie);
class Pe extends y {
  createRenderRoot() {
    return this;
  }
  updated(e) {
    e.has("actorData") && this.actorData && (this.dataset.actorUuid = this.actorData.actor.uuid);
  }
  render() {
    if (!this.actorData) return p;
    const { actor: e, name: t, sections: s, needsInitiative: i, skillMode: n, showSkills: r } = this.actorData, o = e.system.attributes.hp, l = e.system.attributes.ac.value, c = e.type, h = o.value <= 0 && c === "character";
    return u`
            <div class="ape-actor-header">
                <h1>
                    <a class="ape-actor-name" @click="${(d) => this.api.openSheet(e)}">${t.split(" ")[0]}</a>
                    <span class="ape-actor-ac">
                        <img class="ape-actor-ac-icon" src="/modules/ape/images/ac-icon.svg">
                        <span class="ape-actor-ac-display">${l}</span>
                    </span>
                </h1>
                
                <div class="ape-actor-meta">
                    ${c === "character" ? u`
                        <div class="ape-actor-race-class">
                            ${this._renderRaceClass(e.itemTypes)}
                        </div>
                    ` : p}

                    <div class="ape-actor-rest-buttons">
                        <button class="ape-actor-rest-button" @click="${() => this.api.shortRest(e)}"><span class="fas fa-fork-knife"></span></button>
                        <button class="ape-actor-rest-button" @click="${() => this.api.longRest(e)}"><span class="fas fa-tent"></span></button>
                    </div>

                    ${this._renderHpBar(e, o)}
                </div>
            </div>

            ${h ? this._renderDeathSaves(e) : p}

            ${i ? u`
                <div class="ape-initiative" @click="${() => this.api.rollInitiative(e)}">
                    <i class="fas fa-swords ape-initiative-icon"></i>
                    <span class="ape-initiative-text">${game.i18n.localize("ape.roll-initiative")}</span>
                </div>
            ` : p}

            ${this._renderAbilities(e)}

            ${n === "dropdown" ? this._renderSkills(e, r, !0) : p}

            <!-- Sections -->
            ${this._renderSections(e, s)}

            ${n === "append" ? this._renderSkills(e, r, !1) : p}
        `;
  }
  _renderRaceClass(e) {
    const t = qe(e);
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
                               @change="${(i) => this.api.updateHP(e, parseInt(i.target.value))}">
                    </span>
                </div>
                <div class="ape-actor-temp">
                     <span class="ape-actor-temp-display" @click="${this._toggleTempInput}">${t.temp || 0}</span>
                     <input type="text" class="ape-actor-temp-input" value="${t.temp || 0}" 
                            style="display:none"
                            @blur="${this._finishTempEdit}"
                            @keydown="${this._hpInputKey}"
                            @change="${(i) => this.api.updateTempHP(e, parseInt(i.target.value))}">
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
                        ${s.map((i) => {
      const n = e.system.abilities[i.key];
      return u`
                                <span class="ape-ability">
                                    <span class="ape-ability-label">${i.key}</span>
                                    <a class="fas fa-dice-d20 ape-ability-check" 
                                       title="${i.label} check"
                                       @click="${(r) => this.api.rollAbilityCheck(e, i.key, r)}">
                                        <span class="ape-ability-text">${F(n.mod)}</span>
                                    </a>
                                    <a class="fas fa-dice-d20 ape-ability-save" 
                                       title="${i.label} saving throw"
                                       @click="${(r) => this.api.rollSavingThrow(e, i.key, r)}">
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
    const i = this.actorData.skills, n = e.system.skills;
    return u`
            <div class="ape-skill-container ${this.actorData.skillMode} ${t ? "is-open" : ""}">
                ${s ? u`
                    <h2 class="ape-skill-header" @click="${this._toggleSkills}">
                        <i class="fas fa-caret-down"></i> Skills
                    </h2>
                ` : p}

                <div class="ape-skills">
                    ${Object.keys(n).map((r) => {
      const o = n[r], l = i[r];
      if (!l) return p;
      let c = "far fa-circle";
      return o.proficient === 0.5 ? c = "fas fa-adjust" : o.proficient === 1 ? c = "fas fa-check" : o.proficient === 2 && (c = "fas fa-star"), u`
                            <div class="ape-skill-row flexrow ${o.proficient === 1 ? "proficient" : o.proficient === 2 ? "expert" : ""}"
                               @click="${(h) => this.api.rollSkill(e, r, h)}"
                               @contextmenu="${(h) => this.api.rollSkill(e, r, h, !0)}">
                                <span class="ape-skill-icon ${c}"></span>
                                <span class="ape-skill-ability">${o.ability}</span>
                                <span class="ape-skill-label">${l.label}</span>
                                <span class="ape-skill-bonus">${F(o.total)}</span>
                                <span class="ape-skill-passive">(${o.passive})</span>
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
    const t = e.system.attributes.death.failure, s = e.system.attributes.death.success, i = (r, o, l) => Array.from({ length: 3 }).map((c, h) => u`
                <span class="ape-death-dot ${h < r ? "filled" : ""}">
                    ${h < r ? u`<span class="fas ${l}"></span>` : p}
                </span>
             `), n = t < 3 && s < 3;
    return u`
             <div class="ape-death-saving">
                <span class="ape-death-throws failed">
                    ${i(t, "failed", "fa-skull-crossbones")}
                </span>
                <span class="ape-death-icon" 
                      style="${n ? "cursor:pointer" : "cursor:default"}"
                      @mousedown="${n ? (r) => this.api.rollDeathSave(e, r) : null}"></span>
                <span class="ape-death-throws saved">
                    ${i(s, "saved", "fa-check")}
                </span>
             </div>
        `;
  }
  _renderSections(e, t) {
    return ["equipped", "feature", "spell", "inventory", "passive"].map((i) => {
      const n = t[i];
      return n ? u`
                <ape-section 
                    class="ape-category"
                    .title="${n.title}" 
                    .items="${n.items}"
                    .groups="${n.groups}"
                    .sectionId="${i}"
                    .api="${this.api}"
                    .actor="${e}"
                    .showSpellDots="${this.globalData.showSpellDots}"
                    .showSpellUses="${this.globalData.showSpellUses}">
                </ape-section>
            ` : p;
    });
  }
}
E(Pe, "properties", {
  actorData: { type: Object },
  // The object returned by data-builder
  globalData: { type: Object },
  // Global settings/options
  api: { type: Object }
  // Internal state for UI toggles if needed, though most are handled by sub-components or CSS
});
customElements.define("ape-actor", Pe);
class De extends y {
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
      const t = this.data.actors[0].actor.uuid, s = e.target.scrollTop, i = !!this.querySelector(".ape-skill-container.is-open");
      this.api.setScrollPosition({ uuid: t, scroll: s, showSkills: i });
    }
  }
  render() {
    if (!this.data) return p;
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
                    ` : e.map((i) => u`
                        <ape-actor 
                            class="ape-actor"
                            .actorData="${i}"
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
    return p;
  }
}
E(De, "properties", {
  data: { type: Object },
  // Contains actors
  globalData: { type: Object },
  // Contains abilityColumns, showSpellDots
  api: { type: Object }
});
customElements.define("ape-app", De);
let L, H, _e, J;
function bt(a) {
  var r;
  if (!a || a === "") return null;
  let e = a.split(".");
  if (e[0] === "Compendium")
    return null;
  const [t, s] = e.slice(0, 2);
  e = e.slice(2);
  const i = (r = CONFIG[t]) == null ? void 0 : r.collection.instance;
  if (!i) return null;
  let n = i.get(s);
  for (; n && e.length > 1; ) {
    const [o, l] = e.slice(0, 2);
    n = n.getEmbeddedDocument(o, l), e = e.slice(2);
  }
  return n || null;
}
function Ct(a) {
  if (a instanceof CONFIG.Actor.documentClass)
    return a;
  if (a instanceof CONFIG.Token.documentClass)
    return a.object.actor;
}
function ee() {
  const a = canvas.tokens.controlled.map((t) => t.actor), e = document.querySelector("ape-app");
  e && (game.combat && a.includes(H) ? e.classList.add("is-current-combatant") : e.classList.remove("is-current-combatant"));
}
Hooks.on("ready", () => {
  var a, e;
  if (!document.querySelector("ape-app")) {
    const t = document.createElement("ape-app");
    t.id = "ape-app", t.classList.add("ape-container");
    const s = document.getElementById("interface");
    s && document.body.insertBefore(t, s), _e = new ze(), t.api = _e;
  }
  L = (e = (a = game.combat) == null ? void 0 : a.turns.find((t) => {
    var s;
    return t.id == ((s = game.combat) == null ? void 0 : s.current.combatantId);
  })) == null ? void 0 : e.actor, H = L, te() && $("#ape-app").addClass("is-open always-on"), ie();
});
function _t() {
  const a = game.settings.get("ape", "tray-display");
  return a === "selected" || a === "auto";
}
function te() {
  return game.settings.get("ape", "tray-display") === "always";
}
function z() {
  const a = canvas.tokens.controlled.filter((e) => {
    var t;
    return ["character", "npc"].includes((t = e.actor) == null ? void 0 : t.type);
  });
  return a.length ? a.map((e) => e.actor) : game.user.character && game.settings.get("ape", "assume-default-character") ? [game.user.character] : [];
}
Hooks.on("controlToken", async () => {
  ie();
});
Hooks.on("updateActor", (a) => {
  z().includes(a) && _();
});
function se(a) {
  z().includes(a.actor) && _();
}
Hooks.on("updateItem", (a) => {
  se(a);
});
Hooks.on("deleteItem", (a) => {
  se(a);
});
Hooks.on("createItem", (a) => {
  se(a);
});
Hooks.on("updateCombat", (a) => {
  var e;
  H = (e = a.turns.find((t) => t.id == a.current.combatantId)) == null ? void 0 : e.actor, ee(), L = H;
});
Hooks.on("createCombatant", (a) => {
  z().includes(a.actor) && _();
});
Hooks.on("updateCombatant", (a, e) => {
  z().includes(a.actor) && _();
});
Hooks.on("deleteCombat", (a) => {
  game.combat || (H = null, L = null, ee());
});
Hooks.on("init", () => {
  Je({
    updateTray: _,
    updateTrayState: ie,
    resetScroll: () => {
      document.querySelector("ape-app");
    }
  });
});
Hooks.on("getSceneControlButtons", (a) => {
  if (game.settings.get("ape", "use-control-button") && !te()) {
    const e = a.tokens.tools;
    e && (e.apeApp = {
      name: "apeApp",
      title: game.i18n.localize("ape.control-icon"),
      icon: "fas fa-user-shield",
      visible: !0,
      onClick: () => {
        $("#ape-app").toggleClass("is-open"), $("#ape-app .ape-skill-container").removeClass("is-open");
      },
      button: 1
    });
  }
});
function ie() {
  const a = $("#ape-app");
  _t() && (canvas.tokens.controlled.filter((t) => {
    var s;
    return ["character", "npc"].includes((s = t.actor) == null ? void 0 : s.type);
  }).length ? a.addClass("is-open") : a.removeClass("is-open")), te() ? a.addClass("is-open always-on") : a.removeClass("always-on"), ee(), _();
}
async function _() {
  J || (J = new Ge());
  const a = z(), e = J.build(a, {
    /* scrollPosition stub */
  });
  function t(h, d) {
    return h && [d, h].join("-");
  }
  const s = t(game.settings.get("ape", "icon-size"), "icon"), i = t(game.settings.get("ape", "tray-size"), "tray"), n = game.settings.get("ape", "show-spell-dots"), r = game.settings.get("ape", "show-spell-uses"), o = Object.entries(CONFIG.DND5E.abilities), l = [
    o.slice(0, 3).map(([h, d]) => ({ key: h, label: d.label })),
    o.slice(3, 6).map(([h, d]) => ({ key: h, label: d.label }))
  ], c = document.querySelector("ape-app");
  c.classList.add(s), c.classList.add(i), c && (c.data = {
    actors: e
  }, c.globalData = {
    abilityColumns: l,
    showSpellDots: n,
    showSpellUses: r
  });
}
Hooks.on("dnd5e.getItemContextOptions", (a, e) => {
  var t;
  (t = a.system.activation) != null && t.type && a.system.activation.type !== "none" && (a.getFlag("ape", "hidden") ? e.push({
    name: game.i18n.localize("ape.item-context.show"),
    icon: "<i class='fas fa-eye'></i>",
    callback: async () => {
      await a.setFlag("ape", "hidden", !1), _();
    }
  }) : e.push({
    name: game.i18n.localize("ape.item-context.hide"),
    icon: "<i class='fas fa-eye-slash'></i>",
    callback: async () => {
      await a.setFlag("ape", "hidden", !0), _();
    }
  }));
});
Hooks.on("dropCanvasData", (a, e) => {
  if (e.type === "ActionPackItem" && e.uuid) {
    const t = bt(e.uuid);
    if (!t) return;
    const s = a.tokens.placeables.find((i) => e.x >= i.x && e.x <= i.x + i.w && e.y >= i.y && e.y <= i.y + i.h);
    if (s)
      return s.setTarget(!0, { user: game.user, releaseOthers: !0, groupSelection: !1 }), t.use(), !1;
  }
});
export {
  Ct as fudgeToActor
};
