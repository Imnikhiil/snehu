let ctx: AudioContext | null = null;

/** Soft "whoosh" of breath, generated in code (no audio file needed). Only called from a click. */
export function playBlow() {
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    ctx = ctx ?? new AC();
    const c = ctx!;
    if (c.state === 'suspended') c.resume();
    const dur = 0.9;
    const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2);
    const src = c.createBufferSource();
    src.buffer = buf;
    const filter = c.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 900;
    filter.Q.value = 0.6;
    const gain = c.createGain();
    gain.gain.value = 0.12;
    src.connect(filter).connect(gain).connect(c.destination);
    src.start();
  } catch {
    /* sound is optional */
  }
}