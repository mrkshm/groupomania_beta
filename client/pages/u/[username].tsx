import React from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import {
  Container,
  Flex,
  Box,
  Heading,
  Image as ChakraImage
} from "@chakra-ui/react";
import Head from "next/head";
import Header from "../../components/Header";
import PostCard from "../../components/PostCard";
import UserSidebar from "../../components/UserSidebar";
import CommentCard from "../../components/CommentCard";
import { PostType, CommentType, UserObjectType } from "../../src/types";
import { useAuthState } from "../../src/context/auth";
import NotAuthMessage from "../../components/NotAuthMessage";
import fetcher from "../../src/utils/fetcher";

function Profile() {
  const { authenticated } = useAuthState();

  const router = useRouter();
  const { username } = router.query;

  const getUserUrl = `http://localhost:5500/api/auth/profile/${username}`;
  const getUserPostsUrl = `http://localhost:5500/api/posts/posts/from/${username}`;
  const getUserCommentsUrl = `http://localhost:5500/api/posts/comments/from/${username}`;

  const { data: user, error: userFetchError } = useSWR(getUserUrl, fetcher);
  const { data: userPosts, error: userPostsError } = useSWR(
    getUserPostsUrl,
    fetcher
  );
  const {
    data: userComments,
    mutate: userCommentmutate,
    error: userCommentError
  } = useSWR(getUserCommentsUrl, fetcher);

  if (userFetchError) {
    console.log(userFetchError);
  }

  if (userPostsError) {
    console.log(userPostsError);
  }
  if (userCommentError) {
    console.log(userCommentError);
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
          flexDirection={{ base: "column-reverse", sm: "row" }}
          justifyContent="center"
          alignItems="flex-start"
          gap={4}
        >
          <Box w={{ base: "100%", sm: "50%" }} p={4}>
            <Box my={8}>
              <Heading size={"md"} mb={8}>
                Les posts de {username}
              </Heading>
              {userPosts ? (
                userPosts.map((post: PostType) => (
                  <PostCard post={post} key={post.identifier} />
                ))
              ) : (
                <h1>Loading...</h1>
              )}
            </Box>
            <Box my={8}>
              <Heading size={"md"} mb={8}>
                Les commentaires de {username}
              </Heading>

              {userComments ? (
                userComments.map((comment: CommentType) => (
                  <CommentCard
                    comments={userComments}
                    comment={comment}
                    key={comment.identifier}
                    mutate={userCommentmutate}
                  />
                ))
              ) : (
                <h1>Loading...</h1>
              )}
            </Box>
          </Box>
          <Box w={{ base: "100%", sm: "35%" }}>
            {user ? <UserSidebar user={user} /> : "Loading"}
          </Box>
        </Flex>
      </Container>
    );
  }
}

export default Profile;
