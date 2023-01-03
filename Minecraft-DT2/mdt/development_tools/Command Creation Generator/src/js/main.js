/* ------ START LIBRARIES ------ */

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




window.onload = async () => {

  makeWysiwygFuncitonal(); /* wysiwyg.js onLoad */
  makeContainerFuncitonal(); /* container.js onLoad */

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
  Array.from(display_btns).map((btn, index) => {
    btn.addEventListener('click', () => {

      Array.from(display_btns).map(b => {
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

  let commands_btns = document.querySelectorAll('#commands button');
  let textarea      = document.querySelector('#commands > textarea');

  Array.from(commands_btns).map(btn => {
    btn.addEventListener('click', () => {

      Array.from(commands_btns).map(b => {
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



  // :: Update CSS's root variable "--window-width" on window resize event

  window.addEventListener('resize', () => {
    let clientWidth = document.body.clientWidth;
    createStyle('new-window-width', `
      :root { --window-width: ${clientWidth}px }
    `);
  });

}