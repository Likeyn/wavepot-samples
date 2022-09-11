/**
 * Attempt to Boney M - Rasputin using the Notes module
 *
 * @author Likeyn
 */

var bpm = 250;
var tuning = 440;

// Chords & instrumental
var voiceseq = [
  'B3', '-', 'B3', '-', 'A3', 'A3', 'A3', '-',
  'G3#', 'G3#', 'G3#', 'G3#', 'F3#', 'E3', 'D3#', '-',
  '-', 'A3', 'A3', 'A3', 'G3#', '-', 'G3#', '-',
  'F3#', 'F3#', 'E3', 'F3#', '-', '-', '-', '-',
];
var basseq = [
  'B', '-', 'B', 'C1#', 'D1', '-', 'D1', 'D1#',
  'E1', '-', '-', 'F1#', 'B1', 'F1#', 'B1', 'A1#',
  'A1', '-', 'A1', 'F1#', 'E1', '-', 'E1', 'F1#',
  'B1', 'F1#', 'A1', 'B1', '-', 'F1#', 'A1', 'B1'
];

// Get the Notes class to process the chords & instrumental line...
tuning *= 120 / bpm; // Adjust tuning to bpm
var notes = new Notes(tuning);
var bseq = basseq.map(notes.note);
var vseq = voiceseq.map(notes.note);

// Main
function dsp(t) {

  t *= bpm / 120;

  // ...then sequence the given arrays of frequencies...
  var vc = sequence(1/2, vseq, t);
  var bc = sequence(1/2, bseq, t);

  // ...before turning'em into an oscillation...
  var vo = osc(vc, t);
  var bo = osc(bc, t);

  // ...which we can then tweak and combine before returning.
  return (
      0.3 * env(1/2, vo, 0.2, 2, t)
    + 0.8 * env(1/2, bo, 2, 0.5, t)
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

