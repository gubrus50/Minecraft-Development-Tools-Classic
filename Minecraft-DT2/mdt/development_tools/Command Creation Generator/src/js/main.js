/* ------ START LIBRARIES ------ */

// Source: https://flaviocopes.com/how-to-slow-loop-javascript/
// Accessed: 21.09.2022
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}



const isRealNumber = (n) => {
  return (!(isNaN(n)) && typeof n == 'number') ? true : false;
}



const removeLineBreaks = (elm) => {
  elm.innerHTML = elm.innerHTML.replace(/(<div><br><\/div>|<br>)/g, '');
}



const trimExternalSpacing = (string) => {
  // Trim unnecessary spacing before and after command
  string = string.replace(/\s+$/gm, '');
  return   string.replace(/^\s+/g,  '');
}



const del_lastChar_from_lastNode = (node) => {
  if (!(node.childNodes.length)) {

    let txt = (node.nodeType === 3) ? node.nodeValue : node.innerHTML;
        txt = txt.substring(0, txt.length - 1);

    if (txt <= 0) node.remove();
    else if (node.nodeType === 3) node.nodeValue = txt;
    else node.innerHTML = txt;
    
  }
  else if (node.childNodes) {
    return del_lastChar_from_lastNode(node.lastChild);
  }
}



const createStyle = (className, css) =>
{
  /* Appends style tag in <head> tag.
   * Stylesheets with same className will be re-writen / replaced.
  */

  // Regexp removes white spaces at first position
  css.replace(/^\s+|\s+$/gm, '');
  stylesheet = document.head.querySelector(`[class="${className}"]`);

  if (stylesheet) {
    stylesheet.innerHTML = css;
  }
  else {
    head = document.head || document.getElementsByTagName('head')[0];
    stylesheet = document.createElement('style');
    stylesheet.type = 'text/css';
    stylesheet.className = className;
    stylesheet.appendChild(document.createTextNode(css));
    head.appendChild(stylesheet);
  }
}

/* ------ END LIBRARIES ------ */





const Global = {
  isOnLoading: true,
  isOnPopupAnimation: true,
  isOnSlideAnimation: false,

  creationVariables: {
    version: null,
    name: null,
    programmer: null
  },
  containerSettings: {
    base: '',
    wall: '',
    ceiling: ''
  }
}



async function setCreationVariables() {

  let firstSignData = getSignData(1); // Get first Sign's Data and return error if false or undefined
  if (!firstSignData) return console.error(`'firstSignData' is required, instead got: ${firstSignData}`);

  const isTextValid = (text) => {
    /* Remove allowed characters:
    / '0-9', 'A-Z' (Upper and lower case),
    / spacings (E.g. Tabs and spaces), '.', '-' and '_'
    */
    text = text.replace(/[0-9\a-zA-Z\s\.\-_]/g, '');
    if (text.length > 0) return false;
    return true;
  }

  firstSignData.display.map((inputData, index) =>
  {
    // Return if it's sign's 3'rd .input
    if (index === 2) return;

    // Construct text (.input's textContent)
    let text = '';
    inputData.map(data => text += data.text);

    // Set text to 'null' if empty or includes string object
    text = trimExternalSpacing(text);
    if (text.length === 0) text = null;

    // Initialize 'creationVariables' (found in main.js 'Global')
    if (index === 0 &&  /\[Cmd.+?]/g.test(text))
    {
      text = text.match(/\[Cmd.+?]/g)[0];
      text = text.slice(4,-1);

      Global.creationVariables.version = isTextValid(text) ? text : null;
    }
    else if (index === 1) Global.creationVariables.name = isTextValid(text) ? text : null;
    else if (index === 3) Global.creationVariables.programmer = isTextValid(text) ? text : null;
  });

}



