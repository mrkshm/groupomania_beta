import React, { useEffect, useState } from "react";
import { Logo } from "./Logo";
import {
  Input,
  IconButton,
  Flex,
  Box,
  Image,
  Divider,
  Badge,
  Text,
  LinkBox,
  LinkOverlay,
  useColorModeValue
} from "@chakra-ui/react";
import { Search } from "iconoir-react";
import Menu from "./Menu";
import { PostType } from "../src/types";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [postResults, setPostResults] = useState<PostType[]>([]);
  const bgColor = useColorModeValue("gray.100", "gray.700");

  const [timer, setTimer] = useState<any>();

  useEffect(() => {
    const searchPosts = async () => {
      clearTimeout(timer);
      const url = `http://localhost:5500/api/posts/search/${searchTerm}`;

      const res = await fetch(url, { method: "GET", credentials: "include" });
      const resJ = await res.json();
      setPostResults(resJ);
    };

    if (searchTerm.trim() === "") {
      setPostResults([]);
      return;
    }

    setTimer(
      setTimeout(async () => {
        searchPosts();
      }, 250)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <Flex
      flexDirection={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      mx={{ base: 2, sm: 8 }}
      mt={{ base: 2, sm: 0 }}
    >
      <Flex alignItems={"center"} gap={{ base: 1, sm: 16 }}>
        <Logo />
        <form>
          <Flex position={"relative"} gap={1}>
            <IconButton
              colorScheme="blue"
              aria-label="Rechercher posts, tags et utilisateurs"
              icon={<Search />}
            />
            <Input
              type={"text"}
              value={searchTerm}
              // @ts-ignore
              onChange={(e: Event) => setSearchTerm(e.target.value)}
              placeholder="Rechercher"
              mr={2}
            />

            <Box position={"absolute"} mt={12} minW={"lg"} maxW={"xl"}>
              {postResults?.map(post => (
                <Box key={post.identifier}>
                  <LinkBox
                    bg={bgColor}
                    zIndex={2}
                    opacity={"100"}
                    px={8}
                    py={4}
                    mb={2}
                    borderRadius={"lg"}
                  >
                    <Flex
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <Flex gap={2} alignItems={"center"}>
                        <Badge colorScheme={"orange"}>{post.tagName}</Badge>
                        <LinkOverlay
                          href={`/p/${post.tagName}/${post.identifier}/${post.slug}`}
                          fontSize={"lg"}
                        >
                          {post.title}
                        </LinkOverlay>
                      </Flex>
                      <Text mr={8}>{post.userName}</Text>
                    </Flex>
                    <Text noOfLines={2}>{post.body}</Text>
                    {post.imgUrl ? (
                      <Image
                        my="2"
                        alt="photo"
                        maxH={32}
                        maxW={32}
                        src={`http://localhost:5500/images/${post.imgUrl}`}
                      />
                    ) : null}
                  </LinkBox>
                  <Divider color={"black"} />
                </Box>
              ))}
            </Box>
          </Flex>
        </form>
      </Flex>
      <Flex alignItems={"center"} gap={8}>
        <Menu />
      </Flex>
    </Flex>
  );
};

export default Header;
