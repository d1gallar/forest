import { RequestHandler } from "express-serve-static-core";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { GetUserAuthRequest } from "../middleware/auth";
import { Address, IAddress } from "../models/address";
import { IUser } from "../models/user";
import { validatorFormatter } from "../util/mongooseValidator";
import HTTPRequestError from "../util/httpError";
import {
  addressNotCreated,
  addressNotFound,
  addressNotUpdated,
  invalidAddressId,
  invalidUserId,
  unauthorizedEdit,
  unauthorizedAccess,
} from "../util/errors";

// TODO: test id && vs id || vs id !== undefined
// TODO: set to admin access
// @desc getAddresses
// @route GET /address
// @access Private
export const getAddresses: RequestHandler = async (req, res) => {
  const query = req.query;
  const id: string = req.query.id as string;
  const userId: string = query.userId as string;
  try {
    if (id && !ObjectId.isValid(id)) throw invalidAddressId;
    if (userId && !ObjectId.isValid(userId)) throw invalidUserId;
    const addresses = await Address.find(query);
    if (!addresses) return res.status(200).send([]);
    return res.status(200).json(addresses);
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// @desc getAddress
// @route GET /address/:id
// @access Private
export const getAddressById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const user = (req as GetUserAuthRequest).user as IUser;
  try {
    if (id && !ObjectId.isValid(id)) throw invalidAddressId;
    const address = await Address.findById({ _id: id });
    console.log(user._id, address?.userId);
    if (id && address && id !== address.userId.toString())
      throw unauthorizedAccess;
    if (!address) throw addressNotFound;
    return res.status(200).json(address);
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// @desc createAddress
// @route POST /address
// @access Public
export const createAddress: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId || !ObjectId.isValid(userId)) throw invalidUserId;
    const newAddress = new Address(req.body);
    if (!newAddress) throw addressNotCreated;
    const userAddresses = await Address.find({ userId: newAddress.userId });
    if (newAddress.isDefault && userAddresses.length >= 1) {
      await Address.updateMany(
        { userId: newAddress.userId },
        { isDefault: false }
      );
    }
    const savedAddress = await newAddress.save();
    return res.status(201).send(savedAddress);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validatorError = validatorFormatter(error, "address");
      error.message = validatorError.message;
      return res.status(400).json(validatorError);
    }
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// @desc deleteAddress
// @route DELETE /address/:id
// @access Private
export const deleteAddress: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const user = (req as GetUserAuthRequest).user as IUser;
  try {
    if (id && !ObjectId.isValid(id)) throw invalidAddressId;
    const addressToDelete = (await Address.findOne({ _id: id })) as IAddress;
    if (!addressToDelete) throw addressNotFound;
    if (
      user &&
      addressToDelete &&
      user._id.toString() !== addressToDelete.userId.toString()
    )
      throw unauthorizedAccess;
    const deletedAddress = await Address.deleteOne({ _id: id });
    console.log(id, "deleted:", deleteAddress);
    const userAddresses = await Address.find({
      userId: addressToDelete.userId,
    });
    if (userAddresses.length === 1) {
      await Address.updateOne(
        { userId: addressToDelete.userId },
        { isDefault: true }
      );
    } else if (addressToDelete.isDefault && userAddresses.length > 1) {
      await Address.updateOne(
        { _id: { $ne: addressToDelete._id } },
        { isDefault: true }
      );
    }
    return res.status(200).json(deletedAddress);
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(204).send(error);
  }
};

// @desc updateAddress
// @route PUT /address/:id
// @access Private
export const updateAddress: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const user = (req as GetUserAuthRequest).user as IUser;
  try {
    if (id && !ObjectId.isValid(id)) throw invalidAddressId;
    const addressToUpdate = await Address.findById({ _id: id });
    if (
      user &&
      addressToUpdate &&
      addressToUpdate.userId.toString() !== user._id.toString()
    )
      throw unauthorizedEdit;
    const updatedAddress = await Address.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedAddress) throw addressNotUpdated;
    return res.status(200).json(updatedAddress);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validatorError = validatorFormatter(error, "address");
      error.message = validatorError.message;
      return res.status(400).json(validatorError);
    }
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// @desc updateAddressPartial
// @route PATCH /address/:id
// @access Private
export const updateAddressPartial: RequestHandler = async (req, res) => {
  const updateFields = req.body;
  const { id } = req.params;
  const user = (req as GetUserAuthRequest).user as IUser;
  try {
    if (id && !ObjectId.isValid(id)) throw invalidAddressId;
    const addressToUpdate = await Address.findById({ _id: id });
    if (
      user &&
      addressToUpdate &&
      addressToUpdate.userId.toString() !== user._id.toString()
    )
      throw unauthorizedEdit;
    const updatedAddress = await Address.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      {
        runValidators: true,
        new: true,
      }
    );
    if (!updatedAddress) throw addressNotUpdated;
    return res.status(200).json(updatedAddress);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validatorError = validatorFormatter(error, "address");
      error.message = validatorError.message;
      return res.status(400).json(validatorError);
    }
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// @desc updateDefaultAddress
// @route PATCH /address/userDefault
// @access Private
export const updateDefaultAddress: RequestHandler = async (req, res, next) => {
  const { userId, id } = req.body;
  console.log("updateDefaultAddress", id, userId);
  const user = (req as GetUserAuthRequest).user as IUser;
  try {
    if (!userId || !ObjectId.isValid(userId)) throw invalidUserId;
    if (id && !ObjectId.isValid(id)) throw invalidAddressId;
    const addressToUpdate = await Address.findById({ _id: id });
    if (
      user &&
      addressToUpdate &&
      user._id.toString() !== addressToUpdate.userId.toString()
    )
      throw unauthorizedEdit;
    await Address.find({ userId })
      .select({ _id: 1, isDefault: 1 })
      .updateMany({}, { isDefault: false });
    await Address.findByIdAndUpdate({ _id: id }, { isDefault: true });
    const userAddresses = await Address.find({ userId });
    return res.status(200).json(userAddresses);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validatorError = validatorFormatter(error, "address");
      error.message = validatorError.message;
      return res.status(400).json(validatorError);
    }
    if(error instanceof HTTPRequestError){
      return res.status(error.status).send(error);
    }
    return res.status(500).send((error as Error).message);
  }
};
