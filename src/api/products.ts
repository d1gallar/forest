import {server} from "./server";
import { IProduct } from '../models/product';

const getPopularProducts = async () => {
  const response = await server.get("/products/popular", {
    headers: {
      'Content-Type': 'application/json',
    }
  });
  return response.data as Array<IProduct>;
};

const getProduct = async (id: string) => {
  const response = await server.get(`/products/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
  return response.data[0] as IProduct;
};

const getAllProducts = async() => {
  const response = await server.get("/products", {
    headers: {
      'Content-Type': 'application/json',
    }
  });
  return response.data as Array<IProduct>;
}

const getFilterProducts = async(filter: string) => {
  const response = await server.get(`/products?${filter}`, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
  return response.data as Array<IProduct>;
}

const API_PRODUCT = {
  getPopularProducts,
  getProduct,
  getAllProducts,
  getFilterProducts
}

export default API_PRODUCT;