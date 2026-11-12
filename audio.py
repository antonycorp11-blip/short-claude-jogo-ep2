"""Synthesized music and sfx for episode 2; every cue is read from web/timeline.js."""
import numpy as np, subprocess, wave, re, os

SR = 48000
_tl = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'web', 'timeline.js')).read()
TOTAL = int(re.search(r'total\s*:\s*(\d+)', _tl).group(1))
SENT = [(int(a), int(b)) for a, b in re.findall(r'\[\s*(\d+)\s*,\s*(\d+)\s*\]', re.search(r'sent\s*:\s*\[(.*?)\]\s*,\s*keys', _tl, re.S).group(1))]
KEYS = {k: int(v) for k, v in re.findall(r'(\w+)\s*:\s*(\d+)', re.search(r'keys\s*:\s*\{(.*?)\}', _tl, re.S).group(1))}
assert len(SENT) == 11 and all(k in KEYS for k in 'demais dormir cinquenta regra desligar tentar confia milhao presidente reunioes contratou loja assinado mensagem comando tomada assistente comenta'.split())
DUR = TOTAL / 30
N = int(DUR * SR)
rng = np.random.default_rng(7)
t_all = np.arange(N) / SR

def env(n, a=0.005, r=0.2, sus=None):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / r)
    return e

def lp(x, k):  # one-pole low-pass, k in (0,1)
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)): acc += k * (x[i] - acc); y[i] = acc
    return y

def lp_fast(x, cutoff):
    # FFT brick-ish low-pass (fast, fine for beds)
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + (f / cutoff) ** 4); return np.fft.irfft(X, len(x)).astype(np.float32)

def hp_fast(x, cutoff):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 - 1 / (1 + (f / cutoff) ** 4); return np.fft.irfft(X, len(x)).astype(np.float32)

def place(buf, sig, t0, gain=1.0):
    i = int(t0 * SR); j = min(N, i + len(sig))
    if i < N and j > i: buf[i:j] += sig[: j - i] * gain

midi = lambda m: 440 * 2 ** ((m - 69) / 12)
def pluck(f, dur=0.35, bright=0.5):
    n = int(dur * SR); t = np.arange(n) / SR
    s = sum((bright ** k) * np.sin(2 * np.pi * f * (k + 1) * t) / (k + 1) for k in range(6))
    return (s * env(n, 0.003, dur * 0.35)).astype(np.float32)
def brass(fs, dur):
    n = int(dur * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for f in fs:
        ph = 2 * np.pi * f * t + 0.003 * np.sin(2 * np.pi * 5 * t)
        s += sum(np.sin((k + 1) * ph) / (k + 1) ** 1.3 for k in range(8))
    a = np.minimum(1, t / 0.08) * np.minimum(1, (dur - t) / 0.15).clip(0)
    return lp_fast((s * a).astype(np.float32), 1800) / len(fs)

# ---------------- music ----------------
music = np.zeros(N, np.float32)
def sq(f, dur, duty=0.5, a=0.004, r=0.12):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.where(np.mod(f * t, 1) < duty, 1.0, -1.0) * np.minimum(1, t / a) * np.exp(-t / r) * np.minimum(1, (dur - t) / 0.01).clip(0)
    return s.astype(np.float32)
def tri(f, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    return (2 * np.abs(2 * np.mod(f * t, 1) - 1) - 1).astype(np.float32) * np.minimum(1, (dur - t) / 0.01).clip(0) * np.exp(-t * 3)
def hat(): 
    n = int(0.05 * SR); t = np.arange(n) / SR
    return hp_fast(noise_(0.05), 6000) * np.exp(-t * 80) * 0.5
def noise_(d): return rng.standard_normal(int(d * SR)).astype(np.float32)
def kick():
    n = int(0.2 * SR); t = np.arange(n) / SR; f = 45 + 100 * np.exp(-t * 35)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 12)).astype(np.float32)
def snare():
    n = int(0.12 * SR); t = np.arange(n) / SR
    return hp_fast((noise_(0.12) * np.exp(-t * 30) * 0.6 + np.sin(2 * np.pi * 200 * t) * np.exp(-t * 25) * 0.4).astype(np.float32), 400)

K = KEYS
MUSIC_END = K['comando'] / 30
T_REGRA = K['regra'] / 30
S6 = SENT[5][0] / 30; S6END = SENT[5][1] / 30
BPM0 = 132; step0 = 60 / BPM0 / 2
def sqd(f, dur, duty=0.5, det=0.0, r=0.12):
    a = sq(f, dur, duty, r=r)
    if det: a = 0.5 * a + 0.5 * sq(f * 2 ** (det / 12), dur, duty, r=r)
    return a
