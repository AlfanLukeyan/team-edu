import {
    AssignmentDetailsResponse,
    AssignmentSubmissionsResponse,
    CreateAssignmentResponse,
    DeleteAssignmentResponse,
    StudentAssignmentDetailsResponse,
    UpdateAssignmentResponse,
} from '@/types/api';
import { simplePostFormData } from '@/utils/httpUtils';
import { httpClient } from '../httpClient';
import { tokenService } from '../tokenService';

export const assignmentApi = {
    getAssignmentDetails: async (assignmentId: string): Promise<AssignmentDetailsResponse> => {
        return httpClient.get(`/teacher/kelas/assignment/?assignment_id=${assignmentId}`);
    },

    getStudentAssignmentDetails: async (assignmentId: string, userId?: string): Promise<StudentAssignmentDetailsResponse> => {
        const finalUserId = userId || tokenService.getUserId();
        return httpClient.get(`/student/kelas/assignment/?assignment_id=${assignmentId}&user_id=${finalUserId}`);
    },

    getAssignmentSubmissions: async (
        assignmentId: string,
        status?: string
    ): Promise<AssignmentSubmissionsResponse> => {
        const params = new URLSearchParams({ assignment_id: assignmentId });
        if (status) {
            params.append('status', status);
        }
        return httpClient.get(`/kelas/assignment-submission?${params.toString()}`);
    },

    createAssignment: async (formData: FormData): Promise<CreateAssignmentResponse> => {
        return simplePostFormData('/teacher/kelas/assignment', formData);
    },

    updateAssignment: async (formData: FormData): Promise<UpdateAssignmentResponse> => {
        return simplePostFormData('/teacher/kelas/assignment', formData, "PUT");
    },

    deleteAssignment: async (assignmentId: string): Promise<DeleteAssignmentResponse> => {
        return httpClient.delete(`/teacher/kelas/assignment?assignment_id=${assignmentId}`);
    },
};