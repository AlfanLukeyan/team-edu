import * as Brightness from 'expo-brightness';

export const setMaxBrightness = async (): Promise<void> => {
    try {
        await Brightness.setBrightnessAsync(1.0);
    } catch (error) {
        console.error('Failed to set brightness:', error);
    }
};

export const restoreBrightness = async (): Promise<void> => {
    try {
        await Brightness.restoreSystemBrightnessAsync();
    } catch (error) {
        console.error('Failed to restore brightness:', error);
    }
};

export const getDaysRemaining = (endTime: string): number => {
    const now = new Date();
    const endDate = new Date(endTime);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatDateTime = (dateString: string): { date: string; time: string } => {
    const date = new Date(dateString);
    const dateOptions: Intl.DateTimeFormatOptions = {
        month: "2-digit",
        day: "2-digit",
        year: "numeric"
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    };

    return {
        date: date.toLocaleDateString("en-US", dateOptions),
        time: date.toLocaleTimeString("en-US", timeOptions)
    };
};

export const isOverdue = (endTime: string): boolean => {
    return new Date(endTime) < new Date();
};
/**
 * Creates a human-readable short hash
 * Example: "550e8400-e29b-41d4-a716-446655440001" → "ID-550E84"
 */
export const readableHash = (uuid: string, prefix: string = 'ID'): string => {
    if (!uuid || typeof uuid !== 'string') {
        return 'ID-UNKNOWN';
    }

    try {
        const cleaned = uuid.replace(/-/g, '').toUpperCase();
        const short = cleaned.substring(0, 6);
        return `${prefix}-${short}`;
    } catch (error) {
        console.error('Error creating hash:', error);
        return 'ID-ERROR';
    }
};

/**
 * Decodes URL-encoded filename and cleans it up
 * Example: "Open%20Recruitment%20Ciputra%20Hospital%20Surabaya%20-%20Apple%20Developer%20Academy%20UC.pdf"
 * Returns: "Open Recruitment Ciputra Hospital Surabaya - Apple Developer Academy UC.pdf"
 */
export const cleanFileName = (fileName: string): string => {
    if (!fileName || typeof fileName !== 'string') {
        return 'Unknown File';
    }

    try {
        // Decode URL-encoded characters
        const decoded = decodeURIComponent(fileName);
        return decoded;
    } catch (error) {
        console.error('Error decoding filename:', error);
        // Fallback: manually replace common URL encodings
        return fileName
            .replace(/%20/g, ' ')
            .replace(/%21/g, '!')
            .replace(/%22/g, '"')
            .replace(/%23/g, '#')
            .replace(/%24/g, '$')
            .replace(/%25/g, '%')
            .replace(/%26/g, '&')
            .replace(/%27/g, "'")
            .replace(/%28/g, '(')
            .replace(/%29/g, ')')
            .replace(/%2A/g, '*')
            .replace(/%2B/g, '+')
            .replace(/%2C/g, ',')
            .replace(/%2D/g, '-')
            .replace(/%2E/g, '.')
            .replace(/%2F/g, '/')
            .replace(/%3A/g, ':')
            .replace(/%3B/g, ';')
            .replace(/%3C/g, '<')
            .replace(/%3D/g, '=')
            .replace(/%3E/g, '>')
            .replace(/%3F/g, '?')
            .replace(/%40/g, '@');
    }
};

export const getYoutubeVideoId = (url: string): string | null => {
    if (!url) return null;
    
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/v\/([^&\n?#]+)/,
        /youtube\.com\/embed\/([^&\n?#]+)/,
        /youtu\.be\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    
    return null;
};

// Keep your existing getYoutubeEmbedUrl function as fallback
export const getYoutubeEmbedUrl = (url: string): string => {
    const videoId = getYoutubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

export const calculateDaysRemaining = (endDate: string): number => {
    const end = new Date(endDate);
    const now = new Date();

    end.setHours(23, 59, 59, 999);
    now.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
};

export const getDaysRemainingText = (endDate: string): string => {
    const daysRemaining = calculateDaysRemaining(endDate);

    if (daysRemaining <= 0) {
        return "Expired";
    } else if (daysRemaining === 1) {
        return "Due Today";
    } else if (daysRemaining === 2) {
        return "Due Tomorrow";
    } else if (daysRemaining <= 7) {
        return `Due in ${daysRemaining} days`;
    } else if (daysRemaining <= 30) {
        return `Due in ${daysRemaining} days`;
    } else {
        const weeks = Math.floor(daysRemaining / 7);
        if (weeks < 4) {
            return `Due in ${weeks} week${weeks > 1 ? 's' : ''}`;
        } else {
            const months = Math.floor(daysRemaining / 30);
            return `Due in ${months} month${months > 1 ? 's' : ''}`;
        }
    }
};

export interface DurationFormat {
    hours: number;
    minutes: number;
    seconds: number;
    totalMinutes: number;
}

export const convertSecondsToTime = (totalSeconds: number): DurationFormat => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);

    return {
        hours,
        minutes,
        seconds,
        totalMinutes
    };
};

export const formatDuration = (totalSeconds: number, showSeconds: boolean = false): string => {
    const { hours, minutes, seconds } = convertSecondsToTime(totalSeconds);

    if (hours > 0) {
        if (showSeconds) {
            return `${hours}h ${minutes}m ${seconds}s`;
        }
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        if (showSeconds) {
            return `${minutes}m ${seconds}s`;
        }
        return `${minutes}m`;
    } else {
        return `${seconds}s`;
    }
};