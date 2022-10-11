import React, { useState } from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import feed from '../../assets/feed.png';
import chat from '../../assets/chat.png';
import bell from '../../assets/bell.png';
import trend from '../../assets/trend.png';
import './BottomNav.css';
import 기본프로필 from '../../assets/기본프로필.png';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar } from '@mui/material';
import {
  useNavigate,
  Outlet,
  NavLink,
  Link,
  useRoutes,
  useLocation,
} from 'react-router-dom';
import { getUserProfile } from '../../_action/user_action';
import ProfileAvatar from '../ProfileAvatar';

const BottomNav = () => {
  const { loggedUserId, luImg } = useSelector((state) => ({
    loggedUserId: state.user.luUserId,
    luImg: state.user.luImg,
  }));

  const location = useLocation();
  const [value, setValue] = useState(location.pathname);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (event, newValue) => {
    if (newValue === '/profile') {
      setValue('');
      navigate(`/profile/${loggedUserId}`);
    } else {
      setValue(newValue);
      navigate(`${newValue}`);
    }
  };

  return (
    <>
      <Outlet />
      <div className='bottom-nav-container'>
        <BottomNavigation
          value={value}
          onChange={handleChange}
          className='bottom-nav'
        >
          <BottomNavigationAction
            label='Feed'
            value='/feed'
            icon={<img className='feedduck bottom-icon' src={feed} />}
          />
          <BottomNavigationAction
            label='Chatting'
            value='/chat'
            icon={<img className='chat bottom-icon' src={chat} />}
          />
          <BottomNavigationAction
            value='/profile'
            icon={
              <div className='pofile-img-fld-bott-nav'>
                <ProfileAvatar w={75} h={75} imgUrl={luImg} />
              </div>
            }
          />
          <BottomNavigationAction
            label='Alarm'
            value='/alarm'
            icon={<img className='bell bottom-icon' src={bell} />}
          />
         
          <BottomNavigationAction
            label='Trend'
            value='/trend'
            icon={<img className='trend bottom-icon' src={trend} />}
          />
        </BottomNavigation>
      </div>
    </>
  );
};

export default BottomNav;

// https://github.com/xotahal/react-native-material-ui/blob/master/docs/BottomNavigation.md
// https://stackoverflow.com/questions/45520890/cant-change-tabbar-labels-color
