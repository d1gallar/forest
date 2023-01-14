import { Elements, ElementsConsumer } from "@stripe/react-stripe-js";
import { Appearance, CssFontSource, loadStripe } from "@stripe/stripe-js";
import React, { Component } from "react";
import API_STRIPE from "../../api/stripe";
import { ICart, ICartLoad } from "../../models/cart";
import CheckoutSummary from "../CheckoutSummary";
import PaymentInfoForm from "../PaymentInfoForm";
import PersonalDetailsForm from "../PersonalDetailsForm";
import ShippingAddressForm from "../ShippingAddressForm";
import { Stripe, StripeElements } from "@stripe/stripe-js/types/stripe-js";

const STRIPE_FONTS: CssFontSource = {
  cssSrc:
    "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap",
};

const STRIPE_APPEARANCE: Appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#0000000",
    colorBackground: "#ffffff",
    colorDanger: "#ef4444",
    colorPrimaryText: "#0000000",
  },
  rules: {
    ".Label": {
      color: "#30313D",
      marginBottom: ".5rem",
      fontFamily: "Inter",
      fontWeight: "500",
    },
  },
};

export type CheckoutFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  shipping_name: string;
  shipping_line_1: string;
  shipping_line_2?: string;
  shipping_city: string;
  shipping_postalCode: string;
  shipping_stateProvinceCounty: string;
  shipping_country: string;
  isBillingAddSame: boolean;
  billing_name: string;
  billing_line_1: string;
  billing_line_2?: string;
  billing_city: string;
  billing_postalCode: string;
  billing_stateProvinceCounty: string;
  billing_country: string;
};

type CheckoutFormProps = {
  cart: ICartLoad;
  updateCart: (cart: ICart) => void;
};

type CheckoutFormState = CheckoutFormData & {
  step: number;
  stripePromise: Promise<Stripe | null> | null;
  clientSecret: string;
  paymentId: string;
};

export default class CheckoutForm extends Component<
  CheckoutFormProps,
  CheckoutFormState
> {
  constructor(props: CheckoutFormProps) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      shipping_name: "",
      shipping_line_1: "",
      shipping_line_2: "",
      shipping_city: "",
      shipping_postalCode: "",
      shipping_stateProvinceCounty: "",
      shipping_country: "",
      isBillingAddSame: false,
      billing_name: "",
      billing_line_1: "",
      billing_line_2: "",
      billing_city: "",
      billing_postalCode: "",
      billing_stateProvinceCounty: "",
      billing_country: "",
      step: 0,
      stripePromise: null,
      clientSecret: "",
      paymentId: "",
    };

    this.updateField = this.updateField.bind(this);
    this.updateCheckbox = this.updateCheckbox.bind(this);
    this.updateBillingAndShipping = this.updateBillingAndShipping.bind(this);
    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
    this.goToStep = this.goToStep.bind(this);
  }

  prev() {
    const { step } = this.state;
    if (step >= 0) this.setState({ step: step - 1 });
  }

  next() {
    const { step } = this.state;
    if (step < 3) this.setState({ step: step + 1 });
  }

  goToStep(index: number) {
    if (index >= 0 && index <= 3) {
      this.setState({ step: index });
    }
  }

  updateField = async (fields: Partial<CheckoutFormData>) => {
    this.setState((prevState) => {
      return { ...prevState, ...fields };
    });
  };

  updateCheckbox() {
    const toggledBilling = !this.state.isBillingAddSame;
    this.setState({ isBillingAddSame: toggledBilling });
  }

  updateBillingAndShipping() {
    this.setState({
      billing_name: this.state.shipping_name,
      billing_line_1: this.state.shipping_line_1,
      billing_line_2: this.state.shipping_line_2,
      billing_city: this.state.shipping_city,
      billing_postalCode: this.state.shipping_postalCode,
      billing_stateProvinceCounty: this.state.shipping_stateProvinceCounty,
      billing_country: this.state.shipping_country,
    });
  }

  renderSwitch(step: number, stripe: Stripe | null, elements: StripeElements) {
    switch (step) {
      case 0:
        return (
          <PersonalDetailsForm
            data={this.state}
            updateField={this.updateField}
            prev={this.prev}
            next={this.next}
          />
        );
      case 1:
        return (
          <ShippingAddressForm
            data={this.state}
            stripe={stripe}
            elements={elements}
            paymentId={this.state.paymentId}
            updateField={this.updateField}
            updateCheckbox={this.updateCheckbox}
            updateBillingAndShipping={this.updateBillingAndShipping}
            prev={this.prev}
            next={this.next}
          />
        );
      case 2:
        return (
          this.props.cart && <PaymentInfoForm
            data={this.state}
            cart={this.props.cart}
            stripe={stripe}
            elements={elements}
            paymentId={this.state.paymentId}
            updateField={this.updateField}
            updateCart={this.props.updateCart}
            prev={this.prev}
            next={this.next}
          />
        );
    }
  }

  async componentDidMount() {
    try {
      const STRIPE_PUBLISHABLE = await API_STRIPE.config();
      const stripePromise: Promise<Stripe | null> =
        loadStripe(STRIPE_PUBLISHABLE);
      this.setState({ stripePromise });
      if (this.props.cart) {
        const metadata = {
          userId: this.props.cart.userId
        };
        const { clientSecret, paymentId } =
          await API_STRIPE.createPaymentIntent(this.props.cart.total, metadata);
        this.setState({ clientSecret, paymentId });
      }
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { clientSecret, stripePromise } = this.state;
    return (
      clientSecret &&
      stripePromise &&
      this.props.cart && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: STRIPE_APPEARANCE,
            fonts: [STRIPE_FONTS],
          }}
        >
          <ElementsConsumer>
            {({ stripe, elements }) => (
              <div className="flex flex-col w-full justify-between gap-2  bg-white rounded-lg p-6 sm:p-8 md:p-10">
                <div className="w-full mb-6 inline-flex font-Inter font-medium text-black">
                  <button onClick={() => this.goToStep(0)}>Checkout </button>
                  <p>&nbsp;/&nbsp;</p>
                  <button
                    className="hover:underline"
                    onClick={() => this.goToStep(0)}
                  >
                    Personal Info
                  </button>
                  {this.state.step >= 1 && (
                    <React.Fragment>
                      <p>&nbsp;/&nbsp;</p>
                      <button
                        className="hover:underline"
                        onClick={() => this.goToStep(1)}
                      >
                        Shipping
                      </button>
                    </React.Fragment>
                  )}
                  {this.state.step >= 2 && (
                    <React.Fragment>
                      <p>&nbsp;/&nbsp;</p>
                      <button
                        className="hover:underline"
                        onClick={() => this.goToStep(2)}
                      >
                        Payment
                      </button>
                    </React.Fragment>
                  )}
                </div>
                <div className="w-full h-fit flex flex-col justify-between items-start md:flex-row">
                  <div className="w-full h-fit flex flex-col gap-10 md:flex-row-reverse">
                    <div className="w-full h-fit flex flex-col gap-2 order-2">
                      {stripe &&
                        elements &&
                        this.renderSwitch(this.state.step, stripe, elements)}
                    </div>
                    <CheckoutSummary
                      cart={this.props.cart}
                      showTotal={this.state.step === 2}
                    />
                  </div>
                </div>
              </div>
            )}
          </ElementsConsumer>
        </Elements>
      )
    );
  }
}
