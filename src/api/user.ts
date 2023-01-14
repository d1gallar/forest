import { IUser } from "../models/user";
import { server } from "./server";
import API_AUTH from "./auth";
import { AxiosError } from "axios";
import HTTPRequestError from "../util/httpError";

const getUsers = async () => {
  const token = API_AUTH.getAccessToken();
  const response = await server.get("/user", {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return response.data as IUser[];
};

const getUserById = async (id: string) => {
  const token = API_AUTH.getAccessToken();
  try {
    const response = await server.get(`/user/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return response.data as IUser;
  } catch (error) {
    const axiosErr = error as AxiosError;
    if (axiosErr.response) return axiosErr.response.data as HTTPRequestError;
  }
};

const updateUserPartial = async (id: string, field: Object) => {
  const token = API_AUTH.getAccessToken();
  const response = await server.patch(`/user/${id}`, field, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  if (response.status === 400) return response.data as HTTPRequestError;
  return response.data[0] as IUser;
};

const deleteUser = async (id: string) => {
  const token = API_AUTH.getAccessToken();
  const response = await server.delete(`/user/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  if (response.status === 400) return response.data as HTTPRequestError;
  return response.data as IUser;
};

const API_USER = {
  getUsers,
  getUserById,
  updateUserPartial,
  deleteUser,
};

export default API_USER;
