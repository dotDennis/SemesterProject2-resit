import Heading from "../../components/layout/Heading";
import Head from "../../components/layout/Head";
import Layout from "../../components/layout/Layout";
import Container from "react-bootstrap/Container";
import checkToken from "../../constants/checkToken";
import NewArticle from "../../components/NewArticle";

if (checkToken() === false) {
  location.href = "/login";
}

export default function Create() {
  return (
    <>
      <Layout>
        <Head title="New Article" />
        <Heading title="New Article" />
        <Container>
          <NewArticle />
        </Container>
      </Layout>
    </>
  );
}
