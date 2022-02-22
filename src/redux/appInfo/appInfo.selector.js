import { createSelector } from "reselect";

const appInfoSelector = (state) => state.appInfo;

export const selectAppInfo = createSelector(
  [appInfoSelector],
  (appInfo) => appInfo
);
