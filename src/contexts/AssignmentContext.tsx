import { assignmentService } from '@/services/assignmentService';
import { Assignment, AssignmentSubmission, StudentAssignment } from '@/types/api';
import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

interface AssignmentContextType {
    assignmentId: string | null;
    assignmentInfo: Assignment | StudentAssignment | null;
    submissions: AssignmentSubmission[];
    submittedSubmissions: AssignmentSubmission[];
    todoSubmissions: AssignmentSubmission[];
    loading: boolean;
    error: string | null;
    setAssignmentId: (id: string) => void;
    refetchAssignmentInfo: () => Promise<void>;
    refetchSubmissions: () => Promise<void>;
    refetchSubmissionsByStatus: (status: string) => Promise<void>;
}

const AssignmentContext = createContext<AssignmentContextType | undefined>(undefined);

interface AssignmentProviderProps {
    children: ReactNode;
}

export const AssignmentProvider: React.FC<AssignmentProviderProps> = ({ children }) => {
    const [assignmentId, setAssignmentIdState] = useState<string | null>(null);
    const [assignmentInfo, setAssignmentInfo] = useState<Assignment | StudentAssignment | null>(null);
    const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
    const [submittedSubmissions, setSubmittedSubmissions] = useState<AssignmentSubmission[]>([]);
    const [todoSubmissions, setTodoSubmissions] = useState<AssignmentSubmission[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const setAssignmentId = useCallback((id: string) => {
        setAssignmentIdState(id);
        setAssignmentInfo(null);
        setSubmissions([]);
        setSubmittedSubmissions([]);
        setTodoSubmissions([]);
        setError(null);
    }, []);

    const refetchAssignmentInfo = useCallback(async () => {
        if (!assignmentId) return;

        setLoading(true);
        setError(null);

        try {
            const data = await assignmentService.getAssignmentDetails(assignmentId);
            setAssignmentInfo(data);
        } catch (err: any) {
            console.error('Failed to fetch assignment details:', err);
            setError(err.message || 'Failed to load assignment details');
        } finally {
            setLoading(false);
        }
    }, [assignmentId]);

    const refetchSubmissions = useCallback(async () => {
        if (!assignmentId) return;

        try {
            const data = await assignmentService.getAssignmentSubmissions(assignmentId);
            setSubmissions(data);

            setSubmittedSubmissions(assignmentService.getSubmittedAssignments(data));
            setTodoSubmissions(assignmentService.getTodoAssignments(data));
        } catch (err: any) {
            console.error('Failed to fetch assignment submissions:', err);
            setError(err.message || 'Failed to load assignment submissions');
        }
    }, [assignmentId]);

    const refetchSubmissionsByStatus = useCallback(async (status: string) => {
        if (!assignmentId) return;

        try {
            const data = await assignmentService.getAssignmentSubmissions(assignmentId, status);

            if (status === 'submitted') {
                setSubmittedSubmissions(data);
            } else if (status === 'todo') {
                setTodoSubmissions(data);
            }
        } catch (err: any) {
            console.error(`Failed to fetch ${status} submissions:`, err);
            setError(err.message || `Failed to load ${status} submissions`);
        }
    }, [assignmentId]);

    const contextValue: AssignmentContextType = {
        assignmentId,
        assignmentInfo,
        submissions,
        submittedSubmissions,
        todoSubmissions,
        loading,
        error,
        setAssignmentId,
        refetchAssignmentInfo,
        refetchSubmissions,
        refetchSubmissionsByStatus,
    };

    return (
        <AssignmentContext.Provider value={contextValue}>
            {children}
        </AssignmentContext.Provider>
    );
};

export const useAssignment = (): AssignmentContextType => {
    const context = useContext(AssignmentContext);
    if (!context) {
        throw new Error('useAssignment must be used within an AssignmentProvider');
    }
    return context;
};