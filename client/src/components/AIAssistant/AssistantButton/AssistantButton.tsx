import './AssistantButton.css'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../store'
import { setIsOpenChatAssistant } from '../../../store/assistantSlice'
import { setOverlay } from '../../../store/generalSlice'

export default function AssistantButton() {
	const dispatch = useDispatch<AppDispatch>();

	const handleOpenChatAssistant = () => {
		dispatch(setIsOpenChatAssistant(true));
		dispatch(setOverlay(true));
	}

	return (
		<button className='assistant-btn' onClick={handleOpenChatAssistant}>
			<img className='assistant-img' src="assistant/robot_face.svg" alt="AI" />
		</button>
	)
}