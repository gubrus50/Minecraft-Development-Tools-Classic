jQuery(document).ready(function($) {
	// Remove the element which says "Loading please wait" when Minecraft-DT.hta runs
	$('#loadscreen').remove();

	// Fadeout animation when one of the above images with class .options has been pressed
	// After the animation, editors will be displayed
	$(".option").eq(0).click(function(event) {
		$("img").delay(400).fadeOut(800);
		$("#user_interface_lock").delay(1400).fadeOut(800);
		setTimeout(function() {
			$("#setup").hide();
			$("#editors").delay(400).fadeIn(800);
		}, 2200);
	});

	// Fadeout animation when option OpenProject has been pressed
	// After the animation, division with id "projects" will be displayed
	// Inside the division, user is asked to open the project
	$(".option").eq(1).click(function(event) {
		importProjects();
		$(".user_interface_msg").fadeOut(800);
		$("#return").attr("onclick", "returnAction('toOptions')");
		$("#bar-block-close").attr("onclick", "closeWindow()");
		$("#bar-block-close2").attr("onclick", "closeWindow()");
		$("img").delay(400).fadeOut(800);
		setTimeout(function() {
			$(".user_interface_msg").html('<b>DOUBLE CLICK ON THE PROJECT TO LAUNCH IT</b>');
			$(".user_interface_msg").fadeIn(800);
			$('#projects').delay(400).fadeIn(800);
		}, 1400);
	});

	// Fadeout animation when img with id="logo" has been pressed
	// After the animation, aboutCCG iframe located at <LAUNCHER-PROGRESS> will be displayed
	// the iframe launcher about-ccg.html which describes the command creation generator
	$("#logo").click(function(event) {
		$(".user_interface_msg").fadeOut(800);
		$("#return").attr("onclick", "returnAction('toOptions')");
		$("#bar-block-close").attr("onclick", "closeWindow()");
		$("#bar-block-close2").attr("onclick", "closeWindow()");
		$("img").delay(400).fadeOut(800);
		setTimeout(function() {
			$(".user_interface_msg").html('<b>PRESS RETURN BUTTON TO ACCESS MENU</b>');
			$(".user_interface_msg").fadeIn(800);
			$('#aboutCCG').delay(400).fadeIn(800);
		}, 1400);
	});

	// When return pressed, button X will be set to default
	// This function returnAction('closeWindow') will activate only if user
	// is not in main screen (menu / isOptions=true). It asks the user a permission to close
	// the application. If user is in options screen, this function would just run function closeWindow()
	$("#return").click(function(event) {
		$("#bar-block-close").attr("onclick", "returnAction('closeWindow')");
		$("#bar-block-close2").attr("onclick", "returnAction('closeWindow')");
	});
});


var docB = document.body;

// Disables selection
$("img").mousedown(function(){ return false });
document.onselectstart = function(){ return false }


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


// Makes sure that when moving the application (by using element id="grip")
// the transportation will run smoothly, not glichy when mouse hovers over the iframe.
// Image with id="block" is located at run.hta - <LAUNCHER-PROGRESS> tag
var block = document.getElementById('block');
$('#grip').on('mousedown mouseup', function(e) {
	if (e.type == "mousedown") {
		block.style.visibility = 'visible';
	} else {
		block.style.visibility = 'hidden';
	}
});


var signBtn = document.getElementById("sign-editor-btn");
var containerBtn = document.getElementById("container-editor-btn");
// variable pause forces the user to wait before executing the 
// animation event when signBtn / containeBtn is pressed
var pause = "false";
// Shifts division id="editors" to the left side.
// This will make only id="container-editor" iframe visible on the screen
containerBtn.addEventListener("click", function(){
	play(); if($("#editors").css('left') == '0px'){
		if(pause == "false"){ pause = "true";
			$("#editors").animate({ left:'-987px' }, 800);
			setTimeout(function() { pause = "false" }, 1000);
		}
	}
});
// Shifts division id="editors" to the right side.
// This will make only id="sign-editor" iframe visible on the screen
signBtn.addEventListener("click", function(){
	play(); if($("#editors").css('left') != '0px'){
		if(pause == "false"){ pause = "true";
			$("#editors").animate({ left:'0px' }, 800);
			setTimeout(function() { pause = "false" }, 1000);
		}
	}
});


/* --- ----------- --- */
/* ---  FUNCTIONS  --- */
/* --- ----------- --- */


// Audio element / button sound
var audio = new Audio("sounds/btn_click.mp3");
function play() {
  audio.currentTime = 0.6;
  audio.play();
}

