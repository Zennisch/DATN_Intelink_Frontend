// Dimension Statistics (Browser, OS, Device)
export interface DimensionStatItemResponse {
  name: string;
  clicks: number;
  percentage: number;
}

export interface DimensionStatResponse {
  category: string;
  totalClicks: number;
  data: DimensionStatItemResponse[];
}

// Geography Statistics (Country, City)
export interface GeographyStatItemResponse {
  name: string;
  clicks: number;
  percentage: number;
  allowedClicks: number;
  blockedClicks: number;
}

export interface GeographyStatResponse {
  category: string;
  totalClicks: number;
  totalAllowedClicks: number;
  totalBlockedClicks: number;
  data: GeographyStatItemResponse[];
}

// Time Series Statistics
export interface TimeSeriesStatItemResponse {
  bucketStart: string;
  bucketEnd: string;
  clicks: number;
  allowedClicks: number;
  blockedClicks: number;
}

export interface TimeSeriesStatResponse {
  granularity: string;
  timezone: string;
  from: string;
  to: string;
  totalClicks: number;
  totalAllowedClicks: number;
  totalBlockedClicks: number;
  data: TimeSeriesStatItemResponse[];
}

// Peak Times Statistics
export interface PeakTimeStatResponse {
  granularity: string;
  timezone: string;
  from: string;
  to: string;
  totalBuckets: number;
  returnedBuckets: number;
  data: TimeSeriesStatItemResponse[];
}
