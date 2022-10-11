import { InsertEmoticonTwoTone } from '@mui/icons-material';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import ProfileAvatar from '../ProfileAvatar';
const Chat = ({ chatInfo }) => {
  const ref = useRef();
  const { luUserId } = useSelector((state) => ({
    luUserId: state.user.luUserId,
  }));
  const isMe = luUserId === chatInfo.userId;

  return (
    <>
      <div className='chat-board-container'>
        {isMe ? (
          <div style={{ textAlign: 'end' }}>
            <div className='chat-board-message chat-board-me'>
              <div className='chat-board-message-writer'>
                {chatInfo.nickname}
              </div>
              <div className='chat-board-message-contents'>
                {chatInfo.contents}
              </div>
            </div>
          </div>
        ) : (
          <div className='chat-board-message-container'>
            <div className='chat-board-avatar'>
              <ProfileAvatar w={40} h={40} imgUrl={chatInfo.profileImg} />
            </div>
            <div className='chat-board-message chat-board-other'>
              <div className='chat-board-message-writer'>
                {chatInfo.nickname}
              </div>
              <div className='chat-board-message-contents'>
                {chatInfo.contents}
              </div>
            </div>
          </div>
        )}
        {/* <div ref={el =>{messageEnd = el; }} /> */}
      </div>
    </>
  );
};

export default Chat;
