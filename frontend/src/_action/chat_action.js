import axios from 'axios';
import {
  CREATE_CHAT, GET_CHAT_LIST
} from './types';

const CHAT_URL = 'http://3.35.207.243:9999/duck/chat';

// 폼데이타로 바꿔야 함.
export function createChat(formData, accessToken) {
  const request = axios
    .post(`${CHAT_URL}/create`, formData, {
      headers: {
        accessToken: accessToken,
        'Content-Type': `multipart/form-data`,
      },
    })
    .then((res) => res.data);
  return {
    type: CREATE_CHAT,
    payload: request,
  };
}

export function getChatList(accessToken) {
  const request = axios
    .get(`${CHAT_URL}/list/all`, {
      headers: {
        accessToken: accessToken,
      },
    })
    .then((res) => res.data);
  return {
    type: GET_CHAT_LIST,
    payload: request,
  };
}


