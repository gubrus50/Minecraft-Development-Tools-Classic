// Audio element / button sound
var audio = new Audio("sounds/btn_click.mp3");
function play() {
  audio.currentTime = 0.6;
  audio.play();
}

var docB = document.body;

// bind mousewheel event on the mouseWheel function
if (docB.addEventListener)
{
    docB.addEventListener('DOMMouseScroll',mouseWheel,false);
    docB.addEventListener("mousewheel",mouseWheel,false);
}
else { docB.onmousewheel=mouseWheel }

// Disables ctrl button
function mouseWheel(e)
{
    e=e?e:window.event;
    if (e.ctrlKey)
    {
        if(e.preventDefault) e.preventDefault();
        else e.returnValue=false;
        return false;
    }
}

function signClear(){ // Sets active attribute to false for all
	sl = document.getElementsByClassName("sl");
	cmd = document.getElementsByClassName("commands");
	btn = document.getElementsByClassName("btn");
	for (i=0;i<sl.length;i++){
		sl[i].setAttribute("active", "false");
		cmd[i].setAttribute("active", "false");
		btn[i].setAttribute("active", "false");
	}
}

function signShow(elm){ // Sets active attribute to true for X elm
	sl = document.getElementsByClassName("sl");
	cmd = document.getElementsByClassName("commands");
	btn = document.getElementsByClassName("btn");
	sl[elm].setAttribute("active", "true");
	cmd[elm].setAttribute("active", "true");
	btn[elm].setAttribute("active", "true");
}


var iframe = document.getElementById("theWYSIWYG");
var editor = iframe.contentDocument;

if (editor == undefined || editor == null){
  var editor = iframe.contentWindow.document;
}

///////////////////////////////////////////////////
//     THE FOLLOWING COMMANDS ARE DEFINING       //
//       FUNCTIONS FOR theRibbon DIVISION        //
///////////////////////////////////////////////////


boldButton.onclick = function() {
	play();
	editor.execCommand("Bold", false, null);
}

italicButton.onclick = function() {
	play();
	editor.execCommand("italic", false, null);
}

underlineButton.onclick = function() {
	play();
	editor.execCommand("underline", false, null);
}

obfuscateButton.onclick = function() {
	play();
	editor.execCommand('createLink', false, "#");
}

undoObfuscateButton.onclick = function() {
	play();
	editor.execCommand('unLink', false, "#");
}

strikeButton.onclick = function() {
	play();
	editor.execCommand("Strikethrough", false, null);
}

// This command links to function setColor(color);
fontColorButton.onclick = function() {
	play();
	fct = $("#foreColorTable");
	fct.fadeIn();

}

// This removes commands which remove input slection
// from theWYSIWYG when the FCB pressed
fontColorButton.onmousedown = function() {
	return false;
}

// Sets color to highlighted text
function setColor(color){
	play();
	fcbc = document.getElementById("fcbColor");
	fcbc.style.backgroundColor=color;
	editor.execCommand("ForeColor", false, color);
	$('#foreColorTable').fadeOut();
	editor.selection.empty();
}

////////////////////////////////////////////////
//   THE FOLLOWING COMMANDS ARE STORING AND   //
// EXECUTING THE DATA GATHERED FROM THE SIGN  //
////////////////////////////////////////////////

