import axios from 'axios';
import {
  LOGIN_USER,
  LOGOUT_USER,
  WITHDRAWAL_USER,
  SIGNUP_USER,
  GET_USER_PROFILE,
  EDIT_PROFILE,
  CHANGE_PASSWORD,
  GET_ALERT,
} from './types';

const USER_URL = 'http://3.35.207.243:9999/duck/user';

export function loginUser(inputEmail, inputPassword) {
  const request = axios
    .post(`${USER_URL}/login`, { email: inputEmail, password: inputPassword })
    .then((res) => res.data);
  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export function logoutUser() {
  return {
    type: LOGOUT_USER,
  };
}

export function withdrawalUser(userId) {
  const request = axios
    .delete(`${USER_URL}/delete/${userId}`)
    .then((res) => res.data);
  return {
    type: WITHDRAWAL_USER,
  };
}

export function signupUser(inputEmail, inputPassword) {
  const request = axios
    .post(`${USER_URL}/signup`, { email: inputEmail, password: inputPassword })
    .then((res) => res.data);
  return {
    type: SIGNUP_USER,
    payload: request,
  };
}

export function getUserProfile(loginId, targetId) {
  const request = axios
    .get(`${USER_URL}/profile/targetId=${targetId}&&loginId=${loginId}`)
    .then((res) => res.data);
  return {
    type: GET_USER_PROFILE,
    payload: request,
  };
}

export function editProfile(formData, accessToken) {
  const request = axios
    .post(`${USER_URL}/profile/edit`, formData, {
      headers: {
        accessToken: accessToken,
        'Content-Type': `multipart/form-data`,
      },
    })
    .then((res) => res.data);
  return {
    type: EDIT_PROFILE,
    payload:request,
  };
}

export function getAlert(targetId, accessToken) {
  const request = axios
    .get(`${USER_URL}/alert/${targetId}`, {
      headers: {
        accessToken: accessToken,
      },
    })
    .then((res) => res.data);
  return {
    type: GET_ALERT,
    payload: request
  };
}
