import HTTPRequestError from "./httpError";

export const productDidNotUpdate = new HTTPRequestError(
  400,
  "UPDATE_ERROR",
  "The product was not found and failed to update.",
  { product: "The product was not found." },
);

export const invalidProductId = new HTTPRequestError(
  400,
  "VALIDATION_ERROR",
  "Failed to get the product since the product id is invalid.",
  { _id: "Invalid product id." },
);

export const productNotFound = new HTTPRequestError(
  404,
  "NOTFOUND_ERROR",
  "This product could not be found.!",
  { product: "The product could not be found." }
);

export const productNotInCart = new HTTPRequestError(
  404,
  "UPDATE_ERROR",
  "This product could not be found in the cart and failed to update!",
  { product: "The product could not be found." }
);

export const userDidNotUpdate = new HTTPRequestError(
  204,
  "UPDATE_ERROR",
  "This user could not be found and did not update!",
  { user: "The user could not be found." }
);

export const unauthorizedEdit = new HTTPRequestError(
  401,
  "AUTH_ERROR",
  "You do not have permission to modify this resource.",
  { accessToken: "Invalid access." }
);

export const unauthorizedAccess = new HTTPRequestError(
  401,
  "AUTH_ERROR",
  "You do not have permission to access this resource.",
  { accessToken: "Invalid access." }
);

export const cartDidNotUpdate = new HTTPRequestError(
  204,
  "UPDATE_ERROR",
  "The cart was not found and failed to update.",
  { cart: "The cart was not found." },
);

export const invalidCartId = new HTTPRequestError(
  400,
  "NOTFOUND_ERROR",
  "The cart id is invalid.",
  { id: "The cart id is invalid." },
);

export const cartNotFound = new HTTPRequestError(
  404,
  "NOTFOUND_ERROR",
  "The cart does not exist.",
  { cart: "The cart was not found." },
);

export const invalidCookieAuth = new HTTPRequestError(
  401,
  "AUTH_ERROR",
  "The cookie is invalid.",
  { refreshToken: "Invalid refresh token." },
);

export const userAbandonedToken = new HTTPRequestError(
  404,
  "AUTH_ERROR",
  "The user was not found and this token is now invalid.",
  { accessToken: "Invalid access token." },
);

export let missingFieldAuth = new HTTPRequestError(
  400,
  "VALIDATION_ERROR",
  "Missing field.",
  {},
);

export const invalidLoginAuth = new HTTPRequestError(
  400,
  "AUTH_ERROR",
  "Wrong email or password.",
  { both: "Wrong email or password" },
);

export const userNotFound = new HTTPRequestError(
  404,
  "NOTFOUND_ERROR",
  "The user does not exist",
  { user: "The user can not be found." },
);

export const invalidTokenError = new HTTPRequestError(
  401,
  "AUTH_ERROR",
  "Failed to authenticate user.",
  { accessToken: "Invalid token." },
);

export const missingTokenError = new HTTPRequestError(
  401,
  "AUTH_ERROR",
  "Failed to authenticate user.",
  { accessToken: "Missing token." },
);

export const invalidUserId = new HTTPRequestError(
  400,
  "VALIDATION_ERROR",
  "Failed to get the address since the userId is invalid.",
  { userId: "Invalid user id." },
);

export const invalidAddressId = new HTTPRequestError(
  400,
  "VALIDATION_ERROR",
  "Failed to get the address since the address id is invalid.",
  { _id: "Invalid address id." },
);

export const addressNotFound = new HTTPRequestError(
  404,
  "NOTFOUND_ERROR",
  "This address does not exist!",
  { _id: "Address not found." },
);

export const addressNotCreated = new HTTPRequestError(
  400,
  "NOTCREATED_ERROR",
  "Failed to create the address!",
  { _id: "Address not created." },
);

export const addressNotUpdated = new HTTPRequestError(
  204,
  "UPDATE_ERROR",
  "This address could not be found and did not update!",
  { _id: "Address not found." },
);

export const incorrectPassword = new HTTPRequestError(
  400,
  "VALIDATION_ERROR",
  "Failed to update the user since the password does not match.",
  { currentPassword: "Incorrect password." },
);

export const invalidOrderId = new HTTPRequestError(
  400,
  "VALIDATION_ERROR",
  "Failed to get the order since the order id is invalid.",
  { _id: "Invalid order id." },
);

export const orderNotFound = new HTTPRequestError(
  404,
  "NOTFOUND_ERROR",
  "This order does not exist!",
  { _id: "Order not found." },
);

export const orderNotCreated = new HTTPRequestError(
  400,
  "NOTCREATED_ERROR",
  "Failed to create a order!",
  { _id: "Order not created." },
)

export const orderNotUpdated = new HTTPRequestError(
  204,
  "UPDATE_ERROR",
  "This order could not be found and did not update!",
  { _id: "Order not found." },
);

export const stripePaymentFailed = new HTTPRequestError(
  500,
  "STRIPE_ERROR",
  "The payment failed.",
  {stripe: "Payment failed."}
);

export const paymentIntentNotFound = new HTTPRequestError(
  404,
  "STRIPE_ERROR",
  "This payment intent could not be found!",
  { id: "Payment intent not found." },
);

export const paymentMethodNotFound = new HTTPRequestError(
  404,
  "STRIPE_ERROR",
  "This payment method could not be found!",
  { id: "Payment method not found." },
);

export const invalidRefundId = new HTTPRequestError(
  400,
  "VALIDATION_ERROR",
  "Failed to get the refund since the refund id is invalid.",
  { _id: "Invalid refund id." },
)

export const refundNotFound = new HTTPRequestError(
  404,
  "NOTFOUND_ERROR",
  "This refund does not exist!",
  { _id: "Refund not found." },
)

export const refundNotCreated = new HTTPRequestError(
  400,
  "NOTCREATED_ERROR",
  "Failed to create a refund!",
  { _id: "Refund not created." },
);

export const refundNotUpdated = new HTTPRequestError(
  204,
  "UPDATE_ERROR",
  "This refund could not be found and did not update!",
  { _id: "Refund not found." },
);

export const likeNotFound = new HTTPRequestError(
  404,
  "NOTFOUND_ERROR",
  "This like does not exist!",
  { _id: "Like not found." },
);

export const likeNotCreated = new HTTPRequestError(
  400,
  "NOTCREATED_ERROR",
  "Failed to create a like!",
  { _id: "Like was not created." },
);

export const invalidLikeId = new HTTPRequestError(
  400,
  "VALIDATION_ERROR",
  "Failed to get the like since the like id is invalid.",
  { _id: "Invalid like id." },
);

export const likeDidNotUpdate = new HTTPRequestError(
  400,
  "VALIDATION_ERROR",
  "Failed to get the like since the like id is invalid.",
  { _id: "Invalid like id." },
);

export const likeDuplicate = new HTTPRequestError(
  400,
  "NOTCREATED_ERROR",
  "A duplicate like already exists.",
  { userId: "This like already exists." },
);