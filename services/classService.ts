import { Assessment, Class, ClassInfo, ClassMember, WeeklySection } from '@/types/api';
import { WeeklySectionFormData } from '@/types/common';
import { classApi } from "./api/classApi";
import { tokenService } from "./tokenService";

class ClassService {
    private static instance: ClassService;

    static getInstance(): ClassService {
        if (!ClassService.instance) {
            ClassService.instance = new ClassService();
        }
        return ClassService.instance;
    }

    async getClasses(userID?: string): Promise<Class[]> {
        try {
            const finalUserID = userID ?? tokenService.getUserId() ?? undefined;
            const response = await classApi.getAllClasses(finalUserID);

            return response.data?.map((classItem: any) => ({
                id: classItem.id,
                name: classItem.name || classItem.title,
                tag: classItem.tag || classItem.class_code,
                description: classItem.description || classItem.desc,
                teacher: classItem.teacher,
                teacher_id: classItem.teacher_id
            })) || [];
        } catch (error) {
            throw error;
        }
    }

    async getClassInfo(classId: string): Promise<ClassInfo> {
        try {
            const response = await classApi.getClassInfo(classId);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getWeeklySections(classId: string): Promise<WeeklySection[]> {
        try {
            console.log('Fetching weekly sections for class:', classId);
            const response = await classApi.getWeeklySections(classId);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getClassAssessments(classId: string): Promise<Assessment[]> {
        try {
            const response = await classApi.getClassAssessments(classId);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getClassMembers(classId: string): Promise<ClassMember[]> {
        try {
            const response = await classApi.getClassMembers(classId);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async createWeeklySection(classId: string, data: WeeklySectionFormData): Promise<{ status: string; message: string; data: any }> {
        try {
            const existingSections = await this.getWeeklySections(classId);
            const nextWeekNumber = Math.max(0, ...existingSections.map(section => section.week_number)) + 1;

            const response = await classApi.createWeeklySection(classId, nextWeekNumber, data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updateWeeklySection(weekId: string, data: WeeklySectionFormData): Promise<{ status: string; message: string; data: any }> {
        try {
            const response = await classApi.updateWeeklySection(weekId, data);
            return response;
        } catch (error) {
            console.error('Failed to update weekly section:', error);
            throw error;
        }
    }

    async deleteWeeklySection(weekId: string): Promise<{ status: string; message: string; data: string }> {
        try {
            const response = await classApi.deleteWeeklySection(weekId);
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export const classService = ClassService.getInstance();