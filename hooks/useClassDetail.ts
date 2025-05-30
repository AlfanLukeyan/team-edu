import { classService } from '@/services/classService';
import { ClassDetail, Week } from '@/types/class';
import { useEffect, useState } from 'react';

export const useClassDetail = (classId: string) => {
    const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchClassDetail = async () => {
        if (!classId) return;
        
        try {
            setError(null);
            const detail = await classService.getClassDetail(classId);
            setClassDetail(detail);
        } catch (err: any) {
            setError(err.message);
            console.error('Failed to fetch class detail:', err);
        } finally {
            setLoading(false);
        }
    };

    const refreshClassDetail = async () => {
        if (!classId) return;
        
        try {
            setRefreshing(true);
            setError(null);
            const detail = await classService.getClassDetail(classId);
            setClassDetail(detail);
        } catch (err: any) {
            setError(err.message);
            console.error('Failed to refresh class detail:', err);
        } finally {
            setRefreshing(false);
        }
    };

    // Helper functions using the classDetail data
    const getWeekByNumber = (weekNumber: number): Week | null => {
        return classDetail ? classService.getWeekByNumber(classDetail, weekNumber) : null;
    };

    const getUpcomingAssignments = () => {
        return classDetail ? classService.getUpcomingAssignments(classDetail) : [];
    };

    const getOverdueAssignments = () => {
        return classDetail ? classService.getOverdueAssignments(classDetail) : [];
    };

    const getAllWeeks = () => {
        return classDetail ? classService.getAllWeeks(classDetail) : [];
    };

    useEffect(() => {
        fetchClassDetail();
    }, [classId]);

    return {
        classDetail,
        loading,
        refreshing,
        error,
        refreshClassDetail,
        
        // Helper functions
        getWeekByNumber,
        getUpcomingAssignments,
        getOverdueAssignments,
        getAllWeeks,
        
        // Computed values
        progress: classDetail ? classService.getWeekProgress(classDetail.week) : null,
        totalWeeks: classDetail?.week.length || 0,
        upcomingAssignments: classDetail ? classService.getUpcomingAssignments(classDetail) : [],
        overdueAssignments: classDetail ? classService.getOverdueAssignments(classDetail) : []
    };
};