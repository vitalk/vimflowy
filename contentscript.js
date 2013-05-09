var scripts = [ 
    "vendor/jquery-simulate-ext/libs/bililiteRange.js",
    "vendor/jquery-simulate-ext/libs/jquery.simulate.js",
    "vendor/jquery-simulate-ext/src/jquery.simulate.ext.js",
    "vendor/jquery-simulate-ext/src/jquery.simulate.key-sequence.js",
    "vendor/mustache.js/mustache.js",
    "unbind-esc-key-back.js",
    "vimflowy.js",
    "commands.js",
    "keybindings.js",
    "help-page.js"
    ];

for (var i=0; i < scripts.length; i++) {
    var s = document.createElement('script');
    s.src = chrome.extension.getURL(scripts[i]);
    s.onload = function() {
        this.parentNode.removeChild(this);
    };
    (document.head||document.documentElement).appendChild(s);
}
