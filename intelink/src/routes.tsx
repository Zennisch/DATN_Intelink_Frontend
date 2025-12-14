import {lazy, type ReactNode} from 'react';
import { RouteGuard } from './components/etc/RouteGuard';

const LoginPage = lazy(() => import('./pages/auth/LoginPage').then((m) => ({default: m.default})));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage').then((m) => ({default: m.default})));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage').then((m) => ({default: m.default})));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage').then((m) => ({default: m.default})));
const VerifyEmailPage = lazy(() => import('./pages/auth/VerifyEmailPage').then((m) => ({default: m.default})));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({default: m.default})));
const RedirectPage = lazy(() => import('./pages/RedirectPage').then((m) => ({default: m.default})));
const OAuth2CallbackPage = lazy(() => import('./pages/OAuth2CallbackPage').then((m) => ({default: m.default})));
const PlansPage = lazy(() => import('./pages/PlansPage').then((m) => ({default: m.default})));
const SubscriptionCheckoutPage = lazy(() => import('./pages/SubscriptionCheckoutPage').then((m) => ({default: m.default})));
const PaymentCallbackPage = lazy(() => import('./pages/PaymentCallbackPage').then((m) => ({default: m.default})));
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({default: m.default})));

export interface RouteConfig {
	path: string;
	element: ReactNode;
	requireAuth?: boolean;
}

export const routes: RouteConfig[] = [
	{
		path: '/',
		element: <HomePage />,
	},
	{
		path: '/login',
		element: <LoginPage />,
	},
	{
		path: '/register',
		element: <RegisterPage />,
	},
	{
		path: '/forgot-password',
		element: <ForgotPasswordPage />,
	},
	{
		path: '/reset-password',
		element: <ResetPasswordPage />,
	},
	{
		path: '/verify-email',
		element: <VerifyEmailPage />,
	},
	{
		path: '/auth/oauth2/callback',
		element: <OAuth2CallbackPage />,
	},
	{
		path: '/dashboard',
		element: (
			<RouteGuard requireAuth={true}>
				<DashboardPage />
			</RouteGuard>
		),
		requireAuth: true,
	},
	{
		path: '/plans',
		element: (
			<RouteGuard requireAuth={true}>
				<PlansPage />
			</RouteGuard>
		),
		requireAuth: true,
	},
	{
		path: '/checkout/:planId',
		element: (
			<RouteGuard requireAuth={true}>
				<SubscriptionCheckoutPage />
			</RouteGuard>
		),
		requireAuth: true,
	},
	{
		path: '/payments/payment-callback',
		element: (
			<RouteGuard requireAuth={true}>
				<PaymentCallbackPage />
			</RouteGuard>
		),
		requireAuth: true,
	},
	{
		path: '/:shortCode',
		element: <RedirectPage />,
	},
  // {
	// 	path: "/",
	// 	element: (
	// 		<RouteGuard>
	// 			<LoginPage />
	// 		</RouteGuard>
	// 	)
	// }
];
