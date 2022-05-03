import React, { useState } from "react";
// import { useRouter } from "next/router";
import useSWR from "swr";
import { useFormik } from "formik";
import {
  Container,
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Link,
  Text,
  Image as ChakraImage
} from "@chakra-ui/react";
import Head from "next/head";
import Header from "../components/Header";
import PostCard from "../components/PostCard";
import UserSidebar from "../components/UserSidebar";
import CommentCard from "../components/CommentCard";
import UserPosts from "../components/UserPosts";
import UserComments from "../components/UserComments";
import { PostType, CommentType, UserObjectType } from "../src/types";
import { Mail } from "iconoir-react";
import TimeAgo from "react-timeago";
// @ts-ignore
import frenchStrings from "react-timeago/lib/language-strings/fr";
// @ts-ignore
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

function Profile() {
  const [initialValues, setInitialValues] = useState({
    username: "",
    email: "",
    imageUrn: "",
    body: ""
  });
  const formatter = buildFormatter(frenchStrings);
  // const router = useRouter();
  const getMeUrl = "http://localhost:5500/api/auth/me";
  const fetcher = (url: string) =>
    fetch(url, { method: "GET", credentials: "include" })
      .then(res => res.json())
      .catch();

  const { data, error } = useSWR(getMeUrl, fetcher);
  if (error) {
    console.log(error);
  }

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: values => {
      console.log(values);
    }
  });

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
      <Box>
        <Heading>FORMING</Heading>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              type={"text"}
              id="username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
            />
          </FormControl>
        </form>
      </Box>
      <Flex
        flexDirection={{ base: "column", sm: "row" }}
        justifyContent="center"
        alignItems="flex-start"
        gap={4}
      >
        <Box w={{ base: "100%", sm: "50%" }} p={4}>
          {data ? <UserPosts user={data} /> : "Loading"}
          {data ? <UserComments user={data} /> : "Loading"}
        </Box>
        <Box w={{ base: "100%", sm: "35%" }}>
          {/* @ts-ignore */}
          {data ? <UserSidebar user={data} /> : "Loading"}
        </Box>
      </Flex>
    </Container>
  );
}

export default Profile;
