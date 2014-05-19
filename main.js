/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, browser: true */
/*global $, define, brackets */

define(function (require, exports, module) {
    "use strict";

    var CommandManager = brackets.getModule("command/CommandManager"),
		ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        Menus = brackets.getModule("command/Menus"),
        NodeDomain = brackets.getModule("utils/NodeDomain"),
        Dialogs = brackets.getModule("widgets/Dialogs"),
        AppInit = brackets.getModule("utils/AppInit");

    var toolbarIcon;
    AppInit.htmlReady(function() {
		//icon & listener 
        toolbarIcon = $("<a>").attr({
			id: "devimg-icon",
			href: "#"
		}).click(showDialog).appendTo($("#main-toolbar .buttons"));
    });    

    
	//html used by the modal
	var dialog = require("text!devimg-dialog.html");
    //load custom css
    ExtensionUtils.loadStyleSheet(module, "style.css");

    // First, register a command - a UI-less object associating an id to a handler
    var DEVIMG_COMMAND_ID = "devimg.writeCode";   // package-style naming to avoid collisions
    CommandManager.register("Insert DEVimg code...", DEVIMG_COMMAND_ID, showDialog);
    // Then create a menu item bound to the command
    // The label of the menu item is the name we gave the command (see above)
    var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    menu.addMenuDivider();
    menu.addMenuItem(DEVIMG_COMMAND_ID);

    
    // Function to run when the menu item is clicked
    function showDialog() {
        Dialogs.showModalDialogUsingTemplate(dialog, true);
        $("#dialogSubmitBtn").click(placeCode);
        $(toolbarIcon).addClass("active");
        
    }
    
    function placeCode() {
        $(toolbarIcon).removeClass("active");
        
        //First store the data from the input fields inside the dialog in some variables.
        var w = $("#inputWidth").val();
		if (!w || isNaN(w)) w = minMax(50,500);
            
        var h = $("#inputHeight").val();
		if (!h || isNaN(h)) h = minMax(50,500);

        var codeToPlace;
        if ( $("#urlonly").is(":checked") ) {
            codeToPlace = 'http://devimg.com/' + w + 'x'+ h;  
        } else if ( $("#imagetag").is(":checked") ) {
            codeToPlace = '<img src=\"http://devimg.com/' + w + 'x'+ h +'\" width=\"'+w+'\" height=\"'+h+'\">';
        } 
        
        var editor = EditorManager.getCurrentFullEditor();
        if (editor) {
            //at the current cursor position
            var insertionPos = editor.getCursorPos();
            editor.document.replaceRange(codeToPlace, insertionPos);
        };
    }
    
    
    function minMax(min, max) {
         return Math.floor(Math.random()*(max-min+1)+min);
    }

    
});