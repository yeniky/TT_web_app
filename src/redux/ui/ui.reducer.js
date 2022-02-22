import { SET_DISPLAY_ZONES, SET_DISPLAY_ALERT_MODAL } from "./ui.constants";

const initialStateUI = {
  displayZones: false,
  displayAlertsModal: false,
};

const uiReducer = (state = initialStateUI, action = {}) => {
  switch (action.type) {
    case SET_DISPLAY_ZONES:
      return {
        ...state,
        displayZones: action.payload,
      };
    case SET_DISPLAY_ALERT_MODAL:
      return {
        ...state,
        displayAlertsModal: action.payload,
      };
    default:
      return state;
  }
};

export default uiReducer;
