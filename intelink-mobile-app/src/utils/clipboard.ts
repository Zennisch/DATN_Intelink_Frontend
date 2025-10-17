import { Clipboard } from 'react-native';

export const copyToClipboard = async (text: string): Promise<boolean> => {
	try {
		Clipboard.setString(text);
		return true;
	} catch (error) {
		console.error('Failed to copy to clipboard:', error);
		return false;
	}
};

export const getFromClipboard = async (): Promise<string> => {
	try {
		const text = await Clipboard.getString();
		return text;
	} catch (error) {
		console.error('Failed to get from clipboard:', error);
		return '';
	}
};
