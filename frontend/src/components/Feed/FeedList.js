import React from 'react';
import FeedListItem from './FeedListItem';

const FeedList = ({ feedList }) => {
  return (
    <div className='feed-list'>
      <div>
        <div className='card-container'>
          {feedList &&
            feedList.map((ele) => (
              <li key={ele.feedId} >
                <FeedListItem
                  feedId={ele.feedId}
                  userId={ele.userId}
                  title={ele.title}
                  contents={ele.contents}
                  nickname={ele.nickname}
                  category={ele.category}
                  likeCnt={ele.likeCnt}
                  isLiked={ele.liked}
                  userImg={ele.profileUrl}
                  titleImg={ele.url}
                />
              </li>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FeedList;
