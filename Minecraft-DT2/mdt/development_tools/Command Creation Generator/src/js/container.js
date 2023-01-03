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

  //const flask = new CodeFlask('editor-tool[name="container"]', { language: 'json' });

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


  /* PRIZM.COM JS CHECK IT OUT - create own language
  createInterval('container_identifyAndSetComments', () =>
  {

    
  }, 1000);



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