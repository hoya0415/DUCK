import { useDispatch, useSelector } from 'react-redux';
import TrendLikeListItem from './TrendLikeListItem';
import { useEffect, useState } from 'react';
import { getTrendLikeList } from '../../_action/trend_action';

const TrendLikeList = () => {
  const dispatch = useDispatch();
  const loggedUserId = useSelector((state) => state.user.luUserId);
  const accessToken = useSelector((state) => state.user.luAccessToken);
  const trendLikeFeeds = useSelector((state) => state.trend.trendLikeList);

  useEffect(() => {
    dispatch(getTrendLikeList(loggedUserId, accessToken));
  }, []);
  return (
    <div className='trend-list-container'>
      {trendLikeFeeds?.map((feed, idx) => (
        <TrendLikeListItem feed={feed} idx={idx} key={idx} />
      ))}
    </div>
  );
};
export default TrendLikeList;
