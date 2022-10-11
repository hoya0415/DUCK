import axios from 'axios';
import { Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState } from 'react';
import { getFollowerList, getFollowingList } from '../../_action/follow_action';
import { getUserProfile } from '../../_action/user_action';
import { useParams } from 'react-router-dom';

const Follow = ({ paramsId, toUser, isFollow }) => {
  const dispatch = useDispatch();
  const params = useParams();

  const [followBtn, setFollowBtn] = useState();
  const luUserId = useSelector((state) => state.user.luUserId);
  const luNickname = useSelector((state) => state.user.luNickname);
  const luAccessToken = useSelector((state) => state.user.luAccessToken);

  const handleFollow = () => {
    axios({
      method: 'post',
      url: 'http://3.35.207.243:9999/duck/follow',
      data: {
        fromUserId: luUserId,
        toUserId: toUser,
        userNickname: luNickname,
      },
      headers: {
        accessToken: luAccessToken,
      },
    })
      .then((res) => {
        setFollowBtn(2);
        dispatch(getFollowerList(luUserId, paramsId));
        dispatch(getFollowingList(luUserId, paramsId));
        dispatch(getUserProfile(luUserId, params.userId));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUnfollow = () => {
    axios({
      method: 'delete',
      url: `http://3.35.207.243:9999/duck/follow/follower/${luUserId}&&${toUser}`,
      headers: {
        accessToken: luAccessToken,
      },
    })
      .then((res) => {
        setFollowBtn(1);
        dispatch(getFollowerList(luUserId, paramsId));
        dispatch(getFollowingList(luUserId, paramsId));
        dispatch(getUserProfile(luUserId, params.userId));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {followBtn === undefined ? (
        <div>
          {isFollow ? (
            <div onClick={handleUnfollow}>
              <Button>
                <div className='uflw-btn fllow-btn'>언팔로우</div>
              </Button>
            </div>
          ) : (
            <div onClick={handleFollow}>
              <Button>
                <div className='flw-btn fllow-btn'>팔로우</div>
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div>
          {followBtn === 2 ? (
            <div onClick={handleUnfollow}>
              <Button>
                <div className='uflw-btn fllow-btn'>언팔로우</div>
              </Button>
            </div>
          ) : (
            <div onClick={handleFollow}>
              <Button>
                <div className='flw-btn fllow-btn'>팔로우</div>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Follow;
