const Signs = {
  1 : {
    display: [
      "[Cmd1.12.X]",
      "creation_name",
      "by",
      "programmer"
    ],
    command: [
      "/particle largeexplode ~ ~1 ~8 1.2 2.0 1.2 3 9",
      "/playsound minecraft:entity.generic.explode player @a ~ ~ ~",
      "/tellraw @a {\"text\":\"!(creation_name) has been destroyed!\",\"color\":\"gold\"}",
      "/fill ~1 ~-5 ~ ~-2 ~3 ~16 air"
    ]
  },
  2 : {
    display:[
      "[Instruction]",
      "Right-click",
      "this sign",
      "to get help"
    ],
    command: [
      "/particle instantSpell ~ ~ ~ 0.2 0.2 0.2 9 9",
      "/playsound minecraft:entity.player.levelup player @a ~ ~ ~",
      "/tellraw @a {\"text\":\"Instruction...\",\"color\":\"aqua\"}",
      '/give @p written_book 1 0 {pages:["[\\"\\",{\\"text\\":\\"MyAuto\\",\\"bold\\":true,\\"color\\":\\"gold\\"},{\\"text\\":\\"14CC\\",\\"bold\\":true,\\"color\\":\\"blue\\"},{\\"text\\":\\"\\\\n\\",\\"color\\":\\"reset\\"},{\\"text\\":\\"Guide Book\\",\\"bold\\":true,\\"color\\":\\"black\\"},{\\"text\\":\\"\\\\n\\\\n\\",\\"color\\":\\"reset\\"},{\\"text\\":\\"Resources:\\",\\"bold\\":true},{\\"text\\":\\"\\\\n\\\\n* \\",\\"color\\":\\"reset\\"},{\\"text\\":\\"1x \\\\\\"MyAuto: Car\\\\\\"\\",\\"color\\":\\"blue\\",\\"clickEvent\\":{\\"action\\":\\"run_command\\",\\"value\\":\\"/give @p spawn_egg 1 0 {HideFlags:33,display:{Name:\\\\\\"MyAuto: Car\\\\\\"},ench:[{id:35,lvl:0}],EntityTag:{id:\\\\\\"squid\\\\\\",CustomName:\\\\\\"MyAuto14CCeS0\\\\\\",NoGravity:1b,DeathLootTable:\\\\\\"empty\\\\\\",NoAI:1,Silent:1,ActiveEffects:[{Id:14,Amplifier:0,Duration:2147483647}]}}\\"}}]","[\\"\\",{\\"text\\":\\"How to get the car?\\",\\"bold\\":true},{\\"text\\":\\"\\\\n\\\\n1. Press the left mouse button on the \\\\\\"MyAuto: Car\\\\\\" \\",\\"color\\":\\"reset\\"},{\\"text\\":\\"resource\\",\\"underlined\\":true},{\\"text\\":\\" to get a car spawn egg.\\\\n\\\\n2. Summon your car using the \\\\\\"MyAuto: Car\\\\\\" spawn egg.\\",\\"color\\":\\"reset\\"}]","[\\"\\",{\\"text\\":\\"How to use the car?\\",\\"bold\\":true},{\\"text\\":\\"\\\\n\\\\n1. Sit in the car using the right mouse button.\\\\n\\\\n2. To exit the car, press the left shift button.\\\\n\\\\n3. While sitting in the car, select \\\\\\"slot 0\\\\\\" or press number 1 on your keyboard to start driving.\\",\\"color\\":\\"reset\\"}]","{\\"text\\":\\"4. Look horizontally at the desired destination as you drive.\\"}","[\\"\\",{\\"text\\":\\"How to remove the command creation?\\",\\"bold\\":true},{\\"text\\":\\"\\\\n\\\\nOnce decided to remove the command creation, press the top left sign using the right mouse button.\\",\\"color\\":\\"reset\\"}]"],title:"MyAuto14CC Guide Book",author:McRaZick}'
    ]
  },
  3 : {
    display:[
      "<font color=\"#0000b2\">[Activate]</font>",
      "Right-click",
      "this sign to",
      "activate"
    ],
    command: [
      "/tellraw @a {\"text\":\"!(creation_name) has been activated!\",\"color\":\"gold\"}",
      "/playsound block.piston.contract block @a ~ ~ ~ 10 1",
      "/setblock ~ ~-2 ~2 repeating_command_block 3 replace {auto: 1b,TrackOutput: 0}",
      "/fill ~1 ~4 ~1 ~-2 ~-2 ~17 stained_glass 3 replace stained_glass"
    ]
  },
  4 : {
    display: [
      "<font color=\"#a90400\">[Deactivate]</font>",
      "Right-click",
      "this sign to",
      "deactivate"
    ],
    command: [
      "/tellraw @a {\"text\":\"!(creation_name) has been deactivated!\",\"color\":\"gold\"}",
      "/playsound block.piston.extend block @a ~ ~ ~ 10 1",
      "/setblock ~1 ~-2 ~2 command_block 3",
      "/fill ~2 ~4 ~1 ~-1 ~-2 ~17 stained_glass 7 replace stained_glass"
    ]
  } 
}

