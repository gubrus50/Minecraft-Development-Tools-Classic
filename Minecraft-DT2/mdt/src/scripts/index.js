/* ------ START LIBRARIES ------ */

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






const audio = new Audio('./btn-press.mp3');

const playSoundBtnPress = () => {
  let sound = audio.cloneNode(true);
      sound.currentTime = 0.6;
      sound.play();
}



const functionalizeNodesHelpTag = (querySelectorAll) => {

  let helpTag = document.querySelector('help-tag');
  const nodes = [...querySelectorAll];

  nodes.map(node => {

    let helpContent = node.querySelector('help-content');
    
    // Show <help-tag> with updated content on <help-content> node's hover
    node.addEventListener('mouseover', () => {
      helpTag.innerHTML = `<h1>${helpContent.getAttribute('name')}</h1>`;
      helpTag.innerHTML += helpContent.innerHTML;
      helpTag.classList.remove('hide');
    });

    // Hide <help-tag> off hover
    node.addEventListener('mouseout', () => {
      helpTag.classList.add('hide');
    });

  });

}



window.onload = async () => {

  // :: Initialize footer's buttons
  document
  .querySelector('footer')
  .addEventListener('DOMSubtreeModified', () =>
  // EventListener for footer's content change
  {
    [...document.querySelectorAll('footer button')]
    .map(btn =>
    {
      // Play audio (btn-press), on click event
      btn.removeEventListener('click', playSoundBtnPress);
      btn.addEventListener('click', playSoundBtnPress);
      
      // Set footer's button's attribute "data-before" to button's text value
      btn.setAttribute('data-before', btn.innerText);
    });

    // Initialize footer's .devToolsMenuBtn's <help-tag>'s functionality
    createInterval('footer_functionalizeDevToolsMenuHepTags', () =>
    {
      let parentsOfHelpContentTag = [...document.querySelectorAll('.devToolsMenuBtn help-content')]
      .map(helpContent => helpContent.parentElement);

      // Hide <help-tag>
      document.querySelector('help-tag').classList.add('hide');

      functionalizeNodesHelpTag(parentsOfHelpContentTag);
      removeInterval('footer_functionalizeDevToolsMenuHepTags');
    }, 1000, false);
  
  });




  
  let ifrBody   = document.querySelector('main-display #iframeBody');
  let ifrFooter = document.querySelector('main-display #iframeFooter');

  let ifrBodySrc   = './iframe_body.html';
  let ifrFooterSrc = './iframe_footer.html';

  // Import default stylesheets for iframe Body and Footer
  ifrBody.addEventListener('load', (e) => {
    if (e.target.dataset.isdevtool) return;
    appendDefaultStylesForIframe(e.target);
  });
  ifrBody.setAttribute('src', ifrBodySrc);

  ifrFooter.addEventListener('load', (e) => {
    appendDefaultStylesForIframe(e.target);
  });
  ifrFooter.setAttribute('src', ifrFooterSrc);





  // Import Development Tools
  if (document.querySelector('navigation-bar')) launcher.importDevTools();

  // Initiate <help-tag>'s functionality
  if (document.querySelector('help-content'))
  {
    let parentsOfHelpContentTag = [...document.querySelectorAll('help-content')]
    .map(helpContent => helpContent.parentElement);

    functionalizeNodesHelpTag(parentsOfHelpContentTag);
  }





  // Make navigation-bar's buttons functional
  let btn_about = document.querySelector('navigation-bar .btnAbout');
  btn_about.addEventListener('click', () =>
  {
    let ifrBody = document.querySelector('main-display #iframeBody');
    ifrBody.setAttribute('src', ifrBodySrc);

    let ifrFooter = document.querySelector('main-display #iframeFooter');
    ifrFooter.setAttribute('src', ifrFooterSrc);

    // Remove launch button's onClickEvent(s)
    let buttonLaunch = document.querySelector('.buttonLaunch > button');
        buttonLaunchClone = buttonLaunch.cloneNode(true);
        buttonLaunch.parentNode.replaceChild(buttonLaunchClone, buttonLaunch);
  });

  // Initialize Navigation-bar's buttons
  [...document.querySelectorAll('navigation-bar button')]
  .map(btn => btn.addEventListener('click', playSoundBtnPress));

}