import React, { useState, useEffect, useMemo } from 'react';

//redux
import { connect } from 'react-redux';

import { setTag } from 'redux/tag/tag.actions';

import { selectTags } from 'redux/tag/tag.selector';
import { selectZones } from 'redux/zone/zone.selectors';

//styles components
import { makeStyles } from '@material-ui/styles';

//components
import Table from 'components/Table/Table.container';
import SearchAndButtons from 'components/SearchAndButtons.component';
import TagInfoModal from 'components/TagModal/Info/TagInfo.container';
import TagConfigModal from 'components/TagModal/Config/TagModalConfig.container';

//hooks
import useSearch from 'hooks/useSearch';

//utils
import API from 'utils/api';
import {
  DEFAULT_PAGE_SIZE,
  getTagType,
  tagTypesES,
  formatDateString,
} from 'utils';

const TableTest = ({ onSelectingTag, zoneList }) => {
  const classes = useStyles();

  const [status, setStatus] = useState(true);
  const [pageInfo, setPageInfo] = useState({
    has_next: false,
    items: [],
    page: 0,
    per_page: DEFAULT_PAGE_SIZE,
    total_pages: 1,
    total: 0,
    order_by: 'last_timestamp',
    order: 'asc',
  });

  const {
    page,
    per_page: pageSize,
    items: Tags,
    total_pages,
    total,
    order_by,
    order,
  } = pageInfo;

  const [changingPage, setChangingPage] = useState(false);

  const { searchQuery, handleSearchChange, setData, tableData } = useSearch();
  const button = [
    {
      label: status ? 'ver desactivados' : 'ver activos',
      handleClick: () => setStatus(!status),
    },
  ];

  const handleChangePage = async (event, newPage) => {
    if (!changingPage) {
      setChangingPage(true);
      const res = await API.getTags(newPage + 1, pageSize, order_by, order);
      setPageInfo({ ...res, page: res.page - 1 });
      setChangingPage(false);
    }
  };

  const handleChangeRowsPerPage = async (event) => {
    if (!changingPage) {
      setChangingPage(true);
      const res = await API.getTags(
        0,
        parseInt(event.target.value, 10),
        order_by,
        order
      );
      setPageInfo({ ...res, page: res.page - 1 });
      setChangingPage(false);
    }
  };

  const handleChangeOrder = async (orderBy, order) => {
    const res = await API.getTags(page + 1, pageSize, orderBy, order);
    setPageInfo({ ...res, page: res.page - 1 });
  };

  const formatedData = useMemo(
    () =>
      // Tags.slice(page * pageSize, (page + 1) * pageSize)
      Tags.filter((tag) => tag.active === status).map((tag) => ({
        address: tag.address,
        alias: tag.config ? tag.config.alias : '-',
        type: tag.config ? getTagType(tag.config.type) : '-',
        zone: tag.zone ? tag.zone.alias : '-',
        signal: tag.signal + '%',
        timestamp: tag.last_timestamp
          ? formatDateString(tag.last_timestamp)
          : '-',
      })),
    [Tags, status]
  );

  useEffect(() => {
    setChangingPage(true);
    API.getTags(1, DEFAULT_PAGE_SIZE).then((res) => {
      setPageInfo({ ...res, page: res.page - 1 });
      setChangingPage(false);
    });
  }, []);

  useEffect(() => {
    setData(formatedData);
  }, [formatedData, setData]);

  const tableHeaders = [
    { id: 'address', label: 'Tag' },
    { id: 'config.alias', label: 'Alias' },
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
    { id: 'signal', label: 'Intensidad' },
    { id: 'last_timestamp', label: 'Actualización' },
  ];

  const findTag = (address) => {
    const tagFound = Tags.find((tag) => tag.address === address);
    onSelectingTag(tagFound);
  };

  return (
    <div className={classes.container}>
      <SearchAndButtons
        searchQuery={searchQuery}
        changeHandler={handleSearchChange}
        buttons={button}
      />
      <Table
        rows={tableData}
        tableHeaders={tableHeaders}
        onRowClick={(tag) => findTag(tag.address)}
        orderByFunction={(orderBy, order) => handleChangeOrder(orderBy, order)}
        defaultOrder="last_timestamp"
        orderDirection={order}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        page={page}
        rowsPerPage={pageSize}
        total={total}
        total_pages={total_pages}
        changingPage={changingPage}
        showPagination={true}
      />
      <TagInfoModal />
      <TagConfigModal />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '3rem',
  },
}));

const mapStateToProps = (state) => ({
  Tags: selectTags(state),
  zoneList: selectZones(state),
});

const mapDispatchToProps = (dispatch) => ({
  onSelectingTag: (tag) => dispatch(setTag(tag)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TableTest);
