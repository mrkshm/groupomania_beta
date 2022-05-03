import React, { useContext } from "react";
import {
  Box,
  Container,
  Flex,
  Image as ChakraImage,
  Spinner
} from "@chakra-ui/react";
import Header from "../../components/Header";
import UserCard from "../../components/UserCard";
import { UserObjectType } from "../../src/types";
import useSWR from "swr";
import fetcher from "../../src/utils/fetcher";
import MetaHead from "../../components/MetaHead";
import { useAuthState } from "../../src/context/auth";

import NotAuthMessage from "../../components/NotAuthMessage";

function UserList() {
  const { user, authenticated } = useAuthState();

  //  Get userlist with swr
  const swrUrl = `http://localhost:5500/api/auth/users`;
  const { data, mutate, error } = useSWR(swrUrl, fetcher);
  if (error) {
    console.log(error);
  }

  if (!authenticated) {
    return <NotAuthMessage />;
  } else {
    return (
      <Container maxW="container.xl" p={0}>
        <MetaHead />
        <Header />
        <Flex ml={{ base: 6, sm: 0 }} justifyContent={"center"}>
          <Box>
            {data ? (
              data
                ?.filter(
                  user && user.isAdmin
                    ? (user: UserObjectType) => user
                    : (user: UserObjectType) => user.isActive
                )
                .map((user: UserObjectType) => (
                  <UserCard user={user} key={user.username} mutate={mutate} />
                ))
            ) : (
              <Spinner />
            )}
          </Box>
        </Flex>
      </Container>
    );
  }
}

export default UserList;