prog_h = [(57, [57, 60, 64]), (53, [53, 57, 60]), (48, [48, 52, 55]), (55, [55, 59, 62])]  # Am F C G
prog_m = [(57, [57, 60, 64]), (53, [53, 56, 60]), (50, [50, 53, 57]), (52, [52, 56, 59])]  # Am Fdim-ish Dm E (ominous)
lead_pat = [0, 2, 1, 2, 0, 1, 2, 1, 2, 1, 0, 1, 2, 0, 1, 2]
tt = 0.0; n_step = 0
while tt < MUSIC_END - 1e-6:
    # ominous amount 0..1 grows from regra to the end of the music; tempo slows ~14%
    om = min(1, max(0, (tt - T_REGRA) / (MUSIC_END - T_REGRA)))
    step = step0 * (1 + 0.16 * om)
    bar = int(n_step / 16)
    root, ch = (prog_m if om > 0.05 else prog_h)[bar % 4]
    build = 1 if tt >= S6 - 1.5 else 0
    for k in range(16):
        ts = tt + k * step
        if ts >= MUSIC_END: break
        om = min(1, max(0, (ts - T_REGRA) / (MUSIC_END - T_REGRA)))
        g = 1.0 + (0.6 * min(1, max(0, (ts - S6) / max(S6END - S6, 1))) if ts >= S6 else 0)
        minor = om > 0.05
        m = ch[lead_pat[k]] + (24 if build and k % 2 else 12)
        if k % 2 == 0 or build:
            place(music, sqd(midi(m), step * 0.9, 0.25, det=(0.25 + 0.5 * om) if minor else 0), ts, 0.07 * g)
        place(music, tri(midi(root - 12), step * 0.95), ts, 0.30)
        if k % 4 == 0: place(music, kick(), ts, 0.5)
        if k % 8 == 4: place(music, snare(), ts, 0.28 * (1 - 0.3 * om))
        if k % 2 == 1 or build: place(music, hat(), ts, 0.14 * g)
        if build and k % 4 == 2: place(music, kick(), ts, 0.3)
    tt += step * 16; n_step += 16
# dead stop at comando
iend = int(MUSIC_END * SR); i0 = iend - int(.01 * SR)
music[i0:iend] *= np.linspace(1, 0, iend - i0, dtype=np.float32); music[iend:] = 0
# tense drone from comando to the end
dn = N - iend; td = np.arange(dn) / SR
drone = (np.sin(2 * np.pi * 55 * td) + 0.5 * np.sin(2 * np.pi * 58.3 * td) + 0.35 * np.sin(2 * np.pi * 82.4 * td) + 0.2 * np.sin(2 * np.pi * 116.5 * td)) * np.minimum(1, td / 1.0) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.4 * td))
place(music, lp_fast(drone.astype(np.float32), 500), MUSIC_END, 0.10)
def question():
    out = np.zeros(int(1.6 * SR), np.float32)
    for f, t0, d in [(midi(64), 0, 0.35), (midi(71), 0.28, 0.9)]:
        n = int(d * SR); t = np.arange(n) / SR
        s = (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t)) * np.minimum(1, t / 0.02) * np.exp(-t * 3)
        i = int(t0 * SR); out[i:i + n] += s.astype(np.float32)
    return out
place(music, question(), SENT[9][0] / 30, 0.18)

sfx = np.zeros(N, np.float32)
def noise(d): return rng.standard_normal(int(d * SR)).astype(np.float32)
def thunk(f0=90, d=0.3):
    n = int(d * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f0 * t * (1 + 0.6 * np.exp(-t * 40))) * np.exp(-t * 14) + lp_fast(noise(d), 1200) * np.exp(-t * 30) * 0.5).astype(np.float32)
def rumble(d):
    n = int(d * SR); t = np.arange(n) / SR
    s = lp_fast(noise(d), 160) * 3 * np.minimum(1, t / 0.15) * np.exp(-t / (d * 0.45))
    return s.astype(np.float32)
def crash(d=1.2):
    n = int(d * SR); t = np.arange(n) / SR; s = np.zeros(n, np.float32)
    for k in range(14):
        tk = rng.uniform(0, d * 0.6); i = int(tk * SR); g = thunk(rng.uniform(60, 160), 0.35) * rng.uniform(0.3, 0.9)
        s[i:i + len(g)] += g[: n - i]
    s += lp_fast(noise(d), 2500) * np.exp(-t * 3) * 0.25
    return s
