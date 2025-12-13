import {createContext, useContext, useState, useCallback, type ReactNode} from 'react';
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

	const setLoading = useCallback((isLoading: boolean) => {
		setStatisticsState((prev) => ({...prev, isLoading}));
	}, []);

	const getBrowserStats = useCallback(async (shortCode: string): Promise<DimensionStatResponse> => {
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
	}, [setLoading]);

	const getOsStats = useCallback(async (shortCode: string): Promise<DimensionStatResponse> => {
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
	}, [setLoading]);

	const getDeviceStats = useCallback(async (shortCode: string): Promise<DimensionStatResponse> => {
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
	}, [setLoading]);

	const getCountryStats = useCallback(async (shortCode: string): Promise<GeographyStatResponse> => {
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
	}, [setLoading]);

	const getCityStats = useCallback(async (shortCode: string): Promise<GeographyStatResponse> => {
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
	}, [setLoading]);

	const getTimeSeriesStats = useCallback(async (
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
	}, [setLoading]);

	const getPeakTimeStats = useCallback(async (shortCode: string, params?: PeakTimeParams): Promise<PeakTimeStatResponse> => {
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
	}, [setLoading]);

	const setCurrentShortCode = useCallback((shortCode: string | null) => {
		setStatisticsState((prev) => ({...prev, currentShortCode: shortCode}));
	}, []);

	const value: StatisticsContextType = {
		...statisticsState,
		getBrowserStats,
		getOsStats,
		getDeviceStats,
		getCountryStats,
		getCityStats,
		getTimeSeriesStats,
		getPeakTimeStats,
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