// Sets description at the iframe which is located to the left of the green "save" button
function setDescription(){
    elm = document.getElementById('innerDescription');
    elm.style.height = elm.contentWindow.document.body.scrollHeight + 'px';
    elm.style.opacity = '1';
}

// Displays id="return-block" form <LAUNCHER-PROGRESS> tag (ONLY IF USER CHOOSED ONE OF FOLLOWING OPTIONS)
// which is a division that asks user to execute specific action.
// e.g. closeWindow action will ask the user to execute function closeWindow(); wich forces app to shut down
var isOptions = true; // Located at run.hta - images with class="option"
function returnAction(call){
	rb = $("#return-block");
	if (isOptions == false){

		if (call == 'closeWindow'){
			rb.html('\
			<div>\
				<h2>Warning!</h2>\
				<p>Your progress will not be saved after confirming this action.<br/>\
				Are you sure you want to shut down the application?</p>\
				<button onclick="play(); setTimeout(function() { closeWindow() }, 200)">Confirm</button>\
				<button onclick="play(); $(\'#return-block\').fadeOut()" style="margin-left: 25px">Deny</button>\
			</div>');
			$(rb).fadeIn();

		} else if (call == 'toLauncher'){ 
			rb.html('\
			<div>\
				<h2>Warning!</h2>\
				<p>Your progress will not be saved after confirming this action.<br/>\
				Are you sure you want to return to the menu?</p>\
				<button onclick="play(); $(\'#return\').attr(\'onclick\', null); $(\'#return-block\').fadeOut(800); setTimeout(function() { returnAction(\'toOptions\') }, 800); document.getElementById(\'sign-editor\').contentWindow.resetSignEditor(); document.getElementById(\'container-editor\').contentWindow.resetContainerEditor();">Confirm</button>\
				<button onclick="play(); $(\'#return-block\').fadeOut()" style="margin-left: 25px">Deny</button>\
			</div>');
			$(rb).fadeIn();

		} else if (call == 'generateCreation'){
			rb.html('\
			<div style="height: 260px; top: 65px">\
				<h2>Warning!</h2>\
				<p>Your progress will not be saved after confirming this action.<br/>\
				Are you sure you want to generate the creation?</p>\
				\
				<center>\
				<table style="margin-bottom: 10px; border: 1px solid #494654">\
				  <tr style="cursor: default">\
				    <th style="font-weight: normal; border-bottom: 1px solid #494654">BASE</th>\
				    <th style="font-weight: normal; border-bottom: 1px solid #494654">CEILING</th>\
				    <th style="font-weight: normal; border-bottom: 1px solid #494654">WALL</th>\
				  </tr>\
				<tr>\
				  <td><input class="containerMakeup" value="stone_slab 13" style="text-align: center; width:119px; background: #2b2b33; color: #fff; border: 0px" /></td>\
				  <td><input class="containerMakeup" value="stone_slab 5" style="text-align: center; width:119px; background: #2b2b33; color: #fff; border: 0px" /></td>\
				  <td><input class="containerMakeup" value="stained_glass 0" style="text-align: center; width:119px; background: #2b2b33; color: #fff; border: 0px" /></td>\
				</tr>\
				</table>\
				</center>\
				\
				<button onclick="play(); setTimeout(function() { generateCreation() }, 200);  $(\'#return-block\').fadeOut()">Confirm</button>\
				<button onclick="play(); $(\'#return-block\').fadeOut()" style="margin-left: 25px">Deny</button>\
			</div>');
			$(rb).fadeIn();

		} else if (call == 'toOptions'){
			$(".user_interface_msg").fadeOut(800);
			$("#setup").show();
			$("#editors").delay(400).fadeOut(800);
			$("#projects").delay(400).fadeOut(800);
			$('#aboutCCG').delay(400).fadeOut(800);
			setTimeout(function() {
				$(".user_interface_msg").html('<b>SELECT ONE OF THE OPTIONS ABOVE</b>');
				$(".user_interface_msg").fadeIn(800);
			}, 1000);
			$("#user_interface_lock").delay(1400).fadeIn(800);
			setTimeout(function() {
				$("img").delay(400).fadeIn(800);
				isOptions = true; // informs application that is in option choice page
				$("#return").attr("onclick", "returnAction('toLauncher')");
			}, 2200);
		}

	} else if (isOptions == true){
		if (call == 'closeWindow'){ closeWindow() } else if (call == 'toLauncher'){
			document.location.href='C:/Program Files (x86)/Minecraft-DT/minecraft-dt.hta';
		}
	}
}

