

export const getWindowOffset = () => {
	let margin = 4;
	let offset = ((window.innerWidth) - (window.innerHeight - margin) * 2) / 2;
	if (offset < 0) return 0 + 'px';
	return offset + 'px';
}

export const getFontSize = () => {
	return window.innerHeight/40 + 'px';
}