import { RequestHandler } from "express-serve-static-core";
import { ObjectId } from "mongodb";
import mongoose, { SortOrder } from "mongoose";
import { GetUserAuthRequest } from "../middleware/auth";
import { IRefund, Refund } from "../models/refund";
import { IUser } from "../models/user";
import {
  invalidRefundId,
  invalidUserId,
  refundNotCreated,
  refundNotFound,
  refundNotUpdated,
  unauthorizedAccess,
  unauthorizedEdit,
} from "../util/errors";
import HTTPRequestError from "../util/httpError";
import { validatorFormatter } from "../util/mongooseValidator";


// @desc getRefunds
// @route GET /refund
// @access Private
export const getRefunds: RequestHandler = async (req, res) => {
  const query = req.query;
  const id: string = query.id as string;
  const userId: string = query.userId as string;

  const sortSpec: { [key: string]: SortOrder } = {};
  const sortField = req.query.sortField as string;
  const sortOrder = req.query.sortOrder as SortOrder;
  sortSpec[sortField as keyof { [key: string]: SortOrder }] = sortOrder;
  try {
    if (query && id && !ObjectId.isValid(id)) throw invalidRefundId;
    if (query && userId && !ObjectId.isValid(userId)) throw invalidUserId;
    let refunds;
    if (Object.entries(sortSpec).length > 0) {
      refunds = await Refund.find(query).sort(sortSpec);
    } else {
      refunds = await Refund.find(query);
    }
    if (!refunds) return res.status(200).send([]);
    return res.status(200).json(refunds);
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// @desc getRefundById
// @route GET /refund/:id
// @access Private
export const getRefundById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const user = (req as GetUserAuthRequest).user as IUser;

  try {
    if (id && !ObjectId.isValid(id)) throw invalidRefundId;
    const refund = await Refund.findById({ _id: id });
    if (
      id &&
      refund &&
      user._id.toString() !== new ObjectId(refund.userId.toString()).toString()
    )
      throw unauthorizedAccess;
    if (!refund) throw refundNotFound;
    return res.status(200).json(refund);
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// @desc createRefund
// @route POST /refund
// @access Public
export const createRefund: RequestHandler = async (req, res) => {
  try {
    const newRefund = new Refund(req.body);
    if (!newRefund) throw refundNotCreated;
    const savedRefund = await newRefund.save();
    return res.status(201).send(savedRefund);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validatorError = validatorFormatter(error, "refund");
      error.message = validatorError.message;
      return res.status(400).json(validatorError);
    }
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// @desc deleteRefund
// @route DELETE /refund/:id
// @access Private
export const deleteRefund: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const user = (req as GetUserAuthRequest).user as IUser;
  try {
    if (id && !ObjectId.isValid(id)) throw invalidRefundId;
    const refundToDelete = (await Refund.findOne({ _id: id })) as IRefund;
    if (!refundToDelete) throw refundNotFound;
    if (
      user &&
      refundToDelete &&
      user._id.toString() !== refundToDelete.userId.toString()
    )
      throw unauthorizedAccess;
    const deletedRefund = await Refund.deleteOne({ _id: id });
    // console.log(id, "deleted:", deletedRefund);
    return res.status(200).json(deletedRefund);
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(204).send(error);
  }
};

// @desc updateRefund
// @route PUT /refund/:id
// @access Private
export const updateRefund: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const user = (req as GetUserAuthRequest).user as IUser;
  try {
    if (id && !ObjectId.isValid(id)) throw invalidRefundId;
    const refundToUpdate = await Refund.findById({ _id: id });
    if (
      user &&
      refundToUpdate &&
      refundToUpdate.userId.toString() !== user._id.toString()
    )
      throw unauthorizedEdit;
    const updatedRefund = await Refund.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedRefund) throw refundNotUpdated;
    return res.status(200).json(updatedRefund);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validatorError = validatorFormatter(error, "refund");
      error.message = validatorError.message;
      return res.status(400).json(validatorError);
    }
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// @desc updateRefundPartial
// @route PATCH /refund/:id
// @access Private
export const updateRefundPartial: RequestHandler = async (req, res) => {
  const updateFields = req.body;
  const { id } = req.params;
  const user = (req as GetUserAuthRequest).user as IUser;
  try {
    if (id && !ObjectId.isValid(id)) throw invalidRefundId;
    const refundToUpdate = await Refund.findById({ _id: id });
    if (
      user &&
      refundToUpdate &&
      refundToUpdate.userId.toString() !== user._id.toString()
    )
      throw unauthorizedEdit;
    const updatedRefund = await Refund.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      {
        runValidators: true,
        new: true,
      }
    );
    if (!updatedRefund) throw refundNotUpdated;
    return res.status(200).json(updatedRefund);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validatorError = validatorFormatter(error, "refund");
      error.message = validatorError.message;
      return res.status(400).json(validatorError);
    }
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};
