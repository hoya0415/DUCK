import './TrendProfileResult.css';
import axios from 'axios';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProfileAvatar from '../ProfileAvatar';
import Follow from '../Profile/Follow';

const TrendProfileResult = ({ profile }) => {
  const navigate = useNavigate();
  const profileUserId = profile.userId;
  const loggedUserId = useSelector((state) => state.user.luUserId);
  const loggedUserNickname = useSelector((state) => state.user.luNickname);
  const accessToken = useSelector((state) => state.user.luAccessToken);
  const URL = 'http://3.35.207.243:9999/duck';

  const [isFollowed, setIsFollowed] = useState(profile.followed);

  const moveToProfile = () => {
    navigate(`/profile/${profileUserId}`);
  };

  const toggleFollowBtn = () => {
    if (isFollowed) {
      setIsFollowed(false);
      axios({
        url: `${URL}/follow/follower/${loggedUserId}&&${profileUserId}`,
        method: 'delete',
        headers: {
          accessToken: accessToken,
        },
      }).then((res) => {
        if (res.status !== 202) {
          console.log(`err code: ${res.status}`);
        }
      });
    } else {
      setIsFollowed(true);
      axios({
        url: `${URL}/follow`,
        method: 'post',
        data: {
          fromUserId: loggedUserId,
          toUserId: profileUserId,
          userNickname: loggedUserId,
        },
        headers: {
          accessToken: accessToken,
        },
      }).then((res) => {
        if (res.status !== 202) {
          console.log(`err code: ${res.status}`);
        }
      });
    }
  };

  return (
    <div className='trend-profile-result-followBtn-container'>
      <div className='trend-profile-result-container' onClick={moveToProfile}>
      
        <div style={{ marginRight: '20px' }}>
          <ProfileAvatar
            className='trend-profile-result-profileImg'
            w={70}
            h={70}
            imgUrl={profile.profileUrl}
          />
        </div>

        <div className='trend-profile-nickname-bio-container'>
          <div style={{ fontSize: '17px' }}>{profile.nickname}</div>
          <div className='trend-profile-result-bio'>
            {profile.bio === undefined ? <div></div> : profile.bio}
          </div>
        </div>
      </div>
      {loggedUserId != profileUserId ?
        <Follow paramsId={loggedUserId} toUser={profileUserId} isFollow={isFollowed} />
        :
        null} </div>
  );
};

export default TrendProfileResult;
