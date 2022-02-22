import { createStore, applyMiddleware, compose } from "redux";
// import { createLogger } from "redux-logger";
import thunk from "redux-thunk";

import rootReducer from "./rootReducers";

// const logger = createLogger();
// const middlewares = [thunk, logger];
const middlewares = [thunk];

const composeEnhancers =
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      trace: true,
      traceLimit: 25,
    })) ||
  compose;

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middlewares))
);
