const xpath = require('xpath');
const { DOMParser } = require('xmldom');
const axios = require('axios');

const xpaths = {
  title: 'string(//meta[@property="og:title"]/@content)',
  // description: 'string(//meta[@property="og:description"]/@content)',
  image: 'string(//meta[@property="og:image"]/@content)',
  // keywords: 'string(//meta[@property="keywords"]/@content)',
};

const convertBodyToDocument = (body) => new DOMParser().parseFromString(body);

const nodesFromDocument = (document, xpathSelector) =>
  xpath.select(xpathSelector, document);

const mappedProperties = (paths, document) =>
  Object.keys(paths).reduce(
    (acc, key) => ({ ...acc, [key]: nodesFromDocument(document, paths[key]) }),
    {}
  );

const parseUrl = async (url) => {
  try {
    const { data: page } = await axios.request({ url });
    const document = convertBodyToDocument(page);
    return mappedProperties(xpaths, document);
  } catch (e) {
    console.log({ ParserError: 'Failed to parse error' });
    return;
  }
};

module.exports.parseOGMetatags = parseUrl;
