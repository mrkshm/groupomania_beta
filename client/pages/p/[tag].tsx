import React from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import {
  Container,
  Flex,
  Box,
  Heading,
  Link,
  Text,
  Image as ChakraImage
} from "@chakra-ui/react";
import Head from "next/head";
import Header from "../../components/Header";
import PostCard from "../../components/PostCard";
import CommentCard from "../../components/CommentCard";
import { PostType, CommentType } from "../../src/types";
import fetcher from "../../src/utils/fetcher";
import TimeAgo from "react-timeago";
// @ts-ignore
import frenchStrings from "react-timeago/lib/language-strings/fr";
// @ts-ignore
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { useAuthState } from "../../src/context/auth";
import NotAuthMessage from "../../components/NotAuthMessage";

function TagPage() {
  const formatter = buildFormatter(frenchStrings);
  const { authenticated } = useAuthState();
  const router = useRouter();

  const { tag } = router.query;
  const getPostsWithTagsUrl = `http://localhost:5500/api/posts/with/tag/${tag}`;
  const { data, error } = useSWR(getPostsWithTagsUrl, fetcher);
  if (error) {
    console.log(error);
  }

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
          flexDirection={{ base: "column", sm: "row" }}
          justifyContent="center"
          alignItems="flex-start"
          gap={4}
        >
          <Box w={{ base: "100%", sm: "50%" }} p={4}>
            <Box my={8}>
              <Heading size={"md"} mb={8}>
                Tous les posts pour le tag {tag}
              </Heading>
              {data ? (
                data.map((post: PostType) => (
                  <PostCard post={post} key={post.identifier} />
                ))
              ) : (
                <h1>Loading...</h1>
              )}
            </Box>
          </Box>
          <Box w={{ base: "100%", sm: "35%" }}>
            <Box w={{ base: "100%" }} p={4}>
              <Heading>{tag}</Heading>
              <Text fontSize={"sm"}>
                {/* active depuis{" "} */}
                {/* <TimeAgo date={user.createdAt} formatter={formatter} /> */}
              </Text>
            </Box>
          </Box>
        </Flex>
      </Container>
    );
  }
}

export default TagPage;
