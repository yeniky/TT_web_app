import React, { useState, useEffect, useMemo } from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

//components
import Table from 'components/Table/Table.container';
import SearchAndButtons from 'components/SearchAndButtons.component';

//hooks
import useSearch from 'hooks/useSearch';

//uitls
import API from 'utils/api';
import { DEFAULT_PAGE_SIZE, formatDateString } from 'utils/index';
import {
  getAlertType,
  getTagType,
  tagTypesES,
  alertTypesES,
  downloadFile,
} from 'utils';

const ZoneTable = ({ idZone, name, isLoading }) => {
  const classes = useStyles();
  const [downloadData, setDownloadData] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    has_next: false,
    items: [],
    page: 0,
    per_page: DEFAULT_PAGE_SIZE,
    total_pages: 1,
    total: 0,
    order_by: 'timestamp',
    order: 'asc',
  });

  const {
    page,
    per_page: pageSize,
    items: alertHistory,
    total_pages,
    total,
    order_by,
    order,
  } = pageInfo;

  const [changingPage, setChangingPage] = useState(false);

  const { searchQuery, handleSearchChange, setData, tableData } = useSearch();
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
    { id: 'tag', label: 'Tag' },
    {
      id: 'type',
      label: 'Tipo',
      options: tagTypesES,
    },
    {
      id: 'alert_type',
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
      const res = await API.getZoneAlertHistory(
        idZone,
        newPage + 1,
        pageSize,
        order_by,
        order
      );
      setPageInfo({ ...res, page: res.page - 1 });
      setChangingPage(false);
    }
  };

  const handleChangeRowsPerPage = async (event) => {
    if (!changingPage) {
      setChangingPage(true);
      const res = await API.getZoneAlertHistory(
        idZone,
        0,
        parseInt(event.target.value, 10),
        order_by,
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
    downloadFile(file, formatDownloadData, `${name}_reporte_alertas`);
  };

  const handleChangeOrder = async (orderBy, order) => {
    const res = await API.getZoneAlertHistory(
      idZone,
      page + 1,
      pageSize,
      orderBy,
      order
    );
    setPageInfo({ ...res, page: res.page - 1 });
  };

  const formatedData = useMemo(
    () =>
      alertHistory.map((history) => ({
        tag: history.tag.config.alias || history.tag.address,
        type: history.tag.config
          ? getTagType(history.tag.config.type)
          : 'No Configurado',
        alert_type: getAlertType(history.alert_type),
        timestamp: formatDateString(history.timestamp),
        close_timestamp: history.close_timestamp
          ? formatDateString(history.close_timestamp)
          : '-',
        user: history?.user?.username || '-',
      })),
    [alertHistory]
  );

  useEffect(() => {
    // Fetch alert history
    setChangingPage(true);
    API.getZoneAlertHistory(idZone, 1, DEFAULT_PAGE_SIZE, order_by, order).then(
      (res) => {
        setPageInfo({ ...res, page: res.page - 1 });
        setChangingPage(false);
      }
    );
  }, [idZone]);

  useEffect(() => {
    setData(formatedData);
  }, [formatedData, setData]);

  return (
    <section className={classes.zoneHistoryContainer}>
      <Typography className={classes.title} variant="h4">
        {'HISTORIAL DE ALERTAS'}
      </Typography>
      <SearchAndButtons
        searchQuery={searchQuery}
        changeHandler={handleSearchChange}
        buttons={buttons}
      />
      <Table
        isLoading={isLoading}
        tableHeaders={tableHeaders}
        rows={tableData}
        orderByFunction={(orderBy, order) => handleChangeOrder(orderBy, order)}
        orderDirection={order}
        defaultOrder="timestamp"
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
  zoneHistoryContainer: {
    marginBottom: '2.5rem',
  },
}));

export default ZoneTable;
