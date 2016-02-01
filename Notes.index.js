/**
 * Testing the Notes module with Jack Sparrow
 *
 * @author Likeyn
 */

import Notes from './index';

// Chords & instrumental
var chordseq = [
  'D1m', 'B1b', 'C1', 'D1m',
  'B1b', 'F1', 'C1', 'D1m',
  'D1m', 'G1m', 'B1b', 'D1m',
  'B1b', 'D1m', 'A1', 'A1',
];
var instruseq = [
  'A1', 'C2', 'D2', '-', 'D2', '-',
  'D2', 'E2', 'F2', '-', 'F2', '-',
  'F2', 'G2', 'E2', '-', 'E2', '-',
  'D2', 'C2', 'D2', '-', '-', '-',
  'A1', 'C2', 'D2', '-', 'D2', '-',
  'D2', 'E2', 'F2', '-', 'F2', '-',
  'F2', 'G2', 'E2', '-', 'E2', '-',
  'D2', 'C2', 'D2', '-', '-', '-',
  'A2', 'C2', 'D2', '-', 'D2', '-',
  'D2', 'F2', 'G2', '-', 'G2', '-',
  'G2', 'A2', 'A2#', '-', 'A2#', 'A2',
  '-', 'G2', 'A2', 'D2', '-', '-',
  'D2', 'E2', 'F2', '-', 'F2', '-',
  'G2', '-', 'A2', 'D2', '-', '-',
  'D2', 'F2', 'E2', '-', 'E2', '-',
  'E2', 'D2', 'E2', '-', '-', '-'
];

// Get the Notes class to process the chords & instrumental line...
var notes = new Notes();
var cseq = chordseq.map(notes.chord);
var iseq = instruseq.map(notes.note);

// Main
export function dsp(t) {

  // ...then sequence the given arrays of frequencies...
  var cc = sequence(1, cseq, t);
  var ic = sequence(1/6, iseq, t);

  // ...before turning'em into an oscillation...
  var co = osc(cc, t);
  var io = osc(ic, t);

  // ...which we can then tweak and combine before returning.
  return (
      0.6 * env(1/3, co, 3, 2, t)
    + 0.4 * env(1/2, co, 6, 6, t)
    + 0.8 * env(1/6, io, 1, 1, t)
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

