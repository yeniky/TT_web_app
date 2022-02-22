const { SET_INFO } = require("./appInfo.constants");

export const setAppInfo = (client, place) => (dispatch) => {
  dispatch({
    type: SET_INFO,
    payload: {
      client,
      place,
    },
  });
};
