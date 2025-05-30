import { ClassDetailResponse } from '@/types/class';
import { httpClient } from '../httpClient';
import { tokenService } from '../tokenService';

export const classApi = {
  getAllClasses: async (userID?: string) => {
    const finalUserID = userID || tokenService.getUserId();
    return httpClient.get(`/public/user/class/?userID=${finalUserID}`);
  },

  getClassDetails: async (classId: string): Promise<ClassDetailResponse> => {
    return httpClient.get(`/kelas/weekly-section/class/?class_id=${classId}`);
  }
};