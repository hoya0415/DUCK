import './TrendFeedResult.css'
import axios from 'axios'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { Card, CardMedia, CardContent, Typography, Avatar, Divider } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { useState } from 'react';
import ProfileAvatar from '../ProfileAvatar';



const TrendCategorySearchItem = ({item}) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(item.liked)
  const [likeCnt, setLikeCnt] = useState(item.likeCnt)
  const loggedUserId = useSelector((state) => state.user.luUserId);
  const loggedUserNickname = useSelector((state) => state.user.luNickname)
  const accessToken = useSelector((state) => state.user.luAccessToken);
  const FEED_URL = 'http://3.35.207.243:9999/duck/feed'

  const likeBtnToggle = () => {
    if (isLiked) {
      setIsLiked(false)
      setLikeCnt(likeCnt - 1)
      axios({
        url: `${FEED_URL}/feedLikeCancel`,
        method: 'put',
        data: {
          feedId: item.feedId,
          userId: loggedUserId
        },
        headers: {
          accessToken: accessToken
        }
      })
      .then((res) => {
        if (res.status !== 202) {
          console.log(`err: code ${res.status}`);
        }
      })
    } else {
      setIsLiked(true)
      setLikeCnt(likeCnt + 1)
      axios({
        url: `${FEED_URL}/feedLike`,
        method: 'put',
        data: {
          feedId: item.feedId,
          userId: loggedUserId,
          userNickname: loggedUserNickname
        },
        headers: {
          accessToken: accessToken
        }
      })
      .then((res) => {
        if (res.status !== 202) {
          console.log(`err: code ${res.status}`);
        }
      })
    }
  }
  const moveToDetail = () => {
    navigate(`/feed/detail/${item.feedId}`);
  };



  return (
    <div>
      <Card className="trend-feed-result-container">
        <div className="trend-feed-result-profile-container">
          <div className="trend-feed-result-like-btn-count">
            {isLiked ? 
              <Favorite id="trend-result-like-btn" onClick={likeBtnToggle} /> :
              <FavoriteBorder id="trend-result-like-btn" onClick={likeBtnToggle} />
            }
            <div>{likeCnt}</div>
          </div>
          <div className="trend-feed-result-info-container" >
            <div className="trend-feed-result-position">
              <CardMedia
                className="trend-feed-result-img"
                component="img"
                height="140"
                image={item.url === undefined ? 'http://beepeers.com/assets/images/commerces/default-image.jpg' : item.url}
                alt={item.feedId}
                onClick={moveToDetail}
              ></CardMedia>
              <div onClick={() => navigate(`/profile/${item.userId}`)} className="trend-feed-result-profileImg">
              <ProfileAvatar className="trend-feed-result-profileImg" w={45} h={45} imgUrl={item.profileUrl} />
              </div>
              <Typography className="trend-feed-result-nickname" onClick={() => navigate(`/profile/${item.userId}`)}>
                {item.nickname}
              </Typography>
            </div>
            <CardContent className="trend-feed-result-content-box" onClick={moveToDetail}>
              <Typography className="trend-feed-result-title" component="div">
                { item.title }
              </Typography>
              <Typography className="trend-feed-result-contents" component="div">
                { item.contents }
              </Typography>
            </CardContent>
          </div>
        </div>  
      </Card>
    </div>
  )
}

export default TrendCategorySearchItem;