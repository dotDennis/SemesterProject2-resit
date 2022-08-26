import Head from "../../components/layout/Head";
import Layout from "../../components/layout/Layout";
import Heading from "../../components/layout/Heading";
import { BASE_URL } from "../../constants/api";
import Image from "next/image";
import Container from "react-bootstrap/Container";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Accomodation({ article }) {
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem("token")) {
      setShowEdit(true);
    }
  }, [showEdit]);

  return (
    <Layout>
      <Head title={article[0].title.rendered} />
      <Container className="article__featured--img mb-5">
        <Image src={article[0]._embedded["wp:featuredmedia"][0].media_details.sizes["post-thumbnail"].source_url} layout="fill" objectFit="cover" />
      </Container>
      <Container className="d-flex justify-content-between">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>
            <li className="breadcrumb-item active">Article</li>
            <li className="breadcrumb-item active" aria-current="page">
              {article[0].title.rendered}
            </li>
          </ol>
        </nav>
        {showEdit && (
          <>
            <Link href={"/admin/edit/" + article[0].slug}>
              <a>Edit</a>
            </Link>
          </>
        )}
      </Container>
      <Heading title={article[0].title.rendered} />
      <Container dangerouslySetInnerHTML={{ __html: article[0].content.rendered }} className="container mt-5"></Container>
    </Layout>
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
  console.log(articles);
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
