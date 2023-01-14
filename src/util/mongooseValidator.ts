import mongoose from "mongoose";
import HTTPRequestError from "./httpError";

export const validatorFormatter = (
  error: mongoose.Error.ValidationError,
  modelType: string
) => {
  let errorObj: { [key: string]: string } = {};
  Object.entries(error.errors).forEach(([key, value]) => {
    errorObj[key] = value.message;
  });
  return new HTTPRequestError(
    400,
    "VALIDATION_ERROR",
    `Could not update ${modelType} due to some invalid fields!`,
    errorObj
  );
};

export interface IFormError {
  [key: string]: string;
}
