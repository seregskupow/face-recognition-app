const puppeteer = require('puppeteer');

const getElementForSelector = async (page, selector) => {
  return (await page.$(selector)) || null;
};

const getInnerText = async (page, selector) => {
  const elementForSelector = await getElementForSelector(page, selector);
  try {
    if (elementForSelector !== null) {
      return (
        (await elementForSelector.evaluate((element) => {
          return element.innerHTML;
        })) || 'Not available'
      );
    } else {
      return 'Not available';
    }
  } catch {
    return 'Not available';
  }
};

function scrapper(url, names) {
  try {
    return new Promise(async function (resolve, reject) {
      // async function scrape() {
      try {
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        const page = await browser.newPage();
        console.log(names);
        console.log('page');
        let result = [];
        for (let i = 0; i < names.length; i++) {
          let urlToParse =
            url +
            names[i]
              .split(' ')
              .join('')
              .split(/(?=[A-Z])/)
              .join('_')
              .replace('.', '')
              .toLowerCase();
          console.log(urlToParse);
          await page.goto(urlToParse, { waitUntil: 'load', timeout: 0 });
          let el = await page.$('article>section:nth-child(1)>div>a>img');
          if (!el) {
            urlToParse =
              url +
              names[i]
                .split(' ')
                .join('')
                .split(/(?=[A-Z])/)
                .join('-')
                .replace('.', '')
                .toLowerCase();
            console.log(urlToParse);
            await page.goto(urlToParse, { waitUntil: 'load', timeout: 0 });
            el = await page.$('article>section:nth-child(1)>div>a>img');
            if (!el) {
              continue;
            }
          }
          const src = await el.getProperty('src');
          const scrTxt = await src.jsonValue();
          let birthday = await getInnerText(
            page,
            'article>section:nth-child(1)>div>div>div>p:nth-of-type(3)'
          );
          const birthPlace = await getInnerText(
            page,
            'article>section:nth-child(1)>div>div>div>p:nth-of-type(4)'
          );
          const biography = await getInnerText(
            page,
            'article>section:nth-child(1)>div>div>div>p:nth-of-type(5)'
          );
          // const featured = await page.$$('.celebrity-highest__list>li>div>a');
          const featuredA = await page.$$('.posters-container>a');
          const featuredPosters = await page.$$(
            '.posters-container>tile-poster-video'
          );

          let featuredURLs = [];
          if (featuredA.length > 0) {
            for (let i = 0; i < featuredA.length; i++) {
              try {
                let imgUrl = await featuredA[
                  i
                ].$eval('tile-poster>tile-poster-image>img', (a) =>
                  a.getAttribute('data-src')
                );
                let filmName = (
                  await featuredA[i].$eval(
                    'tile-poster>tile-poster-meta>span',
                    (a) => a.innerHTML
                  )
                )
                  .trim()
                  .replace(/\s|\n|\s\s/g, '_')
                  .split('<')[0]
                  .split('_')
                  .join(' ');
                let filmUrl = await page.$eval(
                  `.posters-container>a:nth-of-type(${i + 1})`,
                  (a) => a.getAttribute('href')
                );
                featuredURLs.push({ imgUrl, filmUrl, filmName });
              } catch (e) {
                console.log(e);
              }
            }
          }
          if (featuredPosters.length > 0) {
            for (let i = 0; i < featuredPosters.length; i++) {
              try {
                let imgUrl = await featuredPosters[
                  i
                ].$eval('button>tile-poster-image>img', (a) =>
                  a.getAttribute('data-src')
                );
                let filmName = (
                  await featuredPosters[i].$eval(
                    'a>tile-poster-meta>span',
                    (a) => a.innerHTML
                  )
                )
                  .trim()
                  .replace(/\s|\n|\s\s/g, '_')
                  .split('<')[0]
                  .split('_')
                  .join(' ');
                let filmUrl = await featuredPosters[i].$eval(
                  'a',
                  (a) =>
                    'https://www.rottentomatoes.com' + a.getAttribute('href')
                );
                featuredURLs.push({ imgUrl, filmUrl, filmName });
              } catch (e) {
                console.log(e);
              }
            }
          }
          let actor = {
            akas: [],
            image: { url: scrTxt },
            name: names[i],
            knownFor: featuredURLs,
            birthday: birthday.trim().replace(/\s|\n|\s\s/g, ''),
            birthPlace: birthPlace
              .trim()
              .replace(/\s|\n|\s\s/g, '')
              .replace('Birthplace:', ''),
            biography: biography.trim(),
          };

          result.push(actor);
        }

        browser.close();
        resolve(result);
      } catch (e) {
        console.log(e);
      }
    });
  } catch (e) {
    console.log(e);
  }
}
// let actors = [
//   'Thora Birch',
//   'Keisha Castle-Hughes',
//   'Ellen Page',
//   'Michael Clarke Duncan',
// ];
// scrapper('https://www.rottentomatoes.com/celebrity/', actors).then((res) =>
//   console.log(res[0].birthPlace)
// );
module.exports = scrapper;
