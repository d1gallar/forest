import React, { Component } from "react";
import { IUserLoad } from "../../models/user";
import { formatPhoneNumber } from "../../util";
import AddressInfo from "../AddressInfo";
import { IAddress } from "../../models/address";

type AccountInfoProps = {
  openEditPersonal: () => void;
  openEditPassword: () => void;
  openEditAddress: () => void;
  openAddAddress: () => void;
  openDeleteAccount: () => void;
  user: IUserLoad;
  addresses: IAddress[];
  updateSelectedAddress: (id: string) => void;
  updateAddresses: (addresses: IAddress[]) => void;
  logOut: () => void;
};

class AccountInfo extends Component<AccountInfoProps, {}> {
  renderAddressList() {
    if (this.props.addresses.length === 0)
      return <p>There are currently no available addresses. </p>;
    return this.props.addresses.map((address: IAddress) => {
      const {
        _id,
        firstName,
        lastName,
        line_1,
        line_2,
        city,
        postalCode,
        stateProvinceCounty,
        isDefault,
      } = address;
      const { user } = this.props;
      return (
        <AddressInfo
          key={_id.toString()}
          id={_id.toString()}
          userId={(user && user._id.toString()) || ""}
          open={this.props.openEditAddress}
          firstName={firstName}
          lastName={lastName}
          line_1={line_1}
          line_2={line_2}
          city={city}
          stateProvinceCounty={stateProvinceCounty}
          postalCode={postalCode}
          isDefault={isDefault}
          updateSelectedAddress={this.props.updateSelectedAddress}
          updateAddresses={this.props.updateAddresses}
        />
      );
    });
  }

  render() {
    const { user } = this.props;
    return (
      <React.Fragment>
        <div className="w-full h-fit flex flex-col bg-white p-8 rounded-[10px] mb-6">
          <div className="mb-4 flex flex-row justify-between w-full">
            <p
              className="font-Inter text-xl font-semibold
        "
            >
              Personal Info
            </p>
            <button
              className="font-Inter text-sm font-semibold text-decoration-none hover:text-[#555555]
        "
              onClick={this.props.openEditPersonal}
            >
              <p className="hover:underline">Edit</p>
            </button>
          </div>
          <div className="w-full">
            <p className="font-Inter text-sm text-[#6A6A6A] tracking-tight mb-1">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="font-Inter text-sm text-[#6A6A6A] tracking-tight mb-1">
              {user?.email}
            </p>
            <p className="font-Inter text-sm text-[#6A6A6A] tracking-tight mb-1">
              {user &&
                (user.phoneNumber === ""
                  ? null
                  : formatPhoneNumber(user.phoneNumber || ""))}
            </p>
          </div>
        </div>
        <div className="w-full h-fit flex flex-col bg-white p-8 rounded-[10px] mb-6">
          <div className="mb-4 flex flex-row justify-between w-full">
            <p
              className="font-Inter text-xl font-semibold
        "
            >
              Password
            </p>
            <button
              className="font-Inter text-sm font-semibold text-decoration-none hover:underline hover:text-[#555555]
        "
              onClick={this.props.openEditPassword}
            >
              Edit
            </button>
          </div>
          <div className="w-full">
            <p className="font-Inter text-sm text-[#6A6A6A] tracking-tight mb-1">
              ••••••••••••••••
            </p>
          </div>
        </div>
        <div className="w-full h-fit flex flex-col bg-white p-8 rounded-[10px] mb-6">
          <div className="mb-4 flex flex-row justify-between w-full">
            <p
              className="font-Inter text-xl font-semibold
        "
            >
              Saved Addresses
            </p>
          </div>
          <div className="w-full">{this.renderAddressList()}</div>
          <div className="w-full flex justify-end">
            <button
              type="button"
              onClick={this.props.openAddAddress}
              className="bg-black hover:bg-[#252525] px-6 py-2 rounded-[50px] text-white w-fit"
            >
              Add Address
            </button>
          </div>
        </div>
        <div className="w-full h-fit flex flex-row justify-between bg-white p-8 rounded-[10px] mb-6">
          <p
            className="font-Inter text-xl font-semibold
        "
          >
            Delete Account
          </p>
          <button
            type="button"
            onClick={this.props.openDeleteAccount}
            className="bg-black hover:bg-[#252525] px-6 py-2 rounded-[50px] text-white w-fit"
          >
            Delete
          </button>
        </div>
        <div className="flex flex-row justify-center items-center">
          <button
            type="button"
            onClick={this.props.logOut}
            className="bg-black hover:bg-[#252525] px-6 py-2 rounded-[50px] text-white w-fit"
          >
            Log Out
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default AccountInfo;
