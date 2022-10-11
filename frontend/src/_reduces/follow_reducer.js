import { GET_FOLLOWER_LIST, GET_FOLLOWING_LIST } from '../_action/types';
import { createStore } from '@reduxjs/toolkit';

const initState = {};

export default function follow(state = initState, action) {
  switch (action.type) {
    case GET_FOLLOWER_LIST:
      return {...state, followerList: action.payload.followerList};
    case GET_FOLLOWING_LIST:
      return {...state,followingList: action.payload.followingList};
    default:
      return state;
  }
}

const store = createStore(follow);
