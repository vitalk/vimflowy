/**
 * Add help page to Vimflowy.
 * Page contains overview all current mappings.
 */
define([
    'vimflowy',
    'util/has',
    'util/fetch',
    'util/capitalize',
    'mustache'
], function(vimflowy, has, fetch, capitalize, Mustache) {

    /**
     * Create help page
     */
    function HelpPage() {
        // help dialog is shown
        this.shown = false;

        // compiled mustache template
        this.template = (function() {
            var template = fetch('pages/help.html');
            return Mustache.compile(template);
        }());
    }

    /**
     * Show help page. All key bindings rendered at runtime.
     */
    HelpPage.prototype.show = function() {
        if (!this.shown) {
            this.shown = true;

            // generate help sections only for insert and normal mode hotkeys
            var sections = [],
                availableCommands = {
                  'normal': vimflowy.commands.modes.normal,
                  'insert': vimflowy.commands.modes.insert
                };

            for (var mode in availableCommands) {
                if (has(availableCommands, mode) &&
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
            $('.vimflowy-close').bind('click', help.toggle.bind(help));
        }
    };

    /**
     * Hide help page. Actually remove it from page.
     */
    HelpPage.prototype.hide = function() {
        if (this.shown) {
            this.shown = false;

            // unbind attached handler before remove help page
            $('.vimflowy-close').unbind('click', help.toggle.bind(help));

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

    // Create a runtime help and related mappings
    var help = new HelpPage;

    // Bind keys
    vimflowy.map('?', function() { help.toggle(); }, 'normal', 'show help popup')

})
