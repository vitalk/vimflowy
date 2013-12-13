require.config({
  paths: {
    "mustache": 'vendor/mustache/mustache',
    "mousetrap": 'vendor/mousetrap/mousetrap',
    "bililiteRange": 'vendor/jquery-simulate-ext/libs/bililiteRange',
    "jquery.simulate": 'vendor/jquery-simulate-ext/libs/jquery.simulate',
    "jquery.simulate.ext": 'vendor/jquery-simulate-ext/src/jquery.simulate.ext',
    "jquery.simulate.key-sequence": 'vendor/jquery-simulate-ext/src/jquery.simulate.key-sequence'
  }
})

require([
    'vimflowy',
    'ext/move',
    'ext/fold',
    'ext/help',
    'ext/insert',
    'ext/change',
    'ext/normal',
    'ext/remove'], function(vimflowy) {

    (function init() {
      vimflowy.log('Waiting until DOM ready...');
      if (!READY_FOR_DOCUMENT_READY) return setTimeout(init, 1e3);

      // OK, we're ready now, go to normal mode
      vimflowy.mode('normal');

      // Expose to globals for debug
      window.vimflowy = vimflowy;
    })();

})
