import React from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import tw from "twin.macro";
import styled from "styled-components"; //eslint-disable-line
import { css } from "styled-components/macro"; //eslint-disable-line
import Header from "components/headers/light.js";
import Footer from "components/footers/FiveColumnWithInputForm.js";
import CreatePostForm from "components/forms/CreatePostForm";
import Cookies from 'js-cookie';
import { Navigate } from "react-router-dom";

export default () => {
  const userId = Cookies.get("user_id");

  if (!userId) {
    console.log("User ID:", userId);
    return <Navigate to="/" replace />;
  }
  
  return (
    <AnimationRevealPage>
      <Header />
        <CreatePostForm />
      <Footer />
    </AnimationRevealPage>
  );
};
