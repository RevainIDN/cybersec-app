import './SettingsCheckbox.css'

type SettingCheckboxProps = {
	checked: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	label: string;
};

export default function SettingCheckbox({ checked, onChange, label }: SettingCheckboxProps) {
	return (
		<li className='setting-item'>
			<label className='label-checkbox'>
				<input className='checkbox' type="checkbox" checked={checked} onChange={onChange} />
				<span className='custom-checkbox'></span>
				{label}
			</label>
		</li>
	);
}