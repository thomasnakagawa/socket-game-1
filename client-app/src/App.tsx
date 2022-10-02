import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { useSocketConnection } from './connection/SocketConnectionContext';

function App() {
  const { isConnected, currentGame, createNewGame, joinGame } = useSocketConnection();

  return (
    <div className="App">
      <p>{ isConnected ? "Connected to server" : "Disconnected from server" }</p>
      <p>{ currentGame && `In game ${currentGame}`}</p>
      <BrowserRouter>
        <Routes>
          <Route index element={<CompA/>}/>
          <Route path="*" element={<FourOhFour/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function CompA() {
  return (
    <h1>hello</h1>
  );
}

function FourOhFour() {
  return (
    <h1>404</h1>
  );
}

export default App;
