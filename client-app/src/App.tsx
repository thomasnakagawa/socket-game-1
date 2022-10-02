import React from 'react';
import './App.css';
import { useSocketConnection } from './connection/useSocketConnection';


function App() {
  const { isConnected, currentGame, createNewGame, joinGame } = useSocketConnection();
  
  return (
    <div className="App">
      <p>{ isConnected ? "Connected to server" : "Disconnected from server" }</p>
      <p>{ currentGame && `In game ${currentGame}`}</p>
    </div>
  );
}

export default App;
