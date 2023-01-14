import { RequestHandler } from "express";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { Like } from "../models/likes";
import { validatorFormatter } from "../util/mongooseValidator";
import { GetUserAuthRequest } from "../middleware/auth";
import HTTPRequestError from "../util/httpError";
import {
  invalidLikeId,
  invalidProductId,
  invalidUserId,
  likeDidNotUpdate,
  likeDuplicate,
  likeNotCreated,
  likeNotFound,
  unauthorizedAccess,
  unauthorizedEdit,
} from "../util/errors";
import { IUser } from "../models/user";
import { IProduct } from "../models/product";

// TODO: set to admin access
// @desc getLikes
// @route GET /like
// @access Private
export const getLikes: RequestHandler = async (req, res) => {
  const query = req.query;
  const id: string = query.id as string;
  const productId: string = query.productId as string;
  const userId: string = query.userId as string;

  try {
    if (id && !ObjectId.isValid(id)) throw invalidLikeId;
    if (productId && !ObjectId.isValid(productId)) throw invalidProductId;
    if (userId && !ObjectId.isValid(userId)) throw invalidProductId;

    const likes = await Like.find(query);
    if (!likes) return res.status(200).send([]);
    return res.status(200).json(likes);
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// @desc getLikeById
// @route GET /like/:id
// @access Private
export const getLikeById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const user = (req as GetUserAuthRequest).user as IUser;
  try {
    if (id && !ObjectId.isValid(id)) throw invalidUserId;
    if (id && user && id !== user._id.toString()) throw unauthorizedAccess;
    const likes = await Like.findById({ _id: id });
    if (!likes) throw likeNotFound;
    return res.status(200).json(likes);
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// @desc createLike
// @route POST /like
// @access Public
export const createLike: RequestHandler = async (req, res) => {
  const productId = req.body.productId as string;
  const userId = req.body.userId as string;

  try {
    const likeToCreate = await Like.findOne({ productId, userId });
    if (likeToCreate) throw likeDuplicate;
    const newLike = new Like(req.body);
    if (!newLike) throw likeNotCreated;
    const savedLike = await newLike.save();
    return res.status(201).send(savedLike);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validatorError = validatorFormatter(error, "like");
      error.message = validatorError.message;
      return res.status(400).json(validatorError);
    }
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// @desc deleteLike
// @route DELETE /like
// @access Private
export const deleteLike: RequestHandler = async (req, res) => {
  const { productId } = req.body;
  const user = (req as GetUserAuthRequest).user as IUser;
  try {
    if (productId && !ObjectId.isValid(productId)) throw invalidProductId;
    if (user._id && !ObjectId.isValid(user._id.toString())) throw invalidUserId;
    const likeToDelete = await Like.findOne({ productId, userId: user._id });
    if (!likeToDelete) return res.status(204).send();
    if (
      user &&
      likeToDelete &&
      likeToDelete.userId.toString() !== user._id.toString()
    )
      throw unauthorizedEdit;
    const deletedLike = await Like.findOneAndDelete({
      _id: likeToDelete._id.toString(),
    });
    return res.status(200).send(deletedLike);
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// @desc updateLike
// @route PUT /like
// @access Private
export const updateLike: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const user = (req as GetUserAuthRequest).user as IUser;
  try {
    if (id && !ObjectId.isValid(id)) throw invalidUserId;
    if (id && user && id !== user._id.toString()) throw unauthorizedEdit;
    const updatedLike = await Like.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedLike) throw likeDidNotUpdate;
    return res.status(200).json(updatedLike);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validatorError = validatorFormatter(error, "like");
      error.message = validatorError.message;
      return res.status(400).json(validatorError);
    }
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

// @desc getUserLikes
// @route GET /like/user/:userId
// @access Private
export const getUserLikes: RequestHandler = async (req, res) => {
  const { userId } = req.params;
  const user = (req as GetUserAuthRequest).user as IUser;
  try {
    if (userId && !ObjectId.isValid(userId)) throw invalidLikeId;
    if (user && userId && userId !== user._id.toString())
      throw unauthorizedAccess;
    const userLikes = await Like.find({ userId: userId }).populate({
      path: "productId",
      model: "Product",
      select:
        "-description -createdAt -lastModified -stockQuantity -price -name -imgUrl -__v",
    });
    const likeMap = userLikes.map((like) => {
      const product = like as { productId: string };
      const { productId } = product;
      return productId;
    });
    return res.status(200).send(likeMap);
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};

export const getUserLikedProducts: RequestHandler = async (req, res) => {
  const user = (req as GetUserAuthRequest).user as IUser;
  try {
    if (user && !ObjectId.isValid(user._id.toString())) throw invalidLikeId;
    const userLikes = await Like.find({ userId: user._id.toString() }).populate(
      {
        path: "productId",
        model: "Product",
        select: "-description -createdAt -lastModified -stockQuantity -__v",
      }
    );
    const likeMap = userLikes.map((like) => {
      const product = like as { productId: string };
      const { productId } = product;
      return productId;
    }) as Partial<IProduct>[];
    return res.status(200).send(likeMap);
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).send(error);
  }
};
