import { SET_USER, SET_USERNAME } from "redux/user/user.constants";
import axios from "../../utils/axios";

export const setUser = (user) => (dispatch) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${user?.token}`;
  localStorage.setItem("tt_user", JSON.stringify(user));
  dispatch({
    type: SET_USER,
    payload: user,
  });
};

export const setUsername = (username) => (dispatch) => {
  dispatch({
    type: SET_USERNAME,
    payload: {
      username,
    },
  });
};
