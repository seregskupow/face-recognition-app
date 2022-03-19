import { select } from 'xpath';
import { DOMParser } from 'xmldom';
import axios from 'axios';

type Paths = {
  [key: string]: string;
};

const xpaths: Paths = {
  title: 'string(//meta[@property="og:title"]/@content)',
  // description: 'string(//meta[@property="og:description"]/@content)',
  image: 'string(//meta[@property="og:image"]/@content)',
  // keywords: 'string(//meta[@property="keywords"]/@content)',
};

const convertBodyToDocument = (body) => new DOMParser().parseFromString(body);

const nodesFromDocument = (document, xpathSelector) =>
  select(xpathSelector, document);

const mappedProperties = (paths, document) =>
  Object.keys(paths).reduce(
    (acc: Paths, key) => ({
      ...acc,
      [key]: nodesFromDocument(document, paths[key]),
    }),
    {},
  );

const parseUrl = async (url): Promise<Paths> => {
  try {
    const { data: page } = await axios.request({ url });
    const document = convertBodyToDocument(page);
    return mappedProperties(xpaths, document) as Paths;
  } catch (e) {
    console.log({ ParserError: 'Failed to parse error' });
    return;
  }
};

export const parseOGMetatags = parseUrl;
