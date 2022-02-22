import React, { useState, useEffect } from 'react';

//redux
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  historyPositionSelector,
  positionIndexInHistorySelector,
  loadingPositionHistorySelector,
} from 'redux/tag/tag.selector';

import {
  getPositionHistory,
  setTagPositionInHistory,
  setLoadingPositionHistory,
} from 'redux/tag/tag.actions';

//leaflet
import Leaflet from 'leaflet';
import { Map, Polyline, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

//styles components
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import blueMarker from 'assets/images/blueMarker.png';

//components
import Input from 'components/Input.component';
import Slider from '@material-ui/core/Slider';
import Loading from 'components/Loading.hoc';
import Button from 'components/Button.component';
import MapImageOverlay from 'components/Map/CustomImageOverlay';

// utils
import {
  downloadFile,
  isValidDateInterval,
  previousMonth,
  previousWeek,
  previousDay,
  previousHour,
  splitDate,
} from 'utils';
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';
import axios from 'utils/axios';
import moment from 'moment';

const PositionHistory = ({
  tag,
  positions,
  getHistory,
  positionIndexInHistory,
  setTagPositionInHistory,
  setLoadingPositionHistory,
  loadingPositionHistory,
}) => {
  const classes = useStyles();

  const utcOffset = moment().utcOffset();

  const [dateFilter, setDateFilter] = useState({
    start_date: new Date().toJSON().slice(0, 10),
    end_date: new Date().toJSON().slice(0, 10),
    start_time: '00:00',
    end_time: '23:59',
  });

  const [tagPositions, setTagPositions] = useState([]);

  const bounds = [
    [-0.8, -2.65],
    [6.25, 6.5],
  ];

  const tagIcon = new Leaflet.Icon({
    iconUrl: blueMarker,
    iconSize: [25, 35],
  });
  const { start_date, end_date, start_time, end_time } = dateFilter;

  useEffect(() => {
    if (positions && positions.length > 0) {
      setTagPositionInHistory(
        Math.min(positionIndexInHistory, positions.length - 1)
      );
      setTagPositions(
        positions.map((point) => [point.y, point.x, point.timestamp])
      );
    } else {
      setTagPositions([]);
      setTagPositionInHistory(0);
    }
  }, [
    positions,
    // setTagPositionInHistory
  ]);

  const handleGetHistory = () => {
    setTagPositions([]);
    setTagPositionInHistory(0);
    axios.CancelToken.source().cancel('Canceled by user');
    if (
      Object.values({ start_date, end_date, start_time, end_time }).every(
        Boolean
      ) &&
      isValidDateInterval(start_date, start_time, end_date, end_time)
    ) {
      setLoadingPositionHistory(true);
      getHistory(
        tag.id,
        `${start_date}T${start_time}`,
        `${end_date}T${end_time}`,
        1000
      );
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDateFilter({ ...dateFilter, [name]: value });
  };

  const handleDownloadPdf = async () => {
    const input = document.getElementById('toPdf');

    const imgData = await domtoimage.toPng(input);
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [1100, 619],
    });

    pdf.text(`${start_date} ${start_time}  -`, 25, 80);
    pdf.text(`  ${end_date} ${end_time}`, 130, 80);
    pdf.addImage(imgData, 'PNG', 25, 120);
    pdf.save(
      `${start_date}T${start_time.replace(
        ':',
        '-'
      )}_${end_date}T${end_time.replace(':', '-')}.pdf`
    );
  };

  const handleDownloadFile = (file) => {
    const documentTitles = ['Tag', 'Fecha', 'X', 'Y'];
    const documentData = tagPositions.map((t) => [
      tag.address,
      t[2],
      t[1],
      t[0],
    ]);
    const formatDownloadData = {
      title: 'Historial de Ubicación',
      table: [documentTitles, ...documentData],
    };
    downloadFile(
      file,
      formatDownloadData,
      `Tag_${tag.address}_historial_ubicación`
    );
  };

  const setPredefinedDateRange = (previousDate) => {
    const { date: prevDate, time: prevTime } = splitDate(previousDate());
    const { date, time } = splitDate(new Date());
    setDateFilter({
      start_date: prevDate,
      end_date: date,
      start_time: prevTime,
      end_time: time,
    });
  };

  const dateButtons = [
    {
      label: 'Último mes',
      handleClick: () => setPredefinedDateRange(previousMonth),
    },
    {
      label: 'Última semana',
      handleClick: () => setPredefinedDateRange(previousWeek),
    },
    {
      label: 'Último día',
      handleClick: () => setPredefinedDateRange(previousDay),
    },
    {
      label: 'Última hora',
      handleClick: () => setPredefinedDateRange(previousHour),
    },
  ];

  const buttons = [
    {
      label: 'descargar pdf',
      handleClick: () => handleDownloadPdf(),
    },
    {
      label: 'descargar xls',
      handleClick: () => handleDownloadFile('xls'),
    },
  ];

  const handleSliderChange = (event, value) => {
    setTagPositionInHistory(value);
  };

  return (
    <section>
      <Typography className={classes.title} variant="h4">
        {'HISTORIAL DE UBICACIÓN'}
      </Typography>
      <div className={classes.dateButtonsContainer}>
        {dateButtons &&
          dateButtons.map((buttonItem) => (
            <Button
              className={classes.dateButtons}
              key={buttonItem.label}
              color="blue"
              onClick={buttonItem.handleClick}
            >
              {buttonItem.label}
            </Button>
          ))}
      </div>
      <div className={classes.filterAndButtons}>
        <div className={classes.filter}>
          <Typography className={classes.label}>{'Fecha Inicio'}</Typography>
          <Input
            className={classes.datePicker}
            id="start_date"
            name="start_date"
            type="date"
            value={start_date}
            maxDate={end_date}
            handleChange={handleChange}
          />
          <Input
            className={classes.timePicker}
            id="start_time"
            name="start_time"
            type="time"
            value={start_time}
            handleChange={handleChange}
          />
          <Typography className={classes.label}>{'Fecha Termino'}</Typography>
          <Input
            className={classes.datePicker}
            id="end_date"
            name="end_date"
            type="date"
            value={end_date}
            maxDate={new Date().toJSON().slice(0, 10)}
            handleChange={handleChange}
          />
          <Input
            className={classes.timePicker}
            id="end_time"
            name="end_time"
            type="time"
            value={end_time}
            handleChange={handleChange}
          />
          <Button
            className={classes.buttonProps}
            key={'getHistoryButton'}
            color="green"
            onClick={handleGetHistory}
            disabled={
              !isValidDateInterval(start_date, start_time, end_date, end_time)
            }
          >
            Consultar
          </Button>
        </div>
        <div>
          {buttons &&
            buttons.map((buttonItem) => (
              <Button
                className={classes.buttonProps}
                key={buttonItem.label}
                color="green"
                onClick={buttonItem.handleClick}
                disabled={tagPositions.length === 0}
              >
                {buttonItem.label}
              </Button>
            ))}
        </div>
      </div>

      {tagPositions && tagPositions.length > 0 ? (
        <div className={classes.sliderContainer}>
          <Slider
            classes={{
              track: classes.track,
              valueLabel: classes.valueLabel,
            }}
            className={classes.slider}
            defaultValue={0}
            valueLabelFormat={(value) =>
              `${moment
                .utc(tagPositions[value][2])
                .utcOffset(utcOffset)
                .format('DD/MM/YYYY')}
                ${moment
                  .utc(tagPositions[value][2])
                  .utcOffset(utcOffset)
                  .format('hh:mm:ssA')}`
            }
            aria-labelledby="discrete-slider"
            valueLabelDisplay="on"
            step={1}
            min={0}
            max={tagPositions.length - 1}
            onChange={handleSliderChange}
          />
        </div>
      ) : undefined}

      <div className={classes.mapContainer} id="toPdf">
        <Map
          className={classes.leafletMap}
          center={[5.1, 0.2]}
          minZoom={5}
          zoom={6}
          maxZoom={11}
          maxBounds={bounds}
          crs={Leaflet.CRS.Simple}
          maxBoundsViscosity={0.8}
        >
          <MapImageOverlay bounds={bounds} />

          {/* <Polyline positions={tagPositions} /> */}
          {tagPositions.length > 0 ? (
            <>
              <Polyline positions={tagPositions} />
              <Marker
                position={tagPositions[positionIndexInHistory || 0]}
                icon={tagIcon}
              />
            </>
          ) : loadingPositionHistory ? (
            <div className={`leaflet-pane ${classes.spinnerContainer}`}>
              {Loading(<></>)({ isLoading: true })}
            </div>
          ) : null}
        </Map>
      </div>
    </section>
  );
};

