import {lazy, type ReactNode} from 'react';
import { RouteGuard } from './components/etc/RouteGuard';

const LoginPage = lazy(() => import('./pages/auth/LoginPage').then((m) => ({default: m.default})));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage').then((m) => ({default: m.default})));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage').then((m) => ({default: m.default})));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage').then((m) => ({default: m.default})));
const VerifyEmailPage = lazy(() => import('./pages/auth/VerifyEmailPage').then((m) => ({default: m.default})));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({default: m.default})));
const RedirectPage = lazy(() => import('./pages/RedirectPage').then((m) => ({default: m.default})));

export interface RouteConfig {
	path: string;
	element: ReactNode;
	requireAuth?: boolean;
}

export const routes: RouteConfig[] = [
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
		path: '/dashboard',
		element: (
			<RouteGuard requireAuth={true}>
				<DashboardPage />
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
