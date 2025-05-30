import { AssessmentDetailsResponse, AssessmentQuestionsResponse, AssessmentSubmissionsResponse, UpcomingAssessmentsResponse } from '@/types/api';
import { httpClient } from '../httpClient';
import { tokenService } from '../tokenService';

const TEMP_ASSESSMENT_URL = "http://20.2.83.17:8080";

export const assessmentApi = {
    getUpcomingAssessments: async (userID?: string): Promise<UpcomingAssessmentsResponse> => {
        const finalUserID = userID || tokenService.getUserId();
        return httpClient.get(`/public/assessment/upcoming/?userID=${finalUserID}`);
    },

    getAssessmentDetails: async (assessmentId: string): Promise<AssessmentDetailsResponse> => {
        return httpClient.get(`/teacher/assessment/?id=${assessmentId}`);
    },

    getAssessmentSubmissions: async (assessmentId: string, status?: string): Promise<AssessmentSubmissionsResponse> => {
        const params = new URLSearchParams({ assessment_id: assessmentId });
        if (status) {
            params.append('status', status);
        }
        return httpClient.get(`/assement/submission/?${params.toString()}`);
    },

    getAssessmentQuestions: async (assessmentId: string): Promise<AssessmentQuestionsResponse> => {
        const token = await tokenService.getValidToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${TEMP_ASSESSMENT_URL}/assessment/detail/questions/?id=${assessmentId}`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const message = errorData.error || errorData.message || `Request failed with status ${response.status}`;
            throw new Error(message);
        }

        return response.json();
    }
};