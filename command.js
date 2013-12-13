define(function() {
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

    return Command;
});
