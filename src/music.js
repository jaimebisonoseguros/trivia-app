let ctx = null
let stopped = false
let timeouts = []

const BPM = 128
const BEAT = 60 / BPM

// Melody notes (Hz) — upbeat game show loop
const MELODY = [
  523, 659, 784, 880, 784, 659, 523, 0,
  659, 784, 880, 988, 880, 784, 659, 0,
  523, 659, 784, 880, 988, 880, 784, 659,
  523, 440, 523, 659, 523, 0, 0, 0,
]

// Bass line
const BASS = [
  262, 0, 262, 0, 330, 0, 330, 0,
  294, 0, 294, 0, 370, 0, 370, 0,
  262, 0, 262, 0, 330, 0, 330, 0,
  220, 0, 247, 0, 262, 0, 0, 0,
]

function playNote(freq, startTime, dur, type = 'sine', vol = 0.12) {
  if (!ctx || freq === 0) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(vol, startTime)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur * 0.85)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(startTime)
  osc.stop(startTime + dur)
}

function scheduleLoop(startTime) {
  if (stopped) return
  const loopDur = MELODY.length * BEAT * 0.5

  MELODY.forEach((freq, i) => {
    const t = startTime + i * BEAT * 0.5
    playNote(freq, t, BEAT * 0.45, 'sine', 0.12)
  })

  BASS.forEach((freq, i) => {
    const t = startTime + i * BEAT * 0.5
    playNote(freq, t, BEAT * 0.45, 'triangle', 0.08)
  })

  const id = setTimeout(() => scheduleLoop(startTime + loopDur), (loopDur - 0.1) * 1000)
  timeouts.push(id)
}

export function startMusic() {
  stopped = false
  ctx = new (window.AudioContext || window.webkitAudioContext)()
  scheduleLoop(ctx.currentTime + 0.05)
}

export function stopMusic() {
  stopped = true
  timeouts.forEach(clearTimeout)
  timeouts = []
  if (ctx) {
    ctx.close()
    ctx = null
  }
}

// ── Romantic melody ──
// Slow ballad in A minor — Am F C G progression
const R_BPM = 62
const R_BEAT = 60 / R_BPM
const R_SLOT = R_BEAT * 0.5

// Melody: descending/ascending lines, very legato
const R_MELODY = [
  659, 587, 523, 494,   // E5 D5 C5 B4
  440, 0,   494, 0,     // A4    B4
  523, 587, 659, 0,     // C5 D5 E5
  587, 523, 494, 440,   // D5 C5 B4 A4

  523, 494, 440, 392,   // C5 B4 A4 G4
  349, 0,   392, 0,     // F4    G4
  440, 494, 523, 0,     // A4 B4 C5
  494, 440, 392, 0,     // B4 A4 G4
]

// Gentle arpeggio accompaniment (Am F C G)
const R_ARPEGGIO = [
  220, 330, 440, 330,   // Am
  175, 262, 349, 262,   // F
  196, 262, 330, 262,   // C/G
  196, 247, 330, 247,   // G

  220, 330, 440, 330,   // Am
  175, 262, 349, 262,   // F
  196, 262, 330, 262,   // C/G
  196, 247, 294, 247,   // G7
]

let rCtx = null
let rStopped = false
let rTimeouts = []

function playRNote(freq, startTime, dur, vol = 0.1) {
  if (!rCtx || freq === 0) return
  const osc = rCtx.createOscillator()
  const gain = rCtx.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(vol, startTime + 0.08)
  gain.gain.setValueAtTime(vol, startTime + dur * 0.7)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur * 0.98)
  osc.connect(gain)
  gain.connect(rCtx.destination)
  osc.start(startTime)
  osc.stop(startTime + dur)
}

function scheduleRomanticLoop(startTime) {
  if (rStopped) return
  const loopDur = R_MELODY.length * R_SLOT

  R_MELODY.forEach((freq, i) => {
    playRNote(freq, startTime + i * R_SLOT, R_SLOT * 1.1, 0.11)
  })
  R_ARPEGGIO.forEach((freq, i) => {
    playRNote(freq, startTime + i * R_SLOT, R_SLOT * 0.6, 0.055)
  })

  const id = setTimeout(() => scheduleRomanticLoop(startTime + loopDur), (loopDur - 0.15) * 1000)
  rTimeouts.push(id)
}

export function startRomanticMusic() {
  rStopped = false
  rCtx = new (window.AudioContext || window.webkitAudioContext)()
  scheduleRomanticLoop(rCtx.currentTime + 0.05)
}

export function stopRomanticMusic() {
  rStopped = true
  rTimeouts.forEach(clearTimeout)
  rTimeouts = []
  if (rCtx) {
    rCtx.close()
    rCtx = null
  }
}
