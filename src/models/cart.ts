import { Schema, model, Document } from "mongoose";
import { cartItemSchema, ICartItem } from "./cartItem";
import {
  calculateItemSubTotal,
  calculateTax,
  calculateTotal,
  numberValidator,
} from "../util";

const AVG_SHIPPING_COST = 3.99;
const TAX_RATE = 0.0775;

export type ICartLoad = ICart | null;

export interface ICart extends Document {
  _id: Schema.Types.ObjectId | string;
  userId: Schema.Types.ObjectId | string;
  items: ICartItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  createdAt?: Date;
  lastModified?: Date;
}

const cartSchema = new Schema<ICart>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "The user id is required."],
  },
  items: [cartItemSchema],
  subtotal: {
    type: Number,
    required: [true, "The subtotal is required."],
    default: 0,
    min: [0, "The subtotal must be a positive number."],
  },
  shippingCost: {
    type: Number,
    required: [true, "The shipping cost is required."],
    default: 0,
    min: [0, "The shipping cost must be a positive number."],
  },
  tax: {
    type: Number,
    required: [true, "The tax is required."],
    default: 0,
    min: [0, "The total must be a positive number."],
  },
  total: {
    type: Number,
    required: [true, "The cart/'s total is required."],
    default: 0,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: [true, "The cart/'s creation date cannot be modified."],
  },
  lastModified: { type: Date, default: Date.now },
});

cartSchema
  .path("subtotal")
  .validate(
    (subtotal: any) => numberValidator(subtotal),
    "The subtotal is not a number."
  );
cartSchema
  .path("shippingCost")
  .validate(
    (shippingCost: any) => numberValidator(shippingCost),
    "The shipping cost is not a number."
  );
cartSchema
  .path("tax")
  .validate((tax: any) => numberValidator(tax), "The tax is not a number.");
cartSchema
  .path("total")
  .validate(
    (total: any) => numberValidator(total),
    "The cart's total is not a number."
  );

//  Middleware: that takes care of time stamps
cartSchema.pre("save", function (next) {
  this.lastModified = new Date();
  next();
});

// Middleware: that recalculates the total, tax, shipping, etc
cartSchema.pre("save", function (next) {
  if (
    this.items.length === 0 &&
    this.tax === 0 &&
    this.shippingCost === 0 &&
    this.subtotal === 0 &&
    this.total === 0
  )
    return next();
  let subtotal = 0;
  this.items.forEach((item) => {
    const itemSubtotal = calculateItemSubTotal(item.quantity, item.unitPrice);
    subtotal += itemSubtotal;
  });
  this.subtotal = subtotal;
  this.shippingCost = AVG_SHIPPING_COST;
  this.tax = calculateTax(this.subtotal, TAX_RATE);
  this.total = calculateTotal(this.subtotal, this.shippingCost, this.tax);
  return next();
});

export const Cart = model<ICart>("Cart", cartSchema);
