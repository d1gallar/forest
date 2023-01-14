import jwt, {TokenExpiredError} from "jsonwebtoken";
import { RequestHandler, Request } from "express";
import { IUser, User } from "../models/user";
import { Schema } from "mongoose";
import { invalidTokenError, missingTokenError, userAbandonedToken } from "../util/errors";
import config from "../config/config";
import { formatDate } from "../util";

export interface GetUserAuthRequest extends Request {
  user: (IUser & Required<{ _id: string | Schema.Types.ObjectId }>) | null;
}

const JWT_ACCESS_SECRET = config.jwt.accessSecret;

export const userAuth: RequestHandler = async (req, res, next) => {
  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    return res.status(401).json(invalidTokenError);
  }
  const bearerHeader = req.headers.authorization;
  try {
    const token: string = bearerHeader.replace("Bearer ", "");
    if (!token) return res.status(401).json(missingTokenError);
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as {
      id: Schema.Types.ObjectId | string,
      exp: number
    };
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).send(userAbandonedToken);
    (req as GetUserAuthRequest).user = user;
    next();
  } catch (error) {
    if(error instanceof TokenExpiredError){
      const expiredDate = formatDate(new Date(error.expiredAt));
      const expiredTokenError = {
        success: false,
        type: "AUTH_ERROR",
        message: "Failed to authenticate user.",
        errors: {accessToken: `Expired token. Expired at ${expiredDate}.`}
      }
      return res.status(401).json(expiredTokenError);
    }
    return res.status(500).send(error);
  }
};
