import { AxiosError } from "axios";
import { IOrder } from "../models/order";
import HTTPRequestError from "../util/httpError";
import API_AUTH from "./auth";
import { server } from "./server";

const getOrders = async () => {
  const response = await server.get("/order", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data as Array<IOrder>;
};

const createOrder = async (field: IOrder) => {
  const response = await server.post("/order", field, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data as IOrder;
};

const getOrderById = async (id: string) => {
  const token = API_AUTH.getAccessToken();
  try {
    const response = await server.get(`/order/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return response.data as IOrder;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response)
      return axiosError.response.data as HTTPRequestError;
    return error;
  }
};

const getOrdersByUserId = async (userId: string) => {
  const token = API_AUTH.getAccessToken();
  try {
    const response = await server.get(`/order/?userId=${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return response.data as IOrder[];
  } catch (error) {
    return [];
  }
};

const getOrdersByUserIdSorted = async (userId: string) => {
  const token = API_AUTH.getAccessToken();
  try {
    const response = await server.get(
      `/order/?userId=${userId}&sortField=createdAt&sortOrder=desc`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    return response.data as IOrder[];
  } catch (error) {
    return [];
  }
};

const deleteOrder = async (id: string) => {
  const token = API_AUTH.getAccessToken();
  try {
    const response = await server.delete(`/order/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return response.data as IOrder;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response)
      return axiosError.response.data as HTTPRequestError;
    return null;
  }
};

const updateOrder = async (id: string, field: Object) => {
  const token = API_AUTH.getAccessToken();
  try {
    const response = await server.put(`/order/${id}`, field, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return response.data as IOrder;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response)
      return axiosError.response.data as HTTPRequestError;
    return null;
  }
};

const updateOrderPartial = async (id: string, field: Object) => {
  const token = API_AUTH.getAccessToken();
  try {
    const response = await server.patch(`/order/${id}`, field, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return response.data as IOrder;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response)
      return axiosError.response.data as HTTPRequestError;
    return null;
  }
};

const getCompletedOrder = async (userId: string, paymentId: string) => {
  try {
    const response = await server.get(
      `/order/?paymentId=${paymentId}&userId=${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data[0] as IOrder;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response)
      return axiosError.response.data as HTTPRequestError;
    return null;
  }
};

const API_ORDER = {
  getOrders,
  createOrder,
  getOrderById,
  getOrdersByUserId,
  getOrdersByUserIdSorted,
  getCompletedOrder,
  deleteOrder,
  updateOrder,
  updateOrderPartial,
};

export default API_ORDER;
