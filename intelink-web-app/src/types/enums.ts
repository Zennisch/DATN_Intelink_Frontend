// Custom Domain Status
export const CustomDomainStatus = {
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
  VERIFIED: 'VERIFIED',
  FAILED_VERIFICATION: 'FAILED_VERIFICATION',
  SUSPENDED: 'SUSPENDED',
  DELETED: 'DELETED'
} as const;

export type CustomDomainStatus = typeof CustomDomainStatus[keyof typeof CustomDomainStatus];

// Custom Domain Verification Method
export const CustomDomainVerificationMethod = {
  TXT_RECORD: 'TXT_RECORD',
  CNAME_RECORD: 'CNAME_RECORD',
  HTML_FILE: 'HTML_FILE'
} as const;

export type CustomDomainVerificationMethod = typeof CustomDomainVerificationMethod[keyof typeof CustomDomainVerificationMethod];

// Dimension Type
export const DimensionType = {
  // Sources
  REFERRER: 'REFERRER',
  REFERRER_TYPE: 'REFERRER_TYPE',
  UTM_SOURCE: 'UTM_SOURCE',
  UTM_MEDIUM: 'UTM_MEDIUM',
  UTM_CAMPAIGN: 'UTM_CAMPAIGN',
  UTM_TERM: 'UTM_TERM',
  UTM_CONTENT: 'UTM_CONTENT',

  // Geometrics
  COUNTRY: 'COUNTRY',
  REGION: 'REGION',
  CITY: 'CITY',
  TIMEZONE: 'TIMEZONE',

  // Technologies
  BROWSER: 'BROWSER',
  OS: 'OS',
  DEVICE_TYPE: 'DEVICE_TYPE',
  ISP: 'ISP',
  LANGUAGE: 'LANGUAGE',

  // Custom dimensions
  CUSTOM: 'CUSTOM'
} as const;

export type DimensionType = typeof DimensionType[keyof typeof DimensionType];

// Granularity
export const Granularity = {
  HOURLY: 'HOURLY',
  DAILY: 'DAILY',
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY'
} as const;

export type Granularity = typeof Granularity[keyof typeof Granularity];

// IP Version
export const IpVersion = {
  IPv4: 'IPv4',
  IPv6: 'IPv6',
  UNKNOWN: 'UNKNOWN'
} as const;

export type IpVersion = typeof IpVersion[keyof typeof IpVersion];

// Payment Provider
export const PaymentProvider = {
  CREDIT_CARD: 'CREDIT_CARD',
  PAYPAL: 'PAYPAL',
  BANK_TRANSFER: 'BANK_TRANSFER',
  VNPAY: 'VNPAY',
  MOMO: 'MOMO',
  ZALOPAY: 'ZALOPAY'
} as const;

export type PaymentProvider = typeof PaymentProvider[keyof typeof PaymentProvider];

// Payment Status
export const PaymentStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED'
} as const;

export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

// Short URL Analysis Engine
export const ShortUrlAnalysisEngine = {
  GOOGLE_SAFE_BROWSING: 'GOOGLE_SAFE_BROWSING',
  VIRUSTOTAL: 'VIRUSTOTAL',
  PHISHING_DETECTOR: 'PHISHING_DETECTOR'
} as const;

export type ShortUrlAnalysisEngine = typeof ShortUrlAnalysisEngine[keyof typeof ShortUrlAnalysisEngine];

// Short URL Analysis Platform Type
export const ShortUrlAnalysisPlatformType = {
  ANY_PLATFORM: 'ANY_PLATFORM',
  DESKTOP: 'DESKTOP',
  MOBILE: 'MOBILE',
  TABLET: 'TABLET'
} as const;

export type ShortUrlAnalysisPlatformType = typeof ShortUrlAnalysisPlatformType[keyof typeof ShortUrlAnalysisPlatformType];

// Short URL Analysis Status
export const ShortUrlAnalysisStatus = {
  PENDING: 'PENDING',
  SAFE: 'SAFE',
  MALICIOUS: 'MALICIOUS',
  SUSPICIOUS: 'SUSPICIOUS',
  MALWARE: 'MALWARE',
  SOCIAL_ENGINEERING: 'SOCIAL_ENGINEERING',
  UNKNOWN: 'UNKNOWN'
} as const;

export type ShortUrlAnalysisStatus = typeof ShortUrlAnalysisStatus[keyof typeof ShortUrlAnalysisStatus];

// Short URL Analysis Threat Type
export const ShortUrlAnalysisThreatType = {
  MALWARE: 'MALWARE',
  PHISHING: 'PHISHING',
  SPAM: 'SPAM',
  SCAM: 'SCAM',
  OTHER: 'OTHER',
  NONE: 'NONE'
} as const;

export type ShortUrlAnalysisThreatType = typeof ShortUrlAnalysisThreatType[keyof typeof ShortUrlAnalysisThreatType];

// Short URL Status
export const ShortUrlStatus = {
  ENABLED: 'ENABLED',
  DISABLED: 'DISABLED'
} as const;

export type ShortUrlStatus = typeof ShortUrlStatus[keyof typeof ShortUrlStatus];

// Subscription Plan Billing Interval
export const SubscriptionPlanBillingInterval = {
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
  NONE: 'NONE'
} as const;

export type SubscriptionPlanBillingInterval = typeof SubscriptionPlanBillingInterval[keyof typeof SubscriptionPlanBillingInterval];

// Subscription Plan Type
export const SubscriptionPlanType = {
  FREE: 'FREE',
  PRO: 'PRO',
  ENTERPRISE: 'ENTERPRISE'
} as const;

export type SubscriptionPlanType = typeof SubscriptionPlanType[keyof typeof SubscriptionPlanType];

// Subscription Status
export const SubscriptionStatus = {
	PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  TRIALING: 'TRIALING',
  PAST_DUE: 'PAST_DUE',
  CANCELED: 'CANCELED',
  EXPIRED: 'EXPIRED'
} as const;

export type SubscriptionStatus = typeof SubscriptionStatus[keyof typeof SubscriptionStatus];

// User Provider
export const UserProvider = {
  GOOGLE: 'GOOGLE',
  GITHUB: 'GITHUB',
  LOCAL: 'LOCAL'
} as const;

export type UserProvider = typeof UserProvider[keyof typeof UserProvider];

// User Role
export const UserRole = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  GUEST: 'GUEST'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

// User Status
export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BANNED: 'BANNED'
} as const;

export type UserStatus = typeof UserStatus[keyof typeof UserStatus];

// Verification Token Type
export const VerificationTokenType = {
  EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
  PASSWORD_RESET: 'PASSWORD_RESET',
  OAUTH_STATE: 'OAUTH_STATE'
} as const;

export type VerificationTokenType = typeof VerificationTokenType[keyof typeof VerificationTokenType];
