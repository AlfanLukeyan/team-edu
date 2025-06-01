import {
    AssignmentDetailsResponse,
    AssignmentSubmissionsResponse,
} from '@/types/api';
import { httpClient } from '../httpClient';

export const assignmentApi = {
    getAssignmentDetails: async (assignmentId: string): Promise<AssignmentDetailsResponse> => {
        return httpClient.get(`/teacher/kelas/assignment/?assignment_id=${assignmentId}`);
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
};