import axiosClient from "../axiosClient";

export const getSystemInfo = async () => {
  const response = await axiosClient.get("/api/admin/info");

  return response.data.data.data;
};
