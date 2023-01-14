import { Schema } from "mongoose";
import { numberValidator, wholeNumberValidator } from "../util";

export interface IPopulatedCartItem {
  _id: Schema.Types.ObjectId | string,
  productId: string,
  imgUrl: string,
  name: string
}

export interface ICartItem {
  _id?: Schema.Types.ObjectId | string,
  cartId: Schema.Types.ObjectId | string,
  productId: Schema.Types.ObjectId | string | IPopulatedCartItem,
  unitPrice: number,
  quantity: number,
}

export const cartItemSchema = new Schema<ICartItem>({
  cartId: {
    type: Schema.Types.ObjectId,
    ref: "Cart",
    required: [true, "The cart id is required."],
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "The product id is required."],
  },
  unitPrice: {
    type: Number,
    min: [0, "The unit price cannot less than 0."],
    required: [true, "The unit price is required."],
  },
  quantity: {
    type: Number,
    default: 1,
    min: [1, "The quantity cannot less than 1."],
    required: [true, "The quantity is required."],
  },
});

//Cart Item Validation
cartItemSchema
  .path("unitPrice")
  .validate(
    (unitPrice: any) => numberValidator(unitPrice),
    "The unit price is not a number."
  );
cartItemSchema
  .path("quantity")
  .validate(
    (quantity: any) => numberValidator(quantity),
    "The quantity is not a number."
  );
cartItemSchema
  .path("quantity")
  .validate(
    (quantity: any) => wholeNumberValidator(quantity),
    "The quantity is not a whole number."
  );