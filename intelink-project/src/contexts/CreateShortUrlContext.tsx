import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface CreateShortUrlContextType {
	showCreateForm: boolean;
	setShowCreateForm: (show: boolean) => void;
	openCreateForm: () => void;
	closeCreateForm: () => void;
}

const CreateShortUrlContext = createContext<CreateShortUrlContextType | undefined>(
	undefined,
);

interface CreateShortUrlProviderProps {
	children: ReactNode;
}

export const CreateShortUrlProvider: React.FC<CreateShortUrlProviderProps> = ({
	children,
}) => {
	const [showCreateForm, setShowCreateForm] = useState(false);

	const openCreateForm = () => setShowCreateForm(true);
	const closeCreateForm = () => setShowCreateForm(false);

	return (
		<CreateShortUrlContext.Provider
			value={{
				showCreateForm,
				setShowCreateForm,
				openCreateForm,
				closeCreateForm,
			}}
		>
			{children}
		</CreateShortUrlContext.Provider>
	);
};

export const useCreateShortUrl = () => {
	const context = useContext(CreateShortUrlContext);
	if (context === undefined) {
		throw new Error(
			"useCreateShortUrl must be used within a CreateShortUrlProvider",
		);
	}
	return context;
};
