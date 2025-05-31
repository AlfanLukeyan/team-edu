import { Assessment, Class, ClassInfo, ClassMember, WeeklySection } from '@/types/api';
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
}

export const classService = ClassService.getInstance();