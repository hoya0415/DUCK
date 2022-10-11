import {
    CREATE_CHAT, GET_CHAT_LIST
} from '../_action/types';

import { createStore } from '@reduxjs/toolkit';

const initState = {};
export default function chat(state = initState, action) {
    switch (action.type) {
        case CREATE_CHAT:
        return {
            ...state,
            chatList: action.payload.chatList
            };
        case GET_CHAT_LIST:
            return {
              ...state,
              chatList: action.payload.chatList,
            };
        default:
            return state;
    }
}
const store = createStore(chat);