import Heading from "../../../components/layout/Heading";
import Head from "../../../components/layout/Head";
import Layout from "../../../components/layout/Layout";
import Container from "react-bootstrap/Container";
import checkToken from "../../../constants/checkToken";
import EditArticle from "../../../components/EditArticle";
import { BASE_URL } from "../../../constants/api";

if (checkToken() === false) {
  location.href = "/login";
}

export default function Create({ article }) {
  return (
    <>
      <Layout>
        <Head title={"EDIT: " + article[0].title.rendered} />
        <Heading title="Edit Article" />
        <Container>
          <EditArticle article={article} />
        </Container>
      </Layout>
    </>
  );
}

export async function getStaticProps({ params }) {
  const results = await fetch(`${BASE_URL}wp/v2/posts?slug=${params.slug}&_embed`).then((r) => r.json());
  return {
    props: {
      article: results,
    },
  };
}

export async function getStaticPaths() {
  const articles = await fetch(`${BASE_URL}wp/v2/posts`).then((r) => r.json());
  return {
    paths: articles.map((article) => {
      return {
        params: {
          slug: article.slug,
        },
      };
    }),
    fallback: false,
  };
}
