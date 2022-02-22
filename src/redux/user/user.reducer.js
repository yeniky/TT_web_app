import { SET_USER, SET_USERNAME } from "redux/user/user.constants";

const stringData = localStorage.getItem("tt_user");
const user = stringData !== "undefined" ? JSON.parse(stringData) : undefined;
const initialState = user || {
  isLogguedIn: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        ...action.payload,
      };
    case SET_USERNAME:
      return {
        ...state,
        username: action.payload.username,
      };
    default:
      return state;
  }
};

export default userReducer;
