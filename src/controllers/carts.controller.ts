import { ObjectId } from "mongodb";
import { RequestHandler } from "express";
import mongoose, { isValidObjectId, Schema } from "mongoose";
import { GetUserAuthRequest } from "../middleware/auth";
import { Cart } from "../models/cart";
import { ICartItem, IPopulatedCartItem } from "../models/cartItem";
import { IUser } from "../models/user";
import { validatorFormatter } from "../util/mongooseValidator";
import {
  cartDidNotUpdate,
  cartNotFound,
  invalidCartId,
  invalidUserId,
  productNotInCart,
  unauthorizedEdit,
  unauthorizedAccess,
} from "../util/errors";
import HTTPRequestError from "../util/httpError";

// TODO: set to admin access
// @desc getCarts
// @route GET /cart
// @access Private
export const getCarts: RequestHandler = async (req, res) => {
  const query = req.query;
  const id: string = req.query.id as string;
  const userId: string = req.query.userId as string;
  try {
    if (id && !isValidObjectId(id)) throw invalidCartId;
    if (userId && !isValidObjectId(userId)) throw invalidUserId;
    const carts = await Cart.find(query);
    if (!carts) return res.status(200).send([]);
    return res.status(200).json(carts);
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// @desc getCartByUserId
// @route GET /cart/:userId
// @access Private
export const getCartByUserId: RequestHandler = async (req, res) => {
  const { userId } = req.params;
  const user = (req as GetUserAuthRequest).user as IUser;
  try {
    if (userId && !ObjectId.isValid(userId)) throw invalidUserId;
    if (user && userId && userId !== user._id.toString())
      throw unauthorizedAccess;
    const cart = await Cart.find({ userId });
    if (!cart) throw cartNotFound;
    return res.status(200).json(cart);
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// @desc createCart
// @route POST /cart
// @access Public
export const createCart: RequestHandler = async (req, res) => {
  try {
    const newCart = new Cart(req.body);
    await newCart.save();
    return res.status(201).send(newCart);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validatorError = validatorFormatter(error, "cart");
      error.message = validatorError.message;
      return res.status(400).json(validatorError);
    }
    return res.status(500).send(error);
  }
};

// @desc deleteCart
// @route DELETE /cart
// @access Private
export const deleteCart: RequestHandler = async (req, res) => {
  const { userId } = req.params;
  const user = (req as GetUserAuthRequest).user as IUser;
  try {
    if (userId && !ObjectId.isValid(userId)) throw invalidUserId;
    if (userId && user && userId !== user._id.toString())
      throw unauthorizedEdit;
    const deletedCart = await Cart.findOneAndDelete({ userId });
    return res.status(200).json(deletedCart);
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// @desc updateCart
// @route PUT /cart
// @access Private
export const updateCart: RequestHandler = async (req, res) => {
  const { userId } = req.params;
  const user = (req as GetUserAuthRequest).user as IUser;
  try {
    if (userId && !ObjectId.isValid(userId)) throw invalidUserId;
    if (user && userId && userId !== user._id.toString())
      throw unauthorizedEdit;
    const updatedCart = await Cart.findOneAndUpdate({ userId }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedCart) throw cartDidNotUpdate;
    return res.status(200).json(updatedCart);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validatorError = validatorFormatter(error, "cart");
      error.message = validatorError.message;
      return res.status(400).json(validatorError);
    }
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// @desc addItemToCart
// @route PATCH /cart/:userId/:productId/add
// @access Private
export const addItemToCart: RequestHandler = async (req, res) => {
  const { userId, productId } = req.params;
  const { unitPrice, quantity } = req.body;
  // const user = (req as GetUserAuthRequest).user;
  try {
    if (userId && !ObjectId.isValid(userId)) throw invalidUserId;
    // if (user && userId && userId !== user._id.toString())
    //   throw unauthorizedEdit;
    let cart = await Cart.findOne({ userId });
    if (!cart) throw cartNotFound;
    const cartItem: ICartItem = {
      cartId: cart._id as Schema.Types.ObjectId,
      productId,
      unitPrice,
      quantity,
    };
    const similarProductIndex = cart.items.findIndex((item) => {
      return item.productId.toString() === productId;
    });
    if (similarProductIndex !== -1) {
      cart.items[similarProductIndex].quantity += quantity;
    } else {
      cart.items.push(cartItem);
    }
    const updatedCart = await cart.save();
    return res.status(200).json(updatedCart);
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// @desc clearCart
// @route PATCH /cart/clear
// @access Private
export const clearCart: RequestHandler = async (req, res) => {
  const { userId } = req.body;
  const user = (req as GetUserAuthRequest).user;
  try {
    if (userId && !ObjectId.isValid(userId)) throw invalidUserId;
    if (user && userId && userId !== user._id.toString())
      throw unauthorizedEdit;
    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json(cartNotFound);
    cart.items = [];
    // cart.subtotal = 0;
    cart.shippingCost = 0;
    cart.tax = 0;
    cart.total = 0;
    const emptyCart = await cart.save();
    return res.status(200).json(emptyCart);
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// @desc removeItemFromCart
// @route PATCH /cart/:userId/:productId/remove
// @access Private
export const removeItemFromCart: RequestHandler = async (req, res) => {
  const { userId, productId } = req.params;
  try {
    if (userId && !ObjectId.isValid(userId)) throw invalidUserId;
    let cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      model: "Product",
      select: "-description -createdAt -lastModified -stockQuantity -price",
    });
    if (!cart) throw cartNotFound;
    cart.items = cart.items.filter((item) => {
      const populatedProduct = item.productId as IPopulatedCartItem;
      return populatedProduct._id.toString() !== productId;
    });
    if (cart.items.length === 0) {
      cart.subtotal = 0;
      cart.shippingCost = 0;
      cart.tax = 0;
      cart.total = 0;
    }
    const updatedCart = await cart.save();
    return res.status(200).json(updatedCart);
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// @desc modifyItemQuantity
// @route PATCH /cart/:userId/:productId/quantity
// @access Private
export const modifyItemQuantity: RequestHandler = async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;
  const user = (req as GetUserAuthRequest).user;
  try {
    if (userId && !ObjectId.isValid(userId)) throw invalidUserId;
    if (user && userId && userId !== user._id.toString())
      throw unauthorizedEdit;
    let cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      model: "Product",
      select: "-description -createdAt -lastModified -stockQuantity -price",
    });
    if (!cart) throw cartNotFound;
    const similarProductIndex = cart.items.findIndex((item, i) => {
      const populatedProduct = item.productId as IPopulatedCartItem;
      return populatedProduct._id.toString() === productId;
    });
    if (similarProductIndex === -1) throw productNotInCart;
    cart.items[similarProductIndex].quantity = quantity;
    const updatedCart = await cart.save();
    return res.status(200).json(updatedCart);
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// @desc populateCart
// @route PATCH /cart/:userId/populate
// @access Private
export const getPopulatedCart: RequestHandler = async (req, res) => {
  const { userId } = req.params;
  const user = (req as GetUserAuthRequest).user;
  try {
    if (userId && !ObjectId.isValid(userId)) throw invalidUserId;
    if (user && userId && userId !== user._id.toString())
      throw unauthorizedAccess;
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      model: "Product",
      select: "-description -createdAt -lastModified -stockQuantity -price",
    });
    if (!cart) throw cartNotFound;
    return res.status(200).json(cart);
  } catch (error) {
    if(error instanceof HTTPRequestError){
      return res.status(error.status).send(error);
    }
    return res.status(500).json(error);
  }
};
