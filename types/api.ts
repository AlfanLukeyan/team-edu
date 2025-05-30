// Assignment types
export interface Assignment {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    title: string;
    description: string;
    deadline: string;
    file_name: string;
    file_link: string;
    WeekdID: number;
}

export interface ItemPembelajaran {
    id: number;
    headingPertemuan: string;
    bodyPertemuan: string;
    urlVideo: string;
    fileName: string;
    file_link: string;
}

export interface Week {
    id: number;
    week_number: number;
    class_id: string;
    assignment: Assignment;
    item_pembelajaran: ItemPembelajaran;
}

export interface ClassDetail {
    id_kelas: string;
    name: string;
    tag: string;
    description: string;
    teacher: string;
    teacher_id: string;
    week: Week[];
}

export interface ClassDetailResponse {
    status: string;
    message: string;
    data: ClassDetail;
}

export interface Class {
    id: string;
    name?: string;
    title?: string;
    tag: string;
    description?: string;
    desc?: string;
    teacher?: string;
    teacher_id?: string;
}

// Assessment types
export interface AssessmentItem {
    class_id: string;
    end_time: string;
    id: string;
    name: string;
    start_time: string;
    submission_status: 'todo' | 'in_progress' | 'completed' | 'submitted';
}

export interface ClassAssessment {
    class_assessment: AssessmentItem[];
    class_desc: string;
    class_id: string;
    class_name: string;
    class_tag: string;
    class_teacher: string;
    class_teacher_id: string;
}

export interface UpcomingAssessmentsResponse {
    data: ClassAssessment[];
    message: string;
    status: string;
}

// Assessment Details types - for the new API
export interface AssessmentDetails {
    duration: number; // in minutes
    end_time: string;
    id: string;
    name: string;
    start_time: string;
    total_student: number;
    total_submission: number;
}

export interface AssessmentDetailsResponse {
    data: AssessmentDetails;
    message: string;
    status: string;
}

// Component interfaces
export interface ComponentAssessment {
    id: string;
    title: string;
    start_date: string;
    end_date: string;
    days_remaining: number;
    submission_status: string;
}

// Common API response types
export interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
}