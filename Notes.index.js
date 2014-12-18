/**
 * Testing the Notes module
 *
 * @author Likeyn
 */

import Notes from './index';

// Chords
var chordseq = [
  'D1m', 'B1b', 'C1', 'D1m',
  'B1b', 'F1', 'C1', 'D1m',
  'D1m', 'G1m', 'B1b', 'D1m',
  'B1b', 'D1m', 'A1', 'A1',
];

var notes = new Notes();

// Main
export function dsp(t) {

  // Get the Notes class to process the chords...
  var seq = chordseq.map(notes.chord);

  // ...then sequence the given array of frequencies...
  var c = sequence(1, seq, t);

  // ...before turning'em into an oscillation...
  var o = osc(c, t);

  // ...which we can then tweak and combine before returning.
  return (
      0.8 * env(1/3, o, 3, 2, t)
    + 0.4 * env(1/2, o, 6, 6, t)
  );
}

// Functions
function sequence(measure, seq, t){
  return seq[(t / measure | 0) % seq.length];
}
function env(measure, x, y, z, t){
  var ts = t % measure;
  return Math.sin(x * (Math.exp(-ts * y))) * Math.exp(-ts * z);
}
function osc(n, t) {
  var r = (n instanceof Array) ? n : [n];
  return r.reduce(function(previousValue, currentValue, index, array){
    return previousValue + (Math.abs(1 - (2 * t * currentValue) % 2) * 2 - 1);
  }, 0);
}

