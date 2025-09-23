import { lazy } from "react";
import RouteGuard from "./components/RouteGuard";

const SubscriptionPlansPage = lazy(() => import("./pages/SubscriptionPlansPage"));

const LoginPage = lazy(() => import("./pages/LoginPage").then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import("./pages/RegisterPage").then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage").then(m => ({ default: m.ForgotPasswordPage })));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const OAuth2CallbackPage = lazy(() => import("./pages/OAuth2CallbackPage"));
const RegisterSuccessPage = lazy(() => import("./pages/RegisterSuccessPage").then(m => ({ default: m.RegisterSuccessPage })));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage").then(m => ({ default: m.VerifyEmailPage })));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage").then(m => ({ default: m.ResetPasswordPage })));
const UnlockUrlPage = lazy(() => import("./pages/UnlockUrlPage"));
const RedirectPage = lazy(() => import("./pages/RedirectPage"));
const PaymentCostPage = lazy(() => import("./pages/PaymentCostPage"));

export interface RouteConfig {
	path: string;
	element: JSX.Element;
	requireAuth?: boolean;
}

export const routes: RouteConfig[] = [
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
