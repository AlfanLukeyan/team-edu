import { AssessmentResponse, ClassInfoResponse, ClassMemberResponse, DeleteClassResponse, StudentAssessmentResponse, WeeklySectionResponse } from '@/types/api';
import { WeeklySectionFormData } from '@/types/common';
import { simplePostFormData } from '@/utils/httpUtils';
import { httpClient } from '../httpClient';
import { tokenService } from '../tokenService';

export const classApi = {

    deleteAdminClass: async (classId: string): Promise<DeleteClassResponse> => {
        return httpClient.delete(`/kelas/admin/?id=${classId}`);
    },

    getAdminClasses: async (params?: {
        search?: string;
        page?: number;
        max_page?: number;
        per_page?: number;
    }) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append('search', params.search);
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.max_page) queryParams.append('max_page', params.max_page.toString());
        if (params?.per_page) queryParams.append('per_page', params.per_page.toString());

        const queryString = queryParams.toString();
        return httpClient.get(`/kelas/admin${queryString ? `?${queryString}` : ''}`);
    },

    getAllClasses: async (userID?: string) => {
        const finalUserID = userID || tokenService.getUserId();
        return httpClient.get(`/public/user/class/?userID=${finalUserID}`);
    },

    getClassInfo: async (classId: string): Promise<ClassInfoResponse> => {
        return httpClient.get(`/kelas?id=${classId}`);
    },

    getTeacherWeeklySections: async (classId: string): Promise<WeeklySectionResponse> => {
        return httpClient.get(`/kelas/weekly-section/class/?class_id=${classId}`);
    },

    getStudentWeeklySections: async (classId: string): Promise<WeeklySectionResponse> => {
        return httpClient.get(`/student/kelas/weekly-section/class/?class_id=${classId}`);
    },

    getTeacherClassAssessments: async (classId: string): Promise<AssessmentResponse> => {
        return httpClient.get(`/teacher/assessment/class/?classID=${classId}`);
    },

    getStudentClassAssessments: async (classId: string, userId: string): Promise<StudentAssessmentResponse> => {
        return httpClient.get(`/student/assessment/class/?classID=${classId}&userID=${userId}`);
    },

    getClassMembers: async (classId: string): Promise<ClassMemberResponse> => {
        return httpClient.get(`/public/class/members/?classID=${classId}`);
    },

    createWeeklySection: async (classId: string, weekNumber: number, data: WeeklySectionFormData): Promise<{ status: string; message: string; data: any }> => {
        const formData = new FormData();

        formData.append('kelas_id', classId);
        formData.append('week_number', weekNumber.toString());
        formData.append('headingPertemuan', data.title);
        formData.append('bodyPertemuan', data.description);

        if (data.videoUrl) {
            formData.append('urlVideo', data.videoUrl);
        }

        if (data.file) {
            formData.append('file', data.file as any);
        }

        return simplePostFormData('/teacher/kelas/weekly-section', formData);
    },

    updateWeeklySection: async (weekId: string, data: WeeklySectionFormData): Promise<{ status: string; message: string; data: any }> => {
        const formData = new FormData();

        formData.append('week_id', weekId);
        formData.append('headingPertemuan', data.title);
        formData.append('bodyPertemuan', data.description);

        if (data.videoUrl) {
            formData.append('urlVideo', data.videoUrl);
        }

        if (data.file) {
            formData.append('file', data.file as any);
        }

        return simplePostFormData('/teacher/kelas/weekly-section', formData, 'PUT');
    },

    deleteWeeklySection: async (weekId: string): Promise<{ status: string; message: string; data: string }> => {
        return httpClient.delete(`/teacher/kelas/weekly-section?id=${weekId}`);
    }
};