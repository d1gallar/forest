import { ICart } from "../models/cart";
import { server } from "./server";
import API_AUTH from "../api/auth";
import { AxiosError } from "axios";
import HTTPRequestError from "../util/httpError";

const getCartByUserId = async (userId: string) => {
  const token = API_AUTH.getAccessToken();
  const response = await server.get(`/cart/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    
  });
  console.log('response', response.data[0])
  return response.data[0] as ICart;
};

const addItemToCart = async (
  userId: string,
  productId: string,
  unitPrice: number,
  quantity: number
) => {
  const token = API_AUTH.getAccessToken();
  try {
    const response = await server.patch(
      `/cart/${userId}/${productId}/add`,
      {
        unitPrice,
        quantity,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    return response.data as ICart;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response)
      return axiosError.response.data as HTTPRequestError;
  }
};

const getPopulatedCart = async (userId: string) => {
  const token = API_AUTH.getAccessToken();
  try {
    const response = await server.get(`/cart/${userId}/populate`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return response.data as ICart;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response)
      return axiosError.response.data as HTTPRequestError;
  }
};

const modifyItemQuantity = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  try {
    const response = await server.patch(
      `/cart/${userId}/${productId}/quantity`,
      {
        quantity,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data as ICart;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response)
      return axiosError.response.data as HTTPRequestError;
  }
};

const removeItemFromCart = async (userId: string, productId: string) => {
  try {
    const response = await server.patch(`/cart/${userId}/${productId}/remove`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data as ICart;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response)
      return axiosError.response.data as HTTPRequestError;
  }
};

const clearCart = async (userId: string) => {
  try {
    const token = API_AUTH.getAccessToken();
    console.log("clear-cart", "userID: " + userId);
    const response = await server.patch(
      `/cart/clear`,
      { userId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    return response.data as ICart;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response)
      return axiosError.response.data as HTTPRequestError;
  }
};

const API_CART = {
  getCartByUserId,
  getPopulatedCart,
  modifyItemQuantity,
  removeItemFromCart,
  addItemToCart,
  clearCart,
};

export default API_CART;
