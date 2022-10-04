import { useCallback, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { isValidGameId } from "../connection/connectionUtils";
import { useSocketConnection } from "../connection/SocketConnectionContext";
import { useUserInfo } from "../userInfo/UserInfoContext";

/**
 * UI for setting up a new game
 * @returns 
 */
export function GameSetup() {
  const { username } = useUserInfo();
  const { currentGame, createNewGame } = useSocketConnection();
  const navigate = useNavigate();

  const [gameIdFieldValue, setGameIdFieldValue] = useState("");

  const onCreateNewGameButtonClicked = useCallback(() => {
    if (username) {
      createNewGame(username);
    }
  }, [createNewGame, username]);

  const onJoinGameFormSubmitted = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/${gameIdFieldValue}`);
  }, [gameIdFieldValue, navigate]);

  const onJoinGameIdFieldChanged = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setGameIdFieldValue(e.target.value);
  }, []);

  if (currentGame) {
    return (
      <Navigate to={`/${currentGame}`} replace/>
    );
  }

  return (
    <div>
      <h2>New game</h2>
      <button onClick={onCreateNewGameButtonClicked}>Create game</button>
      <h2>Join game</h2>
      <form onSubmit={onJoinGameFormSubmitted}>
        <input value={gameIdFieldValue} onChange={onJoinGameIdFieldChanged}></input>
        <input disabled={!isValidGameId(gameIdFieldValue)} type="submit"/>
      </form>
    </div>
  );
}