// Generates .html file with data of the editor and asks user to save it
// while displaying the generated .html file.
function saveProject(){

	var signEditor = document.getElementById("sign-editor").contentWindow.getSignContent();
	var containerEditor = document.getElementById("container-editor").contentWindow.getFullContent();

	var fileData =  "<style>\n"+
					"textarea {\n"+
					"  color: #fff;\n"+
					"  width: 100%;\n"+
					"  height: 124.5px;\n"+
					"  border: 0px;\n"+
					"  border-bottom: 1px solid #515161;\n"+
					"  background-color: #24242b;\n"+
					"  scrollbar-face-color: #2b2b33;\n"+
					"  scrollbar-arrow-color: #9e9e9e;\n"+
					"  scrollbar-track-color: #24242b;\n"+
					"  scrollbar-corner-color: #24242b;\n"+
					"  scrollbar-shadow-color: #24242b;\n"+
					"  scrollbar-3dlight-color: #24242b;\n"+
					"  scrollbar-highlight-color: #24242b;\n"+
					"  scrollbar-darkshadow-color: #24242b;\n"+
					"  scrollbar-lightshadow-color: #24242b;\n"+
					"  direction: rtl;\n"+
					"  text-align: left\n"+
				    "}\n"+
				    "</style>\n"+

				    "<script type=\"text/javascript\">\n"+
				    "window.onload = function() {\n"+
				    "  var obj=document.body;\n"+
					"  // bind mousewheel event on the mouseWheel function\n"+
					"  if(obj.addEventListener)\n"+
					"  {\n"+
					"    obj.addEventListener('DOMMouseScroll',mouseWheel,false);\n"+
					"    obj.addEventListener('mousewheel',mouseWheel,false);\n"+
					"  }\n"+
					"  else obj.onmousewheel=mouseWheel;\n"+
					"}\n\n"+

				    "function mouseWheel(e)\n"+
				    "{\n"+
				    "  // disabling ctrl+scroll funcionality\n"+
				    "  e=e?e:window.event;\n"+
				    "  if(e.ctrlKey)\n"+
				    "  {\n"+
				    "    if(e.preventDefault) e.preventDefault();\n"+
				    "    else e.returnValue=false;\n"+
				    "    return false;\n"+
				    "  }\n"+
				    "}\n"+
				    "</script>\n" +
				   
				    "<div style=\"position:absolute;top:0;left:0;width:100%\">\n";

		fileData += "<textarea id=\"containerEditorContent\" readonly>";
		

		for (var i=0;i<containerEditor.length;i++)
		{
			if (i==0&&containerEditor[i].length<1) { fileData += "\n\n" }
			else { fileData += containerEditor[i] + "\n" }
		}

		fileData += "</textarea><br/><textarea id=\"signEditorContent\" readonly>";

		for (i=0;i<4;i++)
		{
			fileData += signEditor.i[i] + "\n";
		}

		for (i=0;i<4;i++)
		{
			fileData += signEditor.ii[i] + "\n";
		}

		for (i=0;i<4;i++)
		{
			fileData += signEditor.iii[i] + "\n";
		}

		for (i=0;i<4;i++)
		{
			fileData += signEditor.iv[i] + "\n";
		}

		fileData += "</textarea><br/><textarea id=\"signEditorCommands\" readonly>";

		for (i=0;i<4;i++)
		{
			fileData += signEditor.iCmd[i] + "\n";
		}

		for (i=0;i<4;i++)
		{
			fileData += signEditor.iiCmd[i] + "\n";
		}

		for (i=0;i<4;i++)
		{
			fileData += signEditor.iiiCmd[i] + "\n";
		}

		for (i=0;i<4;i++)
		{
			fileData += signEditor.ivCmd[i] + "\n";
		}

		fileData += "</textarea>\n</div>";

	var URI = 'charset=utf-8,';
	var fileName = "text-ccgp.html";
	var testlink = window.open("about:Minecraft-DT/CommandCreationGenerator", "_blank");

	testlink.document.write(fileData);
	testlink.document.close();
	testlink.document.execCommand('SaveAs', false, fileName);
	testlink.close();

	// After saving, sometimes sign content (theWYSIWYG) gets removed.
	// The following 2 scripts are fixing this problem by importing the previous data.
	var sMode = document.getElementById("sign-editor").contentWindow.getCurrentSignMode();
	document.getElementById("sign-editor").contentWindow.openSign(sMode, signEditor);
}

