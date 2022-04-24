export const cookiesTostring = (cookies: { [key: string]: string }) => {
  let cookieStr = '';
  for (let key in cookies) {
    cookieStr += `${key}=${cookies[key]};`;
  }
  return cookieStr;
};
