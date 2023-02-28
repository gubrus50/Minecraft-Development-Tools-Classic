/* ------ START LIBRARIES ------ */

// Source: https://stackoverflow.com/questions/1064089/inserting-a-text-where-cursor-is-using-javascript-jquery#answer-36297528
// Access: 04/02/2023 & modified

async function addTextAtCaret(textAreaID, text) {
  let textArea = document.getElementById(textAreaID);
  let cursorPosition = textArea.selectionStart;
  await addTextAtCursorPosition(textArea, cursorPosition, text);
  await updateCursorPosition(cursorPosition, text, textAreaID);
}

async function addTextAtCursorPosition(textArea, cursorPosition, text) {
  let front = (textArea.value).substring(0, cursorPosition);
  let back  = (textArea.value).substring(cursorPosition, textArea.value.length);
  let newValue = front + text + back;
  await containerSetCode([newValue]);
}

async function updateCursorPosition(cursorPosition, text, textAreaID) {
  let textArea = document.getElementById(textAreaID);
  let cPos = cursorPosition + text.length;
  textArea.selectionStart = cPos;
  textArea.selectionEnd = cPos;
  textArea.focus();
}

/* ------ END LIBRARIES ------ */



/* PrismJS - Minecraft Commands 1.12.X */
// https://minecraftbedrock-archive.fandom.com/wiki/Commands/List_of_Commands
if (Prism) {
  Prism.languages['minecraft-v1-12-x'] = {
    'commandblock': />>>\//,
    'command': [
      /(\b(?:ability)\b)/gm,
      /(\b(?:alwaysday)\b)/gm,
      /(\b(?:blockdata)\b)/gm,
      /(\b(?:clear)\b)/gm,
      /(\b(?:clone)\b)/gm,
      /(\b(?:connect)\b)/gm,
      /(\b(?:deop)\b)/gm,
      /(\b(?:difficulty)\b)/gm,
      /(\b(?:effect)\b)/gm,
      /(\b(?:enchant)\b)/gm,
      /(\b(?:execute)\b)/gm,
      /(\b(?:fill)\b)/gm,
      /(\b(?:function)\b)/gm,
      /(\b(?:gamemode)\b)/gm,
      /(\b(?:gamerule)\b)/gm,
      /(\b(?:give)\b)/gm,
      /(\b(?:help)\b)/gm,
      /(\b(?:immutableworld)\b)/gm,
      /(\b(?:kill)\b)/gm,
      /(\b(?:list)\b)/gm,
      /(\b(?:locate)\b)/gm,
      /(\b(?:me)\b)/gm,
      /(\b(?:mixer)\b)/gm,
      /(\b(?:mobevent)\b)/gm,
      /(\b(?:op)\b)/gm,
      /(\b(?:particle)\b)/gm,
      /(\b(?:playsound)\b)/gm,
      /(\b(?:reload)\b)/gm,
      /(\b(?:replaceitem)\b)/gm,
      /(\b(?:say)\b)/gm,
      /(\b(?:scoreboard)\b)/gm,
      /(\b(?:setmaxplayers)\b)/gm,
      /(\b(?:setblock)\b)/gm,
      /(\b(?:setworldspawn)\b)/gm,
      /(\b(?:spawnpoint)\b)/gm,
      /(\b(?:spreadplayers)\b)/gm,
      /(\b(?:stopsound)\b)/gm,
      /(\b(?:summon)\b)/gm,
      /(\b(?:tag)\b)/gm,
      /(\b(?:tell)\b)/gm,
      /(\b(?:tellraw)\b)/gm,
      /(\b(?:testfor)\b)/gm,
      /(\b(?:testforblock)\b)/gm,
      /(\b(?:testforblocks)\b)/gm,
      /(\b(?:tickingarea)\b)/gm,
      /(\b(?:time)\b)/gm,
      /(\b(?:title)\b)/gm,
      /(\b(?:titleraw)\b)/gm,
      /(\b(?:toggledownfall)\b)/gm,
      /(\b(?:tp)\b)/gm,
      /(\b(?:videostream)\b)/gm,
      /(\b(?:videostreamaction)\b)/gm,
      /(\b(?:weather)\b)/gm,
      /(\b(?:worldbuilder)\b)/gm,
      /(\b(?:wsserver)\b)/gm,
      /(\b(?:xp)\b)/gm
    ],
    'selector': /\s+@(a|e|r|p)/,
    'property': {
      pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"((?=\s*:)|(?=\s*=))/,
      lookbehind: true,
      greedy: true
    },
    'string': {
      pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
      lookbehind: true,
      greedy: true
    },
    'comment': {
      pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
      greedy: true
    },
    'number': [
      /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
      / ~/
    ],
    'punctuation': /[{}[\],]/,
    'operator': /:/,
    'boolean': /\b(?:false|true)\b/,
    'null': {
      pattern: /\bnull\b/,
      alias: 'keyword'
    }
  }
}



