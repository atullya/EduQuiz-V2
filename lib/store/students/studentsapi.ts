import axiosClient from "../axiosClient";

export const getStudents = async () => {
  const response = await axiosClient.get("/api/student/display");
  return response.data.data.students;
};
