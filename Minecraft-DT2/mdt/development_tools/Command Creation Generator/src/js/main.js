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





let Global = {
  isOnSlideAnimation: false,
}



function hidePopups() {
  let popup = document.querySelector('.popup');
      popup.classList.add('hide');

  setTimeout(() => {
    popup.style.display = 'none';
    [...popup.children].map(popup => popup.style.display = 'none');
    document.querySelector('.submit').removeAttribute('disabled');
  }, 1000);

}



function showPopup(popupName) {
  let popup = document.querySelector('.popup');
      popup.classList.add('hide');
      popup.style.removeProperty('display');

  setTimeout(() => {
    document.querySelector('.submit').removeAttribute('disabled');
    [...popup.children].map(popup => popup.style.display = 'none');
    document.querySelector(`.popup > .${popupName}`).style.removeProperty('display');
    popup.classList.remove('hide');
  }, 1000);
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

  // Show popup .info
  await sleep(500);
  document.querySelector('.popup > .info').style.removeProperty('display');
  document.querySelector('.popup').classList.remove('hide');
}