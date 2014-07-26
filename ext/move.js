define([
  'vimflowy',
  'bililiteRange',
  'jquery.simulate',
  'jquery.simulate.ext',
  'jquery.simulate.key-sequence'],
  function(vimflowy) {

  var END_OF_LINE = -1,
      START_OF_LINE = 0;

  // Match any non-whitespace character
  var renonwhitespace = /\S+/g;


  function nextWordAt(str, pos) {
    var word;

    while (word = renonwhitespace.exec(str)) {
      if (word.index > pos) {
        // Start next search from the beginning of the string
        renonwhitespace.lastIndex = 0;

        // The index of current match
        return word.index;
      }
    }

    // Returns to start of line if nothing found to allow cycling
    return START_OF_LINE;
  }

  function previousWordAt(str, caret) {
    // Returns to the end of line if no previous word found to allow cycling
    var pos = END_OF_LINE,
        word;

    while (word = renonwhitespace.exec(str)) {
      if (word.index >= caret) {
        // Start next search from the beginning of the string
        renonwhitespace.lastIndex = 0;

        break;
      };

      pos = (word.index > pos) ? word.index : pos;
    }

    return pos;
  }

  // Namespace to hold movement operations
  var move = {
    // Moves caret to line above
    up: function(e) {
      $(e.target).upArrowHandler();
    },

    // Moves caret to line below
    down: function(e) {
      $(e.target).downArrowHandler();
    },

    // Moves caret left until the start of line
    left: function(e) {
      $(e.target).simulate("key-sequence", {sequence: "{leftarrow}", triggerKeyEvents: false });
    },

    // Moves caret right until the end of line
    right: function(e) {
      $(e.target).simulate("key-sequence", {sequence: "{rightarrow}", triggerKeyEvents: false });
    },

    // Moves caret to the end of line
    atEnd: function(e) {
      $(e.target).setCaret(END_OF_LINE);
    },

    // Moves caret to the beginning of line
    atStart: function(e) {
      $(e.target).setCaret(START_OF_LINE);
    },

    // Word motions
    word: {
      // Moves caret one word forward
      forward: function(e) {
        var obj = $(e.target),
            line = obj.getContentText();

        obj.setCaret(nextWordAt(line, obj.getCaret().start));
      },

      // Moves caret one word backward
      backward: function(e) {
        var obj = $(e.target),
            line = obj.getContentText();

        obj.setCaret(previousWordAt(line, obj.getCaret().start));
      }
    },

    // Line motions
    line: {
      // Moves current line up
      up: function(e) {
        $(e.target).getProject().moveProjectsUpOrDown('up');
      },

      // Moves current line down
      down: function(e) {
        $(e.target).getProject().moveProjectsUpOrDown('down');
      },

      // Add one more level to current line indentation
      right: function(e) {
        $(e.target).getProject().indentProjects();
      },

      // Deindent current line
      left: function(e) {
        $(e.target).getProject().outdentProjects();
      }
    }
  };

  // Key bindings
  vimflowy.map('h', move.left, 'normal', 'move cursor left');
  vimflowy.map('j', move.down, 'normal', 'move down');
  vimflowy.map('k', move.up, 'normal', 'move up');
  vimflowy.map('l', move.right, 'normal', 'move cursor right');
  vimflowy.map('H', move.atStart, 'normal', 'move cursor to the beginning of line');
  vimflowy.map('L', move.atEnd, 'normal', 'move cursor to the end of line');
  vimflowy.map('w', move.word.forward, 'normal', 'move one word forward');
  vimflowy.map('b', move.word.backward, 'normal', 'move one word backward');
  vimflowy.map('ctrl+k', move.line.up, ['normal', 'insert'], 'move current line up');
  vimflowy.map('ctrl+j', move.line.down, ['normal', 'insert'], 'move current line down');
  vimflowy.map('alt-shift-l', move.line.right, ['normal', 'insert'], 'increase indent');
  vimflowy.map('alt-shift-h', move.line.left, ['normal', 'insert'], 'decrease indent');

  return move;

});
