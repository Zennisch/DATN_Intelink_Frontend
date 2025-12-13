import {createContext, useContext, useState, type ReactNode} from 'react';
import type {CreateVNPayPaymentRequest, CreateVNPayPaymentResponse} from '../dto/PaymentDTO';
import {PaymentService, type VNPayCallbackParams, type VNPayCallbackResponse} from '../services/PaymentService';

export interface PaymentState {
	isLoading: boolean;
	currentPaymentUrl: string | null;
}

export interface PaymentContextType extends PaymentState {
	createVNPayPayment: (request: CreateVNPayPaymentRequest) => Promise<CreateVNPayPaymentResponse>;
	vnpayCallback: (params: VNPayCallbackParams) => Promise<VNPayCallbackResponse>;
	clearPaymentUrl: () => void;
}

export const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

interface PaymentProviderProps {
	children: ReactNode;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({children}) => {
	const [paymentState, setPaymentState] = useState<PaymentState>({
		isLoading: false,
		currentPaymentUrl: null,
	});

	const setLoading = (isLoading: boolean) => {
		setPaymentState((prev) => ({...prev, isLoading}));
	};

	const createVNPayPayment = async (request: CreateVNPayPaymentRequest): Promise<CreateVNPayPaymentResponse> => {
		try {
			setLoading(true);
			const response = await PaymentService.createVNPayPayment(request);

			if (response.code === '00') {
				setPaymentState((prev) => ({...prev, currentPaymentUrl: response.paymentUrl}));
			}

			return response;
		} catch (error) {
			console.error('Failed to create VNPay payment:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const vnpayCallback = async (params: VNPayCallbackParams): Promise<VNPayCallbackResponse> => {
		try {
			setLoading(true);
			const response = await PaymentService.vnpayCallback(params);
			return response;
		} catch (error) {
			console.error('Failed to process VNPay callback:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const clearPaymentUrl = () => {
		setPaymentState((prev) => ({...prev, currentPaymentUrl: null}));
	};

	const value: PaymentContextType = {
		...paymentState,
		createVNPayPayment,
		vnpayCallback,
		clearPaymentUrl,
	};

	return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};

export const usePayment = (): PaymentContextType => {
	const context = useContext(PaymentContext);
	if (context === undefined) {
		throw new Error('usePayment must be used within a PaymentProvider');
	}
	return context;
};
