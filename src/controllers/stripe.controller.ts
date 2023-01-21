import { PaymentIntent, StripeError } from "@stripe/stripe-js";
import { RequestHandler } from "express-serve-static-core";
import Stripe from "stripe";
import HTTPRequestError from "../util/httpError";
import {
  cartNotFound,
  paymentIntentNotFound,
  paymentMethodNotFound,
  stripePaymentFailed,
} from "../util/errors";
import { calculateAmount, generateEightNumbers } from "../util";
import { IOrder } from "../models/order";
import API_ORDER from "../api/order";
import { Cart } from "../models/cart";

const STRIPE_SECRET = process.env.STRIPE_SECRET as string;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;
const PUBLIC_URL = process.env.PUBLIC_URL as string;

type PaymentIntentMeta = PaymentIntent & { metadata: Object };
type OrderMeta = {
  orderId: string;
  userId: string;
  paymentId: string;
  items: string;
  billingAddress: string;
  shippingAddress: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
};

const stripe = new Stripe(STRIPE_SECRET, {
  apiVersion: "2022-11-15",
});

const handleSuccessfulPaymentIntent = async (paymentIntent: PaymentIntent) => {
  const { metadata } = paymentIntent as PaymentIntentMeta;
  const { billingAddress, shippingAddress, items, ...rest } =
    metadata as OrderMeta;
  const billingAddressObj = JSON.parse(billingAddress);
  const shippingAddressObj = JSON.parse(shippingAddress);
  const itemsObj = JSON.parse(items);
  const orderId = generateEightNumbers();
  const order: IOrder = {
    ...rest,
    orderId,
    items: itemsObj,
    billingAddress: billingAddressObj,
    shippingAddress: shippingAddressObj,
    paymentStatus: "Paid",
    status: "Not Shipped",
  };
  try {
    // create order
    const completedOrder = await API_ORDER.createOrder(order);
    if(completedOrder instanceof HTTPRequestError) throw completedOrder;
    await stripe.paymentIntents.update(paymentIntent.id, {
      metadata: { orderId: completedOrder._id?.toString() as string },
    });

    // clear cart
    const cart = await Cart.findOne({ userId: rest.userId });
    if (!cart) throw cartNotFound;
    cart.items = [];
    cart.shippingCost = 0;
    cart.tax = 0;
    cart.total = 0;
    await cart.save();
  } catch (error) {
    if(error instanceof HTTPRequestError) {
      const httpError = error as HTTPRequestError;
      // console.log(httpError, httpError.errors)
    }
    // console.log(error);
  }
  return;
};

// @desc config
// @route GET /config
// @access Private
export const config: RequestHandler = async (req, res) => {
  const STRIPE_PUBLISHABLE = process.env.STRIPE_PUBLISHABLE;
  return res.status(200).json({ STRIPE_PUBLISHABLE });
};

// @desc createPaymentIntent
// @route POST /create-payment-intent
// @access Private
export const createPaymentIntent: RequestHandler = async (req, res) => {
  const { amount, metadata } = req.body;
  try {
    const stripeAmount = calculateAmount(amount);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: stripeAmount,
      currency: "usd",
      payment_method_types: ["card"],
      metadata: metadata || {},
    });
    if (!paymentIntent) throw stripePaymentFailed;
    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentId: paymentIntent.id,
    });
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(500).json(error);
    }
    return res.status(500).json((error as Error).message);
  }
};

// @desc confirmPaymentIntent
// @route POST /confirm-payment-intent
// @access Private
export const confirmPaymentIntent: RequestHandler = async (req, res) => {
  const { paymentId, params } = req.body;
  const confirmParams = {
    ...params,
    return_url: `${PUBLIC_URL}/checkout/complete`,
  };
  try {
    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(
      paymentId,
      confirmParams
    );
    if (!confirmedPaymentIntent) throw stripePaymentFailed;
    // console.log("confirmed", confirmedPaymentIntent);
    return res.status(200).json({
      clientSecret: confirmedPaymentIntent.client_secret,
      paymentId: confirmedPaymentIntent.id,
    });
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(500).json(error);
    }
    return res.status(500).json((error as Error).message);
  }
};

// @desc updatePaymentIntent
// @route POST /update-payment-intent
// @access Private
export const updatePaymentIntent: RequestHandler = async (req, res) => {
  const { paymentId, params } = req.body;
  try {
    const updatedPaymentIntent = await stripe.paymentIntents.update(
      paymentId,
      params
    );
    if (!updatedPaymentIntent) throw stripePaymentFailed;
    // console.log("updated", updatedPaymentIntent);
    return res.status(200).json({
      clientSecret: updatedPaymentIntent.client_secret,
      paymentId: updatedPaymentIntent.id,
    });
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(500).json(error);
    }
    return res.status(500).json((error as Error).message);
  }
};

// @desc cancelPaymentIntent
// @route POST /cancel-payment-intent
// @access Private
export const cancelPaymentIntent: RequestHandler = async (req, res) => {
  const { paymentId } = req.body;
  try {
    const cancelledPayment = await stripe.paymentIntents.cancel(paymentId);
    // console.log("cancel", cancelledPayment);
    return res.status(200).json({
      clientSecret: cancelledPayment.client_secret,
      paymentId: cancelledPayment.id,
    });
  } catch (error) {
    return res.status(500).json((error as Error).message);
  }
};

// @desc retrievePaymentIntent
// @route POST /retrieve-payment-intent
// @access Private
export const retrievePaymentIntent: RequestHandler = async (req, res) => {
  const { paymentId } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
    if(!paymentIntent) throw paymentIntentNotFound;
    return res.status(200).json(paymentIntent);
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).json((error as Error).message);
  }
};

// @desc retrievePaymentMethod
// @route POST /retrieve-payment-method
// @access Private
export const retrievePaymentMethod: RequestHandler = async (req, res) => {
  const { paymentMethodId } = req.body;
  try {
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    if(!paymentMethod) throw paymentMethodNotFound;
    return res.status(200).json(paymentMethod);
  } catch (error) {
    if (error instanceof HTTPRequestError) {
      return res.status(error.status).send(error);
    }
    return res.status(500).json((error as Error).message);
  }
};

// @desc refund
// @route POST /refund
// @access Private
export const refund: RequestHandler = async (req, res) => {
  const charge = req.body.chargeId as string;
  const amount = req.body.amount as number;
  try {
    const params = {charge, amount};
    await stripe.refunds.create(params);
    return res.status(200).json({ refund: "success"});
  } catch (error) {
    return res.status(500).json((error as Error).message);
  }
};

// @desc webhook
// @route POST /webhook
// @access Private
export const webhook: RequestHandler = async (req, res) => {
  const sig = (req.headers["stripe-signature"] || "") as string;
  const stripePayload = (req as any).rawBody;
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      stripePayload,
      sig.toString(),
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${(err as StripeError).message}`);
    return;
  }

  // Handle the Stripe webhook events
  let paymentIntent: PaymentIntent;
  switch (event.type) {
    case "payment_intent.succeeded":
      paymentIntent = event.data.object as PaymentIntent;
      handleSuccessfulPaymentIntent(paymentIntent);
      break;
    default:
      console.log(`Unhandled Stripe event type: ${event.type}`);
      return res.status(400).end();
  }

  // Return a 200 response to acknowledge receipt of the event
  return res.status(200).json({ receieved: true });
};
