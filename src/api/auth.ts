import { AxiosError } from "axios";
import HTTPRequestError from "../util/httpError";
import { server } from "./server";

const getAccessToken = () => {
  const token = localStorage.getItem("user");
  let userToken = "";
  if (token) {
    const parsedToken = JSON.parse(token) as string;
    userToken = parsedToken;
    return userToken;
  } else {
    return null;
  }
};

const login = async (fields: Object) => {
  try {
    const response = await server.post(
      "/auth/login",
      { ...fields },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    localStorage.setItem("user", JSON.stringify(response.data["accessToken"]));
    return response.data as string;
  } catch (error) {
    const axiosErr = error as AxiosError;
    if (axiosErr.response?.data) {
      return axiosErr.response.data as HTTPRequestError;
    }
  }
};

const register = async (fields: Object) => {
  try {
    const response = await server.post(
      "/auth/register",
      { ...fields },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log('register',response.data);
    localStorage.setItem("user", JSON.stringify(response.data["accessToken"]));
    return response.data["accessToken"] as string;
  } catch (error) {
    const axiosErr = error as AxiosError;
    if (axiosErr.response?.data)
      return axiosErr.response.data as HTTPRequestError;
  }
};

const logout = async () => {
  const token = getAccessToken();
  try {
    const response = await server.post("/auth/logout", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.removeItem("user");
    return response.data;
  } catch (error) {
    const axiosErr = error as AxiosError;
    if (axiosErr.response?.data) return axiosErr.response.data;
  }
};

const getUserId = async () => {
  const token = getAccessToken();
  try {
    const response = await server.get("/auth/userId", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as string;
  } catch (error) {
    const axiosErr = error as AxiosError;
    if (axiosErr.response?.data)
      return axiosErr.response.data as HTTPRequestError;
  }
};

const refresh = async () => {
  try {
    const response = await server.get("/auth/refresh", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { accessToken } = response.data as { accessToken: string };
    localStorage.setItem("user", accessToken);
    return accessToken;
  } catch (error) {
    const axiosErr = error as AxiosError;
    if (axiosErr.response?.data)
      return axiosErr.response.data as HTTPRequestError;
  }
};

const API_AUTH = {
  login,
  register,
  logout,
  getUserId,
  getAccessToken,
  refresh,
};

export default API_AUTH;
