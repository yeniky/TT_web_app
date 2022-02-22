import { SET_DISPLAY_ZONES, SET_DISPLAY_ALERT_MODAL } from "./ui.constants";

export const setDisplayZones = (value) => ({
  type: SET_DISPLAY_ZONES,
  payload: value,
});

export const setDisplayAlertsModal = (value) => ({
  type: SET_DISPLAY_ALERT_MODAL,
  payload: value,
});
