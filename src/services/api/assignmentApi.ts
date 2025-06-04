import {
    AssignmentDetailsResponse,
    AssignmentSubmissionsResponse,
    CreateAssignmentResponse,
    DeleteAssignmentResponse,
    StudentAssignmentDetailsResponse,
    SubmitAssignmentResponse,
    UpdateAssignmentResponse,
} from '@/types/api';
import { simplePostFormData } from '@/utils/httpUtils';
import { httpClient } from '../httpClient';
import { tokenService } from '../tokenService';

export const assignmentApi = {
    submitAssignment: async (assignmentId: string, file: any): Promise<SubmitAssignmentResponse> => {
        const formData = new FormData();
        formData.append('assignment_id', assignmentId);
        formData.append('user_id', tokenService.getUserId() || '');
        formData.append('file', file);

        return simplePostFormData('/student/kelas/assignment-submission', formData);
    },

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

    deleteAssignmentSubmission: async (submissionId: string): Promise<DeleteAssignmentResponse> => {
        return httpClient.delete(`/kelas/assignment-submission?assignment_submission_id=${submissionId}`);
    },

    updateSubmissionScore: async (submissionId: string, score: number): Promise<{ status: string; message: string; data: string }> => {
        return httpClient.put(`/kelas/assignment-submission?assignment_submission_id=${submissionId}&score=${score}`);
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