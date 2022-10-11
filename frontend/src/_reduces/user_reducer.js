import {
  GET_USER_PROFILE,
  LOGOUT_USER,
  LOGIN_USER,
  SIGNUP_USER,
  EDIT_PROFILE,
  WITHDRAWAL_USER,
  GET_ALERT,
} from '../_action/types';
import { createStore } from '@reduxjs/toolkit';

// lu = logged user
// pu = profile user

const initState = {};

export default function user(state = initState, action) {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        luNickname: action.payload.nickname,
        luAccessToken: action.payload.accessToken,
        luUserId: action.payload.userId,
        luImg: action.payload.profileUrl,
      };
    case LOGOUT_USER:
      return initState;
    case WITHDRAWAL_USER:
      return initState;
    case SIGNUP_USER:
      return { ...state, signupMsg: action.payload.message };
    case GET_USER_PROFILE:
      return {
        ...state,
        puNickname: action.payload.nickname,
        puBio: action.payload.bio,
        puSignUpDate: action.payload.signUpDate,
        puFeedCnt: action.payload.feedCnt,
        puFollowerCnt: action.payload.followerCnt,
        puFollowingCnt: action.payload.followingCnt,
        puLikeSum: action.payload.likeSum,
        puIsFollowed: action.payload.isFollowed,
        puFeedList: action.payload.feedList,
        puLikeFeedList: action.payload.likeFeedList,
        profileUrl: action.payload.profileUrl,
      };
    case EDIT_PROFILE:
      return {
        ...state,
        editProfileMsg: action.payload.message,
        luImg: action.payload.profileUrl,
        profileUrl: action.payload.profileUrl,
        luNickname:action.payload.nickname
      };
    case GET_ALERT:
      return { ...state, alertList: action.payload.alertList };
    default:
      return state;
  }
}

const store = createStore(user);
