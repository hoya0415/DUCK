import {
  CREATE_FEED,
  FEED_LIKE,
  FEED_UN_LIKE,
  EDIT_FEED,
  GET_FEED_DETAIL,
  GET_FEED_LIST,
} from '../_action/types';
import { createStore } from '@reduxjs/toolkit';

const initState = { isAllChecked: true, isAllBtnActive: true };

export default function feed(state = initState, action) {
  switch (action.type) {
    case GET_FEED_LIST:
      return {
        ...state,
        feedList: action.payload.feedList,
      };
    case GET_FEED_DETAIL:
      return {
        ...state,
        fdFeedId: action.payload.feedId,
        fdUserId: action.payload.userId,
        fdTitle: action.payload.title,
        fdContents: action.payload.contents,
        fdNickname: action.payload.nickname,
        fdLikeCnt: action.payload.likeCnt,
        fdUploadDate: action.payload.uploadDate,
        fdIsLiked: action.payload.isLiked,
        fdCategory: action.payload.category,
        fdUserImg: action.payload.profileUrl,
        fdImgs: action.payload.urls,
      };
    case CREATE_FEED:
      return {
        ...state,
        feedList: action.payload.feedList,
      };
    case EDIT_FEED:
      return {
        ...state,
        feedList: action.payload.feedList,
      };
    case FEED_LIKE:
      return {
        ...state,
        feedList: action.payload.feedList,
      };
    case FEED_UN_LIKE:
      return {
        ...state,
        feedList: action.payload.feedList,
      };
    default:
      return state;
  }
}

const store = createStore(feed);
