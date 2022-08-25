import { useForm } from "react-hook-form";
import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { BASE_URL } from "../constants/api";
import { redirect } from "next/dist/server/api-utils";

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
    setSubmitting(true);
    setLoginError(null);

    axios
      .post(`${BASE_URL}jwt-auth/v1/token`, {
        username: data.username,
        password: data.password,
      })
      .then((res) => {
        if (undefined === res.data.token) {
          setLoginError(res.data.message);
          setSubmitting(false);
          console.log(res.data.message);
        }
        setSubmitting(false);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userName", res.data.user_nicename);
        localStorage.setItem("userEmail", res.data.user_email);
        localStorage.setItem("displayName", res.data.user_display_name);

        location.href = "../article/html-classes";
      })
      .catch((err) => {
        setLoginError(err.response.data.message);
        setSubmitting(false);
      });
  }

  return (
    <>
      <Container>
        <form className="formc--login rounded" onSubmit={handleSubmit(onSubmit)}>
          {loginError && <span dangerouslySetInnerHTML={{ __html: loginError }}></span>}
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
