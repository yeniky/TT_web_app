import { createSelector } from 'reselect';

const selectZone = (state) => state.zone;

export const selectZones = createSelector([selectZone], (zone) =>
  zone.zones.filter((zone) => zone.active)
);
export const zoneListSelector = createSelector(
  [selectZone],
  (zone) => zone.zones
);

export const selectedZone = createSelector(
  [selectZone],
  (zone) => zone.selectedZone
);
export const selectedZoneConfig = createSelector(
  [selectZone],
  (zone) => zone.selectedZoneConfig
);

export const selectZoneErrors = createSelector(
  [selectZone],
  (zone) => zone.zoneErrors
);

export const historyZoneSelector = createSelector(
  [selectZone],
  (zoneState) => zoneState.history
);

export const creatingZoneSelector = createSelector(
  [selectZone],
  (zoneState) => zoneState.creatingZone
);
