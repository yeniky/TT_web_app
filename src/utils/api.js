import axios from 'utils/axios';

const url = process.env.REACT_APP_API_URL;

// APP INFO
const getAppInfo = () => {
  const request = axios.get(`${url}/api/info`);
  return request
    .then((res) => res.data)
    .catch((error) => Promise.reject(error.response.data));
};

const setAppInfo = (client, place) => {
  const request = axios.put(`${url}/api/info`, {
    client,
    place,
  });
  return request
    .then((res) => res.data)
    .catch((error) => Promise.reject(error.response.data));
};

//USER
const login = (username, password) => {
  const request = axios.get(`${url}/api/users/login`, {
    auth: { username, password },
  });
  return request
    .then((res) => res.data)
    .catch((error) => Promise.reject(error.response.data));
};

const getToken = (username, password) => {
  const request = axios.post(`${url}/api/users/token`, null, {
    auth: { username, password },
  });
  return request
    .then((res) => res.data)
    .catch((error) => Promise.reject(error.response.data));
};

const activateAccount = (username, password, token) => {
  const request = axios.post(`${url}/api/users/activate/${token}`, {
    username,
    password,
  });
  return request
    .then((res) => res.data)
    .catch((error) =>
      Promise.reject(
        error.response.status === 400
          ? { message: 'Link de activación inválido.' }
          : { message: 'Ha ocurrido un error.' }
      )
    );
};

const changePassword = (oldPassword, newPassword) => {
  const request = axios.put(`${url}/api/users/password`, {
    old_password: oldPassword,
    password: newPassword,
  });
  return request
    .then((res) => res.data)
    .catch((error) =>
      Promise.reject(
        error.response.status === 400
          ? { message: 'Contraseña actual incorrecta.' }
          : { message: 'Ha ocurrido un error.' }
      )
    );
};

const changeUsername = (id, username, email) => {
  return axios
    .put(`${url}/api/users/${id}`, {
      username,
      email,
    })
    .then((res) => res.data)
    .catch((error) => Promise.reject(error.response.data));
};

//ADMIN
const getUserList = (page, per_page, order_by, order) => {
  return axios
    .get(`${url}/api/users`, { params: { page, per_page, order_by, order } })
    .then((res) => res.data)
    .catch((error) => Promise.reject(error.response.data));
};

const deleteUser = (id) => {
  return axios
    .delete(`${url}/api/users/${id}`)
    .then((res) => res.data)
    .catch((error) => Promise.reject(error.response.data));
};

const createUser = (email) => {
  return axios
    .post(`${url}/api/users`, { email })
    .then((res) => res.data)
    .catch((error) => Promise.reject(error.response.data));
};

//TAGS
const getTags = (
  page = 1,
  per_page = 1000,
  order_by = 'last_timestamp',
  order = 'asc'
) => {
  const request = axios.get(`${url}/api/tags`, {
    params: {
      page,
      per_page,
      order_by,
      order,
    },
  });
  return request.then((response) => {
    return response.data;
  });
};

const configTag = (id, config) => {
  const request = axios.post(`${url}/api/tags/${id}`, config);
  return request.then((resp) => resp.data);
};

const changeTagStatus = (id, activeValue) => {
  const request = axios.post(
    `${url}/api/tags/activate/${id}?active=${activeValue}`
  );
  return request.then((resp) => resp.data);
};

const getTagZoneHistory = (idTag, page, per_page, order_by, order) => {
  const request = axios.get(`${url}/api/tags/${idTag}`, {
    params: {
      page,
      per_page,
      order_by,
      order,
    },
  });
  return request.then((resp) => resp.data);
};

const getTagAlertHistory = (idTag, page, per_page, order_by, order) => {
  const request = axios.get(`${url}/api/alerts/tag_history/${idTag}`, {
    params: {
      page,
      per_page,
      order_by,
      order,
    },
  });
  return request.then((resp) => {
    return resp.data;
  });
};

const getTagPositionHistory = (idTag, dates, count = 1000) => {
  const source = axios?.CancelToken?.source();
  const request = axios.get(
    `${url}/api/tags/positions/${idTag}?start_date=${dates.start_date}&end_date=${dates.end_date}&count=${count}`,
    {
      cancelToken: source.token,
    }
  );
  return request
    .then((resp) => {
      return resp.data;
    })
    .catch((error) => {
      if (axios.isCancel(error)) {
        console.log('Request canceled', error.message);
      } else {
        console.error(error);
      }
    });
};

//ZONES
const getZones = () => {
  const request = axios.get(`${url}/api/zones`);
  return request.then((resp) => resp.data);
};

const addZone = (zone) => {
  const request = axios.post(`${url}/api/zones`, zone);
  return request.then((resp) => resp.data);
};

const editZone = (zone) => {
  const request = axios.put(`${url}/api/zones/${zone.id}`, zone);
  return request.then((resp) => resp.data);
};

const getZoneTagHistory = (idZone, page, per_page, order_by, order) => {
  const request = axios.get(`${url}/api/zones/${idZone}`, {
    params: { page, per_page, order_by, order },
  });
  return request.then((resp) => resp.data);
};

const getZoneAlertHistory = (idZone, page, per_page, order_by, order) => {
  const request = axios.get(`${url}/api/alerts/zone_history/${idZone}`, {
    params: { page, per_page, order_by, order },
  });
  return request.then((resp) => resp.data);
};
const deleteZone = (idZone) => {
  const request = axios.post(`${url}/api/zones/deactivate/${idZone}`);
  return request.then((resp) => resp.data);
};

//ALERTS
const getAlerts = () => {
  const request = axios.get(`${url}/api/alerts`);
  return request.then((resp) => resp.data);
};

const closeAlert = (idAlert) => {
  const request = axios.post(`${url}/api/alerts/${idAlert}`);
  return request.then((resp) => resp.data);
};

const getAlertHistory = (page, per_page, order_by, order) => {
  const request = axios.get(`${url}/api/alerts/history`, {
    params: {
      page,
      per_page,
      order_by,
      order,
    },
  });
  return request.then((resp) => resp.data);
};

//utils
const downloadFile = (file, data) => {
  const request = axios.post(
    `${url}/api/utility/convert?format=${file}`,
    data,
    { responseType: 'blob' }
  );
  return request
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(error.response.data));
};

export default {
  //app info
  getAppInfo,
  setAppInfo,
  //admin
  getUserList,
  deleteUser,
  createUser,
  //user
  login,
  getToken,
  activateAccount,
  changePassword,
  changeUsername,
  //tags
  getTags,
  configTag,
  getTagZoneHistory,
  getTagAlertHistory,
  getTagPositionHistory,
  changeTagStatus,
  //zones
  getZones,
  addZone,
  editZone,
  getZoneTagHistory,
  getZoneAlertHistory,
  deleteZone,
  //alerts
  getAlerts,
  closeAlert,
  getAlertHistory,
  //utils
  downloadFile,
};
