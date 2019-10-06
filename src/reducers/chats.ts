import {Reducer} from 'redux';
import {RootAction} from '../actions';

export type DirectsState = Readonly<{
  directsList: Array<string>;
  groupsList: Array<string>;
  loading: boolean;
  lastMessages: {
    [directId: string]: {loading: boolean; messageId?: string};
  };
  nextCursor: string;
  typingsUsers: {[chatId: string]: Array<string>};
}>;

const initialState: DirectsState = {
  directsList: [],
  groupsList: [],
  loading: false,
  lastMessages: {},
  nextCursor: '',
  typingsUsers: {},
};

export const chatsReducer: Reducer<DirectsState, RootAction> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'FETCH_CHATS_START': {
      return {
        ...state,
        loading: true,
      };
    }

    case 'FETCH_CHATS_SUCCESS': {
      let {ims, groups} = action.payload;
      return {
        ...state,
        directsList: ims.map(im => im.id),
        groupsList: groups.map(group => group.id),
        loading: false,
      };
    }

    case 'FETCH_CHATS_FAIL': {
      return {
        ...state,
        loading: false,
      };
    }

    case 'GET_CHAT_LAST_MESSAGE_START': {
      let {directId} = action.payload;
      return {
        ...state,
        lastMessages: {
          ...state.lastMessages,
          [directId]: {
            loading: true,
          },
        },
      };
    }

    case 'GET_CHAT_LAST_MESSAGE_SUCCESS': {
      let {directId, messageId, nextCursor} = action.payload;
      return {
        ...state,
        lastMessages: {
          ...state.lastMessages,
          [directId]: {
            loading: false,
            messageId,
          },
        },
        nextCursor,
      };
    }

    case 'GET_CHAT_LAST_MESSAGE_FAIL': {
      let {directId} = action.payload;
      return {
        ...state,
        lastMessages: {
          ...state.lastMessages,
          [directId]: {
            loading: false,
          },
        },
      };
    }

    case 'ADD_MESSAGE_TO_CHAT': {
      let {chatId, messageId} = action.payload;
      return {
        ...state,
        lastMessages: {
          ...state.lastMessages,
          [chatId]: {
            loading: false,
            messageId,
          },
        },
      };
    }

    case 'SET_USER_TYPING': {
      let {chatId, userId} = action.payload;
      return {
        ...state,
      };
    }

    case 'SET_CURRENT_TEAM': {
      return {
        ...state,
        directsList: [],
        groupsList: [],
        loading: false,
        lastMessages: {},
      };
    }

    default:
      return state;
  }
};