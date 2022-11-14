let audio = new Audio('./btn-press.mp3');



const makeHelpTagFunctional = () => {

  let helpTag = document.querySelector('help-tag');
  let helpContentArray = document.querySelectorAll('help-content'); 

  // Loop through <help-content> list
  Array.from(helpContentArray).map(elm => {

    let parent = elm.parentElement;

    // Show <help-tag> with updated content on <help-content> parent's hover
    parent.addEventListener('mouseover', () => {
      helpTag.innerHTML = `<h1>${elm.getAttribute('name')}</h1>`;
      helpTag.innerHTML += elm.innerHTML;
      helpTag.classList.remove('hide');
    });

    // Hide <help-tag> off hover
    parent.addEventListener('mouseout', () => {
      helpTag.classList.add('hide');
    });
  });

}



window.onload = () => {



  let buttons = [];
  // Append navigation-bar buttons to buttons list
  Array.from(document.querySelectorAll('navigation-bar button'))
  .map(btn => buttons.push(btn));
  // Append footer buttons to buttons list
  Array.from(document.querySelectorAll('footer button'))
  .map(btn => buttons.push(btn));

  if (buttons) {
    Array.from(buttons).map(btn => btn.addEventListener('click', () => {
      
      let sound = audio.cloneNode(true);
          sound.currentTime = 0.6;
          sound.play();

    }));
  }



  
  let ifrBody   = document.querySelector('main-display #iframeBody');
  let ifrFooter = document.querySelector('main-display #iframeFooter');

  let ifrBodySrc   = './iframe_body.html';
  let ifrFooterSrc = './iframe_footer.html';

  // Import default stylesheets for iframe Body and Footer
  ifrBody.addEventListener('load', (e) => {
    appendDefaultStylesForIframe(e.target);
  });
  ifrBody.setAttribute('src', ifrBodySrc);

  ifrFooter.addEventListener('load', (e) => {
    appendDefaultStylesForIframe(e.target);
  });
  ifrFooter.setAttribute('src', ifrFooterSrc);



  // Import Development Tools
  if (document.querySelector('navigation-bar')) {
    launcher.importDevTools();
  }
  // Initiate <help-tag>'s functionality
  if (document.querySelector('help-content')) {
    makeHelpTagFunctional();
  }


  // Make navigation-bar's buttons functional
  let btn_about = document.querySelector('navigation-bar .btnAbout');
  btn_about.addEventListener('click', () =>
  {
    let ifrBody = document.querySelector('main-display #iframeBody');
    ifrBody.setAttribute('src', ifrBodySrc);

    let ifrFooter = document.querySelector('main-display #iframeFooter');
    ifrFooter.setAttribute('src', ifrFooterSrc);
  });


  
}