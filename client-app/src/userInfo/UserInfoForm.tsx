import { useCallback, useState } from "react";
import { useUserInfo } from "./UserInfoContext";
import { isUsernameValid } from "./userInfoUtils";

export function UserInfoForm() {
  const {
    username: usernameState,
    setUsername: setUsernameState
  } = useUserInfo();
  const [usernameFieldValue, setUsernameFieldValue] = useState(usernameState || "");

  const onSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setUsernameState(usernameFieldValue);
  }, [setUsernameState, usernameFieldValue]);

  return (
    <form onSubmit={onSubmit}>
      <h2>Username:</h2>
      <input
        value={usernameFieldValue}
        onChange={e => {
          setUsernameFieldValue(e.target.value);
        }}
      ></input>
      <input disabled={!isUsernameValid(usernameFieldValue)} type="submit"></input>
    </form>
  );
}
