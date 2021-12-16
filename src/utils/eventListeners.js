const functions = [];

const executeFunction = () => {
  functions.forEach((func) => func());
};

const initListener = () => {
  window.removeEventListener('resize', executeFunction);
  window.addEventListener('resize', executeFunction);
};

export const addFunctionToResize = (func) => {
  functions.push(func);
  initListener();
};
