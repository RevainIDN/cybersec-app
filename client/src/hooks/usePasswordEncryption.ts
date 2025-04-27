import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { useTranslation } from 'react-i18next';
import { AES, enc } from 'crypto-js';
import { showNotification } from '../store/generalSlice';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
	userId: string;
}

export const usePasswordEncryption = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>();
	const token = useSelector((state: RootState) => state.auth.token);

	const getEncryptionKey = () => {
		if (!token) {
			dispatch(showNotification({ message: t('accountPage.passwordManager.noToken'), type: 'error' }));
			return '';
		}
		try {
			const decoded: DecodedToken = jwtDecode(token);
			return decoded.userId;
		} catch (error) {
			dispatch(showNotification({ message: t('accountPage.passwordManager.noToken'), type: 'error' }));
			return '';
		}
	};

	const encryptData = (data: string) => {
		const key = getEncryptionKey();
		if (!key) return '';
		return AES.encrypt(data, key).toString();
	};

	const decryptData = (data: string) => {
		const key = getEncryptionKey();
		if (!key) return '';
		try {
			const decrypted = AES.decrypt(data, key).toString(enc.Utf8);
			return decrypted || '';
		} catch (error) {
			console.error('Decryption error:', error, 'Data:', data);
			return '';
		}
	};

	return { encryptData, decryptData };
};