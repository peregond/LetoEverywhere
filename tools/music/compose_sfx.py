#!/usr/bin/env python3
"""Original ambience loops and short stingers for Serbian Summer, synthesised from noise and sine waves (no samples).

Ambience (`<name>-amb.m4a`, ~24 s loops, quiet, built in the frequency domain so every loop is periodic):
  rain, cafe, street, night, river, airport, office.
Stingers (`<name>-sting.m4a`, 1-4 s, played once on a story moment):
  key, stamp, signed, warm, decision, reveal, chime, ding.

Usage:  python3 tools/music/compose_sfx.py [--out public/assets/sfx] [--only rain,key]
Requires numpy and ffmpeg (AAC). Voices are borrowed from compose_balkan.py (pluck, pad, lead, doum, reverb).
"""
import argparse
from pathlib import Path

import numpy as np

import compose_balkan as cb
from compose_balkan import SR, Track, degree, hz, lead, pad, pluck, doum

LOOP = 24.0


# ---- building blocks ---------------------------------------------------------------------------------------------

def band_noise(n, rng, lo, hi, slope=0.0):
    """Noise limited to lo..hi Hz with a spectral slope (0 = white, -1 = pink-ish). Periodic over n samples by construction."""
    spec = rng.normal(size=n // 2 + 1) + 1j * rng.normal(size=n // 2 + 1)
    f = np.fft.rfftfreq(n, 1 / SR)
    shape = np.where((f >= lo) & (f <= hi), np.maximum(f, 1.0) ** (slope / 2), 0.0)
    out = np.fft.irfft(spec * shape, n)
    return out / (np.std(out) + 1e-9)


def slow(n, rng, cutoff=4.0):
    """A smooth, periodic random envelope in 0..1 that wanders at roughly `cutoff` Hz."""
    out = band_noise(n, rng, 0.05, cutoff)
    out = (out - out.min()) / (out.max() - out.min() + 1e-9)
    return out


def lfo(n, cycles, phase=0.0):
    """A sine that completes a whole number of cycles per loop, so the loop has no seam."""
    return 0.5 + 0.5 * np.sin(2 * np.pi * (np.arange(n) / n * round(cycles)) + phase)


def stereo_noise(n, rng, **kw):
    return band_noise(n, rng, **kw), band_noise(n, rng, **kw)


class Bed:
    """A stereo loop where events wrap round the end (reuses Track's placement logic)."""

    def __init__(self, seed):
        self.t = Track(LOOP, seed)
        self.n = self.t.n
        self.rng = self.t.rng

    def add(self, left, right, gain=1.0):
        self.t.l += left * gain
        self.t.r += right * gain

    def put(self, sig, t, pan=0.0, gain=1.0):
        self.t.put(sig, t, pan, gain)

    def result(self, rms_db=-30.0):
        stereo = np.stack([self.t.l, self.t.r])
        stereo *= 10 ** (rms_db / 20) / (np.sqrt(np.mean(stereo ** 2)) + 1e-9)
        stereo = np.clip(stereo, -0.6, 0.6)
        edge = int(0.03 * SR)  # a 30 ms dip is inaudible in noise and hides the player's loop gap
        ramp = np.sin(np.linspace(0, np.pi / 2, edge)) ** 2
        stereo[:, :edge] *= ramp
        stereo[:, -edge:] *= ramp[::-1]
        return stereo


def tick(rng, freq=3000.0, decay=260.0, dur=0.05):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return (np.sin(2 * np.pi * freq * t) + 0.6 * np.diff(rng.normal(size=n + 1))) * np.exp(-t * decay)


def clink(rng, base):
    """A cup or spoon: a few inharmonic partials that ring briefly."""
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    sig = sum(a * np.sin(2 * np.pi * base * r * t) * np.exp(-t * d) for a, r, d in ((1, 1, 14), (0.6, 2.32, 22), (0.4, 4.1, 34)))
    sig[:30] *= np.linspace(0, 1, 30)
    return sig * 0.5


def bird(rng, base):
    n = int(rng.uniform(0.07, 0.14) * SR)
    t = np.arange(n) / SR
    sweep = base * (1 + 0.35 * np.sin(2 * np.pi * rng.uniform(14, 26) * t) * np.exp(-t * 6) + 0.2 * t / t[-1])
    sig = np.sin(2 * np.pi * np.cumsum(sweep) / SR) * np.sin(np.pi * t / t[-1]) ** 2
    return sig


def cricket(rng, carrier):
    """A burst of four short pulses on a high carrier."""
    out = np.zeros(int(0.32 * SR))
    for k in range(4):
        n = int(0.035 * SR)
        t = np.arange(n) / SR
        pulse = np.sin(2 * np.pi * carrier * t) * np.sin(np.pi * t / t[-1]) ** 2
        s = int(k * 0.075 * SR)
        out[s:s + n] += pulse
    return out


# ---- ambience loops ----------------------------------------------------------------------------------------------

def amb_rain(seed=101):
    b = Bed(seed)
    n, rng = b.n, b.rng
    l, r = stereo_noise(n, rng, lo=600, hi=9000, slope=-0.8)
    b.add(l * 0.55, r * 0.55)
    l, r = stereo_noise(n, rng, lo=70, hi=320, slope=-1.2)
    b.add(l * 0.35 * (0.7 + 0.3 * lfo(n, 3)), r * 0.35 * (0.7 + 0.3 * lfo(n, 4, 1)))
    for _ in range(int(LOOP * 11)):
        f = rng.uniform(1400, 4200)
        b.put(tick(rng, f, rng.uniform(180, 420), 0.06) * rng.uniform(0.15, 0.5), rng.uniform(0, LOOP), pan=rng.uniform(-0.9, 0.9))
    return b.result(-31)


def amb_cafe(seed=103):
    b = Bed(seed)
    n, rng = b.n, b.rng
    for _ in range(4):  # a few overlapping voices that rise and fall like speech
        l, r = stereo_noise(n, rng, lo=180, hi=1300, slope=-0.6)
        env = slow(n, rng, 5.0) ** 2.5
        b.add(l * env * 0.45, r * env * 0.45)
    l, r = stereo_noise(n, rng, lo=60, hi=400, slope=-1.0)
    b.add(l * 0.2, r * 0.2)
    for _ in range(9):
        b.put(clink(rng, rng.uniform(2100, 3900)), rng.uniform(0, LOOP), pan=rng.uniform(-0.8, 0.8), gain=rng.uniform(0.04, 0.12))
    return b.result(-30)


def amb_street(seed=107):
    b = Bed(seed)
    n, rng = b.n, b.rng
    l, r = stereo_noise(n, rng, lo=50, hi=260, slope=-1.4)
    b.add(l * 0.7 * (0.6 + 0.4 * lfo(n, 2)), r * 0.7 * (0.6 + 0.4 * lfo(n, 3, 2)))
    l, r = stereo_noise(n, rng, lo=300, hi=2500, slope=-1.1)
    b.add(l * 0.18, r * 0.18)
    for start in (3.0, 11.0, 18.5):  # a car passing: filtered noise that swells and fades across the stereo field
        dur = 4.5
        m = int(dur * SR)
        t = np.linspace(0, 1, m)
        swell = np.sin(np.pi * t) ** 2.2
        body = band_noise(m, rng, 200, 1800, -1.0) * swell * 0.55
        direction = rng.choice([-1, 1])
        b.put(body, start, pan=0.0, gain=1.0)
        b.t.l[int(start * SR):int(start * SR) + m] += body * 0.3 * (1 - t) * (direction > 0) + body * 0.3 * t * (direction < 0)
    for centre in (2.0, 8.0, 15.0, 21.0):  # little groups of bird calls
        base = rng.uniform(3000, 4800)
        for k in range(int(rng.integers(3, 6))):
            b.put(bird(rng, base * rng.uniform(0.9, 1.15)), centre + k * rng.uniform(0.13, 0.3), pan=rng.uniform(-0.8, 0.8), gain=0.07)
    return b.result(-31)


def amb_night(seed=109):
    b = Bed(seed)
    n, rng = b.n, b.rng
    l, r = stereo_noise(n, rng, lo=90, hi=700, slope=-1.5)
    b.add(l * 0.5 * (0.45 + 0.55 * slow(n, rng, 0.4)), r * 0.5 * (0.45 + 0.55 * slow(n, rng, 0.4)))
    for carrier, pan in ((4150, -0.6), (4480, 0.4), (4780, 0.8)):
        t0 = rng.uniform(0, 0.6)
        while t0 < LOOP:
            b.put(cricket(rng, carrier * rng.uniform(0.99, 1.01)), t0, pan=pan, gain=0.06)
            t0 += rng.uniform(0.45, 0.9)
    return b.result(-32)


def amb_river(seed=113):
    b = Bed(seed)
    n, rng = b.n, b.rng
    for cycles in (7, 11):  # lapping: noise whose level follows slow waves
        l, r = stereo_noise(n, rng, lo=250, hi=3200, slope=-1.0)
        b.add(l * lfo(n, cycles) ** 2 * 0.4, r * lfo(n, cycles, 1.7) ** 2 * 0.4)
    l, r = stereo_noise(n, rng, lo=60, hi=500, slope=-1.5)
    b.add(l * 0.4 * (0.5 + 0.5 * slow(n, rng, 0.3)), r * 0.4 * (0.5 + 0.5 * slow(n, rng, 0.3)))
    for _ in range(18):  # soft bubbling plops
        f = rng.uniform(500, 1400)
        m = int(0.09 * SR)
        t = np.arange(m) / SR
        plop = np.sin(2 * np.pi * np.cumsum(f * (1 + 2.5 * t)) / SR) * np.exp(-t * 45)
        b.put(plop, rng.uniform(0, LOOP), pan=rng.uniform(-0.7, 0.7), gain=rng.uniform(0.05, 0.14))
    return b.result(-31)


def amb_airport(seed=127):
    b = Bed(seed)
    n, rng = b.n, b.rng
    l, r = stereo_noise(n, rng, lo=100, hi=1000, slope=-1.4)
    b.add(l * 0.5, r * 0.5)
    t = np.arange(n) / SR
    hum = (np.sin(2 * np.pi * 120 * t) + 0.5 * np.sin(2 * np.pi * 240 * t))  # 24 s x 120 Hz is a whole number of cycles
    b.add(hum * 0.08, hum * 0.08)
    for _ in range(3):
        l, r = stereo_noise(n, rng, lo=220, hi=1400, slope=-0.7)
        env = slow(n, rng, 3.0) ** 3
        b.add(l * env * 0.28, r * env * 0.28)
    chime = np.concatenate([np.sin(2 * np.pi * 784 * np.arange(int(0.5 * SR)) / SR) * np.exp(-np.arange(int(0.5 * SR)) / SR * 5),
                            np.sin(2 * np.pi * 659 * np.arange(int(0.9 * SR)) / SR) * np.exp(-np.arange(int(0.9 * SR)) / SR * 4)])
    b.put(chime, 14.0, pan=0.0, gain=0.07)
    return b.result(-31)


def amb_office(seed=131):
    b = Bed(seed)
    n, rng = b.n, b.rng
    t = np.arange(n) / SR
    b.add(np.sin(2 * np.pi * 100 * t) * 0.07, np.sin(2 * np.pi * 100 * t) * 0.07)
    l, r = stereo_noise(n, rng, lo=120, hi=700, slope=-1.3)
    b.add(l * 0.35, r * 0.35)
    for s in range(int(LOOP)):  # a clock on the wall
        b.put(tick(rng, 1800 if s % 2 else 1500, 520, 0.04), s + 0.0, pan=0.55, gain=0.1)
    for start in (4.0, 12.5, 19.0):  # paper
        m = int(0.4 * SR)
        env = np.sin(np.linspace(0, np.pi, m)) ** 2
        b.put(band_noise(m, rng, 2000, 7000, 0) * env, start, pan=rng.uniform(-0.6, 0.6), gain=0.07)
    for start in (7.0, 16.5):  # a few keys
        for k in range(int(rng.integers(7, 12))):
            b.put(tick(rng, rng.uniform(900, 1600), 380, 0.04), start + k * rng.uniform(0.08, 0.2), pan=-0.4, gain=0.08)
    return b.result(-31)


# ---- stingers ----------------------------------------------------------------------------------------------------

def sting_track(seconds, seed):
    return Track(seconds + 0.9, seed)  # a quiet tail, so the room's reverb is not wrapped into the start


def finish_sting(track, peak=0.5, wet=0.2):
    track.reverb(wet, 1.2)
    stereo = np.stack([track.l, track.r])
    stereo = np.tanh(stereo * 1.1)
    stereo *= peak / (np.max(np.abs(stereo)) + 1e-9)
    edge = int(0.02 * SR)
    stereo[:, :edge] *= np.linspace(0, 1, edge)
    tail = int(0.4 * SR)
    stereo[:, -tail:] *= np.linspace(1, 0, tail) ** 2
    return stereo


def bell(freq, dur=1.4, decay=3.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = sum(a * np.sin(2 * np.pi * freq * r * t) * np.exp(-t * decay * d) for a, r, d in ((1, 1, 1), (0.45, 2.76, 1.7), (0.2, 5.4, 2.6)))
    sig[:40] *= np.linspace(0, 1, 40)
    return sig * 0.3


def st_key(seed=201):
    tr = sting_track(1.4, seed)
    rng = tr.rng
    for k, off in enumerate((0.0, 0.07, 0.15, 0.2, 0.31, 0.38)):
        tr.put(clink(rng, rng.uniform(2800, 5200)) * 0.5, off, pan=rng.uniform(-0.3, 0.3))
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    clack = (band_noise(n, rng, 300, 3500, 0) * 0.5 + np.sin(2 * np.pi * 160 * t)) * np.exp(-t * 55)
    tr.put(clack * 0.8, 0.75, pan=-0.1)
    tr.put(clack * 0.5, 0.92, pan=-0.1)
    return finish_sting(tr, 0.5, 0.18)


def st_stamp(seed=203):
    tr = sting_track(1.0, seed)
    rng = tr.rng
    tr.put(doum(rng, 1.4), 0.0, pan=-0.1)
    n = int(0.2 * SR)
    tr.put(band_noise(n, rng, 800, 6000, 0) * np.exp(-np.arange(n) / SR * 40) * 0.5, 0.0)
    tr.put(pluck(hz(67), 0.9, rng=rng), 0.28, pan=0.2, gain=0.8)
    tr.put(pluck(hz(74), 0.9, rng=rng), 0.4, pan=0.3, gain=0.7)
    return finish_sting(tr, 0.55, 0.15)


def st_signed(seed=205):
    tr = sting_track(2.2, seed)
    rng = tr.rng
    n = int(0.7 * SR)
    env = (0.5 + 0.5 * np.sin(2 * np.pi * 7 * np.arange(n) / SR)) * np.sin(np.linspace(0, np.pi, n))
    tr.put(band_noise(n, rng, 1500, 6500, 0) * env * 0.5, 0.0, pan=0.2)
    for j, m in enumerate((60, 64, 67, 72)):
        tr.put(pluck(hz(m), 1.4, rng=rng), 0.85 + j * 0.11, pan=0.1 + 0.15 * j, gain=0.9)
    tr.put(pad([hz(60), hz(64), hz(67)], 1.8, 0.2, 1.2), 1.0, gain=1.0)
    return finish_sting(tr, 0.5, 0.25)


def st_warm(seed=207):
    tr = sting_track(3.4, seed)
    rng = tr.rng
    tr.put(pad([hz(57), hz(61), hz(64), hz(69)], 3.4, 0.9, 1.6), 0.0, gain=1.4)
    tr.put(lead(hz(76), 1.4, 'flute', rng=rng), 0.9, gain=1.0)
    tr.put(lead(hz(73), 1.2, 'flute', rng=rng), 2.0, gain=0.9)
    tr.put(pluck(hz(69), 1.6, rng=rng), 0.4, pan=0.3, gain=0.6)
    return finish_sting(tr, 0.45, 0.32)


def st_decision(seed=209):
    tr = sting_track(3.8, seed)
    rng = tr.rng
    tr.put(cb.bass(hz(38), 2.2), 0.0, gain=1.6)
    tr.put(pad([hz(50), hz(57), hz(62), hz(65)], 3.8, 1.2, 1.8), 0.1, gain=1.5)
    tr.put(lead(hz(74), 1.8, 'clarinet', rng=rng), 1.4, gain=1.0)
    tr.put(pluck(hz(62), 1.5, rng=rng), 1.2, pan=0.2, gain=0.7)
    return finish_sting(tr, 0.4, 0.35)


def st_reveal(seed=211):
    tr = sting_track(3.0, seed)
    rng = tr.rng
    n = int(1.6 * SR)
    t = np.arange(n) / SR
    drone = (np.sin(2 * np.pi * 55 * t) + 0.5 * np.sin(2 * np.pi * 55.6 * t) + 0.25 * np.sin(2 * np.pi * 110 * t)) * np.sin(np.linspace(0, np.pi, n)) ** 1.5
    tr.put(drone * 0.35, 0.0)
    tr.put(doum(rng, 1.0), 1.3, pan=-0.1)
    for j, m in enumerate((62, 66, 69)):
        tr.put(pluck(hz(m), 1.4, rng=rng), 1.55 + j * 0.09, pan=0.15 * j, gain=0.9)
    tr.put(lead(hz(78), 1.0, 'flute', rng=rng), 1.9, gain=0.8)
    return finish_sting(tr, 0.5, 0.3)


def st_chime(seed=213):
    tr = sting_track(2.0, seed)
    rng = tr.rng
    for j, m in enumerate((69, 73, 76, 81)):
        tr.put(bell(hz(m), 1.5), j * 0.16, pan=-0.3 + 0.2 * j)
    tr.put(pad([hz(57), hz(64), hz(69)], 2.0, 0.4, 1.2), 0.0, gain=0.8)
    return finish_sting(tr, 0.42, 0.28)


def st_ding(seed=215):
    tr = sting_track(1.2, seed)
    tr.put(bell(hz(79), 1.2, 3.6), 0.0, pan=-0.1)
    tr.put(bell(hz(84), 1.2, 3.6), 0.17, pan=0.1)
    return finish_sting(tr, 0.45, 0.2)


AMBIENCE = {'rain': amb_rain, 'cafe': amb_cafe, 'street': amb_street, 'night': amb_night, 'river': amb_river, 'airport': amb_airport, 'office': amb_office}
STINGS = {'key': st_key, 'stamp': st_stamp, 'signed': st_signed, 'warm': st_warm, 'decision': st_decision, 'reveal': st_reveal, 'chime': st_chime, 'ding': st_ding}


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--out', default='public/assets/sfx')
    parser.add_argument('--only', default='')
    args = parser.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    wanted = [name for name in args.only.split(',') if name]
    for table, suffix, bitrate in ((AMBIENCE, 'amb', '72k'), (STINGS, 'sting', '96k')):
        for name, make in table.items():
            if wanted and name not in wanted:
                continue
            stereo = make()
            target = out / f'{name}-{suffix}.m4a'
            cb.write_m4a(stereo, target, bitrate)
            print(f'{name}-{suffix}: {stereo.shape[1] / SR:.1f}s -> {target}')


if __name__ == '__main__':
    main()
