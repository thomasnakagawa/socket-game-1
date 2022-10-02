import { useCallback } from "react";
import { useSocketConnection } from "./connection/SocketConnectionContext";

/**
 * UI for setting up a new game
 * @returns 
 */
export function GameSetup() {
  const { createNewGame } = useSocketConnection();

  const onCreateNewGameButtonClicked = useCallback(() => {

  }, []);

  return (
    <div>
      <input></input>
      <button onClick={onCreateNewGameButtonClicked}>Create game</button>
    </div>
  );
}
