import { GetUsersByRoleResponse } from '@/types/api';
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

    updateFaceReference: async (formData: FormData): Promise<any> => {
        return simplePostFormData('/user/update/face-reference', formData, 'POST', true);
    },

    getUsersByRole: async (roleId: number): Promise<GetUsersByRoleResponse> => {
        return httpClient.get(`/admin/get-user?role_id=${roleId}`);
    },

    searchUsers: async (params?: { name?: string; role_id?: number }): Promise<GetUsersByRoleResponse> => {
        const queryParams = new URLSearchParams();
        if (params?.name) queryParams.append('name', params.name);
        if (params?.role_id) queryParams.append('role_id', params.role_id.toString());

        const queryString = queryParams.toString();
        return httpClient.get(`/admin/search-user${queryString ? `?${queryString}` : ''}`);
    },
};