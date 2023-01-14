import mongoose, { Schema, model } from "mongoose";

export interface IUserLike {
  _id: mongoose.Schema.Types.ObjectId | string;
  productId: mongoose.Schema.Types.ObjectId | string;
}

export interface ILike {
  _id?: mongoose.Schema.Types.ObjectId | string;
  productId: mongoose.Schema.Types.ObjectId | string;
  userId: mongoose.Schema.Types.ObjectId | string;
  createdAt?: Date;
  lastModified?: Date;
}

const likeSchema = new Schema<ILike>({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
    required: [true, "The user id is required."],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
    required: [true, "The user id is required."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: [true, "The like/'s creation date cannot be modified."],
  },
  lastModified: { type: Date, default: Date.now },
});

//  Middleware: that takes care of time stamps
likeSchema.pre("save", function (next) {
  const now = new Date();
  this.lastModified = now;
  if (!this.createdAt) this.createdAt = now;
  next();
});

export const Like = model<ILike>("Like", likeSchema);
