import { Schema, model } from "mongoose";
import { stringValidator } from "../util";

export interface IRefund {
  _id?: Schema.Types.ObjectId | string;
  orderId: Schema.Types.ObjectId | string;
  userId: Schema.Types.ObjectId | string;
  paymentId: string;
  reason: string;
}

export const refundSchema = new Schema<IRefund>({
  orderId: {
    type:  Schema.Types.ObjectId,
    required: [true, "The order id is required."],
  },
  userId: {
    type:  Schema.Types.ObjectId,
    required: [true, "The user id is required."],
  },
  paymentId: {
    type: String,
    required: [true, "The payment id is required."]
  },
  reason: {
    type: String,
    required: [true, "A reason is required for this refund."]
  }
});

// Refund Validation
refundSchema
  .path("reason")
  .validate(
    (reason: any) => stringValidator(reason),
    "The reason must be a string."
  );

export const Refund = model<IRefund>("Refund", refundSchema);
