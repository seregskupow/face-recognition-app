import xpath from 'xpath';
import { DOMParser } from 'xmldom';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as puppeteer from 'puppeteer';
const ROTTEN_URL = 'https://www.rottentomatoes.com/celebrity/robert_downey_jr';

const BIRTHDAY_PATH =
  '//*[@id="main-page-content"]/div/article/section[1]/div/div/div/p[3]';
const BIRTHPLACE_PATH =
  '//*[@id="main-page-content"]/div/article/section[1]/div/div/div/p[4]';
const BIOGRAPHY_PATH =
  '//*[@id="main-page-content"]/div/article/section[1]/div/div/div/p[5]';
const FILMS_PATH = '//*[@id="dynamic-poster-list"]/tiles-carousel-responsive';

const convertBodyToDocument = (body) => new DOMParser().parseFromString(body);

export const parseActor = async (name) => {
  const actorName = name.split(' ').join('_');
  // const { data: page } = await axios.request({
  //   url: ROTTEN_URL,
  // });

  // const bday = $(
  //   '#dynamic-poster-list > tiles-carousel-responsive > tiles-carousel-responsive-item.tile-first.visible > a > tile-dynamic > button',
  // ).attr('class');
  // const document = convertBodyToDocument(page);

  // const birthPlace = xpath.select('//title', document);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(ROTTEN_URL);
  const bday = await page.$eval(
    '#dynamic-poster-list > tiles-carousel-responsive > tiles-carousel-responsive-item.tile-first.visible > a > tile-dynamic > img',
    (e) => e.getAttribute('src'),
  );

  await browser.close();
  return bday;
};
