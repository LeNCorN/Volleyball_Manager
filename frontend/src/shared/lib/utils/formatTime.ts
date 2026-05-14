export const formatTime = (time: string): string => {
    // time format: "14:00" or "14:00:00"
    return time.substring(0, 5);
};

export const formatTimeRange = (startTime: string, endTime: string): string => {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};