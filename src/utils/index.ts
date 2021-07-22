export const getDurationString = (duration: any) => {
	const days = Math.floor(Number(duration) / (60 * 60 * 24));
	const hrs = Math.floor((Number(duration) % (60 * 60 * 24)) / (60 * 60));
	const mins = Math.floor((Number(duration) % (60 * 60)) / 60);
	const secs = Math.floor(Number(duration) % 60);

	if (days > 0) {
		if (secs > 0) {
			return `${days}d ${hrs}h ${mins}m ${secs}s`;
		}
		if (mins > 0) {
			return `${days}d ${hrs}h ${mins}m`;
		}
		if (hrs > 0) {
			return `${days}d ${hrs}h`;
		}
		return `${days}d`;
	}
	if (hrs > 0) {
		if (secs > 0) {
			return `${hrs}h ${mins}m ${secs}s`;
		}
		if (mins > 0) {
			return `${hrs}h ${mins}m`;
		}
		return `${hrs}h`;
	}
	if (mins > 0) {
		if (secs > 0) {
			return `${mins}m ${secs}s`;
		}
		return `${mins}m`;
	}
	return `${secs}s`;
};
