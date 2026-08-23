# CIRCLE LAB — pre-class dry run

Run this once, offline, before you go live. It takes about three minutes.
Everything here should just work — if any item fails, don't teach with it
until it's fixed.

**Current build status:** Modules 1 (Chord Lab), 2 (Doubling Machine), and
3 (Semicircle) are real. Modules 4–9 and 0 are placeholders ("coming next
phase") until they're built — pressing those keys should show that
placeholder cleanly, not an error. Re-run this checklist once more modules
land.

## Setup

1. **Open `dist/index.html` directly from the file system** — double-click
   it, or drag it into a browser tab. Do **not** start a dev server or use
   `localhost`. It should load instantly: no blank screen, no spinner, no
   error in the browser console (open DevTools → Console to check).

## Switching and figures

2. **Press every number key in turn: `1 2 3 4 5 6 7 8 9 0`.** The
   switcher strip should highlight the matching tab every time, and the
   main area should update immediately — a figure for 1/2/3, a plain
   "coming next phase" panel for the rest. No key should do nothing or
   throw an error.
3. **Module 1 — drag point A around the circle.** The chord, the dashed
   perpendicular from O, the right-angle mark, and the three readouts
   (d, c/2, r) should all track the drag with no lag, no flicker, and no
   digit jitter in the numbers.
4. **Module 2 — drag L slowly around the major arc for a couple of
   seconds.** A fading ghost trail should build up behind it, and the two
   big readouts (∠MLN and ∠MON) should hold the ×2 relationship the whole
   time — central always exactly twice inscribed, both updating together.
5. **Module 3 — turn on reverse mode and drag the chord (A or B).** The
   ∠ACB readout should update live, and the "this chord is a diameter"
   message should appear only at the moment the chord actually passes
   through O — not before, not after.

## Freeze (F)

6. **Press F.** Try to drag any point in the current module with the
   mouse (and with touch, if you're on the smartboard) — nothing should
   move.
7. **Press F again.** Dragging should resume immediately, no reload
   needed.
8. **While frozen, switch to a different module and back (e.g. press `2`
   then `1`).** The FROZEN badge should still be showing, and dragging
   should still be blocked — freezing survives a module switch.

## Hide (H)

9. **Press H.** Every numeric readout in the rail should blank to "—".
   Figure point labels (A, B, O, L, …) should stay fully visible — H
   hides numbers, not the figure.
10. **Press H again.** The readouts should reappear with the correct
    current values (not stale ones from before you hid them).

## Reset (R)

11. **Drag a couple of points out of position, flip a sub-toggle if the
    module has one, then press R.** The module should snap back to
    exactly its opening configuration — same points, same toggle states,
    same numbers. Do this twice in a row to confirm there's no drift.

## Presenter overlay (?)

12. **Press `?`.** A small dismissible key list should appear. Press `?`
    again — it should close. Open it once more and press `Escape` instead
    — it should also close.
13. **Switch modules and drag a few points with the overlay closed.**
    Confirm it never pops open by itself.

## Language (L)

14. **Press L.** Button labels, hints, and captions should switch to
    Bangla. Every figure's point letters (A, B, O, C, L, M, N, …) should
    stay Latin in both languages — only the chrome text changes.

## Offline

15. **With DevTools → Network tab open (or your network disconnected),
    repeat steps 2–5.** Zero requests should appear after the initial
    page load — no fonts, no images, no API calls, nothing.

---

## Result of the last self-run

Automated where practical (headless Chromium against the built,
`file://`-loaded `dist/index.html`); freeze/hide/reset/overlay were
scripted end-to-end, drag was scripted with synthetic pointer events per
module, and the network check was a full request log across every key.

| # | Check | Result |
|---|-------|--------|
| 1 | Loads via file://, no console errors | ✅ pass |
| 2 | All 10 number keys switch cleanly | ✅ pass |
| 3 | Module 1 drag updates live | ✅ pass |
| 4 | Module 2 ghost trail + ×2 holds | ✅ pass |
| 5 | Module 3 reverse-mode diameter detection | ✅ pass |
| 6 | F blocks dragging | ✅ pass |
| 7 | F again resumes dragging | ✅ pass |
| 8 | Freeze survives a module switch | ✅ pass |
| 9 | H blanks readouts, keeps labels | ✅ pass |
| 10 | H again restores correct values | ✅ pass |
| 11 | R restores opening config, no drift after repeats | ✅ pass |
| 12 | ? opens/closes, Escape closes | ✅ pass |
| 13 | Overlay never opens on its own | ✅ pass |
| 14 | L switches chrome to Bangla, figure letters stay Latin | ✅ pass |
| 15 | Zero network requests after initial load | ✅ pass |

15/15 passed on this build. Re-run by hand before the actual class at
least once, on the actual smartboard — this checklist confirms the app
behaves correctly, not that the room's touch input, projector contrast,
or camera framing are also fine.
