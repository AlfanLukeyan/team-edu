/**
 * Simple utility to create human-readable short hashes from UUIDs
 */
export const HashUtils = {
    /**
     * Creates a human-readable short hash
     * Example: "550e8400-e29b-41d4-a716-446655440001" → "ID-550E84"
     */
    readableHash: (uuid: string, prefix: string = 'ID'): string => {
        if (!uuid || typeof uuid !== 'string') {
            return 'ID-UNKNOWN';
        }
        
        try {
            // Remove dashes and take first 6 characters
            const cleaned = uuid.replace(/-/g, '').toUpperCase();
            const short = cleaned.substring(0, 6);
            return `${prefix}-${short}`;
        } catch (error) {
            console.error('Error creating hash:', error);
            return 'ID-ERROR';
        }
    }
};