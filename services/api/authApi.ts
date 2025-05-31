import { simplePostFormData } from '@/utils/httpUtils';
import { httpClient } from '../httpClient';

export const authApi = {
    login: async (email: string, password: string) => {
        return httpClient.postNoAuth('/auth/login', { email, password });
    },

    faceLogin: async (email: string, faceImage: string) => {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('face_model_preference', '2');
        formData.append('face_image', {
            uri: faceImage,
            type: 'image/jpeg',
            name: 'face_auth.jpg',
        } as any);

        return simplePostFormData('/auth/login-face', formData, false);
    },

    crucialVerify: async (faceImage: string) => {
        const formData = new FormData();
        formData.append('face_model_preference', '2');
        formData.append('image', {
            uri: faceImage,
            type: 'image/jpeg',
            name: 'crucial_auth.jpg',
        } as any);

        return simplePostFormData('/auth/crucial-verify', formData);
    },

    register: async (
        name: string,
        email: string,
        password: string,
        phone: string,
        faceImages: string[]
    ) => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('phone', phone);

        faceImages.forEach((image, index) => {
            formData.append('face_reference', {
                uri: image,
                type: 'image/jpeg',
                name: `face_${index + 1}.jpg`,
            } as any);
        });

        return simplePostFormData('/user/register', formData, false);
    },

    logout: async () => {
        return httpClient.get('/auth/logout');
    },

    refreshToken: async (refreshToken: string) => {
        return httpClient.postNoAuth('/auth/refresh', { refreshToken }, {
            headers: { "Authorization": `Bearer ${refreshToken}` }
        });
    }
};