export const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

export const getComparator = (order, orderBy) => {
  const comparer = orderBy.includes("timestamp")
    ? descendingComparatorTime
    : descendingComparator;
  return order === "desc"
    ? (a, b) => comparer(a, b, orderBy)
    : (a, b) => -comparer(a, b, orderBy);
};

const descendingComparator = (a, b, orderBy) => {
  if (
    a[orderBy] === "-" ||
    a[orderBy] === "No Configurado" ||
    a[orderBy] === null
  ) {
    return -1;
  }
  if (
    b[orderBy] === "-" ||
    b[orderBy] === "No Configurado" ||
    b[orderBy] === null
  ) {
    return 1;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};
const descendingComparatorTime = (a, b, orderBy) => {
  const aTime = new Date(getFormat(a[orderBy]));
  const bTime = new Date(getFormat(b[orderBy]));
  if (aTime === "-" || aTime === "No Configurado" || aTime === null) {
    return -1;
  }
  if (bTime === "-" || bTime === "No Configurado" || bTime === null) {
    return 1;
  }

  if (bTime < aTime) {
    return -1;
  }
  if (bTime > aTime) {
    return 1;
  }
  return 0;
};

const getFormat = (date) =>
  date
    .substr(0, 9)
    .split("/")
    .reverse()
    .join("/")
    .concat(" ")
    .concat(date.substr(10, 18));
