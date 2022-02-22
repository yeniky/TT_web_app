import {
  LOADING_ZONES,
  SUCCESS_ZONES,
  FAIL_ZONES,
  CLEAR_SELECTED_ZONE,
  SELECT_ZONE,
  SELECT_ZONE_CONFIG,
  CLEAR_CONFIG_ZONE,
  SET_ZONE_ERRORS,
  UPDATE_ZONES,
  SET_ZONE_HISTORY,
  CLEAR_ZONE_HISTORY,
  SET_CREATING_ZONE,
} from './zone.constant';

import { SELECT_TAG } from 'redux/tag/tag.constants';

const initialStateZones = {
  zones: [],
  isLoading: false,
  selectedZone: null,
  selectedZoneConfig: null,
  zoneErrors: {},
  history: {
    isLoading: true,
    zoneTags: [],
    zoneAlerts: [],
  },
  creatingZone: false,
};

const zoneReducer = (state = initialStateZones, action = {}) => {
  switch (action.type) {
    case LOADING_ZONES:
      return {
        ...state,
        isLoading: true,
      };
    case SUCCESS_ZONES:
      return {
        ...state,
        isLoading: false,
        zones: action.payload,
      };
    case UPDATE_ZONES:
      return {
        ...state,
        zones: action.payload,
      };
    case FAIL_ZONES:
      return {
        ...state,
        isLoading: false,
      };
    case SELECT_ZONE:
      return {
        ...state,
        selectedZone: action.payload,
      };
    case SELECT_TAG:
    case CLEAR_SELECTED_ZONE:
      return {
        ...state,
        selectedZone: null,
      };
    case SELECT_ZONE_CONFIG:
      return {
        ...state,
        selectedZoneConfig: action.payload,
      };
    case CLEAR_CONFIG_ZONE:
      return {
        ...state,
        selectedZoneConfig: null,
      };
    case SET_ZONE_ERRORS:
      return {
        ...state,
        zoneErrors: action.payload,
      };
    case SET_ZONE_HISTORY:
      return {
        ...state,
        history: { isLoading: false, ...action.payload },
      };
    case CLEAR_ZONE_HISTORY:
      return {
        ...state,
        history: {
          isLoading: true,
          zoneTags: [],
          zoneAlerts: [],
        },
      };
    case SET_CREATING_ZONE:
      return {
        ...state,
        creatingZone: action.payload,
      };
    default:
      return state;
  }
};

export default zoneReducer;
