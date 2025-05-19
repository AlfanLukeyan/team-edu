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