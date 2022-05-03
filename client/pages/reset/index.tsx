import type { NextPage } from "next";
import { Container, Flex } from "@chakra-ui/react";
import Intro from "../../components/Intro";
import Headersignup from "../../components/HeaderSignup";
import PasswordReset from "../../components/PasswordReset";
import { useRouter } from "next/router";

const Reset: NextPage = () => {
  const query = useRouter();
  // const { username, token } = query.query;

  return (
    <Container maxW="container.xl" h="100vh" p={0}>
      {/* <Logo h="20vmin" pointerEvents="none" /> */}
      <Headersignup />
      <Flex py={[0, 8, 0]} direction={{ base: "column", md: "row" }}>
        <PasswordReset />
        <Intro />
      </Flex>
    </Container>
  );
};

export default Reset;
