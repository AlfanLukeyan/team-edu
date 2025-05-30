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