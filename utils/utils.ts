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

export const convertMinutesToSeconds = (minutes: number): number => {
    return minutes * 60;
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
}