import React, { useState } from 'react';
import axios from 'axios';
import './TrendLikeListItem.css';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Badge } from '@mui/material';
import { Favorite } from '@mui/icons-material';
import ProfileAvatar from '../ProfileAvatar';

const TrendLikeListItem = ({ feed, idx }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { writerProfileImg, writerNickname, writerUserId } = {
    writerProfileImg: feed.profileUrl,
    writerNickname: feed.nickname,
    writerUserId: feed.userId,
  };
  const feedId = parseInt(feed.feedId);
  const [likeSum, setLikeSum] = useState(feed.likeCnt);
  const [isLiked, setIsLiked] = useState(feed.liked);
  const loggedUserNickname = useSelector((state) => state.user.luNickname);
  const accessToken = useSelector((state) => state.user.luAccessToken);
  const loggedUserId = useSelector((state) => state.user.luUserId);
  const FEED_URL = 'http://3.35.207.243:9999/duck/feed/';
  const isTop = idx < 3;
  const moveToDetail = () => {
    navigate(`/feed/detail/${feedId}`);
  };

  const handleCategorySearch = () => {
    navigate(`/trend/${feed.category}`);
  }
  

  const moveToProfile = () => {
    navigate(`/profile/${writerUserId}`);
  };

  return (
    <>
      {isTop ? (
        <>
          <div className='top-3'>
            <h1 className='top-3-number'>{idx + 1}</h1>
            <Card.Text as='div' className='trend-category' onClick={handleCategorySearch}>
              #{feed.category}
            </Card.Text>
            <Badge
              badgeContent={likeSum}
              overlap='circular'
              id='like-sum-badge'
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Badge
                overlap='circular'
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                badgeContent={
                  <Favorite id='trend-heart' color='error' fontSize='large'>
                    {likeSum}
                  </Favorite>
                }
              >
                <Card className='top-3-container'>
                  <Card.Img
                    variant='top'
                    src={
                      feed.url ||
                      'https://i.pinimg.com/originals/b2/7b/3c/b27b3cfb44c54c99656161c790f19f7f.gif'
                    }
                    onClick={moveToDetail}
                    className='top-3-img'
                  />
                  <Card.Body style={{ padding: '20px' }}>
                    <Card.Title onClick={moveToDetail} className='top-3-title'>
                      {feed.title}
                    </Card.Title>
                    <Card.Text
                      as='div'
                      variant='primary'
                      className='top-3-writer'
                    >
                      <div onClick={moveToProfile}>
                      <ProfileAvatar 
                        w={35} h={35} 
                        imgUrl={writerProfileImg} 
                        />
                      </div>
                      <div 
                        className='trend-writer-nickname'
                        onClick={moveToProfile}>
                        {writerNickname}
                      </div>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Badge>
            </Badge>
          </div>
        </>
      ) : (
        <div className="top-10-hov">
          <Badge
            badgeContent={likeSum}
            overlap='circular'
            id='top-3-like-sum-badge'
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <Badge
              overlap='circular'
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
              badgeContent={
                <Favorite id='top-3-trend-heart' color='error' fontSize='large'>
                  {likeSum}
                </Favorite>
              }
            >
              <div className='top-10-container'>
                <div className='trend-like-container'>
                  <Card className='trend-like-card'>
                    <Card.Text as='div' className='top-10'>
                      {idx + 1}
                    </Card.Text>
                    <Card.Body className='trend-like-text'>
                      <Card.Text as='div' className='trend-category' onClick={handleCategorySearch}>
                        #{feed.category}
                      </Card.Text>
                      <Card.Title
                        className='trend-like-title'
                        onClick={moveToDetail}
                      >
                        {feed.title}
                      </Card.Title>
                      <Card.Text as='div' className='trend-like-card-info'>
                        <div className='trend-like-user-info'>
                          <div className='trend-like-profile'>
                            <ProfileAvatar
                              w={35}
                              h={35}
                              imgUrl={writerProfileImg}
                              onClick={moveToProfile}
                            />
                            <div
                              className='trend-writer-nickname'
                              onClick={moveToProfile}
                            >
                              {writerNickname}
                            </div>
                          </div>
                        </div>
                      </Card.Text>
                    </Card.Body>
                    <Card.Img
                      className='trend-like-img'
                      variant='top'
                      src={
                        feed.url ||
                        'https://i.pinimg.com/originals/b2/7b/3c/b27b3cfb44c54c99656161c790f19f7f.gif'
                      }
                      onClick={moveToDetail}
                    />
                  </Card>
                </div>
              </div>
            </Badge>
          </Badge>
        </div>
      )}
    </>
  );
};

export default TrendLikeListItem;
