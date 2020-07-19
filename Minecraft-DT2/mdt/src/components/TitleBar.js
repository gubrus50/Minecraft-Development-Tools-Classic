import React from 'react';
import '../css/TitleBar.css';

let remote = window.require('electron').remote;
let packJson = require('../../package.json');
let version = packJson['version'];


const Titlebar = () => {

  function minimizeApp() {
    remote.BrowserWindow.getFocusedWindow().minimize();
  }
  function maximizeApp() {
    let window = remote.BrowserWindow.getFocusedWindow();
    window.isMaximized() ? window.unmaximize() : window.maximize();
  }
  function terminateApp() {
    remote.getCurrentWindow().close();
  }

  return (
    <div className="TitleBar">
      <div className="windowTitle draggable">
        <button id="return"><i></i></button>
        <span>Minecraft-DT2 - <code>{version}</code></span>
      </div>
      <div className="windowControls preventSelect">
      	<button id="minimize" onClick={minimizeApp}><i></i></button>
      	<button id="maximize" onClick={maximizeApp}><i></i></button>
      	<button id="terminate" onClick={terminateApp}><i></i></button>
      </div>
      <script src="scripts/titlebar.js"></script>
    </div>
  )
}

export default Titlebar;