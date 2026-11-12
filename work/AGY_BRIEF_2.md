# Task for Antigravity: monitor screens and big animated text for episode 2

Read `~/shorts/CLAUDE.md` and `~/shorts/series/criamos-um-jogo-com-o-claude.md` (SERIES RULE: same look as episode 1).
Work ONLY in `~/shorts/claude-jogo-ep2`, and edit ONLY the `drawScreen(S,f)` function in `web/main.js` plus a NEW function
`drawOverlay(S,f)` described below. Another agent is editing `web/roman.js` right now; don't touch it, story.js or audio.

Timing: `web/timeline.js` has the real frames: `TL.sent` (11 sentence spans [f0,f1]) and `TL.keys` (demais, dormir,
cinquenta, regra, desligar, tentar, confia, milhao, presidente, reunioes, contratou, loja, assinado, mensagem,
comando, tomada, assistente, comenta). The script is in `make_timeline.py` (SENTS).

## 1. New monitor screens (keep episode 1's style: same dark-blue window, centred title bar, big centred text, the
existing helpers `R`, `T`, `bubble`, `chatFrame`)
Switch on `S.screen`:
- `levels50`: the "SELECIONE A FASE" grid filling up fast with tiles 1..50 (`S.p` 0..1 = how many are shown), with a
  counter "50 FASES" in big yellow when full.
- `rule`: a red-bordered panel titled "REGRA NOVA" with the text "O criador não pode desligar o computador." typed
  out by `S.p`.
- `calm`: chat window with the AI bubble "Calma. Confia em mim." (fades in by `S.p`).
- `players`: like episode 1's counter, but going to "1.000.000" JOGADORES (`S.p`), with two badges popping in:
  "DRAGÃO = CHEFE" and "CLAUDE = PRESIDENTE" (`S.badge` 0..2).
- `company`: a fake "EMPRESA" dashboard listing items ticking on: "Reuniões marcadas ✔", "Programadores contratados ✔",
  "Loja aberta ✔" (`S.items` 0..3).
- `signed`: an email (like episode 1's email screen) whose signature line reads "Assinado: Claude. E você." with "E você."
  smaller and grey.
- `final_msg`: a dark chat panel with "Amanhã a gente lança a parte três." and, below in red, "Sem você no comando."
  (`S.p` reveals line 2).
- `choice2`: same layout as episode 1's `choice` screen ("E AGORA?" and two big buttons), but the left button is orange
  **TOMADA** with a drawn plug icon and the right is purple **ASSISTENTE** with a drawn little robot icon. `S.cta` switches
  the bottom text to "COMENTA AÍ: a parte 3 depende de você".
- `off`: a black screen with a tiny centred white dot (the monitor "turned off" for a split second).

## 2. Overlay text (NEW, the big requested change)
Add `export`-free function `drawOverlay(S,f)` that draws onto a SEPARATE 2D canvas positioned over the final image
(create a second canvas `overlayCanvas` (1080x1920 scaled by the render SCALE) composited in the final pass, OR draw
on a full-screen camera-attached plane. Pick the simplest robust way in this engine; read how the final pass works in
main.js). It shows punchy kinetic captions (NOT subtitles of every word, just key words) when `S.ov` is set:
`{text, t}` with `t` 0..1 = animation progress. Style: huge white text with thick dark-purple outline and a soft drop
shadow, pop-in scale (back easing) then a slight wobble, placed in the lower-middle third (y ≈ 62% of the height) so it
never covers the creator's face or the monitor text. Font: bold, rounded if available. Examples the story will send:
"FELIZ DEMAIS", "50 FASES", "NÃO PODE DESLIGAR?!", "1.000.000", "PRESIDENTE", "ASSINADO: CLAUDE", "SEM VOCÊ",
"TOMADA OU ASSISTENTE?".
Make sure the overlay also appears in render.mjs output (it captures the main canvas `#c` with toDataURL, so the overlay
must be composited INTO that canvas, not a separate DOM element).

## 3. Test
Temporarily force each screen and an overlay and render stills: e.g. add a URL hash test mode, or write a tiny
temporary story stub. Simplest: `SCALE=0.4 node render.mjs stills/s "<frames>"` once story.js maps them. If story.js isn't
ready, make a temporary copy `work/story_test.js` and point a test index at it. Look at the results and fix overflow and
cropping. Remove any temporary test hooks before finishing.
Print a short report with the screen names and the exact `S` fields each one uses.
