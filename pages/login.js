import Layout from "../components/layout/Layout";
import Head from "../components/layout/Head";
import Heading from "../components/layout/Heading";
import LoginForm from "../components/LoginForm";
import checkToken from "../constants/checkToken";

if (checkToken()) {
  location.href = "/admin/dashboard";
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
