import React from 'react';
import './App.css';
import TitleBar from './components/TitleBar';
import NavigationBar from './components/NavigationBar';
import Body from './components/Body';


function App() {
  return (
    <div className="App">
      <TitleBar />
      <NavigationBar />
      <Body />
    </div>
  )
}

export default App