async function setContainerSettings() {

  // Get container setting's input value without zero-width-space and unnecessary spacing
  let settingsElement = document.querySelector('.popup > .container .settings');

  for (let [key] of Object.entries(Global.containerSettings)) {

    // Get container setting's N input's value,
    // remove unnecessary spacing, and
    // remove zero-width-space
    let input = settingsElement.querySelector(`input[name="${key}"]`);
        value = trimExternalSpacing(input.value);
        value = value.replace(/[\u200B-\u200D\uFEFF]/g, '');

    // Log out error and continue if value's length is 0
    if (value.length === 0)
    {
      console.error(`'value' cannot be empty!`)
      value = trimExternalSpacing(input.placeholder);

      // Remove unnecessary spacing, and set value to lower case
      Global.containerSettings[key] = value.replace(/\s+/g, ' ').toLowerCase();
      continue;
    }


    /* Log out error if illegal characters are present in 'value'
    /
    / Remove allowed characters:
    / '0-9', 'A-Z' (Upper and lower case),
    / spacings (E.g. Tabs and spaces), and '_'
    */
    if (value.replace(/[0-9\a-zA-Z\s_]/g, '').length > 0)
    {
      console.error(`Found illegal characters in 'value': ${value}`);
      value = trimExternalSpacing(input.placeholder);

      // Remove unnecessary spacing, and set value to lower case
      Global.containerSettings[key] = value.replace(/\s+/g, ' ').toLowerCase();
    } 
    

    // Set N setting to valid 'value'
    Global.containerSettings[key] = value.replace(/\s+/g, ' ').toLowerCase();
  }

}



function addPassengerCommand(dataTagObject_Passenger, commandsArray) {
  commandsArray.map(command => dataTagObject_Passenger.push({
    id: "commandblock_minecart",
    Command: command
  }));
}



function getSummonContainerCommand() {

  setContainerSettings();

  let dataTagObject = {
    // Place stone on top of the command block
    Block: "stone",
    Time: 1,
    Passengers: [{
      // Place redstone on stone
      id: "falling_block",
      Block: "redstone_block",
      Time: 1,
      // Place activator rail on redstone block
      Passengers: [{
        id: "falling_block",
        Block: "activator_rail",
        Time: 1,
        // Stack commandBlocks on rail
        // (minecart-commandBlock is executed after it pops in the rail)
        Passengers: []
      }]
    }]
  }

  let commandsPassenger = dataTagObject.Passengers[0].Passengers[0].Passengers;
  addPassengerCommand(commandsPassenger, [
    // Disable logs output in the chat
    'gamerule commandBlockOutput false',
    // Create container
    `fill ~1 ~-1 ~3 ~-2 ~5 ~12 ${Global.containerSettings.wall}`, // Must be first, otherwise signs will not be displayed
    `fill ~1 ~-2 ~3 ~-2 ~-2 ~12 ${Global.containerSettings.base}`,
    `fill ~1 ~6 ~3 ~-2 ~6 ~12 ${Global.containerSettings.ceiling}`,
    // Apply signs on container
    'setblock ~ ~3 ~2 wall_sign 2 0 '   + getSignDataTag(1),
    'setblock ~-1 ~3 ~2 wall_sign 2 0 ' + getSignDataTag(2),
    'setblock ~ ~1 ~2 wall_sign 2 0 '   + getSignDataTag(3),
    'setblock ~-1 ~1 ~2 wall_sign 2 0 ' + getSignDataTag(4),
    // Fill container with empty chain commandBlocks
    'fill ~-1 ~-1 ~4 ~ ~5 ~11 chain_command_block 3',
    'fill ~-1 ~5 ~11 ~-1 ~5 ~4 chain_command_block 2',
    'setblock ~ ~5 ~11 chain_command_block 4',
    'setblock ~ ~4 ~4 chain_command_block 1',
    'fill ~ ~4 ~11 ~ ~4 ~5 chain_command_block 2',
    'setblock ~-1 ~4 ~11 chain_command_block 5',
    'setblock ~-1 ~3 ~4 chain_command_block 1',
    'fill ~-1 ~3 ~11 ~-1 ~3 ~5 chain_command_block 2',
    'setblock ~ ~3 ~11 chain_command_block 4',
    'setblock ~ ~2 ~4 chain_command_block 1',
    'fill ~ ~2 ~11 ~ ~2 ~5 chain_command_block 2',
    'setblock ~-1 ~2 ~11 chain_command_block 5',
    'setblock ~-1 ~1 ~4 chain_command_block 1',
    'fill ~-1 ~1 ~11 ~-1 ~1 ~5 chain_command_block 2',
    'setblock ~ ~1 ~11 chain_command_block 4',
    'setblock ~ ~ ~4 chain_command_block 1',
    'fill ~ ~ ~11 ~ ~ ~5 chain_command_block 2',
    'setblock ~-1 ~ ~11 chain_command_block 5',
    'setblock ~-1 ~-1 ~4 chain_command_block 1',
    'fill ~-1 ~-1 ~11 ~-1 ~-1 ~5 chain_command_block 2',
    'setblock ~ ~-1 ~11 chain_command_block 4',
    'setblock ~ ~-1 ~4 command_block 3',
    // Activate summon commandBlock -> getImportCreationCommand()
    // and, Remove previous commandBlocks
    'setblock ~ ~-2 ~ redstone_block',
    'kill @e[type=commandblock_minecart,r=1]'
  ]);

  return 'summon falling_block ~ ~2 ~ ' + JSON.stringify(dataTagObject);
}



