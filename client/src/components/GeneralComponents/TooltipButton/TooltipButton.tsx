import React, { useState } from 'react';
import './TooltipButton.css';

interface TooltipButtonProps {
	tooltipText: string;
	onClick?: () => void;
	className?: string;
}

const TooltipButton: React.FC<TooltipButtonProps> = ({ tooltipText, onClick, className }) => {
	const [isTooltipVisible, setIsTooltipVisible] = useState(false);
	let timeoutId: number;

	const handleMouseEnter = () => {
		timeoutId = setTimeout(() => {
			setIsTooltipVisible(true);
		}, 1000);
	};

	// Сховати підказку
	const handleMouseLeave = () => {
		clearTimeout(timeoutId);
		setIsTooltipVisible(false);
	};

	return (
		<div
			className={`tooltip-button-container ${className}`}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onClick={onClick}
		>
			<div className="tooltip-button">?</div>
			{isTooltipVisible && (
				<div className="tooltip">
					{tooltipText}
				</div>
			)}
		</div>
	);
};

export default TooltipButton;