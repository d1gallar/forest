import React, { ChangeEvent, Component, FormEvent } from "react";
import { IUser, IUserLoad } from "../../models/user";
import Checkbox from "../CheckBox";
import CloseButton from "../CloseButton";
import CountryInput from "../CountryInput";
import FormInput from "../FormInput";
import Label from "../Label";
import SaveButton from "../SaveButton";
import API_ADDRESS from "../../api/address";
import { IAddress } from "../../models/address";

type AddressAddModalProps = {
  close: () => void;
  user: IUserLoad;
  updateUser: (user: IUser) => void;
  updateAddresses: (addresses: IAddress[]) => void;
  addresses: IAddress[]
};

type AddressAddModalState = {
  firstName: string;
  lastName: string;
  addressLineOne: string;
  addressLineTwo: string;
  city: string;
  zipCode: string;
  country: string;
  state: string;
  defaultAddress: boolean;
  submitDisabled: boolean;
};

class AddressAddModal extends Component<
  AddressAddModalProps,
  AddressAddModalState
> {
  constructor(props: AddressAddModalProps) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      addressLineOne: "",
      addressLineTwo: "",
      city: "",
      zipCode: "",
      country: "",
      state: "",
      defaultAddress: this.props.addresses.length === 0,
      submitDisabled: true,
    };

    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleAddressLineOneChange =
      this.handleAddressLineOneChange.bind(this);
    this.handleAddressLineTwoChange =
      this.handleAddressLineTwoChange.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleZipCodeChange = this.handleZipCodeChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFirstNameChange(e: ChangeEvent<HTMLInputElement>) {
    const firstName = e.target.value;
    this.setState({ firstName });
  }

  handleLastNameChange(e: ChangeEvent<HTMLInputElement>) {
    const lastName = e.target.value;
    this.setState({ lastName });
  }

  handleAddressLineOneChange(e: ChangeEvent<HTMLInputElement>) {
    const addressLineOne = e.target.value;
    this.setState({ addressLineOne });
  }

  handleAddressLineTwoChange(e: ChangeEvent<HTMLInputElement>) {
    const addressLineTwo = e.target.value;
    this.setState({ addressLineTwo });
  }

  handleCityChange(e: ChangeEvent<HTMLInputElement>) {
    const city = e.target.value;
    this.setState({ city });
  }

  handleZipCodeChange(e: ChangeEvent<HTMLInputElement>) {
    const zipCode = e.target.value;
    this.setState({ zipCode });
  }

  handleStateChange(e: ChangeEvent<HTMLInputElement>) {
    const state = e.target.value;
    this.setState({ state });
  }

  handleCheckBoxChange() {
    this.setState({
      defaultAddress: !this.state.defaultAddress,
    });
  }

  handleCountrySelect(e: ChangeEvent<HTMLSelectElement>) {
    const selectedCountry = e.target.value;
    this.setState({ country: selectedCountry });
  }

  async handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { user } = this.props;
    if (this.isValidSubmit() && user) {
      const newAddress = {
        userId: user._id.toString(),
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        line_1: this.state.addressLineOne,
        line_2: this.state.addressLineTwo,
        city: this.state.city,
        postalCode: this.state.zipCode,
        stateProvinceCounty: this.state.state,
        country: this.state.country,
        isDefault: this.state.defaultAddress,
      } as IAddress;
      await API_ADDRESS.createAddress(newAddress);
      // console.log("valid submission", this.state, newAddress);
      const updatedAddresses = await API_ADDRESS.getAddressesByUserId(
        user._id.toString()
      );
      if(!Object.keys(updatedAddresses).includes("message")){
        const responseAddresses = updatedAddresses as IAddress[];
        this.props.updateAddresses(responseAddresses);
      }
      this.props.close();
    }
  }

  isValidSubmit() {
    const {
      firstName,
      lastName,
      addressLineOne,
      city,
      zipCode,
      country,
      state,
    } = this.state;

    const stateCheckArr = [
      firstName,
      lastName,
      addressLineOne,
      city,
      zipCode,
      country,
      state,
    ];
    let validSubmission = false;
    const inputNotEmpty = stateCheckArr.every((field) => field !== "");
    if (inputNotEmpty) validSubmission = true;
    return validSubmission;
  }

  render() {
    return (
      <div className="flex flex-row justify-center items-center">
        <form
          className="fixed flex flex-col bg-white p-8 rounded-[20px] translate-y-[50vh] z-50 2xsm:w-[90vw] sm:w-[60vw] base:w-[40vw] overflow-y-auto 2xsm:h-[90%] sm:h-auto"
          onSubmit={(e: FormEvent<HTMLFormElement>) => this.handleSubmit(e)}
        >
          <div className="flex flex-row justify-between items-center">
            <p className="font-Inter text-xl text-black font-semibold tracking-[-2%]">
              Add Address
            </p>
            <CloseButton onClick={this.props.close} />
          </div>
          <div className="flex flex-col w-full mb-4">
            <Label htmlFor="firstName">First Name *</Label>
            <FormInput
              type="text"
              placeholder=""
              id="firstName"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                this.handleFirstNameChange(e)
              }
            />
          </div>
          <div className="flex flex-col w-full mb-4">
            <Label htmlFor="lastName">Last Name *</Label>
            <FormInput
              type="text"
              placeholder=""
              id="lastName"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                this.handleLastNameChange(e)
              }
            />
          </div>
          <div className="flex flex-col w-full mb-4">
            <Label htmlFor="addressLineOne">Street Address *</Label>
            <FormInput
              type="text"
              placeholder=""
              id="addressLineOne"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                this.handleAddressLineOneChange(e)
              }
            />
          </div>
          <div className="flex flex-col w-full mb-4">
            <Label htmlFor="addressLineTwo">
              Apt, Building, Suite, etc. (Optional)
            </Label>
            <FormInput
              type="text"
              placeholder=""
              id="addressLineTwo"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                this.handleAddressLineTwoChange(e)
              }
            />
          </div>
          <div className="flex flex-row w-full justify-between 2xsm:flex-wrap 2xsm:gap-0 sm:gap-4 sm:flex-nowrap">
            <div className="flex flex-col w-full mb-4">
              <Label htmlFor="city">City *</Label>
              <FormInput
                type="text"
                placeholder=""
                id="city"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  this.handleCityChange(e)
                }
              />
            </div>
            <div className="flex flex-col w-full mb-4">
              <Label htmlFor="zipCode">Zipcode *</Label>
              <FormInput
                type="text"
                placeholder=""
                id="zipCode"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  this.handleZipCodeChange(e)
                }
              />
            </div>
          </div>
          <div className="flex flex-row w-full justify-between 2xsm:flex-wrap 2xsm:gap-0 sm:gap-4 sm:flex-nowrap">
            <div className="flex flex-col w-full mb-4">
              <Label htmlFor="country">Country *</Label>
              <CountryInput
                selectedCountry={this.state.country}
                onChange={(e) => this.handleCountrySelect(e)}
              />
            </div>
            <div className="flex flex-col w-full mb-4">
              <Label htmlFor="state">State *</Label>
              <FormInput
                type="text"
                placeholder=""
                id="state"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  this.handleStateChange(e)
                }
              />
            </div>
          </div>
          <div className="flex flex-row justify-start gap-2">
            <Checkbox
              checked={this.state.defaultAddress}
              onChange={this.handleCheckBoxChange}
              id="defaultAddress"
            />
            <label
              className="font-Inter font-base text-black text-sm"
              htmlFor="defaultAddress"
            >
              Use this as my default address.
            </label>
          </div>
          <div className="flex flex-row justify-center mt-8">
            <SaveButton disabled={!this.isValidSubmit()} />
          </div>
        </form>
      </div>
    );
  }
}
export default AddressAddModal;
