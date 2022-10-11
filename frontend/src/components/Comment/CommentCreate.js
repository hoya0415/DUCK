import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import './CommentCreate.css';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { ArrowDropUp, ArrowDropDown, SendRounded, TryRounded } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import CommentListItem from './CommentListItem';
import ProfileAvatar from '../ProfileAvatar';

const CommentCreate = () => {
  const params = useParams();
  const { luImg, loggeduserId, nickname } = useSelector((state) => ({
    luImg: state.user.luImg,
    nickname: state.user.luNickname,
    loggeduserId: state.user.luUserId,
  }));
  const drawerBleeding = 65;
  const [open, setOpen] = React.useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [commentList, setCommentList] = useState(null);
  const FEED_URL = 'http://3.35.207.243:9999/duck/feed';
  const feedId = params.feedId;
  const accessToken = localStorage.getItem('jwt');
  // const commentEndRef = useRef();

  const scrollToBottom = () => {
    document.getElementById('srollToBottom').scrollIntoView(false);
  };

  const onCommentChange = (event) => {
    if (event.target.value.length > 42) {
      setCommentInput(event.target.value.substr(0, 42));
    } else {
      setCommentInput(event.target.value);
    }
  };

  const submitComment = (event) => {
    if (commentInput.length > 0) {
      const data = {
        feedId: parseInt(feedId),
        userId: loggeduserId,
        nickname: nickname,
        contents: commentInput,
      };
      if (
        (event.type === 'keypress' && event.code === 'Enter') ||
        event.type === 'click'
      ) {
        axios
          .post(`${FEED_URL}/comment/write`, data, {
            headers: {
              accessToken: accessToken,
            },
          })
          .then((res) => {
            if (res.status === 202) {
              setCommentInput('');
              pullCommentList();
            } else {
              console.log(`err: code ${res.status}`);
            }
          })
          .then(() => {
            scrollToBottom();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  const pullCommentList = () => {
    axios({
      method: 'get',
      url: `${FEED_URL}/comment/feedId=${feedId}&&userId=${loggeduserId}`,
    })
      .then((res) => {
        if (res.status === 202) {
          setCommentList(res.data.commentList);
        } else {
          console.log(`err: code ${res.status}`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const toggleDrawer = (newOpen) => () => {
    pullCommentList();
    setOpen(newOpen);
  };

  return (
    <div>
      <Box className='comment-create-box'>
        <Box sx={{ textAlign: 'center' }}>
          <ArrowDropUp fontSize='large' onClick={toggleDrawer(true)} />
        </Box>
        <div className='create-comment-container'>
          <ProfileAvatar w={50} h={50} imgUrl={luImg} />
          <input
            onClick={toggleDrawer(true)}
            onChange={onCommentChange}
            onKeyPress={submitComment}
            value={commentInput}
            className='create-comment-input'
            placeholder='댓글을 달아주세요...'
          ></input>
          {commentInput.trimEnd() && commentInput.trimStart() ? (
            <SendRounded
              fontSize='large'
              className='comment-submit-btn-active'
              onClick={submitComment}
            />
          ) : (
            <SendRounded
              fontSize='large'
              className='comment-submit-btn'
              onClick={submitComment}
            />
          )}
        </div>
      </Box>
      <Box className='css-baseline-box'></Box>
      <SwipeableDrawer
        anchor='bottom'
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Box
          sx={{
            height: '100%',
            overflow: 'auto',
          }}
          className='box-scroll-hide'
        >
          <Box>
            <Box sx={{ textAlign: 'center' }}>
              <ArrowDropDown fontSize='large' onClick={toggleDrawer(false)} />
            </Box>
            {commentList && commentList.length != 0 ? (
              <div>
                {commentList.map((ele, idx) => {
                  return <CommentListItem comment={ele} key={idx} />;
                })}
              </div>
            ) : (
              <div>첫 번째 댓글을 남겨보세요!</div>
            )}
            <div className='comment-create-box2'>
              <ProfileAvatar w={50} h={50} imgUrl={luImg} />
              <input
                autoFocus
                onChange={onCommentChange}
                onKeyPress={submitComment}
                value={commentInput}
                className='create-comment-input'
                placeholder='댓글을 달아주세요...'
              ></input>
              {commentInput.trimEnd() && commentInput.trimStart() ? (
                <SendRounded
                  fontSize='large'
                  className='comment-submit-btn-active'
                  onClick={submitComment}
                />
              ) : (
                <SendRounded
                  fontSize='large'
                  className='comment-submit-btn'
                  onClick={submitComment}
                />
              )}
            </div>
            <Box id='srollToBottom' className='css-baseline-box2'></Box>
          </Box>
        </Box>
      </SwipeableDrawer>
    </div>
  );
};

export default CommentCreate;
