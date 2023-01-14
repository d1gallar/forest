import { RequestHandler } from "express";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { Product } from "../models/product";
import HTTPRequestError from "../util/httpError";
import { validatorFormatter } from "../util/mongooseValidator";
import {
  invalidProductId,
  productDidNotUpdate,
  productNotFound,
} from "../util/errors";

// @desc getProducts
// @route GET /products
// @access Public
export const getProducts: RequestHandler = async (req, res) => {
  const query = req.query;
  console.log(query)
  try {
    const products = await Product.find(query);
    if (!products || products.length === 0) return res.status(200).send([]);
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json((error as Error).message);
  }
};

// @desc getPopularProducts
// @route GET /products/popular
// @access Public
export const getPopularProducts: RequestHandler = async (req, res) => {
  try {
    // TODO: Need to create Cart Model
    // https://stackoverflow.com/questions/68909555/how-do-i-find-5-most-sold-products-from-a-mongodb-collection

    const popularProducts = await Product.find().limit(5);
    if (!popularProducts || popularProducts.length === 0)
      return res.status(200).send([]);
    return res.status(200).send(popularProducts);
  } catch (error) {
    return res.status(500).send((error as Error).message);
  }
};

// @desc getProductById
// @route GET /products/:id
// @access Public
export const getProductByProductId: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) throw invalidProductId;
    const foundProduct = await Product.find({ productId: id });
    if (!foundProduct || foundProduct.length === 0) throw productNotFound;
    return res.status(200).json(foundProduct);
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send((error as Error).message);
  }
};

// TODO: set to only admin
// @desc createProduct
// @route POST /product
// @access Private
export const createProduct: RequestHandler = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    return res.status(201).send(newProduct);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validatorError = validatorFormatter(error, "product");
      error.message = validatorError.message;
      return res.status(400).json(validatorError);
    }
    return res.status(500).send((error as Error).message);
  }
};

// TODO: set to only admin
// @desc deleteProduct
// @route DELETE /product
// @access Private
export const deleteProduct: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (id && !ObjectId.isValid(id)) throw invalidProductId;
    const deletedProduct = await Product.findOneAndDelete({ productId: id });
    return res.status(200).json(deletedProduct);
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(204).send((error as Error).message);
  }
};

// TODO: set to only admin
// @desc updateProduct
// @route PUT /product
// @access Private
export const updateProduct: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) throw invalidProductId;
    const updatedProduct = await Product.findOneAndUpdate(
      { productId: id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) throw productDidNotUpdate;
    return res.status(200).json(updatedProduct);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validatorError = validatorFormatter(error, "product");
      error.message = validatorError.message;
      return res.status(400).json(validatorError);
    }
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send((error as Error).message);
  }
};
export default updateProduct;

// TODO: set to only admin
// TEST!
// @desc updateProductPartial
// @route PATCH /product
// @access Private
export const updateProductPartial: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  try {
    if (!id) throw invalidProductId;
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id },
      { $set: fields },
      {
        runValidators: true,
      }
    );
    console.log(req.body, updatedProduct);
    return res.status(200).json(updatedProduct);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validatorError = validatorFormatter(error, "product");
      error.message = validatorError.message;
      return res.status(400).json(validatorError);
    }
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};
