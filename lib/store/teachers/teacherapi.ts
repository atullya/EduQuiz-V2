import axiosClient from "../axiosClient";

export const getTeachers = async () => {
  const response = await axiosClient.get("/api/teacher/display");
  return response.data.data.teachers;
};

export const deleteTeachers = async (teacherID: string) => {
  const response = await axiosClient.delete(`/api/teacher/delete/${teacherID}`);
  return response.data;
};

export const teacherStats = async (teacherID: string) => {
  const response = await axiosClient.get(`/api/teacher/stats/${teacherID}`);
  return response.data;
};

export const getMyAssignedWithSubmissions = async () => {
  const response = await axiosClient.get(
    "/api/assignment/my-assigned-with-submissions"
  );
  return response.data.data;
};

export const deleteAssignedAssignment = async (assignmentID: string) => {
  const response = await axiosClient.delete(
    `/api/assignment/my-assigned/${assignmentID}`
  );
  return response.data;
};

export const createAssignment = async (assignmentData: {
  title: string;
  description: string;
  subject: string;
  class: string;
  dueDate: string;
}) => {
  const response = await axiosClient.post(
    "/api/assignment/create",
    assignmentData
  );
  return response.data;
};

export const updateAssignment = async (
  assignmentID: string,
  assignmentData: {
    title?: string;
    description?: string;
    subject?: string;
    class?: string;
    dueDate?: Date;
  }
) => {
  const response = await axiosClient.put(
    `/api/assignment/my-assigned/${assignmentID}`,
    assignmentData
  );
  return response.data;
};

export const getAssignmentDetails = async (id: string) => {
  const response = await axiosClient.get(`/api/assignment/submission/${id}`);
  return response.data.data;
};

export const gradeAssignment = async (
  assignmentID: string,
  studentID: string,
  gradeData: { marks: number; feedback: string }
) => {
  const response = await axiosClient.put(
    `/api/assignment/grade/${assignmentID}/${studentID}`,
    gradeData
  );
  return response.data;
};
