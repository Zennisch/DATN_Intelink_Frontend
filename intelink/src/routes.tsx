import {lazy, type ReactNode} from 'react';
import { RouteGuard } from './components/etc/RouteGuard';

const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({default: m.default})));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((m) => ({default: m.default})));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then((m) => ({default: m.default})));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage').then((m) => ({default: m.default})));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({default: m.default})));

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
		path: '/dashboard',
		element: (
			<RouteGuard>
				<DashboardPage />
			</RouteGuard>
		),
		requireAuth: true,
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
