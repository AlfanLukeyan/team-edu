import { simplePost } from '@/utils/httpUtils';

export const refreshTokens = async (refreshToken: string) => {
    return simplePost('/auth/refresh', { refreshToken }, {
        'Authorization': `Bearer ${refreshToken}`
    });
};