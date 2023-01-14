import React, { Component, FormEvent } from "react";
import { CheckoutFormData } from "../CheckoutForm";
import Heading from "../Heading";
import { AddressElement, PaymentElement } from "@stripe/react-stripe-js";
import { IFormError } from "../../util/mongooseValidator";
import {
  Stripe,
  StripeAddressElementChangeEvent,
  StripeElements,
  StripePaymentElementChangeEvent,
} from "@stripe/stripe-js/types/stripe-js";
import ErrorBanner from "../ErrorBanner";
import { ICartItem, IPopulatedCartItem } from "../../models/cartItem";
import { IAddressMinified } from "../../models/address";
import { ICart } from "../../models/cart";
import { IOrderItem } from "../../models/orderItem";
import API_STRIPE from "../../api/stripe";

type PaymentInfoFormProps = {
  data: CheckoutFormData;
  cart: ICart;
  stripe: Stripe | null;
  elements: StripeElements | null;
  paymentId: string;
  updateField: (input: Partial<CheckoutFormData>) => void;
  updateCart: (cart: ICart) => void;
  prev: () => void;
  next: () => void;
};

type PaymentInfoFormState = {
  paymentType: string;
  isFetching: boolean;
  hasError: boolean;
  errors: IFormError;
  showBanner: boolean;
};

type DefaultValues = {
  name?: string | null;
  address?: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
    country: string;
  };
};

export default class PaymentInfoForm extends Component<
  PaymentInfoFormProps,
  PaymentInfoFormState
