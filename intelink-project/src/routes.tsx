import { lazy } from "react";
import RouteGuard from "./legacy/components/RouteGuard";

const SubscriptionPlansPage = lazy(() => import("./legacy/pages/SubscriptionPlansPage"));

const LoginPage = lazy(() => import("./current/pages/LoginPage").then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import("./legacy/pages/RegisterPage").then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import("./legacy/pages/ForgotPasswordPage").then(m => ({ default: m.ForgotPasswordPage })));
const DashboardPage = lazy(() => import("./legacy/pages/DashboardPage"));
const OAuth2CallbackPage = lazy(() => import("./legacy/pages/OAuth2CallbackPage"));
const RegisterSuccessPage = lazy(() => import("./legacy/pages/RegisterSuccessPage").then(m => ({ default: m.RegisterSuccessPage })));
const VerifyEmailPage = lazy(() => import("./legacy/pages/VerifyEmailPage").then(m => ({ default: m.VerifyEmailPage })));
const ResetPasswordPage = lazy(() => import("./legacy/pages/ResetPasswordPage").then(m => ({ default: m.ResetPasswordPage })));
const UnlockUrlPage = lazy(() => import("./legacy/pages/UnlockUrlPage"));
const RedirectPage = lazy(() => import("./legacy/pages/RedirectPage"));

const PaymentCostPage = lazy(() => import("./legacy/pages/PaymentCostPage"));
const PaymentCallbackPage = lazy(() => import("./legacy/pages/PaymentCallbackPage"));
const PaymentSuccessPage = lazy(() => import("./legacy/pages/PaymentSuccessPage"));

export interface RouteConfig {
	path: string;
	element: JSX.Element;
	requireAuth?: boolean;
}

export const routes: RouteConfig[] = [
	{
		path: "/payments/payment-callback",
		element: <PaymentCallbackPage />
	},
	{
		path: "/payments/payment-success",
		element: <PaymentSuccessPage />
	},
	{
		path: "/plans/:planId/cost",
		element: (
			<RouteGuard requireAuth>
				<PaymentCostPage />
			</RouteGuard>
		),
		requireAuth: true
	},
	{
		path: "/login",
		element: (
			<RouteGuard>
				<LoginPage />
			</RouteGuard>
		)
	},
	{
		path: "/register",
		element: (
			<RouteGuard>
				<RegisterPage />
			</RouteGuard>
		)
	},
	{
		path: "/forgot-password",
		element: (
			<RouteGuard>
				<ForgotPasswordPage />
			</RouteGuard>
		)
	},
	{
		path: "/dashboard/*",
		element: (
			<RouteGuard requireAuth>
				<DashboardPage />
			</RouteGuard>
		),
		requireAuth: true
	},
	   {
		   path: "/plans",
		   element: (
			   <RouteGuard requireAuth>
				   <SubscriptionPlansPage />
			   </RouteGuard>
		   ),
		   requireAuth: true
	   },
	{
		path: "/auth/oauth2/callback",
		element: <OAuth2CallbackPage />
	},
	{
		path: "/register/success",
		element: <RegisterSuccessPage />
	},
	{
		path: "/verify-email",
		element: <VerifyEmailPage />
	},
	{
		path: "/reset-password",
		element: <ResetPasswordPage />
	},
	{
		path: "/:shortCode/unlock",
		element: <UnlockUrlPage />
	},
	{
		path: "/:shortCode",
		element: <RedirectPage />
	},
	{
		path: "/",
		element: (
			<RouteGuard>
				<LoginPage />
			</RouteGuard>
		)
	}
];
