import { createContext, useCallback, useContext, useState } from "react";
import { isUsernameValid } from "./userInfoUtils";

interface IUserInfo {
  username?: string;
  setUsername: (value: string) => void;
}

const nullUserInfo: IUserInfo = {
  username: undefined,
  setUsername: () => { throw new Error("No user info context"); }
}

export const UserInfoContext = createContext(nullUserInfo);

export function UserInfoContextProvider(props: React.PropsWithChildren) {
  const [usernameValue, setUsernameValue] = useState<string | undefined>(undefined);

  const setUsername = useCallback((value: string) => {
    if (!isUsernameValid(value)) {
      throw new Error("Username invalid");
    }
    setUsernameValue(value);
  }, []);

  return (
    <UserInfoContext.Provider value={{
      username: usernameValue,
      setUsername
    }}>
      {props.children}
    </UserInfoContext.Provider>
  );
}

export function useUserInfo() {
  return useContext(UserInfoContext);
}
