export interface Coordinates {
  lat: number;
  lon: number;
}

export enum NewsCategory {
  POLITICS = 'Politics',
  TECH = 'Technology',
  BUSINESS = 'Business',
  SCIENCE = 'Science',
  SPORTS = 'Sports',
  ENTERTAINMENT = 'Entertainment',
  GENERAL = 'General'
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: NewsCategory;
  locationName: string;
  coordinates: Coordinates;
  url?: string;
  timestamp?: string;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}