// Appends projects to the division with id "projectContainer"
project = ''; // Project is defined by updateConfig() which is a VBS function in run.hta
function imp()
{
	var projectContainer = document.getElementById("projectContainer");
		projectContainer.innerHTML += "<div class=\"projectsBox\" onclick=\"play(); displayProject('"+project+"')\" ondblclick=\"play(); openProject('"+project+"')\">"+project.replace(/(.html|.htm)/g, "");+"</div>";
}

// Opens window explorer with opened folder - projects
function viewProjects() {
	var loc = window.location.pathname;
	var dir = loc.replace(/run.hta/i, "projects");

	var oShell = new ActiveXObject("Shell.Application");
    oShell.ShellExecute(dir,"","","open","1");
}

// Creates cce_project_config.js wich contains project(s) location
// Then each project gets executed using function imp() located in cce_project_config.js
// Once imp() executed, project will be appended to division with id "projectsContainer"
function importProjects() {

	updateConfig()

	var projectContainer = document.getElementById("projectContainer");
		projectContainer.innerHTML = '<div class="myProjectsBox" onclick="play(); viewProjects()">MY PROJECTS</div>';

	var script = document.createElement("script");
		script.src = "scripts/cce_project_config.js";
		script.id = "config";

	document.getElementsByTagName("head")[0].appendChild(script);
	$("#config").remove();

}

// Imports content from the project to iframe with id "projectsDisplay"
function displayProject(project)
{
	var pd = document.getElementById("projectsDisplay");
		pd.src = "projects/"+project;
}

// Imports data from saved editor (.html file created by pressing the green button "save")
// to the sign-editor and container-editor
function openProject(project){

	var pd = document.getElementById("projectsDisplay");
		pd.src = "projects/"+project // Just in case, onclick does not work

	// Opens projects containerEditor
	var containerEditor = pd.contentWindow.document.getElementById("containerEditorContent").value.split('\n');
	document.getElementById("container-editor").contentWindow.openContent(containerEditor);

	///////////////////////////////
	// Opens projects signEditor //
	///////////////////////////////

	// Sets arrays
	var sign1Content = [];
	var sign2Content = [];
	var sign3Content = [];
	var sign4Content = [];

	var sign1Commands = [];
	var sign2Commands = [];
	var sign3Commands = [];
	var sign4Commands = [];

	// Gathers sign content
	var signEditorContent = pd.contentWindow.document.getElementById("signEditorContent").value.split('\n');
	
	for (var i=0; i<signEditorContent.length; i++)
	{
		if (i<4)
		{
			sign1Content.push(signEditorContent[i]);
		}
		else if (i>3&&i<8)
		{
			sign2Content.push(signEditorContent[i]);
		}
		else if (i>7&&i<12)
		{
			sign3Content.push(signEditorContent[i]);
		}
		else if (i>11&&i<16)
		{
			sign4Content.push(signEditorContent[i]);
		}
	}

	// Gathers sign commands
	var signEditorCommands = pd.contentWindow.document.getElementById("signEditorCommands").value.split('\n');
	
	for (var i=0; i<signEditorCommands.length; i++)
	{
		if (i<4)
		{
			sign1Commands.push(signEditorCommands[i]);
		}
		else if (i>3&&i<8)
		{
			sign2Commands.push(signEditorCommands[i]);
		}
		else if (i>7&&i<12)
		{
			sign3Commands.push(signEditorCommands[i]);
		}
		else if (i>11&&i<16)
		{
			sign4Commands.push(signEditorCommands[i]);
		}
	}

	// Opens projects signEditor
	document.getElementById("sign-editor").contentWindow.resetSignContent();
	document.getElementById("sign-editor").contentWindow.importSignProject(sign1Content,sign2Content,sign3Content,sign4Content,sign1Commands,sign2Commands,sign3Commands,sign4Commands);

	/////////////////////////////
	// Hides Projects division //
	/////////////////////////////

	$("#return").attr("onclick", "returnAction('toLauncher')");
	$("#bar-block-close").attr("onclick", "returnAction('closeWindow')");
	$("#bar-block-close2").attr("onclick", "returnAction('closeWindow')");
	$("#projects").delay(400).fadeOut(800);
	$("#user_interface_lock").delay(1400).fadeOut(800);
	setTimeout(function() {
		$("#editors").delay(400).fadeIn(800);
	}, 2200);	
}



//////////////////////////////////////////////////////////////////////////////////////////////////
                               //								 //
                               //   FUNCTIONS FOR GENERATING     //
                               //  CREATION SUMMONING SCRIPT(s)  //
                               //								 //
//////////////////////////////////////////////////////////////////////////////////////////////////

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

// Checks if string is empty
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