function resetSignCommands(){
	// Loops through each textarea and appends default commands for each
	var signCommands = $("textarea[class=sign-commands]");
	var defaultCommands = [
		// Sign I
		"/particle largeexplode ~ ~1 ~8 1.2 2.0 1.2 3 9",
		"/playsound minecraft:entity.generic.explode player @a ~ ~ ~",
		"/tellraw @a {\"text\":\"!(creation_name) has been destroyed!\",\"color\":\"gold\"}",
		"/fill ~1 ~-5 ~ ~-2 ~3 ~16 air",
		// Sign II
		"/particle instantSpell ~ ~ ~ 0.2 0.2 0.2 9 9",
		"/playsound minecraft:entity.player.levelup player @a ~ ~ ~",
		"/tellraw @a {\"text\":\"Instruction...\",\"color\":\"aqua\"}",
		"/give @p written_book 1 0 {pages:[\"[\\\"\\\",{\\\"text\\\":\\\"[Instruction]\\\\n\\\\n\\\",\\\"color\\\":\\\"aqua\\\",\\\"bold\\\":true},{\\\"text\\\":\\\"- Item recipes:\\\",\\\"color\\\":\\\"black\\\",\\\"bold\\\":false}]\"],title:Book,author:!(creation_programmer)}",
		// Sign III
		"/tellraw @a {\"text\":\"!(creation_name) has been activated!\",\"color\":\"gold\"}",
		"/playsound block.piston.contract block @a ~ ~ ~ 10 1",
		"/setblock ~ ~-2 ~2 repeating_command_block 3 replace {auto:1b,TrackOutput:0}",
		"/fill ~1 ~4 ~1 ~-2 ~-2 ~17 stained_glass 3 replace stained_glass",
		// Sign IV
		"/tellraw @a {\"text\":\"!(creation_name) has been deactivated!\",\"color\":\"gold\"}",
		"/playsound block.piston.extend block @a ~ ~ ~ 10 1",
		"/setblock ~1 ~-2 ~2 command_block 3",
		"/fill ~2 ~4 ~1 ~-1 ~-2 ~17 stained_glass 7 replace stained_glass"
	];

	for (i=0;i<signCommands.length;i++)
	{
		if (i<4)
		{
			signCommands[i].value = defaultCommands[i];
		}
		else if (i>3&&i<8)
		{
			signCommands[i].value = defaultCommands[i];
		}
		else if (i>7&&i<12)
		{
			signCommands[i].value = defaultCommands[i];
		}
		else if (i>11&&i<16)
		{
			signCommands[i].value = defaultCommands[i];
		}
	}
}

function resetSignContent(){
	// Defines default data
	signDocument = document.getElementsByTagName("iframe")[0].contentWindow.document;
	sign1Content = ['[Cmd1.12.X]','Creation Name','by','Programmer']; // Sign I
	sign2Content = ['[Instruction]','Right-click','this sign','to get help']; // Sign II
	sign3Content = ['[Activate]','Right-click','this sign to','activate']; // Sign III
	sign4Content = ['[Deactivate]','Right-click','this sign to','deactivate']; // Sign IV
	signMode = 5;

	// Imports default data to all signs
	openSign(1, getSignContent());
}

function getSignContent(){
	// Gathers content from theWYSIWYG iframe (sign)
	d1 = signDocument.getElementById("1").innerHTML;
	d2 = signDocument.getElementById("2").innerHTML;
	d3 = signDocument.getElementById("3").innerHTML;
	d4 = signDocument.getElementById("4").innerHTML;
	
	// Resets the sign content
	signDocument.getElementById("1").innerHTML = '';
	signDocument.getElementById("2").innerHTML = '';
	signDocument.getElementById("3").innerHTML = '';
	signDocument.getElementById("4").innerHTML = '';

	// Stores sign content
	if (signMode===1)
	{
		sign1Content[0] = d1;
		sign1Content[1] = d2;
		sign1Content[2] = d3;
		sign1Content[3] = d4;
	}
	else if (signMode===2)
	{
		sign2Content[0] = d1;
		sign2Content[1] = d2;
		sign2Content[2] = d3;
		sign2Content[3] = d4;
	}
	else if (signMode===3)
	{
		sign3Content[0] = d1;
		sign3Content[1] = d2;
		sign3Content[2] = d3;
		sign3Content[3] = d4;
	}
	else if (signMode===4)
	{	
		sign4Content[0] = d1;
		sign4Content[1] = d2;
		sign4Content[2] = d3;
		sign4Content[3] = d4;
	}
	else if (signMode===5)
	{
		signMode = 1;
	}

	// Stores sign content commands
	var signCommands = document.getElementsByClassName("sign-commands");
	var sign1Commands = [];
	var sign2Commands = [];
	var sign3Commands = [];
	var sign4Commands = [];

	for (i=1;i<(signCommands.length+1);i++)
	{
		if (i<5)
		{
			sign1Commands.push(signCommands[(i-1)].value);
		}
		else if (i>4&&i<9)
		{
			sign2Commands.push(signCommands[(i-1)].value);
		}
		else if (i>8&&i<13)
		{
			sign3Commands.push(signCommands[(i-1)].value);
		}
		else if (i>12&&i<17)
		{
			sign4Commands.push(signCommands[(i-1)].value);
		}
	}

	// Sets sorage
	var signContent = {

		"i": sign1Content,
		"iCmd": sign1Commands,

		"ii": sign2Content,
		"iiCmd": sign2Commands,

		"iii": sign3Content,
		"iiiCmd": sign3Commands,

		"iv":  sign4Content,
		"ivCmd": sign4Commands
	}

	return signContent;
}

