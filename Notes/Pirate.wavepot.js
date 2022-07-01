/**
 * Testing the Notes module with Jack Sparrow
 *
 * @author Likeyn
 */

var bpm = 143;
var tuning = 440;

// Chords & instrumental
var chordseq = [
  'D1m', 'B1b', 'C1', 'D1m',
  'B1b', 'F1', 'C1', 'D1m',
  'D1m', 'G1m', 'B1b', 'D1m',
  'B1b', 'D1m', 'A1', 'A1',
];
var instruseq = [
  'D2', '-', 'D2', '-', 'D2', 'E2',
  'F2', '-', 'F2', '-', 'F2', 'G2',
  'E2', '-', 'E2', '-', 'D2', 'C2',
  'D2', '-', '-', '-', 'A1', 'C2',
  'D2', '-', 'D2', '-', 'D2', 'E2',
  'F2', '-', 'F2', '-', 'F2', 'G2',
  'E2', '-', 'E2', '-', 'D2', 'C2',
  'D2', '-', '-', '-', 'A1', 'C2',
  'D2', '-', 'D2', '-', 'D2', 'F2',
  'G2', '-', 'G2', '-', 'G2', 'A2',
  'A2#', '-', 'A2#', 'A2', '-', 'G2',
  'A2', 'D2', '-', '-', 'D2', 'E2',
  'F2', '-', 'F2', '-', 'G2', '-',
  'A2', 'D2', '-', '-', 'D2', 'F2',
  'E2', '-', 'E2', '-', 'E2', 'D2',
  'E2', '-', '-', '-', 'A1', 'C2'
];

// Get the Notes class to process the chords & instrumental line...
tuning *= 120 / bpm; // Adjust tuning to bpm
var notes = new Notes(tuning);
var cseq = chordseq.map(notes.chord);
var iseq = instruseq.map(notes.note);

// Main
function dsp(t) {

  t *= bpm / 120;

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


/**
 * Notes module
 *
 * Accept notes in US notation and return frequencies matching the
 * corresponding note or chord
 * --------------------
 * The Notes class is capable of parsing the US notation and returning the
 * appropriate frequency, or array of frequencies in case of a chord.
 * Use the object's "note" and "chord" methods once instanciated:
 *
 *    var notes = new Notes();
 *    var a = notes.note('A1#m');
 *    var b = notes.chord('E2');
 *
 * The US notation is parsed that way:
 *
 *     A     1      # / b     m
 *     |     |        |       |
 *   note octave sharp/flat minor
 *
 * Anything but the note can be omitted. The default octave is 0 (lowest).
 *
 * Note: the parsing and note generation methods do not take alterations
 * like 7th, 9th, etc... into account yet.
 *
 * @module Notes
 * @author Likeyn
 */

function Notes(tuning = 440) {

  // Properties
  var self = this;
  var range = 12;
  var regxp = /^([A-G-])(\d)?([#b])?(m)?/;
  var value = {'C':0, 'D':2, 'E':4, 'F':5, 'G':7, 'A':9, 'B':11, '#':1, 'b':-1, '-':null};
  self.tuning = tuning;

  /**
   * Give a human-noted note and get a frequency
   *
   * @param note (string) - The note (e.g. A1#m)
   * @return (float) - The corresponding frequency
   */
  self.note = function(note) {
    return _note(_parse(note));
  };

  /**
   * Give a human-noted chord and get an array of frequencies
   *
   * @param chord (string) - The chord (e.g. A1#m)
   * @return (array) - The corresponding array of frequencies
   */
  self.chord = function(chord) {
    var n = _parse(chord);
    var m = regxp.exec(chord);
    return (m[4])
      ? [_note(n), _note(n + 3), _note(n + 7)] // Minor
      : [_note(n), _note(n + 4), _note(n + 7)] // Major
    ;
  };

  // Private methods
  var _note = function(n) {
    return Number.isInteger(n) ? Math.pow(2, (n - 33) / range) * self.tuning : 0;
  };
  var _parse = function(s) {
    var m = regxp.exec(s);
    var r = value[m[1]];
    if (m[2]) { r += range * m[2]; }
    if (m[3]) { r += value[m[3]]; }
    return r;
  };

}
