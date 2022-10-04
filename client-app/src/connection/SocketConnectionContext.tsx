import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { ISocketMessage } from "./socketMessage.interface";

type MessageCallback = (message: ISocketMessage) => void;

export interface ISocketConnection {
  isConnected: boolean;
  currentGame?: string;
  createNewGame: (username: string) => void,
  joinGame: (username: string, gameId: string) => void
  sendMessage: (message: string) => void,
  subscribeToMessages: (callback: MessageCallback) => void
  unsubscribeToMessages: (callback: MessageCallback) => void
}

/**
 * Empty implementation of the socket connection
 */
export const nullSocketConnection: ISocketConnection = {
  isConnected: false,
  createNewGame: () => { throw new Error("No socket context"); },
  joinGame: () => { throw new Error("No socket context"); },
  sendMessage: () => { throw new Error("No socket context"); },
  subscribeToMessages: () => { throw new Error("No socket context"); },
  unsubscribeToMessages: () => { throw new Error("No socket context"); }
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

  // const [messageListeners, setMessageListeners] = useState<Set<MessageCallback>>(() => new Set());
  const messageListenersRef = useRef<MessageCallback[]>([]);
  const subscribeToMessages = useCallback((callback: MessageCallback) => {
    if (!messageListenersRef.current.includes(callback)) {
      messageListenersRef.current.push(callback);
    }
  }, []);

  const unsubscribeToMessages = useCallback((callback: MessageCallback) => {
    messageListenersRef.current = messageListenersRef.current.filter(c => c !== callback);
  }, []);

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
    };
    socket.on('connect', handleConnect);

    const handleDisconnect = () => {
      setIsConnected(false);
    };
    socket.on("disconnect", handleDisconnect);

    const handleMessage = (message: ISocketMessage) => {
      console.log(message);
      messageListenersRef.current.forEach(messageListener => {
        messageListener(message);
      });
    }
    socket.on("message", handleMessage);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("message", handleMessage)
    };
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

  const sendMessage = useCallback((message: string) => {
    socket.emit("message", message);
  }, [socket]);

  return (
    <SocketConnectionContext.Provider value={{
      isConnected,
      currentGame,
      createNewGame,
      joinGame,
      sendMessage,
      subscribeToMessages,
      unsubscribeToMessages
    }}>
      {props.children}
    </SocketConnectionContext.Provider>
  );
}

function serverUrl(): string {
  return process.env.REACT_APP_SOCKET_API_ENDPOINT || "default";
}
