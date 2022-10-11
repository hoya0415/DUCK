import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardActionArea,
  CardContent,
  Typography,
} from '@mui/material';
import ProfileAvatar from '../ProfileAvatar';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { feedLike, feedUnLike, getFeedList } from '../../_action/feed_action';
import { useDispatch, useSelector } from 'react-redux';
const FeedListItem = ({
  feedId,
  userId,
  title,
  contents,
  nickname,
  category,
  likeCnt,
  isLiked,
  userImg,
  titleImg,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { luUserId, luAccessToken, luNickname, feedList } = useSelector(
    (state) => ({
      luUserId: state.user.luUserId,
      luAccessToken: state.user.luAccessToken,
      luNickname: state.user.luNickname,
      feedList: state.feed.Avatar,
    })
  );

  const [isLikedBtn, setIsLikedBtn] = useState(isLiked);
  const [likeCntValue, setIsLikeCntValue] = useState(likeCnt);

  const likeToggle = () => {
    setIsLikedBtn(true);
    setIsLikeCntValue((prev) => prev + 1);
    dispatch(feedLike(feedId, luUserId, luAccessToken, luNickname)).then(
      () => {}
    );
  };
  const unLikeToggle = () => {
    setIsLikedBtn(false);
    setIsLikeCntValue((prev) => prev - 1);
    dispatch(feedUnLike(feedId, luUserId, luAccessToken)).then(() => {
      dispatch(getFeedList(luUserId, luAccessToken)).then((res) => {});
    });
  };

  const moveToDetail = () => {
    navigate(`/feed/detail/${feedId}`);
  };
  const moveToProfile = () => {
    navigate(`/profile/${userId}`);
  };
  const handleCategorySearch = () => {
    navigate(`/trend/${category}`);
  };

  return (
    <div>
      <div className='feed-tag' onClick={handleCategorySearch}>
        #{category}
      </div>
      <Card className='card-img'>
        <CardActionArea>
          <CardContent>
            <div className='feed-text' onClick={moveToDetail}>
              <Typography className='feed-title'>{title}</Typography>
              <Typography className='feed-content'>{contents}</Typography>
              <div className='feed-user-fld'>
                <div onClick={moveToProfile}>
                  <ProfileAvatar w={45} h={45} imgUrl={userImg} />
                </div>
                <Typography onClick={moveToProfile} className='feed-user'>
                  {nickname}
                </Typography>
              </div>
            </div>
            <CardMedia
              onClick={moveToDetail}
              component='img'
              width='380'
              height='300'
              image={
                titleImg ||
                'https://tenor.com/view/swag-%EC%9E%AC%ED%98%84-jaehyun-%EC%97%94%EC%94%A8%ED%8B%B0127-nct127-gif-16429793.gif'
              }
            />
          </CardContent>
        </CardActionArea>
      </Card>
      <div className='feed-bottom'>
        <div className='feed-like'>
          {isLikedBtn ? (
            <Favorite id='like-btn' onClick={unLikeToggle} />
          ) : (
            <FavoriteBorder id='like-btn' onClick={likeToggle} />
          )}
          {likeCntValue}
        </div>
      </div>
    </div>
  );
};

export default FeedListItem;
