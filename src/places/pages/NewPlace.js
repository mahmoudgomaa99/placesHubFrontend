import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import styled, { createGlobalStyle } from "styled-components";
import Input from "../components/input";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../utils/validators.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "../../shared/components/form-hook";
import { useHttpCleint } from "../../shared/components/http-hook";
import ErrorModal from "../../users/components/ErrorModal";
import * as reactBootstrap from "react-bootstrap";

const GlobalStyling = createGlobalStyle`
html{
  height:100%;
}
body{
  font-family:Arial, Helvetica, sans-serif;
  /* background: linear-gradient(to bottom, #ee9ca7, #ffdde1); */
  margin:0;
  height:100vh;
  color:#555;
}
`;

export const Form = styled.form`
  width: 100%;
  max-width: 700px;
  padding: 40px;
  background-color: #fff;
  border-radius: 10px;
  box-sizing: border-box;
  z-index: 0;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);
`;

export const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  padding: 0 20px;
`;

export const Button = styled.button`
  background: ${({ disabled }) => (disabled ? "#d3d3d3" : "#ee9ca7")};
  color: ${({ disabled }) => (disabled ? "#fff" : "#000")};
  font-weight: 600;
  border: 1px solid ${({ disabled }) => (disabled ? "#d3d3d3" : "#ee9ca7")};
  transition: 0.2s ease-in-out;
  margin-left: 5px;
  padding: 8px 16px;
  &:hover {
    background: ${({ disabled }) => (disabled ? "#d3d3d3" : "#fff")};
    transition: 0.2s ease-in-out;
  }
`;

const NewPlaces = () => {
  const auth = useContext(AuthContext);
  const { isError, isLoading, error, errorHandler, sendRequset, setIsError } =
    useHttpCleint();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await sendRequset(
        "http://localhost:4000/api/places",
        "POST",
        JSON.stringify({
          headline: formState.inputs.title.value,
          description: formState.inputs.description.value,
          address: formState.inputs.address.value,
          creatorid: auth.userId,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      history.push("/");
    } catch (error) {}
  };
  return (
    <>
      {isError && (
        <ErrorModal
          showModal={isError}
          setShowModal={setIsError}
          header={"something went wrong"}
          body={error}
          buttonText={"cancel"}
          oncancel={errorHandler}
        />
      )}
      <GlobalStyling />
      <FormWrapper>
        <Form onSubmit={submitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            errorText="please enter valid Title"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
          />
          <Input
            id="address"
            element="input"
            type="text"
            label="Address"
            errorText="please enter valid Address"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
          />
          <Input
            id="description"
            element="textarea"
            label="description"
            errorText="please enter valid description(at least 5 characters)"
            validators={[VALIDATOR_MINLENGTH(5)]}
            onInput={inputHandler}
          />
          {isLoading && <reactBootstrap.Spinner animation="grow" />}
          <Button type="submit" disabled={!formState.isValid}>
            Add place
          </Button>
        </Form>
      </FormWrapper>
    </>
  );
};
export default NewPlaces;
