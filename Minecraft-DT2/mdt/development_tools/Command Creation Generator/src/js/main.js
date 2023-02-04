/* ------ START LIBRARIES ------ */

const isRealNumber = (n) => {
  return (!(isNaN(n)) && typeof n == 'number') ? true : false;
}



function getCaretIndex(element) {

  let position = 0;
  const isSupported = typeof window.getSelection !== "undefined";

  if (isSupported) {

    const selection = window.getSelection();

    if (selection.rangeCount !== 0) {
      const range = window.getSelection().getRangeAt(0);
      const preCaretRange = range.cloneRange();

      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      position = preCaretRange.toString().length;
    }
  }
  
  return position;
}



// Source: https://stackoverflow.com/questions/10778291/move-the-cursor-position-with-javascript#answer-10782169
// Accessed: 01/12/2022 at 6:22 am
const moveCaretTo = (charCount) => {

  let selection = window.getSelection();
  let textNode  = selection.focusNode;

  if (selection.rangeCount > 0) {
    selection.collapse(textNode, Math.min(textNode.length, charCount));
  } 
}



const removeLineBreaks = (elm) => {
  elm.innerHTML = elm.innerHTML.replace(/(<div><br><\/div>|<br>)/g, '');
}



const del_lastChar_from_LastNode = (node) => {
  if (!(node.childNodes.length)) {

    let txt = (node.nodeType === 3) ? node.nodeValue : node.innerHTML;
        txt = txt.substring(0, txt.length - 1);

    if (txt <= 0) node.remove();
    else if (node.nodeType === 3) node.nodeValue = txt;
    else node.innerHTML = txt;
    
  }
  else if (node.childNodes) {
    return del_lastChar_from_LastNode(node.lastChild);
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



const Intervals = {}

const createInterval = (intervalName, intervalFunction, delay, replace) => {

  if (replace != true && Intervals[intervalName]) {
    if (replace === false) return;
    return console.error(`Interval "${intervalName}" already exists in "Intervals" object. Set 'replace' parameter to 'true' in order to overwrite the interval.`);
  }

  if (Intervals[intervalName]) clearInterval(Intervals[intervalName].interval);

  Intervals[intervalName] = { function: intervalFunction, delay }
  Intervals[intervalName].interval = setInterval(
  Intervals[intervalName].function, delay);
}

const restartInterval = (intervalName, delay = false) => {

  if (!Intervals[intervalName]) {
    return console.error(`Cannot restart undefined interval: "${intervalName}".`);
  }
  if (!(delay === false)
  &&  !(isNaN(delay))
  && Intervals[intervalName].delay != delay) {
     Intervals[intervalName].delay =  Number(delay);
  }

  let interval = Intervals[intervalName];
  clearInterval( Intervals[intervalName].interval );

  Intervals[intervalName].interval = setInterval(
    interval.function, interval.delay
  );
}

const removeInterval = (intervalName) => {
  if (!Intervals[intervalName]) {
    return console.error(`Cannot remove undefined interval: "${intervalName}".`);
  }

  clearInterval(Intervals[intervalName].interval);
  delete Intervals[intervalName];
}

const stopInterval = (intervalName) => {
  if (!Intervals[intervalName]) { 
    return console.error(`Cannot stop undefined interval: "${intervalName}".`);
  }
  clearInterval(Intervals[intervalName].interval);
}

/* ------ END LIBRARIES ------ */





let Global = {
  isOnSlideAnimation: false,
}



function displayEditor(editorName) {

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
}