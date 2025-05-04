import './AssistantChat.css'
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../store'
import { setIsOpenChatAssistant } from '../../../store/assistantSlice';
import { setOverlay } from '../../../store/generalSlice';
import { sendMessage } from '../../../services/AssistantApi/googleGeminiRequests';
import { AllMessages } from '../../../types/AssistantTypes/assistantTypes';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingDots from '../../GeneralComponents/LoadingDots/LoadingDots';

export default function AssistantChat() {
	const dispatch = useDispatch<AppDispatch>();
	const isOpen = useSelector((state: RootState) => state.assistant.isOpenChatAssistant);
	const [userMessage, setUserMessage] = useState<string>('');
	const [messageId, setMessageId] = useState<number>(1);
	const [allMessages, setAllMessages] = useState<AllMessages[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const messagesEndRef = useRef<HTMLLIElement>(null);

	useEffect(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = 'auto';
			const newHeight = Math.min(textarea.scrollHeight, 120);
			textarea.style.height = `${newHeight}px`;
		}
	}, [userMessage]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [allMessages, isLoading]);

	const handleClose = () => {
		dispatch(setIsOpenChatAssistant(false));
		dispatch(setOverlay(false));
	};

	const handleSend = async () => {
		if (!userMessage.trim()) return;

		const userMsg: AllMessages = {
			id: messageId,
			message: userMessage,
			from: 'user',
		};

		setAllMessages((prev) => [...prev, userMsg]);
		setMessageId((prev) => prev + 1);
		setUserMessage('');
		setIsLoading(true);

		try {
			const botResponse = await sendMessage(userMessage);
			const botMsg: AllMessages = {
				id: messageId + 1,
				message: botResponse,
				from: 'bot',
			};
			setAllMessages((prev) => [...prev, botMsg]);
			setMessageId((prev) => prev + 2);
		} catch (error) {
			const errorMsg: AllMessages = {
				id: messageId + 1,
				message: 'Ошибка связи с нейросетью',
				from: 'bot',
			};
			setAllMessages((prev) => [...prev, errorMsg]);
			setMessageId((prev) => prev + 2);
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className='assistant-chat'
					initial={{ x: '100%' }}
					animate={{ x: 0 }}
					exit={{ x: '100%' }}
					transition={{ duration: 0.3, ease: 'easeInOut' }}
				>
					<button
						className='assistant-chat-close'
						onClick={handleClose}>
						<img src="cross.svg" alt="close" />
					</button>
					<h1 className='assistant-chat-title'>SecureNET Чат-бот. Задайте вопрос!</h1>
					<ul className='assistant-chat-output'>
						{allMessages.map((msg => (
							<motion.li
								key={msg.id}
								className={`assistant-chat-message ${msg.from === 'user' ? 'user-message' : 'bot-message'}`}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								{msg.message}
							</motion.li>
						)))}
						{isLoading && (
							<motion.li
								className='assistant-chat-message-loading bot-message'
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<LoadingDots />
							</motion.li>
						)}
						<li ref={messagesEndRef} style={{ height: '1px' }} />
					</ul>
					<div className='assistant-chat-input-cont'>
						<textarea
							ref={textareaRef}
							className='assistant-chat-input'
							value={userMessage}
							onChange={(e) => setUserMessage(e.target.value)}
							onKeyDown={handleKeyPress}
							placeholder="Введите сообщение..."
							rows={1}
						/>
						<button
							className='assistant-chat-btn input-btn'
							onClick={handleSend}
						>
							<img src="assistant/send.svg" alt="Send" />
						</button>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}