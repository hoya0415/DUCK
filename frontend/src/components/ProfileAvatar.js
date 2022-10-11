import React from 'react';
import './ProfileAvatar.css';
import 기본프로필 from '../assets/기본프로필.png';
import { Avatar } from '@mui/material';

const ProfileAvatar = ({ w=25, h=25, imgUrl }) => {
  return (
    <Avatar
      className='profile-img'
      alt='기본프로필'
      src={imgUrl === 0 ? 기본프로필 : imgUrl}
      sx={{ width: w, height: h }}
    />
  );
};

export default ProfileAvatar;
