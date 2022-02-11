export const checkIfImage = (fileName: string) => {
  const dot = fileName.lastIndexOf('.') + 1;
  const extFile = fileName.substr(dot, fileName.length).toLowerCase();
  return (
    extFile === 'jpg' ||
    extFile === 'jpeg' ||
    extFile === 'png' ||
    extFile === 'gif'
  );
};
