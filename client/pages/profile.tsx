import React, { useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Container, Flex, Box } from "@chakra-ui/react";
import Head from "next/head";
import Header from "../components/Header";
import { useStore } from "../src/context/SessionStore";
import UserSidebar from "../components/UserSidebar";
import fetcher from "../src/utils/fetcher";
import UserPosts from "../components/UserPosts";
import UserComments from "../components/UserComments";
import { useAuthState } from "../src/context/auth";
import NotAuthMessage from "../components/NotAuthMessage";

function Profile() {
  const router = useRouter();
  const { user, authenticated } = useAuthState();

  if (!user || !authenticated) {
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
          gap={{ base: 0, sm: 4 }}
        >
          <Box w={{ base: "100%", sm: "50%" }} p={4}>
            <UserPosts user={user} />
            <UserComments user={user} />
          </Box>
          <Box w={{ base: "100%", sm: "35%" }}>
            <UserSidebar user={user} />
          </Box>
        </Flex>
      </Container>
    );
  }
}

export default Profile;
