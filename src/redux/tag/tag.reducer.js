import {
  LOADING_TAGS,
  SUCCESS_TAGS,
  FAIL_TAGS,
  SELECT_TAG,
  CLEAR_TAG,
  SELECT_TAG_CONFIG,
  CLEAR_TAG_CONFIG,
  SET_TAG_ERRORS,
  UPDATE_TAGS,
  SET_TAG_HISTORY,
  SET_TAG_HISTORY_POSITION,
  SET_TAG_POSITION_IN_HISTORY,
  LOADING_TAG_HISTORY_POSITION,
  CLEAR_TAG_HISTORY,
  UPDATE_BY_SOCKET,
} from "./tag.constants";

import { SELECT_ZONE } from "redux/zone/zone.constant";

const initialStateTag = {
  Tags: [],
  isLoading: false,
  fetchError: false,
  selectedTag: null,
  selectedTagConfig: null,
  tagErrors: {},
  history: {
    isLoading: true,
    tagZones: [],
    tagAlerts: [],
  },
  positionHistory: [],
  loadingPositionHistory: false,
};

const tagReducer = (state = initialStateTag, action = {}) => {
  switch (action.type) {
    case LOADING_TAGS:
      return {
        ...state,
        isLoading: true,
      };
    case SUCCESS_TAGS:
      return {
        ...state,
        Tags: action.payload,
        isLoading: false,
        fetchError: false,
      };
    case FAIL_TAGS:
      return {
        ...state,
        fetchError: true,
      };
    case SELECT_TAG:
      return {
        ...state,
        selectedTag: action.payload,
      };
    case SELECT_ZONE:
    case CLEAR_TAG:
      return {
        ...state,
        selectedTag: null,
      };
    case SELECT_TAG_CONFIG:
      return {
        ...state,
        selectedTagConfig: action.payload,
      };
    case CLEAR_TAG_CONFIG:
      return {
        ...state,
        selectedTagConfig: null,
      };
    case SET_TAG_ERRORS:
      return {
        ...state,
        tagErrors: action.payload,
      };
    case UPDATE_TAGS:
      return {
        ...state,
        Tags: action.payload,
      };
    case SET_TAG_HISTORY:
      return {
        ...state,
        history: { isLoading: false, ...action.payload },
      };
    case SET_TAG_HISTORY_POSITION:
      return {
        ...state,
        loadingPositionHistory: false,
        positionHistory: action.payload,
      };
    case SET_TAG_POSITION_IN_HISTORY:
      return {
        ...state,
        positionIndexInHistory: action.payload,
      };
    case CLEAR_TAG_HISTORY:
      return {
        ...state,
        history: {
          isLoading: true,
          tagZones: [],
          tagAlerts: [],
        },
      };
    case UPDATE_BY_SOCKET:
      return {
        ...state,
        Tags: action.payload,
      };
    case LOADING_TAG_HISTORY_POSITION:
      return {
        ...state,
        loadingPositionHistory: action.payload,
      };
    default:
      return state;
  }
};

export default tagReducer;
