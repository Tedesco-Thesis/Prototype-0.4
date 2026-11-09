# Prototype 0.7 — a computer you can only keep three things from

Adds a journey layer on top of 0.6. The written breakdown (what, why, trade-offs) is the Claude Doc "Third Space 0.7 — what changed and why". This file is the short technical version.

## New files
- `js/content/eras.js` — ALL wording (stand-ins): CFG, arrival, 38 things over 12 eras, 5 scenes, fates, 4 stand-in profiles, 3 Nous questions, 3 polish rules.
- `js/features/journey.js` — arrival, things window, scenes, keep-three, four fates, going back, reveal, export/erase, 2024 suggestion / 2030 question.
- `css/features/journey.css` — styling, plus the 2024 "why is not shown" rule.
- `tests/journey07.js` — 34 checks (`node tests/journey07.js`).

## Small patches to 0.6 files
`store.js` (destroyAll also erases the journey), `lenses.js` (shows a thing's context), `viewer.js` (type "thing" + fate banner), `index.html` (links).

## Switches (js/content/eras.js → CFG)
`keep` (3), `perTransition` (true), `allowBack` (true, informational), `anchors`, `opaqueFrom` (2024).

## Behaviour notes
- Auto-start is off under `#quick`; add `#journey` to turn it on in a quick URL.
- Journey data lives in localStorage key `thirdspace.journey.v1`; nothing leaves the browser.
- Scenes wait for an era's splash/login ritual to finish.
- Everything is a stand-in until you replace it. No quotes are used.
