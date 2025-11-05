import { IconComponent } from "../components/Icon.tsx";
import Google from "../assets/google.svg";
import GitHub from "../assets/github.svg";
import Loupe from "../assets/loupe.svg";
import DropDown from "../assets/drop-down.svg";

export const ICONS = {
	GOOGLE: IconComponent(Google),
	GITHUB: IconComponent(GitHub),
	SEARCH: IconComponent(Loupe),
	DROP_DOWN: IconComponent(DropDown),
};

export const LANGUAGES = {
	EN: "English (United States)",
	VI: "Tiếng Việt (Vietnam)",
	CN: "中文 (简体)",
	JA: "日本語 (Japan)",
};
