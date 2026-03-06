import React from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container as ContainerBase } from "components/misc/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import illustration from "images/signup-illustration.svg";
import logo from "images/logo.svg";
import googleIconImageSrc from "images/google-icon.png";
import twitterIconImageSrc from "images/twitter-icon.png";
import { ReactComponent as SignUpIcon } from "feather-icons/dist/icons/user-plus.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Container = tw(ContainerBase)`min-h-screen bg-primary-900 text-white font-medium flex justify-center -m-8`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center flex-1`;
const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;
const LogoLink = tw.a``;
const LogoImage = tw.img`h-12 mx-auto`;
const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;
const FormContainer = tw.div`w-full flex-1 mt-8`;

const Form = tw.form`mx-auto max-w-xs`;
const Input = tw.input`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;
const ErrorText = tw.p`mt-2 text-sm text-red-600`;
const SubmitButton = styled.button`
  ${tw`mt-5 tracking-wide font-semibold bg-primary-500 text-gray-100 w-full py-4 rounded-lg hover:bg-primary-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;
const IllustrationContainer = tw.div`sm:rounded-r-lg flex-1 bg-purple-100 text-center hidden lg:flex justify-center`;
const IllustrationImage = styled.div`
  ${props => `background-image: url("${props.imageSrc}");`}
  ${tw`m-12 xl:m-16 w-full max-w-lg bg-contain bg-center bg-no-repeat`}
`;

export default ({
  logoLinkUrl = "#",
  illustrationImageSrc = illustration,
  headingText = "Sign Up For PetFinder",
  socialButtons = [
    {
      iconImageSrc: googleIconImageSrc,
      text: "Sign Up With Google",
      url: "https://google.com"
    },
    {
      iconImageSrc: twitterIconImageSrc,
      text: "Sign Up With Twitter",
      url: "https://twitter.com"
    }
  ],
  submitButtonText = "Sign Up",
  SubmitButtonIcon = SignUpIcon,
  tosUrl = "#",
  privacyPolicyUrl = "#",
  signInUrl = "/components/innerPages/LoginPage"
}) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [usernameError, setUsernameError] = useState('');
  
  const isAdult = () => {
    if (!dateOfBirth) return false;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    setUsernameError('');
    
    const backendUrl = `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/auth/register`;
    console.log('Submitting to:', backendUrl);

    fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, name, phone, isAdult: isAdult() })
    })
    .then(data => {
      if(data.ok) {
        navigate("/components/innerPages/LoginPage", { replace: true });
      } else if (data.status === 409) {
        setUsernameError('This username is already taken.');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
  <AnimationRevealPage>
    <Container>
      <Content>
        <MainContainer>
          <LogoLink href={logoLinkUrl}>
            <LogoImage src={logo} />
          </LogoLink>
          <MainContent>
            <Heading>{headingText}</Heading>
            <FormContainer>
              <Form onSubmit={handleSubmit}>
                <label htmlFor="username-input">Username</label>
                <Input
                  id="username-input"
                  type="text"
                  placeholder="Username"
                  value={username}
                  aria-invalid={Boolean(usernameError)}
                  onChange={e => {
                    setUsername(e.target.value);
                    if (usernameError) {
                      setUsernameError('');
                    }
                  }}
                  style={usernameError ? { borderColor: "#dc2626" } : undefined}
                />
                {usernameError && <ErrorText>{usernameError}</ErrorText>}
                <label htmlFor="password-input">Password</label>
                <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <label htmlFor="name-input">Name</label>
                <Input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                <label htmlFor="phone-input">Phone</label>
                <Input type="phone" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
                <label htmlFor="dateOfBirth-input">Date of Birth</label>
                <Input type="date" placeholder="Date of Birth" value={dateOfBirth} onChange={e => {setDateOfBirth(e.target.value)}} />
                <SubmitButton type="submit">
                  <SubmitButtonIcon className="icon" />
                  <span className="text">{submitButtonText}</span>
                </SubmitButton>
                <p tw="mt-8 text-sm text-gray-600 text-center">
                  Already have an account?{" "}
                  <a href={signInUrl} tw="border-b border-gray-500 border-dotted">
                    Sign In
                  </a>
                </p>
              </Form>
            </FormContainer>
          </MainContent>
        </MainContainer>
        <IllustrationContainer>
          <IllustrationImage imageSrc={illustrationImageSrc} />
        </IllustrationContainer>
      </Content>
    </Container>
  </AnimationRevealPage>
);
}