def cuckoo():
    out = []
    for f, d in [(740, 0.16), (587, 0.24)]:
        n = int(d * SR); t = np.arange(n) / SR
        out.append(np.sin(2 * np.pi * f * t) * np.minimum(1, t / 0.01) * np.exp(-t * 6)); out.append(np.zeros(int(0.06 * SR)))
    return np.concatenate(out).astype(np.float32)
def scrape(d=0.8):
    n = int(d * SR); t = np.arange(n) / SR
    s = noise(d) * (0.5 + 0.5 * np.sin(2 * np.pi * 13 * t)) * np.sin(np.pi * t / d)
    s = hp_fast(lp_fast(s, 5000), 1500)
    ring = np.sin(2 * np.pi * 1870 * t) * np.exp(-t * 3) * 0.2
    return (s * 0.6 + ring).astype(np.float32)
def ting():
    n = int(1.2 * SR); t = np.arange(n) / SR
    return (sum(np.sin(2 * np.pi * f * t) * np.exp(-t * k) for f, k in [(2093, 4), (3136, 6), (4186, 8)]) * 0.3).astype(np.float32)
def sting():
    n = int(2.0 * SR); t = np.arange(n) / SR
    low = np.sin(2 * np.pi * 41 * t) * np.exp(-t * 1.5) * 1.2
    hit = lp_fast(noise(2.0), 900) * np.exp(-t * 6) * 0.8
    stab = brass([midi(45), midi(48), midi(51)], 1.4); s = low + hit; s[: len(stab)] += stab * 2.2 * np.exp(-np.arange(len(stab)) / SR * 2)
    return s.astype(np.float32)
def creak(d=0.6, f0=140):
    n = int(d * SR); t = np.arange(n) / SR
    rate = f0 * (1 + 0.35 * np.sin(2 * np.pi * 1.3 * t / d))
    ph = np.cumsum(rate) / SR; pulses = (np.mod(ph, 1) < 0.08).astype(np.float32)
    s = lp_fast(pulses * (0.6 + 0.4 * rng.random(n).astype(np.float32)), 2200) * np.sin(np.pi * t / d)
    return hp_fast(s, 200) * 2.5
def snap():
    d = 0.5; n = int(d * SR); t = np.arange(n) / SR
    return (hp_fast(noise(d), 800) * np.exp(-t * 18) * 1.4 + np.pad(thunk(120, 0.4), (0, n - int(0.4 * SR))) * 0.6).astype(np.float32)
def splash(d=1.0):
    n = int(d * SR); t = np.arange(n) / SR
    s = lp_fast(noise(d), 4000) * (np.exp(-t * 4) * np.minimum(1, t / 0.01)) + lp_fast(noise(d), 400) * np.exp(-t * 7) * 1.5
    return s.astype(np.float32)
def whoosh(d=0.5):
    n = int(d * SR); t = np.arange(n) / SR
    return (lp_fast(noise(d), 1500) * np.sin(np.pi * t / d) ** 2 * 0.6).astype(np.float32)
def snore(d=1.1):
    n = int(d * SR); t = np.arange(n) / SR
    buzz = (np.mod(np.cumsum(60 + 25 * np.sin(np.pi * t / d)) / SR, 1) < 0.3).astype(np.float32)
    return (lp_fast(buzz * 0.5 + noise(d) * 0.15, 700) * np.sin(np.pi * t / d) ** 2).astype(np.float32)
def leaves(d):
    n = int(d * SR); t = np.arange(n) / SR
    return (hp_fast(lp_fast(noise(d), 6000), 2500) * (0.3 + 0.3 * np.sin(2 * np.pi * 0.7 * t) ** 2) * np.minimum(1, t / 0.4) * np.minimum(1, (d - t) / 0.4)).astype(np.float32)
def water(d):
    n = int(d * SR); t = np.arange(n) / SR
    return (lp_fast(noise(d), 900) * 0.5 + hp_fast(lp_fast(noise(d), 3000), 1200) * 0.15 * (0.6 + 0.4 * np.sin(2 * np.pi * 0.4 * t))).astype(np.float32)

# ---------------- cues (all frames from timeline.js) ----------------
F = lambda f: f / 30
K = KEYS
def pew(d=0.18, f0=1800, f1=300):
    n = int(d * SR); t = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(f1 + (f0 - f1) * np.exp(-t * 18)) / SR
    return (np.sin(ph) * np.exp(-t * 9)).astype(np.float32)
