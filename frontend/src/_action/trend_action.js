import axios from 'axios';
import {
  TREND_LIKE_LIST, GET_CATEGORY_SEARCH
} from './types';

const TREND_URL = 'http://3.35.207.243:9999/duck/trend/like'

export function getTrendLikeList(userId, accessToken) {
    const request = axios
      .get(`${TREND_URL}/${userId}`, {
        headers: {
          accessToken: accessToken,
        },
      })
      .then((res) => res.data);
    return {
      type: TREND_LIKE_LIST,
      payload: request,
    };
  }

export function getCategorySearch(accessToken, keyword, loginId) {
  const request = axios
    .get(`http://3.35.207.243:9999/duck/trend/feed/category/keyword=${keyword}&&loginId=${loginId}`, {
      headers:{
        accessToken: accessToken,
      },
    })
    .then((res) => res.data);
    return {
      type:GET_CATEGORY_SEARCH,
      payload: request,
    }
}