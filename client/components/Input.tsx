import React from "react";
import { useAuthState } from "../src/context/auth";

import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Box,
  Input as ChakraInput,
  Icon,
  Flex
} from "@chakra-ui/react";
import { AddMediaImage } from "iconoir-react";
import { useRouter } from "next/router";

function Input() {
  const router = useRouter();
  const { user } = useAuthState();

  const createPost = () => {
    router.push("/create");
  };
  return (
    <Box width={{ base: "100%", sm: "90%" }}>
      <Flex onClick={createPost} gap={4} alignItems={"center"}>
        <Avatar
          name={user.username}
          src={`http://localhost:5500/images/${user.imageUrn}`}
        />
        <ChakraInput placeholder="Créer une publication" size="lg" />
        <AddMediaImage fontSize={"28"} />
      </Flex>
    </Box>
  );
}

export default Input;
