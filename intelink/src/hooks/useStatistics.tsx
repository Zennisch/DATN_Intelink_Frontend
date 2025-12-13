import {createContext, useContext, useState, type ReactNode} from 'react';
import type {
	DimensionStatResponse,
	GeographyStatResponse,
	TimeSeriesStatResponse,
	PeakTimeStatResponse,
} from '../dto/StatisticsDTO';
import {StatisticsService, type TimeSeriesParams, type PeakTimeParams} from '../services/StatisticsService';

export interface StatisticsState {
	isLoading: boolean;
	currentShortCode: string | null;
}

export interface StatisticsContextType extends StatisticsState {
	getBrowserStats: (shortCode: string) => Promise<DimensionStatResponse>;
	getOsStats: (shortCode: string) => Promise<DimensionStatResponse>;
	getDeviceStats: (shortCode: string) => Promise<DimensionStatResponse>;
	getCountryStats: (shortCode: string) => Promise<GeographyStatResponse>;
	getCityStats: (shortCode: string) => Promise<GeographyStatResponse>;
	getTimeSeriesStats: (shortCode: string, params?: TimeSeriesParams) => Promise<TimeSeriesStatResponse>;
	getPeakTimeStats: (shortCode: string, params?: PeakTimeParams) => Promise<PeakTimeStatResponse>;
	getAllBrowserStats: (params?: TimeSeriesParams) => Promise<DimensionStatResponse>;
	getAllOsStats: (params?: TimeSeriesParams) => Promise<DimensionStatResponse>;
	getAllDeviceStats: (params?: TimeSeriesParams) => Promise<DimensionStatResponse>;
	getAllCountryStats: (params?: TimeSeriesParams) => Promise<GeographyStatResponse>;
	getAllCityStats: (params?: TimeSeriesParams) => Promise<GeographyStatResponse>;
	getAllTimeSeriesStats: (params?: TimeSeriesParams) => Promise<TimeSeriesStatResponse>;
	getAllPeakTimeStats: (params?: PeakTimeParams) => Promise<PeakTimeStatResponse>;
	setCurrentShortCode: (shortCode: string | null) => void;
}

export const StatisticsContext = createContext<StatisticsContextType | undefined>(undefined);

interface StatisticsProviderProps {
	children: ReactNode;
}