async function getImportCreationCommand() {

  if (Global.isOnLoading) return false;

  /* NOTE! Minecraft's "blockdata" is added to 'dataTagObject' -> 'Passengers' key
  /
  /  Each blockdata command includes a 'dataTag'.
  /  That 'dataTag' includes N command from 'commands' (from containerGetCompiledCommands()) 
  /
  /  Blockdata command replaces the container's commandBlocks input with container-editor's commandBlocks
  */

  // Coordinate Or Nothing
  const CON = (coordinate) => (coordinate === 0) ? '' : coordinate;

  // Get and validate 'commands'
  let commands = await containerGetCompiledCommands();
  if (!commands) return console.error(`'commands' are required! instead got: ${commands}`);

  let dataTagObject = { Block: "torch", Time: 1, Passengers: [] };
  let direction = "south";
  let directionChangeCount = 0;

  // Minecraft's coordinates (X, Y, Z)
  let x = 0; let z = 3; let y = -1;

  // Include commands to dataTagObject's key's 'Passengers'
  commands.map(command => {

    // Increment / Decrement 'z' coordinate
    (direction == "south") ? z++ : z--;

    // add N 'command' to 'Passengers' key
    let dataTag = JSON.stringify({ auto: 1, Command: command });
    command = [`blockdata ~${CON(x)} ~${CON(y)} ~${CON(z)} ` + dataTag];

    addPassengerCommand(dataTagObject.Passengers, command);

    // Change 'direction' and Increment 'z' coordinate
    // Also, change 'x' coordinate to -1 or 0
    if (z === 11 && direction == "south") {
      directionChangeCount++;
      direction = "north";
      z++;

      (x === 0) ? x-- : x++;
    }
    // Change 'direction' and Decrement 'z' coordinate
    else if (z === 4 && direction == "north") {
      directionChangeCount++;
      direction = "south";
      z--;
    }
    // Increment 'y' coordinate and reset 'directionChangeCount'
    if (directionChangeCount === 2) {
      directionChangeCount = 0;
      y++;
    }

  });

  addPassengerCommand(dataTagObject.Passengers, [
    // Remove previous commandBlocks and their generated components
    'setblock ~ ~-2 ~ command_block 0 0 {Command:\"fill ~ ~2 ~ ~ ~-2 ~ air\",auto:1}',
    'kill @e[type=commandblock_minecart,r=1]'
  ]);

  return `summon falling_block ~ ~2 ~ ` + JSON.stringify(dataTagObject);
}



