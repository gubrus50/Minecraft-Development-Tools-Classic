function toggleCommandsConditionOnClick(commandBlock) {
  commandBlock.onclick = (event) => {
    if (event.clientX >= 5 && event.clientX <= 23) {
        commandBlock.hasAttribute('data-conditional')
      ? commandBlock.removeAttribute('data-conditional')
      : commandBlock.setAttribute('data-conditional', '');
    }
  }
}



function makeContainerFuncitonal() {

  let editorToolContainer = document.querySelector('editor-tool[name="container"]');

  editorToolContainer.addEventListener('keypress', (event) => {
    
    if (event.key == 'Enter')
    {
      let commandBlocks = document.querySelectorAll('editor-tool[name="container"] > div:not(:first-child)');
    
      // Make all chain-command-block's conditional-state toggable onClick.
      // (An unintentional bug from setTimeout: "summons previous command's state on new command."
      //  I like it so much that it's now a feature XD).

      setTimeout(() => {
        Array.from(commandBlocks).map(commandBlock => toggleCommandsConditionOnClick(commandBlock));
      }, 0);
    }

  });



  createInterval('container_errorCommandBlockWithDivNode', () =>
  {
    let commandBlocks = document.querySelectorAll('editor-tool[name="container"] > div:not(:first-child)');
  
    Array.from(commandBlocks).map(commandBlock => {
      // Set error if commandBlock includes nodeChild div. Otherwise, clear error.
      commandBlock.querySelector('div')
      ? commandBlock.setAttribute('data-error', '')
      : commandBlock.removeAttribute('data-error');
    });
  }, 500);



  createInterval('container_unwrapCommandBlocksDivNodes', () =>
  {
    let commandBlocks = document.querySelectorAll('editor-tool[name="container"] > div');
    
    Array.from(commandBlocks).map(commandBlock => {
      divNodes = commandBlock.querySelectorAll('div');

      // Remove nested divNodes from parent commandBlock
      Array.from(divNodes).map(node => {
        node.replaceWith(...node.childNodes, ' ');
      });
    });
  }, 1000);


  /* PRIZM.COM JS CHECK IT OUT - create own language */
  createInterval('container_prismHighlightAll', () =>
  {
    //Prism.highlightAll()
  }, 1000);

  /*

  createInterval('container_styleCommand', () => {
    let commandBlocks = document.querySelectorAll('editor-tool[name="container"] > div');

    Array.from(commandBlocks).map(commandBlock => {
      if (commandBlock.innerHTML.querySelector('a.command')) {
        if ()
      }
      if (!/^[a-zA-Z]+/.test(commandBlock.innerHTML)) return;

      commandBlock.innerHTML = commandBlock.innerHTML.replace(/^[a-zA-Z]+/, (txt) => {
        return `<a href="#" class="command">${txt}</a>`;
      });
    });
  }, 1000)*/
}

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