// Imports sign contents to the editor
//
// Requires parameter signContent=getSignContents()
// and      parameter sMode=signMode
//
function openSign(sMode, signContent){
	// Selects sign content >-> divisions
	d1 = signDocument.getElementById("1");
	d2 = signDocument.getElementById("2");
	d3 = signDocument.getElementById("3");
	d4 = signDocument.getElementById("4");

	// Imports data from signContents to editor
	if (sMode===1)
	{
		d1.innerHTML = signContent.i[0];
		d2.innerHTML = signContent.i[1];
		d3.innerHTML = signContent.i[2];
		d4.innerHTML = signContent.i[3];
	}
	else if (sMode===2)
	{
		d1.innerHTML = signContent.ii[0];
		d2.innerHTML = signContent.ii[1];
		d3.innerHTML = signContent.ii[2];
		d4.innerHTML = signContent.ii[3];
	}
	else if (sMode===3)
	{
		d1.innerHTML = signContent.iii[0];
		d2.innerHTML = signContent.iii[1];
		d3.innerHTML = signContent.iii[2];
		d4.innerHTML = signContent.iii[3];
	}
	else if (sMode===4)
	{
		d1.innerHTML = signContent.iv[0];
		d2.innerHTML = signContent.iv[1];
		d3.innerHTML = signContent.iv[2];
		d4.innerHTML = signContent.iv[3];
	}
}


// Defines buttons I, II, III and IV
//
document.getElementById("i").onclick = function(){
	play();
	signClear(); // Hides all commands
	signShow(0); // Shows 4 commands of sign i

	var signContent = getSignContent();
	setTimeout(function() {
		signMode = 1;
		openSign(signMode,signContent);
	}, 0);
	
}

document.getElementById("ii").onclick = function(){
	play();
	signClear(); // Hides all commands
	signShow(1); // Shows 4 commands of sign ii

	var signContent = getSignContent();
	setTimeout(function() {
		signMode = 2;
		openSign(signMode,signContent);
	}, 0);
}

document.getElementById("iii").onclick = function(){
	play();
	signClear(); // Hides all commands
	signShow(2); // Shows 4 commands of sign iii

	var signContent = getSignContent();
	setTimeout(function() {
		signMode = 3;
		openSign(signMode,signContent);
	}, 0);
}

document.getElementById("iv").onclick = function(){
	play();
	signClear(); // Hides all commands
	signShow(3); // Shows 4 commands of sign iv

	var signContent = getSignContent();
	setTimeout(function() {
		signMode = 4;
		openSign(signMode,signContent);
	}, 0);
}

function getCurrentSignMode(){

	var elm = $("input[active=\"true\"]")[0];
	if (elm.id=="i"){ return 1 }
	else if (elm.id=="ii"){ return 2 }
	else if (elm.id=="iii"){ return 3 }
	else if (elm.id=="iv"){ return 4 }

}

