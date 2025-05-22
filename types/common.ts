export interface ClassData {
    id: string;
    title: string;
    class_code: string;
    desc: string;
  }
  
  export interface AssessmentFormData {
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    duration: string;
  }
  
  export interface WeeklySectionFormData {
    title: string;
    description: string;
    videoUrl: string;
  }
  
  export interface TabContentProps {
    onCreatePress: () => void;
  }
  export interface Choice {
    id: string;
    choice_text: string;
    is_correct: boolean;
  }
  
  export interface Question {
    id: string;
    question_text: string;
    choices: Choice[];
  }
  
  export interface QuestionsFormData {
    questions: Question[];
    assessment_id?: string;
  }