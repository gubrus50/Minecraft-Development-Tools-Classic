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
  await containerSetCommands([newValue]);
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
    'selector': /@(a|e|r|p)/,
    'property': {
      pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
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



async function containerGetCommands() {

  let editor   = document.querySelector('editor-tool[name="container"]');
  let codeNode = editor.querySelector('div.prism-live code');
  
  return codeNode.innerText.split('\n');

}



async function containerSetCommands(commands_array=[]) {

  // Validate parameter: commands_array for type and length
  if (!(Array.isArray(commands_array) && commands_array.length > 0)) {
    return console.error(`parameter 'commands_array' must be an Array with one or more items.`);
  }

  // Initialize textarea
  let textarea = document.createElement('textarea');
      textarea.id = "containerTextArea";
      textarea.value = commands_array.join('\r\n');
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
  loadPrismLive();
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

  // Create 'span.token.commandblock', on Shift + Enter in container-editor's textarea.prism-live
  let textarea = document.querySelector('editor-tool[name="container"] textarea.prism-live');
      textarea.removeEventListener('keydown', containerCreateCommandBlock);
      textarea.addEventListener('keydown', containerCreateCommandBlock);
 
}



containerSetCommands([
/*
'gamerule commandBlockOutput false',
'execute @e[type="Zombie",r=3] ~ ~2 ~ tellraw @a ["",{"text":"Zombies","bold":true,"color":"yellow"},{"text":" are real!"}]',
'tp @p[name="McRaZick"] 0 30 350'
*/
`/* SAMPLE FOR TESTING PURPOSES ONLY! */
>>>/gamerule commandBlockOutput false

// Summon Car Entity (e01)
>>>/execute @e[type=squid,name=MyAuto14CCe02] ~ ~ ~ summon minecart ~ ~ ~ {
  CustomName: "MyAuto14CCe01",
  NoGravity: 1b,
  CustomDisplayTile: 1,
  DisplayTile: "minecraft:stone_slab",
  DisplayOffset: 2
}
>>>/kill @e[type=squid,name=MyAuto14CCe02]

// Create scoreboards
>>>/scoreboard objectives add MyAuto14CCsDF dummy
>>>/scoreboard objectives add MyAuto14CCsCD dummy

// Remove entities from scoreboards if they exceede value 1
>>>/scoreboard players set @e[score_MyAuto14CCsDF_min=2] MyAuto14CCsDF 0
>>>/scoreboard players reset @a MyAuto14CCsCD

// Add entities to scoreboards
>>>/scoreboard players add @e[type=minecart,name=MyAuto14CCe01] MyAuto14CCsDF 1
>>>/execute @e[type=minecart,name=MyAuto14CCe01] ~ ~ ~ execute @p[r=1] ~ ~ ~ scoreboard players set @p[r=1] MyAuto14CCsCD 1 {SelectedItemSlot:0}

// Construct Car Entity
>>>/execute @e[score_MyAuto14CCsDF_min=1,score_MyAuto14CCsDF=1] ~ ~ ~ playsound minecraft:entity.cat.purr hostile @a[r=10] ~ ~ ~ 1 0.2 1
>>>/execute @e[score_MyAuto14CCsDF_min=1,score_MyAuto14CCsDF=1] ~ ~ ~ playsound minecraft:ui.toast.in ambient @a[r=10] ~ ~ ~ 0 0.2 0

// Move Car North West
>>>/execute @e[score_MyAuto14CCsCD_min=1,rym=135,ry=158] ~ ~ ~ tp @e[type=minecart,name=MyAuto14CCe01,r=1] ~ ~ ~ say North West
// Move Car North
>>>/execute @e[score_MyAuto14CCsCD_min=1,rym=158,ry=180] ~ ~ ~ tp @e[type=minecart,name=MyAuto14CCe01,r=1] ~ ~ ~-1
>>>/execute @e[score_MyAuto14CCsCD_min=1,ry=-158,rym=-180] ~ ~ ~ tp @e[type=minecart,name=MyAuto14CCe01,r=1] ~ ~ ~-1
// Move Car North East
>>>/execute @e[score_MyAuto14CCsCD_min=1,ry=-135,rym=-158] ~ ~ ~ tp @e[type=minecart,name=MyAuto14CCe01,r=1] ~ ~ ~ say North East

// Move Car East North
>>>/execute @e[score_MyAuto14CCsCD_min=1,ry=-113,rym=-135] ~ ~ ~ tp @e[type=minecart,name=MyAuto14CCe01,r=1] ~ ~ ~ say East North
// Move Car East
>>>/execute @e[score_MyAuto14CCsCD_min=1,ry=-68,rym=-113] ~ ~ ~ tp @e[type=minecart,name=MyAuto14CCe01,r=1] ~ ~ ~ say East
// Move Car East South
>>>/execute @e[score_MyAuto14CCsCD_min=1,ry=-45,rym=-68] ~ ~ ~ tp @e[type=minecart,name=MyAuto14CCe01,r=1] ~ ~ ~ say East South

// Move Car South East
>>>/execute @e[score_MyAuto14CCsCD_min=1,ry=-23,rym=-45] ~ ~ ~ tp @e[type=minecart,name=MyAuto14CCe01,r=1] ~ ~ ~ say South East
// Move Car South
>>>/execute @e[score_MyAuto14CCsCD_min=1,rym=-23,ry=23] ~ ~ ~ tp @e[type=minecart,name=MyAuto14CCe01,r=1] ~ ~ ~ say South
// Move Car West
>>>/execute @e[score_MyAuto14CCsCD_min=1,rym=23,ry=45] ~ ~ ~ tp @e[type=minecart,name=MyAuto14CCe01,r=1] ~ ~ ~ say South West

// Move Car West South
>>>/execute @e[score_MyAuto14CCsCD_min=1,rym=45,ry=68] ~ ~ ~ tp @e[type=minecart,name=MyAuto14CCe01,r=1] ~ ~ ~ say West South
// Move Car West
>>>/execute @e[score_MyAuto14CCsCD_min=1,rym=68,ry=113] ~ ~ ~ tp @e[type=minecart,name=MyAuto14CCe01,r=1] ~ ~ ~ say West
// Move Car West North
>>>/execute @e[score_MyAuto14CCsCD_min=1,rym=113,ry=135] ~ ~ ~ tp @e[type=minecart,name=MyAuto14CCe01,r=1] ~ ~ ~ say West North"`
]);