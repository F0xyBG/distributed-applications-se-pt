import React from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import tw from "twin.macro";
import styled from "styled-components"; //eslint-disable-line
import { css } from "styled-components/macro"; //eslint-disable-line
import Header from "components/headers/light.js";
import Footer from "components/footers/FiveColumnWithInputForm.js";
import CreatePostForm from "components/forms/CreatePostForm";


export default () => {
  return (
    <AnimationRevealPage>
      <Header />
        <CreatePostForm />
      <Footer />
    </AnimationRevealPage>
  );
};
