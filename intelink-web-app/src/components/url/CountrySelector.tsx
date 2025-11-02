import Select, {type MultiValue, type StylesConfig} from 'react-select';
import {countryOptions, type CountryOption} from '../../utils/countries';

interface CountrySelectorProps {
	selectedCountries: string[];
	onChange: (countries: string[]) => void;
	disabled?: boolean;
}

// Custom styles for react-select to match our design
const customStyles: StylesConfig<CountryOption, true> = {
	control: (provided, state) => ({
		...provided,
		borderColor: state.isFocused ? '#6B7280' : '#D1D5DB',
		borderRadius: '0.5rem',
		padding: '0.25rem',
		boxShadow: state.isFocused ? '0 0 0 2px rgba(107, 114, 128, 0.1)' : 'none',
		'&:hover': {
			borderColor: '#9CA3AF',
		},
	}),
	multiValue: (provided) => ({
		...provided,
		backgroundColor: '#F3F4F6',
		borderRadius: '0.375rem',
	}),
	multiValueLabel: (provided) => ({
		...provided,
		color: '#374151',
		fontSize: '0.875rem',
	}),
	multiValueRemove: (provided) => ({
		...provided,
		color: '#6B7280',
		'&:hover': {
			backgroundColor: '#E5E7EB',
			color: '#374151',
		},
	}),
	menu: (provided) => ({
		...provided,
		borderRadius: '0.5rem',
		boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
	}),
	option: (provided, state) => ({
		...provided,
		backgroundColor: state.isSelected ? '#F3F4F6' : state.isFocused ? '#F9FAFB' : 'white',
		color: '#374151',
		'&:active': {
			backgroundColor: '#E5E7EB',
		},
	}),
};

export const CountrySelector = ({selectedCountries, onChange, disabled = false}: CountrySelectorProps) => {
	const selectedOptions = countryOptions.filter((opt) => selectedCountries.includes(opt.value));

	const handleChange = (newValue: MultiValue<CountryOption>) => {
		onChange(newValue.map((opt) => opt.value));
	};

	return (
		<div className="space-y-2">
			<label className="block text-sm font-medium text-gray-700">Select Countries</label>
			<Select
				isMulti
				options={countryOptions}
				value={selectedOptions}
				onChange={handleChange}
				isDisabled={disabled}
				styles={customStyles}
				placeholder="Search and select countries..."
				className="text-sm"
				classNamePrefix="react-select"
				isClearable={false}
				closeMenuOnSelect={false}
			/>
			{selectedCountries.length > 0 && (
				<p className="text-xs text-gray-500">
					{selectedCountries.length} {selectedCountries.length === 1 ? 'country' : 'countries'} selected
				</p>
			)}
		</div>
	);
};
