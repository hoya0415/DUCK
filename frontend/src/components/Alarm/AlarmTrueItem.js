import * as React from 'react';
import './AlarmItem.css';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar } from '@mui/material';
import ProfileAvatar from '../ProfileAvatar';

const AlarmTrueItem = ({ item }) => {
  const navigate = useNavigate();

  const handleAlarmProfile = () => {
    navigate(`/profile/${item.senderId}`);
  };

  const handleAlarmFeed = () => {
    navigate(`/feed/detail/${item.feedId}`);
  };

  const feedUploadDate = timeForToday(item.alertDate);

  function timeForToday(value) {
    const today = new Date();
    const timeValue = new Date(value);

    const betweenTime = Math.floor(
      (today.getTime() - timeValue.getTime()) / 1000 / 60
    );
    if (betweenTime < 1) return '방금전';
    if (betweenTime < 60) {
      return `${betweenTime}분전`;
    }

    const betweenTimeHour = Math.floor(betweenTime / 60);
    if (betweenTimeHour < 24) {
      return `${betweenTimeHour}시간전`;
    }

    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    if (betweenTimeDay < 365) {
      return `${betweenTimeDay}일전`;
    }

    return `${Math.floor(betweenTimeDay / 365)}년전`;
  }

  const alarmContent = {
    follow: '회원님을 팔로우했습니다.',
    feedLike: '회원님의 게시물을 좋아합니다.',
    comment: '회원님의 게시물에 댓글을 달았습니다.',
    commentLike: '회원님의 댓글을 좋아합니다.',
  };

  return (
    <div id='alarm-card'>
      <div id='alarm-content' >
        <div onClick={handleAlarmProfile} >
          <ProfileAvatar
            w='30'
            h='30'
            imgUrl={item.profileUrl}
          />
        </div>
        <div id='alarm-content-text'>
          <span onClick={handleAlarmProfile}>
            <span className='alarm-nickname'>{item.senderNickname}</span>님이{' '}
          </span>
          <span onClick={item.type === 'follow' ? handleAlarmProfile : handleAlarmFeed}>
            {alarmContent[item.type]}
          </span>
        </div>
      </div>
      <Card
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignContent: 'center',
          my: 3,
          height: 80,
          width: "100%",
          borderRadius: 7,
          borderLeft: 16,
        }}
        onClick={item.type === 'follow' ? handleAlarmProfile : handleAlarmFeed}
        className={'alarm-card-' + item.type}
      >
        <div id="alarm-time">
        {feedUploadDate}
        </div>
      </Card>
    </div>
  );
};

export default AlarmTrueItem;
