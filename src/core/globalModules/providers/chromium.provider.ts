import * as puppeteer from 'puppeteer';

export const chromiumProvider = {
  provide: 'CHROMIUM_BROWSER',
  useFactory: async () => {
    const browser = await puppeteer.launch({ headless: false });
    return browser;
  },
};
