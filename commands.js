/**
 * Commands storage
 */
(function() {
    /**
     * Command
     *
     * @param {Function} fn The command handler
     * @param {String} desc The command description
     */
    function Command(fn, desc) {
        if (!(this instanceof Command)) {
            return new Command(fn, desc);
        }
        this.fn = fn;
        this.desc = desc;
    }

    /**
     * Commands storage.
     *
     * Implements the default methods to work with commands such as map/unmap.
     * Commands for each mode holds on separate object to easy access.
     */
    function Commands() {
        if (!(this instanceof Commands)) {
            return new Commands();
        }
        this.normal = {};
        this.insert = {};
    }

    /**
     * Map the key sequence to command.
     *
     * @param {String} key The keyboard key
     * @param {Command} cmd The command
     * @param {Array|String} modes Map command only for specified modes
     */
    Commands.prototype.map = function(key, cmd, modes) {
        modes = (typeof modes === 'undefined') ? ['normal', 'insert'] : toArray(modes);

        for (var i = modes.length - 1; i >= 0; i--) {
            switch (modes[i]) {
                case 'normal': this.nmap(key, cmd); break;
                case 'insert': this.imap(key, cmd); break;
            }
        }
    };

    /**
     * Map command to normal mode
     *
     * @param {String} key The key to map
     * @param {Command} cmd The command
     */
    Commands.prototype.nmap = function(key, cmd) {
        this.normal[key] = cmd;
    };

    /**
     * Map command to insert mode
     *
     * @param {String} key The key to map
     * @param {Command} cmd The command
     */
    Commands.prototype.imap = function(key, cmd) {
        this.insert[key] = cmd;
    };

    /**
     * Remove the key mapping for the modes where the map command applies. The
     * mapping may remain defined for other modes where it applies.
     *
     * Note! Unmapping already binded commands may produce memory leaks.
     *
     * @param {String} key The key to unmap
     * @param {Array|String} modes Unmap key only for this modes
     */
    Commands.prototype.unmap = function(key, modes) {
        modes = toArray(modes);
        for (var i = modes.length - 1; i >= 0; i--) {
            switch (modes[i]) {
                case 'normal': this.nunmap(key); break;
                case 'insert': this.iunmap(key); break;
            }
        }
    };

    /**
     * Unmap command from the normal mode
     *
     * @param {String} key The key to unmap
     */
    Commands.prototype.nunmap = function(key) {
        if (this.normal.hasOwnProperty(key)) {
            delete this.normal[key];
        }
    };

    /**
     * Unmap command from the insert mode
     *
     * @param {String} key The key to unmap
     */
    Commands.prototype.iunmap = function(key) {
        if (this.insert.hasOwnProperty(key)) {
            delete this.insert[key];
        }
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

    var root = (typeof exports !== 'undefined' && exports !== null) ? exports : window;

    root.Vimflowy.fn.Command = Command;
    root.Vimflowy.fn.Commands = Commands;

}).call(this);
