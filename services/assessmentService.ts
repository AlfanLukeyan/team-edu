import { AssessmentDetails, AssessmentItem, AssessmentQuestion, AssessmentSubmission, ClassAssessment, ComponentAssessment } from '@/types/api';
import { assessmentApi } from './api/assessmentApi';
import { tokenService } from './tokenService';

class AssessmentService {
    private static instance: AssessmentService;

    static getInstance() {
        if (!AssessmentService.instance) {
            AssessmentService.instance = new AssessmentService();
        }
        return AssessmentService.instance;
    }

    // Upcoming assessments methods (keep existing for home page)
    async getUpcomingAssessments(userID?: string): Promise<ClassAssessment[]> {
        try {
            const rawUserID = userID !== undefined ? userID : tokenService.getUserId();
            const finalUserID = rawUserID === null ? undefined : rawUserID;
            const response = await assessmentApi.getUpcomingAssessments(finalUserID);
            
            return response.data || [];
        } catch (error) {
            console.error('Failed to fetch upcoming assessments:', error);
            throw error;
        }
    }

    // Assessment details methods
    async getAssessmentDetails(assessmentId: string): Promise<AssessmentDetails> {
        try {
            const response = await assessmentApi.getAssessmentDetails(assessmentId);
            console.log('Assessment details fetched successfully:', response);
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
            console.log('Assessment questions fetched successfully:', response);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch assessment questions:', error);
            throw error;
        }
    }

    // Helper methods for upcoming assessments (keep existing)
    getAllAssessments(classAssessments: ClassAssessment[]): (AssessmentItem & { class_name: string; class_tag: string })[] {
        return classAssessments.flatMap(classData => 
            classData.class_assessment.map(assessment => ({
                ...assessment,
                class_name: classData.class_name,
                class_tag: classData.class_tag
            }))
        );
    }

    getAssessmentsByStatus(classAssessments: ClassAssessment[], status: string): (AssessmentItem & { class_name: string; class_tag: string })[] {
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

    // Utility methods
    getDaysRemaining(endTime: string): number {
        const now = new Date();
        const endDate = new Date(endTime);
        const diffTime = endDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatDateTime(dateString: string) {
        const date = new Date(dateString);
        const dateOptions: Intl.DateTimeFormatOptions = {
            month: "2-digit",
            day: "2-digit",
            year: "numeric"
        };
        const timeOptions: Intl.DateTimeFormatOptions = {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        };

        return {
            date: date.toLocaleDateString("en-US", dateOptions),
            time: date.toLocaleTimeString("en-US", timeOptions)
        };
    }

    isOverdue(endTime: string): boolean {
        return new Date(endTime) < new Date();
    }

    // Convert minutes to seconds (for duration display compatibility)
    convertMinutesToSeconds(minutes: number): number {
        return minutes * 60;
    }

    // Transform data for components (keep existing for home page)
    transformToComponentFormat(classAssessments: ClassAssessment[]) {
        return classAssessments.map(classData => ({
            classTitle: classData.class_name,
            classCode: classData.class_tag,
            classId: classData.class_id,
            assessments: classData.class_assessment.map(assessment => ({
                id: assessment.id,
                title: assessment.name,
                start_date: assessment.start_time,
                end_date: assessment.end_time,
                days_remaining: this.getDaysRemaining(assessment.end_time),
                submission_status: assessment.submission_status
            } as ComponentAssessment))
        }));
    }
}

export const assessmentService = AssessmentService.getInstance();