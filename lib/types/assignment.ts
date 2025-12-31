// types/assignment.ts
export interface Submission {
  submissionText?: string;
  submissionFile?: string;
  _id?: string;
  submittedAt?: string;
}

export interface Teacher {
  firstName: string;
  lastName: string;
}

export interface Assignment {
  _id: string;
  title: string;
  description?: string;
  subject?: string;
  dueDate?: string;
  teacher?: Teacher;
  isSubmitted?: boolean;
  submission?: Submission;
}
