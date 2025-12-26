import axiosClient from "../axiosClient";

export const getTeachers = async () => {
  const response = await axiosClient.get("/api/teacher/display");
  return response.data.data.teachers;
};
export const deleteTeachers = async (teacherID: string) => {
  const response = await axiosClient.delete(`/api/teacher/delete/${teacherID}`);
  return response.data;
};