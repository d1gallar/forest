import { AxiosError } from "axios";
import { ILike, IUserLike } from "../models/likes";
import { IProduct } from "../models/product";
import HTTPRequestError from "../util/httpError";
import API_AUTH from "./auth";
import { server } from "./server";

const getLikes = async () => {
  const response = await server.get("/like", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data as Array<ILike>;
};

const createLike = async (field: ILike) => {
  const response = await server.post("/like", field, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data as ILike;
};

const getLikeById = async (id: string) => {
  const token = API_AUTH.getAccessToken();
  try {
    const response = await server.get(`/like/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return response.data as ILike;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response)
      return axiosError.response.data as HTTPRequestError;
    return error;
  }
};

const deleteLike = async (productId: string) => {
  const token = API_AUTH.getAccessToken();
  try {
    const response = await server.delete(`/like`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data:{
        productId
      }
    });
    return response.data as ILike;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response)
      return axiosError.response.data as HTTPRequestError;
    return null;
  }
};

const updateLike = async (id: string, field: Object) => {
  const token = API_AUTH.getAccessToken();
  try {
    const response = await server.put(`/like/${id}`, field, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return response.data as ILike;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response)
      return axiosError.response.data as HTTPRequestError;
    return null;
  }
};

const getUserLikes = async (userId: string) => {
  const token = API_AUTH.getAccessToken();
  try {
    const response = await server.get(
      `/like/user/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    return response.data as IUserLike[];
  } catch (error) {
    return [];
  }
};

const getUserLikedProducts = async () => {
  const token = API_AUTH.getAccessToken();
  try {
    const response = await server.get(
      `/like/userProducts`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    return response.data as Partial<IProduct>[];
  } catch (error) {
    return [];
  }
};

const API_LIKE = {
  getLikes,
  createLike,
  getLikeById,
  deleteLike,
  updateLike,
  getUserLikes,
  getUserLikedProducts
};

export default API_LIKE;
