import React, { useState, useEffect, useMemo } from 'react';

//redux
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { alertHistorySelector } from 'redux/alerts/alerts.selectors';

import { zoneListSelector } from 'redux/zone/zone.selectors';

import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import Table from 'components/Table/Table.container';
import SearchAndButton from 'components/SearchAndButtons.component';

//hooks
import useSearch from 'hooks/useSearch';

//utils
import API from 'utils/api';
import {
  DEFAULT_PAGE_SIZE,
  getAlertType,
  getTagType,
  tagTypesES,
  alertTypesES,
  downloadFile,
  formatDateString,
} from 'utils';

const HistoryAlert = ({ zoneList }) => {
  const classes = useStyles();
  const [downloadData, setDownloadData] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    has_next: false,
    items: [],
    page: 0,
    per_page: DEFAULT_PAGE_SIZE,
    total_pages: 1,
    total: 0,
    orderBy: 'timestamp',
    order: 'asc',
  });

  const {
    page,
    per_page: pageSize,
    items: Alerts,
    total_pages,
    total,
    orderBy,
    order,
  } = pageInfo;

  const [changingPage, setChangingPage] = useState(false);

  const { searchQuery, tableData, handleSearchChange, setData } = useSearch();

  const buttons = [
    {
      label: 'descargar pdf',
      handleClick: () => handleDownloadFile('pdf'),
    },
    {
      label: 'descargar xls',
      handleClick: () => handleDownloadFile('xls'),
    },
  ];

  const tableHeaders = [
    { id: 'id', label: 'ID Tag' },
    { id: 'tag.config.alias', label: 'Alias' },
    {
      id: 'type',
      label: 'Tipo',
      options: tagTypesES,
    },
    {
      id: 'zone',
      label: 'Zona',
      options: zoneList.map((zone) => ({
        label: zone.alias,
        value: zone.alias,
      })),
    },
    {
      id: 'alertType',
      label: 'Tipo Alerta',
      options: alertTypesES,
    },
    { id: 'timestamp', label: 'Hora de Alerta' },
    { id: 'close_timestamp', label: 'Hora de Aceptación' },
    { id: 'user.username', label: 'Usuario' },
  ];

  const handleChangePage = async (event, newPage) => {
    if (!changingPage) {
      setChangingPage(true);
      const res = await API.getAlertHistory(
        newPage + 1,
        pageSize,
        orderBy,
        order
      );
      setPageInfo({ ...res, page: res.page - 1 });
      setChangingPage(false);
    }
  };

  const handleChangeRowsPerPage = async (event) => {
    if (!changingPage) {
      setChangingPage(true);
      const res = await API.getAlertHistory(
        0,
        parseInt(event.target.value, 10),
        orderBy,
        order
      );
      setPageInfo({ ...res, page: res.page - 1 });
      setChangingPage(false);
    }
  };

  const handleDownloadFile = (file) => {
    const documentTitles = tableHeaders.map((header) => header.label);
    const documentData = downloadData.map((row) => Object.values(row));
    const formatDownloadData = {
      title: 'Historial de Zonas',
      table: [documentTitles, ...documentData],
    };
    downloadFile(file, formatDownloadData, `reporte_alertas`);
  };

  const handleChangeOrder = async (orderBy, order) => {
    const res = await API.getAlertHistory(page + 1, pageSize, orderBy, order);
    setPageInfo({ ...res, page: res.page - 1 });
  };

  const formatedData = useMemo(
    () =>
      Alerts.map((alert) => ({
        id: alert.tag.address,
        alias: alert.tag.config ? alert.tag.config.alias : 'No Configurado',
        type: alert.tag.config
          ? getTagType(alert.tag.config.type)
          : 'No Configurado',
        zone: alert.zone ? alert.zone.alias : '-',
        alertType: getAlertType(alert.alert_type),
        timestamp: formatDateString(alert.timestamp),
        close_timestamp: alert.close_timestamp
          ? formatDateString(alert.close_timestamp)
          : '-',
        user: alert?.user?.username || '-',
      })),
    [Alerts]
  );

  useEffect(() => {
    // Fetch zone history
    setChangingPage(true);
    API.getAlertHistory(1, DEFAULT_PAGE_SIZE).then((res) => {
      setPageInfo({ ...res, page: res.page - 1 });
      setChangingPage(false);
    });
  }, []);

  useEffect(() => {
    setData(formatedData);
  }, [formatedData, setData]);

  return (
    <section className={classes.container}>
      <Typography className={classes.title} component="h1">
        {'HISTORIAL DE ALERTAS'}
      </Typography>
      <SearchAndButton
        searchQuery={searchQuery}
        changeHandler={handleSearchChange}
        buttons={buttons}
      />
      <Table
        tableHeaders={tableHeaders}
        rows={tableData}
        defaultOrder="timestamp"
        orderByFunction={(orderBy, order) => handleChangeOrder(orderBy, order)}
        orderDirection={order}
        downloadData={(data) => setDownloadData(data)}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        page={page}
        rowsPerPage={pageSize}
        total={total}
        total_pages={total_pages}
        changingPage={changingPage}
        showPagination={true}
      />
    </section>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '2rem',
  },
  title: {
    color: theme.palette.common.red,
    fontSize: '2rem',
    fontWeight: 800,
  },
}));

const mapStateToProps = createStructuredSelector({
  Alerts: alertHistorySelector,
  zoneList: zoneListSelector,
});

export default connect(mapStateToProps)(HistoryAlert);
