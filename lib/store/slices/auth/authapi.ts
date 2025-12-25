import axios from "axios";
import axiosClient from "../../axiosClient";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  _id: string;
  username: string;
  email: string;
  role: string;
}

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const res = await axiosClient.post<LoginResponse>("api/users/login", data);
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Login failed");
  }
};

export const registerUser = async (data: any): Promise<any> => {
  try {
    const res = await axiosClient.post<any>("api/users/register", data);
    return res.data.data.user;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Registration failed");
  }
};

export const getStudent = async (): Promise<any[]> => {
  try {
    const res = await axiosClient.get<any>("api/student/display");
    return res.data?.data?.students || [];
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Fetching students failed");
  }
};

export const getTeacher = async (): Promise<any[]> => {
  try {
    const res = await axiosClient.get<any>("api/teacher/display");
    return res.data?.data?.teachers || [];
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Fetching teachers failed");
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await axiosClient.get("api/users/logout");
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Logout failed");
  }
};

export const editUser = async (userId: string, data: any): Promise<any> => {
  try {
    const res = await axiosClient.put<any>(`api/users/edit/${userId}`, data);
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Editing user failed");
  }
};
