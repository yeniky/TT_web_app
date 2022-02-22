import {
  LOADING_ZONES,
  SUCCESS_ZONES,
  FAIL_ZONES,
  CLEAR_SELECTED_ZONE,
  SELECT_ZONE,
  SELECT_ZONE_CONFIG,
  CLEAR_CONFIG_ZONE,
  SET_ZONE_ERRORS,
  UPDATE_ZONES,
  SET_ZONE_HISTORY,
  CLEAR_ZONE_HISTORY,
  SET_CREATING_ZONE,
} from './zone.constant';

//utils
import API from 'utils/api';
import * as yup from 'yup';

//selectors
import { selectZones } from './zone.selectors';

//schema validation
const zoneSchema = yup.object({
  alerts: yup.array(),
  alias: yup.string().required('Debe ingresar un Alias'),
  area: yup.array(),
  description: yup.string().optional(),
});

export const fetchZones = () => (dispatch) => {
  dispatch({ type: LOADING_ZONES });
  API.getZones()
    .then((zones) => {
      dispatch({ type: SUCCESS_ZONES, payload: zones });
    })
    .catch((error) => dispatch({ type: FAIL_ZONES }));
};

export const setSelectedZone = (zone) => ({ type: SELECT_ZONE, payload: zone });

export const clearSelectedZone = () => (dispatch) => {
  dispatch({ type: CLEAR_SELECTED_ZONE });
};

export const selectZoneToConfig = (newZone, zoneToConfig) => (dispatch) => {
  if (newZone) {
    const area = [
      [zoneToConfig._southWest.lng, zoneToConfig._southWest.lat],
      [zoneToConfig._northEast.lng, zoneToConfig._northEast.lat],
    ];
    dispatch({
      type: SELECT_ZONE_CONFIG,
      payload: { alias: '', area, description: '', alerts: [] },
    });
  } else {
    dispatch({
      type: SELECT_ZONE_CONFIG,
      payload: zoneToConfig,
    });
  }
};

export const clearSelectedZoneConfig = () => (dispatch) => {
  dispatch({ type: CLEAR_CONFIG_ZONE });
  dispatch(setErrors({}));
};

const setErrors = (errors) => ({ type: SET_ZONE_ERRORS, payload: errors });

export const updateZones = (zoneList) => ({
  type: UPDATE_ZONES,
  payload: zoneList,
});

export const addNewZone = (zone) => (dispatch, getState) => {
  zoneSchema
    .validate(zone, { abortEarly: false })
    .then(() => {
      API.addZone(zone)
        .then((zoneRes) => {
          const zoneList = selectZones(getState());
          const updatedZones = [...zoneList, zoneRes];
          dispatch(updateZones(updatedZones));
          dispatch(clearSelectedZoneConfig());
        })
        .catch((err) => {
          if (
            err.response &&
            err.response.data &&
            err.response.data.message &&
            err.response.data.message.alias
          ) {
            dispatch(setErrors({ alias: 'El alias debe ser unico' }));
          }
        });
    })
    .catch(({ inner }) => {
      const formErrors = inner.reduce(
        (obj, item) => ({ ...obj, [item.path]: item.message }),
        {}
      );
      dispatch(setErrors(formErrors));
    });
};

export const editZone = (zone) => (dispatch, getState) => {
  zoneSchema
    .validate(zone, { abortEarly: false })
    .then(() => {
      API.editZone(zone)
        .then((zoneRes) => {
          const zoneList = selectZones(getState());
          const updatedZones = zoneList.map((zone) =>
            zone.id === zoneRes.id ? zoneRes : zone
          );
          dispatch(updateZones(updatedZones));
          dispatch(setSelectedZone(zoneRes));
          dispatch(clearSelectedZoneConfig());
        })
        .catch((err) => {
          if (
            err.response &&
            err.response.data &&
            err.response.data.message &&
            err.response.data.message.alias
          ) {
            dispatch(setErrors({ alias: 'El alias debe ser unico' }));
          }
        });
    })
    .catch(({ inner }) => {
      const formErrors = inner.reduce(
        (obj, item) => ({ ...obj, [item.path]: item.message }),
        {}
      );
      dispatch(setErrors(formErrors));
    });
};

export const getHistory = (idZone) => async (dispatch) => {
  try {
    const zoneTags = await API.getZoneTagHistory(idZone);
    const zoneAlerts = await API.getZoneAlertHistory(idZone);
    dispatch({ type: SET_ZONE_HISTORY, payload: { zoneTags, zoneAlerts } });
  } catch (error) {
    console.error(error.response);
  }
};

export const clearHistory = () => ({ type: CLEAR_ZONE_HISTORY });

export const deleteZone = (zoneId) => (dispatch, getState) => {
  API.deleteZone(zoneId).then((zoneRes) => {
    const zoneList = selectZones(getState());
    const updatedZones = zoneList.map((zone) =>
      zone.id === zoneRes.id ? zoneRes : zone
    );
    dispatch(clearSelectedZone());
    dispatch(updateZones(updatedZones));
  });
};

export const setCreatingZone = (status) => ({
  type: SET_CREATING_ZONE,
  payload: status,
});
