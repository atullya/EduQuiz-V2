import axiosClient from "../axiosClient";

export const getTeachers = async () => {
  const response = await axiosClient.get("/api/teacher/display");
  return response.data.data.teachers;
};
