/**
 * Vimflowy chrome extension.
 *
 * Simulate Vim keybindings on workflowy.
 *
 * @author: Leila Zilles
 * @contributor: Vital Kudzelka
 */
define([
    'util/has',
    'util/fetch',
    'util/array/isempty',
    'util/array/iscontains',
    'command',
    'commands',
    'mousetrap'
  ], function(
    has,
    fetch,
    isEmpty,
    isContains,
    Command,
    Commands,
    Mousetrap) {

    // Pass all keydown events into handler
    Mousetrap.stopCallback = function() { return false; }

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
            return JSON.parse(fetch('manifest.json') || '{"version":"unknown"}').version;
        }());

        // commands registry
        this.commands = Commands();

        // holds all binded keys and associated handlers
        this.keybindings = {};

        // current mode
        this.whereami = null;
    }

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
        if (has(this.keybindings, key)) {
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

        // Decorate original command handler to
        //
        // 1. Prevent default events for each command, so we don't insert
        //    pressed key each time the event has been fired
        // 2. Log debug info into console
        function fn(e) {
            e.preventDefault();
            self.log(key, 'has been pressed:', cmd.desc);
            return cmd.fn(e);
        }

        // register it (now possible to unbind decorated command handler)
        this.keybindings[key] = fn;

        // actually bind it
        Mousetrap.bind(key, fn);
    };

    /**
     * Remove key binding from page
     *
     * @param {String} key The key to unbind
     */
    Vimflowy.prototype.unbind = function(key) {
        // nothing to unbind
        if (!has(this.keybindings, key)) {
            this.log('Nothing to unbind: key', key, 'doesn\'t binded');
            return;
        }

        var fn = this.keybindings[key];

        Mousetrap.unbind(key);
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
        var cmd = Command(fn, desc);

        // disallow key rebinding by default
        noremap = (typeof noremap === 'undefined') ? true : noremap;

        // rebind key if needed
        if (isContains(modes, this.whereami)) {
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
        if (isContains(modes, this.whereami)) {
            this.unbind(key);
        }

        // remove from registry
        this.commands.unmap(key, modes);

        // say it
        this.log('Key', key, 'successfully unmapped. The mapping may remain',
            'defined for other modes where it applies.');
    };

    /**
     * Switch to specified mode
     *
     * @param {String} mode The mode name to go
     */
    Vimflowy.prototype.mode = function(mode) {
        if (this.whereami === mode) return

        if (!has(this.commands.modes, mode)) {
            this.log('Mode', '[' + mode + ']', 'does not exists, be patient!');
            return
        }

        this.whereami = mode;

        // unbind bound keys
        for (var key in this.keybindings) {
            if (has(this.keybindings, key)) {
                this.unbind(key);
            }
        }

        // add a new bindings
        var keys = this.commands.modes[mode];
        for (key in keys) {
            if (has(keys, key)) {
                this.bind(key, keys[key]);
            }
        }

        this.log('Now you are in the', '[' + mode + ']', 'mode, congrats!')
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

    return Vimflowy();

});
