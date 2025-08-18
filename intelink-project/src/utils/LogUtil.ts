import { DEV } from "../types/environment.ts";

export const developmentLog = (...args: string[]) => {
	if (DEV) {
		console.log(...args);
	}
};