function removeSpecialTags(str) {
	
	str = str.replace(/&nbsp;/g, ' ');
	str = str.replace(/<u>/g,'');
	str = str.replace(/<\/u>/g,'');
	str = str.replace(/<i>/g,'');
	str = str.replace(/<\/i>/g,'');
	str = str.replace(/<em>/g,'');
	str = str.replace(/<\/em>/g,'');
	str = str.replace(/<a href="#">.+?<\/a>/g,'');
	str = str.replace(/<strike>/g,'');
	str = str.replace(/<\/strike>/g,'');
	str = str.replace(/<b>/g,'');
	str = str.replace(/<\/b>/g,'');
	str = str.replace(/<strong>/g,'');
	str = str.replace(/<\/strong>/g,'');
	str = str.replace(/<font color="#aaaaaa">/g,'');
	str = str.replace(/<font color="#000000">/g,'');
	str = str.replace(/<font color="#a90400">/g,'');
	str = str.replace(/<font color="#0000b2">/g,'');
	str = str.replace(/<font color="#a900b2">/g,'');
	str = str.replace(/<font color="#13aaab">/g,'');
	str = str.replace(/<font color="#feac00">/g,'');
	str = str.replace(/<font color="#14ab00">/g,'');
	str = str.replace(/<font color="#ffffff">/g,'');
	str = str.replace(/<font color="#555555">/g,'');
	str = str.replace(/<font color="#fd5650">/g,'');
	str = str.replace(/<font color="#544cff">/g,'');
	str = str.replace(/<font color="#fd4dff">/g,'');
	str = str.replace(/<font color="#5bffff">/g,'');
	str = str.replace(/<font color="#ffff00">/g,'');
	str = str.replace(/<font color="#5cff00">/g,'');
	str = str.replace(/<\/font>/g,'');

	return str;
}

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

// following function is supported only for minecraft version(s) 1.12.X
function generateCreation() {

	var data 		= getDataToGenerateCreation();
	var wallSigns 	= data[0];    // signs ready to summon
	var cName 	    = data[1][1]; // !(creation_name)
	var cVersion    = data[1][0]; // !(creation_version)
	var cProgrammer = data[1][2]; // !(creation_programmer)

	var summonContainer = generateContainer(wallSigns);
	var summonContainerCommands = generateContainerCommands(cName, cProgrammer, cVersion);
	saveCreation(summonContainer, summonContainerCommands, cName, cProgrammer, cVersion);
}

// Saves creation summoning commands
function saveCreation(summonContainer, summonContainerCommands, cName, cProgrammer, cVersion) {

	var testlink = window.open("about:Minecraft-DT/CommandCreationGenerator", "_blank");
	var fileName = cName+".html";
	var URI 	 = 'charset=utf-8,';
	var fileData = ""+

	"<h1>" + cName + " - " + cVersion + "</h1>"+
	"<h2>by " + cProgrammer + "</h2>"+

	"<div style=\"text-align:left\">Summon Empty Container<br />"+
	"<textarea style=\"width:600px;height:150px\">" + summonContainer + "</textarea>"+
	"</div>"+

	"<br />"+

	"<div style=\"text-align:left\">Include Commands<br />"+
	"<div><textarea style=\"width:600px;height:150px\">" + summonContainerCommands + "</textarea>"+
	"</div>"+

	"<h3>How to summon my creation:</h3><p>"+
	"* Once you're in creative mode, enter the following command: /give @p minecraft:command_block <br />"+
	"* Place given block on to the floor, facing up-wards <br />"+
	"* While holding Shift/Sneek button, place another command_block on to the previous placed block, facing up-wards <br />"+
	"* Copy 'Summon Empty Container' command and insert it into the first command_block using the following buttons: [Ctrl] and [V] <br />"+
	"* Copy 'Include Commands' command and do the same for next command_block <br />"+
	"* Once commands are included in both of the command_blocks, open the first command_block and set it to 'Always Active'"+
	"</p>";

	testlink.document.write(fileData);
	testlink.document.close();
	testlink.document.execCommand('SaveAs', false, fileName);
	testlink.close();
}


