import React from 'react';
import { useSelector } from 'react-redux';
import './ChattingListItem.css';
import { Card } from 'react-bootstrap';
import ProfileAvatar from '../ProfileAvatar';
import { useNavigate } from 'react-router-dom';
import Timer from './Timer';


const ChattingItem = ({ item }) => {

  const navigate = useNavigate();
  const moveToChatroom = () => {
    navigate(`/chatting/chattingroom/${item.chatId}`);
  };

  const moveToProfile = () => {
    navigate(`/profile/${item.userId}`);
  };

  return (
    <>
      <div id='chat'>
        <Card className='chat-container'>
          <Card.Text as='div' className='chat-time'>
            <Timer chatId={item.chatId}/>
          </Card.Text>
          <Card.Img
            onClick={moveToChatroom}
            variant='top'
            src={item.thumbUrl}
            className='chat-img'
          />

          <Card.Body style={{ padding: '20px' }} className='chat-card-body'>
            <Card.Title className='chat-title' onClick={moveToChatroom}>
              : {item.chatTitle} :
            </Card.Title>

            <Card.Text
              as='div'
              variant='primary'
              className='chat-writer'
              onClick={moveToProfile}
            >
              <div className='col-2'>
                <ProfileAvatar w={40} h={40} imgUrl={item.profileUrl} />
              </div>
              <div className='chat-nickname col-6'>{item.userNickname}</div>
              <Card.Text as='div' className='col-4'>
              {/* <img className='groupimg' src='https://cdn.discordapp.com/attachments/866848960025985117/943889132571197480/-_-001.png'/>x 2,342 */}
              </Card.Text>
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default ChattingItem;
