import { RequestHandler } from "express";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { IUser, User } from "../models/user";
import { validatorFormatter } from "../util/mongooseValidator";
import { GetUserAuthRequest } from "../middleware/auth";
import config from "../config/config";
import {
  incorrectPassword,
  invalidUserId,
  unauthorizedEdit,
  unauthorizedAccess,
  userDidNotUpdate,
} from "../util/errors";
import HTTPRequestError from "../util/httpError";

const BCRYPT_SALT_ROUNDS = config.bcrypt.saltRounds;

// TODO: set to admin access
// @desc getUsers
// @route GET /user
// @access Private
export const getUsers: RequestHandler = async (req, res) => {
  const query = req.query;
  const id: string = query.id as string;
  try {
    if (id && !ObjectId.isValid(id)) {
      throw invalidUserId;
    }
    const users = await User.find(query);
    if (!users) return res.status(200).send([]);
    return res.status(200).json(users);
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// @desc getUserById
// @route GET /user/:id
// @access Private
export const getUserById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const user = (req as GetUserAuthRequest).user as IUser;
  try {
    if (id && !ObjectId.isValid(id)) throw invalidUserId;
    if (id && user && id !== user._id.toString()) throw unauthorizedAccess;
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).send(error);
  }
};

// @desc createUser
// @route POST /user
// @access Public
export const createUser: RequestHandler = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    return res.status(201).send(newUser);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validatorError = validatorFormatter(error, "user");
      error.message = validatorError.message;
      return res.status(400).json(validatorError);
    }
    return res.status(500).send(error);
  }
};

// @desc deleteUser
// @route DELETE /user
// @access Private
export const deleteUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const user = (req as GetUserAuthRequest).user;
  try {
    if (id && !ObjectId.isValid(id)) throw invalidUserId;
    if (user && id && id !== user._id.toString()) throw unauthorizedEdit;
    const deletedUser = await User.findOneAndDelete({ _id: id });
    return res.status(200).send(deletedUser);
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// @desc updateUser
// @route PUT /user
// @access Private
export const updateUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const user = (req as GetUserAuthRequest).user as IUser;
  try {
    if (id && !ObjectId.isValid(id)) throw invalidUserId;
    if (id && user && id !== user._id.toString()) throw unauthorizedEdit;
    const updatedUser = await User.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) throw userDidNotUpdate;
    return res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validatorError = validatorFormatter(error, "user");
      error.message = validatorError.message;
      return res.status(400).json(validatorError);
    }
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// @desc updateUserPartial
// @route PATCH /user
// @access Private
export const updateUserPartial: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, ...fields } = req.body;
  const user = (req as GetUserAuthRequest).user;
  console.log(req.body);
  try {
    if (id && !ObjectId.isValid(id))  throw invalidUserId;
    if (user && id && id !== user._id.toString()) throw unauthorizedEdit;
    if (user && currentPassword) {
      const passwordMatches = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!passwordMatches) throw incorrectPassword;
      const hashedPassword = await bcrypt.hash(
        fields.password,
        BCRYPT_SALT_ROUNDS
      );
      fields["password"] = hashedPassword;
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { $set: fields },
      {
        runValidators: true,
      }
    );
    console.log(req.body, updateUser);
    return res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validatorError = validatorFormatter(error, "user");
      error.message = validatorError.message;
      return res.status(400).json(validatorError);
    }
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};
