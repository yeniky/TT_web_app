import moment from 'moment';

import API from './api';

export const getAlertType = (type) =>
  ({
    Entry: 'Ingreso',
    Exit: 'Egreso',
    Permanence: 'Permanencia',
  }[type]);

export const alertTypesES = [
  { label: 'Ingreso', value: 'Ingreso' },
  { label: 'Egreso', value: 'Egreso' },
  { label: 'Permanencia', value: 'Permanencia' },
];
export const alertTypesEN = [
  { label: 'Entry', value: 'Entry' },
  { label: 'Exit', value: 'Exit' },
  { label: 'Permanence', value: 'Permanence' },
];

export const tagRuleEquals = (ruleA, ruleB) =>
  ruleA.active !== false &&
  ruleA.alert_type === ruleB.alert_type &&
  ruleA.zone.id === ruleB.zone.id &&
  ((ruleA.time && ruleB.time && ruleA.time === ruleB.time) ||
    (!ruleA.time && !ruleB.time));

export const zoneRuleEquals = (ruleA, ruleB) =>
  ruleA.active !== false &&
  ruleA.alert_type === ruleB.alert_type &&
  ruleA.tag_type === ruleB.tag_type &&
  ((ruleA.time && ruleB.time && ruleA.time === ruleB.time) ||
    (!ruleA.time && !ruleB.time));

export const getTagType = (type) =>
  ({
    Object: 'Objeto',
    Person: 'Persona',
    Vehicle: 'Vehículo',
  }[type]);

export const tagTypesES = [
  { label: 'Objeto', value: 'Objeto' },
  { label: 'Vehículo', value: 'Vehículo' },
  { label: 'Persona', value: 'Persona' },
];
export const tagTypesEN = [
  { label: 'Object', value: 'Object' },
  { label: 'Vehicle', value: 'Vehicle' },
  { label: 'Person', value: 'Person' },
];

export const getMinutesDifference = (timestamp) => {
  const targetDate = new Date(timestamp.slice(0, timestamp.length - 3) + 'Z');
  const now = new Date();
  const minutes = Math.floor((now - targetDate) / 1000 / 60);
  return minutes < 0 ? minutes * -1 : minutes;
};

export const mockLogin = (email, password) => {
  const credentials = {
    email: 'test@trackandtrace.cl',
    password: 'password1234',
  };
  let errors = {};
  if (email.length === 0) {
    errors.email = 'Error de ingreso: campos faltantes';
  }
  if (password.length === 0) {
    errors.password = 'Error de ingreso: campos faltantes';
  }
  if (
    (email !== credentials.email && email.length > 0) ||
    (password !== credentials.password && password.length > 0)
  ) {
    errors.credentials = 'Credenciales incorrectas';
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  } else {
    return { token: 'exampleToken' };
  }
};

export const downloadFile = (file, data, name) =>
  API.downloadFile(file, data).then((res) => {
    const downloadUrl = window.URL.createObjectURL(new Blob([res]));
    const link = document.createElement('a');
    link.setAttribute('download', `${name}.${file}`);
    link.href = downloadUrl;
    document.body.appendChild(link);
    link.click();
    link.remove();
  });

//Date
export const isValidDateInterval = (
  start_date,
  start_time,
  end_date,
  end_time
) => {
  const startDate = new Date(new Date(start_date + 'T' + start_time));
  if (!isValidDate(startDate)) return false;
  const endDate = new Date(new Date(end_date + 'T' + end_time));
  if (!isValidDate(endDate)) return false;

  const now = new Date();

  return startDate <= now && endDate <= now && startDate <= endDate;
};

const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
};

export const formatDateString = (dateString) =>
  new Date(dateString.slice(0, dateString.length - 3) + 'Z').toLocaleString();

export const previousMonth = (n = 1) => {
  const date = new Date();
  date.setMonth(date.getMonth() - n);
  return date;
};

export const previousWeek = (n = 1) => {
  const date = new Date();
  date.setHours(date.getHours() - n * 7 * 24);
  return date;
};

export const previousDay = (n = 1) => {
  const date = new Date();
  date.setHours(date.getHours() - n * 24);
  return date;
};

export const previousHour = (n = 1) => {
  const date = new Date();
  date.setHours(date.getHours() - n);
  return date;
};

export const splitDate = (date) => {
  const md = moment(date);
  return { date: md.format('YYYY-MM-DD'), time: md.format('HH:mm') };
};

export const DEFAULT_PAGE_SIZE = 5;
