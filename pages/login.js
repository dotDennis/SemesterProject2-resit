import Layout from "../components/layout/Layout";
import Head from "../components/layout/Head";
import Heading from "../components/layout/Heading";
import LoginForm from "../components/LoginForm";
import checkToken from "../constants/checkToken";

if (checkToken()) {
  location.href = "/";
  alert("You're already logged in");
}

export default function Login() {
  return (
    <Layout>
      <Head title="Login" />
      <Heading title="Login" />
      <LoginForm />
    </Layout>
  );
}
