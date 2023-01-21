import { AxiosError } from "axios";
import { server } from "./server";

const config = async () => {
  const response = await server.get("/stripe/config", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data.STRIPE_PUBLISHABLE as string;
};

const createPaymentIntent = async (amount: number, metadata: Object) => {
  const response = await server.post(
    "/stripe/create-payment-intent",
    { amount, metadata },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const confirmPaymentIntent = async (paymentId: string, params: Object) => {
  const response = await server.post(
    "/stripe/confirm-payment-intent",
    { paymentId, params },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const updatePaymentIntent = async (paymentId: string, params: Object) => {
  const response = await server.post(
    "/stripe/update-payment-intent",
    { paymentId, params },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const cancelPaymentIntent = async (paymentId: string) => {
  const response = await server.post(
    `/stripe/cancel-payment-intent/${paymentId}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const retrievePaymentIntent = async (paymentId: string) => {
  try {
    const response = await server.post(
      "/stripe/retrieve-payment-intent",
      { paymentId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) return axiosError.response;
    return error;
  }
};

const retrievePaymentMethod = async (paymentMethodId: string) => {
  try {
    const response = await server.post(
      "/stripe/retrieve-payment-method",
      { paymentMethodId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) return axiosError.response.data;
    return error;
  }
};

const refund = async (chargeId: string, amount: number) => {
  const response = await server.post(
    "/stripe/refund",
    { chargeId, amount },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const API_STRIPE = {
  createPaymentIntent,
  updatePaymentIntent,
  cancelPaymentIntent,
  retrievePaymentIntent,
  retrievePaymentMethod,
  confirmPaymentIntent,
  refund,
  config,
};

export default API_STRIPE;