let CurrentSign = 1;
let CurrentCommand = 1;



function wysiwygSetSigns(newSigns) {

  for (let [key] of Object.entries(newSigns)) {
    try {
      // Validate 'newSigns' object's command and display key's length
      if (!(newSigns[key].command.length == 4)) {
        throw `'newSigns.command' has invalid length. (4 instances expected)\n ${newSigns.command}`;
      }
      if (!(newSigns[key].display.length == 4)) {
        throw `'newSigns.display' has invalid length. (4 instances expected)\n ${newSigns.display}`;
      }

      // Try to initialize 'newSigns' respectively to 'Signs'
      Signs[key].command = newSigns[key].command;
      Signs[key].display = newSigns[key].display;
    }
    catch (err) {
      return console.error(err);
    }
  }

  displayCommand(CurrentSign, false, CurrentCommand);
  displaySign(CurrentSign, false);
  return true;
}



function saveCurrentSign() {

  let sign        = document.querySelector('#wysiwyg .sign');
  let sign_inputs = document.querySelectorAll('#wysiwyg .sign > div');
  let textarea    = document.querySelector('#commands > textarea');

  // Save current sign display
  [...sign_inputs].map((input, index) => {
    Signs[CurrentSign].display[index] = input.innerHTML;
  });

  // Save current command
  Signs[CurrentSign].command[CurrentCommand - 1] = textarea.value;
  
}



function displayCommand(sign_instance = CurrentSign, saveCurrentCommand = true, command_instance = 1) {
  // sign_instance :: Inteter 1-4 
  // command_instance :: Integer 1-4
  // saveCurrentCommand :: Boolean

  // Validate parameters for number type and range
  if (isNaN(sign_instance)
  || isNaN(command_instance)
  || isNaN(saveCurrentCommand)
  || command_instance > 4 || sign_instance > 4 
  || command_instance < 1 || sign_instance < 1)
  return false;

  let textarea = document.querySelector('#commands > textarea');

  if (saveCurrentCommand) {
    Signs[sign_instance].command[CurrentCommand - 1] = textarea.value;
  }

  // Display command
  textarea.value = Signs[sign_instance].command[command_instance - 1];


  CurrentCommand = command_instance;
}



function displaySign(sign_instance = 1, saveCurrentSign = true, ...arrow) {
  // sign_instance :: Inteter 1-4 
  // saveCurrentSign :: Boolean
  // arrow :: String - 'left' | 'right'

  // Validate parameters for number type and range
  if (isNaN(sign_instance)
  || isNaN(saveCurrentSign)
  || CurrentSign > 4
  || CurrentSign < 1)
  return false;


  // If parameter arrow contains 'left' or 'right' (non-case-sensitive) 
  // Increment / Decrement parameter sign_instance.
  if (arrow && /^(right|left)/i.test(arrow))
  {
    if (arrow[0][0].toLowerCase() === "r") {
      ++sign_instance;
      if (sign_instance > 4) sign_instance = 1; 
    }
    else {
      --sign_instance;
      if (sign_instance < 1) sign_instance = 4;
    }
  }


  // Save previously selected sign's active-command,
  // before switching with currently selected sign.
  displayCommand(CurrentSign, true, CurrentCommand);
  displayCommand(sign_instance, false, CurrentCommand);


  // Display sign
  let sign        = document.querySelector('#wysiwyg .sign');
  let sign_inputs = document.querySelectorAll('#wysiwyg .sign > div');

  Array.from(sign_inputs).map((input, index) => {
    if (saveCurrentSign) {
      Signs[CurrentSign].display[index] = input.innerHTML;
    }
    input.innerHTML = Signs[sign_instance].display[index];
  });


  // Display active-sign button (.display's button)
  let display_btns = document.querySelectorAll('#wysiwyg .display button');

  Array.from(display_btns).map(btn => {
    btn.removeAttribute('data-active');
  });

  display_btns[sign_instance - 1].setAttribute('data-active', '');


  CurrentSign = sign_instance;
}



