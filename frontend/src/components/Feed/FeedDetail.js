import { Button, Carousel, Fade } from 'react-bootstrap';
import Modalb from 'react-bootstrap/Modal';
import Modalm from '@mui/material/Modal';
import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Backdrop } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CommentCreate from '../Comment/CommentCreate';
import ProfileAvatar from '../ProfileAvatar';
import {
  feedLike,
  feedUnLike,
  getFeedDetail,
  getFeedList,
} from '../../_action/feed_action';
import {
  ArrowBack,
  MoreVertOutlined,
  MoreHoriz,
  FavoriteBorder,
  Favorite,
  ClearRounded,
} from '@mui/icons-material';

const FeedDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const {
    luUserId,
    luAccessToken,
    luNickname,
    feedUserId,
    feedNickname,
    uploadDate,
    likeCnt,
    contents,
    title,
    isLiked,
    fdUserImg,
    fdImgs,
    fdCategory,
  } = useSelector((state) => ({
    feedUserId: state.feed.fdUserId,
    feedNickname: state.feed.fdNickname,
    uploadDate: state.feed.fdUploadDate,
    title: state.feed.fdTitle,
    contents: state.feed.fdContents,
    likeCnt: state.feed.fdLikeCnt,
    luUserId: state.user.luUserId,
    luAccessToken: state.user.luAccessToken,
    luNickname: state.user.luNickname,
    isLiked: state.feed.fdIsLiked,
    fdUserImg: state.feed.fdUserImg,
    fdImgs: state.feed.fdImgs,
    fdCategory: state.feed.fdCategory,
  }));

  const isMyFeed = luUserId === feedUserId;

  const likeToggle = () => {
    dispatch(
      feedLike(Number(params.feedId), luUserId, luAccessToken, luNickname)
    ).then((res) => dispatch(getFeedDetail(params.feedId, luUserId)));
  };

  const unLikeToggle = () => {
    dispatch(feedUnLike(Number(params.feedId), luUserId, luAccessToken)).then(
      (res) => dispatch(getFeedDetail(params.feedId, luUserId))
    );
  };

  const feedUploadDate = timeForToday(uploadDate);
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

  const [settingOpen, setSettingOpen] = useState(false);
  const handleFeedSetting = () => {
    setSettingOpen((prev) => !prev);
  };
  const [deleteCheckOpen, setDeleteCheckOpen] = useState(false);

  const handleFeedDelete = () => {
    axios({
      method: 'delete',
      url: `http://3.35.207.243:9999/duck/feed/delete/${params.feedId}`,
      data: {
        feedId: params.feedId,
      },
      headers: { accessToken: luAccessToken },
    })
      .then((res) => {
        dispatch(getFeedList(luUserId, luAccessToken));
        navigate(`/feed`);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // 원본 보기 여부
  const [openContents, setOpenContents] = useState(false);
  const handleCloseContents = () => {
    setOpenContents(false);
  };
  useEffect(() => {
    dispatch(getFeedDetail(params.feedId, luUserId));
  }, [dispatch, params.feedId]);

  const modalStyle = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: '#ffffff',
    border: '2px solid white',
    borderRadius: '12px',
    boxShadow: 24,
    p: 4,
    padding: '10%',
    opacity: '80%',
  };

  return (
    <div className='feed-detail'>
      <div className='top-bar-fld-feed'>
        <Button
          variant='link'
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowBack fontSize='large' className='top-bar-back-btn' />
        </Button>
        {isMyFeed && (
          <Button variant='link'>
            {settingOpen ? (
              <MoreHoriz
                onClick={handleFeedSetting}
                fontSize='large'
                className='top-bar-menu-btn'
              />
            ) : (
              <MoreVertOutlined
                onClick={handleFeedSetting}
                fontSize='large'
                className='top-bar-menu-btn'
              />
            )}
          </Button>
        )}
      </div>

      <div id='carousel-fld'>
        <Carousel
          className={fdImgs?.length === 1 ? 'isOneImg' : null}
          interval='9999999999'
        >
          {fdImgs &&
            fdImgs.map((img, idx) => (
              <Carousel.Item key={idx} onClick={() => setOpenContents(true)}>
                <img className='d-block w-100' src={img} alt={idx} />
              </Carousel.Item>
            ))}
        </Carousel>

        <Fade in={settingOpen}>
          <div id='feed-setting'>
            <div
              className='feed-setting-btn'
              onClick={() => navigate('/feed/edit')}
            >
              수정
            </div>
            <div id='feed-setting-partition'></div>
            <div
              className='feed-setting-btn'
              onClick={() => setDeleteCheckOpen(true)}
            >
              삭제
            </div>
          </div>
        </Fade>
      </div>
      <div
        className='pofile-img-fld-feed'
        onClick={() => navigate(`/profile/${feedUserId}`)}
      >
        <ProfileAvatar w={70} h={70} imgUrl={fdUserImg} />
        <div
          className='profile-txt'
          onClick={() => navigate(`/profile/${feedUserId}`)}
        >
          {feedNickname}
        </div>
      </div>
      <div className='like-fld'>
        <div>
          {isLiked ? (
            <Favorite id='like-btn' onClick={unLikeToggle} />
          ) : (
            <FavoriteBorder id='like-btn' onClick={likeToggle} />
          )}
          {likeCnt}
        </div>
      </div>
      <div className='feed-detail-text-fld'>
        <div className='feed-detail-top-fld'>
          <div
            className='feed-detail-category'
            onClick={() => navigate(`/trend/${fdCategory}`)}
          >
            #{fdCategory}
          </div>
          <div className='feed-detail-ULDate'>{feedUploadDate}</div>
        </div>
        <div className='feed-detail-title'>{title}</div>
        <div className='feed-detail-contents'>{contents}</div>
      </div>
      <CommentCreate style={{ width: '100vw' }} />
      {/* 원본 보기 모달 */}
      <div>
        <Modalb
          show={openContents}
          onHide={handleCloseContents}
          dialogClassName='modal-90w'
          aria-labelledby='example-custom-modal-styling-title'
          centered='true'
        >
          <ClearRounded
            sx={{ fontSize: 35 }}
            onClick={handleCloseContents}
          ></ClearRounded>
          <Modalb.Body className='modal-body'>
            <div className='modal-carousel'>
              <Carousel
                className={fdImgs?.length === 1 ? 'isOneImg' : null}
                interval='9999999999'
              >
                {fdImgs &&
                  fdImgs.map((img, idx) => (
                    <Carousel.Item key={idx}>
                      <img className='' src={img} alt={idx} />
                    </Carousel.Item>
                  ))}
              </Carousel>
            </div>
          </Modalb.Body>
        </Modalb>
      </div>
      {/* 수정/ 삭제 모달 */}
      <div>
        <Modalm
          open={deleteCheckOpen}
          onClose={() => setDeleteCheckOpen(false)}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Box style={modalStyle}>
            <Typography id='modal-modal-title' variant='h6' component='h2'>
              정말 삭제할 거야?ㅠ.ㅠ 이 글은 되돌릴 수 없어!
            </Typography>
            <Button
              className='delete-btn'
              variant='outline-danger'
              onClick={handleFeedDelete}
            >
              Yes
            </Button>
            <Button
              className='delete-btn'
              variant='outline-primary'
              onClick={() => setDeleteCheckOpen(false)}
            >
              No
            </Button>
          </Box>
        </Modalm>
      </div>
    </div>
  );
};

export default FeedDetail;
