const idbKeyval = require('idb-keyval');

const getFunc = idbKeyval.get;
const setFunc = idbKeyval.set;
const deleteFunc = idbKeyval.delete;

export { getFunc as get, setFunc as set, deleteFunc as delete };