// Plagirised and modified function from 2017-18?
function obfuscateText(text)
{
  let new_text = '';
  const alphabet = [
    /* 0 px */ "",
    /* 1 px */ "i,;.:!|î",
    /* 2 px */ "l'`Ììí·´",
    /* 3 px */ "It[]ÍÎÏïªº•°",
    /* 4 px */ "kf(){}*¤²”\"", //§
    /* 5 px */ "ABCDEFGHJKLMNOPQRSTUVWXYZabcdeghjmnopqrsuvwxyz" +
               "/?$%&+-#_¯=^¨£ÀÁÂÃÄÅÇÈÉÊËÑÒÓÔÕÖÙÚÛÜÝ" +
               "àáâãäåçèéêëñðòóôõöùúûüýÿ0123456789Ææß×¼½¿¬«»",
    /* 6 px */ "~@®÷±",
    /* 7 px */ "µµµµµ", // dupliqué pour éviter une boucle infinit dans la recheche d'un nouveau caractère
  ];


  for (let i = 0; i < text.length; i++)
  {
    let new_char = text[i];
    let len = -1, pos = -1;

    //find char lenght & pos
    for (let j = 1; j < alphabet.length; j++)
    {
      for (let k = 0; k < alphabet[j].length; k++) {
        if (alphabet[j][k] == new_char)
        {
          len = j;
          pos = k;
          break;
        }
      }

      if (len >= 0) break;
    }

    if (len >= 0) { let new_pos;

      do { new_pos = Math.floor(Math.random() * alphabet[len].length); }
      while (new_pos == pos);

      new_text += alphabet[len][new_pos];

    } else new_text += new_char; // si oon ne trouve pas de subsitue
  }


  return new_text;
}



function setObfuscatedAnchorColor() {

  for (node of ['A', 'FONT'])
  {
    Array.from(document.querySelectorAll(`#wysiwyg .sign ${node.toLowerCase()}`))
    .map(parent =>
    {
      if (parent.children.length > 0) {
        for (let i = 0; i < parent.children.length; i++)
        {
          let child = parent.children[i];

          if (child.nodeName === 'A') {
            child.style.setProperty('--text-color', parent.color);
          }
          else if (child.nodeName === 'FONT') {
            parent.style.setProperty('--text-color', child.color);
          }
        }
      }
    });
  }
}



function hexaToMinecraftColorName(string) {

  // Stripe 'color-' from 'string'
  if (string.includes('color-')) {
    string = string.substring(6);
  }

  // Return Minecraft color
  switch (string.toUpperCase()) {
    case "#787878": return "gray"
    case "#000000": return "black"
    case "#780000": return "dark_red"
    case "#000078": return "dark_blue"
    case "#780078": return "dark_purple"
    case "#007878": return "dark_aqua"
    case "#B77800": return "gold"
    case "#007800": return "dark_green"
    case "#B7B7B7": return "white"
    case "#3E3E3E": return "dark_gray"
    case "#B73E3E": return "red"
    case "#3E3EB7": return "blue"
    case "#B73EB7": return "light_purple"
    case "#3EB7B7": return "aqua"
    case "#B7B73E": return "yellow"
    case "#3EB73E": return "green"
    default:
      return console.error(`Parameter string: '${string}' is not a valid minecaft color.`);
  }
}



