#!/usr/bin/env python3
"""Original relaxed instrumental cues with a Balkan flavour for the first chapters of Serbian Summer.

Everything is synthesised from scratch with numpy (no samples, no third-party recordings): a plucked-string course
(tamburica/mandolin-like), a reed pad (accordion-like), a clarinet/flute lead, a bass, a frame drum and a shaker, mixed
with a circular reverb so that every cue loops without a seam. The tunes are original; what is Balkan about them is
the borrowed grammar: modes with a flat seventh or a raised fourth, additive meters (7/8 = 2+2+3, 5/8 = 2+3,
9/8 = 2+2+2+3) taken at an easy tempo, plucked arpeggios and small ornaments.

Usage:  python3 tools/music/compose_balkan.py [--out public/assets] [--only arrival,district]
Requires numpy and ffmpeg (AAC). Cues: arrival, district, bank, daily, rain (the first five), then evening, night, flat, walk, docs, clock.
"""
import argparse
import subprocess
import tempfile
import wave
from pathlib import Path

import numpy as np

SR = 44100
MODES = {
    'dorian': [0, 2, 3, 5, 7, 9, 10],
    'mixolydian': [0, 2, 4, 5, 7, 9, 10],
    'lydian': [0, 2, 4, 6, 7, 9, 11],
    'aeolian': [0, 2, 3, 5, 7, 8, 10],
    'ionian': [0, 2, 4, 5, 7, 9, 11],
}
CHORD_TONES = {'triad': [0, 2, 4], 'seventh': [0, 2, 4, 6]}


def hz(midi):
    return 440.0 * 2 ** ((np.asarray(midi, dtype=float) - 69) / 12)


