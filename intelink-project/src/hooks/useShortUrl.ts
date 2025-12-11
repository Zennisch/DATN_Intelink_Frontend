import { useContext } from "react";
import { ShortUrlContext, type ShortUrlContextType } from "../contexts/ShortUrlContext.tsx";

export const useShortUrl = (): ShortUrlContextType => {
	const context = useContext(ShortUrlContext);
	if (context === undefined) {
		throw new Error("useShortUrl must be used within a ShortUrlProvider");
	}
	return context;
};
