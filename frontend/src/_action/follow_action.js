import axios from "axios";
import {
  GET_FOLLOWER_LIST,
  GET_FOLLOWING_LIST,
} from "./types";

const USER_URL = "http://3.35.207.243:9999/duck/follow";

export function getFollowerList(loginId, targetId) {
  const request = axios
    .get(`${USER_URL}/follower/targetId=${targetId}&&loginId=${loginId}`)
    .then((res) => res.data);
  return {
    type: GET_FOLLOWER_LIST,
    payload: request,
  };
}

export function getFollowingList(loginId,targetId) {
  const request = axios
    .get(`${USER_URL}/following/targetId=${targetId}&&loginId=${loginId}`)
    .then((res) => res.data);
  return {
    type: GET_FOLLOWING_LIST,
    payload: request,
  };
}
