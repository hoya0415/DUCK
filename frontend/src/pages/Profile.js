import { Badge, Box, Button, Tab } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import floatDuck from '../assets/흘러가는오리-1.gif';
import { Favorite, ArrowDropUp } from '@mui/icons-material';
import { TabList, TabPanel, TabContext } from '@mui/lab';
import { useNavigate, useParams } from 'react-router-dom';
import FollowerList from '../components/Profile/FollowerList';
import FollowingList from '../components/Profile/FollowingList';
import ProfileFeedList from '../components/Profile/ProfileFeedList';
import ProfileSideBar from '../components/Profile/ProfileSideBar';
import Follow from '../components/Profile/Follow';
import { getFollowerList, getFollowingList } from '../_action/follow_action';
import { getUserProfile } from '../_action/user_action';
import ProfileFeedLikeList from '../components/Profile/ProfileLikeList';
import ProfileAvatar from '../components/ProfileAvatar';
import { Modal } from 'react-bootstrap';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const handleLoggedUser = () => {
    if (parseInt(luUserId) === parseInt(params.userId)) {
      setIsLoggedUser(true);
    } else {
      setIsLoggedUser(false);
    }
  };

  const [isLoggedUser, setIsLoggedUser] = useState(true);
  const [value, setValue] = useState('0');

  const {
    luUserId,
    puNickname,
    puBio,
    followerListItem,
    followingListItem,
    puFollowerCnt,
    puFollowingCnt,
    puSignUpDate,
    puFeedList,
    puLikeFeedList,
    likeSum,
    puIsFollowed,
    puImg,
  } = useSelector((state) => ({
    luUserId: state.user.luUserId,
    puNickname: state.user.puNickname,
    puBio: state.user.puBio,
    followerListItem: state.follow.followerList,
    followingListItem: state.follow.followingList,
    puFollowerCnt: state.user.puFollowerCnt,
    puFollowingCnt: state.user.puFollowingCnt,
    puSignUpDate: state.user.puSignUpDate,
    puFeedList: state.user.puFeedList,
    puLikeFeedList: state.user.puLikeFeedList,
    likeSum: state.user.puLikeSum,
    puIsFollowed: state.user.puIsFollowed,
    puImg: state.user.profileUrl,
  }));

  const moveToFeedListDetail = () => {
    navigate(`/feed/list/${params.userId}`);
  };

  const moveToFeedLikeListDetail = () => {
    navigate(`/feed/likelist/${params.userId}`);
  };

  const handleChange = (event, newValue) => {
      setValue(newValue);
  };

  const sortPuFeedList = puFeedList?.sort((a, b) => {
    return b.feedId - a.feedId;
  });

  let today = new Date();
  const signupDay = new Date(puSignUpDate);
  const now =
    today.getTime() -
    (today.getHours() * 3600 - today.getMinutes() * 60 - today.getSeconds()) *
      1000 -
    today.getMilliseconds();
  const distance = now - signupDay;
  const dDay = Math.floor(distance / (1000 * 60 * 60 * 24) + 2);

  const [proImgOpen, setProImgOpen] = useState(false);
  const handleProImg = () => {
    setProImgOpen(true);
  };
  useEffect(() => {
    dispatch(getUserProfile(luUserId, params.userId));
    dispatch(getFollowingList(luUserId, params.userId));
    dispatch(getFollowerList(luUserId, params.userId));
    handleLoggedUser();
    setValue('0');
  }, [params.userId, dispatch]);

  return (
    <div className='grade-back'>
      <div className='top-bar-fld-profile'>
        {isLoggedUser ? <ProfileSideBar /> : null}
      </div>
      <div className='profile-fld'>
        <img
          className='float-duck-img-pro-1'
          src={floatDuck}
          alt='흘러가는 오리'
        />
        <img
          className='float-duck-img-pro-2'
          src={floatDuck}
          alt='흘러가는 오리'
        />
        <div className='pofile-img-fld' onClick={handleProImg}>
          <Badge
            badgeContent={likeSum}
            overlap='circular'
            id='like-sum-badge'
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <Badge
              overlap='circular'
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
              badgeContent={
                <Favorite color='error' fontSize='large'>
                  {likeSum}
                </Favorite>
              }
            >
              <div style={{ cursor: 'pointer' }}>
                <ProfileAvatar w={140} h={140} imgUrl={puImg} />
              </div>
            </Badge>
          </Badge>
        </div>
      </div>
      <div className='white-back feed-update-back'>
        <div className='profile-info-fld'>
          <div className='col-4'></div>
          <div className='profile-info-1 col-4'>
            <div className='fs-5 fw-bold'>
              {puNickname}
              <span className='dday fw-normal mx-1'>덕 +{dDay}</span>
            </div>
            <span className='dday'>{puBio}</span>
          </div>
          {isLoggedUser || (
            <div className='profile-flw-btn'>
              <Follow
                paramsId={params.userId}
                toUser={params.userId}
                isFollow={puIsFollowed}
              />
            </div>
          )}
        </div>
        <div>
          {/* 팔로워 수, 팔로잉 수 보여줘야 함 */}
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  onChange={handleChange}
                  aria-label='lab API tabs example'
                >
                  <Tab label='' value='0' className='tabpanel0' />
                  <Tab
                    label='팔로워'
                    icon={<div className='fw-bold'>{puFollowerCnt}</div>}
                    iconPosition='bottom'
                    value='1'
                    className='follow'
                  />
                  <Tab
                    label='팔로잉'
                    icon={<div className='fw-bold'>{puFollowingCnt}</div>}
                    iconPosition='bottom'
                    value='2'
                    className='follow'
                  />
                </TabList>
              </Box>
              <TabPanel value='0' id='tabpanel0'></TabPanel>
              <TabPanel value='1'>
                {followerListItem?.map((item) => (
                  <FollowerList key={item.followId} item={item} />
                ))}
                <ArrowDropUp
                  className='arrowbtn'
                  fontSize='large'
                  onClick={() => setValue('0')}
                />
              </TabPanel>
              <TabPanel value='2'>
                {followingListItem?.map((item) => (
                  <FollowingList key={item.followId} item={item} />
                ))}
                <ArrowDropUp
                  className='arrowbtn'
                  fontSize='large'
                  onClick={() => setValue('0')}
                />
              </TabPanel>
            </TabContext>
          </Box>
        </div>
        <div>
          <div className='container mt-3'>
            <p className='list-name' onClick={moveToFeedListDetail}>
              게시물 ({sortPuFeedList && sortPuFeedList.length})
            </p>
            <Button
              variant='link'
              style={{ padding: 0, color: '#00000099', fontSize: 20 }}
              id='plusbtn'
              onClick={moveToFeedListDetail}
            >
              +
            </Button>
          </div>
          <div className='profile-feed-card-container'>
            {sortPuFeedList
              ?.map((item) => <ProfileFeedList key={item.feedId} item={item} />)
              .slice(0, 10)}
          </div>
        </div>
        <hr></hr>
        <div>
          <div className='container'>
            <p className='list-name' onClick={moveToFeedLikeListDetail}>
              좋아요 ({puLikeFeedList && puLikeFeedList.length})
            </p>
            <Button
              variant='link'
              style={{ padding: 0, color: '#00000099', fontSize: 20 }}
              id='plusbtn'
              onClick={moveToFeedLikeListDetail}
            >
              +
            </Button>
          </div>
          <div className='profile-feed-card-container'>
            {puLikeFeedList
              ?.map((item) => (
                <ProfileFeedLikeList key={item.feedId} item={item} />
              ))
              .slice(0, 10)}
          </div>
        </div>
      </div>
      {/* 프로필 원본 보기 모달 */}
      <div>
        <Modal
          show={proImgOpen}
          onHide={() => setProImgOpen(false)}
          size='lg'
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Body>
            <img src={puImg} />
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Profile;
