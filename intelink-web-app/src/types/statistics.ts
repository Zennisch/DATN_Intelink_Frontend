export const DimensionType = {
	// Sources
	REFERRER: "REFERRER",
	REFERRER_TYPE: "REFERRER_TYPE",
	UTM_SOURCE: "UTM_SOURCE",
	UTM_MEDIUM: "UTM_MEDIUM",
	UTM_CAMPAIGN: "UTM_CAMPAIGN",
	UTM_TERM: "UTM_TERM",
	UTM_CONTENT: "UTM_CONTENT",

	// Geometrics
	COUNTRY: "COUNTRY",
	REGION: "REGION",
	CITY: "CITY",
	TIMEZONE: "TIMEZONE",

	// Technologies
	BROWSER: "BROWSER",
	OS: "OS",
	DEVICE_TYPE: "DEVICE_TYPE",
	ISP: "ISP",
	LANGUAGE: "LANGUAGE",

	// Custom dimensions
	CUSTOM: "CUSTOM",
} as const;

export type DimensionType = (typeof DimensionType)[keyof typeof DimensionType];

export interface StatisticsData {
	name: string;
	clicks: number;
	percentage: number;
}

export interface StatisticsResponse {
	data: StatisticsData[];
	totalClicks: number;
	category: string;
}

export const DIMENSION_CATEGORIES = {
	sources: [
		DimensionType.REFERRER,
		DimensionType.REFERRER_TYPE,
		DimensionType.UTM_SOURCE,
		DimensionType.UTM_MEDIUM,
		DimensionType.UTM_CAMPAIGN,
		DimensionType.UTM_TERM,
		DimensionType.UTM_CONTENT,
	],
	geometrics: [
		DimensionType.COUNTRY,
		DimensionType.REGION,
		DimensionType.CITY,
		DimensionType.TIMEZONE,
	],
	technologies: [
		DimensionType.BROWSER,
		DimensionType.OS,
		DimensionType.DEVICE_TYPE,
		DimensionType.ISP,
		DimensionType.LANGUAGE,
	],
	custom: [DimensionType.CUSTOM],
} as const;
