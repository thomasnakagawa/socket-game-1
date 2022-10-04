import React from 'react';
import './App.css';
import { useSocketConnection } from './connection/SocketConnectionContext';
import { Routes } from './pages/Routes';

export default function App() {
  const { isConnected } = useSocketConnection();

  return (
    <div className="App">
      <p>{ isConnected ? "Connected to server" : "Disconnected from server" }</p>
      <Routes />
    </div>
  );
}
