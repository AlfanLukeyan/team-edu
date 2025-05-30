import { Class, ClassDetail, Week } from '@/types/api';
import { classApi } from "./api/classApi";
import { tokenService } from "./tokenService";

class ClassService {
    private static instance: ClassService;

    static getInstance() {
        if (!ClassService.instance) {
            ClassService.instance = new ClassService();
        }
        return ClassService.instance;
    }

    async getClasses(userID?: string): Promise<Class[]> {
        try {
            const rawUserID = userID !== undefined ? userID : tokenService.getUserId();
            const finalUserID = rawUserID === null ? undefined : rawUserID;
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

    async getClassDetail(classId: string): Promise<ClassDetail> {
        try {
            const response = await classApi.getClassDetails(classId);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch class details:', error);
            throw error;
        }
    }

    // Helper methods for working with the weekly data
    getWeekByNumber(classDetail: ClassDetail, weekNumber: number): Week | null {
        return classDetail.week.find(week => week.week_number === weekNumber) || null;
    }

    getAllWeeks(classDetail: ClassDetail): Week[] {
        return classDetail.week.sort((a, b) => a.week_number - b.week_number);
    }

    getUpcomingAssignments(classDetail: ClassDetail): Array<Week & { daysUntilDeadline: number }> {
        const now = new Date();
        
        return classDetail.week
            .filter(week => week.assignment && new Date(week.assignment.deadline) > now)
            .map(week => ({
                ...week,
                daysUntilDeadline: Math.ceil(
                    (new Date(week.assignment.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                )
            }))
            .sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline);
    }

    getOverdueAssignments(classDetail: ClassDetail): Week[] {
        const now = new Date();
        
        return classDetail.week.filter(week => 
            week.assignment && new Date(week.assignment.deadline) < now
        );
    }

    // Helper methods for formatting
    formatDeadline(deadline: string): string {
        return new Date(deadline).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    isDeadlinePassed(deadline: string): boolean {
        return new Date(deadline) < new Date();
    }

    getWeekProgress(weeks: Week[]): { completed: number; total: number; percentage: number } {
        const total = weeks.length;
        const completed = weeks.filter(week => 
            week.assignment && week.item_pembelajaran
        ).length;
        
        return {
            completed,
            total,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }

    // Check if week has all required content
    isWeekComplete(week: Week): boolean {
        return !!(week.assignment && week.item_pembelajaran);
    }

    // Get learning materials for a specific week
    getLearningMaterials(week: Week) {
        return {
            hasVideo: !!week.item_pembelajaran?.urlVideo,
            hasFile: !!week.item_pembelajaran?.file_link,
            videoUrl: week.item_pembelajaran?.urlVideo,
            fileUrl: week.item_pembelajaran?.file_link,
            fileName: week.item_pembelajaran?.fileName
        };
    }

    // Get assignment details for a specific week
    getAssignmentDetails(week: Week) {
        if (!week.assignment) return null;
        
        return {
            ...week.assignment,
            isOverdue: this.isDeadlinePassed(week.assignment.deadline),
            formattedDeadline: this.formatDeadline(week.assignment.deadline),
            daysUntilDeadline: Math.ceil(
                (new Date(week.assignment.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            )
        };
    }
}

export const classService = ClassService.getInstance();