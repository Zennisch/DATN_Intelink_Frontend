import { DimensionType } from "../types/statistics"

export const DIMENSION_CATEGORIES = {
  Sources: [
    DimensionType.REFERRER,
    DimensionType.REFERRER_TYPE,
    DimensionType.UTM_SOURCE,
    DimensionType.UTM_MEDIUM,
    DimensionType.UTM_CAMPAIGN,
    DimensionType.UTM_TERM,
    DimensionType.UTM_CONTENT,
  ],
  Geometrics: [DimensionType.COUNTRY, DimensionType.REGION, DimensionType.CITY, DimensionType.TIMEZONE],
  Technologies: [
    DimensionType.BROWSER,
    DimensionType.OS,
    DimensionType.DEVICE_TYPE,
    DimensionType.ISP,
    DimensionType.LANGUAGE,
  ],
  Custom: [DimensionType.CUSTOM],
} as const
