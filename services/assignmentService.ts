import { Assignment, AssignmentSubmission } from '@/types/api';
import { assignmentApi } from './api/assignmentApi';

class AssignmentService {
    private static instance: AssignmentService;

    static getInstance(): AssignmentService {
        if (!AssignmentService.instance) {
            AssignmentService.instance = new AssignmentService();
        }
        return AssignmentService.instance;
    }

    async getAssignmentDetails(assignmentId: string): Promise<Assignment> {
        try {
            const response = await assignmentApi.getAssignmentDetails(assignmentId);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch assignment details:', error);
            throw error;
        }
    }

    async getAssignmentSubmissions(assignmentId: string, status?: string): Promise<AssignmentSubmission[]> {
        try {
            const response = await assignmentApi.getAssignmentSubmissions(assignmentId, status);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch assignment submissions:', error);
            throw error;
        }
    }

    // Helper methods for filtering submissions by status
    getSubmittedAssignments(submissions: AssignmentSubmission[]): AssignmentSubmission[] {
        return submissions.filter(submission => submission.status === 'submitted');
    }

    getTodoAssignments(submissions: AssignmentSubmission[]): AssignmentSubmission[] {
        return submissions.filter(submission => submission.status === 'todo');
    }
}

export const assignmentService = AssignmentService.getInstance();