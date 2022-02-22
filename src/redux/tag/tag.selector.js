import { createSelector } from 'reselect';
const selectTag = (state) => state.tag;

export const selectedTag = createSelector([selectTag], (tagState) =>
  tagState.selectedTag
    ? tagState.Tags.find((tag) => tag.id === tagState.selectedTag.id)
    : null
);
export const selectedTagConfig = createSelector(
  [selectTag],
  (tagState) => tagState.selectedTagConfig
);

export const selectTags = createSelector([selectTag], (tag) => tag.Tags);

export const selectTagErrors = createSelector(
  [selectTag],
  (tag) => tag.tagErrors
);

export const historyTagSelector = createSelector(
  [selectTag],
  (tagState) => tagState.history
);
export const historyPositionSelector = createSelector(
  [selectTag],
  (tagState) => tagState.positionHistory
);

export const positionIndexInHistorySelector = createSelector(
  [selectTag],
  (tagState) => tagState.positionIndexInHistory
);

export const activeTagsSelector = createSelector([selectTag], (tag) =>
  tag.Tags.filter((tag) => tag.active)
);

export const loadingPositionHistorySelector = createSelector(
  [selectTag],
  (tagState) => tagState.loadingPositionHistory
);
