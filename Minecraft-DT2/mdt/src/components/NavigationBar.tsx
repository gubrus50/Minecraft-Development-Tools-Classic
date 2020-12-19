import React from 'react';
import './styles/NavigationBar.css';
import playSound from './Sounds';


const btnToolsFolder = () => {
  playSound('btn-press');
}

const btnMoreTools = () => {
  playSound('btn-press');
}

const btnAbout = () => {
  playSound('btn-press');
}


const NavigationBar = () => {
  return (
    <div className="NavigationBar">
      <div className="developmentTools">
        <p>MyToolName1</p>
        <p>MyToolName2</p>
        <p>MyToolName3</p>
        <p>MyToolName4</p>
        <p>MyToolName5</p>
        <p>MyToolName6</p>
        <p>MyToolName7</p>
        <p>MyToolName8</p>
        <p>MyToolName9</p>
        <p>MyToolName10</p>
        <p>MyToolName11</p>
        <p>MyToolName12</p>
        <p>MyToolName13</p>
        <p>MyToolName14</p>
        <p>MyToolName15</p>
        <p>MyToolName16</p>
        <p>MyToolName17</p>
        <p>MyToolName18</p>
        <p>MyToolName19</p>
        <p>MyToolName20</p>
        <p>MyToolName21</p>
        <p>MyToolName22</p>
        <p>MyToolName23</p>
        <p>MyToolName24</p>
      </div>
      <div className="menu">
        <button className="btnToolsFolder" onClick={btnToolsFolder} title="Open tools folder">
          <img src="images/iconmonstr-wrench-23.svg" draggable="false" alt="tools folder icon" />
        </button>
        <button className="btnMoreTools" onClick={btnMoreTools} title="Get more tools">
          <img src="images/iconmonstr-folder-5.svg" draggable="false" alt="tools folder icon" />
        </button>
        <button className="btnAbout" onClick={btnAbout} title="About Minecraft-DT2">
          <img src="images/iconmonstr-newspaper-13.svg" draggable="false" alt="tools folder icon" />
        </button>
      </div>
    </div>
  )
}

export default NavigationBar;