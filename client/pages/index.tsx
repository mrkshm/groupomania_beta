import type { NextPage } from "next";
import Head from "next/head";
import { Container, Box, Flex } from "@chakra-ui/react";
import { useAuthState } from "../src/context/auth";
import NotAuthMessage from "../components/NotAuthMessage";

import Header from "../components/Header";
import Feed from "../components/Feed";
import Input from "../components/Input";
import Tags from "../components/Tags";
import News from "../components/News";

const Home: NextPage = articles => {
  const { authenticated } = useAuthState();

  if (!authenticated) {
    return <NotAuthMessage />;
  } else {
    return (
      <Container maxW="container.xl" p={0}>
        <Head>
          <title>Groupomania</title>
          <meta
            name="description"
            content="Le reseau social de votre entreprise."
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />
        <Flex
          flexDirection={{ base: "column-reverse", sm: "row" }}
          justifyContent="center"
          alignItems="flex-start"
          gap={4}
        >
          <Box w={{ base: "100%", sm: "50%" }} p={4}>
            <Input />
            <Feed />
          </Box>
          <Box w={{ base: "100%", sm: "35%" }}>
            <Box w={{ base: "100%" }} p={4}>
              <Tags />
            </Box>

            <Box
              display={{ base: "none", sm: "unset" }}
              w={{ base: "100%", sm: "100%" }}
              my={4}
              p={4}
            >
              <News articles={articles} />
            </Box>
          </Box>
        </Flex>
      </Container>
    );
  }
};

export default Home;

export async function getServerSideProps() {
  // get news
  const results = await fetch(
    `https://newsapi.org/v2/top-headlines?country=fr&apiKey=${process.env.NEWS_KEY}`
  ).then(res => res.json());
  return {
    props: {
      articles: results.articles
    }
  };
}
