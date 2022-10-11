import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.scss';
import { Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Feed from './pages/Feed';
import Welcome from './pages/Welcome';
import Profile from './pages/Profile';
import ChangePassword from './components/Setting/ChangePassword';
import ProfileUpdate from './components/Setting/ProfileUpdate';
import Trend from './pages/Trend';
import Chatting from './pages/Chatting';
import Alarm from './pages/Alarm';
import BottomNav from './components/Header/BottomNav';
import FeedDetail from './components/Feed/FeedDetail';
import FeedCreate from './components/Feed/FeedCreate';
import ProfileFeedListDetail from './components/Profile/ProfileFeedListDetail';
import ProfileFeedLikeListDetail from './components/Profile/ProfileFeedLikeListDetail';
import FeedUpdate from './components/Feed/FeedUpdate';
import ChattingCreate from './components/Chatting/ChattingCreate';
import ChattingRoom from './components/Chatting/ChattingRoom';
import CategorySearch from './components/Trend/TrendCategorySearch';

function App() {
  return (
      <Routes className='routes'>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/welcome' element={<Welcome />} />
        <Route element={<BottomNav />}>
          <Route path='/feed' element={<Feed />} />
          <Route path='/trend' element={<Trend />} />
          <Route path='/chat' element={<Chatting />} />
          <Route path='/alarm' element={<Alarm />} />
          <Route path='/profile/:userId' element={<Profile />} />
        </Route>
        <Route path='/changepassword/:userId' element={<ChangePassword />} />
        <Route path='/profileupdate/:userId' element={<ProfileUpdate />} />
        <Route path='/feed/detail/:feedId' element={<FeedDetail />} />
        <Route path='/feed/write' element={<FeedCreate />}/>
        <Route path='/feed/edit' element={<FeedUpdate />}/>
        <Route path='/feed/list/:userId' element={<ProfileFeedListDetail/>}/>
        <Route path='/feed/likelist/:userId' element={<ProfileFeedLikeListDetail/>}/>
        <Route path="/chatting/write" element={<ChattingCreate />} />
        <Route path='/chatting/chattingroom/:chatId' element={<ChattingRoom/>}/>
        <Route path='/trend/:category' element={<CategorySearch/>}/>
        <Route path='*' element={<NotFound />} />
      </Routes>
  );
}

export default App;
