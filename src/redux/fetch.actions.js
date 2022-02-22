import { fetchTags } from "redux/tag/tag.actions";
import { fetchZones } from "redux/zone/zone.actions";
import { fetchAlerts, fetchAlertHistory } from "redux/alerts/alerts.actions";

export const startFetchs = () => (dispatch) => {
  dispatch(fetchTags());
  dispatch(fetchZones());
  dispatch(fetchAlerts());
  dispatch(fetchAlertHistory());
};
