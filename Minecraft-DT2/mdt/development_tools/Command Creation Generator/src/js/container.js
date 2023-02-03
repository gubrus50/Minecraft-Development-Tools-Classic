/* PrismJS - Minecraft Commands 1.12.X */
// https://minecraftbedrock-archive.fandom.com/wiki/Commands/List_of_Commands
if (Prism) {
  Prism.languages['minecraft-v1-12-x'] = {
    'command': [
      /(\b(?:ability)\b)/gm,
      /(\b(?:alwaysday)\b)/gm,
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



function containerGetCommands() {

  let editor   = document.querySelector('editor-tool[name="container"]');
  let codeNode = editor.querySelector('div.prism-live code');
  
  return codeNode.innerText.split('\n');

}



function containerSetCommands(commands_array=[]) {

  // Validate parameter: commands_array for type and length
  if (!(Array.isArray(commands_array) && commands_array.length > 0)) {
    return console.error(`parameter 'commands_array' must be an Array with one or more items.`);
  }

  // Initialize textarea
  let textarea = document.createElement('textarea');
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
  loadPrismLive();

}





containerSetCommands([
  'gamerule commandBlockOutput false',
  'execute @e[type="Zombie",r=3] ~ ~2 ~ tellraw @a ["",{"text":"Zombies","bold":true,"color":"yellow"},{"text":" are real!"}]',
  'tp @p[name="McRaZick"] 0 30 350'
]);


