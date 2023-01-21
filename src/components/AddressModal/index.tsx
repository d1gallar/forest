import React, { ChangeEvent, Component, FormEvent } from "react";
import { IAddress } from "../../models/address";
import { IUserLoad } from "../../models/user";
import Checkbox from "../CheckBox";
import CloseButton from "../CloseButton";
import CountryInput from "../CountryInput";
import FormInput from "../FormInput";
import Label from "../Label";
import SaveButton from "../SaveButton";
import API_ADDRESS from "../../api/address";

type AddressModalProps = {
  close: () => void;
  user: IUserLoad;
  address: IAddress;
  updateAddresses: (addresses: []) => void;
};

type AddressModalState = {
  firstName: string;
  lastName: string;
  line_1: string;
  line_2: string;
  city: string;
  postalCode: string;
  stateProvinceCounty: string;
  country: string;
  isDefault: boolean;
  submitDisabled: boolean;
};

class AddressModal extends Component<AddressModalProps, AddressModalState> {
  constructor(props: AddressModalProps) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      line_1: "",
      line_2: "",
      city: "",
      postalCode: "",
      country: "",
      stateProvinceCounty: "",
      isDefault: this.props.address.isDefault,
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
    this.setState({ firstName: e.target.value });
  }

  handleLastNameChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({ lastName: e.target.value });
  }

  handleAddressLineOneChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({ line_1: e.target.value });
  }

  handleAddressLineTwoChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({ line_2: e.target.value });
  }

  handleCityChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({ city: e.target.value });
  }

  handleZipCodeChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({ postalCode: e.target.value });
  }

  handleStateChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({ stateProvinceCounty: e.target.value });
  }

  handleCheckBoxChange() {
    this.setState({
      isDefault: !this.state.isDefault,
    });
  }

  handleCountrySelect(e: ChangeEvent<HTMLSelectElement>) {
    const selectedCountry = e.target.value;
    this.setState({ country: selectedCountry });
  }

  async handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (this.isValidSubmit() && this.props.address && this.props.user) {
      const { _id } = this.props.address;
      const { submitDisabled, isDefault, ...fields } = this.state;
      const fieldArr = Object.entries(fields);
      const filteredFieldArr = fieldArr.filter(([key, val]) => val !== "");
      const filterField = {
        ...Object.fromEntries(filteredFieldArr),
      };
      // console.log("valid submission", this.state, filterField);
      await API_ADDRESS.updateAddressPartial(_id.toString(), filterField);
      const updatedAddresses = await API_ADDRESS.updateDefaultAddress(
        this.props.user._id.toString(),
        _id.toString()
      );
      this.props.updateAddresses(updatedAddresses);
      this.setState({
        firstName: "",
        lastName: "",
        line_1: "",
        line_2: "",
        city: "",
        postalCode: "",
        stateProvinceCounty: "",
        country: "",
      });
      this.props.close();
    }
  }

  isValidSubmit() {
    const {
      firstName,
      lastName,
      line_1,
      city,
      country,
      postalCode,
      stateProvinceCounty,
    } = this.state;
    const stateCheckArr = [
      firstName,
      lastName,
      line_1,
      city,
      country,
      postalCode,
      stateProvinceCounty,
    ];
    let validSubmission = false;
    const isOneInputFilled = !stateCheckArr.every((field) => field === "");
    const didCheckboxChange =
      this.state.isDefault !==
      (this.props.address && this.props.address.isDefault);
    if (isOneInputFilled || didCheckboxChange) validSubmission = true;
    return validSubmission;
  }

  render() {
    const {
      firstName,
      lastName,
      line_1,
      line_2,
      city,
      stateProvinceCounty,
      country,
      postalCode,
    } = this.props.address;
    return (
      <div className="flex flex-row justify-center items-center">
        <form
          className="fixed flex flex-col bg-white p-8 rounded-[20px] translate-y-[50vh] z-50 2xsm:w-[90vw] sm:w-[60vw] base:w-[40vw] overflow-y-auto 2xsm:h-[90%] sm:h-auto"
          onSubmit={(e: FormEvent<HTMLFormElement>) => this.handleSubmit(e)}
        >
          <div className="flex flex-row justify-between items-center">
            <p className="font-Inter text-xl text-black font-semibold tracking-[-2%]">
              Edit Address
            </p>
            <CloseButton onClick={this.props.close} />
          </div>
          <div className="flex flex-col w-full mb-4">
            <Label htmlFor="firstName">First Name *</Label>
            <FormInput
              type="text"
              placeholder={firstName}
              value={this.state.firstName}
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
              placeholder={lastName}
              value={this.state.lastName}
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
              placeholder={line_1}
              value={this.state.line_1}
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
              placeholder={line_2}
              value={this.state.line_2}
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
                placeholder={city}
                value={this.state.city}
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
                placeholder={postalCode}
                value={this.state.postalCode}
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
                selectedCountry={country}
                onChange={(e) => this.handleCountrySelect(e)}
              />
            </div>
            <div className="flex flex-col w-full mb-4">
              <Label htmlFor="state">State *</Label>
              <FormInput
                type="text"
                placeholder={stateProvinceCounty}
                value={this.state.stateProvinceCounty}
                id="state"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  this.handleStateChange(e)
                }
              />
            </div>
          </div>
          <div className="flex flex-row justify-start gap-2">
            <Checkbox
              checked={this.state.isDefault}
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
export default AddressModal;
