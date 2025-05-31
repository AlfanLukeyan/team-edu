import { AssessmentResponse, ClassInfoResponse, ClassMemberResponse, WeeklySectionResponse } from '@/types/api';
import { WeeklySectionFormData } from '@/types/common';
import { simplePostFormData } from '@/utils/httpUtils';
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
  }
};