async function containerWrapTextNodesWithSpan() {
  
  let code = document.querySelector('editor-tool[name="container"] div.prism-live code');

  // Wrap textNodes in <span>
  await Promise.all([...code.childNodes]
  .map(async node =>
  {
    if (node.nodeName == '#text')
    {
      let span = document.createElement('span');
          span.classList.add('token');

      // Replace node with span,
      // The and node to that span.
      code.replaceChild(span, node);
      span.append(node);
    } 
  }));
}



async function containerGetCompiledCommands() {

  let timeMultiplier = 0.75; //0.75

  const replaceTokens = async (token, innerText) =>
  { // Get code's token, and replace it's innerText

    await Promise.all([...code.querySelectorAll(token)]
    .map(async token =>
    {
      token.classList.add('highlight');
      await sleep(1000 * timeMultiplier);
  
      let oldInnerText = token.innerText;
      token.innerText  = innerText;
  
      await sleep(1000 * timeMultiplier);
      token.classList.remove('highlight');

      return oldInnerText;
    }));
  }

  const removeTokens = async (token) =>
  { // Remove tokens from code's content

    await Promise.all([...code.querySelectorAll(token)]
    .map(async token =>
    {
      token.classList.add('highlight');
      await sleep(1000 * timeMultiplier);

      token.classList.add('hide');
      await sleep(1000 * timeMultiplier);

      token.remove();
    }));
  }

  const hideTokens = async (token, instantly=false) =>
  {
    await Promise.all([...code.querySelectorAll(token)]
    .map(token =>
    {
      (instantly)
      ? token.style.opacity = 0
      : token.classList.add('hide');
    }));

    await sleep(1000 * timeMultiplier);
  }

  const showTokens = async (token, fadein=false) =>
  {
    if (fadein) code.classList.add('fadeIn');

    await Promise.all([...code.querySelectorAll(token)]
    .map(token =>
    {
      token.style.removeProperty('opacity');
      token.classList.remove('hide');
    }));

    await sleep(1000 * timeMultiplier);
    if (fadein) code.classList.remove('fadeIn');
  }


  // Stage: 1 ---------------------------- //
  // Prepare and Display container-editor for sorting, Then,
  // Remove comments, and Replace strings with temporary marking: "S" (string) and "P" (property)
  // Store strings in adequate lists, e.g. token .property in list 'properties'
  // At last, hide all tokens for 'Stage: 2'


  displayEditor('container');

  // Show .loading
  let loading = document.querySelector('div.loadingScreen');
      loading.style.removeProperty('display');
      loading.classList.remove('hide');

  // Disable textarea and scroll it to the top
  let textarea = document.querySelector('editor-tool[name="container"] textarea.prism-live');
      textarea.setAttribute('disabled', true);
      textarea.scrollTo(0,0);

  // Get code and code's content (innerText)
  let code     = document.querySelector('editor-tool[name="container"] div.prism-live code');
  let codeText = await containerGetCode();
  
  await sleep(1000);

  // Get string tokens

  let strings = [];
  await Promise.all([...code.querySelectorAll('span.string')]
  .map(node => strings.push(node.innerText)));
  await replaceTokens('span.string', '"S"');

  let properties = [];
  await Promise.all([...code.querySelectorAll('span.property')]
  .map(node => properties.push(node.innerText)));
  await replaceTokens('span.property', '"P"');

  // Remove comments
  await removeTokens('span.comment');

  // Wrap text nodes for .highlightAll animation
  await containerWrapTextNodesWithSpan();
  code.classList.add('highlightAll');
  
  await sleep(1000 * timeMultiplier);
  hideTokens('span.token');
  await sleep(1000 * timeMultiplier);


  // Stage: 2 ---------------------------- //
  // Show striped-form-unnecessary-spaces code

  
  // Get code's content without unnecessary spacing
  let codeString = await code.innerText.replace(/\s+/g, ' ');
      codeString = await codeString.split('>>>/');
      await codeString.shift();

  // Update container display (and therefore, get new code)
  (codeString.length > 1)
  ? await containerSetCode(codeString)
  : await containerSetCode([codeString]);
  code = document.querySelector('editor-tool[name="container"] div.prism-live code');

  // Wrap text nodes for .fadeIn animation
  await containerWrapTextNodesWithSpan();

  // Hide old and show new code
  await hideTokens('span.token', true);
  await showTokens('span.token', true);


  // Stage: 3 ---------------------------- //
  // Validate and Compress existing closed-punctuations '[...]' and '{...}'

  timeMultiplier = 0.1 // 0.1

  let data;
  let newCode = "";
  let punctuation_occurances = -1;
      


  const removeTokensBeforeFirstPunctuation = async () =>
  {
    let node, tokens;
    let nodes = await Promise.all([...code.childNodes]);
    let index = 0;

    const isPunctuation = async () => {
      node = nodes[index];

      if (node.classList.contains('punctuation')) {
        punctuation_occurances++;

        // Node is punctuation
        await Promise.all([...code.querySelectorAll('span.highlight')].map(node => newCode += node.innerText));
        await removeTokens('span.highlight');
        node.classList.add('highlight');
        return { state: 'success', node };
      }

      index++; // Node is not punctuation
      await sleep(100 * timeMultiplier);
      node.classList.add('highlight');
      return { state: 'fail', node };
    }

    while (true) {
      try { // Repeat until data's state is resolved as 'success'
        let data = await isPunctuation();
        if (data.state == "success") return data;
      }
      catch (ex) { console.log("still waiting and trying again"); }
    }
  }



  const errorOpenedBracket = async (bracket_pos) =>
  { // Highlight opened bracket on original code

    timeMultiplier = 0.75 // 0.75

    // Highlight opened bracket in modified-by-algorithm code with an error
    data.node.classList.add('error');
    data.node.classList.add('highlight');
    await sleep(5000 * timeMultiplier);

    // Update container display with original code (and therefore, get new code)
    await containerSetCode(codeText);
    code = document.querySelector('editor-tool[name="container"] div.prism-live code');

    // Highlight opened bracket in original-code with an error
    let brackets = await Promise.all([...code.querySelectorAll('span.punctuation')]);
    let opened_bracket = brackets[bracket_pos];
        opened_bracket.classList.add('error');
        opened_bracket.classList.add('highlight');

    // Highlight line at which error token occurs
    let errorLine = document.createElement('span');
        errorLine.classList.add('error-line');
        errorLine.classList.add('token');
        errorLine.style.setProperty('--top', ( opened_bracket.getBoundingClientRect().y - code.getBoundingClientRect().y ) + 'px');
        errorLine.style.setProperty('--width', document.getElementById('containerTextArea').scrollWidth + 'px');
        code.append(errorLine);

    // Hide .loading and enable textarea
    loading.classList.add('hide');
    await sleep(1000 * timeMultiplier);
    loading.style.display = 'none';
    textarea.removeAttribute('disabled');

    // Scroll code display to .error token
    let tokenY = opened_bracket.getBoundingClientRect().y;
    let tokenX = opened_bracket.getBoundingClientRect().x;
    document.getElementById('containerTextArea')
    .scrollTo(tokenX - 40, tokenY - 40);

    // Log error message in console
    return console.error('Found opened bracket:\n', opened_bracket);
  };



  const getClosedBracket = async () =>
  {
    let node;
    let nodes = await Promise.all([...code.childNodes]);
    let closedBracket = "";
    let startBracket;
    let index = 0;

    // Validate opening of external bracket
    node = nodes[0];

    if (node.innerText === '[') startBracket = '[';
    else if (node.innerText === '{') startBracket = '{';
    else return;

    // Loop through <code> nodes
    for (let i = 0; i < nodes.length; i++) {
      // Select node
      node = nodes[i];
      node.classList.add('highlight');
      closedBracket += node.innerText;

      if (startBracket === '[') {
        // (index) Increment when '[' Decrement if ']'
        if (['['].includes(node.innerText)) index++;
        else if ([']'].includes(node.innerText)) index--;
      }
      else if (startBracket === '{') {
        // (index) Increment when '{' Decrement if '}'
        if (['{'].includes(node.innerText)) index++;
        else if (['}'].includes(node.innerText)) index--;
      }

      // External brackets are closed [...] & {...}
      // Note that nested brackets may be open
      if (index === 0) return await closedBracket;
    }

    // startBracket has no closing
    return false;
  }



  // Source: https://stackoverflow.com/questions/52969755/how-to-check-the-sequence-of-opening-and-closing-brackets-in-string#answer-52970433
  // Access: 16/02/2023 & modified same day by McRaZick

  const areBracketsClosed = async (expr) => {

    let holder = [];
    let openBrackets = ['{','['];
    let closedBrackets = ['}',']'];
    let lastOpenedBracketPosition = false;
    let firstClosedBracketPosition = false;
    let openBracketCount = 0;
    let closedBracketCount = 0;
    
    const incrementPO = (string) => {
      // Increment any punctuation_occurances from language "minecraft-v1-12-x"
      // (Language is defined by PrismJS and is located at the very top of THIS file)

      if (Prism
      .languages['minecraft-v1-12-x']
      .punctuation
      .test(string))
      {
        punctuation_occurances++;
      }
    }

    let index = -1;

    // loop trought all letters of expr
    for (let letter of expr) {
      
      index++;

      // if its oppening bracket
      if (openBrackets.includes(letter)) {
        lastOpenedBracketPosition = index;
        holder.push(letter);
      }
      // if its closing
      else if (closedBrackets.includes(letter)) {
        firstClosedBracketPosition = index;

        // find its pair
        let openPair = openBrackets[closedBrackets.indexOf(letter)];

        // check if that pair is the last element in the array, if so, remove it
        if (holder[holder.length - 1] === openPair) {
          holder.splice(-1,1);
        }
        else {
          holder.push(letter);
          break;
        }
      }
    }

    // loop trought all letters of expr (again)
    for (let letter of expr) {
      if (openBrackets.includes(letter)) openBracketCount++;
      else if (closedBrackets.includes(letter)) closedBracketCount++;
    }

  
    let result = (holder.length === 0);

    // Increment 'punctuation_occurances' and return false/true
    if (result === false) {

      // Hard to explain, it fixes the bug where .error used to highlight parent brackets
      // despite the fact that a nested bracket is incorrectly places within the parent brackets
      let openBracket = (openBracketCount < closedBracketCount)
      ? holder[holder.length - 1]
      : holder[0]
      
      if (openBrackets.includes(openBracket)) {
        invalidBracketPosition = lastOpenedBracketPosition;
      }
      else if (closedBrackets.includes(openBracket)) {
        invalidBracketPosition = firstClosedBracketPosition;
      }

      // Loop through expression's start position to open bracket.
      let startToOpenedBracket = expr.substring(0, invalidBracketPosition + 1);
      for (letter of startToOpenedBracket) incrementPO(letter);

      return false;
    }
 
    for (letter of expr) incrementPO(letter);
    return true;
  }



  while (true)
  {
    // Break from while-loop if there are no more punctuations in code
    let punctuation = code.querySelector('span.punctuation');
    if (!punctuation) break;

    data = await removeTokensBeforeFirstPunctuation();
    
    // If first punctuation is a closed bracket
    if (data.state == "success" && [']','}'].includes(data.node.innerText)) {
      return await errorOpenedBracket(punctuation_occurances);
    }
    // If first punctuation is an open bracket
    else if (data.state == "success" && ['[','{'].includes(data.node.innerText))
    {
      // Get external bracket and its content with nested brackets if included
      let closedBracket = await getClosedBracket();
      if (closedBracket === false) {
        return await errorOpenedBracket(punctuation_occurances);
      }
      else if (closedBracket) {
        /* Variable P.O. is incremented at removeTokensBeforeFirstPunctuation().
        /  And so, the function increments the first instance of bracket.
        /  
        /  I don't want to increment brackets through that function.
        /  I will delete the bracket once highlighted, and manage P.O. later
        /  as it will give me better control of capturing the invalid bracket as error.
        */
        punctuation_occurances--;
        // Remove unnecessary spacing from 'bracket'
        closedBracket = closedBracket.replace(/\s/g, '');

        let result = await areBracketsClosed(closedBracket);
        if (result === false) {
          return await errorOpenedBracket(punctuation_occurances);
        }

        // Remove closed and valid bracket (with nested closed brackets if pressent)
        // And add it to newCode
        await removeTokens('span.highlight');
        newCode += closedBracket;
      }
    }
    else {
      // Remove punctuation if it's not a bracket: '[]' or '{}'
      // and add it to the 'newCode'
      newCode += await data.node.innerText;
      await removeTokens('span.highlight');
    }
  }

  newCode += await code.innerText;
  


  // Stage: 4 ---------------------------- //
  // Return 'newCode' with original quotes data, initialize original code, and disable loading
  // Note, 'newCode' is returned as list with commands instead of a string object.

  // Replace the temporary quote template with appropriate data
  strings.map(string => newCode = newCode.replace(/"S"/, string));
  properties.map(property => newCode = newCode.replace(/"P"/, property));

  // Update container display with original code
  await containerSetCode(codeText)

  // Hide .loading and enable textarea
  loading.classList.add('hide');
  await sleep(1000 * timeMultiplier);
  loading.style.display = 'none';
  textarea.removeAttribute('disabled');


  newCode = newCode.split('\n');
  newCode = await Promise.all(newCode.map(command => {
    // If N command of 'newCode' list includes spacing at last position, remove it
    if (/\s/g.test(command.slice(-1))) {
      return command.slice(0,-1);
    }
    return command;
  }));

  return newCode;
}



