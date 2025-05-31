import {
    AssessmentDetails,
    AssessmentItem,
    AssessmentQuestion,
    AssessmentSubmission,
    ClassAssessment,
    ComponentAssessment,
    CreateQuestionItem
} from '@/types/api';
import { AssessmentFormData } from '@/types/common';
import { getDaysRemaining } from '@/utils/utils';
import { assessmentApi } from './api/assessmentApi';
import { tokenService } from './tokenService';

interface ClassAssessmentData {
    classTitle: string;
    classCode: string;
    classId: string;
    assessments: ComponentAssessment[];
}

interface QuestionsFormData {
    questions: CreateQuestionItem[];
}

class AssessmentService {
    private static instance: AssessmentService;

    static getInstance(): AssessmentService {
        if (!AssessmentService.instance) {
            AssessmentService.instance = new AssessmentService();
        }
        return AssessmentService.instance;
    }

    async getUpcomingAssessments(userID?: string): Promise<ClassAssessment[]> {
        try {
            const finalUserID = userID ?? tokenService.getUserId() ?? undefined;
            const response = await assessmentApi.getUpcomingAssessments(finalUserID);
            return response.data || [];
        } catch (error) {
            console.error('Failed to fetch upcoming assessments:', error);
            throw error;
        }
    }

    async getAssessmentDetails(assessmentId: string): Promise<AssessmentDetails> {
        try {
            const response = await assessmentApi.getAssessmentDetails(assessmentId);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch assessment details:', error);
            throw error;
        }
    }

    async getAssessmentSubmissions(assessmentId: string, status?: string): Promise<AssessmentSubmission[]> {
        try {
            const response = await assessmentApi.getAssessmentSubmissions(assessmentId, status);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch assessment submissions:', error);
            throw error;
        }
    }

    async getAssessmentQuestions(assessmentId: string): Promise<AssessmentQuestion[]> {
        try {
            const response = await assessmentApi.getAssessmentQuestions(assessmentId);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch assessment questions:', error);
            throw error;
        }
    }

    async createAssessment(classId: string, data: AssessmentFormData): Promise<{ status: string; message: string; data: any }> {
        try {
            const payload = {
                name: data.title,
                class_id: classId,
                description: data.description,
                date_created: new Date().toISOString(),
                duration: parseInt(data.duration) * 60,
                start_time: data.start_date,
                end_time: data.end_date
            };

            const response = await assessmentApi.createAssessment(payload);
            return response;
        } catch (error) {
            console.error('Failed to create assessment:', error);
            throw error;
        }
    }

    async updateAssessment(assessmentId: string, data: AssessmentFormData): Promise<{ status: string; message: string; data: any }> {
        try {
            const payload = {
                assessment_id: assessmentId,
                name: data.title,
                date_created: new Date().toISOString(),
                description: data.description,
                start_time: data.start_date,
                duration: parseInt(data.duration) * 60,
                end_time: data.end_date
            };

            const response = await assessmentApi.updateAssessment(payload);
            return response;
        } catch (error) {
            console.error('Failed to update assessment:', error);
            throw error;
        }
    }

    async createQuestions(assessmentId: string, data: QuestionsFormData): Promise<{ status: string; message: string; data: any }> {
        try {
            const payload = {
                assessment_id: assessmentId,
                questions: data.questions
            };

            const response = await assessmentApi.createQuestions(payload);
            return response;
        } catch (error) {
            console.error('Failed to create questions:', error);
            throw error;
        }
    }

    async deleteAssessment(assessmentId: string): Promise<{ status: string; message: string; data: string }> {
        try {
            const response = await assessmentApi.deleteAssessment(assessmentId);
            return response;
        } catch (error) {
            console.error('Failed to delete assessment:', error);
            throw error;
        }
    }

    async deleteMultipleAssessments(assessmentIds: string[]): Promise<void> {
        try {
            await Promise.all(
                assessmentIds.map(id => this.deleteAssessment(id))
            );
        } catch (error) {
            console.error('Failed to delete multiple assessments:', error);
            throw error;
        }
    }

    getAllAssessments(classAssessments: ClassAssessment[]): (AssessmentItem & { class_name: string; class_tag: string })[] {
        return classAssessments.flatMap(classData =>
            classData.class_assessment.map(assessment => ({
                ...assessment,
                class_name: classData.class_name,
                class_tag: classData.class_tag
            }))
        );
    }

    getAssessmentsByStatus(
        classAssessments: ClassAssessment[],
        status: AssessmentItem['submission_status']
    ): (AssessmentItem & { class_name: string; class_tag: string })[] {
        return this.getAllAssessments(classAssessments).filter(
            assessment => assessment.submission_status === status
        );
    }

    getTodoAssessments(classAssessments: ClassAssessment[]): (AssessmentItem & { class_name: string; class_tag: string })[] {
        return this.getAssessmentsByStatus(classAssessments, 'todo');
    }

    getCompletedAssessments(classAssessments: ClassAssessment[]): (AssessmentItem & { class_name: string; class_tag: string })[] {
        return this.getAssessmentsByStatus(classAssessments, 'completed');
    }

    transformToComponentFormat(classAssessments: ClassAssessment[]): ClassAssessmentData[] {
        return classAssessments.map(classData => ({
            classTitle: classData.class_name,
            classCode: classData.class_tag,
            classId: classData.class_id,
            assessments: classData.class_assessment.map(assessment => ({
                id: assessment.assessment_id,
                title: assessment.name,
                start_date: assessment.start_time,
                end_date: assessment.end_time,
                days_remaining: getDaysRemaining(assessment.end_time),
                submission_status: assessment.submission_status
            }))
        }));
    }
}

export const assessmentService = AssessmentService.getInstance();