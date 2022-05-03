import React, { useContext } from "react";
import NextLink from "next/link";
import { UserObjectType } from "../src/types";
import {
  Avatar,
  Box,
  Flex,
  Link,
  Button,
  Divider,
  Text,
  Image as ChakraImage
} from "@chakra-ui/react";
import { Mail } from "iconoir-react";
import { useAuthState } from "../src/context/auth";

import TimeAgo from "react-timeago";
// @ts-ignore
import frenchStrings from "react-timeago/lib/language-strings/fr";
// @ts-ignore
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

interface UserCardProps {
  user: UserObjectType;
  mutate: Function;
}

const baseUrl = "http://localhost:5500/api/auth/";
function UserCard({ user, mutate }: UserCardProps) {
  const promoteUser = async () => {
    console.log("promote");
    const url = `${baseUrl}promote/${user.username}`;
    const res = await fetch(url, { method: "POST", credentials: "include" });
    const result = await res.json();
    mutate();
    console.log(result);
  };

  const demoteUser = async () => {
    console.log("demote");
    const url = `${baseUrl}demote/${user.username}`;
    const res = await fetch(url, { method: "POST", credentials: "include" });
    const result = await res.json();
    mutate();
    console.log(result);
  };

  const deactivateUser = async () => {
    console.log("deactivate");
    const url = `${baseUrl}deactivate/${user.username}`;
    const res = await fetch(url, { method: "POST", credentials: "include" });
    const result = await res.json();
    mutate();
    console.log(result);
  };

  const reactivateUser = async () => {
    console.log("reactivate");
    const url = `${baseUrl}reactivate/${user.username}`;
    const res = await fetch(url, { method: "POST", credentials: "include" });
    const result = await res.json();
    mutate();
    console.log(result);
  };

  const deleteUser = async () => {
    console.log("delete");
    const url = `${baseUrl}delete/${user.username}`;
    const res = await fetch(url, { method: "DELETE", credentials: "include" });
    const result = await res.json();
    mutate();
    console.log(result);
  };

  const annihilateUser = async () => {
    console.log("annihilate");
    const url = `${baseUrl}annihilate/${user.username}`;
    const res = await fetch(url, { method: "DELETE", credentials: "include" });
    const result = await res.json();
    mutate();
    console.log(result);
  };

  const { user: sessionUser } = useAuthState();
  const formatter = buildFormatter(frenchStrings);
  return (
    <Box maxW={"2xl"} mt={4}>
      <Flex
        justifyContent={"space-between"}
        alignItems={"flex-start"}
        mr={8}
        mt={8}
      >
        <Box>
          <Flex alignItems={"center"} gap={4}>
            <NextLink passHref href={`/u/${user.username}`}>
              <Link color={"none"} fontSize={"xl"}>
                {user.username}{" "}
              </Link>
            </NextLink>
            <Link href={`mailto:${user.email}`}>
              <Box mt={1}>
                <Mail />
              </Box>
            </Link>
          </Flex>
          <Text fontSize={"sm"}>
            active depuis{" "}
            <TimeAgo date={user.createdAt} formatter={formatter} />
          </Text>
          <Box mt="2">{user.body}</Box>
        </Box>
        <Link href={`/u/${user.username}`}>
          <Avatar
            name={user.username}
            src={`http://localhost:5500/images/${user.imageUrn}`}
          />
        </Link>
      </Flex>
      {sessionUser && sessionUser.isAdmin ? (
        <Box mt={4}>
          <Button
            onClick={user.isAdmin ? demoteUser : promoteUser}
            colorScheme={user.isAdmin ? "red" : "green"}
            size={"xs"}
          >
            {user.isAdmin ? "Demote" : "Promote"}
          </Button>
          <Button
            onClick={user.isActive ? deactivateUser : reactivateUser}
            mx={4}
            size={"xs"}
            colorScheme={user.isActive ? "red" : "green"}
          >
            {user.isActive ? "Deactivate" : "Reactivate"}
          </Button>

          <Button onClick={deleteUser} size={"xs"} colorScheme={"red"}>
            Delete
          </Button>
          <Button onClick={annihilateUser} ml={4} size={"xs"}>
            Annihilate
          </Button>
        </Box>
      ) : null}
    </Box>
  );
}

export default UserCard;
