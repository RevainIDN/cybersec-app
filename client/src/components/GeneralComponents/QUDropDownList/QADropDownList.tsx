import './QADropDownList.css'
import { useState } from 'react';

interface QADropDownListProps {
	question: string;
	answer: string;
}

export default function QADropDownList({ question, answer }: QADropDownListProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<li className="qa-item">
			<button className="qa-question" onClick={() => setIsOpen(!isOpen)}>
				{question}
				<span className={`arrow ${isOpen ? "open" : ""}`}>&#9662;</span>
			</button>
			<div className="qa-answer" style={{ maxHeight: isOpen ? "200px" : "0" }}>
				{answer}
			</div>
		</li>
	);
}