import axios from 'axios';
import {
  GET_FEED_LIST,
  GET_FEED_DETAIL,
  CREATE_FEED,
  EDIT_FEED,
  FEED_LIKE,
  FEED_UN_LIKE,
} from './types';

const FEED_URL = 'http://3.35.207.243:9999/duck/feed';

export function getFeedList(userId, accessToken) {
  const request = axios
    .get(`${FEED_URL}/${userId}`, {
      headers: {
        accessToken: accessToken,
      },
    })
    .then((res) => res.data);
  return {
    type: GET_FEED_LIST,
    payload: request,
  };
}

export function getFeedDetail(feedId, userId) {
  const request = axios
    .get(`${FEED_URL}/detail/feedId=${feedId}&&userId=${userId}`)
    .then((res) => res.data);
  return {
    type: GET_FEED_DETAIL,
    payload: request,
  };
}
export function createFeed(formData, accessToken) {
  const request = axios
    .post(`${FEED_URL}/write`, formData, {
      headers: {
        accessToken: accessToken,
        'Content-Type': `multipart/form-data`,
      },
    })
    .then((res) => res.data);
  return {
    type: CREATE_FEED,
    payload: request,
  };
}
export function editFeed(feedId, category, title, contents, accessToken) {
  const request = axios
    .put(
      `${FEED_URL}/edit`,
      { feedId: feedId, category: category, title: title, contents: contents },
      {
        headers: {
          accessToken: accessToken,
        },
      }
    )
    .then((res) => res.data);
  return {
    type: EDIT_FEED,
    payload: request,
  };
}

export function feedLike(feedId, userId, accessToken, userNickname) {
  const request = axios
    .put(
      `${FEED_URL}/feedLike`,
      { feedId: feedId, userId: userId, userNickname: userNickname },
      {
        headers: {
          accessToken: accessToken,
        },
      }
    )
    .then((res) => res.data);
  return {
    type: FEED_LIKE,
    payload: request,
  };
}
export function feedUnLike(feedId, userId, accessToken) {
  const request = axios
    .put(
      `${FEED_URL}/feedLikeCancel`,
      { feedId: feedId, userId: userId },
      {
        headers: {
          accessToken: accessToken,
        },
      }
    )
    .then((res) => res.data);
  return {
    type: FEED_UN_LIKE,
    payload: request,
  };
}
