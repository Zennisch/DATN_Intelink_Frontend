import axios from 'axios';
import type {
	CreateVNPayPaymentRequest,
	CreateVNPayPaymentResponse,
} from '../dto/PaymentDTO';

export interface VNPayCallbackParams {
	[key: string]: string;
}

export interface VNPayCallbackResponse {
	RspCode: string;
	Message: string;
}

export class PaymentService {
	/**
	 * Create VNPay payment and get payment URL
	 */
	static async createVNPayPayment(request: CreateVNPayPaymentRequest): Promise<CreateVNPayPaymentResponse> {
		const response = await axios.post<CreateVNPayPaymentResponse>('/payments/vnpay/create', request);
		return response.data;
	}

	/**
	 * Handle VNPay callback (typically called by VNPay, not frontend directly)
	 * This is here for reference or manual testing purposes
	 */
	static async vnpayCallback(params: VNPayCallbackParams): Promise<VNPayCallbackResponse> {
		const response = await axios.get<VNPayCallbackResponse>('/payments/vnpay/callback', {
			params,
		});
		return response.data;
	}
}
