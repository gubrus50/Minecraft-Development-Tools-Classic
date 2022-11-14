const {
  contextBridge,
  ipcRenderer,
  ipcMain
} = require('electron');

contextBridge.exposeInMainWorld('windowControls', {
  minimizeApp:  () => ipcRenderer.send('minimize'),
  maximizeApp:  () => ipcRenderer.send('maximize'),
  terminateApp: () => ipcRenderer.send('terminate'),
});

contextBridge.exposeInMainWorld('launcher', {
  importDevTools: () => ipcRenderer.send('importDevTools'),
});



const setIframesDevToolsTags = (iframe, dtConfig) => {

  /* Converts special development tools tags to related data
     from Development Tool's `dt_config.json` file.

     For example, <dt-title></dt-title> is replaced with `title`
  */

  let iframeDoc = iframe.contentDocument;

  if (!dtConfig || !iframeDoc) {
    console.error('Failed to replace Development Tool\'s tags due to missing property `dtConfig`.');
    return false;
  }

  const removeFileSignature = (elm, dtConfigObj) => {

    let str = dtConfigObj;

    // Return dtConfigObj value if object does not contain "." character
    // and node element (elm) does not contain attribute "only-name".
    if (!/./g.test(str) || !elm.hasAttribute('only-name')) return elm.innerText = dtConfigObj;

    // Keep removing characters from dtConfig object,
    // linerally from righ-to-left, until the first dott is removed.
    for (let i = str.length - 1; i > -1; i--) {
      
      let char = str[i]; 
          str  = str.substr(0, i);

      if (char == '.') return elm.innerText = str;
    }
  }

  Array.from(iframeDoc.getElementsByTagName('dt-title'))
  .map(elm => elm.innerText = dtConfig.title);

  Array.from(iframeDoc.getElementsByTagName('dt-author'))
  .map(elm => elm.innerText = dtConfig.author);

  Array.from(iframeDoc.getElementsByTagName('dt-version'))
  .map(elm => elm.innerText = dtConfig.version);

  Array.from(iframeDoc.getElementsByTagName('dt-icon'))
  .map(elm => removeFileSignature(elm, dtConfig.icon));

  Array.from(iframeDoc.getElementsByTagName('dt-index'))
  .map(elm => removeFileSignature(elm, dtConfig.index));

  Array.from(iframeDoc.getElementsByTagName('dt-body-page'))
  .map(elm => removeFileSignature(elm, dtConfig.body_page));

  Array.from(iframeDoc.getElementsByTagName('dt-footer-page'))
  .map(elm => removeFileSignature(elm, dtConfig.footer_page));

  Array.from(iframeDoc.getElementsByTagName('dt-fail'))
  .map(elm => elm.style.display = 'none');

  Array.from(iframeDoc.getElementsByTagName('dt-success'))
  .map(elm => elm.style.display = 'block');

  return true;
}



ipcRenderer.on('importDevTool', (event, args) => {

  // Create development tool component
  let devTool = document.createElement('div');
      devTool.classList.add('devTool');
      devTool.setAttribute('key', args.dtConfig.title);


  // Create development tool's onClick event
  let ifrBody   = document.querySelector('main-display #iframeBody');
  let ifrFooter = document.querySelector('main-display #iframeFooter');

  const updateMainDisplayIframes = () =>
  {
    // Change iframe's source to development tool's iframes,
    // and update the special tags from those iframe's.

    ifrBody.setAttribute('src', args.__devTool + '/' + args.dtConfig.body_page);
    ifrFooter.setAttribute('src', args.__devTool + '/' + args.dtConfig.footer_page);

    const updateIframeBodyTags   = () => setIframesDevToolsTags(ifrBody, args.dtConfig);
    const updateIframeFooterTags = () => setIframesDevToolsTags(ifrFooter, args.dtConfig);
  
    ifrBody.addEventListener('load', () => {
      setIframesDevToolsTags(ifrBody, args.dtConfig);
    }, { once: true });

    ifrFooter.addEventListener('load', () => {
      setIframesDevToolsTags(ifrFooter, args.dtConfig);
    }, { once: true });
  }

  devTool.removeEventListener('click', updateMainDisplayIframes);
  devTool.addEventListener('click',    updateMainDisplayIframes);



  // Create development tool's icon
  let img = document.createElement('img');
      img.classList.add('icon');
      img.setAttribute('draggable', false);
      img.setAttribute('src', args.__devTool + '/' + args.dtConfig.icon);
      img.setAttribute('alt', args.dtConfig.icon);

  // Create development tool's title
  p = document.createElement('p');
  p.classList.add('title');
  p.innerHTML = args.dtConfig.title;


  // Import ready development tool component
  devTool.appendChild(img);
  devTool.appendChild(p);
  document.querySelector('navigation-bar .developmentTools').appendChild(devTool);
  console.log(`imported development tool '${args.dtConfig.title}'`, args)
});