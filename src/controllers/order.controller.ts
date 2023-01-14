import { RequestHandler } from "express-serve-static-core";
import { ObjectId } from "mongodb";
import mongoose, { SortOrder } from "mongoose";
import { GetUserAuthRequest } from "../middleware/auth";
import { Order, IOrder } from "../models/order";
import { IUser } from "../models/user";
import {
  invalidOrderId,
  invalidUserId,
  orderNotCreated,
  orderNotFound,
  orderNotUpdated,
  unauthorizedAccess,
  unauthorizedEdit,
} from "../util/errors";
import HTTPRequestError from "../util/httpError";
import { validatorFormatter } from "../util/mongooseValidator";

// TODO: set to admin access
// TODO: test!
// @desc getOrder
// @route GET /order
// @access Private
export const getOrders: RequestHandler = async (req, res) => {
  const query = req.query;
  const id: string = req.query.id as string;
  const userId: string = query.userId as string;

  const sortSpec: { [key: string]: SortOrder } = {};
  const sortField = req.query.sortField as string;
  const sortOrder = req.query.sortOrder as SortOrder;
  sortSpec[sortField as keyof { [key: string]: SortOrder }] = sortOrder;

  try {
    if (id && !ObjectId.isValid(id)) throw invalidOrderId;
    if (userId && !ObjectId.isValid(userId)) throw invalidUserId;
    let orders;
    if (Object.entries(sortSpec).length > 0) {
      orders = await Order.find(query).sort(sortSpec);
    } else {
      orders = await Order.find(query);
    }
    if (!orders) return res.status(200).send([]);
    return res.status(200).json(orders);
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// TODO: Test!
// @desc getOrderById
// @route GET /order/:id
// @access Private
export const getOrderById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const user = (req as GetUserAuthRequest).user as IUser;
  try {
    if (id && !ObjectId.isValid(id)) throw invalidOrderId;
    const order = await Order.findById({ _id: id });
    if (id && order && user._id.toString() !== (new ObjectId(order.userId.toString())).toString()) throw unauthorizedAccess;
    if (!order) throw orderNotFound;
    return res.status(200).json(order);
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// TODO: Test!
// @desc createOrder
// @route POST /order
// @access Public
export const createOrder: RequestHandler = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    if (!newOrder) throw orderNotCreated;
    const savedOrder = await newOrder.save();
    return res.status(201).send(savedOrder);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validatorError = validatorFormatter(error, "order");
      error.message = validatorError.message;
      return res.status(400).json(validatorError);
    }
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// TODO: Test!
// @desc deleteAddress
// @route DELETE /address/:id
// @access Private
export const deleteOrder: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const user = (req as GetUserAuthRequest).user as IUser;
  try {
    if (id && !ObjectId.isValid(id)) throw invalidOrderId;
    const orderToDelete = (await Order.findOne({ _id: id })) as IOrder;
    if (!orderToDelete) throw orderNotFound;
    if (
      user &&
      orderToDelete &&
      user._id.toString() !== orderToDelete.userId.toString()
    )
      throw unauthorizedAccess;
    const deletedOrder = await Order.deleteOne({ _id: id });
    // console.log(id, "deleted:", deletedOrder);
    return res.status(200).json(deletedOrder);
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(204).send(error);
  }
};

// @desc updateOrder
// @route PUT /order/:id
// @access Private
export const updateOrder: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const user = (req as GetUserAuthRequest).user as IUser;
  try {
    if (id && !ObjectId.isValid(id)) throw invalidOrderId;
    const orderToUpdate = await Order.findById({ _id: id });
    if (
      user &&
      orderToUpdate &&
      orderToUpdate.userId.toString() !== user._id.toString()
    )
      throw unauthorizedEdit;
    const updatedOrder = await Order.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedOrder) throw orderNotUpdated;
    return res.status(200).json(updatedOrder);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validatorError = validatorFormatter(error, "order");
      error.message = validatorError.message;
      return res.status(400).json(validatorError);
    }
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// TODO: TEST!
// @desc updateAddressPartial
// @route PATCH /address/:id
// @access Private
export const updateOrderPartial: RequestHandler = async (req, res) => {
  const updateFields = req.body;
  const { id } = req.params;
  const user = (req as GetUserAuthRequest).user as IUser;
  try {
    if (id && !ObjectId.isValid(id)) throw invalidOrderId;
    const orderToUpdate = await Order.findById({ _id: id });
    if (
      user &&
      orderToUpdate &&
      orderToUpdate.userId.toString() !== user._id.toString()
    )
      throw unauthorizedEdit;
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      {
        runValidators: true,
        new: true,
      }
    );
    if (!updatedOrder) throw orderNotUpdated;
    return res.status(200).json(updatedOrder);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validatorError = validatorFormatter(error, "order");
      error.message = validatorError.message;
      return res.status(400).json(validatorError);
    }
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};
