import type { AccessControlMode } from "../models/ShortUrl";

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
}
