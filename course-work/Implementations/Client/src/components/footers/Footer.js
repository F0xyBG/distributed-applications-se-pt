import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import {Container as ContainerBase } from "components/misc/Layouts.js"
import Cookies from "js-cookie";
import logo from "../../images/logo.svg";
import { ReactComponent as FacebookIcon } from "../../images/facebook-icon.svg";
import { ReactComponent as TwitterIcon } from "../../images/twitter-icon.svg";
import { ReactComponent as YoutubeIcon } from "../../images/youtube-icon.svg";


const Container = tw(ContainerBase)`bg-gray-900 text-gray-100 -mx-8 -mb-8`
const Content = tw.div`max-w-screen-xl mx-auto py-20 lg:py-24`;

const Row = tw.div`flex items-center justify-center flex-col px-8`

const LogoContainer = tw.div`flex items-center justify-center md:justify-start`;
const LogoImg = tw.img`w-8`;
const LogoText = tw.h5`ml-2 text-2xl font-black tracking-wider`;

const LinksContainer = tw.div`mt-8 font-medium flex flex-wrap justify-center items-center flex-col sm:flex-row`
const Link = tw.a`border-b-2 border-transparent hocus:text-gray-300 hocus:border-gray-300 pb-1 transition duration-300 mt-2 mx-4`;
const PrimaryLink = tw(Link)`
  px-5 py-2 rounded bg-primary-500 text-gray-100 border-b-0
  hocus:bg-primary-700 hocus:text-gray-200
`;

const SocialLinksContainer = tw.div`mt-10`;
const SocialLink = styled.a`
  ${tw`cursor-pointer inline-block text-gray-100 hover:text-gray-500 transition duration-300 mx-4`}
  svg {
    ${tw`w-5 h-5`}
  }
`;

const CopyrightText = tw.p`text-center mt-10 font-medium tracking-wide text-sm text-gray-600`

const ProcessSignOut = async () => {
  await fetch(`${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  Cookies.remove("user_id");
};

export default () => {
  const hasClientSession =
    typeof window !== "undefined" && Cookies.get("user_id") !== undefined;

  return (
    <Container>
      <Content>
        <Row>
          <LogoContainer>
            <LogoImg src={logo} />
            <LogoText>PetFinder</LogoText>
          </LogoContainer>
          <LinksContainer>
            {hasClientSession && <Link href="/">Home</Link>}
            {hasClientSession && <Link href="/posts">Posts</Link>}
            {hasClientSession && <Link href="/createPost">Create Post</Link>}
            {hasClientSession && <Link href="/userPosts">User Posts</Link>}
            {hasClientSession && <Link href="/profile">Profile</Link>}

            {!hasClientSession && <Link href="/login">Login</Link>}
            {!hasClientSession && <PrimaryLink href="/signup">Sign Up</PrimaryLink>}

            {hasClientSession && (
              <PrimaryLink href="/" onClickCapture={ProcessSignOut}>
                Sign Out
              </PrimaryLink>
            )}
          </LinksContainer>
        </Row>
        
          <CopyrightText>
            &copy; Copyright 2026, Petfinder All Rights Reserved.
          </CopyrightText>
      </Content>
    </Container>
  );
};
