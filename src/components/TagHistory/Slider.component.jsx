import React, { useState, useEffect } from "react";

import { connect } from "react-redux";
import { makeStyles } from "@material-ui/styles";

import { setTagPositionInHistory } from "redux/tag/tag.actions";

const useStyles = makeStyles((theme) => ({
  slidecontainer: {
    width: "100%" /* Width of the outside container */,
  },

  /* The slider itself */
  slider: {
    "-webkit-appearance": "none" /* Override default CSS styles */,
    appearance: "none",
    width: "100%" /* Full-width */,
    height: "10px" /* Specified height */,
    background: "#d3d3d3" /* Grey background */,
    color: theme.palette.primary.main,
    outline: "none" /* Remove outline */,
    opacity: 0.7 /* Set transparency (for mouse-over effects on hover) */,
    "-webkit-transition": ".2s" /* 0.2 seconds transition on hover */,
    transition: "opacity .2s",
    "&:hover": {
      opacity: 1 /* Fully shown on mouse-over */,
    },
  },
}));

const Slider = ({ value, min, max, setTagPositionInHistory }) => {
  const classes = useStyles();

  const [sliderValue, setSliderValue] = useState(value);

  useEffect(() => {
    setTagPositionInHistory(0);
    setSliderValue(0);
  }, [setTagPositionInHistory]);

  const handleChange = (event) => {
    setSliderValue(event.target.value);
    setTagPositionInHistory(event.target.value);
  };

  return (
    <div className={classes.sliderContainer}>
      <input
        type="range"
        min={min}
        max={max}
        value={sliderValue || 0}
        className={classes.slider}
        id="tagPositionRange"
        onChange={handleChange}
      />
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setTagPositionInHistory: (value) => dispatch(setTagPositionInHistory(value)),
});

export default connect(undefined, mapDispatchToProps)(Slider);
