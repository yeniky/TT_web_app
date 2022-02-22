import React, { useState, useEffect, useMemo } from 'react';

import { Link } from 'react-router-dom';

//redux
import { connect } from 'react-redux';
import { selectAppInfo } from 'redux/appInfo/appInfo.selector';
import { setAppInfo } from 'redux/appInfo/appInfo.actions';

//styles
import { Typography, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

//hooks
import useSearch from 'hooks/useSearch';

//components
import Button from 'components/Button.component';
import Table from 'components/Table/Table.container';
import Input from 'components/Input.component';
import SearchAndButtons from 'components/SearchAndButtons.component';
import CreateUserModal from 'components/Admin/CreateUserModal';
import DeleteUserModal from 'components/Admin/DeleteUserModal';

import { Delete } from '@material-ui/icons';

//utils
import { DEFAULT_PAGE_SIZE, downloadFile } from 'utils';
import API from 'utils/api';

const AdminPage = ({ appInfo, setAppInfo }) => {
  const classes = useStyles();

  const { client, place } = appInfo;

  // const { address } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingAppConfig, setIsChangingAppConfig] = useState(false);

  const [deletingUser, setDeletingUser] = useState({
    id: -1,
    username: '',
    email: '',
  });

  const { id: deletingId, username, email } = deletingUser;
  const [deletingModalOpen, setDeletingModalOpen] = useState(false);

  const [downloadData, setDownloadData] = useState([]);

  const [appConfig, setAppConfig] = useState(appInfo);

  const [pageInfo, setPageInfo] = useState({
    has_next: false,
    items: [],
    page: 0,
    per_page: DEFAULT_PAGE_SIZE,
    total_pages: 1,
    total: 0,
    order_by: 'id',
    order: 'asc',
  });

  const {
    page,
    per_page: pageSize,
    items: userList,
    total_pages,
    total,
    order_by,
    order,
  } = pageInfo;

  const [changingPage, setChangingPage] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const { searchQuery, handleSearchChange, setData, tableData } = useSearch();

  const buttons = [
    {
      label: 'CREAR USUARIO',
      handleClick: () => handleCreateUser(),
    },
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
    { id: 'id', label: 'Id' },
    {
      id: 'username',
      label: 'Nombre de Usuario',
    },
    {
      id: 'email',
      label: 'Correo',
    },
    { id: 'role', label: 'Rol' },
    { id: 'active', label: 'Cuenta activa' },
    { id: 'actions', label: '' },
  ];

  const handleChangeAppConfig = () => {
    setIsChangingAppConfig(true);
    API.setAppInfo(appConfig.client, appConfig.place)
      .then((res) => {
        setAppInfo(appConfig.client, appConfig.place);
      })
      .finally(() => setIsChangingAppConfig(false));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAppConfig({
      ...appConfig,
      [name]: value,
    });
  };

  const handleCreateUser = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setDeletingModalOpen(false);
    setModalOpen(false);
    // To avoid visual effect on modal close
    setTimeout(() => setDeletingUser({ id: -1, username: '', email: '' }), 50);
  };

  const handleModalSubmit = (email) => {
    return API.createUser(email)
      .then((res) => {
        handleChangePage(undefined, page);
        setModalOpen(false);
      })
      .catch((error) => {
        console.error(error);
        setModalOpen(false);
      });
  };

  const handleDelete = (id) => {
    // setDeletingId(id);
    return API.deleteUser(id)
      .then((res) => {
        setPageInfo({
          ...pageInfo,
          items: userList.filter((user) => user.id !== id),
        });
        setDeletingUser({ id: -1, username: '', email: '' });
        setDeletingModalOpen(false);
      })
      .catch((error) => {
        console.error(error);
        setDeletingUser({ id: -1, username: '', email: '' });
        setDeletingModalOpen(false);
      });
  };

  const handleChangePage = async (event, newPage) => {
    if (!changingPage) {
      setChangingPage(true);
      const res = await API.getUserList(newPage + 1, pageSize, order_by, order);
      setPageInfo({ ...res, page: res.page - 1 });
      setChangingPage(false);
    }
  };

  const handleChangeRowsPerPage = async (event) => {
    if (!changingPage) {
      setChangingPage(true);
      const res = await API.getUserList(
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
    const documentData = downloadData.map(({ actions, ...row }) =>
      Object.values(row)
    );
    const formatDownloadData = {
      title: 'Listado de Usuarios',
      table: [documentTitles, ...documentData],
    };
    downloadFile(file, formatDownloadData, `Listado_usuarios_página_${page}`);
  };

  const handleChangeOrder = async (orderBy, order) => {
    const res = await API.getUserList(page + 1, pageSize, orderBy, order);
    setPageInfo({ ...res, page: res.page - 1 });
  };

  const formatedData = useMemo(
    () =>
      userList.map((user) => ({
        id: user.id,
        username: user?.username || '-',
        email: user.email,
        role: user.role,
        active: user.active ? 'Sí' : 'No',
        actions:
          user.id === deletingId ? (
            <CircularProgress />
          ) : (
            <Button
              color="red"
              onClick={() => {
                setDeletingUser(user);
                setDeletingModalOpen(true);
              }}
            >
              <Delete />
            </Button>
          ),
      })),
    [userList, deletingId]
  );

  useEffect(() => {
    setChangingPage(true);
    API.getUserList(1, DEFAULT_PAGE_SIZE, order_by, order).then((res) => {
      setPageInfo({ ...res, page: res.page - 1 });
      setIsLoading(false);
      setChangingPage(false);
    });
  }, []);

  useEffect(() => {
    setData(formatedData);
  }, [formatedData, setData]);

  useEffect(() => {
    setAppConfig({ client, place });
  }, [client, place]);

  return (
    <div>
      <section className={classes.container}>
        <Typography className={classes.title} variant="h4">
          {'CONFIGURACIÓN GENERAL'}
        </Typography>
        <div className={classes.appConfig}>
          <div className={classes.input}>
            <Typography>Cliente</Typography>
            <Input
              handleChange={handleChange}
              value={appConfig.client}
              name="client"
            ></Input>
          </div>
          <div className={classes.input}>
            <Typography>Lugar</Typography>
            <Input
              handleChange={handleChange}
              value={appConfig.place}
              name="place"
            ></Input>
          </div>
          {isChangingAppConfig ? (
            <CircularProgress />
          ) : (
            <Button
              className={classes.button}
              onClick={handleChangeAppConfig}
              color="green"
            >
              Aplicar
            </Button>
          )}
        </div>
      </section>
      {!isLoading ? (
        <section className={classes.container}>
          <Typography className={classes.title} variant="h4">
            {'USUARIOS'}
          </Typography>
          <SearchAndButtons
            searchQuery={searchQuery}
            changeHandler={handleSearchChange}
            buttons={buttons}
          />
          {/* <InfoTag tag={tag} onEdit={() => editTag(tag)} /> */}
          <Table
            isLoading={isLoading}
            tableHeaders={tableHeaders}
            rows={tableData}
            defaultOrder="id"
            // orderDirection="asc"
            orderByFunction={(orderBy, order) =>
              handleChangeOrder(orderBy, order)
            }
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
      ) : (
        <div className={classes.loadingContainer}>
          {isLoading ? (
            <Typography className={classes.infoText}>{'CARGANDO'}</Typography>
          ) : !userList ? (
            <div className={classes.errorContainer}>
              <Typography
                className={classes.infoText}
              >{`No hay usuarios"`}</Typography>
              <Button
                className={classes.toTagsButton}
                color="green"
                component={Link}
                to="/dasboard"
              >
                {'Volver'}
              </Button>
            </div>
          ) : (
            ''
          )}
        </div>
      )}
      <CreateUserModal
        open={modalOpen}
        handleClose={handleModalClose}
        handleSubmit={handleModalSubmit}
      ></CreateUserModal>
      <DeleteUserModal
        open={deletingModalOpen}
        user={deletingUser}
        handleClose={handleModalClose}
        handleSubmit={handleDelete}
      ></DeleteUserModal>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '2rem',
  },
  appConfig: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  input: {
    marginRight: 10,
  },
  button: {
    fontSize: '1rem',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '90vh',
  },
  infoText: {
    fontSize: '2rem',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toTagsButton: {
    fontSize: '1.5rem',
    marginTop: '1rem',
  },
}));

const mapStateToProps = (state) => ({
  appInfo: selectAppInfo(state),
});

const mapDispatchToProps = (dispatch) => ({
  setAppInfo: (client, place) => dispatch(setAppInfo(client, place)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);
