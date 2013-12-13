define([
  'vimflowy',
  'jquery.simulate',
  'jquery.simulate.ext',
  'jquery.simulate.key-sequence'],
  function(vimflowy) {

  // Namespace to hold delete operations
  var remove = {
    // Delete character under the cursor
    character: function(e) {
      $(e.target).simulate("key-sequence", {sequence: "{backspace}"});
    },

    // Delete line under the cursor
    line: function(e) {
      $(e.target).getProject().deleteIt();
    }
  };

  // Key bindings
  vimflowy.map('d', remove.line, 'normal', 'delete line under the cursor');
  vimflowy.map('x', remove.character, 'normal', 'delete character under the cursor');

  return remove;

})
