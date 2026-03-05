import React from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import {ReactComponent as SvgDotPatternIcon} from "../../images/dot-pattern.svg"

const Container = tw.div`relative`;
const Content = tw.div`max-w-screen-xl mx-auto py-20 lg:py-24`;

const FormContainer = styled.div`
  ${tw`p-10 sm:p-12 md:p-16 bg-primary-500 text-gray-100 rounded-lg relative`}
  form {
    ${tw`mt-4`}
  }
  h2 {
    ${tw`text-3xl sm:text-4xl font-bold`}
  }
  input,textarea {
    ${tw`w-full bg-transparent text-gray-100 text-base font-medium tracking-wide border-b-2 py-2 text-gray-100 hocus:border-pink-400 focus:outline-none transition duration-200`};

    ::placeholder {
      ${tw`text-gray-500`}
    }
  }
`;

const TwoColumn = tw.div`flex flex-col sm:flex-row justify-between`;
const Column = tw.div`sm:w-5/12 flex flex-col`;
const InputContainer = tw.div`relative py-5 mt-6`;
const Label = tw.label`absolute top-0 left-0 tracking-wide font-semibold text-sm`;
const Input = tw.input``;
const Select = tw.select`w-full bg-transparent text-gray-100 text-base font-medium tracking-wide border-b-2 py-2 hocus:border-pink-400 focus:outline-none transition duration-200`;
const Option = tw.option`w-full bg-transparent text-black text-base font-medium tracking-wide border-b-2 py-2 hocus:border-pink-400 focus:outline-none transition duration-200`;;
const TextArea = tw.textarea`h-24 sm:h-full resize-none`;
const SubmitButton = tw.button`w-full sm:w-32 mt-6 py-3 bg-gray-100 text-primary-500 rounded-full font-bold tracking-wide shadow-lg uppercase text-sm transition duration-300 transform focus:outline-none focus:shadow-outline hover:bg-gray-300 hover:text-primary-700 hocus:-translate-y-px hocus:shadow-xl`;

const SvgDotPattern1 = tw(SvgDotPatternIcon)`absolute bottom-0 right-0 transform translate-y-1/2 translate-x-1/2 -z-10 opacity-50 text-primary-500 fill-current w-24`

const backendUrl = `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/posts`;

const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })
    .then(response => {
      if (response.status === 201) {
        alert('Post created successfully!');
      }
    });
  } catch (error) {
    console.error('Error:', error);
  }
};
export default () => {
  return (
    <Container>
      <Content>
        <FormContainer>
          <div tw="mx-auto max-w-4xl">
            <h2>Create a post</h2>
            <form onSubmit={handleSubmit}>
              <TwoColumn>
                <Column>
                  <InputContainer>
                    <Label htmlFor="title-input">Title</Label>
                    <Input id="title-input" type="text" name="title" placeholder="Title" />
                  </InputContainer>
                  <InputContainer>
                    <Label htmlFor="lostAt-input">Where the animal was lost</Label>
                    <Input id="lostAt-input" type="text" name="lostAt" placeholder="E.g. Plovdiv Centre" />
                  </InputContainer>
                  <InputContainer>
                    <Label htmlFor="category-input">Category</Label>
                    <Select id="category-input" name="category">
                      <Option value="dog">Dog</Option>
                      <Option value="cat">Cat</Option>
                      <Option value="parrot">Parrot</Option>
                      <Option value="snake">Snake</Option>
                    </Select>
                  </InputContainer>
                </Column>
                <Column>
                  <InputContainer tw="flex-1">
                    <Label htmlFor="description-input">Description</Label>
                    <TextArea id="description-input" name="description" placeholder="Post description"/>
                  </InputContainer>
                  <InputContainer>
                    <Label htmlFor="image-input">Image</Label>
                    <Input id="image-input" type="file" name="image"/>
                  </InputContainer>
                </Column>
              </TwoColumn>

              <SubmitButton type="submit" value="Submit">Submit</SubmitButton>
            </form>
          </div>
          <SvgDotPattern1 />
        </FormContainer>
      </Content>
    </Container>
  );
};
