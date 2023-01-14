import React, { Component } from "react";
import API_ADDRESS from "../../api/address";
import { IAddress } from "../../models/address";

type AddressInfoProps = {
  open: () => void;
  id: string;
  userId: string | "";
  firstName: string;
  lastName: string;
  line_1: string;
  line_2?: string | null;
  city: string;
  stateProvinceCounty: string;
  postalCode: string;
  isDefault: boolean;
  updateSelectedAddress: (id: string) => void;
  updateAddresses: (addresses: IAddress[]) => void;
};

class AddressInfo extends Component<AddressInfoProps, {}> {
  constructor(props: AddressInfoProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleClick() {
    this.props.updateSelectedAddress(this.props.id);
    this.props.open();
  }

  async handleDelete(){
    const deletedAddress = await API_ADDRESS.deleteAddress(this.props.id);
    if(this.props.userId !== ""){
      const updatedAddresses = await API_ADDRESS.getAddressesByUserId(this.props.userId);
      if(!Object.keys(updatedAddresses).includes("message")){
        const responseAddresses = updatedAddresses as IAddress[];
        this.props.updateAddresses(responseAddresses);
      }
      console.log('delete',deletedAddress,updatedAddresses);
    }
  }

  render() {
    return (
      <div className="mb-6">
        {this.props.isDefault && (
          <p className="font-Inter text-sm text-black tracking-tight mb-1">
            Default Address
          </p>
        )}
        <div className="flex flex-row justify-between w-full">
          <p className="font-Inter text-sm text-[#6A6A6A] tracking-tight mb-1">
            {this.props.firstName} {this.props.lastName}
          </p>
          <div className="flex justify-between gap-4">
            <button
              className="font-Inter text-sm font-semibold text-decoration-none hover:underline"
              onClick={this.handleClick}
            >
              Edit
            </button>
            <button onClick={this.handleDelete}>
              <img src="/assets/delete-icon.svg" alt="Delete" />
            </button>
          </div>
        </div>
        <p className="font-Inter text-sm text-[#6A6A6A] tracking-tight mb-1">
          {this.props.line_1}
        </p>
        {this.props.line_2 !== null && (
          <p className="font-Inter text-sm text-[#6A6A6A] tracking-tight mb-1">
            {this.props.line_2}
          </p>
        )}
        <p className="font-Inter text-sm text-[#6A6A6A] tracking-tight mb-1">
          {this.props.city}, {this.props.stateProvinceCounty}, {this.props.postalCode}
        </p>
      </div>
    );
  }
}

export default AddressInfo;
