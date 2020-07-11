/*  function play()
    
    REQUIREMENT:
    	variables: audio;

    when executed, 
    it will play an click_effect
    to inform the user that the
    action has taken place.

*/

var audio = new Audio("C:/Program Files (x86)/Minecraft-DT/app/sounds/btn_click.mp3");
function play() {
	audio.currentTime = 0.6;
    audio.play();
}

/*  window.onload = function()

    This function will append the events for grip object
    which will make it an grabable object.

    This means that the user now has an full control over
    the object grip positioning.

    Now the user can move the object anyware on the desktop
    display.

*/

window.onload = function () {
    var grip = document.getElementById('grip'),
        oX, oY,
        mouseDown = function (e) {
            if (e.offsetY + e.offsetX < 0) return;
            oX = e.screenX;
            oY = e.screenY;
            window.addEventListener('mousemove', mouseMove);
            window.addEventListener('mouseup', mouseUp);
        },
        mouseMove = function (e) {
            window.moveTo(screenX + e.screenX - oX, screenY + e.screenY - oY);
            oX = e.screenX;
            oY = e.screenY;
        },
        gripMouseMove = function (e) {
            this.style.cursor = (e.offsetY + e.offsetX > -1);
        },
        mouseUp = function (e) {
            window.removeEventListener('mousemove', mouseMove);
            window.removeEventListener('mouseup', mouseUp);
        };
    grip.addEventListener('mousedown', mouseDown);
    grip.addEventListener('mousemove', gripMouseMove);

}

/*  function block()

    REQUIREMENT:
        variables: var i; var pages;

    This function will create a new page for the
    tools (

        Applications / folders from MDT-Tools folder located in %appdata%
        were each application / folder is used for Minecraft-DT.hta

    )

    The function block() has been created to include the
    tools that has not been able to fit in on to the main display.

    About 3 tools can be setteled on the main display at once,
    else the tools would be displayed all over the main display,
    making a mess.

*/

var i = 0;
var pages = 0;
function block() {
	i++; pages++;
	document.getElementById("parent").innerHTML += '<div id="box'+i+'" class="tools"></div>';
}

/*  function imp()

    REQUIREMENT:
        variables: toolName; var i; MDTT;
        functions: block(); play();

    LINKS-TO:
        applications: AppLauncher.hta
        scripts: config.js (Located in MDTT)

    **the imp() is a shortcut of "IMPORT"
    **MDTT is a shortcut of Minecraft-Developing-Tool-Tools
    **MDTT is a location of MDT-tools folder located in %appdata%

    This function will create a new 
    tool (

        applications / folders from MDT-Tools folder located in %appdata%
        were each application / folder is used for Minecraft-DT.hta

    )

    WARNING:
        Before it can include any tools, it requires a page in wich the tools will
        be displayed in. This can be easily done by using the function block();

    EXAMPLE:
        block(); // Creates first page
            toolName='MyToolName_1'; imp(); // Defines tool and includes it
            toolName='MyToolName_2'; imp(); // Defines tool and includes it
            toolName='MyToolName_3'; imp(); // Defines tool and includes it
        block(); // Creates second page
            toolName='MyToolName_4'; imp(); // Defines tool and includes it

    COMMANDS:
        image:
            Receives tools logo from the tool 
            folder located in MDTT

        hover:
            Receives tools second logo which will
            appear when user hovers over the tool

        action:
            It executes play() and addDescription()
            functions, and changes "innerDescription" (
                bottom-left textarea located in Minecraft-DT.hta
            ) content

            function play() will add sound effect
            when tool pressed.

            and function addDescription() will
            reset the content from innerDescription element

			It also targets element id "run" and updates its
			script to open the tool that has been on action
			(this tool)
*/

toolName = '';
function imp() {
    // Receive sources from MDT-Tools folder located in %appdata% and creates each individual html elements for the tool creation plan
	image  = "this.src='"+MDTT+toolName+"/images/tool_img.png'; this.style.width='225px'; this.style.height='175px'; this.style.marginTop='60px'";
	hover  = "this.src='"+MDTT+toolName+"/images/tool_img_hover.png'; this.style.width='250px'; this.style.height='200px'; this.style.marginTop='35px'";
	action = 'play(); jQuery(document).ready(function(){setTimeout(function(){addDescription(); document.getElementById(\'innerDescription\').src=\''+MDTT+toolName+'/description.html\'},800);}); document.getElementById(\'run\').setAttribute(\'onclick\',\'play(); jQuery(document).ready(function(){setTimeout(function(){document.location.href=\\\''+MDTT+toolName+'/run.hta\\\'},800);})\'\)';
	style  = "width:225px; height:175px; margin-top: 60px";
	tool   = '<img onclick="'+action+'" src="'+MDTT+toolName+'/images/tool_img.png" onmouseout="'+image+'" onmouseover="'+hover+'" style="'+style+'" />';
    // Includes tool to the display page located in Minecraft-DT.hta (Links to function block())
    document.getElementById("box"+i).innerHTML += tool;
} 

/*  function addDescription()

    REQUIREMENT:
        functions: setDescription();

    This function updates the innerDescription content by
    removing the element "innerDescription" (

        bottom-left textarea located in Minecraft-DT.hta

    ) and recreates it as blank.

    In other words, it resets the innerDescription.
    Then it will call the setDescription() to set the
    content of the innerDescription (fixes a gap).

*/