async function containerGetCode() {

  let editor   = document.querySelector('editor-tool[name="container"]');
  let codeNode = editor.querySelector('div.prism-live code');
  
  return codeNode.innerText.split('\n');

}



async function containerSetCode(code_array=[]) {

  // Validate parameter: code_array for type and length
  if (!(Array.isArray(code_array) && code_array.length > 0)) {
    return console.error(`parameter 'code_array' must be an Array with one or more items.`);
  }

  // Initialize textarea
  let textarea = document.createElement('textarea');
      textarea.id = "containerTextArea";
      textarea.value = code_array.join('\r\n');
      textarea.classList.add(
        'prism-live',
        'language-minecraft-v1-12-x',
        'line-numbers'
      );

  // Update editor-container's display (prism-live)
  let editor = document.querySelector('editor-tool[name="container"]');
  let prism  = editor.querySelector('div.prism-live');
  if (prism) prism.remove();

  editor.append(textarea);

  prismLiveRemoveSyncStylesEventListeners();
  loadPrismLive(); // Defined in ...lib/prism-live.js
  makeContainerFunctional();
}



function prismLiveRemoveSyncStylesEventListeners() {

  /* 'PrismLiveEventListeners' originates from library PrismLive
  It is not original element from the PrismLive library,
  and it was added to solve this specific issue
  
  (search for modified by McRaZick 04/02/2023) prism-live.js
  
  Function's purpose is to remove window's eventListener
  'resize' with handler.name "prismLiveSyncStyles", created
  in library prism-live.js.
  */

  if (!window && !PrismLiveEventlisteners) {
    return console.error(`Objects 'window' and 'PrismLiveEventlisteners' are required.`);
  }

  [...PrismLiveEventlisteners].map(handler =>
  {
    window.removeEventListener('resize', handler);
    PrismLiveEventlisteners.pop(handler);
  });

}



