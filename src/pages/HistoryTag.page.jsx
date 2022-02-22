import React, { useState, useEffect } from "react";

import { useParams, Link } from "react-router-dom";

//redux
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import {
  selectTags,
  historyTagSelector,
  historyPositionSelector,
} from "redux/tag/tag.selector";
import { zoneListSelector } from "redux/zone/zone.selectors";

import {
  getHistory,
  selectTagConfig,
  clearHistory,
  getPositionHistory,
} from "redux/tag/tag.actions";

//styles
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

//components
import InfoTag from "components/TagHistory/InfoTag.component";
import ZoneTable from "components/TagHistory/ZoneTable.component";
import AlertTable from "components/TagHistory/AlertTable.component";
import PositionHistory from "components/TagHistory/PositionHistory.component";
import TagConfigModal from "components/TagModal/Config/TagModalConfig.container";
import Button from "components/Button.component";

const HistoryTag = ({
  tagList,
  getHistory,
  getPositionHistory,
  tagHistory,
  editTag,
  zoneList,
  clearHistory,
  positionHistory,
}) => {
  const classes = useStyles();
  const { address } = useParams();
  const [tag, setTag] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (address && tagList.length > 0) {
      const tagFound = tagList.find((tag) => tag.address === address);
      if (tagFound) {
        setTag(tagFound);
        getHistory(tagFound.id);
      } else {
        setTag(null);
      }
      setIsLoading(false);
    }
  }, [address, getHistory, tagList]);

  useEffect(() => {
    return () => clearHistory();
  }, [clearHistory]);

  return tag ? (
    <section className={classes.container}>
      <InfoTag tag={tag} onEdit={() => editTag(tag)} />
      <ZoneTable
        isLoading={tagHistory.isLoading}
        idTag={tag.id}
        name={tag.address}
        zoneHistory={tagHistory.tagZones}
        zoneList={zoneList}
      />
      <AlertTable
        isLoading={tagHistory.isLoading}
        idTag={tag.id}
        name={tag.address}
        alertHistory={tagHistory.tagAlerts}
        zoneList={zoneList}
      />
      <PositionHistory
        isLoading={tagHistory.isLoading}
        // idTag={tag.id}
        tag={tag}
        getPositionHistory={getPositionHistory}
        positions={positionHistory}
      />
      <TagConfigModal />
    </section>
  ) : (
    <div className={classes.loadingContainer}>
      {isLoading ? (
        <Typography className={classes.infoText}>{"CARGANDO"}</Typography>
      ) : !tag ? (
        <div className={classes.errorContainer}>
          <Typography
            className={classes.infoText}
          >{`No existe un Tag con el ID "${address}"`}</Typography>
          <Button
            className={classes.toTagsButton}
            color="green"
            component={Link}
            to="/tags"
          >
            {"Ver listado de tags"}
          </Button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "2rem",
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "90vh",
  },
  infoText: {
    fontSize: "2rem",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  toTagsButton: {
    fontSize: "1.5rem",
    marginTop: "1rem",
  },
}));

const mapStateToProps = createStructuredSelector({
  tagList: selectTags,
  tagHistory: historyTagSelector,
  zoneList: zoneListSelector,
  positionHistory: historyPositionSelector,
});

const mapDispatchToProps = (dispatch) => ({
  getHistory: (address, page, per_page) =>
    dispatch(getHistory(address, page, per_page)),
  getPositionHistory: (idTag, start_date, end_date) =>
    dispatch(getPositionHistory(idTag, start_date, end_date)),
  editTag: (tag) => dispatch(selectTagConfig(tag)),
  clearHistory: () => dispatch(clearHistory()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HistoryTag);
