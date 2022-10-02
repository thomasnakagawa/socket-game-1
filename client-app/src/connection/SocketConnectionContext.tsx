import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export interface ISocketConnection {
  isConnected: boolean;
  currentGame?: string;
  createNewGame: (username: string) => void,
  joinGame: (username: string, gameId: string) => void
}

/**
 * Empty implementation of the socket connection
 */
export const nullSocketConnection: ISocketConnection = {
  isConnected: false,
  createNewGame: () => { throw new Error("No socket context"); },
  joinGame: () => { throw new Error("No socket context"); },
}

export const SocketConnectionContext = createContext(nullSocketConnection);
/**
 * Use this in components to get access to state and callbacks for the socket connection
 * @returns 
 */
 export function useSocketConnection() {
  return useContext(SocketConnectionContext);
}

/**
 * Use this to provide the socket connection context to a React tree
 * @param props 
 * @returns 
 */
export function SocketContextContextProvider(props: React.PropsWithChildren) {
  const [isConnected, setIsConnected] = useState(false);
  const [currentGame, setCurrentGame] = useState<string | undefined>();

  const [socket] = useState(() => {
    return io(serverUrl()).connect();
  });

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });
  }, [socket]);

  const createNewGame = useCallback((username: string) => {
    socket.emit("new-game", { username }, (result: { gameId: string}) => {
      setCurrentGame(result.gameId);
    });
  }, [socket]);

  const joinGame = useCallback((username: string, gameId: string) => {
    socket.emit("join-game", { gameId, username }, (result: { gameId: string }) => {
      setCurrentGame(result.gameId);
    });
  }, [socket]);

  return (
    <SocketConnectionContext.Provider value={{
      isConnected,
      currentGame,
      createNewGame,
      joinGame
    }}>
      {props.children}
    </SocketConnectionContext.Provider>
  );
}

function serverUrl(): string {
  return process.env.REACT_APP_SOCKET_API_ENDPOINT || "default";
}