function containerCreateCommandBlock(e) {
  // command block -> 'span.token.commandblock', found at $(div.prism-live code)

  // Enter + Shift
  if (e.keyCode == 13 && e.shiftKey == true) {
    e.preventDefault();
    addTextAtCaret('containerTextArea', '>>>/');
    return true;
  }
}



function makeContainerFunctional() {

  let textarea = document.querySelector('editor-tool[name="container"] textarea.prism-live');
  
  // Create 'span.token.commandblock', on Shift + Enter in container-editor's textarea.prism-live
  textarea.removeEventListener('keydown', containerCreateCommandBlock);
  textarea.addEventListener('keydown', containerCreateCommandBlock);

}



containerSetCode([
`// SAMPLE FOR TESTING PURPOSES ONLY!

/* Project name = MyAuto, Project ID = 14CC
  sDF = Scoreboard for car entities. Used to identify unique-existing cars.
  sCD = Scoreboard car driving. Used to check if car is moving.
  e01 = Entity Car. Used to identify existing cars.
  e02 = Entity Squid. Used to summon entity car (e01).
*/

>>>/gamerule commandBlockOutput false

// Summon Car Entity (e01)
>>>/execute @e[type=squid,name=MyAuto14CCe02] ~ ~ ~ summon minecart ~ ~ ~
{
  CustomName: "MyAuto14CCe01",
  NoGravity: 1b,
  CustomDisplayTile: 1,
  DisplayTile: "minecraft:stone_slab",
  DisplayOffset: 2
}

// Kill Entity (e02)
>>>/kill @e[type=squid,name=MyAuto14CCe02]

// Create scoreboards
>>>/scoreboard objectives add MyAuto14CCsDF dummy
>>>/scoreboard objectives add MyAuto14CCsCD dummy

// Remove entities from scoreboards if they exceede value 1
>>>/scoreboard players set @e[score_MyAuto14CCsDF_min=2] MyAuto14CCsDF 0
>>>/scoreboard players reset @a MyAuto14CCsCD

// Add entities to scoreboards
>>>/scoreboard players add @e[type=minecart,name=MyAuto14CCe01] MyAuto14CCsDF 1
>>>/execute @e[type=minecart,name=MyAuto14CCe01] ~ ~ ~
    execute @p[r=1] ~ ~ ~
    scoreboard players set @p[r=1] MyAuto14CCsCD 1 {SelectedItemSlot:0}

// Construct Car Entity
>>>/execute @e[score_MyAuto14CCsDF_min=1,score_MyAuto14CCsDF=1] ~ ~ ~
playsound minecraft:entity.cat.purr hostile @a[r=10] ~ ~ ~ 1 0.2 1
    
>>>/execute @e[score_MyAuto14CCsDF_min=1,score_MyAuto14CCsDF=1] ~ ~ ~
playsound minecraft:ui.toast.in ambient @a[r=10] ~ ~ ~ 0 0.2 0

// Move Car North West
>>>/execute @e[score_MyAuto14CCsCD_min=1,rym=135,ry=158] ~ ~ ~
tp @e[type=minecart,name=MyAuto14CCe01,r=1] ~ ~ ~
say North West
    
// Move Car North
>>>/execute @e[score_MyAuto14CCsCD_min=1,rym=158,ry=180] ~ ~ ~
tp @e[type=minecart,name=MyAuto14CCe01,r=1] ~ ~ ~-1
   
>>>/execute @e[score_MyAuto14CCsCD_min=1,ry=-158,rym=-180] ~ ~ ~
tp @e[type=minecart,name=MyAuto14CCe01,r=1] ~ ~ ~-1
   
// Move Car North East
>>>/execute @e[score_MyAuto14CCsCD_min=1,ry=-135,rym=-158] ~ ~ ~
tp @e[type=minecart,name=MyAuto14CCe01,r=1] ~ ~ ~
say North East

// Move Car East North
>>>/execute @e[score_MyAuto14CCsCD_min=1,ry=-113,rym=-135] ~ ~ ~
tp @e[type=minecart,name=MyAuto14CCe01,r=1] ~ ~ ~
say East North
   
// Move Car East
>>>/execute @e[score_MyAuto14CCsCD_min=1,ry=-68,rym=-113] ~ ~ ~
tp @e[type=minecart,name=MyAuto14CCe01,r=1] ~ ~ ~
say East
   
// Move Car East South
>>>/execute @e[score_MyAuto14CCsCD_min=1,ry=-45,rym=-68] ~ ~ ~
tp @e[type=minecart,name=MyAuto14CCe01,r=1] ~ ~ ~
say East South

// Move Car South East
>>>/execute @e[score_MyAuto14CCsCD_min=1,ry=-23,rym=-45] ~ ~ ~
tp @e[type=minecart,name=MyAuto14CCe01,r=1] ~ ~ ~
say South East
   
// Move Car South
>>>/execute @e[score_MyAuto14CCsCD_min=1,rym=-23,ry=23] ~ ~ ~
tp @e[type=minecart,name=MyAuto14CCe01,r=1] ~ ~ ~
say South

// Move Car West
>>>/execute @e[score_MyAuto14CCsCD_min=1,rym=23,ry=45] ~ ~ ~
tp @e[type=minecart,name=MyAuto14CCe01,r=1] ~ ~ ~
say South West

// Move Car West South
>>>/execute @e[score_MyAuto14CCsCD_min=1,rym=45,ry=68] ~ ~ ~
tp @e[type=minecart,name=MyAuto14CCe01,r=1] ~ ~ ~
say West South
   
// Move Car West
>>>/execute @e[score_MyAuto14CCsCD_min=1,rym=68,ry=113] ~ ~ ~
tp @e[type=minecart,name=MyAuto14CCe01,r=1] ~ ~ ~
say West
   
// Move Car West North
>>>/execute @e[score_MyAuto14CCsCD_min=1,rym=113,ry=135] ~ ~ ~
tp @e[type=minecart,name=MyAuto14CCe01,r=1] ~ ~ ~
say West North
   `
]);