> {
  constructor(props: PaymentInfoFormProps) {
    super(props);
    this.state = {
      paymentType: "",
      isFetching: false,
      hasError: false,
      errors: {},
      showBanner: false,
    };

    this.toggleBanner = this.toggleBanner.bind(this);
    this.handleAddress = this.handleAddress.bind(this);
    this.handlePayment = this.handlePayment.bind(this);
  }

  constructDefaultValues(): DefaultValues {
    const {
      firstName,
      lastName,
      billing_line_1,
      billing_line_2,
      billing_city,
      billing_postalCode,
      billing_stateProvinceCounty,
      billing_country,
    } = this.props.data;
    const fullName = `${firstName} ${lastName}`;
    const defaultValues: DefaultValues = {
      name: firstName && lastName ? fullName : null,
      address: {
        line1: billing_line_1,
        line2: billing_line_2,
        city: billing_city,
        state: billing_stateProvinceCounty,
        postal_code: billing_postalCode,
        country: billing_country,
      },
    };
    return defaultValues;
  }

  async toggleBanner() {
    const {showBanner} = this.state;
    await this.setState({ showBanner: !showBanner });
    await this.setState({ errors: {}, hasError: false });
  }

  handlePayment(e: StripePaymentElementChangeEvent) {
    console.log(e.value.type)
    this.setState({ paymentType: e.value.type });
  }

  async handleAddress(e: StripeAddressElementChangeEvent) {
    const {
      billing_name,
      billing_line_1,
      billing_line_2,
      billing_city,
      billing_postalCode,
      billing_stateProvinceCounty,
      billing_country,
    } = this.props.data;

    const { name, address } = e.value;
    const { line1, line2, city, postal_code, state, country } = address;
    const stripeLine2 = line2 || "";

    // state changes
    if (billing_name !== name) {
      this.props.updateField({ billing_name: name });
    }
    if (billing_line_1 !== line1)
      this.props.updateField({ billing_line_1: line1 });
    if (billing_line_2 !== line2)
      this.props.updateField({ billing_line_2: stripeLine2 });
    if (billing_city !== city) this.props.updateField({ billing_city: city });
    if (billing_postalCode !== postal_code)
      this.props.updateField({ billing_postalCode: postal_code });
    if (billing_stateProvinceCounty !== state) {
      this.props.updateField({ billing_stateProvinceCounty: state });
    }
    if (billing_country !== country) {
      this.props.updateField({ billing_country: country });
    }

    // form errors
    const errors: IFormError = {};
    if (name === "") errors["billing_name"] = "The name is required.";
    if (line1 === "") errors["billing_line1"] = "Address line 1 is required.";
    if (city === "") errors["billing_city"] = "The city is required.";
    if (postal_code === "") errors["billing_state"] = "The state is required.";
    if (state === "") errors["billing_postalCode"] = "The ZIP is required.";
    if (country === "") errors["billing_country"] = "The country is required.";
    const hasError = Object.entries(errors).length > 0;
    // console.log("addresserrors", errors);
    this.setState({ errors, hasError});
    if(hasError) this.setState({showBanner: true});
  }

  async handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const {
      phoneNumber,
      email,
      shipping_name,
      shipping_line_1,
      shipping_line_2,
      shipping_city,
      shipping_postalCode,
      shipping_stateProvinceCounty,
      shipping_country,
      billing_name,
      billing_line_1,
      billing_line_2,
      billing_city,
      billing_postalCode,
      billing_stateProvinceCounty,
      billing_country,
    } = this.props.data;
    const billingLine2 = billing_line_2 || "";
    const shippingLine2 = shipping_line_2 || "";

    if (!this.state.hasError) {
      const { stripe, elements } = this.props;
      if (!stripe || !elements) return;

      const billing_details = {
        address: {
          city: billing_city,
          country: billing_country,
          line1: billing_line_1,
          line2: billingLine2,
          postal_code: billing_postalCode,
          state: billing_stateProvinceCounty,
        },
        name: billing_name,
        email: email,
        phone: phoneNumber,
      };

      // billing address
      const billingAddress: IAddressMinified = {
        fullName: billing_name,
        line_1: billing_line_1,
        line_2: billingLine2,
        city: billing_city,
        postalCode: billing_postalCode,
        stateProvinceCounty: billing_stateProvinceCounty,
        country: billing_country,
      };

      // shipping address
      const shippingAddress: IAddressMinified = {
        fullName: shipping_name,
        line_1: shipping_line_1,
        line_2: shippingLine2,
        city: shipping_city,
        postalCode: shipping_postalCode,
        stateProvinceCounty: shipping_stateProvinceCounty,
        country: shipping_country,
      };

      // ordered items
      const orderItems = new Array<IOrderItem>();
      this.props.cart.items.forEach((item: ICartItem) => {
        const productId = item.productId as IPopulatedCartItem;
        const orderItem: IOrderItem = {
          productId: productId.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        };
        orderItems.push(orderItem);
      });

      // order metadata
      const metadata = {
        metadata: {
          userId: this.props.cart.userId as string,
          paymentId: this.props.paymentId,
          items: JSON.stringify(orderItems),
          billingAddress: JSON.stringify(billingAddress),
          shippingAddress: JSON.stringify(shippingAddress),
          subtotal: this.props.cart.subtotal,
          shippingCost: this.props.cart.shippingCost,
          tax: this.props.cart.tax,
          total: this.props.cart.total,
        },
      };

      // confirms stripe payment
      this.setState({ isFetching: true });
      await API_STRIPE.updatePaymentIntent(this.props.paymentId, metadata);
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `http://localhost:3001/checkout/complete`,
          payment_method_data: { billing_details },
        },
      });
      this.setState({ isFetching: false });
      this.setState({ errors: {}, hasError: false });
      if (
        (error.type === "card_error" || error.type === "validation_error") &&
        error.message
      ) {
        const errors = this.state.errors;
        errors["stripe"] = error.message;
        const hasError = Object.entries(errors).length > 0;
        this.setState({ errors, hasError, showBanner: true });
      } else {
        const errors = this.state.errors;
        errors["stripe"] = "An unexpected error occurred.";
        const hasError = Object.entries(errors).length > 0;
        this.setState({ errors, hasError, showBanner: true });
      }
    } else {
      const {errors, hasError} = this.state;
      console.log('submit', errors, hasError)
      await this.setState({ errors, hasError, showBanner: true });
    }
  }

  componentDidUpdate(prevProps: Readonly<PaymentInfoFormProps>, prevState: Readonly<PaymentInfoFormState>, snapshot?: any): void {
      console.log(this.state)
  }

  render() {
    const { isFetching } = this.state;
    console.log(this.props.paymentId)
    return (
      <React.Fragment>
        {this.state.showBanner && this.state.hasError ? (
          <ErrorBanner clear={this.toggleBanner} className={"bg-[#ffa0a0]"}>
            <p>{this.state.errors[Object.keys(this.state.errors)[0]]}</p>
          </ErrorBanner>
        ) : null}
        <Heading level="2" title="Payment Details" />
        <form
          onSubmit={(e: FormEvent<HTMLFormElement>) => this.handleSubmit(e)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col">
            <Heading level="4" title="Card Info" className="mb-2 mt-2" />
            <PaymentElement
              onChange={(e: StripePaymentElementChangeEvent) =>
                this.handlePayment(e)
              }
            />
          </div>
          <div className="flex flex-col">
            <Heading level="4" title="Billing Address" className="mb-2 mt-2" />
            <AddressElement
              options={{
                mode: "billing",
                defaultValues: this.constructDefaultValues(),
              }}
              onChange={(e: StripeAddressElementChangeEvent) =>
                this.handleAddress(e)
              }
            />
          </div>
          <button
            type="submit"
            disabled={!this.props.stripe}
            className="bg-black text-white rounded-full px-2 py-2 mt-6 w-full disabled:bg-[#000000ae] disabled:pointer-default"
          >
            {isFetching ? "Processing..." : "Pay"}
          </button>
        </form>
      </React.Fragment>
    );
  }
}
