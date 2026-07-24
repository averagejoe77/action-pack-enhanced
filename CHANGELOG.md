# Changelog

All notable changes to Action Pack Enhanced are documented in this file.

## [1.4.2] - 2026-07-23
- **Added custom tracking badges**: Added my own tracking badges becasue third party badges kept failing.
- **Added Ability Check/Save Proficiency**: Abilities that you are proficient in are no labled in green text in the Ability Check/Save section.

  ## Updated ##
- **Version indicator**: Updated the checking of the version number to use my own custom checking url rather than the raw github user content api. 

## [1.4.0] - 2026-07-16
- Added ammo display next to the weapon name for weapons that use ammo (Bows, Crossbows, etc)
- Added prepared spell count to the Spell section header for classes that have prepared spells; it won't stop you from preparing every spell you have though... maybe on the next update
- Added version number display for DMs with a color coded status indicator in the top left hand corner 
  - Green - you are on the latest version
  - Yellow - There is an update - hover over the version number to get the changelog details (hopefully this works, as I will not know if this is working correctly until I push this update 🤞)
- I have added patreon support to the module as well as a patreon only feature
  - You can now add/remove and increment/decrement items to/in your inventory directly from APE
  - You can now add/remove/prepare/unprepare spells directly from APE
  - Subscribing to patreon as the DM will unlock the feature for all players 
  - This was a decision I had to make in order to continue to develop this module and I appreciate everyone who has used and is using it and the feedback I have gotten on it
  - **Let me be clear - you do not need this feature to use this module**
  - **This module is a free module and will remain a free module that you are freely able to use**


## [1.3.0] - 2026-07-08
- Added more detailed info for actors
  - Speed
  - Damage Resistances/Immunities/Vulnerablities
  - Condition Immunities
  - Languages
  - Senses
  - Armor Proficiencies
  - Weapon Proficiencies
  - Weapon Masteries (shows the wepaon type choosen and the mastery it provides)
- Added a section for Legendary actions (*)
- Added a section for Legendary defenses (*)
  - While APE was originally designed for player characters, DMs also can use it for NPCs, since some NPCs have these features I added support to display and use them.
- Added support for condition display and toggle - while modules like MIDI-QOL and CPR automate this, there may be times where your DM asks you to apply or remove a condition narratively, so I added it to the APE display for convenience.

- *Bug fix* - Fixed: Alt/Ctrl(Cmd) Modifier keys not working for weapon and spell attack rolls, as well as drag and drop targeting.


## [1.2.7] - 2026-07-05
- Added Advancement Origin so users can see where spells and features originate from
- Added Ability value display to the Ability Checks/Saves section

## [1.2.6] - 2026-05-13
- Added support for the dnd5e Spell Points module
- Added stats to the README

## [1.2.5] - 2026-05-06
- Added support for shields in the equipment section

## [1.2.4] - 2026-04-07
- Fixed rechargeable items not being rechargeable from APE

## [1.2.3] - 2026-04-06
- Updates to UI elements
- Merged patch from community contribution (#3)

## [1.2.2] - 2026-04-06
- Updated to support FoundryVTT v14

## [1.2.1] - 2026-03-29
- Redesigned actor display with collapsible sections and visual updates

## [1.2.0] - 2026-01-31
- Introduced weapon sets feature for quick equipping
- Enhanced weapon display with unequipped status and quick equip
- Broadened weapon mastery selection to all available weapons

## [1.1.7] - 2026-01-25
- Enhanced item display with materials and properties

## [1.1.6] - 2026-01-25
- Enabled source map generation during build
- Updated canvas drop targeting logic to use activities data

## [1.1.5] - 2026-01-24
- Implemented flexible weapon mastery rules per class
- Fixed XP modification buttons not disabling at min/max

## [1.1.4] - 2026-01-23
- Added support for weapon masteries
- Added inspiration display and updated weapon mastery settings

## [1.1.3] - 2026-01-21
- Fixed incorrectly scoped setting text

## [1.1.2] - 2026-01-20
- Improved range display for touch and self units

## [1.1.1] - 2026-01-20
- Enhanced and refactored the Action Pack Enhanced module

## [1.1.0] - 2026-01-17
- Migrated the main application to LitElement-based UI components
- Introduced the Vite build system
- Updated localization for the module rename and new features

## [1.0.3] - 2026-01-16
- Fixed image paths for icons

## [1.0.2] - 2026-01-14
- Fixed multiclass display

## [1.0.1] - 2026-01-13
- Renamed module ID and namespace to `action-pack-enhanced`
- Added note about D&D5e spell preparation data

## [1.0.0] - 2026-01-13
- Initial release
