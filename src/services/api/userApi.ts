import { UserProfile } from '@/types/user';
import { simplePostFormData } from '@/utils/httpUtils';
import { httpClient } from '../httpClient';

interface UpdateProfileRequest {
    name: string;
    phone: string;
}

interface UpdateEmailRequest {
    email: string;
}

export const userApi = {
    getProfile: async (): Promise<UserProfile> => {
        return httpClient.get('/user/profile');
    },

    updateProfile: async (data: UpdateProfileRequest): Promise<any> => {
        return httpClient.post('/user/update', data);
    },

    updateEmail: async (email: string): Promise<any> => {
        return httpClient.post('/user/update/email', { email });
    },

    updateProfilePicture: async (formData: FormData): Promise<any> => {
        return simplePostFormData('/user/update/profile-picture', formData);
    },
};