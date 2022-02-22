import { createSelector } from "reselect";

const selectUiStore = (state) => state.ui;

export const selectDisplayZone = createSelector(
  [selectUiStore],
  (ui) => ui.displayZones
);
export const selectDisplayAlertsModal = createSelector(
  [selectUiStore],
  (ui) => ui.displayAlertsModal
);
