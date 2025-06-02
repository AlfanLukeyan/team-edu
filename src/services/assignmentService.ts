import { Assignment, AssignmentSubmission, CreateAssignmentData, StudentAssignment, UpdateAssignmentData } from '@/types/api';
import { AssignmentFormData } from '@/types/common';
import { assignmentApi } from './api/assignmentApi';
import { tokenService } from './tokenService';

class AssignmentService {
    private static instance: AssignmentService;

    static getInstance(): AssignmentService {
        if (!AssignmentService.instance) {
            AssignmentService.instance = new AssignmentService();
        }
        return AssignmentService.instance;
    }

    async getAssignmentDetails(assignmentId: string, userId?: string): Promise<Assignment | StudentAssignment> {
        try {
            if (tokenService.isStudent()) {
                const response = await assignmentApi.getStudentAssignmentDetails(assignmentId, userId);
                return response.data;
            } else {
                const response = await assignmentApi.getAssignmentDetails(assignmentId);
                return response.data;
            }
        } catch (error) {
            console.error('Failed to fetch assignment details:', error);
            throw error;
        }
    }

    async getStudentAssignmentDetails(assignmentId: string, userId?: string): Promise<StudentAssignment> {
        try {
            const response = await assignmentApi.getStudentAssignmentDetails(assignmentId, userId);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch student assignment details:', error);
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

    async createAssignment(weekId: string, data: AssignmentFormData): Promise<CreateAssignmentData> {
        try {
            const formData = new FormData();
            formData.append('week_id', weekId);
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('deadline', data.deadline);

            if (data.file) {
                formData.append('file', data.file);
            }

            console.log('Creating assignment with data:', {
                weekId,
                title: data.title,
                description: data.description,
                deadline: data.deadline,
                file: data.file ? data.file.name : 'No file attached',
            });

            const response = await assignmentApi.createAssignment(formData);
            console.log('Assignment created successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to create assignment:', error);
            throw error;
        }
    }

    async updateAssignment(assignmentId: string, weekId: string, data: AssignmentFormData): Promise<UpdateAssignmentData> {
        try {
            const formData = new FormData();
            formData.append('assignment_id', assignmentId);
            formData.append('week_id', weekId);
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('deadline', data.deadline);

            if (data.file) {
                formData.append('file', data.file);
            }

            const response = await assignmentApi.updateAssignment(formData);
            return response.data;
        } catch (error) {
            console.error('Failed to update assignment:', error);
            throw error;
        }
    }

    async deleteAssignment(assignmentId: string): Promise<{ status: string; message: string; data: string }> {
        try {
            const response = await assignmentApi.deleteAssignment(assignmentId);
            console.log('Assignment deleted successfully:', response);
            return response;
        } catch (error) {
            console.error('Failed to delete assignment:', error);
            throw error;
        }
    }

    getSubmittedAssignments(submissions: AssignmentSubmission[]): AssignmentSubmission[] {
        return submissions.filter(submission => submission.status === 'submitted');
    }

    getTodoAssignments(submissions: AssignmentSubmission[]): AssignmentSubmission[] {
        return submissions.filter(submission => submission.status === 'todo');
    }
}

export const assignmentService = AssignmentService.getInstance();