function constructTextNObject(inputData) {
  let formats;
  let inputText;
  let TextN = '';

  for (let i = 0; i < inputData.length; i++)
  {
    inputText = inputData[i].text;
    inputText = JSON.stringify(inputText);
    formats   = inputData[i].format;

    // Replace format 'color-#HEXA' to Minecraft color (as name)
    // E.g. 'color-#fd5650' -> 'red'
    formats = formats.map(format => (format.includes('color-'))
    ? `"color":"${hexaToMinecraftColorName(format)}"`
    : `"${format}":true`);

    formats = formats.join(',');
    (formats.length > 0)
    ? TextN += `,{"text":${inputText},${formats}}`
    : TextN += `,{"text":${inputText}}`;
  }

  // If there are many textKeys
  // Wrap input's 'text' keys to list: ["", ...textKeys]
  // otherwise remove first comma
  (inputData.length > 1)
  ? TextN = '[""' + TextN + ']'
  : TextN = TextN.slice(1);

  // Return empty string or 'TextN' object
  return (TextN.length)
  ? JSON.parse(TextN)
  : "";
}



function getSignDataTagObject(sign_instance) {

  let signData = getSignData(sign_instance);
  let display  = [];
  let commands = [];

  display  = signData.display;
  commands = signData.command;

  // Validate 'display' and 'commands' list's length
  if (!(display.length > 0 && display.length <= 4)
  && !(commands.length > 0 && commands.length <= 4)) return false;

  // Store sign's commands in minecraft's 'clickEvent' object
  let clickEvents = commands.map(command => {

    command = trimExternalSpacing(command);
    // Remove last "/" from first position
    command = (command[0] === "/") ? command.slice(1) : command;
    // Disclude command if empty
    if (command.length === 0) return;

    return {
      action: 'run_command',
      value: command
    }
  });


  let dataTagObj = {};

  // Create 'TextN' object and include it in 'dataTagObj'
  display.map((inputData, index) => {
    let TextN = constructTextNObject(inputData);

    // Disclude 'TextN' if it's empty
    if (!TextN || TextN.hasOwnProperty('text')
    &&  !TextN.text.replace(/\s/g, '').length) return;

    dataTagObj['Text' + (index + 1)] = TextN;
  });


  // Include clickEvents to 'dataTagObj'
  clickEvents.map((clickEvent, index) => {
    if (clickEvent === undefined) return;
    
    let txtIndex = 'Text' + (index + 1);
    let TextN = dataTagObj[txtIndex];

    // Return new 'TextN' with empty 'text' key
    // to include 'clickEvent' key 
    if (!TextN)
    return dataTagObj[txtIndex] = {
      clickEvent, text: ""
    };

    // If 'TextN' has text format(s), replace first array instance
    // as object with 'clickEvent' and empty 'text' key  
    if (dataTagObj[txtIndex].length > 1)
    return dataTagObj[txtIndex][0] = {
      text: "", clickEvent
    }

    // Include 'clickEvent' in 'TextN'
    return dataTagObj[txtIndex].clickEvent = clickEvent;
  });

  
  return dataTagObj;
}



function getSignDataTag(sign_instance) {

  let dataTagObj = getSignDataTagObject(sign_instance);
  let dataTag = '';

  for (const [key, value] of Object.entries(dataTagObj)) {
    dataTag += `,${key}:`;
    dataTag += JSON.stringify(JSON.stringify(value));
  }

  // Remove zero-width-space, and a comma from the starting position
  dataTag = dataTag.replace(/[\u200B-\u200D\uFEFF]/g, '');
  return `{${dataTag.slice(1)}}`;
}



function parseHtml(htmlString) {

  const textContent = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  
  const traverse = (node, format) => {
    if (node.nodeType === Node.TEXT_NODE) {
      textContent.push({ format, text: node.textContent });
    }
    else if (node.nodeType === Node.ELEMENT_NODE)
    {
      const newFormat = getNewFormat(format, node);
      for (let child of node.childNodes) {
        traverse(child, newFormat);
      }
    }
  };

  const getNewFormat = (format, node) => {
    const tag = node.tagName;
    const newFormat = format.slice();

    if (tag === 'STRIKE') newFormat.push('strikethrough');
    else if (tag === 'I') newFormat.push('italic');
    else if (tag === 'U') newFormat.push('underlined');
    else if (tag === 'B') newFormat.push('bold');
    else if (tag === 'A') newFormat.push('obfuscated');
    else if (tag === 'FONT')
    {
      const color = node.getAttribute('color');
      if (color) newFormat.push(`color-${color}`);
    }
    return newFormat;
  };
  
  traverse(doc.body, []);
  return textContent;
}

