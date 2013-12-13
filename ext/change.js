define(['vimflowy'], function(vimflowy) {

  var change = {
    // Undo one last change
    undo: function(e) {
      undoredo.undo();
    },

    // Redo one change which were undone
    redo: function(e) {
      undoredo.redo();
    }
  };

  // Key bindings
  vimflowy.map('u', change.undo, 'normal', 'undo one last change');
  vimflowy.map('ctrl+r', change.redo, ['normal', 'insert'], 'redo one change which were undone');

  return change;

})
