/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

interface ImageProp {
  source: string,
  width: number,
  height: number,
};

interface ContentURL {
  page: string,
  revisions: string,
  edit: string,
  talk: string,
};

interface ContentURLs {
  desktop: ContentURL,
  mobile: ContentURL,
};

export interface WikipediaSummary {
  title: string,
  displaytitle: string,
  extract: string,
  extract_html: string,
  thumbnail: ImageProp,
  originalimage: ImageProp,
  lang: string,
  content_urls: ContentURLs,
};

export interface RandomPageProps {
  order: string,
  page: WikipediaSummary | null,
  openPageDetails: () => void,
};
