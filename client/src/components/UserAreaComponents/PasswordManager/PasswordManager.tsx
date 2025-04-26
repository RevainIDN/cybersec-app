import './PasswordManager.css'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Password } from '../../../types/AccountTypes/passwordManagerTypes';
import CreateTab from './CreateTab/CreateTab';
import AllTab from './AllTab/AllTab';

export default function PasswordManager() {
	const { t } = useTranslation();
	const [selectedTab, setSelectedTab] = useState<'create' | 'all'>('create');
	const [passwords, setPasswords] = useState<Password[]>([]);
	const [remaining, setRemaining] = useState<number>(100);

	return (
		<div className='pass-manager'>
			<div className='pass-manager-btns'>
				<button
					className={`pass-manager-btn ${selectedTab === 'create' ? 'pass-manager--active' : ''}`}
					onClick={() => setSelectedTab('create')}
				>
					{t('accountPage.passwordManager.tabButton1')}
				</button>
				<button
					className={`pass-manager-btn ${selectedTab === 'all' ? 'pass-manager--active' : ''}`}
					onClick={() => setSelectedTab('all')}
				>
					{t('accountPage.passwordManager.tabButton2')}
				</button>
			</div>

			{selectedTab === 'create' &&
				<CreateTab
					passwords={passwords}
					setPasswords={setPasswords}
					remaining={remaining}
					setRemaining={setRemaining}
				/>}

			{selectedTab === 'all' &&
				<AllTab
					selectedTab={selectedTab}
					passwords={passwords}
					setPasswords={setPasswords}
					remaining={remaining}
					setRemaining={setRemaining}
				/>}
		</div>
	)
}