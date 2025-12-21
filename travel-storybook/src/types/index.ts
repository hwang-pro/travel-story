import type { Timestamp } from 'firebase/firestore';

export type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

export type Trip = {
  id: string;
  uid: string;
  title: string;
  date: string;
  members: string[];
  notes: string;
  places: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  hasStorybook: boolean;
};

export type Photo = {
  id: string;
  tripId: string;
  uid: string;
  url: string;
  fileName: string;
  uploadedAt: Timestamp;
};

export type StorybookPage = {
  page: number;
  title: string;
  caption: string;
  layout: 'full' | 'two-photos' | 'three-photos' | 'grid';
};

export type Storybook = {
  id: string;
  tripId: string;
  uid: string;
  summary: string;
  pages: StorybookPage[];
  createdAt: Timestamp;
};