function addDescription() {
    $('#innerDescription').remove(); // Remove innerDescription
    // Recreate innerDescription with scroll letteled to the top
    document.getElementById('description').innerHTML += '<iframe id="innerDescription" style="opacity: 0"></iframe>';
    document.getElementById('description').scrollTop = 0;
    // Call function setDescription() to set elm-id: "innerDescription" content
    jQuery(document).ready(function(){setTimeout(function(){ setDescription(); }, 100);});
}

/*	function setDescription()
	
	LINKS-TO:
		functions: addDescription();
		elements:
			id: "descriptoin" in application Minecraft-DT.hta

	This function sets the scrollbar of the element id "innerDescription"
	to the top, and makes its content to fill the blank, so the big gap
	when you scroll to the bottom of the iframe would be removed.


*/

function setDescription() {
    elm = document.getElementById('innerDescription');
    elm.style.height = elm.contentWindow.document.body.scrollHeight + 'px';
    // Makes innerDescription from function addDescription(); visible (Links to function addDescription())
    elm.style.opacity = '1';
}

/*  funciton readyApplication()

    LINKS-TO:
        functions: stopError();

    **This script is executed when Minecraft-DT.hta has launched.

    It sets and / or resets some of the
    Minecraft-DT.hta application scripts
     
*/

function readyApplication() {
    document.onselectstart = function() {return false}; // Disables selection
    $("img").mousedown(function(){return false}); // Disables image selection
    setCounter(); // Displays the counter of pages when more than 1 pages exist (links to function block())
    $('#loadscreen').remove(); // Remove the element which says "Loading please wait" when Minecraft-DT.hta runs
	isProgress = false; // It is a variable used for validation if the user is on page openFakePage(page). (Links to function stopError()) 
	stopError(null, isProgress); // Checks if user is on page fake-page
}

/*  function stopError()

    REQUIREMENT:
        variables: block; isProgress;

    LINKS-TO:
        function: readyApplication(); openFakePage(page);

    **openFakePage('about-mdt') is shortcut of "About Minecraft-Developing-Tool".
    **block variable is an image tag with id = "block" wich
      is located in function openFakePage(page).

    This function checks if the user is in page openFakePage(page);
    if it is in openFakePage(page) page, it will try to fix the
    error wich stops the user from moving the element #grip (

        the top bar which allows the user to move the
        application Minecraft-DT.hta anywere on the desctop
        display

    )

    It fixes the error by displaying the object wich covers the
    whole iframe screen. The iframe display is not fully a part 
    of the application Minecraft-DT.hta, so any event that currently 
    runs will be disabled when mouse is on hover with the iframe.
    By displaying an object which is over the iframe, the hover
    interaction never happens, and this is how the problem is 
    getting solved by this function.

 */

function stopError(block, isProgress) {
	if ( isProgress ) { // Checks if on page openFakePage(page)
        // Enables event which prevents hover with the iframe
		$('#grip').on('mousedown mouseup', function(e) {
			if (e.type == "mousedown") {
                // Displays invisible object infront of the iframe
				block.style.visibility = 'visible';
			} else {
                // Hides invisible object infront of the iframe
				block.style.visibility = 'hidden';
			}
		});
	} else {
        // Disables event when not in page openFakePage(page)
		$('#grip').off('mousedown mouseup');
	}
}

/*  function openFakePage(page)

    LINKS-TO:
        functions: stopError(block, isProgress);

    This function targets element "Launcher-Progress" and
    creates fake page which will apear on the main screen
	of application Minecraft-DT

    The page is the HTML element located in app folder
	the selected page from app folder will be displayed
	in an iframe
        
*/

function openFakePage(page){
	isProgress = true; // Sets to true to inform that the user is on fake page (Links to function stopError())
    progress = document.getElementsByTagName('LAUNCHER-PROGRESS')[0]; // Sets the html elements for the fake page
	progress.innerHTML = "\
	<div id=\"loadscreen\" style=\"background: #2b2b33; position: absolute; width: 987px; height: 382.5px; top: 32.5px; left: 0; opacity: 1; border-left: 1px solid black; border-right: 1px solid black\"><div style=\"position:absolute;top:5px;left:5px;\"><font style=\"color:#fff\">Ups... Something went wrong, the request to execute file \""+page+".html\" has been ignored.<br />Please make sure that the file exist in Minecraft-DT/app folder.</font></div>\
	<iframe id="+page+" src=\"app/"+page+".html\" onmousewheel=\"if(window.event.ctrlKey){return false}\" style=\"position: absolute; top: 0px; left: 0px; height: 100%; width: 100%; border: 0px\" onload=\"block = document.getElementById('block');stopError(block, isProgress);\"></iframe>\
    </div><div id=\"block\" style=\"visibility: hidden; opacity: 0; width: 1000px; height:490px; background: red; position: absolute; top: 30px; left: 0\"></div>";
}


/*  function viewTools()

    REQUIREMENT:
        variables: MDTT;

    **MDTT is a shortcut of Minecraft-Developing-Tool-Tools
    **MDTT is a location of MDT-tools folder located in %appdata%

    This function runs the file-explorer with search result of
    location of MDT-tools folder.

*/

function viewTools() {
    var oShell = new ActiveXObject("Shell.Application");
    oShell.ShellExecute(MDTT,"","","open","1");
}
