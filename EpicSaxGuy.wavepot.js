/**
 * PWAP
 */

var bpm = 480;
var tuning = 440;
var transpose = 12;

// Constants
var tau = 2 * Math.PI;

// Adjust tuning to bpm
tuning *= 120 / bpm;

// Chords and notes
var kick_note = note(2, -1);
var bass_notes = [
  14,14,14,14,14,14,14,14,
  10,10,10,10,10,10,10,10,
  5,5,5,5,5,5,5,5,
  9,9,9,9,9,9,9,9
].map(function(n){
    return note(n, -1);
});
var SAX_notes = [
  21, 21, 21, 21, 21, 21, 19, 19, 19, 19, 19, 19, 12, 14, 17, 14,
  19, 19, 19, 19, 19, 17, 17, 17, 17, 16, 16, 14, 12, 14, 17, 14,
  17, 17, 17, 17, 19, 19, 16, 16, 16, 16, 14, 14, 12, 12, 12, 12,
  19, 19, 19, 19, 17, 17, 17, 17, 17, 17, 17, 17, 12, 14, 17, 14,

  21, 21, 21, 21, 21, 21, 19, 19, 19, 19, 19, 19, 12, 14, 17, 14,
  24, 24, 24, 24, 16, 16, 17, 17, 17, 17, 16, 14, 12, 14, 17, 14,
  17, 17, 17, 17, 19, 19, 16, 16, 16, 16, 14, 14, 12, 12, 12, 12,
  19, 19, 19, 19, 17, 17, 17, 17, 17, 17, 17, 17, 12, 14, 17, 14
].map(function(n){
    return note(n);
});

// Patterns
var bass_pattern = [
  1, 0, 0, 1, 0, 0, 1, 0,
  1, 0, 0, 1, 0, 0, 1, 0,
  1, 0, 0, 1, 0, 0, 1, 0,
  1, 0, 0, 1, 0, 1, 0, 1
];
var SAX_pattern = [
  1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1,
  1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1,
  1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1,

  1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1,
  1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1
];

function dsp(t, f) {
  t *= bpm / 120;

  var noise = Noise();

  // Bass
  var basseq = sequence(1/2, bass_notes, t);
  var bass_osc = 0.7 * tri(basseq, t);
  var bass = sequence(1/2, bass_pattern, t) * env(1/2, bass_osc, 1, 1, t);

  // Voice
  var SAXseq = sequence(1/8, SAX_notes, t);
  var SAX_osc = 0.6 * tri(SAXseq, t);
  var SAX = sequence(1/8, SAX_pattern, t) * env(1, SAX_osc, 0, 0, t);

  // Drums
  var kick_osc = 1.0 * sin(kick_note, t);
  var kick = env(1, kick_osc, 10, 10, t);

  return 1 * (
    0.8 * kick
  + 0.4 * bass
  //+ 0.3 * SAX
  );
}

function sequence(measure, seq, t){
  return seq[(t / measure / 2 | 0) % seq.length];
}
function env(measure, x, y, z, t){
  var ts = t / 2 % measure;
  return Math.sin(x * (Math.exp(-ts * y))) * Math.exp(-ts * z);
}
function note(n, octave) {
  return Math.pow(2, (
    n + transpose - 33 + (12 * (octave || 0))
  ) / 12) * tuning; // A4 tuning
}

function Noise() { return Math.random() * 2 - 1; }
function sin(x, t) { return Math.sin(tau * t * x); }
function tri(x, t) { return Math.abs(1 - (2 * t * x) % 2) * 2 - 1; }

