import { Schema, model } from "mongoose";
import {
  numberValidator,
  stringValidator,
  wholeNumberValidator,
} from "../util";

export interface IOrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
}

export const orderItemSchema = new Schema<IOrderItem>({
  productId: {
    type: String,
    trim: true,
    required: [true, "The product id is required."],
  },
  quantity: {
    type: Number,
    min: [0, "The quantity must be a positive number."],
    required: [true, "The quantity is required."],
  },
  unitPrice: {
    type: Number,
    min: [0, "The product unit price must be a positive number."],
    required: [true, "The product unit price is required."],
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, "The discount must be a positive number."],
  },
});

// OrderItem Validation
orderItemSchema
  .path("productId")
  .validate(
    (productId: any) => stringValidator(productId),
    "The product id must be a string."
  );
orderItemSchema
  .path("quantity")
  .validate(
    (quantity: any) => numberValidator(quantity),
    "The quantity must be a number."
  );
orderItemSchema
  .path("quantity")
  .validate(
    (quantity: any) => wholeNumberValidator(quantity),
    "The quantity must be a whole number."
  );
orderItemSchema
  .path("unitPrice")
  .validate(
    (price: any) => numberValidator(price),
    "The unit price must be a number."
  );
orderItemSchema
  .path("discount")
  .validate(
    (discount: any) => numberValidator(discount),
    "The discount must be a number."
  );

export const OrderItem = model<IOrderItem>("OrderItem", orderItemSchema);
