import { Schema, model } from "mongoose";
import { numberValidator, stringValidator } from "../util";

export interface IDiscount {
  _id: { $oid: string };
  name: string;
  description: string;
  discountPercent: number;
  createdAt?: Date;
  lastModified: Date;
}

const discountSchema = new Schema<IDiscount>({
  name: {
    type: String,
    trim: true,
    required: [true, "The discount name is required."],
  },
  description: {
    type: String,
    trim: true,
    required: [true, "The discount description is required."],
  },
  discountPercent: {
    type: Number,
    required: [true, "The discount percent is required."],
    min: [0, "The discount percent must be above 0."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: [true, "The discount/'s creation date cannot be modified."],
  },
  lastModified: { type: Date, default: Date.now },
});

// Discount Validation
discountSchema
  .path("name")
  .validate(
    (name: any) => stringValidator(name),
    "The discount name is not a string."
  );
discountSchema
  .path("description")
  .validate(
    (description: any) => stringValidator(description),
    "The discount's description is not a string."
  );
discountSchema
  .path("discountPercent")
  .validate(
    (discountPercent: any) => numberValidator(discountPercent),
    "The discount percent is not a number."
  );

//  Middleware: that takes care of time stamps
discountSchema.pre("save", function (next) {
  const now = new Date();
  this.lastModified = now;
  if (!this.createdAt) this.createdAt = now;
  next();
});

export const Discount = model<IDiscount>("Discount", discountSchema);