/* getNewFormat() and parseHtml() function's are desigen by Chat-GPT with McRaZick's collab. 20/02/2023

---- Chat-GPT:

Let's walk through the logic of this function. We start by defining an empty textContent array to store the text content with formatting information.
We then create a new DOMParser object and use it to parse the HTML string into a Document object.

Next, we define a traverse function that takes a node and a format array as inputs.
If the node is a text node, we push an object containing the text content and the formatting information to the textContent array.
If the node is an element node, we get the new format array by calling the getNewFormat function with the current format array and the node.
We then recursively traverse the child nodes of the current node, passing the new format array as the format argument.

The getNewFormat function takes the current format array and the current node as inputs.
If the current node is a strikethrough, italic, underline, bold, anchor, or font element, we add the corresponding formatting string to the format array.
We then return the new format array.

With this implementation, we should be able to parse an HTML string and extract the text content along with formatting information.

I broke the problem down into smaller subproblems and tackled them one by one. Here's an overview of the steps I took:

+ Create an empty textContent array to hold the final result.
+ Create an empty formatStack array to hold the current formatting state.
+ Write a processNode function that takes a single node and adds its text and formatting to textContent.
+ Write a processChildren function that takes a parent node and recursively processes its children.
+ Call processChildren on the root node of the DOM tree (i.e. the document.body node).

In processNode, I used a loop to iterate over the elements of the formatStack array and concatenate them into a single string.
This string represents the current formatting state, which is added to the textContent array along with the node's text.

In processChildren, I used a for loop to iterate over the child nodes of the parent node.
If a child node is a text node, it is passed to processNode. If it is an element node, its tag name is used to determine the formatting to apply.
If the element has children, processChildren is called recursively on the element.

The key insight that led to the solution was to use a stack to keep track of the current formatting state.
By pushing and popping format strings onto and off of the stack as we traverse the tree,
we can maintain the correct formatting state at any point in the traversal.

*/



function getSignData(sign_instance=false) {
  // sign_instance :: Intager 1-4
  
  let errorMessage = `parameter 'sign_instance' must be an integer 1 - 4 (to corresponding sign)`;
 
  // Return error if 'sign_instance' is a boolean
  if (typeof sign_instance === 'boolean') return console.error(errorMessage);
  sign_instance = Number(sign_instance);

  // Return error if 'sign_instance' is not a number
  if (isNaN(sign_instance)) return console.error(errorMessage);
  sign_instance = ~~sign_instance; // Convert float to integer

  // Return error if 'sign_instance' is in invalid range
  if (!(sign_instance > 0 && sign_instance < 5)) return console.error(errorMessage);

  saveCurrentSign();

  let signData = {
    command: Signs[sign_instance].command,
    display: []
  };

  // #wysiwyg > container > .sign > .input <-- InputHTML
  Signs[sign_instance].display.map((inputsHTML) => {
    signData.display.push(parseHtml(inputsHTML));
  });

  return signData;
}



