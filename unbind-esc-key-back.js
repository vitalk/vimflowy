/**
 * This hack used to remove focus search dialog on ESC key.
 *
 * It just unbind all global workflowy key bindings and then rebind them, but
 * allow to hide popup messages on ESC.
 */
(function() {

    // default workflowy implementation of the global keybindings
    jQuery.fn.addGlobalKeyboardShortcuts=function(){this.each(function(){function b(e){var d=e.ctrlKey||e.metaKey;savedviews.updateModifierKeyStatus(d&&e.shiftKey,d)}var c=$(this);c.registerHandlerForShortcuts("s",["ctrl","meta"],function(){saveEditingContent();pushpoll.scheduleNextPushAndPoll(true);return false});c.registerHandlerForShortcuts("z",["ctrl","meta"],function(){undoredo.undo();return false});c.registerHandlerForShortcuts("shift+z",["ctrl","meta"],function(){undoredo.redo();return false});
c.registerHandlerForShortcuts("y",["ctrl","meta"],function(){undoredo.redo();return false});c.registerHandlerForShortcuts("o",["ctrl","meta"],function(){toggleCompletedVisibility();return false});c.registerHandlerForShortcuts("home",["ctrl","meta"],function(){var e=getCurrentlyFocusedEditor();if(!(e!==null&&e.isNote())){focusFirstProject();return false}});c.registerHandlerForShortcuts("end",["ctrl","meta"],function(){var e=getCurrentlyFocusedEditor();if(!(e!==null&&e.isNote())){focusLastProject();
return false}});
c.bind("keydown","esc",function(){var e=$(document.activeElement).is("#searchBox");if(undeleteMessageIsVisible()&&!e){hideMessage();return false};return false});
c.registerHandlerForShortcuts("shift+/",["ctrl","meta"],function(){keyboardShortcutHelper.toggle();return false});c.registerHandlerForShortcuts("/",["ctrl","meta"],function(){keyboardShortcutHelper.toggle();return false});c.registerHandlerForShortcuts("shift+*",["ctrl","meta"],function(){savedviews.toggleCurrentViewSaved();savedviews.pretendModifierKeysNotPressedUntilTheyAreReleased();return false});c.registerHandlerForShortcuts("shift+;",["ctrl","meta"],function(){savedviews.switchLeft();return false});
c.registerHandlerForShortcuts(";",["ctrl","meta"],function(){savedviews.switchRight();return false});c.bind("keydown",function(e){b(e);if(savedviews.HUDIsVisible())switch(e.keyCode){case $.ui.keyCode.LEFT:savedviews.switchLeft();return false;case $.ui.keyCode.RIGHT:savedviews.switchRight();return false;case $.ui.keyCode.ENTER:savedviews.switchToSelectedViewIfAppropriate();return false;default:savedviews.hideIfModifierNotPressed()}});c.bind("keyup",b);APPCACHE_ENABLED&&ON_DEVELOPMENT_SERVER&&c.registerHandlerForShortcuts("shift+a", ["ctrl","meta"],function(){forceReloadAppCache();return false})});return this};

    var editor = $(".editor > textarea");

    // rebind workflowy globals
    editor.unbind("keydown");
    editor.addTextAreaEventHandlers();
}());
