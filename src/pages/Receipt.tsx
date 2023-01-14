import { PaymentIntent, PaymentMethod } from "@stripe/stripe-js";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import CancelOrderModal from "../components/CancelOrderModal";
import PageContainer from "../components/PageContainer";
import CardBrand from "../components/CardBrand";
import OrderItem from "../components/OrderItem";
import Heading from "../components/Heading";
import Modal from "../components/Modal";
import Page from "../components/Page";
import { IOrder, IOrderLoad } from "../models/order";
import { IRefund } from "../models/refund";
import { formatDateToWMDY, toTitleCase } from "../util";
import HTTPRequestError from "../util/httpError";
import API_REFUND from "../api/refund";
import API_ORDER from "../api/order";
import API_STRIPE from "../api/stripe";
import API_AUTH from "../api/auth";
import Loader from "../components/Loader";

type ReceiptState = {
  isFetching: boolean;
  order: IOrderLoad;
  userId: string;
  paymentIntent: PaymentIntent | null;
  card: PaymentMethod.Card | null;
  isModalInView: boolean;
  cancelReason: string;
  error: HTTPRequestError | null;
};

// TODO: if order can not be found display it to the user!
export default class Receipt extends Component<{}, ReceiptState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isFetching: false,
      order: null,
      userId: "",
      paymentIntent: null,
      card: null,
      isModalInView: false,
      cancelReason: "",
      error: null,
    };

    this.cancelOrder = this.cancelOrder.bind(this);
    this.closeCancelModal = this.closeCancelModal.bind(this);
    this.openCancelModal = this.openCancelModal.bind(this);
    this.updateCancelReason = this.updateCancelReason.bind(this);
  }

  updateCancelReason(cancelReason: string) {
    this.setState({ cancelReason });
  }

  async cancelOrder() {
    const { paymentIntent } = this.state;
    if (!paymentIntent) return;

    // Finds the charge id, amount, and order id
    const chargeId = (paymentIntent as PaymentIntent & { latest_charge: any })
      .latest_charge;
    const { amount } = paymentIntent;
    const orderId = (
      paymentIntent as PaymentIntent & { metadata: { orderId: string } }
    ).metadata.orderId;

    this.setState({ isFetching: true });
    try {
      // updates the order in database
      const updatedOrder = await API_ORDER.updateOrderPartial(orderId, {
        paymentStatus: "Refunded",
        status: "Cancelled",
      });
      if (updatedOrder instanceof HTTPRequestError) throw updatedOrder;
      const order = updatedOrder as IOrder;
      this.setState({ order });

      // creates a refund in database + stripe refund
      const newRefund: IRefund = {
        orderId,
        paymentId: order.paymentId,
        userId: this.state.userId,
        reason: this.state.cancelReason,
      };
      await API_REFUND.createRefund(newRefund);
      await API_STRIPE.refund(chargeId, amount);
    } catch (error) {
      const axiosError = error as { response: { data: any } };
      if (axiosError.response) {
        const httpError = axiosError.response?.data as HTTPRequestError;
        this.setState({ error: httpError });
      }
    }
    this.setState({ isFetching: false });
  }

  openCancelModal() {
    this.setState({ isModalInView: true });
  }
  closeCancelModal() {
    this.setState({ isModalInView: false });
  }

  async componentDidMount() {
    this.setState({ isFetching: true });
    const userId = await API_AUTH.getUserId();
    if (typeof userId === "string") this.setState({ userId });
    else this.setState({ error: userId as HTTPRequestError });
    const orderId = window.location.href.split("/").pop()?.toString() as string;
    const order = await API_ORDER.getOrderById(orderId);
    if (!(order as IOrder)._id) {
      this.setState({ error: order as HTTPRequestError });
    } else {
      this.setState({ order: order as IOrder });
    }
    if (typeof (order as IOrder).paymentId === "string") {
      const paymentIntent = (await API_STRIPE.retrievePaymentIntent(
        (order as IOrder).paymentId
      )) as PaymentIntent;
      const paymentMethodId = paymentIntent.payment_method as string;
      const paymentMethod = (await API_STRIPE.retrievePaymentMethod(
        paymentMethodId
      )) as PaymentMethod;
      const card = paymentMethod.card as PaymentMethod.Card;
      this.setState({
        card,
        paymentIntent,
      });
    }
    this.setState({ isFetching: false });
  }

  render() {
    if (this.state.error?.errors && !this.state.order) {
      return (
        <Page>
          <PageContainer>
            <div className="w-full h-fit flex flex-col gap-2 bg-white rounded-lg p-6 md:p-10">
              <Heading title="Uh Oh! An error occured." level="1" />
              <p className="font-Inter text-base text-black">
                This order could not be found!
              </p>
            </div>
          </PageContainer>
        </Page>
      );
    }
    if (!this.state.order || this.state.isFetching)
      return (
        <Page>
          <PageContainer>
            <div className="w-full h-[80vh] flex flex-row justify-center items-center">
              <Loader />
            </div>
          </PageContainer>
        </Page>
      );
    const {
      orderId,
      shippingAddress,
      billingAddress,
      paymentStatus,
      status,
      items,
      total,
      subtotal,
      tax,
      shippingCost,
    } = this.state.order;
    const shipping = `${shippingAddress.line_1} ${shippingAddress.line_2} ${shippingAddress.city}, ${shippingAddress.stateProvinceCounty} ${shippingAddress.postalCode}`;
    const billingName = billingAddress.fullName;
    const billing = `${billingAddress.line_1} ${billingAddress.line_2} ${billingAddress.city}, ${billingAddress.stateProvinceCounty} ${billingAddress.postalCode}`;
    const createdAt = this.state.order.createdAt
      ? formatDateToWMDY(new Date(this.state.order.createdAt))
      : "";
    return (
      <React.Fragment>
        {this.state.isModalInView && (
          <CancelOrderModal
            close={this.closeCancelModal}
            cancelOrder={this.cancelOrder}
            updateCancelReason={this.updateCancelReason}
          />
        )}
        <Modal isModalInView={this.state.isModalInView}>
          <Page>
            <PageContainer>
              <div className="w-full h-fit mb-6">
                <Link
                  to="/orders"
                  className="font-Inter text-lg text-black font-medium pb-4 hover:underline"
                >
                  &lt; Back to all orders
                </Link>
              </div>
              <div className="flex flex-col w-full bg-white rounded-lg p-6 gap-10 md:p-10">
                <div className="flex flex-col justify-between gap-6 sm:flex-row">
                  <div className="flex flex-col">
                    <Heading title={`Your Order`} level="1" />
                    <p className="max-w-full font-Inter text-sm font-medium break-words md:text-base">
                      <b>Order ID /</b> {orderId}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-4 md:gap-2 md:items-end">
                    <div className="flex flex-col sm:gap-1 sm:flex-row">
                      <p className="font-Inter font-medium text-[#474747] font-base">
                        Purchased on
                      </p>
                      <p className="font-Inter font-medium text-[#474747] font-base">
                        {createdAt}
                      </p>
                    </div>
                    <p className="font-Inter font-semibold text-black text-lg">
                      {status}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ">
                  <p className="font-Inter text-base font-medium text-black">
                    Shipping Address
                  </p>
                  <p className="font-Inter text-base text-[#474747]">
                    {shipping}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-Inter font-medium text-black">
                    Payment Method
                  </p>
                  <div className="flex flex-col gap-6 md:flex-row md md:justify-between">
                    <div className="flex flex-col gap-2">
                      <p className="font-Inter text-base text-[#474747]">
                        {billingName}
                      </p>
                      <p className="font-Inter text-base text-[#474747]">
                        {billing}
                      </p>
                    </div>
                    {this.state.card && (
                      <div className="flex flex-col gap-2 md:text-right">
                        <p className="font-Inter text-base text-[#474747]">
                          {paymentStatus} with{" "}
                          {toTitleCase(this.state.card.brand)} -{" "}
                          {toTitleCase(this.state.card.funding)}
                        </p>
                        <div className="flex flex-row justify-start items-center gap-2">
                          <CardBrand brand={this.state.card.brand} />
                          <div className="flex flex-row gap-2 font-Inter text-base text-[#474747]">
                            <p>•••• •••• ••••</p>
                            <p>{this.state.card.last4}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-start gap-6 w-full">
                  {items.map((item, i) => {
                    return <OrderItem item={item} key={i} />;
                  })}
                  <hr className="w-full bg-[#DBDBDB] mx-auto" />
                  <div className="w-full flex flex-col gap-4">
                    <div className="flex flex-row items-start justify-between w-full">
                      <p className="font-Inter text-black">Subtotal</p>
                      <p className="font-Inter text-black">
                        ${subtotal.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-row items-start justify-between w-full">
                      <p className="font-Inter text-black">Shipping</p>
                      <p className="font-Inter text-black">
                        ${shippingCost.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-row items-start justify-between w-full">
                      <p className="font-Inter text-black">Tax</p>
                      <p className="font-Inter text-black">${tax.toFixed(2)}</p>
                    </div>
                  </div>
                  <hr className="w-full bg-[#DBDBDB] mx-auto" />
                  <div className="flex flex-row items-start justify-between w-full">
                    <p className="font-Inter font-medium text-black">Total</p>
                    <p className="font-Inter font-bold text-black">
                      ${total.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="w-full flex flex-row justify-center md:justify-end ">
                  <div className="w-full flex flex-col gap-4 md:w-fit ">
                    <Link
                      className=" px-6 py-2 bg-black rounded-full text-white font-base text-center min-w-[150px] hover:bg-[#000000cc]"
                      to="/contact"
                    >
                      Need help?
                    </Link>
                    {status !== "Cancelled" && (
                      <button
                        className=" px-6 py-2 bg-black rounded-full text-white font-base text-center min-w-[150px] hover:bg-[#000000cc]"
                        onClick={() => this.openCancelModal()}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </PageContainer>
          </Page>
        </Modal>
      </React.Fragment>
    );
  }
}
