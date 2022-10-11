import './TrendFeedResult.css'
import axios from 'axios'
import 기본프로필 from '../../assets/기본프로필.png'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { Card, CardMedia, CardContent, Typography, Avatar, Divider } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { useState } from 'react';
import ProfileAvatar from '../ProfileAvatar';



const TrendFeedResult = ({ feed }) => {
  const navigate = useNavigate();
  const titleImg = feed.url
  const [isLiked, setIsLiked] = useState(feed.liked)
  const [likeCnt, setLikeCnt] = useState(feed.likeCnt)
  const accessToken = useSelector((state) => state.user.luAccessToken)
  const loggedUserId = useSelector((state) => state.user.luUserId)
  const loggedUserNickname = useSelector((state) => state.user.luNickname)
  const FEED_URL = 'http://3.35.207.243:9999/duck/feed'

  const likeBtnToggle = () => {
    if (isLiked) {
      setIsLiked(false)
      setLikeCnt(likeCnt - 1)
      axios({
        url: `${FEED_URL}/feedLikeCancel`,
        method: 'put',
        data: {
          feedId: feed.feedId,
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
          feedId: feed.feedId,
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

  const moveToDetail = (id) => {
    navigate(`/feed/detail/${feed.feedId}`);
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
                image={titleImg === undefined ? 'http://beepeers.com/assets/images/commerces/default-image.jpg' : titleImg}
                alt={feed.feedId}
                onClick={moveToDetail}
              ></CardMedia>
              <div  className="trend-feed-result-profileImg" onClick={() => navigate(`/profile/${feed.userId}`)}>
              <ProfileAvatar w={45} h={45} imgUrl={feed.profileUrl}/>
              </div>
              <Typography className="trend-feed-result-nickname" onClick={() => navigate(`/profile/${feed.userId}`)}>
                {feed.nickname}
              </Typography>
            </div>
            <CardContent className="trend-feed-result-content-box" onClick={moveToDetail}>
              <Typography className="trend-feed-result-title" component="div">
                { feed.title }
              </Typography>
              <Typography className="trend-feed-result-contents" component="div">
                { feed.contents }
              </Typography>
            </CardContent>
          </div>
        </div>  
      </Card>
    </div>
  )
}

export default TrendFeedResult