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
import { DEFAULT_PAGE_SIZE, formatDateString } from 'utils/index';
import API from 'utils/api';
import {
  getAlertType,
  alertTypesES,
  getTagType,
  tagTypesES,
  downloadFile,
} from 'utils';

const ZoneTable = ({ idTag, name, zoneList, isLoading }) => {
  const classes = useStyles();
  const [downloadData, setDownloadData] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    has_next: false,
    items: [],
    page: 0,
    per_page: DEFAULT_PAGE_SIZE,
    total_pages: 1,
    total: 0,
    order_by: 'close_timestamp',
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
      id: 'alert_type',
      label: 'Tipo Alerta',
      options: alertTypesES,
    },
    { id: 'timestamp', label: 'Hora de Alerta' },
    { id: 'close_timestamp', label: 'Hora de Aceptación' },
    { id: 'user.username', label: 'Usuario' },
  ];

  const handleDownloadFile = (file) => {
    const documentTitles = tableHeaders.map((header) => header.label);
    const documentData = downloadData.map((row) => Object.values(row));
    const formatDownloadData = {
      title: 'Historial de Zonas',
      table: [documentTitles, ...documentData],
    };
    downloadFile(file, formatDownloadData, `${name}_reporte_alertas`);
  };

  const handleChangePage = async (event, newPage) => {
    if (!changingPage) {
      setChangingPage(true);
      const res = await API.getTagAlertHistory(
        idTag,
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
      const res = await API.getTagAlertHistory(
        idTag,
        0,
        parseInt(event.target.value, 10),
        order_by,
        order
      );
      setPageInfo({ ...res, page: res.page - 1 });
      setChangingPage(false);
    }
  };

  const handleChangeOrder = async (order_by, order) => {
    const res = await API.getTagAlertHistory(
      idTag,
      page + 1,
      pageSize,
      order_by,
      order
    );
    setPageInfo({ ...res, page: res.page - 1 });
  };

  const formatedData = useMemo(() => {
    return (
      alertHistory
        // .sort((a, b) => new Date(b.close_timestamp) - new Date(a.close_timestamp))
        .map((history) => ({
          alias: history.tag.config
            ? history.tag.config.alias
            : history.tag.address,
          type: history.tag.config
            ? getTagType(history.tag.config.type)
            : 'No Configurado',
          zone: history.zone.alias,
          alert_type: getAlertType(history.alert_type),
          timestamp: formatDateString(history.timestamp),
          close_timestamp: history.close_timestamp
            ? formatDateString(history.close_timestamp)
            : '-',
          user: history?.user?.username || '',
        }))
    );
  }, [alertHistory]);

  useEffect(() => {
    // Fetch alert history
    setChangingPage(true);
    API.getTagAlertHistory(idTag, 1, DEFAULT_PAGE_SIZE, order_by, order).then(
      (res) => {
        setPageInfo({ ...res, page: res.page - 1 });
        setChangingPage(false);
      }
    );
  }, [idTag]);

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
        defaultOrder="close_timestamp"
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