async function generateAndSaveCreation(fileName=false) {

  if (Global.isOnLoading) return false;

  await setCreationVariables();

  let creationName       = Global.creationVariables.name;
  let creationVersion    = Global.creationVariables.version;
  let creationProgrammer = Global.creationVariables.programmer;
  
  if (!fileName) fileName = creationName;
  let command_importCreation = await getImportCreationCommand();
      command_importCreation = command_importCreation.replaceAll('!(creation_name)',       creationName);
      command_importCreation = command_importCreation.replaceAll('!(creation_version)',    creationVersion);
      command_importCreation = command_importCreation.replaceAll('!(creation_programmer)', creationProgrammer);

  let command_summonContainer = getSummonContainerCommand();
      command_summonContainer = command_summonContainer.replaceAll('!(creation_name)',       creationName);
      command_summonContainer = command_summonContainer.replaceAll('!(creation_version)',    creationVersion);
      command_summonContainer = command_summonContainer.replaceAll('!(creation_programmer)', creationProgrammer);

  // Return error if required commands are false or undefined
  if (!command_importCreation || !command_summonContainer) {
    return console.error(
      `'command_importCreation' and 'command_summonContainer' are required.\n`,
      { command_importCreation, command_summonContainer }
    );
  }

  let css = `
    img {
      width: 125px;
      height: 125px;
      box-sizing: border-box;
      border: 3px solid #783f0f;
    }
    button {
      padding: 5;
      color: white;
      font-weight: bold;
      font-size: 14px;
      text-align: center;
      width: 100%;
      height: 50px;
      min-width: 125px;
      background-color: #06a906;
      border: 3px solid #066e13;
    }
    button:hover {
      border: 3px solid #e3a700;
      background-color: #fdc526;
    }
    .command {
      display: flex;
      padding-top: 20px;
    }
    .block {
      height: 100%;
      width: 125px;
    }
    textarea {
      width: 600px;
      resize: none;
      border-radius: 0;
    }
    code {
      background-color: lightGray;
    }
    span {
      background-color: #88a2af;
      border: 1px solid #30647c;
      border-bottom-width: 2px;
      border-radius: 3px;
      font-weight: bold;
      color: #23333a;
      padding: 0 5px;
    }
    ul > li {
      margin-top: 10px;
    }
  `;

  let script = `
    window.onload = () => {
      [...document.querySelectorAll('button')].map(button => {
        let textarea = button.parentElement.parentElement.querySelector('textarea');
        
        button.addEventListener('click', () => {
            // Select
            textarea.removeAttribute('disabled');
            textarea.select();
            textarea.setAttribute('disabled', true);
            document.execCommand('copy');
            
            // Inform user about selection
            alert(\`Copied: '\${button.innerText.slice(5)}' command.\`);
        });
      });
    }
  `;

  let htmlContent = [`
    <head><style>${css}</style></head>
    <body style="font-family: calibri">
      <h1>${creationName} for Minecraft ${creationVersion}</h1>
      <h2>Made by ${creationProgrammer}</h2>

      <div class="command">
        <div class="block">
          <img src="data:image/png;base64,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"></img>
          <button>Copy Import Commands</button>
        </div>
        <textarea disabled>${command_importCreation}</textarea>
      </div>
      <div class="command">
        <div class="block">
          <img src="data:image/png;base64,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"></img>
        <button>Copy Summon Container</button>
        </div>
        <textarea disabled>${command_summonContainer}</textarea>
      </div>

      <h3>Instructions:</h3>
      <ol>
        <li>Go to creative mode and enter the following command: <code>/give @p minecraft:command_block</code> in the chat box.</li>
        <li>Using the command block, build a two block-high tower with command blocks' arrow pointing upwards.<br>Note that you must use the <u>sneak button</u> <i>(usually it's</i> <span>Shift</span><i> button)</i> to place command block on to another.</i></li>
        <br>
        <li>Copy the <strong>Summon Container</strong> command and insert it into the bottom command block using the following buttons:<br>
          <ul>
            <li>For Windows - <span>Ctrl</span> + <span>V</span>
            <li>For Mac - <span>Command</span> + <span>V</span></li>
          </ul>
        </li>
        <br>
        <li>Copy the <strong>Import Commands</strong> command and insert it into  the top command block.</li>
        <li>Once commands are included in both of the command blocks, open the bottom command block and set it to <strong>Always Active</strong>.</li>
      </ol>
      <script type="text/javascript">${script}</script>
    </body>
  `];

  // Prompt user to save creation as .html file
  let blob = new Blob(htmlContent, { type: 'text/html' });

  let anchor = document.createElement('a');
      anchor.href = URL.createObjectURL(blob);
      anchor.download = fileName + '.html';
      anchor.click();
}



async function saveProject(fileName=false) {

  if (Global.isOnLoading) return false;

  let Code;
  saveCurrentSign();
  setCreationVariables();
  await containerGetCode().then(resolve => Code = resolve);

  // Define 'fileName' as creation name if false
  if (!fileName) fileName = Global.creationVariables.name;

  let projectDataObject = JSON.stringify({ Signs, Code });
  let blob = new Blob([projectDataObject], { type: 'application/json' });

  let anchor = document.createElement('a');
      anchor.href = URL.createObjectURL(blob);
      anchor.download = fileName + '.json';
      anchor.click();
}



