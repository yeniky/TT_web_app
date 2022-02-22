import {
  FETCH_ALERTS,
  CLOSE_ALERT,
  FETCH_ALERT_HISTORY,
  UPDATE_ALERT_SOCKET,
} from './alerts.constants';

import API from 'utils/api';
import { zoneAlertsSelector, tagAlertsSelector } from './alerts.selectors';

export const fetchAlerts = () => (dispatch) => {
  API.getAlerts().then((alerts) => {
    const tag_alerts = alerts.filter(
      (alert) => alert.owner_type === 'tag_alert_rule'
    );
    const zone_alerts = alerts.filter(
      (alert) => alert.owner_type === 'zone_alert_rule'
    );
    dispatch({ type: FETCH_ALERTS, payload: { tag_alerts, zone_alerts } });
  });
};

export const closeAlert = (idAlert) => (dispatch, getState) => {
  API.closeAlert(idAlert)
    .then((alertRes) => {
      if (alertRes.owner_type === 'tag_alert_rule') {
        const alertTagList = tagAlertsSelector(getState());
        const tag_alerts = alertTagList.filter(
          (alert) => alert.id !== alertRes.id
        );
        dispatch({ type: CLOSE_ALERT, payload: { tag_alerts } });
      } else {
        const alertZoneList = zoneAlertsSelector(getState());
        const zone_alerts = alertZoneList.filter(
          (alert) => alert.id !== alertRes.id
        );
        dispatch({ type: CLOSE_ALERT, payload: { zone_alerts } });
      }
    })
    .catch((e) => {
      console.error(e.response.data.message);
    });

  dispatch(fetchAlerts());
};

export const fetchAlertHistory = () => (dispatch) => {
  API.getAlertHistory().then((history) =>
    dispatch({ type: FETCH_ALERT_HISTORY, payload: history })
  );
};

export const updateAlertSocket = (newAlerts) => (dispatch, getState) => {
  const oldTagAlerts = tagAlertsSelector(getState());
  const oldZoneAlerts = zoneAlertsSelector(getState());
  const tag_alerts = newAlerts.filter(
    (alert) => alert.owner_type === 'tag_alert_rule'
  );
  const zone_alerts = newAlerts.filter(
    (alert) => alert.owner_type === 'zone_alert_rule'
  );

  dispatch(fetchAlertHistory());

  dispatch({
    type: UPDATE_ALERT_SOCKET,
    payload: {
      tag_alerts: [...tag_alerts, ...oldTagAlerts],
      zone_alerts: [...zone_alerts, ...oldZoneAlerts],
    },
  });
};
