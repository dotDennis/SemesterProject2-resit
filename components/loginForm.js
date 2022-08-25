import { useForm } from "react-hook-form";
import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { BASE_URL } from "../constants/api";
import { saveToken, saveUser } from "../utils/storage";
import Router from "next/router";

const schema = yup.object().shape({
  username: yup.string().required("Please enter your username"),
  password: yup.string().required("Please enter your password"),
});

export default function LoginForm() {
  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function onSubmit(data) {
    console.log(data);
    setSubmitting(true);
    setLoginError(null);

    try {
      const response = await axios.post(BASE_URL + "jwt-auth/v1/token", {
        username: data.username,
        password: data.password,
      });
      console.log(response);

      if (response.status === 200) {
        console.log(response);
        console.log("hello");
      }
    } catch (error) {
      if (error.response.status === 400) {
        setLoginError("Username and password did not match.");
        console.log("didnt match");
      } else {
        console.log("cant reach server");
        setLoginError("Seems like we're having some troubles, please try again later!");
      }
      console.log(errors);
    } finally {
      setSubmitting(false);
      console.log("ran");
    }
  }

  return (
    <>
      <Container>
        <form className="formc--login rounded" onSubmit={handleSubmit(onSubmit)}>
          {loginError && <span>{loginError}</span>}
          <fieldset disabled={submitting}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <input className="form-control" {...register("username")} />
              {errors.username && <span>{errors.username.message}</span>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <input type="password" className="form-control" {...register("password")} />
              {errors.password && <span>{errors.password.message}</span>}
            </Form.Group>
            <button className="form-control btn-primary">{submitting ? "Logging in..." : "Log in"}</button>
          </fieldset>
        </form>
      </Container>
    </>
  );
}
