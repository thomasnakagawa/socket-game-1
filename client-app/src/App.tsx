import React from 'react';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
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
          <Route path=":gameId" element={<Game/>}/>
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

function Game() {
  const { gameId } = useParams();
  return (
    <h1>Game: {gameId}</h1>
  );
}

function FourOhFour() {
  return (
    <h1>404</h1>
  );
}

export default App;
