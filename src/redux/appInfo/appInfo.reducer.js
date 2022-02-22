const { SET_INFO } = require("./appInfo.constants");

const initialState = {
  client: "",
  place: "",
};

const appInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_INFO:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default appInfoReducer;