async function correctWysiwygFormat() {

  let signData = getSignData(CurrentSign);
  if (!signData) return console.error(`Failed to get 'signData'`);

  let input = document.createElement('div');

  const formatInput = (textObj) => {

    let formatList = textObj.format;
    if (!formatList) return textObj.text;

    let closingTags = [];
    let innerHTML = '';

    let includesObfuscate = false;
    let includesFont = false;
    let color;

    formatList.map(format =>
    {
      if (format === 'bold') {
        innerHTML += "<b>";
        closingTags.push("</b>");
      }
      if (format === 'italic') {
        innerHTML += "<i>";
        closingTags.push("</i>");
      }
      if (format === 'underlined') {
        innerHTML += "<u>";
        closingTags.push("</u>");
      }
      if (format === 'strikethrough') {
        innerHTML += "<strike>";
        closingTags.push("</strike>");
      }
      if (format.includes('color')) {
        includesFont = true;
        color = format.substring(6);
      }
      if (format === 'obfuscated') {
        includesObfuscate = true;
      }
    });

    if (includesObfuscate) {
      // Include font format before last
      if (includesFont) {
        innerHTML += `<font color="${color}">`;
        closingTags.push("</font>");
      }
      // Include obfuscated format last
      if (includesObfuscate) {
        innerHTML += '<a href="#">';
        closingTags.push("</a>");
      }
    }
    else {
      // Include font format first
      if (includesFont) {
        innerHTML = `<font color="${color}">` + innerHTML;
        closingTags = ['</font>'].concat(closingTags);
      }
    }

    // Include text, and close all formats
    innerHTML += textObj.text;
    closingTags.reverse().map(closingTag => innerHTML += closingTag);

    // format 'input'
    input.innerHTML += innerHTML;
  }

  for (let i = 0; i < signData.display.length; i++) {
    let display = signData.display[i];

    for (let j = 0; j < display.length; j++) {
      let textObj = display[j];
      formatInput(textObj);
    }
    // Update wysiwyg's '.input'
    document.querySelectorAll('#wysiwyg .sign .input')[i].innerHTML = input.innerHTML;
    setObfuscatedAnchorColor();
    input.innerHTML = "";
  }

}



