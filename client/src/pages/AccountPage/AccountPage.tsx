import './AccountPage.css'

export default function AccountPage() {
	return (
		<div className='section'>
			<div className='account-page'>
				<div className='account-options'>
					<div className='account-edit-settings'>
						<img className='account-avatar' src="account/default_avatar.svg" alt="Avatar" />
						<h1 className='account-username'>Some user</h1>
					</div>
					<ul className='account-options-btns'>
						<li className='account-option-btn'>Some option</li>
						<li className='account-option-btn'>Some option</li>
						<li className='account-option-btn'>Some option</li>
						<li className='account-option-btn'>Some option</li>
						<li className='account-option-btn'>Some option</li>
					</ul>
				</div>
				<div className='account-content'>
					<h1>Some Content</h1>
				</div>
			</div>
		</div>
	)
}