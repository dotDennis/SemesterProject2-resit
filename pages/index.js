// Components
import Link from "next/link";
import Image from "next/image";
import Head from "../components/layout/Head";
import Layout from "../components/layout/Layout";
import Heading from "../components/layout/Heading";
// Bootstrap Components
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
// Other
import { BASE_URL } from "../constants/api";
import SearchBar from "../components/SearchBar";

export default function Index({ articles }) {
  return (
    <Layout>
      <Head />
      <main className="container-fluid">
        <Heading title="OneCoder" />
        <Container className="d-flex flex-column align-items-center  container--search ">
          <SearchBar placeholder={"Search..."} data={articles} />
        </Container>
      </main>

      <Row className="container justify-content-center justify-content-md-between justify-content-lg-between gx-0 gy-5 mb-5 mx-auto mt-3">
        {articles.map((article) => {
          console.log(article);

          const date = new Date(article.modified);
          const format = { day: "numeric", month: "numeric", year: "numeric" };
          const dateFormatted = date.toLocaleString("en-GB", format);

          return (
            <div className="card mb-4 rounded" key={article.id} style={{ width: "25rem" }}>
              <div className="card-img-container position-relative w-100 h-100">
                <Image className="card-img-top" src={article._embedded["wp:featuredmedia"][0].media_details.sizes["post-thumbnail"].source_url} layout="fill" objectFit="cover" />
              </div>
              <div className="p-3 pb-0 d-flex flex-column justify-content-space-between h-100">
                <div className="d-flex gap-1">
                  <span className="badge rounded-pill text-bg-primary">{article._embedded["wp:term"][0][0].name}</span>
                  {article._embedded["wp:term"][1].map((tag) => {
                    console.log(tag);
                    return (
                      <span key={tag.name + article.id} className="badge rounded-pill text-bg-primary">
                        {tag.name}
                      </span>
                    );
                  })}
                </div>
                <h2>{article.title.rendered}</h2>
                <div className="d-flex flex-column" dangerouslySetInnerHTML={{ __html: article.excerpt.rendered }}></div>
                <p className="d-flex mt-auto">Last updated {dateFormatted}</p>
              </div>
              <Link href={`/article/${article.slug}`}>
                <a className="card__link--cover"></a>
              </Link>
            </div>
          );
        })}
      </Row>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const response = await fetch(BASE_URL + "wp/v2/posts?_embed");
    const resData = await response.json();
    return {
      props: {
        articles: resData,
      },
    };
  } catch (error) {
    console.log(error);
  }
}