/** Data for Creation Summoning - wallSigns and signIClass
*
* Following function gathers ready signs data for summoning,
* and data from CCE custom variables: 
*
* => !(creation_name)
* => !(creation_version)
* => !(creation_programmer)
*/
function getDataToGenerateCreation() {

	var containerEditor  = document.getElementById("container-editor").contentWindow;
	var containerContent = containerEditor.getContent();
	var signEditor       = document.getElementById("sign-editor").contentWindow;
	var signContent      = signEditor.getSignContent();

	var wallSigns  = [];
	var signIClass = [                       // CCE custom variables:
		removeSpecialTags(signContent.i[0]), // => !(container_version)
		removeSpecialTags(signContent.i[1]), // => !(container_name)
		removeSpecialTags(signContent.i[3])  // => !(container_programmer)
	];

	wallSigns.push(signEditor.generate_sign_setblock(
		signContent.i[0],
		signContent.i[1],
		signContent.i[2],
		signContent.i[3],
		signContent.iCmd[0],
		signContent.iCmd[1],
		signContent.iCmd[2],
		signContent.iCmd[3]
	));
	wallSigns.push(signEditor.generate_sign_setblock(
		signContent.ii[0],
		signContent.ii[1],
		signContent.ii[2],
		signContent.ii[3],
		signContent.iiCmd[0],
		signContent.iiCmd[1],
		signContent.iiCmd[2],
		signContent.iiCmd[3]
	));
	wallSigns.push(signEditor.generate_sign_setblock(
		signContent.iii[0],
		signContent.iii[1],
		signContent.iii[2],
		signContent.iii[3],
		signContent.iiiCmd[0],
		signContent.iiiCmd[1],
		signContent.iiiCmd[2],
		signContent.iiiCmd[3]
	));
	wallSigns.push(signEditor.generate_sign_setblock(
		signContent.iv[0],
		signContent.iv[1],
		signContent.iv[2],
		signContent.iv[3],
		signContent.ivCmd[0],
		signContent.ivCmd[1],
		signContent.ivCmd[2],
		signContent.ivCmd[3]
	));

	/** Fix theWYSIWYG display
	*   
	*   After using function getSignContent(), sometimes sign content (theWYSIWYG) gets removed.
	*   The following 2 scripts are fixing this problem by importing the previous data.
	*/
	var sMode = signEditor.getCurrentSignMode();
	signEditor.openSign(sMode, signContent);

	/** Some Notes
	*
	*	CCE custom variables: 
	*	=> !(container_name) => signIClass[1]
	*	=> !(creation_version) => signIClass[0]
	*	=> !(container_programmer) => signIClass[2]
	*
	*	Those variables are defined by user from the first sign - sign I
	*/ 
	for (var i=0; i<4; i++) {
		wallSigns[i] = wallSigns[i].replace(/\!\(creation_name\)/g, signIClass[1]);
		wallSigns[i] = wallSigns[i].replace(/\!\(creation_version\)/g, signIClass[0]);
		wallSigns[i] = wallSigns[i].replace(/\!\(creation_programmer\)/g, signIClass[2]);
		wallSigns[i] = signEditor.escapeSC(wallSigns[i], 1);
	}

	return [wallSigns, signIClass];
}


