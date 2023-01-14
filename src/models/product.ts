import { Schema, model } from "mongoose";
import {
  stringValidator,
  numberValidator,
  wholeNumberValidator,
} from "../util/index";

export type IProductLoad = IProduct | null;

export default interface IProductList {
  products: Array<IProduct>;
}

export interface IProduct {
  _id: Schema.Types.ObjectId | string;
  productId: string;
  imgUrl: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  discountId?: { $oid: string };
  createdAt?: Date;
  lastModified?: Date;
}

const productSchema = new Schema<IProduct>({
  productId: {
    type: String,
    required: [true, "The product id is required."],
    trim: true,
  },
  imgUrl: {
    type: String,
    required: [true, "The image url is required."],
    trim: true,
    minlength: [10, "The image url length must be 10 characters."],
  },
  name: {
    type: String,
    required: [true, "The product name is required."],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "The description is required."],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "The price is required."],
    min: [0, "The price must be a positive number."],
    max: [Number.MAX_SAFE_INTEGER, "The price exceeds the max integer value."],
  },
  stockQuantity: {
    type: Number,
    required: [true, "The quantity is required."],
    min: [0, "The quantity must be a positive number."],
    max: [
      Number.MAX_SAFE_INTEGER,
      "The quantity exceeds the max integer value.",
    ],
  },
  discountId: {
    type: Schema.Types.ObjectId,
    ref: "Discount"
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: [true, "The product/'s creation date cannot be modified."],
  },
  lastModified: { type: Date, default: Date.now },
});

// Product Schema Validators
productSchema
  .path("productId")
  .validate(
    (id: any) => stringValidator(id),
    "The product's id is not a string."
  );
productSchema
  .path("imgUrl")
  .validate(
    (imgUrl: any) => stringValidator(imgUrl),
    "The product's image url is not a string."
  );
productSchema
  .path("name")
  .validate(
    (name: any) => stringValidator(name),
    "The product's name is not a string."
  );
productSchema
  .path("description")
  .validate(
    (description: any) => stringValidator(description),
    "The product's description is not a string."
  );
productSchema
  .path("price")
  .validate(
    (price: any) => numberValidator(price),
    "The product's price is not a number."
  );
productSchema
  .path("stockQuantity")
  .validate(
    (stockQuantity: any) => numberValidator(stockQuantity),
    "The product's stock quantity is not a number."
  );
productSchema
  .path("stockQuantity")
  .validate(
    (stockQuantity: any) => wholeNumberValidator(stockQuantity),
    "The product's stock quantity is not a whole number."
  );

//  Middleware: that takes care of time stamps
productSchema.pre("save", function (next) {
  const now = new Date();
  this.lastModified = now;
  if (!this.createdAt) this.createdAt = now;
  next();
});

export const Product = model<IProduct>("Product", productSchema);