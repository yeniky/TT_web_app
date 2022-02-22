import {
  SUCCESS_TAGS,
  LOADING_TAGS,
  FAIL_TAGS,
  SELECT_TAG,
  CLEAR_TAG,
  SELECT_TAG_CONFIG,
  CLEAR_TAG_CONFIG,
  SET_TAG_ERRORS,
  UPDATE_TAGS,
  SET_TAG_HISTORY,
  CLEAR_TAG_HISTORY,
  UPDATE_BY_SOCKET,
  SET_TAG_HISTORY_POSITION,
  SET_TAG_POSITION_IN_HISTORY,
  LOADING_TAG_HISTORY_POSITION,
} from './tag.constants';

//Utils
import API from 'utils/api';
import * as yup from 'yup';

//selectors
import { selectTags, selectedTag } from './tag.selector';

//schema validation
const configSchema = yup.object({
  alerts: yup
    .array(
      yup.object({
        alert_type: yup.string(),
        zone: yup.object(),
        time: yup.number().positive(),
      })
    )
    .optional(),
  alias: yup.string().required('Debe ingresar un Alias'),
  type: yup.string().required('Debe Seleccionar un Tipo'),
  description: yup.string().optional(),
});

export const fetchTags = () => (dispatch) => {
  dispatch({ type: LOADING_TAGS });
  API.getTags()
    // ! Tags.items only will take the first page (default 1000)
    .then((tags) => dispatch({ type: SUCCESS_TAGS, payload: tags.items }))
    .catch((error) => dispatch({ type: FAIL_TAGS }));
};

export const setTag = (tag) => {
  return {
    type: SELECT_TAG,
    payload: tag,
  };
};

export const cleanTag = () => ({ type: CLEAR_TAG });

export const selectTagConfig = (tag) => ({
  type: SELECT_TAG_CONFIG,
  payload: tag,
});

export const clearTagConfig = () => (dispatch) => {
  dispatch({ type: CLEAR_TAG_CONFIG });
  dispatch(setErrors({}));
};

const setErrors = (errors) => ({ type: SET_TAG_ERRORS, payload: errors });

export const setConfig = (tagId, config) => (dispatch, getState) => {
  configSchema
    .validate(config, { abortEarly: false })
    .then(() => {
      API.configTag(tagId, config)
        .then((tagRes) => {
          const tagList = selectTags(getState());
          const isTagSelected = selectedTag(getState());

          const updatedTagList = tagList.map((tag) =>
            tag.id === tagId ? tagRes : tag
          );
          if (isTagSelected) {
            dispatch(setTag(tagRes));
          }
          dispatch(updateTags(updatedTagList));
          dispatch(clearTagConfig());
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

const updateTags = (tagList) => ({ type: UPDATE_TAGS, payload: tagList });

export const getHistory = (idTag, page, per_page) => async (dispatch) => {
  try {
    // const tagZones = await API.getTagZoneHistory(idTag, 1, 1000000);
    // const tagAlerts = await API.getTagAlertHistory(idTag, 1, 1000000);
    dispatch({
      type: SET_TAG_HISTORY,
      // payload: { tagZones, tagAlerts },
      payload: {},
    });
  } catch (error) {
    console.error(error.response);
  }
};
export const getPositionHistory = (
  idTag,
  start_date,
  end_date,
  count = 1000
) => async (dispatch) => {
  try {
    // Creates date with central UTC
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    let positionHistory = await API.getTagPositionHistory(
      idTag,
      {
        start_date: startDate.toJSON().slice(0, 16),
        end_date: endDate.toJSON().slice(0, 16),
      },
      count
    );
    setLoadingPositionHistory(false);
    dispatch({
      type: SET_TAG_HISTORY_POSITION,
      payload: positionHistory,
    });
  } catch (error) {
    setTagPositionInHistory(false);
    console.error(error.response);
  }
};

export const setLoadingPositionHistory = (loading) => (dispatch) => {
  dispatch({
    type: LOADING_TAG_HISTORY_POSITION,
    payload: loading,
  });
};

export const setTagPositionInHistory = (positionIndex) => async (dispatch) => {
  try {
    dispatch({
      type: SET_TAG_POSITION_IN_HISTORY,
      payload: positionIndex,
    });
  } catch (error) {
    console.error(error.response);
  }
};

export const clearHistory = () => ({ type: CLEAR_TAG_HISTORY });

export const updateTagSocket = (socketTagList) => (dispatch, getState) => {
  const tagList = selectTags(getState());

  const hashOldTags = Object.fromEntries(
    tagList.map((tag) => [tag.address, tag])
  );
  const hashNewTags = Object.fromEntries(
    socketTagList.map((tag) => [tag.address, tag])
  );

  const updatedTagHash = { ...hashOldTags, ...hashNewTags };

  const updatedTags = Object.keys(updatedTagHash).map((key) => ({
    ...updatedTagHash[key],
  }));
  dispatch({
    type: UPDATE_BY_SOCKET,
    payload: updatedTags,
  });
};

export const changeTagStatus = (id, status) => (dispatch, getState) => {
  API.changeTagStatus(id, status).then((tagRes) => {
    const tagList = selectTags(getState());
    const updatedTags = tagList.map((tag) =>
      tag.id === tagRes.id ? tagRes : tag
    );
    dispatch(updateTags(updatedTags));
  });
};