const useStyles = makeStyles((theme) => ({
  mapContainer: {
    height: '45rem',
    width: '100%',
    padding: 0,
    margin: 0,
    borderBottom: '1px solid black',
    boxShadow: '1px 2px 2px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.2s ease-in-out',
  },
  sliderContainer: {
    marginTop: '3rem',
    marginBottom: '2rem',
    display: 'flex',
    justifyContent: 'center',
  },
  sliderLabelsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  leafletMap: {
    width: '100%',
    height: '100%',
    zIndex: '1',
    position: 'relative',
  },
  datePicker: {
    width: '12rem',
    marginRight: '1rem',
  },
  timePicker: {
    width: '9rem',
    marginRight: '1rem',
  },
  filterAndButtons: {
    display: 'flex',
    margin: '1rem 0',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateButtonsContainer: {
    marginTop: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  dateButtons: {
    marginRight: '1rem',
    fontSize: '1rem',
  },
  filter: {
    display: 'flex',
    margin: '1rem 0',
    alignItems: 'center',
  },
  label: {
    fontSize: '1.2rem',
    marginRight: '0.5rem',
  },
  buttonProps: {
    marginLeft: '1rem',
    //height: "2.5rem",
    fontSize: '1rem',
  },
  track: {
    // width: "32px",
    height: '4px',
  },
  valueLabel: {
    color: 'rgba(0,0,0,0)',
    '& span': {
      '& span': {
        transform: 'scale(1.2) rotate(45deg)',
      },
    },
  },
  slider: {
    width: '98%',
  },
  spinnerContainer: {
    marginTop: '20%',
    marginLeft: '50%',
    transform: 'scale(3)',
  },
}));

const mapStateToProps = createStructuredSelector({
  positions: historyPositionSelector,
  positionIndexInHistory: positionIndexInHistorySelector,
  loadingPositionHistory: loadingPositionHistorySelector,
});

const mapDispatchToProps = (dispatch) => ({
  getHistory: (id, start, end, count) =>
    dispatch(getPositionHistory(id, start, end, count)),
  setTagPositionInHistory: (value) => dispatch(setTagPositionInHistory(value)),
  setLoadingPositionHistory: (loading) =>
    dispatch(setLoadingPositionHistory(loading)),
});

export default Loading(
  connect(mapStateToProps, mapDispatchToProps)(PositionHistory)
);
