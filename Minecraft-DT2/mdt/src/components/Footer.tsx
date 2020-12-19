import React from 'react';
import './styles/Footer.css';
import playSound from './Sounds';

const Footer = () => {

  window.onload = () => {
    let buttons = document.getElementsByClassName('button');

    for (let i=0; i < buttons.length; i++) {
      let button = buttons[i].getElementsByTagName('button')[0];
      button.setAttribute('data-before', button.innerText);
    }
  }

  return (
    <div className="Footer">
      <div>
        <iframe title="Tool launcher" className="toolLauncherDescription" scrolling="no">
          <p>You must enable iframe to inspect tools content.</p>
        </iframe>
      </div>
      <div>
        <div title="Launch selected tool" className="buttonLaunch button">
          <button onClick={() => playSound('btn-press')}>Run</button>
        </div>
      </div>
      <div>
        <div className="buttonDefault button">
          <button onClick={() => playSound('btn-press')}>Check for updates</button>
        </div>
        <div className="buttonDefault button">
          <button onClick={() => playSound('btn-press')}>Uninstall the tool</button>
        </div>
      </div>
    </div>
  )
}

export default Footer