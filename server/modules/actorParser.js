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
          const featured = await page.$$('.celebrity-highest__list>li>div>a');
          let featuredURLs = [];
          if (featured.length > 0) {
            for (let i = 1; i <= featured.length; i++) {
              let fu = await page.$(
                `.celebrity-highest__list>li:nth-child(${i})>div>a>img`
              );
              let imgURL = await (await fu.getProperty('src')).jsonValue();
              let filmU = await page.$(
                `.celebrity-highest__list>li:nth-child(${i})>div>a`
              );
              let filmURL = await (await filmU.getProperty('href')).jsonValue();
              let filmName = (
                await getInnerText(
                  page,
                  `.celebrity-highest__list>li:nth-child(${i})>div>p>a`
                )
              )
                .trim()
                .replace(/\s|\n|\s\s/g, '_')
                .split('<')[0]
                .split('_')
                .join(' ');
              featuredURLs.push({ imgURL, filmURL, filmName });
            }
          } else {
            featuredURLs = [];
          }

          let actor = {
            akas: [],
            image: { url: scrTxt },
            name: names[i],
            knownFor: featuredURLs,
            birthday: birthday.trim().replace(/\s|\n|\s\s/g, ''),
            birthPlace: birthPlace.trim().replace(/\s|\n|\s\s/g, ''),
            biography: biography.trim(),
          };

          result.push(actor);
        }

        browser.close();
        resolve(result);
      } catch (e) {}
    });
  } catch (e) {}
}
// let actors = ['Ashley Graham'];
// scrapper("https://www.rottentomatoes.com/celebrity/", actors).then((res) =>
//   console.log(res)
// );
module.exports = scrapper;
