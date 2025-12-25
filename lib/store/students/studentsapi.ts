import axiosClient from "../axiosClient";

export const getStudents = async () => {
  const response = await axiosClient.get("/api/student/display");
  return response.data.data.students;
};

export const deleteStudents = async (studentId: string) => {
  const response = await axiosClient.delete(`/api/student/delete/${studentId}`);
  return response.data;
};
