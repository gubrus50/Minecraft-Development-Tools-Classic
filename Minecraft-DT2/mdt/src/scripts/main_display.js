const appendDefaultStylesForIframe = (iframe) => {

  // Validate iframe
  if (!iframe || !iframe.hasAttribute('src')) {
    console.error('Cannot apply stylesheet to undefined object.');
    return false;
  }

  // Get href_escape :: used to set a root directory
  let href_escape = '.';
  let iframeSrc = iframe.getAttribute('src');
  
  // If iframe originates from development tools folder
  if (/^.\/development_tools/g.test(iframeSrc))
  {
    // Count instances of slashes '/' from iframe's directory/source
    let slashes = iframeSrc.match(/\//g);
    let count = slashes ? slashes.length : false;

    if (length) {
      // set escape to project's root directory
      for (let i=1; i < count; i++) {
        href_escape += '/..';
      }
    }
  }



  // Set href if iframe is #iframeBody or #iframeFooter, return false with error message

  let href;
  let iframeId = iframe.getAttribute('id');
  
  if (iframeId == "iframeBody") {
    href = href_escape + '/src/styles/iframe_body_stylesheet.css';
  }
  else if (iframeId == "iframeFooter") {
    href = href_escape + '/src/styles/iframe_footer_stylesheet.css';
  }
  else {
    console.error('Illegal iframe id, stylesheet can be applied to #iframeBody and #iframeFooter only!');
    return false;
  }



  // Create and initialize <link> and <style> element
  link = document.createElement('link');
  link.setAttribute('mdt-stylesheet', iframeId);
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('type','text/css');
  link.setAttribute('href', href);

  let iframeDoc = iframe.contentDocument;
      iframeDoc.head.appendChild(link);

  if (iframeId == "iframeFooter")
  {
    style = document.createElement('style');
    style.setAttribute('mdt-stylesheet', iframeId);
    style.innerHTML = `
    @font-face {
      font-family: SilkscreenNormal;
      src: url(${href_escape}/src/styles/slkscr.ttf),
           url(${href_escape}/src/styles/slkscr.eot);
    }
    /* Top button */
    body::-webkit-scrollbar-button:single-button:vertical:decrement {
      background-image: url(${href_escape}/src/images/iconmonstr-arrow-25-up.svg);
    }
    /* Bottom button */
    body::-webkit-scrollbar-button:single-button:vertical:increment {
      background-image: url(${href_escape}/src/images/iconmonstr-arrow-25-down.svg);
    }`;
   
    iframeDoc.head.appendChild(style);
  }



  // Fade-in iframe effect when both iframes source is default
  if (link.getAttribute('mdt-stylesheet') == 'iframe_body')
  {
    setTimeout(() => {
      iframeDoc.body.classList.add('show');
    }, 50)
  }
  else { iframeDoc.body.classList.add('show') }
}