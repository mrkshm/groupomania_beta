import type { NextPage } from "next";
import { Container, Flex } from "@chakra-ui/react";
import Signup from "../components/Signup";
import Intro from "../components/Intro";
import HeaderSignup from "../components/HeaderSignup";
import { useAuthDispatch, useAuthState } from "../src/context/auth";
import { useRouter } from "next/router";

const Register: NextPage = () => {
  const router = useRouter();
  const dispatch = useAuthDispatch();
  const { authenticated } = useAuthState();

  if (authenticated) router.push("/");

  return (
    <Container maxW="container.xl" p={0}>
      <HeaderSignup />
      <Flex h="100vh" py={0}>
        <Signup dispatch={dispatch} />
        <Intro />
      </Flex>
    </Container>
  );
};

export default Register;
