import React, { Component } from "react";
import Page from "../components/Page";
import AccountInfo from "../components/AccountInfo";
import PageContainer from "../components/PageContainer";
import Modal from "../components/Modal";
import PasswordModal from "../components/PasswordModal";
import PersonalInfoModal from "../components/PersonalInfoModal";
import AddressModal from "../components/AddressModal";
import AddressAddModal from "../components/AddressAddModal";
import DeleteAccountModal from "../components/DeleteAccountModal";
import AccountNav from "../components/AccountNav";
import { IUser, IUserLoad } from "../models/user";
import { IAddress } from "../models/address";
import API_USER from "../api/user";
import API_ADDRESS from "../api/address";
import API_AUTH from "../api/auth";
import { AxiosError } from "axios";
import Loader from "../components/Loader";
import { Navigate } from "react-router-dom";
import HTTPRequestError from "../util/httpError";

type AccountState = {
  isModalInView: boolean;
  editPersonalInfo: boolean;
  editPassword: boolean;
  editAddress: boolean;
  addAddress: boolean;
  deleteAccount: boolean;
  token: string | null;
  user: IUserLoad;
  isFetching: boolean;
  error: HTTPRequestError | null;
  addresses: IAddress[];
  selectedAddress: string;
};

class Account extends Component<{}, AccountState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isModalInView: false,
      editPersonalInfo: false,
      editPassword: false,
      editAddress: false,
      addAddress: false,
      deleteAccount: false,
      token: API_AUTH.getAccessToken(),
      user: null,
      isFetching: false,
      error: null,
      addresses: [],
      selectedAddress: "",
    };

    this.handleModalClick = this.handleModalClick.bind(this);
    this.updateUserState = this.updateUserState.bind(this);
    this.updateAddresses = this.updateAddresses.bind(this);
    this.updateSelectedAddress = this.updateSelectedAddress.bind(this);
    this.updateToken = this.updateToken.bind(this);
    this.closeEditPersonal = this.closeEditPersonal.bind(this);
    this.closeEditPassword = this.closeEditPassword.bind(this);
    this.closeEditAddress = this.closeEditAddress.bind(this);
    this.closeAddAddress = this.closeAddAddress.bind(this);
    this.closeDeleteAccount = this.closeDeleteAccount.bind(this);
    this.openEditPersonal = this.openEditPersonal.bind(this);
    this.openEditPassword = this.openEditPassword.bind(this);
    this.openEditAddress = this.openEditAddress.bind(this);
    this.openAddAddress = this.openAddAddress.bind(this);
    this.openDeleteAccount = this.openDeleteAccount.bind(this);
  }

  handleModalClick(viewModal: boolean) {
    this.setState({
      isModalInView: viewModal,
    });
  }

  updateUserState(user: IUser) {
    this.setState({ user });
  }

  updateAddresses(addresses: IAddress[]) {
    this.setState({ addresses });
  }

  updateSelectedAddress(id: string) {
    this.setState({ selectedAddress: id });
  }

  updateToken(val: string | null) {
    this.setState({ token: val });
  }

  async logOutUser() {
    await API_AUTH.logout();
    window.location.href = "/";
  }

  openEditPersonal() {
    this.setState({
      isModalInView: true,
      editPersonalInfo: true,
    });
  }

  openEditPassword() {
    this.setState({
      isModalInView: true,
      editPassword: true,
    });
  }

  openEditAddress() {
    this.setState({
      isModalInView: true,
      editAddress: true,
    });
  }

  openAddAddress() {
    this.setState({
      isModalInView: true,
      addAddress: true,
    });
  }

  openDeleteAccount() {
    this.setState({
      isModalInView: true,
      deleteAccount: true,
    });
  }

  closeEditPersonal() {
    this.setState({
      isModalInView: false,
      editPersonalInfo: false,
    });
  }

  closeEditPassword() {
    this.setState({
      isModalInView: false,
      editPassword: false,
    });
  }

  closeEditAddress() {
    this.setState({
      isModalInView: false,
      editAddress: false,
    });
  }

  closeAddAddress() {
    this.setState({
      isModalInView: false,
      addAddress: false,
    });
  }

  closeDeleteAccount() {
    this.setState({
      isModalInView: false,
      deleteAccount: false,
    });
  }

  async componentDidMount() {
    if (this.state.user === null) {
      try {
        this.setState({ isFetching: true });
        const userId = await API_AUTH.getUserId();
        if (typeof userId === "string") {
          const user = (await API_USER.getUserById(userId)) as Object;
          const addresses = (await API_ADDRESS.getAddressesByUserId(
            userId
          )) as [];
          if (Object.keys(user).includes("_id") && addresses) {
            const responseUser = { ...user } as IUser;
            // console.log("Fetched user...", responseUser);
            // console.log("Fetched addresses...", addresses);
            this.setState({ user: responseUser, addresses });
          }
        } else {
          // console.log("Failed to retrieve userId...", userId);
        }
        this.setState({ isFetching: false });
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          const httpError = axiosError.response.data as HTTPRequestError;
          // console.log("Failed to fetch...", axiosError.response.data);
          this.setState({ error: httpError });
        }
        this.setState({ error: error as HTTPRequestError });
      }
    }
  }

  render(): React.ReactNode {
    const {
      isModalInView,
      editPassword,
      editAddress,
      editPersonalInfo,
      deleteAccount,
      addAddress,
      token,
      user,
      addresses,
    } = this.state;
    if (this.state.error)
      return <Navigate state={"/"} to="/login" replace />;
    return (
      <React.Fragment>
        {deleteAccount && isModalInView && (
          <DeleteAccountModal
            close={this.closeDeleteAccount}
            user={user}
            token={token}
            updateToken={this.updateToken}
          />
        )}
        {editPersonalInfo && isModalInView && (
          <PersonalInfoModal
            close={this.closeEditPersonal}
            user={user}
            token={token}
            updateUser={this.updateUserState}
          />
        )}
        {editPassword && isModalInView && (
          <PasswordModal
            close={this.closeEditPassword}
            user={user}
            updateUser={this.updateUserState}
          />
        )}
        {editAddress && isModalInView && (
          <AddressModal
            close={this.closeEditAddress}
            user={user}
            address={
              this.state.addresses[
                this.state.addresses.findIndex((address: IAddress) => {
                  return address._id === this.state.selectedAddress;
                })
              ]
            }
            updateAddresses={this.updateAddresses}
          />
        )}
        {addAddress && isModalInView && (
          <AddressAddModal
            close={this.closeAddAddress}
            user={user}
            updateUser={this.updateUserState}
            addresses={this.state.addresses}
            updateAddresses={this.updateAddresses}
          />
        )}
        <Modal isModalInView={isModalInView}>
          <Page>
            <PageContainer>
              <AccountNav />
              {!this.state.isFetching ? (
                <AccountInfo
                  openEditPersonal={this.openEditPersonal}
                  openEditPassword={this.openEditPassword}
                  openEditAddress={this.openEditAddress}
                  openAddAddress={this.openAddAddress}
                  openDeleteAccount={this.openDeleteAccount}
                  user={user}
                  addresses={addresses}
                  updateSelectedAddress={this.updateSelectedAddress}
                  updateAddresses={this.updateAddresses}
                  logOut={this.logOutUser}
                />
              ) : (
                <div className="flex justify-center items-center h-[70vh]">
                  <Loader />
                </div>
              )}
            </PageContainer>
          </Page>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Account;
