/**
 * Vimflowy available key bindings.
 */
(function() {
    var root = (typeof exports !== 'undefined' && exports !== null) ? exports : window,
        vimflowy = root.Vimflowy(debug=true),
        $ = root.$;

    // command functions
    var functions = {
        deleteProject: function(e) {
            e.preventDefault();

            $(e.target).getProject().deleteIt();

            return false;
        },

        deleteWordBack: function (e) {
            e.preventDefault();

            var index = indexOfNextCaret($(e.target).getCaret().start, $(e.target).val(), { backward: true, shift: true });

            var n_back = $(e.target).getCaret().start - index;

            for (var i=0; i < n_back; i++) {
                $(e.target).simulate("key-sequence", {sequence: "{backspace}", triggerKeyEvents: true });
            }
            return false;
        },

        deleteItemBack: function (e) {
            e.preventDefault();

            var n_back = $(e.target).getCaret().start;

            for (var i=0; i < n_back; i++) {
                $(e.target).simulate("key-sequence", {sequence: "{backspace}", triggerKeyEvents: true });
            }
            return false;

        },

        moveWordForward: function (e) {
            e.preventDefault();

            var index = indexOfNextCaret($(e.target).getCaret().start, $(e.target).val(), { shift: true });
            if (index > 0) {
                $(e.target).setCaret(index);
            } else {
                $(e.target).setCaret($(e.target).val().length);
                $(e.target).rightArrowHandler();
            }
            return false;
        },

        moveWordBackward: function (e) {
            e.preventDefault();

            var index = indexOfNextCaret($(e.target).getCaret().start, $(e.target).val(), { backward: true, shift: true });
            if (index > -1) {
                $(e.target).setCaret(index);
            } else {
                $(e.target).setCaret(0);
                $(e.target).leftArrowHandler();
                // TODO: after we move to the new field, go back a word again
            }

            return false;
        },

        doBackspace: function (e) {
            e.preventDefault();
            $(e.target).simulate("key-sequence", {sequence: "{backspace}", triggerKeyEvents: true });
            return false;
        },

        moveDown: function (e) {
            e.preventDefault();
            $(e.target).downArrowHandler();
            return false;
        },

        moveUp: function (e) {
            e.preventDefault();
            $(e.target).upArrowHandler();
            return false;
        },

        moveLeft: function (e) {
            e.preventDefault();
            if ($(e.target).getCaret().start === 0) {
                $(e.target).leftArrowHandler();
            } else {
                $(e.target).simulate("key-sequence", {sequence: "{leftarrow}", triggerKeyEvents: false });
            }
            return false;
        },

        moveRight: function (e) {
            e.preventDefault();
            if ($(e.target).getCaret().start === $(e.target).val().length) {
                $(e.target).rightArrowHandler();
            } else {
                $(e.target).simulate("key-sequence", {sequence: "{rightarrow}", triggerKeyEvents: false });
            }
            return false;
        },

        doUndo: function (e) {
            e.preventDefault();
            undoredo.undo();
            return false;
        },

        doRedo: function (e) {
            e.preventDefault();
            undoredo.redo();
            return false;
        },

        toggleFold: function (e) {
            $(e.target).keyboardExpandToggle();
            return false;
        },

        openFold: function (e) {
            $(e.target).keyboardExpand();
            return false;
        },

        closeFold: function (e) {
            $(e.target).keyboardCollapse();
            return false;
        },

        zoomInFold: function (e) {
            $(e.target).keyboardZoomIn();
            return false;
        },

        zoomOutFold: function (e) {
            keyboardZoomOut();
            return false;
        },

        doIndent: function (e) {
            $(e.target).indentProject();
            return false;
        },

        doDedent: function (e) {
            $(e.target).dedentProject();
            return false;
        },

        createNewAfter: function (e) {
            e.preventDefault();

            // set caret to end of text
            $(e.target).setCaret($(e.target).val().length);

            // activate return
            $(e.target).returnHandler();

            // go into insert mode
            enterInsertMode(e);
            return false;
        },

        createNewBefore: function (e) {
            e.preventDefault();

            // set caret to beginning of text
            $(e.target).setCaret(0);

            // activate return
            $(e.target).returnHandler();

            // go up to the item
            $(e.target).upArrowHandler();

            // go into insert mode
            enterInsertMode(e);
            return false;
        },

        insertBeginning: function (e) {
            e.preventDefault();
            $(e.target).setCaret(0);
            enterInsertMode(e);
            return false;
        },

        insertEnd: function (e) {
            e.preventDefault();
            $(e.target).setCaret($(e.target).val().length);
            enterInsertMode(e);
            return false;
        },

        doProjectUp: function (e) {
            e.preventDefault();
            $(e.target).moveProjectUpOrDown('up');
            return false;
        },

        doProjectDown: function (e) {
            e.preventDefault();
            $(e.target).moveProjectUpOrDown('down');
            return false;
        },

        enterSearchMode: function (e) {
            e.preventDefault();
            $("#searchBox").focus();
            return false;
        }
    };

    function enterInsertMode (e) {
        e.preventDefault();
        vimflowy.mode('insert')
    }

    function enterNormalMode (e) { vimflowy.mode('normal') }

    function indicesOf(searchStr, str) {
        var startIndex = 0, searchStrLen = searchStr.length;
        var index, indices = [];
        while ((index = str.indexOf(searchStr, startIndex)) > -1) {
            indices.push(index);
            startIndex = index + searchStrLen;
        }
        return indices;
    }

    function indexOfNextCaret(currentPos, str, options) {
        // set default options
        if (typeof options === 'undefined') {
            options = {};
            options.backward = false;
            options.shift = false;
        } else {
            options.backward = typeof options.backward !== 'undefined' ? options.backward : false;
            options.shift = typeof options.shift !== 'undefined' ? options.shift : false;
        }

        var index, indices = [];
        var searchStr = " ";
        if (options.backward === false) {

            index = str.indexOf(searchStr, currentPos+1);

        } else {

            if (str.charAt(currentPos-1) == ' ') { currentPos--; }

            while (((str.indexOf(searchStr, index+1)) > -1) && (str.indexOf(searchStr, index+1) < currentPos)) {
                index = str.indexOf(searchStr, index+1);
            }

            if (isNaN(index)) { index = -1; }

            if (currentPos === 0) { index = -2; }
        }

        if (options.shift === true) { index++; }

        return index;
    }

    // bind vim motions to workflowy actions
    // [<key>, <mode>, <fn>, <desc>] list
    var cmdlist = [
        // movement
        ['h', 'normal', functions.moveLeft, 'move cursor left'],
        ['j', 'normal', functions.moveDown, 'move down'],
        ['k', 'normal', functions.moveUp, 'move up'],
        ['l', 'normal', functions.moveRight, 'move cursor right'],
        ['w', 'normal', functions.moveWordForward, 'move one word forward'],
        ['b', 'normal', functions.moveWordBackward, 'move one word backward'],

        // insertion & deletion
        ['d', 'normal', functions.deleteProject, 'delete list item'],
        ['x', 'normal', functions.doBackspace, 'delete character under cursor'],
        ['i', 'normal', enterInsertMode, 'enter insert mode'],
        ['shift+i', 'normal', functions.insertBeginning, 'insert at the beginning'],
        ['a', 'normal', enterInsertMode, 'enter insert mode'],
        ['shift+a', 'normal', functions.insertEnd, 'insert at the end'],
        ['o', 'normal', functions.createNewAfter, 'create new after'],
        ['shift+o', 'normal', functions.createNewBefore, 'create new before'],

        ['ctrl+[', 'insert', enterNormalMode, 'enter normal mode'],

        // search
        ['/', 'normal', functions.enterSearchMode, 'enter search mode'],

        // indenting
        ['alt+shift+l', ['normal', 'insert'], functions.doIndent, 'increase indent'],
        ['alt+shift+h', ['normal', 'insert'], functions.doDedent, 'decrease indent'],

        // undo/redo
        ['u', 'normal', functions.doUndo, 'undo last chage'],
        ['ctrl+r', ['normal', 'insert'], functions.doRedo, 'redo last chage'],

        // project movement
        ['ctrl+l', ['normal', 'insert'], functions.zoomInFold, 'zoom in'],
        ['ctrl+h', ['normal', 'insert'], functions.zoomOutFold, 'zoom out'],
        ['ctrl+k', ['normal', 'insert'], functions.doProjectUp, 'move current item up'],
        ['ctrl+j', ['normal', 'insert'], functions.doProjectDown, 'move current item down']
    ];

    // map em all
    var key, fn, desc, modes, cmdline;
    for (var l = cmdlist.length, i = l - 1; i >= 0; i--) {
        cmdline = cmdlist[i];
        key     = cmdline[0];
        modes   = cmdline[1];
        fn      = cmdline[2];
        desc    = cmdline[3];

        vimflowy.map(key, fn, modes, desc);
    }

    // go to normal mode
    vimflowy.mode('normal')

    // expose to the globals
    root.vimflowy = vimflowy;

}).call(this);