function openProject() {

  if (Global.isOnLoading) return false;

  // Source : https://www.w3docs.com/learn-javascript/file-and-filereader.html
  // Access : 05/03/2023
  const readFile = (input) => {
    let file = input.files[0]; 
    let fileReader = new FileReader(); 

    fileReader.readAsText(file); 
    fileReader.onload = () => {
      try {
        // Parse result and import container editor's code, and all signs
        let projectDataObject = JSON.parse(fileReader.result);
        containerSetCode(projectDataObject.Code);
        wysiwygSetSigns(projectDataObject.Signs); 
      }
      // Log error
      catch(err) {
        console.error(err);
      }
    }; 
    // Log error
    fileReader.onerror = () => {
      console.error(fileReader.error);
    }; 
  }

  // Get file from user and readFile()
  let input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.onchange = () => { readFile(input) };
      input.click();
}



function hidePopups() {
  
  if (Global.isOnPopupAnimation) return false;
  Global.isOnPopupAnimation = true;

  let popup = document.querySelector('.popup');
      popup.classList.add('hide');

  setTimeout(() => {
    // Hide popups
    popup.style.display = 'none';
    [...popup.children].map(popup => popup.style.display = 'none');
  }, 1000);

  setTimeout(() => {
    // Enable hidePopups() and showPopup() after animation
    Global.isOnPopupAnimation = false;
  }, 2000);

}


 
function showPopup(popupName) {

  if (Global.isOnPopupAnimation
  ||  Global.isOnLoading) return false;

  Global.isOnPopupAnimation = true;

  // Return error if 'popupToDisplay' is false or undefined
  let popupToDisplay = document.querySelector(`.popup > .${popupName}`);
  if (!popupToDisplay) return console.error(`There is no popup with class '${popupName}'`);

  let popup = document.querySelector('.popup');

  // Don't bother showing already displayed popup
  if (popup.style.display != 'none'
  && !popup.classList.contains('hide')
  &&  popupToDisplay.style.display != 'none'
  && !popupToDisplay.classList.contains('hide'))
  {
    Global.isOnPopupAnimation = false;
    return false;
  }


  popup.classList.add('hide');
  popup.style.removeProperty('display');

  setTimeout(() => {
    // Hide all popups
    [...popup.children].map(popup => popup.style.display = 'none');

    // Enable popup's .submit button
    let buttonSubmit = popupToDisplay.querySelector('.submit');
    if (buttonSubmit) buttonSubmit.removeAttribute('disabled');
    
    // Show popup with fade in animation
    popupToDisplay.style.removeProperty('display');
    popup.style.removeProperty('display');
    popup.classList.remove('hide');

  }, 1000);

  setTimeout(() => {
    // Enable hidePopups() and showPopup() after animation
    Global.isOnPopupAnimation = false;
  }, 2000);

}



function displayEditor(editorName) {

  if (Global.isOnLoading) return false;

  let style = getComputedStyle(document.body);
  let slideDelay = style.getPropertyValue('--slide-animation-delay').slice(0, -2);


  // Validate parameter editorName and slide animation's state
  if (!(['sign','container'].indexOf(editorName) >= 0)
  || Global.isOnSlideAnimation == true) return;

  
  // Pause displayEditor() until slide animation ends
  Global.isOnSlideAnimation = true;

  createInterval('editors-animation-slide', () => {
    Global.isOnSlideAnimation = false;
    removeInterval('editors-animation-slide');
  }, slideDelay * 1000);


  // Hide editors and remove slide classes
  Array.from(document.querySelectorAll('editor-tool')).map(editor => {
    editor.classList.remove('slide-rtc');
    editor.classList.remove('slide-ltc');
    editor.classList.remove('slide-ctr');
    editor.classList.remove('slide-ctl');
    editor.style.setProperty('display', 'none');
  });


  if (editorName === "sign")
  {
    let next_editor = document.querySelector('editor-tool[name="sign"]');
    let prev_editor = document.querySelector('editor-tool[name="container"]');

    next_editor.classList.add('slide-rtc');
    prev_editor.classList.add('slide-ctl');

    next_editor.style.removeProperty('display');
    prev_editor.style.removeProperty('display');
  }
  else if (editorName === "container")
  {
    let next_editor = document.querySelector('editor-tool[name="container"]');
    let prev_editor = document.querySelector('editor-tool[name="sign"]');

    next_editor.classList.add('slide-ltc');
    prev_editor.classList.add('slide-ctr');

    next_editor.style.removeProperty('display');
    prev_editor.style.removeProperty('display');
  }
}



