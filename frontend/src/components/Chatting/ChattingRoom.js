import React, { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import { Avatar, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowBack, MoreVert } from '@mui/icons-material';
import ProfileAvatar from '../ProfileAvatar';
import Chat from './Chat';
import './ChattingRoom.css';
import ChattingVideo from './ChattingVideo';
import { Accordion } from 'react-bootstrap';
import Timer from './Timer';
import axios from 'axios';

const ChattingRoom = () => {

  const scrollToBottom = () => {
    document.getElementById('srollToBottom').scrollIntoView(false);
  };

  const navigate = useNavigate();
  const params = useParams();
  const socketRef = useRef();
  const roomId = params.chatId;
  const [chatInput, setChatInput] = useState('');
  const [chat, setChat] = useState([]);
  const loggedUserId = useSelector((state) => state.user.luUserId);
  const loggedUserNickname = useSelector((state) => state.user.luNickname);
  const loggedUserProfileImg = useSelector((state) => state.user.luImg);
  const [numOfPeople, setNumOfPeople] = useState(false)

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (numOfPeople !== false) {
      socketRef.current.on('numOfPeople', (res) => setNumOfPeople(res))
    }
  }, [numOfPeople])

  useEffect(() => {
    socketRef.current = io.connect('http://3.35.207.243:4000');
    socketRef.current.emit('joinRoom', roomId);
    setNumOfPeople(true);
  }, []);

  useEffect(() => {
    socketRef.current.on('broadcast', (res) => {
      setChat(chat.concat(res));
      console.log(res)
      scrollToBottom();
    });
  }, [chat]);
 
  const { chatList } = useSelector((state) => ({
    chatList: state.chat.chatList,
  }));

  const room = chatList.filter(
    (room) => room.chatId === Number(params.chatId)
  )[0];
  
  const inputChange = (event) => {
    setChatInput(event.target.value);
  };

  const sendMsg = (event) => {
    let time = new Date();
    if (
      (event.type === 'keypress' && event.code === 'Enter') ||
      event.type === 'click'
    ) {
      const data = {
        createDate: time,
        userId: loggedUserId,
        nickname: loggedUserNickname,
        profileImg: loggedUserProfileImg,
        roomId: roomId,
        contents: chatInput,
      };
      socketRef.current.emit('sendChat', data);
      setChatInput('');
    }
  };

  const leaveRoom = () => {
    socketRef.current.emit('leaveRoom', roomId);
  };

  const handleDelChat = () => {
    axios({
      method: 'delete',
      url: `http://3.35.207.243:9999/duck/chat/delete/${parseInt(params.chatId)}`
    })
      .then((res) => {
        navigate(`/chat`)
        console.log(res)
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const moveToProfile = () => {
    navigate(`/profile/${room.userId}`);
  };

  return (
    <div style={{ marginBottom: '100px' }}>
      <div className='chat-info-fix'>
        <div className='chat-top-bar-fld'>
          <Button
            className='chat-top-bar-back col-4'
            variant='link'
            onClick={() => {
              navigate(-1);
            }}
          >
            <div onClick={leaveRoom}>
              <ArrowBack fontSize='small' className='arrowBtn' />
            </div>
          </Button>
          <span className='chat-top-bar-time col-4'>
            {roomId && <Timer chatId={Number(roomId)} />}
          </span>
          <div className='chat-top-bar-participant col-4'>
            <img className='groupimg' src='https://cdn.discordapp.com/attachments/866848960025985117/943889132571197480/-_-001.png'/>
            <span className='cntPeople'> x {numOfPeople}</span>
          </div>

        {room.userId === loggedUserId ? 
          <div>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
          <MoreVert color="action" fontSize="large"/>
          </IconButton>
          <Menu
            id="long-menu"
            MenuListProps={{
              'aria-labelledby': 'long-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                width: '7ch',
              },
            }}
          >
            <MenuItem  onClick={handleDelChat}>삭제</MenuItem>
          </Menu>
        </div>:null}
        </div>
        <div className='youtube-box'>
          <ChattingVideo className='youtube' url={room.videoUrl} />
        </div>
        {/* 채팅 정보 */}
        <div className='chat-room-info'>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey='0'>
              <Accordion.Header>{room.chatTitle}</Accordion.Header>
              <Accordion.Body>
                {room.chatContents}
                <div className='chat-room-writer-fld' onClick={moveToProfile}>
                  <ProfileAvatar w={40} h={40} imgUrl={room.profileUrl} />
                  <div className='chat-room-writer-nickname'>{room.userNickname}</div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
        <hr style={{ margin: '0px 40px', textAlign: 'center' }}></hr>
      </div>
      {/* 채팅 보드 */}
      <div className='chat-board'>
        <div>
          {chat.map((ele, idx) => (
            <Chat chatInfo={ele} key={idx} />
          ))}
        </div>
        <div id="srollToBottom" style={{height:'10px'}}></div>
      </div>
      {/* 채팅 입력창 */}
      <Box className='chatting-input-container'>
        <div className='chatting-comment-container'>
          <ProfileAvatar w={50} h={50} imgUrl={loggedUserProfileImg} />
          <input
            onChange={inputChange}
            value={chatInput}
            onKeyPress={sendMsg}
            className='chatting-input-box'
            placeholder='댓글을 달아주세요...'
          ></input>
          <button className='chatting-submit-btn' onClick={sendMsg}>
            게시
          </button>
        </div>
      </Box>
      <div style={{ height: '100px' }}></div>
    </div>
  );
};

export default ChattingRoom;
