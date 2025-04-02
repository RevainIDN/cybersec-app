import '../Authorization.css'
import { useState } from 'react';
import { fetchLogin } from '../../../services/Authorization/authorization';

export default function LoginForm() {
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [keepSignedIn, setKeepSignedIn] = useState<boolean>(false);

	const [typePasswordInput, setTypePasswordInput] = useState<boolean>(false);

	const handleChangeInputType = () => {
		setTypePasswordInput(prev => !prev)
	}

	const handleCheckKeepSignedIn = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.target.checked ? setKeepSignedIn(true) : setKeepSignedIn(false);
	}

	const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const data = await fetchLogin(username, password, keepSignedIn);
			if (data.token) {
				window.location.href = '/';
			}
		} catch (error) {
			console.error('Ошибка:', error);
		}
	};

	return (
		<form
			className='form-signin'
			method='post'
			name='form'
			onSubmit={handleSubmitLogin}
		>
			<label className='signin-label' htmlFor="username">
				Username
				<input
					className='input signin-input'
					type="text"
					id='username'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>

			</label>
			<label className='signin-label' htmlFor="password">
				Password
				<div className='password-wrapper'>
					<input
						className='input signin-input'
						type={typePasswordInput ? 'text' : 'password'}
						id='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<button className='input-btn auth-btn-password button' type='button' onClick={handleChangeInputType}>
						<img src="icons/hide-password.svg" alt="Hide" />
					</button>
				</div>

			</label>
			<div className='switch-cont'>
				<label className='switch'>
					<input className='switch-input' type="checkbox" onChange={handleCheckKeepSignedIn} />
					<span className='switch-slider'></span>
				</label>
				Keep me signed in
			</div>
			<button className='button signin-btn' type='submit'>Sign In</button>
		</form>
	)
}