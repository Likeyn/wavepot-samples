/**
 * Try creating a Notes class which would accept notes given in US notation and
 * return frequencies matching the corresponding note or chord
 */

// Constants
var bpm = 120;
var tau = 2 * Math.PI;

// Notes class
function Notes(tuning = 440) {

  // Properties
  var self = this;
  var range = 12;
  var regxp = /^([A-G])(\d)?([#b])?(m)?/;
  var order = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  var value = {'C':0, 'D':2, 'E':4, 'F':5, 'G':7, 'A':9, 'B':11, '#':1, 'b':-1};
  self.tuning = tuning;

  // Methods
  var _note = function(n) {
    return Math.pow(2, (n - 33) / range) * self.tuning;
  };
  var _parse = function(s) {
    var m = regxp.exec(s);
    var r = value[m[1]];
    if (m[2]) { r += range * m[2]; }
    if (m[3]) { r += value[m[3]]; }
    return r;
  };
  self.note = function(n) {
    return _note(_parse(n));
  };
  self.chord = function(c) {
    var n = _parse(c);
    var m = regxp.exec(c);
    return (m[4])
      ? [_note(n), _note(n + 3), _note(n + 7)] // Minor
      : [_note(n), _note(n + 4), _note(n + 7)] // Major
    ;
  };
}

// Chords
var chordseq = [
  'Am',
  'F',
  'C1',
  'G',
];

var notes = new Notes();

// Main
function dsp(t) {
  var c = sequence(1/2, chordseq.map(notes.chord), t);
  return 0.8 * env(1/2, osc(c, t), 3, 3, t);
}

// Functions
function sequence(measure, seq, t){
  return seq[(t / measure / 2 | 0) % seq.length];
}
function env(measure, x, y, z, t){
  var ts = t / 2 % measure;
  return Math.sin(x * (Math.exp(-ts * y))) * Math.exp(-ts * z);
}
function osc(n, t) {
  var r = (n instanceof Array) ? n : [n];
  return r.reduce(function(previousValue, currentValue, index, array){
    return previousValue + tri(currentValue, t);
  }, 0);
}
function Noise() { return Math.random() * 2 - 1; }
function tri(x, t) { return Math.abs(1 - (2 * t * x) % 2) * 2 - 1; }

