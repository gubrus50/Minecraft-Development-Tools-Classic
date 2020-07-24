import React from 'react';
import '../css/TitleBar.css';
import playSound from './Sounds';

let remote = window.require('electron').remote;
let packJson = require('../../package.json');
let version = packJson['version'];


const Titlebar = () => {

  function minimizeApp() {
    playSound('btn-press');
    remote.BrowserWindow.getFocusedWindow().minimize();
  }

  function maximizeApp() {
    playSound('btn-press');
    let window = remote.BrowserWindow.getFocusedWindow();
    window.isMaximized() ? window.unmaximize() : window.maximize();
  }

  function terminateApp() {
    playSound('btn-press');
    setTimeout(() => {
      remote.getCurrentWindow().close();
    }, 1000);
  }

  return (
    <div className="TitleBar">
      <button id="return" onClick={() => playSound('btn-press')}><i></i></button>
      <div className="windowTitle draggable">
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