function makeWysiwygFuncitonal() {


  createInterval('wysiwyg_obfuscateWysiwygsAnchors', () =>
  {
    let anchors = document.querySelectorAll('#wysiwyg .sign a');
    let txt = '';

    Array.from(anchors).map(node => {
      txt = `"${obfuscateText(node.textContent).replace('"', '\\"')}"`;
      node.style.setProperty('--text-content', txt);
    });
  }, 20);


  createInterval('wysiwyg_correctWysiwygFormat', async () =>
  {
    // Correct wysiwyg text decorations if anchor has a childElement
    let anchors = document.querySelectorAll('#wysiwyg .sign a');
    
    for (let i = 0; i < anchors.length; i++) {
      let node = anchors[i];

      if (node.childElementCount > 0) {
        await correctWysiwygFormat();
        break;
      }
    }
  }, 500);


  // :: wysiwyg-text-format button's functionality

  let text_btns = document.querySelectorAll('#wysiwyg .wysiwyg-options.text-format > button');
  Array.from(text_btns).map(btn => {
    if ([
      'bold',
      'italic',
      'underline',
      'strikethrough'
    ].indexOf(btn.title) >= 0)
    {
      btn.addEventListener('click', () => {
        document.execCommand(btn.title, false, null);
        correctWysiwygFormat();
      });
    }
    else {
      // Obfuscate selection. (Anchor tags in #wysiwyg .sign, are animated)
      btn.addEventListener('click', () =>
      {
        let selection = window.getSelection();
        let anchors   = document.querySelectorAll('#wysiwyg .sign a');

        // Remove anchor tags from selection and return.
        for (let i = 0; i < anchors.length; i++)
        {
          let anchor_node = anchors[i];
          if (selection.containsNode(anchor_node)
          ||  selection.anchorNode.parentNode === anchor_node) {
            document.execCommand('unLink', false, '#');
            correctWysiwygFormat();
            return;
          }
        }
        
        // Close selection with an anchor tag and update obfuscated text color.
        document.execCommand('createLink', false, '#');
        correctWysiwygFormat(); 
      });
    }
  });



  // :: wysiwyg-text-color button's functionality

  let color_btns = document.querySelectorAll('#wysiwyg .wysiwyg-options.text-color > button');

  Array.from(color_btns).map(btn => {
    btn.addEventListener('click', () =>
    {
      let color = btn.style.getPropertyValue('--bg-color');
      document.execCommand('foreColor', false, color);
      
      correctWysiwygFormat();

      // Update slection's color real time
      createStyle('update-selection-color', `
        ::selection { color: ${color} }
      `);
    });
  });



  // :: Initialise selection's original color

  document.addEventListener('selectstart', () =>
  {
    let color = getComputedStyle(document.body).getPropertyValue('--selection-color');
    createStyle('update-selection-color', `
      ::selection { color: ${color} }
    `);
  });



  // :: Allow user to jump to next/previous .sign's .input, and ---------------------------------------
  // :: Remove input's overflowing contents. ----------------------------------------------------------
  
  // Source: https://stackoverflow.com/questions/10778291/move-the-cursor-position-with-javascript#answer-10782169
  // Accessed: 01/12/2022 at 6:22 am
  const moveCaretTo = (charCount) => {

    let selection = window.getSelection();
    let textNode  = selection.focusNode;

    if (selection.rangeCount > 0) {
      selection.collapse(textNode, Math.min(textNode.length, charCount));
    } 
  }
  const moveCaretToEnd = (node) => {
    // Set input's cursor to last position.
    let selection = window.getSelection();
    let range = document.createRange();

    if (node.innerHTML.length > 0)
    {
      range.setStart(node, 1);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  let inputs = document.querySelectorAll('#wysiwyg .sign .input'); 

  for (let i = 0; i < inputs.length; i++)
  {
    let input = inputs[i];
    let prevInput = (i == 0) ? inputs[inputs.length - 1] : inputs[i - 1];  
    let nextInput = (i < inputs.length - 1) ? inputs[i + 1] : inputs[0];

    // Move text-cursor/caret to NEXT .input,
    // and set it to .input's last position.
    input.addEventListener('keypress', (event) => {

      if (event.charCode == 13 /* Enter key */)
      {
        event.preventDefault();

        if (i < inputs.length - 1) {
          nextInput.focus();
          setTimeout(() => {
            removeLineBreaks(nextInput);
            moveCaretToEnd(nextInput);
          }, 0);
        }
        else {
          let caretPos = window.getSelection().focusOffset;

          setTimeout(() => {
            if (/(<div><br><\/div>|<br>)/gm
            .test(input.innerHTML)) {
              removeLineBreaks(input);
            }
            moveCaretTo(caretPos);
          }, 0);
        }
      }      
    });
    input.addEventListener('keydown', (event) => {
      if (event.key == 'ArrowDown')
      {
        nextInput.focus();
        setTimeout(() => {
          removeLineBreaks(nextInput);
          moveCaretToEnd(nextInput);
        }, 0);
      }
    });


    // Move text-cursor/caret to PREVIOUS .input,
    // and set it to .input's last position.
    if (i > 0) {
      input.addEventListener('keydown', (event) => {
        if (event.key == "Backspace"
        && input.innerText.length <= 0)
        {
          prevInput.focus();
          setTimeout(() => {
            removeLineBreaks(prevInput);
            moveCaretToEnd(prevInput);
          }, 0);
        }
      });
    }
    input.addEventListener('keydown', (event) => {
      if (event.key == 'ArrowUp')
      {
        prevInput.focus();
        setTimeout(() => {
          removeLineBreaks(prevInput);
          moveCaretToEnd(prevInput);
        }, 0);
      }
    });


    // Remove overflow and unwanted content(s).
    input.addEventListener('input', (event) =>
    {
      const caretPos = window.getSelection().focusOffset;

      // Remove div elements from input
      [...event.target.children].map(node => { 
        if (node.nodeName === 'DIV') {
          console.error('<DIV> elements are forbidden in input!', {
            input: event.target,
            previousContent: event.target.innerHTML
          });
          node.remove();
        }
      });

      // Stripe overflowing content(s)
      while (/(<div><br><\/div>|<br>)/gm.test(input.innerHTML)) {
        removeLineBreaks(input);
      }
      setTimeout(() => {
        while (input.scrollHeight >= 50 || input.scrollWidth > input.offsetWidth)
        {
          del_lastChar_from_lastNode(input);
        }
      }, 0);
      
      // Remove <span> tags. (They are generated from deleted obfuscated anchor tags).
      Array.from(document.querySelectorAll('#wysiwyg .sign span')).map(span => {
        span.removeAttribute('style');
        span.outerHTML = span.outerHTML.substring(6, span.outerHTML.length - 7);
      });

      moveCaretTo(caretPos);
    });
  }

  // END  -------------------------------------------------------------------------------------------
}