import React from 'react';
import { useSelector } from 'react-redux';
import Follow from './Follow';
import { useNavigate, useParams } from 'react-router-dom';
import ProfileAvatar from '../ProfileAvatar';

const FollowerList = ({ item }) => {
  const navigate = useNavigate();
  const params = useParams();
  const luUserId = useSelector((state) => state.user.luUserId);
  const handleGoProfile = () => {
    navigate(`/profile/${item.userId}`);
  };

  return (
    <div id='follow-list-container'>
      <div id='follow-list-img-nickname' className='col-7' onClick={handleGoProfile}>
        <ProfileAvatar w={40} h={40} imgUrl={item.profileUrl} />
        <div style={{marginLeft:'15px', paddingTop:'5px'}}>{item.nickname}</div>
      </div>

      {luUserId !== item.userId ? (
        <Follow
          paramsId={params.userId}
          toUser={item.userId}
          isFollow={item.followed}
        />
      ) : (
        <div id='follow-list-loguser'></div>
      )}
    </div>
  );
};

export default FollowerList;
