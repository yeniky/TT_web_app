import React, { useState, useEffect, useMemo } from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

//components
import Table from 'components/Table/Table.container';
import SearchAndButtons from 'components/SearchAndButtons.component';

//hooks
import useSearch from 'hooks/useSearch';

//utils
import API from 'utils/api';
import {
  DEFAULT_PAGE_SIZE,
  getTagType,
  tagTypesES,
  downloadFile,
  formatDateString,
} from 'utils';

const TagTable = ({ idZone, name, isLoading }) => {
  const classes = useStyles();
  const [downloadData, setDownloadData] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    has_next: false,
    items: [],
    page: 0,
    per_page: DEFAULT_PAGE_SIZE,
    total_pages: 1,
    total: 0,
    order_by: 'in_timestamp',
    order: 'asc',
  });

  const {
    page,
    per_page: pageSize,
    items: zoneHistory,
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
    { id: 'in_timestamp', label: 'Hora de Ingreso' },
    { id: 'out_timestamp', label: 'Hora de Egreso' },
    { id: 'permanence_time', label: 'Tiempo de Permanencia' },
  ];

  const handleChangePage = async (event, newPage) => {
    if (!changingPage) {
      setChangingPage(true);
      const res = await API.getZoneTagHistory(
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
      const res = await API.getZoneTagHistory(
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
    downloadFile(file, formatDownloadData, `${name}_reporte_tags`);
  };

  const handleChangeOrder = async (orderBy, order) => {
    const res = await API.getZoneTagHistory(
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
      zoneHistory.map((history) => ({
        tag: history.tag.config
          ? history.tag.config.alias
          : history.tag.address,
        type: history.tag.config ? getTagType(history.tag.config.type) : '-',
        in_timestamp: formatDateString(history.in_timestamp),
        out_timestamp: history.out_timestamp
          ? formatDateString(history.out_timestamp)
          : '-',
        time: history.permanence_time
          ? `${Math.round(history.permanence_time)} minutos`
          : '-',
      })),
    [zoneHistory]
  );

  useEffect(() => {
    setChangingPage(true);
    API.getZoneTagHistory(idZone, 1, DEFAULT_PAGE_SIZE, order_by, order).then(
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
        {'HISTORIAL DE TAGS'}
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
        defaultOrder="in_timestamp"
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

export default TagTable;
