export type AccessControlMode = "NONE" | "WHITELIST" | "BLACKLIST";

export interface ShortUrl {
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