def degree(mode, tonic, d):
    """Scale degree d (may be negative or above 6) of a mode, as a midi note."""
    steps = MODES[mode]
    return tonic + 12 * (d // 7) + steps[d % 7]


class Track:
    """A stereo loop. Notes that run past the end wrap round to the start, so the loop has no seam."""

    def __init__(self, seconds, seed):
        self.n = int(round(seconds * SR))
        self.l = np.zeros(self.n)
        self.r = np.zeros(self.n)
        self.rng = np.random.default_rng(seed)

    def _add(self, buf, sig, start):
        sig = sig[: self.n]
        end = start + len(sig)
        if end <= self.n:
            buf[start:end] += sig
        else:
            k = self.n - start
            buf[start:] += sig[:k]
            buf[: len(sig) - k] += sig[k:]

    def put(self, sig, t, pan=0.0, gain=1.0):
        start = int(round(t * SR)) % self.n
        self._add(self.l, sig * gain * np.cos((pan + 1) * np.pi / 4), start)
        self._add(self.r, sig * gain * np.sin((pan + 1) * np.pi / 4), start)

    def reverb(self, wet=0.22, seconds=1.7):
        """Circular convolution with a synthetic room, so the tail wraps into the start of the loop."""
        length = int(seconds * SR)
        t = np.arange(length) / SR
        shared = self.rng.normal(size=length)
        out = []
        for buf in (self.l, self.r):
            # Mostly shared between the channels, so the room stays natural and the mix holds up on a phone's single speaker.
            ir = (0.75 * shared + 0.25 * self.rng.normal(size=length)) * np.exp(-t * 3.6 / seconds * 1.7)
            ir = np.cumsum(ir)  # dark room: low-pass by integration
            ir -= np.convolve(ir, np.ones(2000) / 2000, mode='same')
            ir /= np.sqrt(np.sum(ir ** 2)) + 1e-9
            spectrum = np.fft.rfft(buf) * np.fft.rfft(ir, self.n)
            out.append((1 - wet) * buf + wet * np.fft.irfft(spectrum, self.n) * 0.9)
        self.l, self.r = out

    def finish(self, rms_db=-21.0, peak_limit=0.45):
        """Warm the sound (no rumble, a soft roll-off above 3 kHz), match the loudness of the older cues, fade the edges."""
        freqs = np.fft.rfftfreq(self.n, 1 / SR)
        curve = 1 / np.sqrt(1 + (freqs / 3200.0) ** 4)
        curve[freqs < 30] = 0
        for name in ('l', 'r'):
            setattr(self, name, np.fft.irfft(np.fft.rfft(getattr(self, name)) * curve, self.n))
        stereo = np.tanh(np.stack([self.l, self.r]) * 1.1)  # gentle tape-like saturation
        scale = 10 ** (rms_db / 20) / np.sqrt(np.mean(stereo ** 2))
        scale = min(scale, peak_limit / np.max(np.abs(stereo)))
        stereo *= scale
        edge = int(0.15 * SR)  # a short fade at both ends hides the gap that browsers leave when an audio file loops
        ramp = np.sin(np.linspace(0, np.pi / 2, edge)) ** 2
        stereo[:, :edge] *= ramp
        stereo[:, -edge:] *= ramp[::-1]
        return stereo


# ---- voices -----------------------------------------------------------------------------------------------------

def smooth_env(n, attack, release):
    env = np.ones(n)
    a, r = max(1, int(attack * SR)), max(1, int(release * SR))
    env[:a] = np.linspace(0, 1, a) ** 1.5
    env[-r:] *= np.linspace(1, 0, r) ** 1.5
    return env


def pluck(freq, dur, bright=0.8, rng=None):
    """Two slightly detuned strings with fast-decaying upper partials, a quick pick noise at the start."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = np.zeros(n)
    for course in (1.0, 1.0016):
        for h in range(1, 13):
            if freq * h > 9000:
                break
            amp = bright ** (h - 1) / h ** 1.05
            sig += amp * np.sin(2 * np.pi * freq * course * h * t * (1 + 0.00025 * h * h)) * np.exp(-t * (2.0 + 0.8 * h))
    if rng is not None:
        noise = np.diff(rng.normal(size=n + 1))
        sig += 0.16 * noise * np.exp(-t * 220)
    sig[:60] *= np.linspace(0, 1, 60)
    return sig * 0.22


def pad(freqs, dur, attack=0.55, release=1.0, rate=5.0):
    """Reed pad: stacked, slightly detuned reeds with a slow tremolo, like a softly played accordion."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = np.zeros(n)
    for f in freqs:
        for detune in (0.9985, 1.0015):
            for h in range(1, 8):
                sig += np.sin(2 * np.pi * f * detune * h * t + h) / h ** 1.2
    sig *= 1 + 0.05 * np.sin(2 * np.pi * rate * t)
    return sig * smooth_env(n, attack, release) * 0.026


def lead(freq, dur, kind='clarinet', vibrato=0.0035, rng=None):
    """Clarinet (odd partials) or flute (almost pure) with delayed vibrato and a little breath."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    depth = np.clip((t - 0.22) / 0.3, 0, 1) * vibrato
    inst = freq * (1 + depth * np.sin(2 * np.pi * 5.1 * t))
    phase = 2 * np.pi * np.cumsum(inst) / SR
    if kind == 'clarinet':
        harmonics = {1: 1.0, 2: 0.07, 3: 0.34, 4: 0.03, 5: 0.19, 7: 0.1, 9: 0.05}
    else:
        harmonics = {1: 1.0, 2: 0.16, 3: 0.06, 4: 0.02}
    sig = sum(a * np.sin(h * phase) for h, a in harmonics.items())
    if rng is not None:
        sig += 0.012 * np.diff(rng.normal(size=n + 1)) * (1 if kind == 'flute' else 0.5)
    return sig * smooth_env(n, 0.05, min(0.14, dur / 2)) * 0.2


def bass(freq, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = np.sin(2 * np.pi * freq * t) * np.exp(-t * 2.6) + 0.42 * np.sin(4 * np.pi * freq * t) * np.exp(-t * 5.5)
    sig[:80] *= np.linspace(0, 1, 80)
    return sig * 0.5


def doum(rng, vel=1.0):
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    pitch = 62 + 70 * np.exp(-t * 32)
    body = np.sin(2 * np.pi * np.cumsum(pitch) / SR) * np.exp(-t * 8.5)
    skin = np.diff(rng.normal(size=n + 1)) * np.exp(-t * 60) * 0.08
    return (body + skin) * 0.55 * vel


def tek(rng, vel=1.0, soft=False):
    n = int(0.16 * SR)
    t = np.arange(n) / SR
    snap = np.diff(rng.normal(size=n + 1)) * np.exp(-t * (95 if soft else 70)) * 0.17
    ring = np.sin(2 * np.pi * 330 * t) * np.exp(-t * 45) * 0.16
    return (snap + ring) * vel * 0.7


def shaker(rng, vel=1.0):
    n = int(0.09 * SR)
    t = np.arange(n) / SR
    return np.diff(rng.normal(size=n + 1)) * np.exp(-t * 85) * 0.07 * vel


# ---- arrangement -------------------------------------------------------------------------------------------------

def build(spec):
    """Render one cue from a spec: meter groups, eighth length, mode, chord roots per 8 bars, two melodies, layers."""
    meter = spec['groups']
    bar_len = sum(meter)
    starts = np.cumsum([0] + meter[:-1]).tolist()
    eighth = spec['eighth']
    bars = sum(count for count, _, _ in spec['form'])
    track = Track(bars * bar_len * eighth, spec['seed'])
    rng = track.rng
    mode, tonic = spec['mode'], spec['tonic']
    chords = spec['chords']
    bar = 0
    for count, layers, melody in spec['form']:
        for k in range(count):
            t0 = (bar + k) * bar_len * eighth
            root = chords[(bar + k) % len(chords)]
            notes = [degree(mode, tonic, root + off) for off in CHORD_TONES[spec.get('chord', 'triad')]]
            bar_dur = bar_len * eighth
            if 'pad' in layers:
                track.put(pad([hz(m) for m in notes] + [hz(notes[0] + 12)], bar_dur * 1.12, rate=4.8 + 0.6 * (k % 2)), t0 - 0.04, pan=-0.15, gain=spec['mix'].get('pad', 1))
            if 'bass' in layers:
                for beat, tone in ((starts[0], 0), (starts[-1], 2)):
                    track.put(bass(hz(notes[tone] - 12), eighth * (beat != starts[-1] and starts[1] or bar_len - beat) * 0.95 + 0.3), t0 + beat * eighth, pan=-0.05, gain=spec['mix'].get('bass', 1) * (1 if tone == 0 else 0.7))
            if 'pluck' in layers:
                for e in range(bar_len):
                    jitter = rng.normal(0, 0.006)
                    if e in starts:
                        for j, m in enumerate(notes):
                            track.put(pluck(hz(m), 1.1, rng=rng), t0 + e * eighth + j * 0.016 + jitter, pan=0.3 + 0.1 * j, gain=spec['mix'].get('pluck', 1) * 0.8)
                    else:
                        m = notes[(e * 2 + k) % len(notes)] + (12 if e % 3 == 0 else 0)
                        track.put(pluck(hz(m), 0.8, rng=rng), t0 + e * eighth + jitter, pan=0.45 if e % 2 else 0.15, gain=spec['mix'].get('pluck', 1) * 0.55)
            if 'drums' in layers:
                for e, kind in spec['drum_pattern'].items():
                    hit = {'D': doum(rng), 'T': tek(rng), 'k': tek(rng, 0.6, True)}[kind]
                    track.put(hit, t0 + e * eighth + rng.normal(0, 0.004), pan=-0.2 if kind == 'D' else 0.25, gain=spec['mix'].get('drums', 1))
            if 'shaker' in layers:
                for e in range(bar_len):
                    track.put(shaker(rng, 1.0 if e in starts else 0.55), t0 + e * eighth + eighth / 2 * spec.get('shaker_offbeat', 0), pan=0.5, gain=spec['mix'].get('shaker', 1))
            if melody is not None and 'lead' in layers:
                phrase = spec['melodies'][melody[0]]
                shift = melody[1]
                events = phrase[(k) % len(phrase)]
                pos = 0
                for d, length in events:
                    if d is not None:
                        m = degree(mode, spec['lead_tonic'], d + shift)
                        dur = length * eighth * 0.96
                        start = t0 + pos * eighth + rng.normal(0, 0.006)
                        if length >= 3 and spec.get('ornament', True) and (k + pos) % 3 == 0:
                            track.put(lead(hz(degree(mode, spec['lead_tonic'], d + shift + 1)), 0.07, spec['lead_kind'], 0, rng), start - 0.05, pan=0.0, gain=spec['mix'].get('lead', 1) * 0.6)
                        track.put(lead(hz(m), dur, spec['lead_kind'], rng=rng), start, pan=-0.05, gain=spec['mix'].get('lead', 1))
                    pos += length
        bar += count
    track.reverb(spec.get('wet', 0.22))
    return track.finish()


A = lambda *xs: list(xs)
CUES = {}

# Day 0, the first evening in a courtyard: D Dorian, 7/8 (2+2+3), unhurried.
CUES['arrival'] = dict(
    seed=11, groups=[2, 2, 3], eighth=0.30, mode='dorian', tonic=50, lead_tonic=62, lead_kind='clarinet',
    chords=[0, 6, 3, 0, 6, 3, 4, 0], mix=dict(pad=1.0, bass=0.9, pluck=0.9, drums=0.8, shaker=0.8, lead=1.0),
    drum_pattern={0: 'D', 2: 'T', 4: 'T', 5: 'k'},
    melodies={
        'A': [A((4, 2), (5, 1), (4, 2), (2, 2)), A((3, 3), (2, 2), (1, 2)), A((0, 2), (2, 2), (3, 3)), A((4, 4), (None, 3)),
              A((4, 2), (5, 1), (6, 2), (7, 2)), A((6, 3), (5, 2), (4, 2)), A((3, 2), (2, 2), (1, 1), (0, 2)), A((0, 5), (None, 2))],
        'B': [A((7, 2), (8, 2), (7, 3)), A((6, 2), (7, 2), (5, 3)), A((4, 2), (5, 2), (6, 3)), A((7, 4), (None, 3)),
              A((9, 2), (8, 1), (7, 2), (6, 2)), A((5, 2), (6, 2), (4, 3)), A((3, 2), (2, 2), (1, 3)), A((0, 4), (None, 3))]},
    form=[(8, {'pad', 'bass', 'shaker'}, None), (16, {'pad', 'bass', 'shaker', 'pluck', 'lead'}, ('A', 0)),
          (16, {'pad', 'bass', 'shaker', 'pluck', 'lead', 'drums'}, ('B', 0)), (8, {'pad', 'bass', 'pluck', 'lead'}, ('A', 0))])

# Day 1, looking for a district: G Mixolydian, an easy 4/4 with a walking pluck.
CUES['district'] = dict(
    seed=23, groups=[2, 2, 2, 2], eighth=0.34, mode='mixolydian', tonic=55, lead_tonic=67, lead_kind='flute',
    chords=[0, 0, 6, 3, 0, 4, 6, 0], mix=dict(pad=0.8, bass=1.0, pluck=1.1, drums=0.9, shaker=0.9, lead=1.0),
    drum_pattern={0: 'D', 3: 'k', 4: 'T', 6: 'k'}, shaker_offbeat=1,
    melodies={
        'A': [A((4, 2), (2, 2), (4, 2), (5, 2)), A((4, 3), (2, 1), (0, 4)), A((2, 2), (4, 2), (5, 2), (4, 2)), A((2, 4), (None, 4)),
              A((5, 2), (7, 2), (5, 2), (4, 2)), A((4, 3), (2, 1), (1, 4)), A((2, 2), (1, 2), (0, 2), (-1, 2)), A((0, 6), (None, 2))],
        'B': [A((7, 2), (9, 2), (7, 2), (6, 2)), A((5, 3), (4, 1), (2, 4)), A((4, 2), (5, 2), (7, 2), (5, 2)), A((4, 4), (None, 4)),
              A((9, 2), (11, 2), (9, 2), (7, 2)), A((6, 3), (5, 1), (4, 4)), A((5, 2), (4, 2), (2, 2), (1, 2)), A((0, 6), (None, 2))]},
    form=[(8, {'bass', 'pluck', 'shaker'}, None), (16, {'bass', 'pluck', 'shaker', 'lead', 'pad'}, ('A', 0)),
          (12, {'bass', 'pluck', 'shaker', 'lead', 'pad', 'drums'}, ('B', 0)), (4, {'bass', 'pluck', 'pad'}, None)])

# Day 2, the bank and the first work: A Mixolydian, a light 5/8 (2+3) that stays calm.
CUES['bank'] = dict(
    seed=37, groups=[2, 3], eighth=0.27, mode='mixolydian', tonic=57, lead_tonic=69, lead_kind='clarinet',
    chords=[0, 6, 3, 0, 0, 6, 3, 0], mix=dict(pad=0.9, bass=0.9, pluck=1.1, drums=0.7, shaker=0.9, lead=0.95),
    drum_pattern={0: 'D', 2: 'T', 4: 'k'},
    melodies={
        'A': [A((0, 2), (2, 3)), A((4, 2), (2, 3)), A((3, 2), (2, 1), (1, 2)), A((0, 3), (None, 2)),
              A((2, 2), (4, 3)), A((5, 2), (4, 1), (2, 2)), A((3, 2), (2, 2), (1, 1)), A((0, 5))],
        'B': [A((7, 2), (9, 3)), A((11, 2), (9, 3)), A((10, 2), (9, 1), (8, 2)), A((7, 3), (None, 2)),
              A((9, 2), (11, 3)), A((12, 2), (11, 1), (9, 2)), A((10, 2), (9, 2), (8, 1)), A((7, 5))]},
    form=[(8, {'bass', 'pluck', 'shaker'}, None), (24, {'bass', 'pluck', 'shaker', 'lead', 'pad'}, ('A', 0)),
          (24, {'bass', 'pluck', 'shaker', 'lead', 'pad', 'drums'}, ('B', 0)), (8, {'bass', 'pluck', 'pad'}, None)])

# Day 3 and the quiet days after it: F Lydian, a swaying 9/8 (2+2+2+3), the most open of the cues.
CUES['daily'] = dict(
    seed=41, groups=[2, 2, 2, 3], eighth=0.26, mode='lydian', tonic=53, lead_tonic=65, lead_kind='flute',
    chords=[0, 1, 4, 0, 5, 1, 4, 0], mix=dict(pad=1.1, bass=0.85, pluck=1.0, drums=0.7, shaker=0.7, lead=1.0),
    drum_pattern={0: 'D', 2: 'k', 4: 'T', 6: 'D', 8: 'k'},
    melodies={
        'A': [A((2, 3), (4, 3), (2, 3)), A((3, 2), (2, 2), (1, 2), (2, 3)), A((4, 3), (5, 3), (4, 3)), A((2, 5), (None, 4)),
              A((1, 3), (2, 3), (4, 3)), A((5, 2), (4, 2), (3, 2), (2, 3)), A((1, 2), (0, 2), (1, 2), (2, 3)), A((0, 6), (None, 3))],
        'B': [A((9, 3), (11, 3), (9, 3)), A((10, 2), (9, 2), (8, 2), (9, 3)), A((11, 3), (12, 3), (11, 3)), A((9, 5), (None, 4)),
              A((8, 3), (9, 3), (11, 3)), A((12, 2), (11, 2), (10, 2), (9, 3)), A((8, 2), (7, 2), (8, 2), (9, 3)), A((7, 6), (None, 3))]},
    form=[(8, {'pad', 'bass', 'shaker'}, None), (16, {'pad', 'bass', 'shaker', 'pluck', 'lead'}, ('A', 0)),
          (12, {'pad', 'bass', 'shaker', 'pluck', 'lead', 'drums'}, ('B', 0)), (4, {'pad', 'bass', 'pluck'}, None)], wet=0.26)

# A rainy café: A Dorian, very slow 4/4, mostly pad and a few plucked notes, a flute that says little.
CUES['rain'] = dict(
    seed=53, groups=[2, 2, 2, 2], eighth=0.40, mode='dorian', tonic=57, lead_tonic=69, lead_kind='flute', ornament=False,
    chords=[0, 6, 3, 0, 0, 6, 3, 0], mix=dict(pad=1.2, bass=0.8, pluck=0.7, shaker=0.5, lead=0.9),
    drum_pattern={}, shaker_offbeat=1,
    melodies={
        'A': [A((4, 4), (None, 4)), A((5, 2), (4, 2), (2, 4)), A((2, 4), (None, 4)), A((3, 2), (2, 2), (1, 4)),
              A((4, 3), (5, 1), (6, 4)), A((5, 2), (4, 2), (2, 4)), A((1, 4), (None, 4)), A((0, 6), (None, 2))],
        'B': [A((7, 4), (None, 4)), A((8, 2), (7, 2), (5, 4)), A((4, 4), (None, 4)), A((5, 2), (4, 2), (2, 4)),
              A((6, 3), (7, 1), (8, 4)), A((7, 2), (6, 2), (4, 4)), A((3, 4), (None, 4)), A((0, 6), (None, 2))]},
    form=[(8, {'pad', 'bass'}, None), (16, {'pad', 'bass', 'pluck', 'lead', 'shaker'}, ('A', 0)),
          (12, {'pad', 'bass', 'pluck', 'lead', 'shaker'}, ('B', 0)), (4, {'pad', 'bass'}, None)], wet=0.3)

# ---- more cues for days 0-5: one per mood, picked by place in public/music-cues.js ------------------------------------

# Evening by the river, in a kafana or on Ada: E Aeolian, a slow 6/8 (3+3) with a warm clarinet.
CUES['evening'] = dict(
    seed=61, groups=[3, 3], eighth=0.36, mode='aeolian', tonic=52, lead_tonic=64, lead_kind='clarinet',
    chords=[0, 6, 5, 6, 0, 3, 4, 0], mix=dict(pad=1.1, bass=0.9, pluck=1.0, drums=0.6, shaker=0.7, lead=1.0),
    drum_pattern={0: 'D', 3: 'T', 5: 'k'},
    melodies={
        'A': [A((4, 3), (2, 2), (3, 1)), A((4, 2), (3, 1), (2, 3)), A((2, 3), (1, 2), (0, 1)), A((0, 4), (None, 2)),
              A((4, 3), (5, 2), (4, 1)), A((7, 3), (6, 2), (5, 1)), A((4, 2), (3, 2), (2, 2)), A((0, 5), (None, 1))],
        'B': [A((7, 3), (6, 2), (7, 1)), A((8, 2), (7, 1), (6, 3)), A((5, 3), (4, 2), (5, 1)), A((4, 4), (None, 2)),
              A((7, 3), (9, 2), (8, 1)), A((7, 3), (6, 2), (5, 1)), A((4, 2), (3, 2), (2, 2)), A((0, 5), (None, 1))]},
    form=[(8, {'pad', 'bass', 'shaker'}, None), (16, {'pad', 'bass', 'shaker', 'pluck', 'lead'}, ('A', 0)),
          (16, {'pad', 'bass', 'shaker', 'pluck', 'lead', 'drums'}, ('B', 0)), (8, {'pad', 'bass', 'pluck'}, None)], wet=0.27)

# Late at night in the room: D Aeolian, very slow 4/4, almost no rhythm, a few flute notes over the pad.
CUES['night'] = dict(
    seed=67, groups=[2, 2, 2, 2], eighth=0.50, mode='aeolian', tonic=50, lead_tonic=62, lead_kind='flute', ornament=False,
    chords=[0, 5, 3, 6, 0, 5, 6, 0], mix=dict(pad=1.25, bass=0.75, pluck=0.65, lead=0.85),
    drum_pattern={},
    melodies={
        'A': [A((4, 4), (None, 4)), A((3, 3), (2, 1), (1, 4)), A((2, 4), (None, 4)), A((1, 2), (0, 2), (-1, 4)),
              A((0, 6), (None, 2)), A((2, 3), (3, 1), (4, 4)), A((3, 2), (2, 2), (1, 4)), A((0, 8))],
        'B': [A((7, 4), (None, 4)), A((6, 3), (5, 1), (4, 4)), A((5, 4), (None, 4)), A((4, 2), (3, 2), (2, 4)),
              A((2, 6), (None, 2)), A((4, 3), (5, 1), (6, 4)), A((5, 2), (4, 2), (3, 4)), A((0, 8))]},
    form=[(4, {'pad', 'bass'}, None), (12, {'pad', 'bass', 'pluck', 'lead'}, ('A', 0)),
          (8, {'pad', 'bass', 'pluck', 'lead'}, ('B', 0)), (4, {'pad', 'bass'}, None)], wet=0.32)

# Looking at flats: C Ionian, a bright, bouncy 6/8, plucked strings in front.
CUES['flat'] = dict(
    seed=71, groups=[3, 3], eighth=0.28, mode='ionian', tonic=48, lead_tonic=72, lead_kind='flute',
    chords=[0, 3, 4, 0, 0, 3, 4, 0], mix=dict(pad=0.7, bass=1.0, pluck=1.2, drums=0.9, shaker=1.0, lead=0.95),
    drum_pattern={0: 'D', 2: 'k', 3: 'T', 5: 'k'}, shaker_offbeat=1,
    melodies={
        'A': [A((4, 2), (2, 1), (4, 2), (5, 1)), A((4, 3), (2, 3)), A((2, 2), (3, 1), (4, 2), (2, 1)), A((0, 4), (None, 2)),
              A((5, 2), (4, 1), (5, 2), (7, 1)), A((7, 3), (5, 3)), A((4, 2), (2, 1), (1, 2), (2, 1)), A((0, 5), (None, 1))],
        'B': [A((7, 2), (9, 1), (7, 2), (5, 1)), A((4, 3), (5, 3)), A((7, 2), (8, 1), (9, 2), (7, 1)), A((7, 4), (None, 2)),
              A((9, 2), (11, 1), (9, 2), (7, 1)), A((7, 3), (4, 3)), A((5, 2), (4, 1), (2, 2), (1, 1)), A((0, 5), (None, 1))]},
    form=[(8, {'bass', 'pluck', 'shaker'}, None), (16, {'bass', 'pluck', 'shaker', 'lead', 'pad'}, ('A', 0)),
          (16, {'bass', 'pluck', 'shaker', 'lead', 'pad', 'drums'}, ('B', 0)), (8, {'bass', 'pluck', 'pad'}, None)])

# A stroll through the old streets and quays: E Mixolydian, a lilting 8/8 as 3+3+2.
CUES['walk'] = dict(
    seed=79, groups=[3, 3, 2], eighth=0.22, mode='mixolydian', tonic=52, lead_tonic=64, lead_kind='clarinet',
    chords=[0, 3, 0, 4, 0, 6, 3, 0], mix=dict(pad=0.9, bass=0.95, pluck=1.1, drums=0.8, shaker=0.9, lead=1.0),
    drum_pattern={0: 'D', 3: 'T', 5: 'k', 6: 'T'},
    melodies={
        'A': [A((2, 3), (4, 3), (2, 2)), A((3, 2), (2, 1), (1, 3), (0, 2)), A((2, 3), (4, 3), (5, 2)), A((4, 4), (2, 2), (None, 2)),
              A((5, 3), (7, 3), (5, 2)), A((4, 2), (5, 1), (4, 3), (2, 2)), A((1, 3), (2, 3), (1, 2)), A((0, 6), (None, 2))],
        'B': [A((7, 3), (9, 3), (7, 2)), A((6, 2), (7, 1), (5, 3), (4, 2)), A((5, 3), (7, 3), (9, 2)), A((7, 4), (5, 2), (None, 2)),
              A((9, 3), (11, 3), (9, 2)), A((8, 2), (9, 1), (7, 3), (5, 2)), A((4, 3), (5, 3), (4, 2)), A((0, 6), (None, 2))]},
    form=[(8, {'bass', 'pluck', 'shaker'}, None), (16, {'bass', 'pluck', 'shaker', 'lead', 'pad'}, ('A', 0)),
          (16, {'bass', 'pluck', 'shaker', 'lead', 'pad', 'drums'}, ('B', 0)), (8, {'bass', 'pluck', 'pad'}, None)])

# Papers and counters (day 4, the registration): A Aeolian, a patient 7/8 (3+2+2), flute and a light pluck.
CUES['docs'] = dict(
    seed=83, groups=[3, 2, 2], eighth=0.30, mode='aeolian', tonic=57, lead_tonic=69, lead_kind='flute',
    chords=[0, 4, 5, 3, 0, 4, 6, 0], mix=dict(pad=1.0, bass=0.9, pluck=1.1, drums=0.6, shaker=0.8, lead=0.95),
    drum_pattern={0: 'D', 3: 'k', 5: 'k'},
    melodies={
        'A': [A((2, 3), (1, 2), (2, 2)), A((4, 3), (2, 2), (1, 2)), A((0, 3), (2, 2), (3, 2)), A((2, 5), (None, 2)),
              A((4, 3), (5, 2), (4, 2)), A((3, 3), (2, 2), (1, 2)), A((2, 2), (1, 2), (0, 3)), A((0, 5), (None, 2))],
        'B': [A((7, 3), (6, 2), (7, 2)), A((9, 3), (7, 2), (6, 2)), A((5, 3), (7, 2), (8, 2)), A((7, 5), (None, 2)),
              A((9, 3), (8, 2), (7, 2)), A((6, 3), (5, 2), (4, 2)), A((5, 2), (4, 2), (2, 3)), A((0, 5), (None, 2))]},
    form=[(8, {'pad', 'bass', 'shaker'}, None), (16, {'pad', 'bass', 'shaker', 'pluck', 'lead'}, ('A', 0)),
          (16, {'pad', 'bass', 'shaker', 'pluck', 'lead', 'drums'}, ('B', 0)), (8, {'pad', 'bass', 'pluck'}, None)], wet=0.24)

# Counting the days (day 5): F Dorian, a ticking 3/4 with a steady shaker and a thoughtful flute.
CUES['clock'] = dict(
    seed=89, groups=[2, 2, 2], eighth=0.30, mode='dorian', tonic=53, lead_tonic=65, lead_kind='flute',
    chords=[0, 3, 4, 0, 3, 6, 4, 0], mix=dict(pad=0.9, bass=0.9, pluck=1.2, drums=0.7, shaker=1.3, lead=0.95),
    drum_pattern={0: 'D', 2: 'k', 4: 'k'},
    melodies={
        'A': [A((4, 2), (2, 2), (4, 2)), A((5, 2), (4, 2), (2, 2)), A((3, 2), (2, 2), (1, 2)), A((2, 4), (None, 2)),
              A((4, 2), (5, 2), (7, 2)), A((6, 2), (5, 2), (4, 2)), A((3, 2), (2, 2), (1, 2)), A((0, 4), (None, 2))],
        'B': [A((7, 2), (9, 2), (7, 2)), A((8, 2), (7, 2), (5, 2)), A((6, 2), (5, 2), (4, 2)), A((5, 4), (None, 2)),
              A((7, 2), (8, 2), (9, 2)), A((10, 2), (9, 2), (7, 2)), A((6, 2), (5, 2), (4, 2)), A((0, 4), (None, 2))]},
    form=[(8, {'pad', 'bass', 'shaker'}, None), (16, {'pad', 'bass', 'shaker', 'pluck', 'lead'}, ('A', 0)),
          (16, {'pad', 'bass', 'shaker', 'pluck', 'lead', 'drums'}, ('B', 0)), (8, {'pad', 'bass', 'pluck'}, None)], wet=0.2)


def write_m4a(stereo, path, bitrate='104k'):
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / 'cue.wav'
        pcm = (stereo.T * 32767).astype('<i2')
        with wave.open(str(wav), 'wb') as handle:
            handle.setnchannels(2)
            handle.setsampwidth(2)
            handle.setframerate(SR)
            handle.writeframes(pcm.tobytes())
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(wav), '-c:a', 'aac', '-b:a', bitrate, '-ar', str(SR), '-movflags', '+faststart', str(path)], check=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--out', default='public/assets')
    parser.add_argument('--only', default='')
    args = parser.parse_args()
    wanted = [name for name in args.only.split(',') if name] or list(CUES)
    for name in wanted:
        stereo = build(CUES[name])
        target = Path(args.out) / f'{name}-theme.m4a'
        write_m4a(stereo, target)
        print(f'{name}: {stereo.shape[1] / SR:.1f}s -> {target}')


if __name__ == '__main__':
    main()
