import { Schema, model, Document } from "mongoose";
import validator from "validator";

import {
  hasDigit,
  hasLowercase,
  hasOneUpperCase,
  hasEightChars,
  isValidPhone,
} from "../util";
import { Address } from "./address";
import { Cart } from "./cart";

export type IUserLoad = IUser | null;

export interface IUserTokenized {
  _id: Schema.Types.ObjectId | string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface IUser extends Document {
  _id: Schema.Types.ObjectId | string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  createdAt?: Date;
  lastModified: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Email is required."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
      required: [true, "First name is required."],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "Last name is required."],
    },
    phoneNumber: { type: String, trim: true },
    createdAt: { type: Date, default: () => Date.now(), immutable: true },
    lastModified: { type: Date, default: () => Date.now() },
  },
  { virtuals: true }
);

// User Virtuals
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// User Validators
userSchema.path("email").validate(async (email: string) => {
  const count = await User.countDocuments({ email });
  return !count;
}, "This email already exists!");
userSchema
  .path("email")
  .validate(
    (email: string) => validator.isEmail(email),
    "The email is not a valid email."
  );
userSchema
  .path("password")
  .validate(
    (password: string) => hasEightChars(password),
    "Requires a minimum of 8 characters."
  );
userSchema
  .path("password")
  .validate(
    (password: string) => hasOneUpperCase(password),
    "Requires at least one uppercase character."
  );

userSchema
  .path("password")
  .validate(
    (password: string) => hasLowercase(password),
    "Requires at least one lowercase character."
  );

userSchema
  .path("password")
  .validate(
    (password: string) => hasDigit(password),
    "Requires at least one number."
  );

userSchema
  .path("phoneNumber")
  .validate(
    (phoneNumber: string) => isValidPhone(phoneNumber),
    "Invalid phone number."
  );

//  User Middleware: that takes care of time stamps + hashing passwords
userSchema.pre("save", function (next) {
  const now = new Date();
  const user = this;

  user.lastModified = now;
  if (!user.createdAt) user.createdAt = now;
  next();
});

// User Middleware: removes their cart & addresses when user is deleted
userSchema.pre('findOneAndDelete',{document: true, query: true}, async function(next) {
  const userId = this.getFilter()["_id"];
  await Cart.deleteMany({userId});
  await Address.deleteMany({userId});
  next();
});

export const User = model<IUser>("User", userSchema);
