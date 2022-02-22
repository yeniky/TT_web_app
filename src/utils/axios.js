import axios from "axios";

import { store } from "redux/store";
import { setUser } from "redux/user/user.actions";

const axios_instace = axios.create();

const stringData = localStorage.getItem("tt_user");
const user = stringData !== "undefined" ? JSON.parse(stringData) : undefined;
if (user?.isLogguedIn) {
  axios_instace.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${user?.token}`;
}

axios_instace.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      store.dispatch(setUser({ isLogguedIn: false }));
    }
    return Promise.reject(error);
  }
);

axios_instace.CancelToken = axios.CancelToken;
axios_instace.isCancel = axios.isCancel;

export default axios_instace;