/** Following function creates a minecraft script that will summon creation container
*   with empty commands
*
*   links to function generateCreation();
*/
function generateContainer(wallSigns){

	var base 	= document.getElementsByClassName('containerMakeup')[0].value;
	var wall 	= document.getElementsByClassName('containerMakeup')[2].value;
	var ceiling = document.getElementsByClassName('containerMakeup')[1].value;

	// If empty, set to default
	if (isBlank(base)){ base = "stone_slab 13" }
	if (isBlank(wall)){ wall = "stained_glass 0" }
	if (isBlank(ceiling)){ ceiling = "stone_slab 5" }

	var summonCommand = ""+

	/** Falling block with Passengers 
	*
	*	Summons redstone block on to the executed command block,
	*   and falling minecart with many command blocks.
	*/
	"summon falling_block ~ ~2 ~ {Block:stone,Time:1,Passengers:[{id:falling_block,Block:redstone_block,Time:1,"+
	"Passengers:[{id:falling_block,Block:activator_rail,Time:1,Passengers:[{"+
	
	/** Creations container
	*
	*	The following commands will disable commandBlockOutput,
	*	and generate empty container with 4 custom wall signs.
	*/
	"id:commandblock_minecart,Command:\"gamerule commandBlockOutput false\""+
	"},{"+
	"id:commandblock_minecart,Command:\"fill ~1 ~-2 ~3 ~-2 ~6 ~12 " + base + " hollow\""+
	"},{"+
	"id:commandblock_minecart,Command:\"fill ~1 ~-1 ~3 ~-2 ~5 ~12 " + wall + " 0 " + base + "\""+
	"},{"+
	"id:commandblock_minecart,Command:\"setblock ~-1 ~1 ~2 " + wallSigns[3] + "\""+
	"},{"+
	"id:commandblock_minecart,Command:\"setblock ~ ~1 ~2 " + wallSigns[2] + "\""+
	"},{"+
	"id:commandblock_minecart,Command:\"setblock ~-1 ~3 ~2 " + wallSigns[1] + "\""+
	"},{"+
	"id:commandblock_minecart,Command:\"setblock ~ ~3 ~2 " + wallSigns[0] + "\""+
	"},{"+
	
	/** Empty Command Blocks
	*
	*	The following commands will fill-up the container with empty command blocks,	
	*	that are ordered in specific pattern. (from bottom to top)
	*/
	"id:commandblock_minecart,Command:\"fill ~-1 ~-1 ~4 ~ ~5 ~11 chain_command_block 3\""+
	"},{"+
	"id:commandblock_minecart,Command:\"fill ~-1 ~5 ~11 ~-1 ~5 ~4 chain_command_block 2\""+
	"},{"+
	"id:commandblock_minecart,Command:\"setblock ~ ~5 ~11 chain_command_block 4\""+
	"},{"+
	"id:commandblock_minecart,Command:\"setblock ~ ~4 ~4 chain_command_block 1\""+
	"},{"+
	"id:commandblock_minecart,Command:\"fill ~ ~4 ~11 ~ ~4 ~5 chain_command_block 2\""+
	"},{"+
	"id:commandblock_minecart,Command:\"setblock ~-1 ~4 ~11 chain_command_block 5\""+
	"},{"+
	"id:commandblock_minecart,Command:\"setblock ~-1 ~3 ~4 chain_command_block 1\""+
	"},{"+
	"id:commandblock_minecart,Command:\"fill ~-1 ~3 ~11 ~-1 ~3 ~5 chain_command_block 2\""+
	"},{"+
	"id:commandblock_minecart,Command:\"setblock ~ ~3 ~11 chain_command_block 4\""+
	"},{"+
	"id:commandblock_minecart,Command:\"setblock ~ ~2 ~4 chain_command_block 1\""+
	"},{"+
	"id:commandblock_minecart,Command:\"fill ~ ~2 ~11 ~ ~2 ~5 chain_command_block 2\""+
	"},{"+
	"id:commandblock_minecart,Command:\"setblock ~-1 ~2 ~11 chain_command_block 5\""+
	"},{"+
	"id:commandblock_minecart,Command:\"setblock ~-1 ~1 ~4 chain_command_block 1\""+
	"},{"+
	"id:commandblock_minecart,Command:\"fill ~-1 ~1 ~11 ~-1 ~1 ~5 chain_command_block 2\""+
	"},{"+
	"id:commandblock_minecart,Command:\"setblock ~ ~1 ~11 chain_command_block 4\""+
	"},{"+
	"id:commandblock_minecart,Command:\"setblock ~ ~ ~4 chain_command_block 1\""+
	"},{"+
	"id:commandblock_minecart,Command:\"fill ~ ~ ~11 ~ ~ ~5 chain_command_block 2\""+
	"},{"+
	"id:commandblock_minecart,Command:\"setblock ~-1 ~ ~11 chain_command_block 5\""+
	"},{"+
	"id:commandblock_minecart,Command:\"setblock ~-1 ~-1 ~4 chain_command_block 1\""+
	"},{"+
	"id:commandblock_minecart,Command:\"fill ~-1 ~-1 ~11 ~-1 ~-1 ~5 chain_command_block 2\""+
	"},{"+
	"id:commandblock_minecart,Command:\"setblock ~ ~-1 ~11 chain_command_block 4\""+
	"},{"+
	"id:commandblock_minecart,Command:\"setblock ~ ~-1 ~4 command_block 3\""+
	"},{"+
	
	/** Command closer / eding
	*
	*	The following commands will setup the containers ceiling
	*	and erase themselves from the world.
	*/
	"id:commandblock_minecart,Command:\"fill ~1 ~6 ~3 ~-2 ~6 ~12 " + ceiling + "\""+
	"},{"+
	"id:commandblock_minecart,Command:\"setblock ~ ~-3 ~1 redstone_block\""+
	"},{"+
	"id:commandblock_minecart,Command:\"kill @e[type=commandblock_minecart,r=1]\""+
	"}]}]}]}";
	

	/** VALIDATION
	*
	* Following commands will inform user about any errors when
	* converting the project to coomand creation.
	*/

	if (summonCommand.length>32767) { alert(""+
		"Error: Commands out of legal range - "+summonCommand.length+"/32767"+
		"\n\nThis will result in failure of container generation."+
		"\nBasically, creation will not be summoned."
		)
	}

	return summonCommand;
}