// Sets everything to default
function resetSignEditor(){

	document.getElementById("fcbColor").style.backgroundColor="gray";
	resetSignContent();
	resetSignCommands();
	document.getElementById("i").setAttribute("active", "true");
	document.getElementById("ii").setAttribute("active", "false");
	document.getElementById("iii").setAttribute("active", "false");
	document.getElementById("iv").setAttribute("active", "false");
	
}

function importSignProject(pSign1Content,pSign2Content,pSign3Content,pSign4Content,pSign1Commands,pSign2Commands,pSign3Commands,pSign4Commands){

	// Loops through each textarea and appends default commands for each
	var signCommands = $("textarea[class=sign-commands]");
	var defaultCommands = [
		pSign1Commands[0],
		pSign1Commands[1],
		pSign1Commands[2],
		pSign1Commands[3],
		pSign2Commands[0],
		pSign2Commands[1],
		pSign2Commands[2],
		pSign2Commands[3],
		pSign3Commands[0],
		pSign3Commands[1],
		pSign3Commands[2],
		pSign3Commands[3],
		pSign4Commands[0],
		pSign4Commands[1],
		pSign4Commands[2],
		pSign4Commands[3]
	];

	for (i=0;i<signCommands.length;i++)
	{
		if (i<4)
		{
			signCommands[i].value = defaultCommands[i];
		}
		else if (i>3&&i<8)
		{
			signCommands[i].value = defaultCommands[i];
		}
		else if (i>7&&i<12)
		{
			signCommands[i].value = defaultCommands[i];
		}
		else if (i>11&&i<16)
		{
			signCommands[i].value = defaultCommands[i];
		}
	}

	// Defines default data
	signDocument = document.getElementsByTagName("iframe")[0].contentWindow.document;
	sign1Content = pSign1Content;
	sign2Content = pSign2Content;
	sign3Content = pSign3Content;
	sign4Content = pSign4Content;
	signMode = 5;

	// Imports default data to all signs
	openSign(1, getSignContent());

}

////////////////////////////////////////
// FUNCTIONS FOR HELPING MANAGING     //
// THE TEXT CONVERTION AND VALIDATION //
////////////////////////////////////////

