import { combineReducers } from "redux";

import tagReducer from "redux/tag/tag.reducer";
import zoneReducer from "redux/zone/zone.reducer";
import uiReducer from "redux/ui/ui.reducer";
import alertReducer from "redux/alerts/alerts.reducer";
import userReducer from "redux/user/user.reducer";
import appInfoReducer from "./appInfo/appInfo.reducer";

const rootReducer = combineReducers({
  tag: tagReducer,
  zone: zoneReducer,
  ui: uiReducer,
  alerts: alertReducer,
  user: userReducer,
  appInfo: appInfoReducer,
});

export default rootReducer;
