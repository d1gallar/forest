import React, { Component } from "react";
import PageContainer from "../components/PageContainer";
import AccountNav from "../components/AccountNav";
import Page from "../components/Page";
import LikeList from "../components/LikeList";


class Likes extends Component {
  render() {
    return (
      <Page>
        <PageContainer>
          <AccountNav />
          <LikeList />
        </PageContainer>
      </Page>
    );
  }
}

export default Likes;