export const StatisticsProvider: React.FC<StatisticsProviderProps> = ({children}) => {
	const [statisticsState, setStatisticsState] = useState<StatisticsState>({
		isLoading: false,
		currentShortCode: null,
	});

	const setLoading = (isLoading: boolean) => {
		setStatisticsState((prev) => ({...prev, isLoading}));
	};

	const getBrowserStats = async (shortCode: string): Promise<DimensionStatResponse> => {
		try {
			setLoading(true);
			setStatisticsState((prev) => ({...prev, currentShortCode: shortCode}));
			const response = await StatisticsService.getBrowserStats(shortCode);
			return response;
		} catch (error) {
			console.error('Failed to get browser stats:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const getOsStats = async (shortCode: string): Promise<DimensionStatResponse> => {
		try {
			setLoading(true);
			setStatisticsState((prev) => ({...prev, currentShortCode: shortCode}));
			const response = await StatisticsService.getOsStats(shortCode);
			return response;
		} catch (error) {
			console.error('Failed to get OS stats:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const getDeviceStats = async (shortCode: string): Promise<DimensionStatResponse> => {
		try {
			setLoading(true);
			setStatisticsState((prev) => ({...prev, currentShortCode: shortCode}));
			const response = await StatisticsService.getDeviceStats(shortCode);
			return response;
		} catch (error) {
			console.error('Failed to get device stats:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const getCountryStats = async (shortCode: string): Promise<GeographyStatResponse> => {
		try {
			setLoading(true);
			setStatisticsState((prev) => ({...prev, currentShortCode: shortCode}));
			const response = await StatisticsService.getCountryStats(shortCode);
			return response;
		} catch (error) {
			console.error('Failed to get country stats:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const getCityStats = async (shortCode: string): Promise<GeographyStatResponse> => {
		try {
			setLoading(true);
			setStatisticsState((prev) => ({...prev, currentShortCode: shortCode}));
			const response = await StatisticsService.getCityStats(shortCode);
			return response;
		} catch (error) {
			console.error('Failed to get city stats:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const getTimeSeriesStats = async (
		shortCode: string,
		params?: TimeSeriesParams
	): Promise<TimeSeriesStatResponse> => {
		try {
			setLoading(true);
			setStatisticsState((prev) => ({...prev, currentShortCode: shortCode}));
			const response = await StatisticsService.getTimeSeriesStats(shortCode, params);
			return response;
		} catch (error) {
			console.error('Failed to get time series stats:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const getPeakTimeStats = async (shortCode: string, params?: PeakTimeParams): Promise<PeakTimeStatResponse> => {
		try {
			setLoading(true);
			setStatisticsState((prev) => ({...prev, currentShortCode: shortCode}));
			const response = await StatisticsService.getPeakTimeStats(shortCode, params);
			return response;
		} catch (error) {
			console.error('Failed to get peak time stats:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const getAllBrowserStats = async (params?: TimeSeriesParams): Promise<DimensionStatResponse> => {
		try {
			setLoading(true);
			const response = await StatisticsService.getAllBrowserStats(params);
			return response;
		} catch (error) {
			console.error('Failed to get all browser stats:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const getAllOsStats = async (params?: TimeSeriesParams): Promise<DimensionStatResponse> => {
		try {
			setLoading(true);
			const response = await StatisticsService.getAllOsStats(params);
			return response;
		} catch (error) {
			console.error('Failed to get all OS stats:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const getAllDeviceStats = async (params?: TimeSeriesParams): Promise<DimensionStatResponse> => {
		try {
			setLoading(true);
			const response = await StatisticsService.getAllDeviceStats(params);
			return response;
		} catch (error) {
			console.error('Failed to get all device stats:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const getAllCountryStats = async (params?: TimeSeriesParams): Promise<GeographyStatResponse> => {
		try {
			setLoading(true);
			const response = await StatisticsService.getAllCountryStats(params);
			return response;
		} catch (error) {
			console.error('Failed to get all country stats:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const getAllCityStats = async (params?: TimeSeriesParams): Promise<GeographyStatResponse> => {
		try {
			setLoading(true);
			const response = await StatisticsService.getAllCityStats(params);
			return response;
		} catch (error) {
			console.error('Failed to get all city stats:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const getAllTimeSeriesStats = async (params?: TimeSeriesParams): Promise<TimeSeriesStatResponse> => {
		try {
			setLoading(true);
			const response = await StatisticsService.getAllTimeSeriesStats(params);
			return response;
		} catch (error) {
			console.error('Failed to get all time series stats:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const getAllPeakTimeStats = async (params?: PeakTimeParams): Promise<PeakTimeStatResponse> => {
		try {
			setLoading(true);
			const response = await StatisticsService.getAllPeakTimeStats(params);
			return response;
		} catch (error) {
			console.error('Failed to get all peak time stats:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const setCurrentShortCode = (shortCode: string | null) => {
		setStatisticsState((prev) => ({...prev, currentShortCode: shortCode}));
	};

	const value: StatisticsContextType = {
		...statisticsState,
		getBrowserStats,
		getOsStats,
		getDeviceStats,
		getCountryStats,
		getCityStats,
		getTimeSeriesStats,
		getPeakTimeStats,
		getAllBrowserStats,
		getAllOsStats,
		getAllDeviceStats,
		getAllCountryStats,
		getAllCityStats,
		getAllTimeSeriesStats,
		getAllPeakTimeStats,
		setCurrentShortCode,
	};

	return <StatisticsContext.Provider value={value}>{children}</StatisticsContext.Provider>;
};

export const useStatistics = (): StatisticsContextType => {
	const context = useContext(StatisticsContext);
	if (context === undefined) {
		throw new Error('useStatistics must be used within a StatisticsProvider');
	}
	return context;
};