// Escapes Special Characters || Use only to convert to minecraft dataTag
function escapeSC(str, loopNumber){
	for (var i=0; i<loopNumber; i++)
	{
	    str = str.replace(/\\/g, '\\\\');
	    str = str.replace(/\t/g, '\\t');
	    str = str.replace(/\n/g, '\\n');
	    //str = str.replace(/'/g, "\\'");
	    str = str.replace(/"/g, '\\"');
	}
    return str;
}

// Escapes Special Characters || Use only for regular expresions
function escapeRegExp(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}


////////////////////////////////////////////
// FUNCTIONS FOR CONVERTING THE DATA FROM //
// THE SIGN-EDITOR TO MINECRAFT COMMANDS  //
////////////////////////////////////////////

// Generates a command that will allow to summon the sign in minecraft world
function generate_sign_setblock(signLine1, signLine2, signLine3, signLine4, signCmd1, signCmd2, signCmd3, signCmd4)
{
	var signBlockData = 'wall_sign 2 0 {';

	for (var i=0, j=arguments.length-4; i<j; i++) {
		var signLine = convert_html_tags_to_special_tags(arguments[i]);
	    signBlockData += convert_signLine_and_its_command_to_dataTag(signLine, arguments[i+4], (i+1));
	}

	return signBlockData += '}';
}

// Returns font match - from <font> ... to </font>
// Its parameter allows only special tags.
// To convert html tags to special tags use the following function:
// convert_html_tags_to_special_tags();

function get_font_match(str){

  // Test for any tag (%0000%)
  var original_match = str.substring(0,6);
  if (/%\d{4}%/i.test(original_match)){
  	// If original_match is a font tag
  	if (/%02\d\d%/i.test(original_match))
  	{
      // Match from first font Tag to first font tag escape (%1110%)
      // fft stands for - first font tag
      var fft = original_match;
   	  var reg = new RegExp(fft+".+?%1110%","i");
      var match = str.match(reg)[0];
      original_match = match;

      // If its possible to select first tag and its tag_escape.
      // From (%FONT% to %1110%)
      if (/%02\d\d%.+?%1110%/i.test(match)){
      	var foo = match.match(/%02\d\d%.+?%1110%/i)[0];
      		foo.substring(6,foo.length);
	  	// Are there other font tags found in THIS Font match
	  	if (/.+?%02\d\d%.+?%1110%/i.test(foo)||/%02\d\d%.+?%1110%/i.test(foo)) // ERROR GO FIX IT NOW!
	  	{ 
	    	function match_font_tags(match, ready_FTE)
	    	{ 
	    		// Updates Font Tag(s) match
	      		function update_match(new_FTE){
	        		var reg = new RegExp(fft+".+?%1110%"+new_FTE,"i");
	        		var new_match = str.match(reg)[0];
		    		return new_match;
	      		}

	      		// Counts Font Tag(s)
		  		function count_FT(str){
	        		return ((str || '').match(/%02\d\d%/g) || []).length;
		  		}

		  		// Counts Font Tag(s) Escapes
		  		function count_FTE(str){
	        		return ((str || '').match(/%1110%/g) || []).length;
		  		}

				var count_FTE = count_FTE(match);
				var count_FT  = count_FT(match);
				var new_FTE   = "";
		
		  		/*console.log(
		  		    match,
		  		    new_FTE,
		  		    count_FT,
		  		    count_FTE
		  		);*/

		  		if (count_FT>count_FTE)
		  		{
		    		required_FTE = count_FTE;
		    		//console.log("[rFTE==cFTE] required_FTE = \""+required_FTE+"\"");

		    		// Applies N of required tag_escapes
		    		for (var i=0; i<required_FTE; i++){ new_FTE += ".+?%1110%" }
		    		// Repeats validation but with updated match
		    		match_font_tags(update_match(new_FTE),new_FTE);

		  		} else {
		    		reg = new RegExp(escapeRegExp(original_match)+ready_FTE,"i");
		  		}
	    	}

	    	match_font_tags(match, '');
  	  	}
      }
    } 
  }

  match = str.match(reg)[0];
  return match;
}

function convert_html_tags_to_special_tags(str){

	str = str.replace(/&nbsp;/g, ' ');

	str = str.replace(/<u>/g,'%0001%');
	str = str.replace(/<\/u>/g,'%1001%');
	
	str = str.replace(/<i>/g,'%0010%');
	str = str.replace(/<\/i>/g,'%1010%');
	str = str.replace(/<em>/g,'%0010%');
	str = str.replace(/<\/em>/g,'%1010%');
	
	str = str.replace(/<a href="#">/g,'%0011%');
	str = str.replace(/<\/a>/g,'%1011%');
	
	str = str.replace(/<strike>/g,'%0100%');
	str = str.replace(/<\/strike>/g,'%1100%');
	
	str = str.replace(/<b>/g,'%0101%');
	str = str.replace(/<\/b>/g,'%1101%');
	str = str.replace(/<strong>/g,'%0101%');
	str = str.replace(/<\/strong>/g,'%1101%');
	
	str = str.replace(/<font color="#aaaaaa">/g,'%0201%');
	str = str.replace(/<font color="#000000">/g,'%0202%');
	str = str.replace(/<font color="#a90400">/g,'%0203%');
	str = str.replace(/<font color="#0000b2">/g,'%0204%');
	str = str.replace(/<font color="#a900b2">/g,'%0205%');
	str = str.replace(/<font color="#13aaab">/g,'%0206%');
	str = str.replace(/<font color="#feac00">/g,'%0207%');
	str = str.replace(/<font color="#14ab00">/g,'%0208%');
	str = str.replace(/<font color="#ffffff">/g,'%0209%');
	str = str.replace(/<font color="#555555">/g,'%0210%');
	str = str.replace(/<font color="#fd5650">/g,'%0211%');
	str = str.replace(/<font color="#544cff">/g,'%0212%');
	str = str.replace(/<font color="#fd4dff">/g,'%0213%');
	str = str.replace(/<font color="#5bffff">/g,'%0214%');
	str = str.replace(/<font color="#ffff00">/g,'%0215%');
	str = str.replace(/<font color="#5cff00">/g,'%0216%');
	str = str.replace(/<\/font>/g,'%1110%');

	return str;
}


// Parameters:
// 	- str = convert_html_tags_to_special_tags(signLine.innerHTML); #SignLine text
//  - cmd = getSignContent().<i/ii/iii/iv>Cmd[signLineNumber-1]; #SignLine Command
//  - sln = signLine Number
//
// Function can run without parameter: cmd. If you want to call it then
// make sure that it is included as an empty string element.
function convert_signLine_and_its_command_to_dataTag(str, cmd, sln){

	if (isBlank(str)&&isBlank(cmd)){ return "" }

	function prepare_variable_dataTag(sln)
	{
		var dataTag = "Text"+sln+":";
		if (sln>1) { dataTag = ","+dataTag }

		// Removes "/" from command (cmd) and appends back slashes to escape special characters
		function prepare_cmd(cmd){
			if (cmd.substring(0,1)=="/"){ cmd = cmd.substring(1,cmd.length) } 
			cmd = escapeSC(cmd,2);

			return cmd;
		}

		// If command exists, apply to dataTag. Else, set default dataTag
		if (!isBlank(cmd)){
			cmd = prepare_cmd(cmd);
			dataTag += '"[{\\"text\\":\\"\\",\\"clickEvent\\":{\\"action\\":\\"run_command\\",\\"value\\":\\"'+cmd+'\\"}}';
		} else {
			dataTag += '[\\"\\"';
		}

		return dataTag;
	}

	var dataTag = prepare_variable_dataTag(sln);
	str = convert_html_tags_to_special_tags(str);


	while (str.length>0) 
	{
		var match = str.substring(0,6);

	    if (/%02\d{2}%/i.test(match)) { // If match is font tag

	    	match = get_font_match(str);
	    	str = str.replace(match,'');
	    	
	    	dataTag += convert_match_to_dataTag(match);

		} else if (/%0\d{3}%/i.test(match)) { // If match is special tag

			var match_tag_escape = match.replace(/%0/i,"%1");
			var reg = new RegExp(match+".+?"+match_tag_escape,"i");
			//console.log(str+" $ "+match+" $ "+reg);
			match = str.match(reg)[0];
			str = str.replace(match,'');
			
			dataTag += convert_match_to_dataTag(match);

		} else if (/.+?(%\d{4}%)/i.test(str)) { // If its possible to match these characters to nearest special tag

			match = str.match(/.+?(%\d{4}%)/i);
			match = match[0].replace(match[1],''); // Removes special tag, you are left with those random characters
			  str = str.replace(match,'');

			dataTag += ',{\\"text\\":\\"'+escapeSC(match,2)+'\\"}';

		} else if (match.length>0) {

			dataTag += ',{\\"text\\":\\"'+escapeSC(str,2)+'\\"}';
			str = "";
			break;
		}
	}

	dataTag += "]\"";
	return dataTag;
}

function convert_match_to_dataTag(str){

	var dataTag = "";
	var tags = [];
	var tag_json = [
		["%0001%",",\\\"underlined\\\":true"           ],
   	 	["%0010%",",\\\"italic\\\":true"               ],
   	 	["%0011%",",\\\"obfuscated\\\":true"           ],
   	 	["%0100%",",\\\"strikethrough\\\":true"        ],
   	 	["%0101%",",\\\"bold\\\":true"                 ],
   	 	["%0201%",",\\\"color\\\":\\\"gray\\\""        ],
   	 	["%0202%",",\\\"color\\\":\\\"black\\\""       ],
   	 	["%0203%",",\\\"color\\\":\\\"dark_red\\\""    ],
   	 	["%0204%",",\\\"color\\\":\\\"dark_blue\\\""   ],
   	 	["%0205%",",\\\"color\\\":\\\"dark_purple\\\"" ],
   	 	["%0206%",",\\\"color\\\":\\\"dark_aqua\\\""   ],
   	 	["%0207%",",\\\"color\\\":\\\"gold\\\""        ],
   	 	["%0208%",",\\\"color\\\":\\\"dark_green\\\""  ],
   	 	["%0209%",",\\\"color\\\":\\\"white\\\""       ],
   	 	["%0210%",",\\\"color\\\":\\\"dark_gray\\\""   ],
   	 	["%0211%",",\\\"color\\\":\\\"red\\\""         ],
   	 	["%0212%",",\\\"color\\\":\\\"blue\\\""        ],
   	 	["%0213%",",\\\"color\\\":\\\"light_purple\\\""],
   	 	["%0214%",",\\\"color\\\":\\\"aqua\\\""        ],
   	 	["%0215%",",\\\"color\\\":\\\"yellow\\\""      ],
   	 	["%0216%",",\\\"color\\\":\\\"green\\\""       ]
	];
	var tag_with_no_effect_on_blank = [
		"%0010%",
		"%0101%",
		"%0201%",
		"%0202%",
		"%0203%",
		"%0204%",
		"%0205%",
		"%0206%",
		"%0207%",
		"%0208%",
		"%0209%",
		"%0210%",
		"%0211%",
		"%0212%",
		"%0213%",
		"%0214%",
		"%0215%",
		"%0216%"
	];

	while (str.length>0) {

		// If first 6 characters of string are a default or font tag
		if (/%0\d{3}%/i.test(str.substring(0,6))) { 
			tags.push(str.substring(0,6)); // store default tag	
			str = str.substring(6,str.length) // Remove tag from string
		} 
		// If first 6 characters of string are NOT tags
		else if (!/%\d{4}%/i.test(str.substring(0,6))) {
			var foo = str.match(/.+?%\d{4}%/i)[0]; // Store all characters from start of the string to the nearest tag
			    foo = foo.replace(str.match(/%\d{4}%/i)[0],''); // Remove tag from dummy string (Only random characters left)

		    // Generate those characters to dataTag
			for (var i=0; i<tags.length; i++)
			{
				// Summary of IF contents. If first tag from tags array is found in tag_json array,
				// then convert THIS tag in form of json to the dataTag with the random characters.
				if (tag_json.indexOf(tags[i])){
					for (var x=0; x<tag_json.length; x++){
						if (tags[i]==tag_json[x][0]){
							if (tags.length==1&&isBlank(foo)&&tag_with_no_effect_on_blank.indexOf(tags[i])) {
								dataTag += ",{\\\"text\\\":\\\""+escapeSC(foo,2)+"\\\"";
							}
							else if (i<1) {
								dataTag += ",{\\\"text\\\":\\\""+escapeSC(foo,2)+"\\\""+tag_json[x][1];
							} else {
								dataTag += tag_json[x][1];
							}
							break;
						}	
					}
				}
			} dataTag += "}";

			// Remove those characters from string
			str = str.substring(foo.length, str.length);
		}
		// If first 6 characters of string are escapes of any tag
		else if (/%1\d{3}%/.test(str.substring(0,6))) {
			str = str.substring(6, str.length); // Removes this tag escape from string
			tags.splice(-1,1); // Removes last tag from tags array
		}
	}

	return dataTag;
}