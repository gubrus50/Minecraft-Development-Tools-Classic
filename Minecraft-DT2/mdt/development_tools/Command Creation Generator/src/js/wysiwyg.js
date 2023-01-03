const Signs = {
  1 : {
    display: [
      "[Cmd1.12.X]",
      "<font color=\"#0000b2\">$</font><font color=\"#5bffff\">creation_name</font>",
      "by",
      "<font color=\"#0000b2\">$</font><font color=\"#5bffff\">programmer</font>"
    ],
    command: [
      "/particle largeexplode ~ ~1 ~8 1.2 2.0 1.2 3 9",
      "/playsound minecraft:entity.generic.explode player @a ~ ~ ~",
      "/tellraw @a {\n  \"text\": \"!(creation_name) has been destroyed!\",\n  \"color\": \"gold\"\n}",
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
      "/tellraw @a {\n  \"text\": \"Instruction...\",\n  \"color\": \"aqua\"\n}",

`/give @p written_book 1 0 {
  pages: ["
    [\\"\\",{
      \\"text\\": \\"[Instruction]\\\\n\\\\n\\",
      \\"color\\": \\"aqua\\",
      \\"bold\\": true
    },{
      \\"text\\": \\"- Item recipes:\\",
      \\"color\\": \\"black\\",
      \\"bold\\": false
    }]
  "],
  title: Book,
  author: !(creation_programmer)
} `
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
      "/tellraw @a {\n  \"text\": \"!(creation_name) has been activated!\",\n  \"color\": \"gold\"\n}",
      "/playsound block.piston.contract block @a ~ ~ ~ 10 1",
      "/setblock ~ ~-2 ~2 repeating_command_block 3 replace {\n  auto: 1b,\n  TrackOutput: 0\n}",
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
      "/tellraw @a {\n  \"text\": \"!(creation_name) has been deactivated!\",\n  \"color\": \"gold\"\n}",
      "/playsound block.piston.extend block @a ~ ~ ~ 10 1",
      "/setblock ~1 ~-2 ~2 command_block 3",
      "/fill ~2 ~4 ~1 ~-1 ~-2 ~17 stained_glass 7 replace stained_glass"
    ]
  } 
}

let CurrentSign = 1;
let CurrentCommand = 1;



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
            return document.execCommand('unLink', false, '#');
          }
        }
        
        // Close selection with an anchor tag and update obfuscated text color.
        document.execCommand('createLink', false, '#');
        setObfuscatedAnchorColor();  
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
      
      setObfuscatedAnchorColor();

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

      // Stripe overflowing content(s)
      while (/(<div><br><\/div>|<br>)/gm.test(input.innerHTML)) {
        removeLineBreaks(input);
      }
      while (input.scrollHeight >= 50 || input.scrollWidth > input.offsetWidth)
      {
        del_lastChar_from_LastNode(input);
      }
      
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