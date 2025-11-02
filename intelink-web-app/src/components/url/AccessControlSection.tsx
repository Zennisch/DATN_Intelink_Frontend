import {useState} from 'react';
import {Button} from '../primary';
import {CountrySelector} from './CountrySelector';
import {IPRangeInput} from './IPRangeInput';
import {AccessControlPreview} from './AccessControlPreview';

export interface AccessControlData {
	mode: 'allow' | 'block';
	countries: string[];
	ipRanges: string[];
}

interface AccessControlSectionProps {
	data: AccessControlData;
	onChange: (data: AccessControlData) => void;
}

export const AccessControlSection = ({data, onChange}: AccessControlSectionProps) => {
	const [activeTab, setActiveTab] = useState<'geography' | 'network'>('geography');

	const handleModeChange = (mode: 'allow' | 'block') => {
		onChange({...data, mode});
	};

	const handleCountriesChange = (countries: string[]) => {
		onChange({...data, countries});
	};

	const handleIPRangesChange = (ipRanges: string[]) => {
		onChange({...data, ipRanges});
	};

	const hasRestrictions = data.countries.length > 0 || data.ipRanges.length > 0;

	return (
		<div className="space-y-5">
			{/* Header */}
			<div className="pb-3 border-b border-gray-200">
				<h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Access Control</h3>
				<p className="text-xs text-gray-500 mt-1">Restrict access based on geographic location or IP address</p>
			</div>

			{/* Mode Selector */}
			<div className="space-y-2">
				<label className="block text-sm font-medium text-gray-700">Access Mode</label>
				<div className="flex gap-2">
					<Button
						type="button"
						variant={data.mode === 'allow' ? 'primary' : 'outline'}
						onClick={() => handleModeChange('allow')}
						size="sm"
						fullWidth
						className="justify-start"
						icon={<i className="fas fa-shield-check"></i>}
					>
						<span className="flex flex-col items-start text-left">
							<span className="font-semibold">Allow Only</span>
							<span className="text-xs opacity-80">Whitelist mode</span>
						</span>
					</Button>
					<Button
						type="button"
						variant={data.mode === 'block' ? 'primary' : 'outline'}
						onClick={() => handleModeChange('block')}
						size="sm"
						fullWidth
						className="justify-start"
						icon={<i className="fas fa-shield-xmark"></i>}
					>
						<span className="flex flex-col items-start text-left">
							<span className="font-semibold">Block Specific</span>
							<span className="text-xs opacity-80">Blacklist mode</span>
						</span>
					</Button>
				</div>
				<p className="text-xs text-gray-500">
					{data.mode === 'allow'
						? 'Only selected countries/IPs can access (more secure)'
						: 'Everyone can access except selected countries/IPs (more open)'}
				</p>
			</div>

			{/* Tabs */}
			<div className="border-b border-gray-200">
				<div className="flex gap-1">
					<button
						type="button"
						onClick={() => setActiveTab('geography')}
						className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
							activeTab === 'geography'
								? 'border-gray-900 text-gray-900'
								: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
						}`}
					>
						<i className="fas fa-globe mr-2"></i>
						Geography
						{data.countries.length > 0 && (
							<span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-900 text-white">
								{data.countries.length}
							</span>
						)}
					</button>
					<button
						type="button"
						onClick={() => setActiveTab('network')}
						className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
							activeTab === 'network'
								? 'border-gray-900 text-gray-900'
								: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
						}`}
					>
						<i className="fas fa-network-wired mr-2"></i>
						IP/Network
						{data.ipRanges.length > 0 && (
							<span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-900 text-white">
								{data.ipRanges.length}
							</span>
						)}
					</button>
				</div>
			</div>

			{/* Tab Content */}
			<div className="min-h-[300px]">
				{activeTab === 'geography' ? (
					<CountrySelector selectedCountries={data.countries} onChange={handleCountriesChange} />
				) : (
					<IPRangeInput ipRanges={data.ipRanges} onChange={handleIPRangesChange} />
				)}
			</div>

			{/* Preview Section */}
			<div className="pt-4 border-t border-gray-200">
				<p className="text-xs font-medium text-gray-700 mb-3">Preview:</p>
				<AccessControlPreview mode={data.mode} countries={data.countries} ipRanges={data.ipRanges} />
			</div>

			{/* Quick Actions */}
			{hasRestrictions && (
				<div className="flex justify-end">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => onChange({mode: data.mode, countries: [], ipRanges: []})}
						icon={<i className="fas fa-times-circle"></i>}
					>
						Clear All Restrictions
					</Button>
				</div>
			)}
		</div>
	);
};
