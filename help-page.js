/**
 * Add help page to Vimflowy.
 * Page contains overview all current mappings.
 */
(function() {

    var root = typeof exports !== 'undefined' && exports !== null ? exports : window,
        vimflowy = root.vimflowy,
        $ = root.$,
        // match the single word for capitalizing
        rwords = /\w\S*/g;

    /**
     * Create help page
     */
    function HelpPage() {
        // help dialog is shown
        this.shown = false;

        // compiled mustache template
        this.template = (function() {
            var template = vimflowy.fetchFileContent('pages/help.html');
            return root.Mustache.compile(template);
        }());
    }

    /**
     * Show help page. All key bindings rendered at runtime.
     */
    HelpPage.prototype.show = function() {
        if (!this.shown) {
            this.shown = true;

            // generate help sections
            var availableCommands = vimflowy.commands,
                sections = [];
            for (var mode in availableCommands) {
                if (availableCommands.hasOwnProperty(mode) &&
                    typeof availableCommands[mode] !== 'function') {
                    sections.push({
                        headline: generateHeadline(mode),
                        mappings: generateMappings(availableCommands[mode])
                    });
                }
            }
            var context = {
                version: vimflowy.version,
                sections: sections
            };

            // render actual help
            var helpHtml = this.template(context);
            $(helpHtml).appendTo('body');

            // bind close on close button click
            $('.vimflowy-close').bind('click', toggleHelp);
        }
    };

    /**
     * Hide help page. Actually remove it from page.
     */
    HelpPage.prototype.hide = function() {
        if (this.shown) {
            this.shown = false;

            // unbind attached handler before remove help page
            $('.vimflowy-close').unbind('click', toggleHelp);

            // remove help from page
            $('#vimflowy-help').remove();
        }
    };

    /**
     * Toggle help page state.
     */
    HelpPage.prototype.toggle = function() {
        return (this.shown) ? this.hide() : this.show();
    };

    /**
     * Generate section headline for help page.
     *
     * @param {String} modeName The mode name
     * @return {String} The section headline
     */
    function generateHeadline(modeName) {
        return capitalize(modeName + ' mode');
    }

    /**
     * Prepare command registry to render in template
     *
     * @param {Object} commands The commands to prepare
     * @return {Array} List of commands ready to render
     */
    function generateMappings(commands) {
        var rv = [];
        for (var key in commands) {
            rv.push({key: key, desc: commands[key].desc});
        }
        return rv;
    }

    /**
     * Capitalize each word from string.
     *
     * @param {String} s The string to capitalize
     * @return {String} Capitalized string
     */
    function capitalize(s) {
        return s.replace(rwords, function(s) {
            return s.charAt(0).toUpperCase() + s.slice(1);
        });
    }

    // prepare help page
    var helpPage = new HelpPage();

    /**
     * Toggle help dialog
     */
    function toggleHelp(e) {
        e.preventDefault();
        helpPage.toggle();
    }

    // map to normal mode
    vimflowy.map('shift+/', toggleHelp, 'normal', 'toggle help dialog');

}).call(this);
