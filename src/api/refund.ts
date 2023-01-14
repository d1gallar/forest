import { server } from "./server";
import API_AUTH from "./auth";
import { AxiosError } from "axios";
import HTTPRequestError from "../util/httpError";
import { IRefund } from "../models/refund";

const getRefunds = async () => {
  const response = await server.get("/refund", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data as IRefund[];
};

const createRefund = async (field: IRefund) => {
  const response = await server.post("/refund", field, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data as IRefund;
};

const getRefundById = async (id: string) => {
  const token = API_AUTH.getAccessToken();
  try {
    const response = await server.get(`/refund/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return response.data as IRefund;
  } catch (error) {
    if(error instanceof HTTPRequestError){
      return error as HTTPRequestError;
    }
    return error;
  }
};

const getRefundByUserId = async (userId: string) => {
  try {
    const response = await server.get(`/refund/?userId=${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data as IRefund[];
  } catch (error) {
    return [];
  }
};

const deleteRefund = async (id: string) => {
  const token = API_AUTH.getAccessToken();
  try {
    const response = await server.delete(`/refund/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return response.data as IRefund;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response)
      return axiosError.response.data as HTTPRequestError;
    return null;
  }
};

const updateRefund = async (id: string, field: Object) => {
  const token = API_AUTH.getAccessToken();
  try {
    const response = await server.put(`/refund/${id}`, field, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return response.data as IRefund;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response)
      return axiosError.response.data as HTTPRequestError;
    return null;
  }
};

const updateRefundPartial = async (id: string, field: Object) => {
  const token = API_AUTH.getAccessToken();
  try {
    const response = await server.patch(`/refund/${id}`, field, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return response.data as IRefund;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response)
      return axiosError.response.data as HTTPRequestError;
    return null;
  }
};

const API_REFUND = {
  getRefunds,
  createRefund,
  getRefundById,
  getRefundByUserId,
  deleteRefund,
  updateRefund,
  updateRefundPartial
}

export default API_REFUND;