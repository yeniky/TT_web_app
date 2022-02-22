import { createSelector } from "reselect";

import { selectedTag } from "redux/tag/tag.selector";
import { selectedZone } from "redux/zone/zone.selectors";

const alertStoreSelector = (state) => state.alerts;

export const tagAlertsSelector = createSelector(
  [alertStoreSelector],
  (alert) => alert.tag_alerts
);
export const zoneAlertsSelector = createSelector(
  [alertStoreSelector],
  (alert) => alert.zone_alerts
);
export const alertsSelector = createSelector(
  [tagAlertsSelector, zoneAlertsSelector],
  (tags, zones) =>
    [...tags, ...zones].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    )
);

export const countAlerts = createSelector(
  [alertsSelector],
  (alertState) => alertState.length
);

export const alertsInTag = createSelector(
  [tagAlertsSelector, selectedTag],
  (alerts, tag) =>
    tag ? alerts.filter((alert) => alert.tag.address === tag.address) : []
);
export const alertsInZone = createSelector(
  [zoneAlertsSelector, selectedZone],
  (alerts, zone) =>
    zone ? alerts.filter((alert) => alert.zone.alias === zone.alias) : []
);

const getZoneId = (_, props) => props.zone.id;

export const zoneHasAlerts = createSelector(
  [zoneAlertsSelector, getZoneId],
  (alerts, id) => alerts.filter((alert) => alert.zone.id === id).length > 0
);

export const alertHistorySelector = createSelector(
  [alertStoreSelector],
  (alertState) => alertState.history
);

const getTagAddress = (_, props) => props.tag.id;

export const tagHasAlerts = createSelector(
  [tagAlertsSelector, getTagAddress],
  (alerts, id) =>
    alerts.filter((alert) => alert.tag.id === id && alert.active).length > 0
);
