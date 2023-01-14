import { AddressElement } from "@stripe/react-stripe-js";
import {
  Stripe,
  StripeAddressElementChangeEvent,
  StripeElements,
} from "@stripe/stripe-js";
import React, { Component, FormEvent } from "react";
import API_STRIPE from "../../api/stripe";
import { IFormError } from "../../util/mongooseValidator";
import Checkbox from "../CheckBox";
import { CheckoutFormData } from "../CheckoutForm";
import Heading from "../Heading";

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

type ShippingAddressFormProps = {
  data: CheckoutFormData;
  stripe: Stripe | null;
  elements: StripeElements;
  paymentId: string;
  updateField: (fields: Partial<CheckoutFormData>) => void;
  updateCheckbox: () => void;
  updateBillingAndShipping: () => void;
  prev: () => void;
  next: () => void;
};

type ShippingAddressFormState = {
  hasError: boolean;
  errors: IFormError;
};

export default class ShippingAddressForm extends Component<
  ShippingAddressFormProps,
  ShippingAddressFormState
> {
  constructor(props: ShippingAddressFormProps) {
    super(props);
    this.state = {
      hasError: false,
      errors: {},
    };
    this.handleAddress = this.handleAddress.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  constructDefaultValues(): DefaultValues {
    const {
      firstName,
      lastName,
      shipping_line_1,
      shipping_line_2,
      shipping_city,
      shipping_postalCode,
      shipping_stateProvinceCounty,
      shipping_country,
    } = this.props.data;
    const fullName = `${firstName} ${lastName}`;
    const defaultValues: DefaultValues = {
      name: firstName && lastName ? fullName : null,
      address: {
        line1: shipping_line_1,
        line2: shipping_line_2,
        city: shipping_city,
        state: shipping_stateProvinceCounty,
        postal_code: shipping_postalCode,
        country: shipping_country,
      },
    };
    return defaultValues;
  }

  handleAddress(e: StripeAddressElementChangeEvent) {
    const {
      shipping_name,
      shipping_line_1,
      shipping_line_2,
      shipping_city,
      shipping_postalCode,
      shipping_stateProvinceCounty,
      shipping_country,
    } = this.props.data;

    const { name, address } = e.value;
    const { line1, line2, city, postal_code, state, country } = address;
    const stripeLine2 = line2 || "";

    // state changes
    if (shipping_name !== name) {
      this.props.updateField({ shipping_name: name });
    }
    if (shipping_line_1 !== line1)
      this.props.updateField({ shipping_line_1: line1 });
    if (shipping_line_2 !== line2)
      this.props.updateField({ shipping_line_2: stripeLine2 });
    if (shipping_city !== city) this.props.updateField({ shipping_city: city });
    if (shipping_postalCode !== postal_code)
      this.props.updateField({ shipping_postalCode: postal_code });
    if (shipping_stateProvinceCounty !== state) {
      this.props.updateField({ shipping_stateProvinceCounty: state });
    }
    if (shipping_country !== country) {
      this.props.updateField({ shipping_country: country });
    }

    // form errors
    const errors: IFormError = {};
    if (name === "") errors["shipping_name"] = "The name is required.";
    if (line1 === "") errors["shipping_line1"] = "Address line 1 is required.";
    if (city === "") errors["shipping_city"] = "The city is required.";
    if (state === "") errors["shipping_state"] = "The state is required.";
    if (postal_code === "") errors["shipping_postalCode"] = "The ZIP is required.";
    if (country === "") errors["shipping_country"] = "The country is required.";
    const hasError = Object.entries(errors).length > 0;
    console.log(this.state.errors)
    this.setState({ hasError, errors });
  }

  async handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!this.state.hasError) {
      const {
        shipping_name,
        shipping_line_1,
        shipping_line_2,
        shipping_city,
        shipping_postalCode,
        shipping_stateProvinceCounty,
        shipping_country,
        phoneNumber
      } = this.props.data;

      // updates shipping address as billing
      if(this.props.data.isBillingAddSame) this.props.updateBillingAndShipping(); 

      // update stripe payment: adds shipping address
      try {
        await API_STRIPE.updatePaymentIntent(this.props.paymentId, {
          shipping: {
            address: {
              city: shipping_city,
              country: shipping_country,
              line1: shipping_line_1,
              line2: shipping_line_2,
              postal_code: shipping_postalCode,
              state: shipping_stateProvinceCounty,
            },
            name: shipping_name,
            phone: phoneNumber
          },
        });
        this.props.next();
      } catch (error) {
        console.log(error)
      }
    }
  }

  render() {
    const { isBillingAddSame } = this.props.data;
    console.log(this.props.data);
    return (
      <React.Fragment>
        <Heading level="2" title="Shipping" />
        <form
          onSubmit={(e: FormEvent<HTMLFormElement>) => this.handleSubmit(e)}
          className="flex flex-col gap-4"
        >
          <AddressElement
            options={{
              mode: "shipping",
              defaultValues: this.constructDefaultValues(),
            }}
            onChange={(e: StripeAddressElementChangeEvent) =>
              this.handleAddress(e)
            }
          />
          <div className="flex flex-row justify-start items-center gap-2 ">
            <Checkbox
              checked={isBillingAddSame}
              onChange={this.props.updateCheckbox}
            />
            <label
              htmlFor="isBillingAddSame"
              className="font-Inter font-base text-black text-sm"
            >
              My shipping address is the same as my billing address
            </label>
          </div>
          <button
            type="submit"
            disabled={this.state.hasError}
            className="bg-black text-white rounded-full px-4 py-2 mt-6 w-full disabled:bg-[#000000ae] disabled:pointer-default"
          >
            Next
          </button>
        </form>
      </React.Fragment>
    );
  }
}
