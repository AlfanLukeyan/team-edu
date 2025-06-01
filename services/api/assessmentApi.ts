import {
    AssessmentDetailsResponse,
    AssessmentQuestionsResponse,
    AssessmentSubmissionsResponse,
    CreateAssessmentRequest,
    CreateAssessmentResponse,
    CreateQuestionsRequest,
    CreateQuestionsResponse,
    DeleteAssessmentResponse,
    UpcomingAssessmentsResponse,
    UpdateAssessmentRequest,
    UpdateAssessmentResponse,
    UpdateQuestionRequest,
    UpdateQuestionResponse
} from '@/types/api';
import { httpClient } from '../httpClient';
import { tokenService } from '../tokenService';

export const assessmentApi = {
    getUpcomingAssessments: async (userID?: string): Promise<UpcomingAssessmentsResponse> => {
        const finalUserID = userID || tokenService.getUserId();
        return httpClient.get(`/public/assessment/upcoming/?userID=${finalUserID}`);
    },

    getAssessmentDetails: async (assessmentId: string): Promise<AssessmentDetailsResponse> => {
        return httpClient.get(`/teacher/assessment/?id=${assessmentId}`);
    },

    getAssessmentSubmissions: async (
        assessmentId: string,
        status?: string
    ): Promise<AssessmentSubmissionsResponse> => {
        const params = new URLSearchParams({ assessment_id: assessmentId });
        if (status) {
            params.append('status', status);
        }
        return httpClient.get(`/assement/submission/?${params.toString()}`);
    },

    getAssessmentQuestions: async (assessmentId: string): Promise<AssessmentQuestionsResponse> => {
        return httpClient.get(`/assessment/detail/questions/?id=${assessmentId}`);
    },

    createAssessment: async (data: CreateAssessmentRequest): Promise<CreateAssessmentResponse> => {
        return httpClient.post('/teacher/assessment', data);
    },

    updateAssessment: async (data: UpdateAssessmentRequest): Promise<UpdateAssessmentResponse> => {
        return httpClient.put('/teacher/assessment/update', data);
    },

    deleteAssessment: async (assessmentId: string): Promise<DeleteAssessmentResponse> => {
        return httpClient.delete(`/teacher/assessment/delete?id=${assessmentId}`);
    },

    createQuestions: async (data: CreateQuestionsRequest): Promise<CreateQuestionsResponse> => {
        return httpClient.post('/assessment/question', data);
    },

    updateQuestion: async (data: UpdateQuestionRequest): Promise<UpdateQuestionResponse> => {
        return httpClient.put('/assessment/question/update', data);
    },

    deleteQuestion: async (questionId: string): Promise<DeleteAssessmentResponse> => {
        return httpClient.delete(`/assessment/question/?id=${questionId}`);
    }
};