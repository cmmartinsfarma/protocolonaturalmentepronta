# Fingerprints

Every site you build with **scroll-craft** gets one row here, appended after it
ships. The registry exists so your next build can prove it is a different page
rather than a re-skin of one you already made.

This file is **yours**. It starts empty on purpose: the gate is about not
repeating *yourself*, so it has nothing to say until you have built something.

The rules and the gate live in the skill's
`references/uniqueness.md`. Short version:

**A new build must differ from EVERY row below on at least 4 of the 6
dimensions.** Four against each row individually, not four on average across the
table. If a planned build fails, change the plan. Never edit a row to make room
for it.

The six dimensions are: **grammar**, **nav treatment**, **hero device**,
**act-sequence shape**, **close pattern**, **signature move**.

Dimension 6 is free, because a signature move is unique by definition. So the
gate really asks for three more out of the remaining five, and a build that
changes only grammar and world will fail it.

---

## The registry

| Build | Grammar | Nav treatment | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|---|
| Dra. Carolina Martins | Chaptered editorial | Fixed marginal folio, roman chapters, hidden on the cover | Typographic title page, giant name, arch and outlined C, no photo above the fold | 7 chapters, ~12.1vh: pin (3.4) > flow > flow > pan (3.2) > pin (1.5) > flow | Dark colophon, CTA as running text, inverted logo | Three paper panels lift at staggered rates to reveal the portrait | Light paper, rose, oxblood | dracarolinamartins.vercel.app |

*(empty: your first build has nothing to clear, so build whatever the interview
points at. From the second onwards, this table is the constraint.)*

---

## What is taken

Add a bullet here whenever a build claims something a later build should avoid
reusing: a grammar, a nav treatment, a close pattern, a signature move, an
act-count-and-length band. The shared columns are what the next build inherits
as a constraint, so writing them down is the whole point.

Nothing is taken yet.

- Chaptered editorial as a personal-brand grammar: marginal folio, typographic title page, hard chapter cuts, dark colophon. The next build should not reuse this close or this title-page shape.
- The three-panel paper reveal of a portrait. It is the signature move of this build.
- The act-count and length band: 7 chapters at ~12.1vh with pin > pan > pin. The next build should not land on the same band.
- Light paper, dusty rose and oxblood with Cormorant Garamond and Manrope. The next build should not reuse this palette and type pairing.

---

## Appending a row

After shipping, add one line to the table and one bullet to **What is taken** if
the build claimed something new. Fill every column. Say what the build shares
with existing rows.

Rows are append-only. A build that has been superseded stays in the table,
because the space it occupies is still occupied.

---

## Worked example

The skill's author kept a registry of twelve builds across eight page grammars.
If you want to see what a filled-in table looks like, and which shapes tend to
collide, read `EXAMPLES.md` in the scroll-craft repository. Treat it as
illustration only: those rows are somebody else's builds and they do **not**
constrain yours.
