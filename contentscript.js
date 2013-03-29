var scripts = [ 
    "jquery-simulate-ext/libs/bililiteRange.js",
    "jquery-simulate-ext/libs/jquery.simulate.js",
    "jquery-simulate-ext/src/jquery.simulate.ext.js",
    "jquery-simulate-ext/src/jquery.simulate.key-sequence.js",
    "vimflowy.js",
    "commands.js"
    ];

for (var i=0; i < scripts.length; i++) {
    var s = document.createElement('script');
    s.src = chrome.extension.getURL(scripts[i]);
    s.onload = function() {
        this.parentNode.removeChild(this);
    };
    (document.head||document.documentElement).appendChild(s);
}
