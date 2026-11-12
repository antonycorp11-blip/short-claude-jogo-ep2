# Task for Antigravity: new character drawings for episode 2

Read `~/shorts/CLAUDE.md` and `~/shorts/series/criamos-um-jogo-com-o-claude.md` first (SERIES RULE: same look as episode 1).
Work ONLY in `~/shorts/claude-jogo-ep2`. Edit only `web/roman.js` (then rebuild `web/toon.js` with
`cat web/toonbase.js web/roman.js > web/toon.js`), and create `work/test_cast.html` / `stills/` if needed.

Characters are flat 2D "bean-head" cards drawn on a 600x1000 canvas (soles at y=975) by `romanFront(p, outfitKey, opts)` in
`web/roman.js`, using the Pen API from `web/toonbase.js` (thick plum ink outlines, flat fills). Keep exactly that style.

## 1. Mascot "CLAUDE_BOT" (new key in OUTFITS + drawing branch)
An ORIGINAL friendly little robot, NOT any company logo. Rounded body like a soft bean/tablet, warm terracotta/orange
(#d9773f) with a cream face screen (#f6ead8) showing two simple dot eyes and a small smile, tiny antenna with a
glowing tip, stubby arms, and little hover jets under it instead of legs (floats a bit above the ground). Same ink outline style.
Expressions via `opts.expr`: `smile`, `wink`, `smug` (half-lidded eyes plus a sly smile, used when it starts "taking over"),
`serious`. Arm poses: `hang`, `wave`, `point`, `cross`. It must look good at any card scale (the story scales it from 0.5x to 1.6x).

## 2. CRIADOR side profile and walk
Add `opts.side` (-1 = facing left, 1 = facing right) to draw the SAME CRIADOR (purple hoodie, dark messy hair, headphones
on neck, jeans) in a 3/4-to-side profile: head turned, one eye, nose bump, body narrower, both legs visible. Combine with the
existing `opts.step` (0..1 walk phase) so the legs and arms swing naturally when walking. Also add the arm pose `reach`
(arm stretched forward/down, for reaching for the power plug) and a `yawn` expression (eyes shut, mouth open).

## 3. Test sheet
Render a character test sheet with Playwright at small size:
- CLAUDE_BOT in each expression and pose;
- CRIADOR side=1 at step 0, .25, .5, .75;
- CRIADOR side=-1 with `reach`;
- CRIADOR front with `yawn`.
You can do this with a tiny HTML page in work/ that imports web/toon.js and draws onto canvases, screenshotted with
`node` + playwright (it's installed: `import { chromium } from 'playwright'`). Save it as `stills/cast_sheet.png` and look at it. Fix
anything that looks broken (outline gaps, mirrored text, misaligned limbs). At most 3 iterations.

## Rules
- Run `node --check web/roman.js` after edits.
- Don't touch main.js, story.js, audio files or anything outside this folder.
- Finish by printing a short report: what you added, the option names, and the sheet path.
