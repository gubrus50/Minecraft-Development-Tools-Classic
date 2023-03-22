const {
  electron,
  app,
  BrowserWindow,
  ipcMain
}          = require('electron');
const url  = require('url');
const path = require('path');
const fs   = require('fs');
const { resolve } = require('path');
const { DefaultDeserializer } = require('v8');
const __devTools  = './development_tools';


let appWindow;
const createWindow = () => {

  appWindow = new BrowserWindow({
    width: 990,
    minWidth: 990,
    height: 520,
    minHeight: 520,
    frame: false,
    icon: __dirname + '/icon.ico',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, './src/scripts/preload.js'),
    },
  });

  appWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  appWindow.setMenuBarVisibility(false);
}



const isDevToolWithValidConfig = async (__devTool) => {

  let __dtConfig = __devTool + '/dt_config.json';

  // Get and validate "dt_config.json" file's content
  let data = await fs.promises.readFile(__dtConfig, 'utf8')
  const dtConfig = JSON.parse(data);

  if ( // If valid keys are present
        dtConfig.hasOwnProperty('title')
    && dtConfig.hasOwnProperty('icon')
    && dtConfig.hasOwnProperty('index')
    && dtConfig.hasOwnProperty('menu')
    && dtConfig.hasOwnProperty('body_page')
    && dtConfig.hasOwnProperty('footer_page')
    && dtConfig.hasOwnProperty('version')
    && dtConfig.hasOwnProperty('author')
  )
  { // Return false when data is empty or exceeds 50 characters
    for (let key in dtConfig)
    {
      let keyValue = dtConfig[key];
      if (
        keyValue === ''
        || keyValue === null
        || keyValue.length >= 50
      )
      { return false }
    }
  } else { return false }

  // Validate file format for
  // keys: icon, index, menu, body_page & footer_page
  if (
        !/.+?(\.png)/g.test(dtConfig.icon)
    || !/.+?(\.html)/g.test(dtConfig.index)
    || !/.+?(\.html)/g.test(dtConfig.menu)
    || !/.+?(\.html)/g.test(dtConfig.body_page)
    || !/.+?(\.html)/g.test(dtConfig.footer_page)
  )
  { return false }

  // Return false if necessary files do not exist
  // at specified directories:
  if (
    !fs.existsSync(__devTool + '/' + dtConfig.icon)
    || !fs.existsSync(__devTool + '/' + dtConfig.index)
    || !fs.existsSync(__devTool + '/' + dtConfig.menu)
    || !fs.existsSync(__devTool + '/' + dtConfig.body_page)
    || !fs.existsSync(__devTool + '/' + dtConfig.footer_page)
  )
  { return false }
  
  return true;
}



const importDevTools = async () => {

  // Read files from development_tools directory
  let files = await fs.promises.readdir(__devTools)
  files.map(async (file) =>
  {
    // Check If file is a directory
    let __devTool = __devTools + '/' + file;
    let stats     = fs.statSync(__devTool);

    if (!stats.isFile())
    {
      // Read files from development_tool's directory
      let files = await fs.promises.readdir(__devTool)
      files.map(async (file) =>
      {
        // If file from development_tool's direcotry has valid "dt_config.json"
        let __dtFile      = __devTool + '/' + file;
        let stats         = fs.statSync(__dtFile);
        let isConfigValid = await isDevToolWithValidConfig(__devTool);

        if (stats.isFile() && file === 'dt_config.json' && isConfigValid === true)
        {
          // Read development_tool's configuration
          let __dtConfig = __devTool + '/dt_config.json';
          let data       = await fs.promises.readFile(__dtConfig, 'utf8')
          let dtConfig   = await JSON.parse(data);

          let __dtMenu = __devTool + '/' + dtConfig.menu;
          console.log(__dtMenu);

          const dtMenuData  = await fs.promises.readFile(__dtMenu, 'utf8');
          const appMenuData = await fs.promises.readFile('./menu.html', 'utf8');

          // Build and append development tool component
          appWindow.webContents.send('importDevTool', {
            __devTool,
            dtConfig,
            dtMenuData,
            appMenuData,
          });
        }
      });
    }
  });

}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  createWindow();

  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  ipcMain.on('minimize', () => {
    BrowserWindow.getFocusedWindow().minimize();
  });

  ipcMain.on('maximize', () => {
    let window = BrowserWindow.getFocusedWindow();
    window.isMaximized() ? window.unmaximize() : window.maximize();
  });

  ipcMain.on('terminate', () => {
    appWindow.close();
  });

  ipcMain.on('importDevTools', importDevTools);

});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});