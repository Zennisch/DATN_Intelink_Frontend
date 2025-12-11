export type RedirectResultType = 
    | "SUCCESS"
    | "NOT_FOUND"
    | "UNAVAILABLE"
    | "ACCESS_DENIED"
    | "PASSWORD_PROTECTED"
    | "INCORRECT_PASSWORD";

export const RedirectResultType = {
    SUCCESS: "SUCCESS",
    NOT_FOUND: "NOT_FOUND",
    UNAVAILABLE: "UNAVAILABLE",
    ACCESS_DENIED: "ACCESS_DENIED",
    PASSWORD_PROTECTED: "PASSWORD_PROTECTED",
    INCORRECT_PASSWORD: "INCORRECT_PASSWORD"
} as const;

export interface RedirectResult {
    type: RedirectResultType;
    message: string | null;
    shortCode: string | null;
    redirectUrl: string | null;
}
