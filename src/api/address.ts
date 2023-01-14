import { IAddress } from "../models/address";
import { server } from "./server";
import API_AUTH from "./auth";
import { AxiosError } from "axios";
import HTTPRequestError from "../util/httpError";

const getAddresses = async () => {
  const response = await server.get("/address", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data as IAddress[];
};

const getAddressById = async (id: string) => {
  const token = API_AUTH.getAccessToken();
  try {
    const response = await server.get(`/address/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return response.data as IAddress;
  } catch (error) {
    return null;
  }
};

const getAddressesByUserId = async (userId: string) => {
  const token = API_AUTH.getAccessToken();
  try {
    const response = await server.get(`/address/?userId=${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return response.data as IAddress[];
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response)
      return axiosError.response.data as HTTPRequestError;
    return [];
  }
};

const createAddress = async (field: IAddress) => {
  try {
    const response = await server.post(`/address`, field, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data as IAddress;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response)
      return axiosError.response.data as HTTPRequestError;
    return null;
  }
};

const deleteAddress = async (id: string) => {
  const token = API_AUTH.getAccessToken();
  try {
    const response = await server.delete(`/address/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return response.data as IAddress;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response)
      return axiosError.response.data as HTTPRequestError;
    return null;
  }
};

const updateAddressPartial = async (id: string, field: Object) => {
  const token = API_AUTH.getAccessToken();
  try {
    const response = await server.patch(`/address/${id}`, field, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return response.data as IAddress;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response)
      return axiosError.response.data as HTTPRequestError;
    return null;
  }
};

const updateDefaultAddress = async (userId: string, id: string) => {
  const token = API_AUTH.getAccessToken();
  try {
    const response = await server.patch(
      "/address/userDefault",
      {
        userId,
        id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response)
      return axiosError.response.data as HTTPRequestError;
    return null;
  }
};

const API_ADDRESS = {
  getAddresses,
  getAddressById,
  updateAddressPartial,
  createAddress,
  deleteAddress,
  getAddressesByUserId,
  updateDefaultAddress,
};

export default API_ADDRESS;
