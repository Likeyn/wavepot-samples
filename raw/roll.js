/**
 * You wouldn't get this from any other guy
 */

var bpm = 220;
var tuning = 440;
var transpose = 12;

// Constants
var tau = 2 * Math.PI;

// Adjust tuning to bpm
tuning *= 120 / bpm;

// Chords and notes
var hat_note = note(7, 6);
var kick_note = note(2, -1);
var snare_note = note(7, -1);
var chords = [
  [10, 14, 17],
  [9, 12, 16],
].map(function(chord){
  return chord.map(function(n){
    return note(n);
  });
});
var chords_2 = [
  [12, 16, 19],
  [14, 17, 21],
].map(function(chord){
  return chord.map(function(n){
    return note(n);
  });
});
var bass_notes = [
  10, 12, 9, 14
].map(function(n){
    return note(n, -1);
});
/*var voice_notes = [
  21, 21,   , 21, 21,   , 19, 19, 19, 19,   ,   , 12, 14, 17, 14,
  19, 19,   , 19, 19,   , 17, 17,   ,   , 16, 14, 12, 14, 17, 14,
  17, 17, 17,   , 19,   , 16, 16, 16,   , 14,   , 12, 12, 12, 12,
  19, 19, 19,   , 17, 17, 17, 17,   ,   ,   ,   , 12, 14, 17, 14,

  21, 21,   , 21, 21,   , 19, 19, 19, 19,   ,   , 12, 14, 17, 14,
  24, 24, 24, 24, 16, 16, 17, 17, 17, 17, 16, 14, 12, 14, 17, 14,
  17, 17, 17,   , 19,   , 16, 16, 16,   , 14,   , 12, 12, 12, 12,
  19, 19, 19,   , 17, 17, 17, 17,   ,   ,   ,   , 12, 14, 17, 14,
].map(function(n){
    return note(n);
});*/
var voice_notes = [
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
var hat_pattern = [1.2, 0.6];
var snare_pattern = [0, 0, 1, 0];
var synth_pattern_1 = [
  1, 0.5, 0, 0,
  1, 0.5, 0, 0
];
var synth_pattern_2 = [
  0, 0, 0, 1, 0.5, 0.1, 0, 0,
  0, 0, 0, 1, 0.5, 0.1, 0, 0
];
var bass_pattern = [
  1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0,
  1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0,
  1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0,
  1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0
];
var voice_pattern = [
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

  // Rythm synth
  var c1 = sequence(2, chords, t);
  var c2 = sequence(2, chords_2, t);
  var synth_osc_1 =
    tri(c1[0], t)
  + tri(c1[1], t)
  + tri(c1[2], t)
  ;
  var synth_osc_2 =
    tri(c2[0], t)
  + tri(c2[1], t)
  + tri(c2[2], t)
  ;
  var synth = sequence(1/2, synth_pattern_1, t) * env(1, synth_osc_1, 1, 1, t)
  + sequence(1/4, synth_pattern_2, t) * env(1/16, synth_osc_2, 0, 0, t);

  // Bass
  var basseq = sequence(1, bass_notes, t);
  var bass_osc = 0.7 * tri(basseq, t);
  var bass = sequence(1/16, bass_pattern, t) * env(1/16, bass_osc, 5, 10, t);

  // Voice
  var voiceq = sequence(1/8, voice_notes, t);
  var voice_osc = 0.6 * tri(voiceq, t);
  var voice = sequence(1/8, voice_pattern, t) * env(1, voice_osc, 0, 0, t);

  // Drums
  var kick_osc = 1.0 * sin(kick_note, t);
  var kick = env(1, kick_osc, 10, 10, t);
  var hat_osc = 0.2 * tri(hat_note, t) + 0.4 * noise;
  var hat = sequence(1/4, hat_pattern, t) * env(1/4, hat_osc, 87, 18, t);
  var snare_osc = 0.7 * sin(snare_note, t) + 0.3 * noise;
  var snare = sequence(1/4, snare_pattern, t) * env(1/4, snare_osc, 14, 11, t);

  return 1 * (
    0.2 * synth
  + 0.3 * hat
  + 0.8 * kick
  + 0.6 * snare
  + 0.2 * bass
  + 0.3 * voice
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

