import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocketConnection } from "../connection/SocketConnectionContext";
import { ISocketMessage } from "../connection/socketMessage.interface";
import { useUserInfo } from "../userInfo/UserInfoContext";

export function Game() {
  const { gameId } = useParams();
  const { joinGame, sendMessage, subscribeToMessages, unsubscribeToMessages } = useSocketConnection();
  const { username } = useUserInfo();

  useEffect(() => {
    if (username && gameId) {
      joinGame(username, gameId)
    }
  }, [gameId, joinGame, username]);
  

  const [messages, setMessages] = useState<ISocketMessage[]>([]);
  useEffect(() => {
    const handleMessage = (message: ISocketMessage) => {
      setMessages(prevMessages => [...prevMessages, message]);
    };

    subscribeToMessages(handleMessage);
    return () => {
      unsubscribeToMessages(handleMessage);
    };
  }, [subscribeToMessages, unsubscribeToMessages]);
  const [messageFieldValue, setMessageFieldValue] = useState("");

  const onMessageFieldChanged = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageFieldValue(e.target.value);
  }, []);

  const onMessageSubmitted = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(messageFieldValue);
    setMessageFieldValue("");
  }, [sendMessage, messageFieldValue]);

  return (
    <>
      <h1>Game ID: {gameId}</h1>
      <p>You: {username}</p>
      <form onSubmit={onMessageSubmitted}>
        <label htmlFor="game-message-input">Message:</label>
        <input id="game-message-input" onChange={onMessageFieldChanged} value={messageFieldValue}></input>
        <input type="submit"></input>
      </form>
      <ul>
        { messages?.map((message, index) => (
          <li key={index}>{message.username}: {message.message}</li>
        ))}
      </ul>
    </>
  );
}
