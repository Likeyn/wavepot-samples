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

export default function Notes(tuning = 440) {

  // Properties
  var self = this;
  var range = 12;
  var regxp = /^([A-G])(\d)?([#b])?(m)?/;
  var value = {'C':0, 'D':2, 'E':4, 'F':5, 'G':7, 'A':9, 'B':11, '#':1, 'b':-1};
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
    return Math.pow(2, (n - 33) / range) * self.tuning;
  };
  var _parse = function(s) {
    var m = regxp.exec(s);
    var r = value[m[1]];
    if (m[2]) { r += range * m[2]; }
    if (m[3]) { r += value[m[3]]; }
    return r;
  };

}

