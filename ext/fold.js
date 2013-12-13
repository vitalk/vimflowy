define(['vimflowy'], function(vimflowy) {

  // Namespace to hold folding operations
  var fold = {
    // Focus on current line, e.g. zoom in
    in: function(e) {
      $(e.target).keyboardZoomIn();
    },

    // Zoom out current fold
    out: function(e) {
      keyboardZoomOut();
    }
  }

  // Key bindings
  vimflowy.map('ctrl+l', fold.in, ['normal', 'insert'], 'zoom in');
  vimflowy.map('ctrl+h', fold.out, ['normal', 'insert'], 'zoom out');

  return fold;

})
