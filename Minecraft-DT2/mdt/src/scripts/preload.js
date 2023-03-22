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



const capitalize = (string) => {

  // Capitalize string objects
  // E.g. "McRaZick is the best" -> "Mcrazick Is The Best" :)

  return string
  .split(' ')
  .map(word => word[0].toUpperCase() + word.substring(1).toLowerCase())
  .join(' ');

}


const removeFootersMenu = async () => {

  let parser = new DOMParser();

  // Get and remove buttons
  let buttons = [...document.querySelectorAll('footer > div')].splice(1);
  buttons.map(btn => btn.remove());

} 



const importDevToolsMenu = async (dtMenuData) => {

  let parser = new DOMParser();
  let childrenArray = parser.parseFromString(dtMenuData, 'text/html').querySelector('body').childNodes;
  let frag = document.createDocumentFragment();
  
  childrenArray.forEach(item => {
    item.classList.add('devToolsMenuBtn');
    frag.appendChild(item);
  });

  document.querySelector('footer').append(frag);
}



const displayNavigationBar = (boolean = true) => {

  // Validate parameter boolean
  if (boolean != true && boolean != false) return;

  let navBar = document.querySelector('navigation-bar');
  
  (boolean == true)
  ? navBar.style.removeProperty('display')
  : navBar.style.setProperty('display', 'none');

}


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

  [...iframeDoc.getElementsByTagName('dt-title')]
  .map(elm => elm.innerText = dtConfig.title);

  [...iframeDoc.getElementsByTagName('dt-author')]
  .map(elm => elm.innerText = dtConfig.author);

  [...iframeDoc.getElementsByTagName('dt-version')]
  .map(elm => elm.innerText = dtConfig.version);

  [...iframeDoc.getElementsByTagName('dt-icon')]
  .map(elm => removeFileSignature(elm, dtConfig.icon));

  [...iframeDoc.getElementsByTagName('dt-index')]
  .map(elm => removeFileSignature(elm, dtConfig.index));

  [...iframeDoc.getElementsByTagName('dt-body-page')]
  .map(elm => removeFileSignature(elm, dtConfig.body_page));

  [...iframeDoc.getElementsByTagName('dt-footer-page')]
  .map(elm => removeFileSignature(elm, dtConfig.footer_page));

  [...iframeDoc.getElementsByTagName('dt-fail')]
  .map(elm => elm.style.display = 'none');

  [...iframeDoc.getElementsByTagName('dt-success')]
  .map(elm => elm.style.display = 'block');

  return true;
}



const launchDevTool = async (args) => {

  // Display Development Tool
  let ifrBody   = document.querySelector('main-display #iframeBody');
  let ifrFooter = document.querySelector('main-display #iframeFooter');

  let btnReturn = document.querySelector('#return');
  let winTitle  = document.querySelector('.windowTitle > span');
      winTitle.innerHTML = `Minecraft-DT2 - ${capitalize(args.dtConfig.title)}`;

  // Attribute 'data-isDevTool' is used to prevent iframeBody's onLoad event
  // from appending the default <link mdt-styleheet/> in iframeBody's <head>
  ifrBody.setAttribute('data-isDevTool', true);
  ifrBody.setAttribute('src', args.__devTool + '/' + args.dtConfig.index);


  // Hide navigation bar & footer's menu
  removeFootersMenu();
  displayNavigationBar(false);
  importDevToolsMenu(args.dtMenuData);




  // ---- YOU NEEEEEEEED TO SPLIT THIS IN TO A SEPARATE FUNCTION!!!!! ----- //
  // Return to Minecraft-DT2's main menu (exit Development Tool)

  btnReturn.addEventListener('click', () => {

    let ifrBodySrc = './iframe_body.html';
    let ifrFooterSrc = './iframe_footer.html';

    ifrBody.removeAttribute('data-isDevTool');
    ifrBody.setAttribute('src', ifrBodySrc);
    ifrFooter.setAttribute('src', ifrFooterSrc);

    winTitle.innerHTML = 'Minecraft-DT2';
    displayNavigationBar();
    removeFootersMenu();

    // Include original footer's buttons and hide <help-tag>
    importDevToolsMenu(args.appMenuData);
    document.querySelector('help-tag').classList.add('hide');

  }, { once: true });
  
  // ---- YOU NEEEEEEEED TO SPLIT THIS INTO A SEPARATE FUNCTION!!!!! ----- //
}



ipcRenderer.on('importDevTool', (event, args) => {

  // Create development tool component
  let devTool = document.createElement('div');
      devTool.classList.add('devTool');
      devTool.setAttribute('key', args.dtConfig.title);


  // Create development tool's onClick event
  let ifrBody = document.querySelector('main-display #iframeBody');
  let ifrFooter = document.querySelector('main-display #iframeFooter'); 

  const launchButtonEventFunction = () => { launchDevTool(args) };
  const updateFootersButtonLaunch = () =>
  {
    // Set launch button's onClick event so
    // that it can start Development Tool in <main-display>
    let buttonLaunch = document.querySelector('.buttonLaunch > button');
        buttonLaunch.removeEventListener('click', launchButtonEventFunction);
        buttonLaunch.addEventListener('click', launchButtonEventFunction, { once: true });
  }

  const updateMainDisplayIframes = () =>
  {
    // Change iframe's source to development tool's iframes,
    // and update the special tags from those iframe's.

    ifrBody.removeAttribute('data-isDevTool');
    ifrBody.setAttribute('src', args.__devTool + '/' + args.dtConfig.body_page);
    ifrFooter.setAttribute('src', args.__devTool + '/' + args.dtConfig.footer_page);

    ifrBody.addEventListener('load', () => {
      setIframesDevToolsTags(ifrBody, args.dtConfig);
    }, { once: true });

    ifrFooter.addEventListener('load', () => {
      setIframesDevToolsTags(ifrFooter, args.dtConfig);
    }, { once: true });
  }

  devTool.removeEventListener('click', updateMainDisplayIframes);
  devTool.addEventListener('click',    updateMainDisplayIframes);

  devTool.removeEventListener('click', updateFootersButtonLaunch);
  devTool.addEventListener('click',    updateFootersButtonLaunch);



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