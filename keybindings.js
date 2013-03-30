/**
 * Vimflowy available key bindings.
 */
(function() {
    var root = (typeof exports !== 'undefined' && exports !== null) ? exports : window;

    var Vimflowy = root.Vimflowy;

    // TODO: map default keybindings here

    // expose to globals
    root.vimflowy = Vimflowy(debug=true);

}).call(this);
