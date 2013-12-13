define(['vimflowy', 'ext/remove'], function(vimflowy, remove) {

  var normal = {
    start: function(e) { vimflowy.mode('normal'); }
  };

  // Key bindings
  vimflowy.map('ctrl+[', normal.start, 'insert', 'enter normal mode');

  return normal;

})
