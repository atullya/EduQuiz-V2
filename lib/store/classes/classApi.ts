// src/services/classApi.ts
import axiosClient from "../axiosClient";

export interface ClassData {
  _id?: string;
  name: string;
  section: string;
  grade: string;
  capacity?: number;
  maxStudents?: number;
  roomNo?: string;
  time?: string;
  schedule?: string[];
  status?: string;
  teacher?: {
    username?: string;
    _id?: string;
  };
  students?: string[];
  subjects: string[];
}

export const classApi = {
  createClass: async (data: ClassData) => {
    const res = await axiosClient.post("/api/class/create", data);
    return res.data;
  },
  getAllClasses: async () => {
    const res = await axiosClient.get("/api/class/fetch");
    return res.data;
  },
  getClassById: async (id: string) => {
    const res = await axiosClient.get(`/api/class/${id}`);
    return res.data;
  },
  getTeacherStats: async (teacherId: string) => {
    const res = await axiosClient.get(`/api/teacher-stats/${teacherId}`);
    return res.data;
  },
  updateClass: async (id: string, data: Partial<ClassData>) => {
    const res = await axiosClient.put(`/api/class/${id}`, data);
    return res.data;
  },
  deleteClass: async (id: string) => {
    const res = await axiosClient.delete(`/api/class/delete/${id}`);
    return res.data;
  },
};