function generateContainerCommands(cName, cProgrammer, cVersion) {

	var containerEditor = document.getElementById("container-editor").contentWindow;
	var cmds            = containerEditor.getCommands();
		cmds.unshift(""); /**
	----------------------------------------------------------------------------------
	*  cmds.unshift("") -> Appends empty command at first position, because the 
	*  first command block from the container is a repeating command block, not chain.
	*  Therefore has to be empty to allow other command blocks to remain active.
	*/

	/** Some Notes
	*
	*	CCE custom variables: 
	*	=> !(container_name) => cName
	*	=> !(creation_version) => cVersion
	*	=> !(container_programmer) => cProgrammer
	*
	*	Those variables are defined by user from the first sign - sign I
	*/ 
	//alert("found" + cmds.length + " valid commands");
	for (var i=0; i<cmds.length; i++) {
		cmds[i] = cmds[i].replace(/\!\(creation_name\)/g, cName);
		cmds[i] = cmds[i].replace(/\!\(creation_version\)/g, cVersion);
		cmds[i] = cmds[i].replace(/\!\(creation_programmer\)/g, cProgrammer);
		// Adds backslashes to escape doubble quotes twice
		cmds[i] = escapeSC(cmds[i], 2);
	}

	var summonCommand = ""+

	/** Falling block with Passengers 
	*
	*	Summons redstone block on to the executed command block,
	*   and falling minecart with many command blocks.
	*/
	"summon falling_block ~ ~4 ~ {Block:torch,Time:1,Passengers:[{";

	/** Prepared commands
	*
	*	The following commands will replace empty command blocks with	
	*	commands from the container-editor.
	*/
	var y = -1; var j = 0;

	while (cmds[j]!==undefined&&y<6) {

		for (var i=0; i<8; i++) {
			j++; if (cmds[(j-1)]===undefined) { break }
			summonCommand += ""+
			"id:commandblock_minecart,Command:\"blockdata ~ ~"+y+" ~"+(4+i)+" {auto:1,Command:\\\""+cmds[(j-1)]+"\\\"}\""+
			"},{";
		}

		for (var i=0; i<8; i++) {
			j++; if (cmds[(j-1)]===undefined) { break }
			summonCommand += ""+
			"id:commandblock_minecart,Command:\"blockdata ~-1 ~"+y+" ~"+(11-i)+" {auto:1,Command:\\\""+cmds[(j-1)]+"\\\"}\""+
			"},{";
		}

		y++; // positive shift for vertical axis

		for (var i=0; i<8; i++) {
			j++; if (cmds[(j-1)]===undefined) { break }
			summonCommand += ""+
			"id:commandblock_minecart,Command:\"blockdata ~-1 ~"+y+" ~"+(4+i)+" {auto:1,Command:\\\""+cmds[(j-1)]+"\\\"}\""+
			"},{";
		}

		for (var i=0; i<8; i++) {
			j++; if (cmds[(j-1)]===undefined) { break }
			summonCommand += ""+
			"id:commandblock_minecart,Command:\"blockdata ~ ~"+y+" ~"+(11-i)+" {auto:1,Command:\\\""+cmds[(j-1)]+"\\\"}\""+
			"},{";
		}

		y++; // positive shift for vertical axis
	}


	summonCommand += ""+

	/** Command closer / eding
	*
	*	The following commands will remove activated command block,
	*	and remove the fallng minecraft with the activated command blocks.
	*/
	"id:commandblock_minecart,Command:\"setblock ~ ~ ~1 command_block 0 0 {Command:\\\"fill ~ ~-4 ~-1 ~ ~ ~ air\\\"}\""+
	"},{"+
	"id:commandblock_minecart,Command:\"setblock ~ ~-1 ~1 redstone_block\""+
	"},{"+
	"id:commandblock_minecart,Command:\"kill @e[type=commandblock_minecart,r=2]\""+
	"}]}";



	/** VALIDATION
	*
	* Following commands will inform user about any errors when
	* converting the project to coomand creation.
	*/
	if (cmds.length>112) { alert(""+
		"Error: Too many command blocks - "+cmds.length+"/112"+
		"\n\nThis will result in failure of commands implementation."+
		"\n112 commands will be applied in the creation, however "+(cmds.length-112)+" will be ignored."
		)
	}
	if (summonCommand.length>32767) { alert(""+
		"Error: Commands out of legal range - "+summonCommand.length+"/32767"+
		"\n\nThis will result in failure of commands implementation."+
		"\nNone of your commands will be applied into the creation."
		)
	}

	return summonCommand;
}
