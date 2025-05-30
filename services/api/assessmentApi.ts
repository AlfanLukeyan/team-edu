import { AssessmentDetailsResponse, UpcomingAssessmentsResponse } from '@/types/api';
import { httpClient } from '../httpClient';
import { tokenService } from '../tokenService';

export const assessmentApi = {
    getUpcomingAssessments: async (userID?: string): Promise<UpcomingAssessmentsResponse> => {
        const finalUserID = userID || tokenService.getUserId();
        return httpClient.get(`/public/assessment/upcoming/?userID=${finalUserID}`);
    },

    getAssessmentDetails: async (assessmentId: string): Promise<AssessmentDetailsResponse> => {
        return httpClient.get(`/teacher/assessment/?id=${assessmentId}`);
    }
};