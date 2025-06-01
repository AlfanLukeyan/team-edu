export interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
}

export interface AssessmentItem {
    class_id: string;
    end_time: string;
    assessment_id: string;
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

export interface ComponentAssessment {
    id: string;
    title: string;
    start_date: string;
    end_date: string;
    days_remaining: number;
    submission_status: string;
}

export interface Assignment {
    assignment_id: number;
    deadline: string;
    description: string;
    title: string;
    file_id: string;
    file_name: string;
    file_url: string;
}

export interface ItemPembelajaran {
    week_id: number;
    headingPertemuan: string;
    bodyPertemuan: string;
    urlVideo: string;
    fileName: string | null;
    fileId: string | null;
    fileUrl: string | null;
}

export interface WeeklySection {
    week_id: number;
    week_number: number;
    class_id: string;
    assignment: Assignment[];
    item_pembelajaran: ItemPembelajaran;
}

export interface Class {
    id: string;
    name: string;
    tag: string;
    description: string;
    teacher: string;
    teacher_id: string;
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
    assessment_id: string;
    name: string;
    description: string;
    duration: number;
    start_time: string;
    end_time: string;
    class_id: string;
    date_created: string;
    updated_at: string;
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

export interface AssessmentChoice {
    id: string;
    choice_text: string;
    question_id: string;
    is_correct: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface AssessmentQuestion {
    question_id: string;
    question_text: string;
    evaluation_id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    choice: AssessmentChoice[];
}

export interface ClassMember {
    user_user_id: string;
    username: string;
    photo_url: string;
    role: 'teacher' | 'student';
    kelas_kelas_id: string;
}

export interface CreateAssessmentRequest {
    name: string;
    class_id: string;
    description: string;
    date_created: string;
    duration: number;
    start_time: string;
    end_time: string;
}

export interface UpdateAssessmentRequest {
    assessment_id: string;
    name: string;
    date_created: string;
    description: string;
    start_time: string;
    duration: number;
    end_time: string;
}

export interface CreateQuestionsRequest {
    assessment_id: string;
    questions: CreateQuestionItem[];
}

export interface CreateQuestionItem {
    question_text: string;
    choices: CreateChoiceItem[];
}

export interface CreateChoiceItem {
    choice_text: string;
    is_correct: boolean;
}

export interface UpdateQuestionRequest {
    question_id: string;
    question_text: string;
    choices: CreateChoiceItem[];
}
export interface AssessmentCrudResponseData {
    assessment_id: string;
    class_id: string;
    name: string;
    description: string;
    start_time: string;
    end_time: string;
    duration: number;
    date_created: string;
    updated_at: string;
}

export interface QuestionResponseData {
    assessment_id: string;
    question_id: string;
    question_text: string;
    created_at: string;
    choices: ChoiceResponseData[];
}

export interface ChoiceResponseData {
    id: string;
    choice_text: string;
    is_correct: boolean;
    question_id: string;
}

export interface Assignment {
    assignment_id: number;
    title: string;
    description: string;
    deadline: string;
    file_name: string;
    file_id: string;
    file_url: string;
}

export interface AssignmentSubmission {
    id_submission: string | null;
    user_user_id: string;
    username: string;
    photo_url: string;
    status: 'submitted' | 'todo';
    link_file: string | null;
    filename: string | null;
    score: number;
    created_at: string | null;
    updated_at: string | null;
}

export interface CreateAssignmentData {
    assignment_id: number;
    title: string;
    description: string;
    deadline: string;
    file_name: string;
    file_id: string;
    file_url: string;
}

export interface UpdateAssignmentData {
    assignment_id: number;
    title: string;
    description: string;
    deadline: string;
    file_name: string;
    file_id: string;
    file_url: string;
}

export type UpcomingAssessmentsResponse = ApiResponse<ClassAssessment[]>;
export type ClassResponse = ApiResponse<Class[]>;
export type ClassInfoResponse = ApiResponse<ClassInfo>;
export type WeeklySectionResponse = ApiResponse<WeeklySection[]>;
export type AssessmentResponse = ApiResponse<Assessment[]>;
export type AssessmentDetailsResponse = ApiResponse<AssessmentDetails>;
export type AssessmentSubmissionsResponse = ApiResponse<AssessmentSubmission[]>;
export type AssessmentQuestionsResponse = ApiResponse<AssessmentQuestion[]>;
export type ClassMemberResponse = ApiResponse<ClassMember[]>;
export type CreateAssessmentResponse = ApiResponse<AssessmentCrudResponseData>;
export type UpdateAssessmentResponse = ApiResponse<AssessmentCrudResponseData>;
export type DeleteAssessmentResponse = ApiResponse<string>;
export type CreateQuestionsResponse = ApiResponse<QuestionResponseData[]>;
export type UpdateQuestionResponse = ApiResponse<QuestionResponseData>;
export type AssignmentDetailsResponse = ApiResponse<Assignment>;
export type AssignmentSubmissionsResponse = ApiResponse<AssignmentSubmission[]>;
export type CreateAssignmentResponse = ApiResponse<CreateAssignmentData>;
export type UpdateAssignmentResponse = ApiResponse<UpdateAssignmentData>;
