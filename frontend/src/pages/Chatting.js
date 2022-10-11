import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { Search, Add, Phone, Favorite, PersonPin } from '@mui/icons-material';
import { Fab, InputAdornment, Box, TextField, Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChattingListItem from '../components/Chatting/ChattingListItem';
import './Chatting.css';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getChatList } from '../_action/chat_action';

const Chatting = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [order, setOrder] = useState('chatId');
  const { luUserId, luAccessToken, chatList } = useSelector((state) => ({
    luUserId: state.user.luUserId,
    luAccessToken: state.user.luAccessToken,
    chatList: state.chat.chatList,
  }));

  const handleChanges = (event, newValue) => {
    setOrder(newValue)
  };

  useEffect(() => {
    dispatch(getChatList(luAccessToken))
  }, [dispatch]);

  const sortChattingList = chatList?.sort((a, b) => b[order] - a[order]);
  return (
    <div>
      <Tabs value={order} sx={{ m: 4 }} onChange={handleChanges} aria-label="icon tabs example">
        <Tab label="최신순" aria-label="phone" value="chatId" />
        <Tab label="이름순" aria-label="favorite" value="userId" />
      </Tabs>

      <div className='chat-main-container'>
        {sortChattingList?.map((item) => (
          <ChattingListItem key={item.chatId} item={item} />
        ))}
      </div>

      <div
        className='fab-add-container'
        onClick={() => navigate('/chatting/write')}
      >
        <Fab aria-label='Add' className='fab-add'>
          <Add />
        </Fab>
      </div>
    </div>
  );
};

export default Chatting;
