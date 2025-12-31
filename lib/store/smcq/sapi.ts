import axiosClient from "../axiosClient";

// -------------------- Student APIs --------------------

// 1. Fetch quizzes for student
export const fetchStudentQuizzes = async (
  studentId: string,
  classId: string,
  section: string,
  subject: string,
  chapter?: string
): Promise<any> => {
  const params = new URLSearchParams({ studentId, classId, section, subject });
  if (chapter) params.append("chapter", chapter);

  const res = await axiosClient.get(
    `/api/smcq/student/quizzes?${params.toString()}`
  );
  return res.data;
};

// 2. Submit student quiz
export const submitStudentQuiz = async (
  studentId: string,
  classId: string,
  section: string,
  subject: string,
  chapter: string,
  answers: { mcqId: string; selectedOption: string }[]
): Promise<any> => {
  const res = await axiosClient.post(`/api/smcq/student/submit`, {
    studentId,
    classId,
    section,
    subject,
    chapter,
    answers,
  });
  return res.data;
};

// 3. Get student quiz progress
export const getStudentProgress = async (studentId: string): Promise<any> => {
  const res = await axiosClient.get(`/api/smcq/student/progress/${studentId}`);
  return res.data;
};

// 4. View student quiz attempt details
export const viewStudentQuizDetails = async (
  studentId: string,
  classId: string,
  section: string,
  subject: string,
  chapter: string
): Promise<any> => {
  const params = new URLSearchParams({
    studentId,
    classId,
    section,
    subject,
    chapter,
  });
  const res = await axiosClient.get(
    `/api/smcq/student/view-details?${params.toString()}`
  );
  return res.data;
};

// -------------------- Teacher APIs --------------------

// 5. Teacher view quiz progress
export const getTeacherProgress = async (
  classId: string,
  section: string,
  subject: string,
  chapter: string
): Promise<any> => {
  const params = new URLSearchParams({ classId, section, subject, chapter });
  const res = await axiosClient.get(
    `/api/smcq/teacher/progress?${params.toString()}`
  );
  return res.data;
};

// 6. Delete MCQs by teacher
export const deleteTeacherMCQs = async (
  teacherId: string,
  classId: string,
  section: string,
  subject: string,
  chapter?: string
): Promise<any> => {
  const params = new URLSearchParams({ teacherId, classId, section, subject });
  if (chapter) params.append("chapter", chapter);

  const res = await axiosClient.delete(
    `/api/smcq/teacher/delete-mcqs?${params.toString()}`
  );
  return res.data;
};

// -------------------- General/All MCQs --------------------

// 7. Fetch all MCQs (with optional filters)
export const getAllMCQs = async (filters?: {
  classId?: string;
  teacherId?: string;
  subject?: string;
  chapter?: string;
}): Promise<any> => {
  const params = new URLSearchParams();
  if (filters?.classId) params.append("classId", filters.classId);
  if (filters?.teacherId) params.append("teacherId", filters.teacherId);
  if (filters?.subject) params.append("subject", filters.subject);
  if (filters?.chapter) params.append("chapter", filters.chapter);

  const res = await axiosClient.get(`/api/smcq/all-mcqs?${params.toString()}`);
  return res.data;
};

// -------------------- Existing MCQ Utilities --------------------

export const generateMCQ = async (
  textOrFile: string | File,
  numQuestions: number
): Promise<any> => {
  const formData = new FormData();
  if (typeof textOrFile === "string") formData.append("text_input", textOrFile);
  else formData.append("pdf_file", textOrFile);
  formData.append("number_of_questions", numQuestions.toString());

  const res = await axiosClient.post("/api/mcq/generate", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const saveMCQ = async (
  mcqs: any[],
  classId: string,
  section: string,
  teacherId: string,
  duration: number,
  subject: string,
  chapter: string
): Promise<any> => {
  const res = await axiosClient.post("/api/mcq/save", {
    mcqs,
    classId,
    section,
    teacherId,
    duration,
    subject,
    chapter,
  });
  return res.data;
};

export const getMCQwithClasses = async (teacherId: string): Promise<any> => {
  const res = await axiosClient.get(`/api/mcq/classes-with-mcqs/${teacherId}`);
  return res.data;
};
