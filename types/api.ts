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

export interface WeeklySection {
    id: number;
    week_number: number;
    class_id: string;
    assignment: Assignment | null;
    item_pembelajaran: ItemPembelajaran;
}

export interface ClassInfo {
    id: string;
    name: string;
    tag: string;
    description: string;
    teacher: string;
    teacher_id: string;
}

export interface Assessment {
    id: string;
    name: string;
    description: string;
    duration: number;
    start_time: string;
    end_time: string;
    class_id: string;
    date_created: string;
    updated_at: string;
}

export interface ClassMember {
    user_user_id: string;
    username: string;
    photo_url: string;
    role: 'teacher' | 'student';
    kelas_kelas_id: string;
}

// API Response types
export interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
}

export interface ClassInfoResponse extends ApiResponse<ClassInfo> {}
export interface WeeklySectionResponse extends ApiResponse<WeeklySection[]> {}
export interface AssessmentResponse extends ApiResponse<Assessment[]> {}
export interface ClassMemberResponse extends ApiResponse<ClassMember[]> {}

// Legacy types for compatibility
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
export interface AssessmentDetails {
    id: string;
    name: string;
    duration: number;
    start_time: string;
    end_time: string;
    total_student: number;
    total_submission: number;
}

export interface AssessmentSubmission {
    id?: string;
    kelas_kelas_id: string;
    role: string;
    score: number;
    status: 'todo' | 'submitted' | 'in_progress';
    time_remaining: number | null;
    user_user_id: string;
    username: string;
}

export interface AssessmentQuestion {
    id: string;
    question_text: string;
    evaluation_id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    choice: AssessmentChoice[];
}

export interface AssessmentChoice {
    id: string;
    choice_text: string;
    question_id: string;
    is_correct: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

// API Response types for assessment
export interface AssessmentDetailsResponse extends ApiResponse<AssessmentDetails> {}
export interface AssessmentSubmissionsResponse extends ApiResponse<AssessmentSubmission[]> {}
export interface AssessmentQuestionsResponse extends ApiResponse<AssessmentQuestion[]> {}

// ...existing code...