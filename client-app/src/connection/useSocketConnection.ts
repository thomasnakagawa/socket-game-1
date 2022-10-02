import { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';

function serverUrl(): string {
  return process.env.REACT_APP_SOCKET_API_ENDPOINT || "default";
}

const socket = io(serverUrl()).connect();

export interface ISocketConnection {
  isConnected: boolean;
  currentGame?: string;
  createNewGame: (username: string) => void,
  joinGame: (username: string, gameId: string) => void
}

export function useSocketConnection(): ISocketConnection {
  const [isConnected, setIsConnected] = useState(false);
  const [currentGame, setCurrentGame] = useState<string | undefined>();

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });
  }, []);

  const createNewGame = useCallback((username: string) => {
    socket.emit("new-game", { username }, (result: { gameId: string}) => {
      setCurrentGame(result.gameId);
    });
  }, []);

  const joinGame = useCallback((username: string, gameId: string) => {
    socket.emit("join-game", { gameId, username }, (result: { gameId: string }) => {
      setCurrentGame(result.gameId);
    });
  }, []);

  return {
    isConnected,
    currentGame,
    createNewGame,
    joinGame
  }
}