function updateRootVariableWindowWidth() {
  let clientWidth = document.body.clientWidth;
  createStyle('new-window-width', `:root { --window-width: ${clientWidth}px }`);
}



const wysiwygCommandsObserver = new MutationObserver(() => {

  let zoomContainerInput = document.querySelector('.zoomContainer > input[type="number"]');
  let multiplier;

  // Get multiplier
  switch (zoomContainerInput.value)
  {
    case "100": multiplier = 1.000; break;
    case "110": multiplier = .9090; break;
    case "120": multiplier = .8330; break;
    case "130": multiplier = .7690; break;
    case "140": multiplier = .7140; break;
    case "150": multiplier = .6665; break;
    case "160": multiplier = .6250; break;
    case "170": multiplier = .5880; break;
    case "180": multiplier = .5555; break;
    case "190": multiplier = .5265; break;
    case "200": multiplier = .5000; break;
    default:
      console.error(`Cannot apply style property '--multiplier' for #command's textarea!`);
  }

  // Apply multiplier
  if (multiplier) {
    let textara = document.querySelector('#commands textarea');
        textara.style.setProperty('--multiplier', multiplier);
  }

});



window.onload = async () => {

  // Stop onload scripts if Intervals object, from library './js/lib/intervals.js', is not defined. 
  try {
    Intervals;
  }
  catch (error) {
    return console.error(error.name + " Library 'Intervals' v0.1.0 (by McRaZick) is required!");
  }

  makeWysiwygFuncitonal(); /* wysiwyg.js onLoad */
  makeContainerFunctional(); /* container.js onLoad */



  // :: Update commands's textarea's style property "--multiplier" 

  wysiwygCommandsObserver.observe(document.querySelector('#commands'), {
    attributes: true,
    attributeFilter: ["style"]
  });



  // :: Update CSS's root variable "--window-width" on window resize event

  updateRootVariableWindowWidth();
  window.addEventListener('resize', updateRootVariableWindowWidth);
  


  // :: Update CSS's root variable "--slide-animation-delay"
  // and predefine <editor's> slide styles as "sign" <editor> is displayed

  let style = getComputedStyle(document.body);
  let slideDelay = style.getPropertyValue('--slide-animation-delay');

  createStyle('new-slide-animation-delay', `:root { --slide-animation-delay: 0s }`);
  displayEditor('sign');

  setTimeout(() => {
    createStyle('new-slide-animation-delay', `:root { --slide-animation-delay: ${slideDelay} }`);
  }, 1000);



  // :: Animate button "obfuscate"

  let btn_obfuscate = document.querySelector('#wysiwyg .wysiwyg-options.text-format button[title="obfuscate"]');
  if (btn_obfuscate) {

    let i = 0;
    let patterns = [
      "obfuscate",
      "odFuscAt€",
      "oBfn$CAte",
      "oB_!sC&!E"
    ];

    createInterval('wysiwyg_animateButtonObfuscate', () => {
      i++; if (i == patterns.length) { i = 0 };
      btn_obfuscate.innerText = patterns[i];
    }, 200);
  }

  

  // :: (functionality) Hide popups onClick button.exit

  [...document.querySelectorAll('button.exit')].map(btn => {
    btn.addEventListener('click', hidePopups);
  });



  // :: (functionality) set .container popup's .submit button onClick eventListener -> to generate and save creation
  
  let popup_container_btnSubmit = document.querySelector('.popup > .container button.submit');
  popup_container_btnSubmit.addEventListener('click', (e) =>
  {
    if (Global.isOnPopupAnimation) return false;
    
    generateAndSaveCreation();
    e.target.setAttribute('disabled', true);
    hidePopups();
  });


  // :: (functionality) Show active display button in #wysiwyg .display

  let display_btns = document.querySelectorAll('#wysiwyg .display button');
  [...display_btns].map((btn, index) => {
    btn.addEventListener('click', () => {

      [...display_btns].map(b => {
        b.removeAttribute('data-active');
      });

      btn.setAttribute('data-active', '');

    });

    if (btn.hasAttribute('data-active')) {
      displayCommand(index + 1, false, 1);
      displaySign(index + 1, false);
    }
  });



  // :: (functionality) Show active command and button in #commands

  let textarea      = document.querySelector('#commands > textarea');
  let commands_btns = document.querySelectorAll('#commands .menu > button');

  [...commands_btns].map(btn => {
    btn.addEventListener('click', () => {

      [...commands_btns].map(b => {
        b.removeAttribute('disabled');
      });
      btn.setAttribute('disabled','');

      textarea.removeAttribute('data-display');
      textarea.scrollTo(0,0);

      setTimeout(() => {
        textarea.setAttribute('data-display', '');
      }, 10);

    });
  });



  // Start of .zoomContainer -------------------------------------------------------

  // Scale specified DOM elements

  createInterval('zoomContainer', () =>
  {
    let input = document.querySelector('.zoomContainer > input');
    let value = Number(input.value);
    let percentage = value.toFixed(2) + '%';

    document.querySelector('#wysiwyg').style.zoom = percentage;
    document.querySelector('#commands').style.zoom = percentage;
    document.querySelector('editor-tool[name="container"]').style.zoom = percentage;
  }, 100);



  let zoomContainerInputs = document.querySelectorAll('.zoomContainer > input');

  // :: (functionality) Store previous valid-in-range number in input's attribute "data-previousValue"

  [...zoomContainerInputs].map(input => {
    
    function updatePrevValAttr()
    {
      let maxRange = input.max;
      let minRange = input.min;
      let value    = Number(input.value);

      // Validate value's data type and range
      if (!(isRealNumber(value))
      || value > maxRange
      || value < minRange) return;

      input.setAttribute('data-previousValue', input.value);
    }

    input.addEventListener('focus', () => updatePrevValAttr());
    input.addEventListener('keypress', (e) => {
      // 13 = Enter key
      if (e.which == 13) updatePrevValAttr();
    });
  });



  // :: (functionality) .zoomContainer's range validation on input's change event

  [...zoomContainerInputs].map(input => {
    input.addEventListener('change', () => {

      let maxRange = input.max;
      let minRange = input.min;

      let value    = Number(input.value);
      let prevVal  = Number(input.dataset.previousvalue);
          prevVal  = isRealNumber(prevVal) ? prevVal : 100;

      if (value > maxRange || value < minRange) {
        input.value = prevVal;
      }
      else {
        // Replace possible floating-points
        input.value = value;
      }
    });
  });



  // :: (functionality) Increment / Decrement input's value using buttons

  [...zoomContainerInputs].map(input =>
  {
    let parent  = input.parentElement;
    let buttons = parent.querySelectorAll('button');

    // Set onclick event for .zoomContainer's buttons
    if (buttons.length > 1)
    {
      buttons[0].addEventListener('click', () => updateValue('decrement'));
      buttons[1].addEventListener('click', () => updateValue('increment'));
    }

    function updateValue(mode)
    {
      // Validate mode parameter
      if (!(['increment','decrement'].includes(mode))) {
        return console.error(`Illegal parameter! mode: ${mode}`);
      };

      let value    = Number(input.value);
      let maxRange = input.max;
      let minRange = input.min;

      // Validate value's data type
      if (!(isRealNumber(value))) return;
      
      // Increment/Decrement value
      (mode == 'increment') ? value+=10 : value-=10;

      // Validate value's range
      if (value > maxRange || value < minRange) return;

      // Update input's value
      input.value = value;
    }
  });

  // End of .zoomContainer ---------------------------------------------------------



  // Hide loading and #cover
  let loadingScreen = document.querySelector('.loadingScreen');
  let cover = document.getElementById('cover');

  await sleep(3000);
  cover.classList.add('hide');
  loadingScreen.classList.add('hide');
  await sleep(1000);
  cover.style.display = 'none';
  loadingScreen.style.display = 'none';

  Global.isOnLoading = false;

  // Show popup .info
  await sleep(500);

  Global.isOnPopupAnimation = false;
  showPopup('info');
}