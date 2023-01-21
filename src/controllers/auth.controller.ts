import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import mongoose, { Schema } from "mongoose";
import config from "../config/config";
import { GetUserAuthRequest } from "../middleware/auth";
import { IUser, User } from "../models/user";
import { Cart, ICart } from "../models/cart";
import {
  IFormError,
  validatorFormatter,
} from "../util/mongooseValidator";
import {
  invalidCookieAuth,
  invalidLoginAuth,
  missingFieldAuth,
  userAbandonedToken,
  userNotFound,
} from "../util/errors";
import HTTPRequestError from "../util/httpError";

const JWT_ACCESS_SECRET = config.jwt.accessSecret;
const JWT_REFRESH_SECRET = config.jwt.refreshSecret;
const BCRYPT_SALT_ROUNDS = config.bcrypt.saltRounds;
const BASE_URL = config.server.baseUrl;
const ACCESS_EXPIRES_IN = "2h";
const REFRESH_EXPIRES_IN = "1h";
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export const generateAccessToken = (user: IUser) => {
  return jwt.sign({ id: user._id.toString() }, JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  });
};

// ROUTES

// @desc login
// @route GET /auth/login
// @access Public
export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Backend form validation
    let errors: IFormError = {};
    if (!email) errors["email"] = "Email is required";
    if (!password) errors["password"] = "Password is required";
    if (Object.entries(errors).length > 0) {
      missingFieldAuth.errors = errors;
      throw missingFieldAuth;
    }
    const user = await User.findOne({ email });
    if (!user) throw invalidLoginAuth;
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw invalidLoginAuth;

    // Generate auth tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(
      { id: user._id.toString() },
      JWT_ACCESS_SECRET,
      {
        expiresIn: REFRESH_EXPIRES_IN,
      }
    );
    // console.log("access", accessToken, "refresh", refreshToken);

    // Creates secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      // secure: true,
      domain: BASE_URL,
      maxAge: REFRESH_MAX_AGE,
    });

    return res.status(200).json({ accessToken, user});
  } catch (error) {
    // Mongoose Validation Error
    if (error instanceof mongoose.Error.ValidationError) {
      const validatorError = validatorFormatter(
        error,
        "auth"
      ) as HTTPRequestError;
      error.message = validatorError.message;
      return res.status(400).json(validatorError);
    }
    if(error instanceof HTTPRequestError){
      return res.status(error.status).send(error);
    }
    return res.status(500).json((error as Error).message);
  }
};

// @desc register
// @route GET /auth/register
// @access Public
export const register: RequestHandler = async (req, res) => {
  const { password, ...rest } = req.body;
  // console.log(req.body);
  try {
    // Mongoose Validations
    const validateError = new User(req.body).validateSync();
    if (validateError) throw validateError;

    // Create user and their cart
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const user: IUser = new User({ password: hashedPassword, ...rest });
    const userId = user._id.toString();
    const count = await Cart.countDocuments({ userId });
    if (count === 0) {
      const cart: ICart = new Cart({
        userId,
        items: [],
        subtotal: 0,
        shippingCost: 0,
        tax: 0,
        total: 0,
      });
      await cart.save();
    }
    await user.save();

    // Generate Access Token
    const accessToken = generateAccessToken(user);
    return res.status(200).send({ accessToken });
  } catch (error) {
    // console.log(error);
    // Mongoose Validation Error
    if (error instanceof mongoose.Error.ValidationError) {
      const validatorError = validatorFormatter(
        error,
        "auth"
      ) as HTTPRequestError;
      error.message = validatorError.message;
      return res.status(400).json(validatorError);
    }
    return res.status(500).json((error as Error).message);
  }
};

// @desc getUserId
// @route GET /auth/userId
// @access Private
export const getUserId: RequestHandler = async (req, res) => {
  const request = req as GetUserAuthRequest;
  try {
    const user = request.user as IUser;
    if (!user) throw userNotFound;
    return res.status(200).send(user._id.toString());
  } catch (error) {
    if(error instanceof HTTPRequestError){
      return res.status(error.status).send(error);
    }
    return res.status(500).send((error as Error).message);
  }
};

// @desc refresh
// @route GET /auth/refresh
// @access Public
export const refresh: RequestHandler = async (req, res) => {
  const refreshToken = req.cookies.jwt;
  try {
    if (!refreshToken) throw invalidCookieAuth;
    const decoded = (await jwt.verify(refreshToken, JWT_REFRESH_SECRET)) as {
      id: Schema.Types.ObjectId | string;
      exp: number;
    };
    const user = await User.findById(decoded.id);
    if (!user) throw userAbandonedToken;
    const accessToken = jwt.sign(
      {
        id: user._id.toString(),
      },
      JWT_ACCESS_SECRET,
      {
        expiresIn: "1d",
      }
    );
    return res.status(200).json({ accessToken });
  } catch (error) {
    if(error instanceof HTTPRequestError){
      return res.status(error.status).send(error);
    }
    return res.status(401).send(error);
  }
};

// @desc logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
export const logout: RequestHandler = async (req, res) => {
  const refreshToken = req.cookies.jwt;
  if (!refreshToken) return res.sendStatus(204); // No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  res.status(200).json({ success: true, message: "Cookie cleared." });
};
