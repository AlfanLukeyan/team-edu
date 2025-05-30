import { AssessmentResponse, ClassInfoResponse, ClassMemberResponse, WeeklySectionResponse } from '@/types/api';
import { httpClient } from '../httpClient';
import { tokenService } from '../tokenService';

export const classApi = {
  getAllClasses: async (userID?: string) => {
    const finalUserID = userID || tokenService.getUserId();
    return httpClient.get(`/public/user/class/?userID=${finalUserID}`);
  },

  getClassInfo: async (classId: string): Promise<ClassInfoResponse> => {
    return httpClient.get(`/kelas?id=${classId}`);
  },

  getWeeklySections: async (classId: string): Promise<WeeklySectionResponse> => {
    return httpClient.get(`/kelas/weekly-section/class/?class_id=${classId}`);
  },

  getClassAssessments: async (classId: string): Promise<AssessmentResponse> => {
    return httpClient.get(`/teacher/assessment/class/?classID=${classId}`);
  },

  getClassMembers: async (classId: string): Promise<ClassMemberResponse> => {
    return httpClient.get(`/public/class/members/?classID=${classId}`);
  }
};