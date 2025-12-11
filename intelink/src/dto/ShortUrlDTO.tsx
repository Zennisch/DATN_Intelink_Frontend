import type { AccessControlMode } from "../models/ShortUrl";

// Analysis Types
export type ShortUrlAnalysisEngine = "GOOGLE_SAFE_BROWSING" | "VIRUSTOTAL" | "PHISHING_DETECTOR";

export type ShortUrlAnalysisStatus = 
  | "PENDING"
  | "SAFE"
  | "MALICIOUS"
  | "SUSPICIOUS"
  | "MALWARE"
  | "SOCIAL_ENGINEERING"
  | "UNKNOWN";

// Analysis Result
export interface ShortUrlAnalysisResultResponse {
  id: string;
  status: ShortUrlAnalysisStatus;
  engine: ShortUrlAnalysisEngine;
  threatType: string;
  platformType: string;
  cacheDuration?: string;
  details?: string;
  createdAt: string;
}

// Requests
export interface CreateShortUrlRequest {
  originalUrl: string;
  title?: string;
  description?: string;
  customCode?: string;
  availableDays?: number;
  maxUsage?: number;
  password?: string;
  accessControlMode?: AccessControlMode;
  accessControlCIDRs?: string[];
  accessControlGeographies?: string[];
}

export interface UpdateShortUrlRequest {
  originalUrl?: string;
  title?: string;
  description?: string;
  availableDays?: number;
  maxUsage?: number;
  password?: string;
  accessControlMode?: AccessControlMode;
  accessControlCIDRs?: string[];
  accessControlGeographies?: string[];
}

// Responses
export interface CreateShortUrlResponse {
  id: number;
  title?: string;
  description?: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  enabled: boolean;
  maxUsage?: number;
  expiresAt?: string;
  totalClicks: number;
  accessControlMode: AccessControlMode;
  allowedClicks: number;
  blockedClicks: number;
  uniqueClicks: number;
  createdAt: string;
  updatedAt: string;
  hasPassword: boolean;
  accessControlCIDRs?: string[];
  accessControlGeographies?: string[];
  analysisResults?: ShortUrlAnalysisResultResponse[];
}

export interface ShortUrlResponse {
  id: number;
  title?: string;
  description?: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  enabled: boolean;
  maxUsage?: number;
  expiresAt?: string;
  totalClicks: number;
  accessControlMode: AccessControlMode;
  allowedClicks: number;
  blockedClicks: number;
  uniqueClicks: number;
  createdAt: string;
  updatedAt: string;
  hasPassword: boolean;
  accessControlCIDRs?: string[];
  accessControlGeographies?: string[];
  analysisResults?: ShortUrlAnalysisResultResponse[];
}

export interface UpdateShortUrlResponse {
  id: number;
  title?: string;
  description?: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  enabled: boolean;
  maxUsage?: number;
  expiresAt?: string;
  totalClicks: number;
  accessControlMode: AccessControlMode;
  allowedClicks: number;
  blockedClicks: number;
  uniqueClicks: number;
  createdAt: string;
  updatedAt: string;
  hasPassword: boolean;
  accessControlCIDRs?: string[];
  accessControlGeographies?: string[];
  analysisResults?: ShortUrlAnalysisResultResponse[];
}
