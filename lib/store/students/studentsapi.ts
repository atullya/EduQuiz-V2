import axiosClient from "../axiosClient";

export const getStudents = async () => {
  const response = await axiosClient.get("/api/student/display");
  return response.data.data.students;
};

export const deleteStudents = async (studentId: string) => {
  const response = await axiosClient.delete(`/api/student/delete/${studentId}`);
  return response.data;
};

export const getStudentAssignments = async () => {
  const response = await axiosClient.get(
    `/api/assignment/student/my-assignments`
  );
  console.log("Assignments Response:", response.data);
  return response.data;
};
export const submitAssignemnt = async (
  assignmentId: string,
  submissionText: string
) => {
  const response = await axiosClient.post(
    `/api/assignment/submit/${assignmentId}`,
    { submissionText }
  );
  return response.data;
};
