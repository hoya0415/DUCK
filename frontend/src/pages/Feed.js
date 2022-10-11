import { Add } from '@mui/icons-material';
import { Fab } from '@mui/material';
import React, { useEffect, useState } from 'react';
import FeedList from '../components/Feed/FeedList';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFeedList } from '../_action/feed_action';
import { getCategorySearch } from '../_action/trend_action';
import { Card, CardMedia } from '@mui/material';

const Feed = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [allCategory, setAllCategory] = useState(true);
  const [filterCategoryList, setFilterCategoryList] = useState([
    '굿즈',
    'd-log',
    '앨범꾸미기',
    '덕친소',
    '슬덕생',
    '포카',
    '티켓',
    '판매',
    '구매',
    '교환',
    '예절',
    '맛집',
  ]);
  const { userId, accessToken, feedList, csFeedList } = useSelector(
    (state) => ({
      userId: state.user.luUserId,
      accessToken: state.user.luAccessToken,
      feedList: state.feed.feedList,
      csFeedList: state.trend.csFeedList,
    })
  );

  const handleCategoryFilter = (name) => {
    if (name === '전체') {
      if (allCategory === true) {
        setAllCategory(false);
        setFilterCategoryList([]);
      } else {
        setAllCategory(true);
        setFilterCategoryList([
          '굿즈',
          'd-log',
          '앨범꾸미기',
          '덕친소',
          '슬덕생',
          '포카',
          '티켓',
          '판매',
          '구매',
          '교환',
          '예절',
          '맛집',
        ]);
      }
    } else {
      if (filterCategoryList.includes(name) === false) {
        setFilterCategoryList((prev) => [...prev, name]);
        if (filterCategoryList.length === 11) {
          setAllCategory(true);
        }
      } else {
        setFilterCategoryList((prev) => prev.filter((item) => item !== name));
        setAllCategory(false);
      }
    }
  };

  const handleStory = (name) => {
    dispatch(getCategorySearch(accessToken, name, userId));
  };

  
  const categoryLists = [
    { name: '전체' },
    { name: '굿즈' },
    { name: 'd-log' },
    { name: '앨범꾸미기' },
    { name: '덕친소' },
    { name: '슬덕생' },
    { name: '포카' },
    { name: '티켓' },
    { name: '판매' },
    { name: '구매' },
    { name: '교환' },
    { name: '예절' },
    { name: '맛집' },
  ];
  
  const filterFeedList = feedList?.filter((item) =>
  filterCategoryList.includes(item.category)
  );
  useEffect(() => {
    dispatch(getFeedList(userId, accessToken));
    handleStory(categoryLists[Math.floor(Math.random() * 11) + 1].name);
  }, [dispatch]);

  return (
    <div>
      <div className='category-container'>
        <span
          onClick={() => handleCategoryFilter('전체')}
          className={allCategory ? 'category-btn-checked' : 'category-btn'}
        >
          전체
        </span>
        {categoryLists.slice(1, 13)?.map((name) => (
          <span
            key={name.name}
            onClick={() => {
              handleCategoryFilter(name.name);
              handleStory(name.name);
            }}
          >
            <div
              className={
                filterCategoryList?.includes(name.name)
                  ? 'category-btn-checked'
                  : 'category-btn'
              }
            >
              {name.name}
            </div>
          </span>
        ))}
      </div>

      <div id='feed-story'>
        {csFeedList?.map((item) => (
          <div
            key={item.feedId}
            onClick={() => navigate(`/feed/detail/${item.feedId}`)}
          >
            <Card className='story-card'>
              <CardMedia
                component='img'
                image={item.url}
                className='story-img'
              />
            </Card>
          </div>
        ))}
      </div>

      <div>
        <FeedList feedList={filterFeedList} />
      </div>
      <div className='fab-add-container'>
        <Fab
          aria-label='Add'
          className='fab-add'
          onClick={() => navigate('/feed/write')}
        >
          <Add />
        </Fab>
      </div>
    </div>
  );
};

export default Feed;