def powerup(d=0.7):
    n = int(d * SR); t = np.arange(n) / SR; out = np.zeros(n, np.float32)
    for i, m in enumerate([72, 76, 79, 84, 88, 91]):
        a = int(i * d / 7 * SR); seg = sq(midi(m), 0.14, 0.5, r=0.2)
        out[a:a + len(seg)] += seg[: n - a]
    return out * 0.5
def pop(f=600):
    n = int(0.09 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * np.cumsum(f * (1 + 1.5 * np.exp(-t * 60))) / SR) * np.exp(-t * 40)).astype(np.float32)
def click():
    n = int(0.03 * SR); t = np.arange(n) / SR
    return (hp_fast(noise_(0.03), 2500) * np.exp(-t * 200) + np.sin(2 * np.pi * 1200 * t) * np.exp(-t * 150) * 0.3).astype(np.float32)
def roar(d=1.4):
    n = int(d * SR); t = np.arange(n) / SR
    s = lp_fast(noise_(d), 400) * (1 + 0.6 * np.sin(2 * np.pi * 28 * t)) * 3 + np.sin(2 * np.pi * 55 * t * (1 - 0.2 * t / d)) * 0.8
    return (s * np.minimum(1, t / 0.1) * np.exp(-t / (d * 0.5))).astype(np.float32)
def creepy_ding():
    n = int(1.6 * SR); t = np.arange(n) / SR
    return (sum(np.sin(2 * np.pi * f * t) * np.exp(-t * k) for f, k in [(185, 2.2), (196, 2.4), (370, 3.5)]) * 0.4).astype(np.float32)
def tickrun(f0, count, gap, g=0.25):
    for i in range(count):
        place(sfx, pop(700 + i * 60), f0 + i * gap(i), g * (0.6 + 0.4 * i / max(count - 1, 1)))
def cash():
    out = np.zeros(int(1.4 * SR), np.float32); t = np.arange(len(out)) / SR
    for f in [1568, 2093, 2637, 3136]:
        out += np.sin(2 * np.pi * f * t) * np.exp(-t * 4) * 0.25
    out += hp_fast(noise_(1.4), 5000) * np.exp(-t * 6) * 0.35
    for i, m in enumerate([72, 76, 79, 84]):
        seg = sq(midi(m), 0.12, 0.5, r=0.15); a = int(i * 0.07 * SR); out[a:a + len(seg)] += seg * 0.3
    return out
def blip():
    return np.concatenate([sq(midi(88), 0.07, 0.5, r=0.1), np.zeros(int(.03 * SR), np.float32), sq(midi(93), 0.1, 0.5, r=0.12)]) * 0.5


# ---- new synths for episode 2 ----
def chime(freqs=(1568, 2093, 2637, 3136), d=1.0, k=4, gap=0.06):
    out = np.zeros(int(d * SR), np.float32); t = np.arange(len(out)) / SR
    for i, f in enumerate(freqs):
        a = int(i * gap * SR); tt_ = t[: len(out) - a]
        out[a:] += (np.sin(2 * np.pi * f * tt_) * np.exp(-tt_ * k) * np.minimum(1, tt_ / 0.004)).astype(np.float32) * 0.3
    return out
def yawn(d=1.5):
    n = int(d * SR); t = np.arange(n) / SR
    f = 900 * np.exp(-t * 1.1) + 200 + 25 * np.sin(2 * np.pi * 5 * t)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) ** 0.7 * 0.5).astype(np.float32)
def night(d):
    n = int(d * SR); t = np.arange(n) / SR
    bed = lp_fast(noise_(d), 300) * 0.25
    cr = np.sin(2 * np.pi * 4300 * t) * (np.mod(t * 7, 1) < 0.25) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.5 * t)) * 0.05
    return ((bed + cr) * np.minimum(1, t / 0.5) * np.minimum(1, (d - t) / 0.6)).astype(np.float32)
def buzzer(d=0.7):
    n = int(d * SR); t = np.arange(n) / SR
    s = np.where(np.mod(110 * t, 1) < 0.5, 1, -1) + np.where(np.mod(116 * t, 1) < 0.5, 1, -1)
    return (lp_fast(s.astype(np.float32), 1500) * 0.3 * (np.mod(t * 6, 1) < 0.7) * np.minimum(1, (d - t) / 0.05)).astype(np.float32)
def bonk():
    n = int(0.5 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * np.cumsum(220 * np.exp(-t * 3) + 90) / SR) * np.exp(-t * 7) * 0.8 + np.sin(2 * np.pi * 330 * t) * np.exp(-t * 9) * 0.3).astype(np.float32)
