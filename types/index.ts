import { AppProps } from 'next/app';
import { NextPage } from 'next/types';
import { ReactElement, ReactNode } from 'react';

export type ActorInfo = {
  photo: string;
  name: string;
  id: string;
  birthDay: string;
  birthPlace: string;
};

export type ActorInfoFull = ActorInfo & {
  biography: string;
  films: Array<{
    imgURL: string;
    filmURL: string;
    filmName: string;
  }>;
};
export type WikiActorInfo = {
  photo: string;
  name: string;
  link: string;
};
export type RecognitionResponse = {
  detectedActors: string[];
  imageSrc: string;
};

export type Historyitem = {
  id: string;
  date: string;
  results: Array<{
    actors: ActorInfo[];
    usedImage: string;
  }>;
};

export type LoadHistoryResponse = {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  offset: number;
  data: Array<Historyitem>;
};

declare global {
  type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
  };

  type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
  };
}
