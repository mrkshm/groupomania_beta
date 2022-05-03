import React from "react";
import type { NextPage } from "next";
import { Container, Flex } from "@chakra-ui/react";
import LoginComp from "../components/LoginComp";
import Intro from "../components/Intro";
import HeaderSignup from "../components/HeaderSignup";
import { useRouter } from "next/router";
import { useAuthDispatch, useAuthState } from "../src/context/auth";

const Login: NextPage = () => {
  const router = useRouter();
  const dispatch = useAuthDispatch();
  const { authenticated } = useAuthState();

  if (authenticated) router.push("/");

  return (
    <Container maxW="container.xl" p={0}>
      <HeaderSignup />
      <Flex py={[0, 8, 0]} direction={{ base: "column", md: "row" }}>
        <LoginComp dispatch={dispatch} />
        <Intro />
      </Flex>
    </Container>
  );
};

export default Login;
