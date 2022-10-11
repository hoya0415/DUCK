import { TREND_LIKE_LIST,GET_CATEGORY_SEARCH } from '../_action/types';
import { createStore } from '@reduxjs/toolkit';

const initState = {};

export default function trend(state = initState, action) {
  switch (action.type) {
    case TREND_LIKE_LIST:
      return {
        ...state,
        trendLikeList: action.payload.feedList
      };
    case GET_CATEGORY_SEARCH:
      return {
        ...state,
        csFeedList: action.payload.feedList
      }
    default:
      return state;
  }
}

const store = createStore(trend);