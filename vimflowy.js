/**
 * Vimflowy chrome extension.
 *
 * Simulate Vim keybindings on workflowy.
 *
 * @version: 0.1.1
 * @author: Leila Zilles
 * @contributor: Vital Kudzelka
 */
(function() {
    /**
     * The Vimflowy core
     *
     * @param {Boolean} debug Run on debug mode
     */
    function Vimflowy(debug) {
        if (!(this instanceof Vimflowy)) {
            return new Vimflowy(debug);
        }

        // log all messages into console
        this.debug = debug;

        // current extension version
        this.version = (function() {
            return JSON.parse(fetchFileContent('manifest.json') || '{"version":"unknown"}').version;
        }());

        // commands registry
        this.commands = this.Commands();

        // holds all binded keys and associated handlers
        this.keybindings = {};

        // editor textarea to bind keys to
        this.editor = $(".editor > textarea");

        // current mode
        this.mode = 'normal';
    }

    /**
     * Alias to prototype
     */
    Vimflowy.fn = Vimflowy.prototype;

    /**
     * Write log messages into console if on debug mode or swallow its
     * otherwise.
     */
    Vimflowy.prototype.log = function() {
        Array.prototype.unshift.call(arguments, '[vimflowy]');
        if (window.console && this.debug) {
            console.log.apply(console, arguments);
        }
    };

    /**
     * Bind the key sequence to command execution.
     *
     * The actual command decorated to log messages to console on debug mode.
     *
     * @param {String} key The key to bind
     * @param {Command} cmd The command to bind
     * @param {Boolean} force Rebind already binded key
     */
    Vimflowy.prototype.bind = function(key, cmd, force) {
        // unbind already binded command if force is set
        if (this.keybindings.hasOwnProperty(key)) {
            if (!force) {
                this.log('Be patient, key', key, 'already binded, to avoid',
                    'unexpected effects and memory leaks unbind it before',
                    'or use force flag');
                return;
            }
            this.unbind(key);
        }

        // decorate command handler
        var self = this;
        function fn(e) {
            self.log(key, 'has been pressed:', cmd.desc);
            cmd.fn(e);
        }

        // register it (now possible to unbind decorated command handler)
        this.keybindings[key] = fn;

        // actually bind it
        this.editor.each(function() {
            $(this).bind('keydown', key, fn);
        });
    };

    /**
     * Remove key binding from page
     *
     * @param {String} key The key to unbind
     */
    Vimflowy.prototype.unbind = function(key) {
        // nothing to unbind
        if (!this.keybindings.hasOwnProperty(key)) {
            this.log('Nothing to unbind: key', key, 'doesn\'t binded');
            return;
        }

        var fn = this.keybindings[key];
        this.editor.each(function() {
            $(this).unbind('keydown', fn);
        });

        delete this.keybindings[key];
    };

    /**
     * Register new command and bind key to it if needed.
     *
     * @param {String} key The key to map
     * @param {Function} fn The key handler
     * @param {Array} modes On which modes bind key
     * @param {String} desc The command description.
     * @param {Boolean} noremap Disallow already binded keys to rebind
     */
    Vimflowy.prototype.map = function(key, fn, modes, desc, noremap) {
        var cmd = this.Command(fn, desc);

        // disallow key rebinding by default
        noremap = (typeof noremap === 'undefined') ? true : noremap;

        // rebind key if needed
        if (isContains(modes, this.mode)) {
            this.bind(key, cmd, !noremap);
        }

        // add to registry
        this.commands.map(key, cmd, modes);

        // say it
        this.log('Key', key, 'mapped to', desc);
    };

    /**
     * Unregister command from registry.
     *
     * @param {String} key The key to unmap
     * @param {Array|String} modes The modes to unmap
     */
    Vimflowy.prototype.unmap = function(key, modes) {
        modes = (typeof modes === 'undefined') ? [] : toArray(modes);
        if (isEmpty(modes)) {
            this.log('Do you forget to explicitly set modes to unmap?');
            return;
        }

        // unbind if binded
        if (isContains(modes, this.mode)) {
            this.unbind(key);
        }

        // remove from registry
        this.commands.unmap(key, modes);

        // say it
        this.log('Key', key, 'successfully unmapped. The mapping may remain',
            'defined for other modes where it applies.');
    };

    /**
     * Convert object into array.
     *
     * @param {Object} obj The object to convert
     * @return {Array} The array with object if not object is array
     */
    function toArray(obj) {
        return (obj instanceof Array) ? obj : [obj];
    }

    /**
     * Check contains array element or not
     *
     * @param {Array} array The array to check
     * @param {Object} value The value to check
     * @return {Boolean} Contains or not
     */
    function isContains(array, value) {
        return array.indexOf(value) != -1;
    }

    /**
     * Check array is empty
     *
     * @param {Array} array The array to check
     * @return {Boolean} Is empty array?
     */
    function isEmpty(array) {
        return array.length < 1;
    }

    /**
     * Fetch content of the extension resource file
     *
     * @param {String} filename The file name to fetch
     * @return {String} Response text
     */
    function fetchFileContent(filename) {
        var rv,
            xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                rv = xhr.responseText;
            }
        };
        var url = chrome.extension.getURL(filename);
        xhr.open('GET', url, false);

        try {
            xhr.send(null);
        } catch(e) {
            Vimflowy.prototype.log('couldn\'t load', filename);
        }

        return rv;
    }

    var root = typeof exports !== 'undefined' && exports !== null ? exports : window;

    // expose to the globals
    root.Vimflowy = Vimflowy;

}).call(this);
