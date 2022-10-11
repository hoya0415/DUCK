import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import './CommentListItem.css';
import { useNavigate } from 'react-router-dom';
import 기본프로필 from '../../assets/기본프로필.png';
import {
  MoreVertOutlined,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import ProfileAvatar from '../ProfileAvatar';


const CommentListItem = ({ comment }) => {
  const navigate = useNavigate();
  const loggedUserId = useSelector((state) => state.user.luUserId);
  const loggedUserNickname = useSelector((state) => state.user.luNickname)
  const feedUser = useSelector((state) => state.feed.fdUserId);
  const commentId = comment.commentId;
  const commentUser = comment.userId;
  const commentImg = comment.profileUrl;
  const [isHidden, setIsHidden] = useState(comment.hiddenResult);
  const [isDelete, setIsDelete] = useState(false);
  const [controll, setControll] = useState(false);
  const [isLiked, setIsLiked] = useState(comment.liked)
  const [likeSum, setLikeSum] = useState(comment.commentLikeCnt)
  const COMMENT_URL = 'http://3.35.207.243:9999/duck/feed/comment';
  const accessToken = localStorage.getItem('jwt');
  const commentDate = timeForToday(comment.createDate);

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

  const toggleControll = () => {
    setControll(!controll);
  };

  const toggleLikeBtn = () => {
    if (isLiked) {
      setIsLiked(false)
      setLikeSum(likeSum - 1)
      axios({
        url: `${COMMENT_URL}/likeCancel`,
        method: 'put',
        data: {
          commentId: commentId,
          userId: loggedUserId
        },
        headers: {
          accessToken: accessToken
        }
      })
      .then((res) => {
        if (res.status != 202) {
          console.log(`err: code ${res.status}`)
        }
      })
    } else {
      setIsLiked(true)
      setLikeSum(likeSum + 1)
      axios({
        url: `${COMMENT_URL}/like`,
        method: 'put',
        data: {
          commentId: commentId,
          userId: loggedUserId,
          userNickname: loggedUserNickname
        },
        headers: {
          accessToken: accessToken
        }
      })
      .then((res) => {
        if (res.status != 202) {
          console.log(`err: code ${res.status}`)
        }
      })
    }
  }

  const moveToProfile = () => {
    navigate(`/profile/${commentUser}`);
  };

  const commentHideToggle = () => {
    if (isHidden) {
      axios
      .put(`${COMMENT_URL}/unhide`, commentId, {
        headers: {
          accessToken: accessToken,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        setControll(false)
        if (res.status != 202) {
          console.log(`err: code ${res.status}`);
        } else {
          setIsHidden(false);
        }
      });
    } else {
      axios
      .put(`${COMMENT_URL}/hide`, commentId, {
        headers: {
          accessToken: accessToken,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        setControll(false)
        if (res.status != 202) {
          console.log(`err: code ${res.status}`);
        } else {
          setIsHidden(true);
        }
      });
    }
  };

  const commentDelete = () => {
    axios
      .delete(`${COMMENT_URL}/delete/${commentId}`, {
        headers: {
          accessToken: accessToken,
        },
      })
      .then((res) => {
        if (res.status != 202) {
          console.log(`err: code ${res.status}`);
        } else {
          setIsDelete(true);
        }
      });
  };

  return (
    <div>
      {isDelete === false ? (
        <div className='comment-list-container justify-between parent-div-position'>
          <div className='comment-list-container' style={{ margin: 0 }}>
            {isHidden ?  
              <div className="hidden-comment">숨겨진 댓글입니다.</div> :
              <>
                <div onClick={moveToProfile} >
                  <ProfileAvatar w={50} h={50} imgUrl={commentImg}/>
                </div>
                <div className='content-nickname-box'>
                  <div className='comment-nickname'>{comment.nickname}</div>
                  <div className='container-flex-column'>
                    <div className='comment-content'>{comment.contents}</div>
                  </div>
                    <div className='comment-date'>{commentDate}</div>
                </div>
              </>
            }
          </div>
          <div className='like-setting-container'>
            {isHidden ? <div></div> :
              <div>
                {isLiked ? 
                  <div className='comment-like-container'>
                    <Favorite id='comment-like-btn' onClick={toggleLikeBtn} />
                    <div style={{margin:'auto', fontSize:'12px'}}>{likeSum}</div>
                  </div> :
                  <div className='comment-like-container'>
                    <FavoriteBorder id='comment-like-btn' onClick={toggleLikeBtn} />
                    <div style={{margin:'auto', fontSize:'12px'}}>{likeSum}</div>
                  </div>
                }
              </div>
            }

            {feedUser === loggedUserId ? (
              // <button className="toggle-controll-btn" onClick={toggleControll}>:</button> :
              <MoreVertOutlined
                onClick={toggleControll}
                fontSize='small'
                className='top-bar-menu-btn toggle-controll-btn'
              />
            ) : (
              <></>
            )}
          </div>
          {loggedUserId === feedUser ? (
            <div
              className={
                'comment-hide-del-container justify-even child-div-position' +
                (controll ? ' click-visible' : ' click-hide')
              }
            >
              {isHidden ? 
                <div onClick={commentHideToggle}>숨김 취소</div> :
                <div onClick={commentHideToggle}>숨김</div>
              } |{' '}
              <div onClick={commentDelete}>삭제</div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default CommentListItem;
