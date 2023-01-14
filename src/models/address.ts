import { Schema, model } from "mongoose";
import { stringValidator } from "../util";

export interface IAddressMinified {
  fullName: string;
  line_1: string;
  line_2?: string;
  city: string;
  postalCode: string;
  stateProvinceCounty: string;
  country: string;
}

export interface IAddress {
  _id: Schema.Types.ObjectId | string;
  firstName: string;
  lastName: string;
  userId: Schema.Types.ObjectId | string;
  line_1: string;
  line_2?: string;
  city: string;
  postalCode: string;
  stateProvinceCounty: string;
  country: string;
  isDefault: boolean;
}

export const addressMinifiedSchema = new Schema<IAddressMinified>({
  fullName : {
    type: String,
    required: [true, "The full name is required."]
  },
  line_1: {
    type: String,
    trim: true,
    required: [true, "This street address is required."],
  },
  line_2: {
    type: String,
    trim: true,
  },
  city: { type: String, trim: true, required: [true, "The city is required"] },
  postalCode: {
    type: String,
    trim: true,
    required: [true, "The zipcode is required."],
  },
  stateProvinceCounty: {
    type: String,
    trim: true,
    required: [true, "The state is required."],
  },
  country: {
    type: String,
    trim: true,
    required: [true, "The country is required."],
  },
});

const addressSchema = new Schema<IAddress>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  firstName: {
    type: String,
    trim: true,
    required: [true, "The first name is required."],
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, "The last name is required."],
  },
  line_1: {
    type: String,
    trim: true,
    required: [true, "This street address is required."],
  },
  line_2: {
    type: String,
    trim: true,
  },
  city: { type: String, trim: true, required: [true, "The city is required"] },
  postalCode: {
    type: String,
    trim: true,
    required: [true, "The zipcode is required."],
  },
  stateProvinceCounty: {
    type: String,
    trim: true,
    required: [true, "The state is required."],
  },
  country: {
    type: String,
    trim: true,
    required: [true, "The country is required."],
  },
  isDefault: {
    type: Boolean,
    required: [true, "The default address option is required."],
  },
});

// Address Validation
addressSchema
  .path("line_1")
  .validate(
    (line_1: any) => stringValidator(line_1),
    "Address line 1 must be a string."
  );
addressSchema
  .path("line_2")
  .validate(
    (line_2: any) => stringValidator(line_2),
    "Address line 2 must be a string."
  );
addressSchema
  .path("city")
  .validate((city: any) => stringValidator(city), "The city must be a string.");
addressSchema
  .path("postalCode")
  .validate(
    (postalCode: any) => stringValidator(postalCode),
    "The postal code must be a string."
  );
addressSchema
  .path("stateProvinceCounty")
  .validate(
    (stateProvinceCounty: any) => stringValidator(stateProvinceCounty),
    "The state / province / county must be a string."
  );
addressSchema
  .path("country")
  .validate(
    (countryId: any) => stringValidator(countryId),
    "The country must be a string."
  );

export const Address = model<IAddress>("Address", addressSchema);
