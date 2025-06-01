import {
    AssessmentDetails,
    AssessmentItem,
    AssessmentQuestion,
    AssessmentSessionResponse,
    AssessmentSubmission,
    ClassAssessment,
    ComponentAssessment,
    CreateChoiceItem,
    CreateQuestionItem,
    CreateSubmissionRequest,
    StudentAssessmentDetails, SubmissionAnswer, SubmitAnswerRequest, // ✅ Add this import
    SubmitAssessmentResponse,
    UpdateAnswerRequest
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

// ✅ Start assessment session
    async startAssessmentSession(assessmentId: string): Promise<AssessmentSessionResponse> {
        try {
            const userId = tokenService.getUserId();
            if (!userId) {
                throw new Error('User ID not found');
            }

            const payload: CreateSubmissionRequest = {
                user_id: userId,
                assessment_id: assessmentId
            };

            const response = await assessmentApi.createSubmission(payload);
            return response.data;
        } catch (error) {
            console.error('Failed to start assessment session:', error);
            throw error;
        }
    }

    // ✅ Get submission answers for continue assessment
    async getSubmissionAnswers(submissionId: string): Promise<SubmissionAnswer[]> {
        try {
            const response = await assessmentApi.getSubmissionAnswers(submissionId);
            return response.data;
        } catch (error) {
            console.error('Failed to get submission answers:', error);
            throw error;
        }
    }

    // ✅ Submit answer for a question
    async submitAnswer(submissionId: string, questionId: string, choiceId: string): Promise<void> {
        try {
            const payload: SubmitAnswerRequest = {
                submission_id: submissionId,
                id_question: questionId,
                id_choice: choiceId
            };

            await assessmentApi.submitAnswer(payload);
        } catch (error) {
            console.error('Failed to submit answer:', error);
            throw error;
        }
    }

    // ✅ Update existing answer
    async updateAnswer(answerId: string, submissionId: string, questionId: string, choiceId: string): Promise<void> {
        try {
            const payload: UpdateAnswerRequest = {
                answer_id: answerId,
                submission_id: submissionId,
                question_id: questionId,
                choice_id: choiceId
            };

            await assessmentApi.updateAnswer(payload);
        } catch (error) {
            console.error('Failed to update answer:', error);
            throw error;
        }
    }

    // ✅ Submit final assessment
    async submitAssessment(submissionId: string): Promise<SubmitAssessmentResponse> {
        try {
            const response = await assessmentApi.submitAssessment(submissionId);
            return response.data;
        } catch (error) {
            console.error('Failed to submit assessment:', error);
            throw error;
        }
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

    async getAssessmentDetails(assessmentId: string, userId?: string): Promise<AssessmentDetails> {
        try {
            if (tokenService.isStudent()) {
                const response = await assessmentApi.getStudentAssessmentDetails(assessmentId, userId);
                const studentData = response.data;

                return {
                    id: studentData.assessment.assessment_id,
                    name: studentData.assessment.name,
                    duration: studentData.assessment.duration,
                    start_time: studentData.assessment.start_time,
                    end_time: studentData.assessment.end_time,
                    total_student: 0,
                    total_submission: 0,
                    time_spent: studentData.time_spent,
                    time_remaining: studentData.time_remaining,
                    max_score: studentData.max_score,
                    score: studentData.score,
                    submitted_answer: studentData.submitted_answer,
                    question: studentData.question,
                    submission_status: studentData.submission_status,
                    submission_id: studentData.submission_id
                };
            } else {
                const response = await assessmentApi.getAssessmentDetails(assessmentId);
                return response.data;
            }
        } catch (error) {
            console.error('Failed to fetch assessment details:', error);
            throw error;
        }
    }

    async getStudentAssessmentDetails(assessmentId: string, userId?: string): Promise<StudentAssessmentDetails> {
        try {
            const response = await assessmentApi.getStudentAssessmentDetails(assessmentId, userId);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch student assessment details:', error);
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

    // ✅ Rest of the methods remain the same...
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

    async deleteQuestion(questionId: string): Promise<{ status: string; message: string; data: string }> {
        try {
            const response = await assessmentApi.deleteQuestion(questionId);
            return response;
        } catch (error) {
            console.error('Failed to delete question:', error);
            throw error;
        }
    }

    async deleteMultipleQuestions(questionIds: string[]): Promise<void> {
        try {
            await Promise.all(
                questionIds.map(id => this.deleteQuestion(id))
            );
        } catch (error) {
            console.error('Failed to delete multiple questions:', error);
            throw error;
        }
    }

    async updateQuestion(questionId: string, data: { question_text: string; choices: CreateChoiceItem[] }): Promise<{ status: string; message: string; data: any }> {
        try {
            const payload = {
                question_id: questionId,
                question_text: data.question_text,
                choices: data.choices
            };

            const response = await assessmentApi.updateQuestion(payload);
            return response;
        } catch (error) {
            console.error('Failed to update question:', error);
            throw error;
        }
    }

    async updateMultipleQuestions(questionIds: string[], questionsData: CreateQuestionItem[]): Promise<void> {
        try {
            if (questionIds.length !== questionsData.length) {
                throw new Error('Question IDs and data arrays must have the same length');
            }

            const updatePromises = questionIds.map((questionId, index) =>
                this.updateQuestion(questionId, {
                    question_text: questionsData[index].question_text,
                    choices: questionsData[index].choices
                })
            );

            await Promise.all(updatePromises);
        } catch (error) {
            console.error('Failed to update multiple questions:', error);
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

    // ✅ Utility methods remain the same...
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