def fanfare():
    out = np.zeros(int(1.6 * SR), np.float32)
    for t0, ms, d in [(0, [67], .12), (.13, [67], .12), (.26, [72], .12), (.45, [72, 76, 79, 84], 1.0)]:
        seg = sum(sq(midi(m), d, 0.5, r=d * 0.8) for m in ms) * (0.3 / len(ms) ** .5)
        a = int(t0 * SR); out[a:a + len(seg)] += seg
    return out
def stamp():
    n = int(0.3 * SR); t = np.arange(n) / SR
    return (thunk(75, 0.3) * 1.0 + hp_fast(noise_(0.3), 1500) * np.exp(-t * 60) * 0.5).astype(np.float32)
def scribble(d=0.7):
    n = int(d * SR); t = np.arange(n) / SR
    s = hp_fast(lp_fast(noise_(d), 6000), 2000) * (0.4 + 0.6 * np.abs(np.sin(2 * np.pi * 9 * t))) * np.sin(np.pi * t / d)
    return (s * 0.8).astype(np.float32)
def ping(f=1760):
    n = int(0.7 * SR); t = np.arange(n) / SR
    return ((np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 1.5 * t)) * np.exp(-t * 7) * 0.4).astype(np.float32)
def zap(d=0.35):
    n = int(d * SR); t = np.arange(n) / SR
    s = np.where(np.mod(np.cumsum(2500 * np.exp(-t * 8) + 300) / SR, 1) < 0.5, 1, -1) * np.exp(-t * 9) + hp_fast(noise_(d), 3000) * np.exp(-t * 25)
    return (s * 0.5).astype(np.float32)
def robot():
    return np.concatenate([sq(midi(81), 0.06, 0.25, r=0.1), np.zeros(int(.03 * SR), np.float32), sq(midi(88), 0.06, 0.25, r=0.1), np.zeros(int(.03 * SR), np.float32), sq(midi(84), 0.1, 0.25, r=0.15)]) * 0.5
def counter_run(f0, f1, n, base=500, g=0.16):
    for i in range(n):
        f = f0 + (f1 - f0) * (i / (n - 1)) ** 1.3
        place(sfx, pop(base + 60 * i), F(f), g * (0.6 + 0.8 * i / (n - 1)))

# ---------------- cues (all frames from timeline.js) ----------------
place(sfx, chime(), F(K['demais']), .5); place(sfx, powerup(.5), F(K['demais'] - 3), .12)
# sentence 2: night ambience + yawn
a2, b2 = SENT[1]
place(sfx, night((b2 - a2 + 20) / 30), F(a2 - 6), .5)
place(sfx, yawn(), F(K['dormir'] - 12), .5)
# 50-tick tile cascade ending at cinquenta
n50 = 50; s50 = K['cinquenta'] - 62
for i in range(n50):
    f = s50 + (K['cinquenta'] - s50) * (i / (n50 - 1)) ** 0.8
    place(sfx, pop(450 + 25 * i), F(f), .10 + .12 * i / n50)
place(sfx, chime((2093, 3136), .6, 6), F(K['cinquenta']), .35)
place(sfx, buzzer(), F(K['regra']), .5)
place(sfx, click(), F(K['tentar'] - 4), .8); place(sfx, bonk(), F(K['tentar']), .6)
place(sfx, chime((1319, 1568, 1976), 1.6, 2.5, .12), F(K['confia']), .4)
counter_run(SENT[5][0] + 6, K['milhao'] - 4, 24)
place(sfx, cash(), F(K['milhao']), .6); place(sfx, hp_fast(lp_fast(noise_(1.4), 3500), 500) * np.exp(-np.arange(int(1.4 * SR)) / SR * 2.5) * 0.5, F(K['milhao']), .5)
place(sfx, fanfare(), F(K['presidente']), .5)
for k in ('reunioes', 'contratou', 'loja'): place(sfx, stamp(), F(K[k]), .75)
place(sfx, scribble(), F(K['assinado'] - 6), .5)
place(sfx, ping(), F(K['mensagem']), .5)
place(sfx, sting(), F(K['comando']), .8)
place(sfx, zap(), F(K['tomada']), .55); place(sfx, robot(), F(K['assistente']), .5)
place(sfx, pop(700), F(K['comenta']), .4)

def write(name,x):
    raw=np.asarray(x,dtype='<f4').tobytes()
    subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','1','-i','-','-c:a','pcm_f32le',name],input=raw,check=True)
write('music.wav',music);write('sfx.wav',sfx)
print(f'music.wav and sfx.wav: {N} samples, {DUR:.3f} s at {SR} Hz')
