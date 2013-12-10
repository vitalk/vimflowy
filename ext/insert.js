define(['vimflowy', 'ext/move'], function(vimflowy, move) {

  // Namespace to hold insert operations
  var insert = {
    // Insert text before the cursor
    before: function(e) { vimflowy.mode('insert'); },

    // Append text after the cursor
    after: function(e) {
      var obj = $(e.target);
      obj.setCaret(obj.getCaret().start + 1);
      insert.before(e);
    },

    // Insert text at beginning of the line
    atStart: function(e) {
      move.atStart(e);
      insert.before(e);
    },

    // Append text at the end of the line
    atEnd: function(e) {
      move.atEnd(e);
      insert.after(e)
    },

    // Create a new line above the cursor and insert text
    above: function(e) {
      move.atStart(e);
      $(e.target).returnHandler();
      move.up(e);
      insert.before(e);
    },

    // Create a new line below the cursor and insert text
    below: function(e) {
      move.atEnd(e);
      $(e.target).returnHandler();
      move.down(e);
      insert.before(e);
    }
  };

  // Key bindings
  vimflowy.map('i', insert.before, 'normal', 'insert text before the cursor');
  vimflowy.map('I', insert.atStart, 'normal', 'insert text at the beginning of the line');
  vimflowy.map('a', insert.after, 'normal', 'append text after the cursor');
  vimflowy.map('A', insert.atEnd, 'normal', 'append text at the end of the line');
  vimflowy.map('o', insert.below, 'normal', 'create a new line below');
  vimflowy.map('O', insert.above, 'normal', 'create a new line above');

  return insert;

})
