import React from "react";
import GlobalStyles from 'styles/GlobalStyles';
import { css } from "styled-components/macro"; //eslint-disable-line

import LandingPage from "pages/LandingPage.js";


import LoginPage from "pages/Login.js";
import SignupPage from "pages/Signup.js";
import PostsIndexPage from "pages/PostsIndex.js";
import CreatePostPage from "pages/CreatePost.js";
import UserPosts from "pages/UserPosts.js";

import PostViewPage from "pages/PostView.js";
import ProfilePage from "pages/Profile.js";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  // If you want to disable the animation just use the disabled `prop` like below on your page's component
  // return <AnimationRevealPage disabled>xxxxxxxxxx</AnimationRevealPage>;


  return (
    <>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/posts/:postId" element={<PostViewPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/posts" element={<PostsIndexPage />} />
          <Route path="/createPost" element={<CreatePostPage />} />
          <Route path="/userPosts" element={<UserPosts />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </Router>
    </>
  );
}
