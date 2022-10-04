import { BrowserRouter, Route, Routes as RouterRoutes } from 'react-router-dom';
import { About } from './About';
import { FourOhFour } from './FourOhFour';
import { Game } from './Game';
import { GameSetup } from './GameSetup';
import { useUserInfo } from '../userInfo/UserInfoContext';
import { UserInfoForm } from '../userInfo/UserInfoForm';

export function Routes() {
  const { username } = useUserInfo();

  if (!username) {
    return (
      <UserInfoForm />
    );
  }

  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route index element={<GameSetup/>}/>
        <Route path="about" element={<About />}/>
        <Route path=":gameId" element={<Game/>}/>
        <Route path="*" element={<FourOhFour/>}/>
      </RouterRoutes>
    </BrowserRouter>
  );
}
