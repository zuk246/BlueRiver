import dayjs from 'dayjs';

export default function getRelativeTime(date: string) {
    let relativeTime = -1 * dayjs(date).diff(dayjs(), 'minute');

    if (relativeTime === 0) {
        return 'now';
    }

    if (relativeTime < 60) {
        return `${relativeTime}m`;
    }

    if (relativeTime < 24 * 60) {
        return `${Math.floor(relativeTime / 60)}h`;
    }

    if (relativeTime < 24 * 60 * 7) {
        return `${Math.floor(relativeTime / 60 / 24)}d`;
    }

    return `${dayjs(date).format('YYYY/MM/DD')}`;
}
