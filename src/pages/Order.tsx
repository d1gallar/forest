import React, { Component } from "react";
import AccountNav from "../components/AccountNav";
import OrderList from "../components/OrderList";
import Page from "../components/Page";
import PageContainer from "../components/PageContainer";

class Order extends Component {
  render() {
    return (
      <Page>
        <PageContainer>
          <AccountNav />
          <OrderList />
        </PageContainer>
      </Page>
    );
  }
}

export default Order;
