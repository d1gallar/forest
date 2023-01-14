import mongoose, { Schema, model } from "mongoose";
import { numberValidator, stringValidator } from "../util";
import { addressMinifiedSchema, IAddressMinified } from "./address";
import { IOrderItem, orderItemSchema } from "./orderItem";

export type IOrderLoad = IOrder | null;

export interface IOrder {
  _id?: Schema.Types.ObjectId | string;
  orderId: string;
  userId: mongoose.Schema.Types.ObjectId | string;
  paymentId: string;
  paymentStatus: string;
  status: string;
  items: Array<IOrderItem>;
  billingAddress: IAddressMinified;
  shippingAddress: IAddressMinified;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  carrier?: string;
  tracking?: string;
  createdAt?: Date;
}

const orderSchema = new Schema<IOrder>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
    required: [true, "The user id is required."],
  },
  orderId: {
    type: String,
    trim: true,
    required: [true, "The order id is required."],
  },
  paymentId: {
    type: String,
    required: [true, "The payment id is required"],
  },
  paymentStatus: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    trim: true,
  },
  items: {
    type: [orderItemSchema],
    required: [true, "The order must include at least one product."],
  },
  billingAddress: {
    type: addressMinifiedSchema,
    required: [true, "The billing address is required."],
  },
  shippingAddress: {
    type: addressMinifiedSchema,
    required: [true, "The shipping address is required."],
  },
  carrier: {
    type: String,
    trim: true,
  },
  tracking: {
    type: String,
    trim: true,
  },
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
    default: () => Date.now(),
    immutable: true,
  },
});

// Order Validation
orderSchema
  .path("orderId")
  .validate(
    (userId: any) => stringValidator(userId),
    "The order id must be a string."
  );
orderSchema
  .path("paymentId")
  .validate(
    (paymentStatus: any) => stringValidator(paymentStatus),
    "The payment status must be a string."
  );
orderSchema
  .path("paymentStatus")
  .validate(
    (paymentStatus: any) => stringValidator(paymentStatus),
    "The payment status must be a string."
  );
orderSchema
  .path("status")
  .validate(
    (status: any) => stringValidator(status),
    "The order status must be a string."
  );
orderSchema
  .path("carrier")
  .validate(
    (carrier: any) => stringValidator(carrier),
    "The carrier must be a string."
  );
orderSchema
  .path("tracking")
  .validate(
    (tracking: any) => stringValidator(tracking),
    "The tracking number must be a string."
  );
orderSchema
  .path("subtotal")
  .validate(
    (subtotal: any) => numberValidator(subtotal),
    "The subtotal is not a number."
  );
orderSchema
  .path("shippingCost")
  .validate(
    (shippingCost: any) => numberValidator(shippingCost),
    "The shipping cost is not a number."
  );
orderSchema
  .path("tax")
  .validate((tax: any) => numberValidator(tax), "The tax is not a number.");
orderSchema
  .path("total")
  .validate(
    (total: any) => numberValidator(total),
    "The cart's total is not a number."
  );

//  Middleware: that takes care of time stamps
orderSchema.pre("save", function (next) {
  const now = new Date();
  if (!this.createdAt) this.createdAt = now;
  next();
});

export const Order = model<IOrder>("Order", orderSchema);
