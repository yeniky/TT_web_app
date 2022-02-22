import {
  FETCH_ALERTS,
  CLOSE_ALERT,
  FETCH_ALERT_HISTORY,
  UPDATE_ALERT_SOCKET,
} from "./alerts.constants";

const initialStateAlerts = {
  tag_alerts: [],
  zone_alerts: [],
  history: [],
};

const alertsReducer = (state = initialStateAlerts, action = {}) => {
  switch (action.type) {
    case FETCH_ALERTS:
      return { ...state, ...action.payload };
    case CLOSE_ALERT:
      return { ...state, ...action.payload };
    case FETCH_ALERT_HISTORY:
      return {
        ...state,
        history: action.payload,
      };
    case UPDATE_ALERT_SOCKET:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default alertsReducer;
