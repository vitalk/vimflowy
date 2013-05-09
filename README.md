Vimflowy: Vim shortcuts for Workflowy
=====================================

Vimflowy is a Google Chrom{e,ium} extension that brings the goodness of (super-basic) Vim navigation into the wonderful online listiness of Workflowy!  It does not do anything fancy, it just provides some convenient Workflowy key bindings that might be more convenient to people who have Vim built into their motor system. It exists because I found myself typing `jjjjj` and/or ending up in the search box after pressing `<Esc>` one too many times.

If you like Vimflowy, please let me know! I'm curious to see how "niche" this actually is. :)

Keybindings
-----------

To view all mapped keybindings use `?` key.

![Screen shot](https://github.com/vitalk/vimflowy/raw/master/vimflowy-help.png)

### Normal mode ###

* Movement
    - `j`: Move down one item
    - `k`: Move up one item
    - `h`: Move cursor left
    - `l`: Move cursor right
    - `w`: Move one word forward
    - `b`: Move one work back
* Insertion
    - `i`: Enter Insert mode
    - `a`: Enter Insert mode (same as `i` for now)
    - `O`: Create a new bullet point before current item and enter Insert mode
    - `o`: Create a new bullet point after current item and enter Insert mode
    - `I`: Enter Insert mode at beginning of line
    - `A`: Enter Insert mode at end of line
* Other
    - `x`: Delete character before cursor
    - `u`: Undo
    - `<Ctrl>r`: Redo

### Insert mode ###

* `<Esc>`: Enter Normal mode
* More soon, hopefully!

### Extra shortcuts ###

Vimflowy also adds some extra key bindings for common Workflowy tasks that work in both normal and insert modes. Other than `<Esc>` to search, all of Workflowy's built-in shortcuts are still available as well.

* `<Alt>l`: Zoom into current list item
* `<Alt>h`: Zoom out of current list
* `<Alt><Shift>l`: Indent current item
* `<Alt><Shift>h`: Dedent current item
* `<Alt><Shift>k`: Move current item up
* `<Alt><Shift>j`: Move current item down

Usage tips
----------

If you're using [Vimium](http://vimium.github.com/) (or any other Chrome extensions that install modal keybindings), make sure you add `http*://*.workflowy.com/*`to the excluded URLs.

Personally, I like to run Workflowy in Chromium's app mode: i.e. `chromium --app="https://workflowy.com"`.

Known bugs
----------

AKA things I hope I can fix soon, or things that anyone else is welcome to fix!

* Chrome keybindings (e.g., close/open tab) don't work in Normal mode.
* There is currently no search shortcut.
* Support for key sequences would be pretty sweet, but I still need to work out conflicts with other bindings.
