$(document).ready(function() {
	//code here...
	var code = $(".codemirror-textarea")[0];
	editorCM = CodeMirror.fromTextArea(code, {
		lineNumbers : true,
		mode: "javascript",
	});
	editorCM.setSize(990, 385);
});

function updateCodeMirror(data){
    var cm = $('.CodeMirror')[0].CodeMirror;
    var doc = cm.getDoc();
    var cursor = doc.getCursor(); // gets the line number in the cursor position
    var line = doc.getLine(cursor.line); // get the line contents
    var pos = { // create a new object to avoid mutation of the original selection
        line: (doc.size+4),
        ch: line.length // set the character position to the end of the line
    }
    doc.replaceRange('\n'+data, pos); // adds a new line
}



function tidyCommands() {
	
	// Checks if string is empty
	function isBlank(str) { return (!str || /^\s*$/.test(str)) }

	// Resets content of readyContent division so the function can be used many timess
	document.getElementById("readyContent").innerHTML = '';

	// Sets required variables
	var content = getFullContent();
	var stringError = false;
	var commands = [];
	var str = "";

	/** FOR LOOP -> Removes statements / notes
	* 
	*	mainly focuses on this = "/*" statement.
	*	If content contains start of this statement but cant find its ending tag,
	* 	it will merge next contents until closing match is found.
	*
	*	If match is not found and there are no more contents to merge, then this script
	*   will exit this loop and then alert the user of a possible syntax error.
	*/
	for (var i=0; i<content.length; i++)
	{
		// If statement "/*" found without the closing tag - "*/".
		if (/(\/\*)(?=[^"]*(?:"[^"]*"[^"]*)*$)/g.test(content[i])
		&&  /(\/\*.+?\*\/)(?=[^"]*(?:"[^"]*"[^"]*)*$)/g.test(content[i])==false)
		{
			stringError = true;
		}

		// If string contains space at last position, then remove all spaces from the back.
		if (/\s/i.test(content[i][content[i].length-1])&&!stringError&&/\S/i.test(content[i]))
		{
			content[i] = content[i].replace(/\s+\S*$/gmi,"")
		}
		// If string contains space at first position, then remove all spaces from the front.
		if (/\s/i.test(content[i][0])&&!stringError&&/\S/i.test(content[i]))
		{
			content[i] = content[i].replace(/\s+/i,"")
		}

		// If match from "/*" to "*/" is possible, then remove it from str.
		if (/(\/\*.+?\*\/)(?=[^"]*(?:"[^"]*"[^"]*)*$)/g.test(str)==true)
		{
			stringError = false; //alert(str);
			str = str.replace(/(\/\*.+?\*\/)(?=[^"]*(?:"[^"]*"[^"]*)*$)/g,"")
		}

		// If content contains statements -> "//" or "#", then remove their content.
		// It will not remove statements that are in quotes nor the sub quotes... 
		if (stringError != true) {
			//alert("[1] " + str);
			content[i] = XRegExp.replaceLb(content[i], '(?<=^([^"\r\n]|"([^"\\\\\r\n]|\\\\.)*")*)', /(\/\/.+|#.+)/gmi, "");
			//alert("[2] " + str);
		}

		// If content is not empty, then append it to str.
		if (!isBlank(content[i])) { str += content[i] }
	}

	// When "/*" is not closed in the editor, then display error message.
	if (/(\/\*)(?=[^"]*(?:"[^"]*"[^"]*)*$)/g.test(str)
	&&  /(\/\*.+?\*\/)(?=[^"]*(?:"[^"]*"[^"]*)*$)/g.test(str)==false)
	{
		alert("Syntax Error: Wrong use of the following statement \"/*\".\n\nMake sure that statement \"/*\" has it's ending tag - \"*/\"");
		str = '>>tellraw @p ["",{"text":"\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\nSyntak Error: Wrong use of the following statement \\"/*\\".\\n\\nMake sure that statement \\"/*\\" has it\'s ending tag - \\"*/\\".\\n\\n"}]';
	}


	// Imports manipulated string to first line of the editor.
	editorCM.setValue(str);

	// Get specific script - Removes statements / notes
	$($("span[role='presentation']"), $(".CodeMirror-code")).each(function(i){
		$(this).children(".cm-comment").remove();
		$(this).children("[cm-text='']").remove();
		$(".cm-error").remove();
		// console.log( i + ': ' + $(this).text() );
		$("#readyContent").append( $(this) );
	});

	// Removes undefined || null commands
	$("#readyContent").children().each(function(i){ 
		$(this).addClass("cmd"+(i));
		if ( ($(".cmd"+(i)).html() != "") ){
			// console.log("True");
		} else { $(".cmd"+(i)).remove() }
	});

	// Resets classes || re-counts childs & stores ready commands to array
	$("#readyContent").children().each(function(i){
		$(this).removeClass();
		$(this).addClass("cmd"+(i));
	
		commands.push($(".cmd"+(i)).text());
	});

	// Refresh the editor to sort the missing scripts
	$('.CodeMirror').each(function(i, el){
		el.CodeMirror.refresh();
	});
	
	// Removes empty commands
	commands = commands.filter(function( element ) {
	   return element !== '';
	});
	
	// Resets content of readyContent division so the function can be used many timess
	document.getElementById("readyContent").innerHTML = '';
	// Resets editor to state before it was manipulated by this function.
	editorCM.undo();

	return commands;
}

function getFullContent() {

	var content = [];
	for (var i=0; i<editorCM.lineCount(); i++) {
		content.push(editorCM.getLineHandle(i).text);
	}

	return content;
}

function getContent() {
	
	// Resets content of readyContent division so the function can be used many timess
	document.getElementById("readyContent").innerHTML = '';
	
	// Get all specifics
	$($(".CodeMirror-line"), $(".CodeMirror-code")).each(function(i){
		// console.log( i + ': ' + $(this).text() );
		$("#readyContent").append( $(this) );
	});
	
	// Refresh the editor to sort the missing scripts
	$('.CodeMirror').each(function(i, el){
		el.CodeMirror.refresh();
	});
	
	// stores ready commands to array
	commands = [];
	$("#readyContent").children().each(function(i){
		$(this).attr('class', "cmd"+(i));
		
		// Replaces child with &#8203 to null
		if ($(this).text() == "\u200B"){
			
			commands.push("");
	
		} else { commands.push($(".cmd"+(i)).text()); }
		
	});
		
	// Resets content of readyContent division so the function can be used many timess
	document.getElementById("readyContent").innerHTML = '';
	
	return commands;
}


function openContent(content) {
	
	// Clears editors content
	editor = document.getElementsByClassName("codemirror-textarea")[0];
	$('.CodeMirror').each(function(i, el){
		el.CodeMirror.clearHistory();
		
		// Imports first content to the top, else it would generate unwanted space at the top
		el.CodeMirror.setValue(content[0]);
	});

	// Imports content to the editor
	for (var i=1; i<content.length; i++){
		updateCodeMirror(content[i]);
	}

	editorCM.undo(); // Removes last line which is always empty for some reason

	/** Creates 20 lines to make display look fancy.
	* It also helps fix on of the bugs. The bug seems to appear when editor is cleared
	* and when there are less lines than 10. It will not display the left bar that holds the numbers
	* of each line.
	*/
	if (content.length<21) {
		for (var i=0; i<(21-content.length); i++) {
			updateCodeMirror("");
		}
	}

	editorCM.clearHistory(); // Resets history of Undo and Redo functions
}

function resetContainerEditor(){

	var content = [
		"",
		" /* Use this '>>' symbol to create new command block. Use this '\\' symbol to escape any doubble quote. To quickly",
		" remove any large sections of string elements, try holding Ctrl and Return button. Ctrl+C, Ctrl+V and also string",
		" highlighting are not supported for this editor. Use '//', '/*' and '#' to state a comment. You may use some of the",
		" following variables: !(creation_name), !(creation_version) and !(creation_programmer) - defined by first sign */",
		"",
		"",
		">>execute @a[name=!(creation_programmer),r=20] ~ ~ ~ detect ~ ~-1 ~ minecraft:grass 0 tellraw @a [",
		"  \"\",{",
		"    \"text\":\" Execution by creation !(creation_name) !(creation_version) was successful \\n\" # This is a comment",
		"  },{",
		"    \"text\":\" Found original programmer of this creation on \\n\", // Comment's will not interact with your script",
		"    \"bold\": true",
		"  },{",
		"    \"text\":\" block=\\\"grass,type=\\\\\\\"0\\\\\\\"\\\" \\n\", /* This is just another way of stating a comment */",
		"    \"color\":\"gold\",",
		"    \"bold\": true",
		"  }",
		"]",
		"",
	]

	openContent(content);

}



function getCommands(){
	// Gets all commands
	var editor = document.getElementById("editor");
		editor.value = tidyCommands().join("\n");
	var arr = editor.value.split(/(>>)/g);
	
	// Removes '/'
	arr.shift();

	// Removes empty commands
	var arr = arr.filter(function(el){return el != null});
	
	// Sorts command to proper way
	for (i=0;i<arr.length;i++){
	
		arr[i]='/'+arr[i];
		
		if (arr[i].match(/(\/tellraw)/g))
		{   // if start position to char ' " ' is first than start position to "["
			if(checkFor("escape")!=true){checkFor("json")}
		}
		
		else if (arr[i].match(/(\/execute)/g))
		{
			if (arr[i].match(/(tellraw)/g)){
				// if start position to char ' " ' is first than start position to "["
				if(checkFor("escape")!=true){checkFor("json")}
			} 
			else { checkFor("dataTag") }
		}
		
		
		// Removes spacing for following commands
		else if (
			arr[i].match(/(\/advancement)/g)
			|| arr[i].match(/(\/difficulty)/g)
			|| arr[i].match(/(\/effect)/g)
			|| arr[i].match(/(\/function)/g)
			|| arr[i].match(/(\/gamemode)/g)
			|| arr[i].match(/(\/gamerule)/g)
			|| arr[i].match(/(\/help)/g)
			|| arr[i].match(/(\/kill)/g)
			|| arr[i].match(/(\/locate)/g)
			|| arr[i].match(/(\/me)/g)
			|| arr[i].match(/(\/particle)/g)
			|| arr[i].match(/(\/playsound)/g)
			|| arr[i].match(/(\/publish)/g)
			|| arr[i].match(/(\/recipe)/g)
			|| arr[i].match(/(\/reload)/g)
			|| arr[i].match(/(\/say)/g)
			|| arr[i].match(/(\/scoreboard)/g)
			|| arr[i].match(/(\/seed)/g)
			|| arr[i].match(/(\/setworldspawn)/g)
			|| arr[i].match(/(\/spawnpoint)/g)
			|| arr[i].match(/(\/spreadplayers)/g)
			|| arr[i].match(/(\/stats)/g)
			|| arr[i].match(/(\/stopsound)/g)
			|| arr[i].match(/(\/teleport)/g)
			|| arr[i].match(/(\/tell)/g)
			|| arr[i].match(/(\/testforblocks)/g)
			|| arr[i].match(/(\/time)/g)
			|| arr[i].match(/(\/toggledownfall)/g)
			|| arr[i].match(/(\/tp)/g)
			|| arr[i].match(/(\/trigger)/g)
			|| arr[i].match(/(\/weather)/g)
			|| arr[i].match(/(\/worldborder)/g)
			|| arr[i].match(/(\/xp)/g)
		) { removeSpacing() }
		
		// Removes any spacings in squirly brackets for following commands
		// Howether it will ignore spacing which are in doubble quotes.
		else if (
			arr[i].match(/(\/blockdata)/g)
			|| arr[i].match(/(\/clear)/g)
			|| arr[i].match(/(\/clone)/g)
			|| arr[i].match(/(\/debug)/g)
			|| arr[i].match(/(\/entitydata)/g)
			|| arr[i].match(/(\/fill)/g)
			|| arr[i].match(/(\/give)/g)
			|| arr[i].match(/(\/replaceitem)/g)
			|| arr[i].match(/(\/setblock)/g)
			|| arr[i].match(/(\/summon)/g)
			|| arr[i].match(/(\/testfor)/g)
			|| arr[i].match(/(\/testforblock)/g)
			|| arr[i].match(/(\/title)/g)
		)
		{ checkFor("dataTag") }
		
		function checkFor(data)
		{
			if (data=="dataTag")
			{
				// Match everything from "/" to "{"
				if (arr[i].match(/[/](.*)[/{]/g))
				{
					cmd=arr[i].match(/[/](.*)[/{]/g);
					sortByShifting(cmd);
					return true;
				} 
				else { removeSpacing() }
			}
			else if (data=="json")
			{
				// Match everything from "/" to "["
				if (arr[i].match(/[/](.*)[[]/g))
				{
					cmd=arr[i].match(/[/](.*)[[]/g);
					sortByShifting(cmd);
					return true;
				}
				else { removeSpacing() }
			} 
			else if (data=="escape")
			{
				// Match everything from "/" to '"'
				if (arr[i].match(/[/](.*)[/"]/g))
				{
					cmd=arr[i].match(/[/](.*)[/"]/g);
					sortByShifting(cmd);
					return true;
				}
			}
			else { return false }
		}
		
		function removeSpacing()
		{	// Loops through the string backwards
			for (var x=arr[i].length - 1; x >= 0; x--)
			{   // If selected element is spacing (return)
				if (arr[i][x].match(/\s/g))
				{
					arr[i]=arr[i].substr(0,x);
				}
				else 
				{	// Removes folowing character "/" if at first position
					if (arr[i][0]=="/")
					{
						arr[i]=arr[i].substr(1, (arr[i].length-1));
						break
					}
				}
			}  
		}
		
		function sortByShifting(cmd) {
			// Removes command and unwanted spaces, however it ignores spaces in double quotes
			arr[i]=arr[i].replace(cmd,'');
			arr[i]=arr[i].replace(/\s+(?=([^"\\]*(\\.|"([^"\\]*\\.)*[^"\\]*"))*[^"]*$)/g,'');
			// Generates ready command
			arr[i]=cmd+arr[i];
			arr[i]=arr[i].substr(1,((arr[i].length)-1));
		}	
	}

	////////////////////////////
	// Removes commands '/>>' //
	////////////////////////////

	Array.prototype.remove = function() {
	    var what, a = arguments, L = a.length, ax;
	    while (L && this.length) {
	        what = a[--L];
	        while ((ax = this.indexOf(what)) !== -1) {
	            this.splice(ax, 1);
	        }
	    }
	    return this;
	};

	arr.remove("/>>");

	return arr;
}