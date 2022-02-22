import React, { useState, useEffect } from "react";

//router
import { useHistory } from "react-router-dom";

//redux
import { connect } from "react-redux";

import { selectedTag, selectedTagConfig } from "redux/tag/tag.selector";
import { alertsInTag } from "redux/alerts/alerts.selectors";

import {
  cleanTag,
  selectTagConfig,
  changeTagStatus,
} from "redux/tag/tag.actions";

//style components
import {
  Popper,
  Typography,
  ClickAwayListener,
  Dialog,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Warning } from "@material-ui/icons";
import selectedTagIcon from "assets/images/selectedMarker.png";

//components
import ConfirmModal from "components/ConfirmModal.component";
import AlertList from "components/Alerts/AlertList.component";
import Button from "components/Button.component";
import IconButton from "components/IconButton.component";

//utils
import { getMinutesDifference, getTagType } from "utils";

const TagInfo = ({
  tagSelected,
  onExit,
  onConfig,
  onChangeStatus,
  inConfig,
  alerts,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const [isDeactivating, setDeactivating] = useState(false);
  const [open, setOpen] = useState(false);
  const [change, setChange] = useState(true); //if tag change not close with click away listener
  useEffect(() => {
    setOpen(!!tagSelected);
    setChange(true);
  }, [tagSelected]);

  useEffect(() => {
    return () => onExit();
  }, [onExit]);

  const CustomWrapper =
    history.location.pathname === "/dashboard" ? Popper : Dialog;
  const CustomProps =
    history.location.pathname === "/dashboard"
      ? {
          anchorEl: document.getElementById("map"),
          placement: "right",
        }
      : { maxWidth: false };

  return (
    <ClickAwayListener
      onClickAway={() =>
        history.location.pathname === "/dashboard" //only works on dashboard
          ? !inConfig //if tag is in config modal click away listener is disabled
            ? change
              ? setChange(false)
              : onExit()
            : setChange(true)
          : null
      }
    >
      <CustomWrapper className={classes.modal} open={open} {...CustomProps}>
        {tagSelected ? (
          <div className={classes.content}>
            <div className={classes.modalHeader}>
              <Typography className={classes.modalHeaderText} component="h1">
                <img
                  className={classes.selectedTagIcon}
                  src={selectedTagIcon}
                  alt="icono tag seleccionado"
                />
                {`TAG ${tagSelected.address}`}
              </Typography>
              <IconButton cancel onClick={() => onExit()} />
            </div>
            <div className={classes.infoContent}>
              {tagSelected.config && (
                <div className={classes.modalInfo}>
                  <Typography
                    className={classes.bodyText}
                    component="p"
                  >{`Alias: ${tagSelected.config.alias}`}</Typography>
                  <Typography
                    className={classes.bodyText}
                    component="p"
                  >{`Tipo: ${getTagType(tagSelected.config.type)}`}</Typography>
                  <Typography
                    className={classes.bodyText}
                    component="p"
                  >{`Descripción: ${tagSelected.config.description}`}</Typography>
                </div>
              )}
              <div className={classes.modalInfo}>
                <Typography
                  className={classes.bodyText}
                  component="p"
                >{`Zona: ${
                  tagSelected.zone ? tagSelected.zone.alias : "-"
                }`}</Typography>
                <Typography
                  className={classes.bodyText}
                  component="p"
                >{`Intensidad: ${tagSelected.signal}%`}</Typography>
                <Typography className={classes.bodyText} component="p">
                  {`Ultima Actualizacion: ${
                    tagSelected.last_timestamp
                      ? `hace ${getMinutesDifference(
                          tagSelected.last_timestamp
                        )} minutos`
                      : "-"
                  }`}
                </Typography>
              </div>
              {tagSelected.config ? (
                <AlertList alerts={alerts} type="tag" />
              ) : (
                <div className={classes.config}>
                  <Warning className={classes.alertIcon} />
                  <Typography style={{ fontSize: "0.8rem", marginLeft: 5 }}>
                    {"¡TAG SIN CONFIGURAR!"}
                  </Typography>
                </div>
              )}
            </div>

            <div className={classes.buttonsContainers}>
              <div className={classes.buttons}>
                <Button
                  className={classes.button}
                  color="darkGrey"
                  onClick={() =>
                    history.push(`/tagHistory/${tagSelected.address}`)
                  }
                >
                  {"HISTORIAL"}
                </Button>
                <Button
                  className={classes.button}
                  color="green"
                  onClick={() => {
                    onConfig(tagSelected);
                    setChange(true);
                  }}
                >
                  {"CONFIGURAR"}
                </Button>
              </div>
              <Button
                className={classes.statusButton}
                color={tagSelected.active ? "red" : "blue"}
                onClick={() =>
                  tagSelected.active
                    ? setDeactivating(true)
                    : onChangeStatus(tagSelected.id, true)
                }
              >
                {tagSelected.active ? "DESACTIVAR" : "ACTIVAR"}
              </Button>
            </div>
            <ConfirmModal
              open={isDeactivating}
              title="¿Desea desactivar este Tag?"
              onConfirm={() => {
                onChangeStatus(tagSelected.id, !tagSelected.active);
                setDeactivating(false);
              }}
              onCancel={() => setDeactivating(false)}
            />
          </div>
        ) : (
          <></>
        )}
      </CustomWrapper>
    </ClickAwayListener>
  );
};

const useStyles = makeStyles((theme) => ({
  modal: {
    zIndex: 1200,
  },
  content: {
    backgroundColor: "white",
    padding: "0.4rem",
    border: "solid black 2px",
    width: "20rem",
    display: "flex",
    flexDirection: "column",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalHeaderText: {
    display: "flex",
    fontSize: "1.3rem",
    fontWeight: 800,
    alignItems: "center",
  },
  selectedTagIcon: {
    width: "2.2rem",
    marginRight: 7,
  },
  bodyText: {
    lineHeigh: "0.3rem",
    maxWidth: "90%",
  },
  config: {
    display: "flex",
    alignItems: "center",
    color: theme.palette.common.red,
    justifyContent: "center",
    marginTop: "1rem",
  },
  buttonsContainers: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  buttons: {
    width: "100%",
    marginTop: "1rem",
    display: "flex",
    justifyContent: "space-between",
  },
  button: {
    width: "49%",
  },
  statusButton: {
    width: "100%",
    marginTop: "0.5rem",
  },
  infoContent: {
    margin: "0.5rem 0.2rem",
    marginRight: 0,
  },
}));

const mapStateToProps = (state) => ({
  tagSelected: selectedTag(state),
  inConfig: selectedTagConfig(state),
  alerts: alertsInTag(state),
});

const mapDispatchToProps = (dispatch) => ({
  onExit: () => dispatch(cleanTag()),
  onConfig: (tag) => dispatch(selectTagConfig(tag)),
  onChangeStatus: (id, status) => dispatch(changeTagStatus(id, status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TagInfo);
