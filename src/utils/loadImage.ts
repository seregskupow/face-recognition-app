export const loadImage = (
  src: string,
  callback: (img: HTMLImageElement) => void = () => {},
  errorCallback: (msg: string) => void = () => {}
) => {
  let img = new Image();

  img.onload = () => callback(img);
  img.onerror = (error) => errorCallback('Error loading image');
  img.setAttribute('crossorigin', 'anonymous');

  img.src = src;

  return img;
};
