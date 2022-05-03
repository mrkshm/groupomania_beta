import {
  Badge,
  Box,
  Flex,
  Text,
  Link,
  Button,
  IconButton,
  Image as ChakraImage
} from "@chakra-ui/react";
import React, { useState } from "react";
import NextLink from "next/link";
import { UpRoundArrow, DownRoundArrow, MessageText } from "iconoir-react";

import TimeAgo from "react-timeago";
// @ts-ignore
import frenchStrings from "react-timeago/lib/language-strings/fr";
// @ts-ignore
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { PostType } from "../src/types";

interface PostCardProps {
  post: PostType;
}

function PostCard({
  post: {
    identifier,
    slug,
    title,
    body,
    tagName,
    imgUrl,
    createdAt,
    voteScore,
    userVote,
    commentCount,
    url,
    userName
  }
}: PostCardProps) {
  const formatter = buildFormatter(frenchStrings);
  const vote = async (value: number) => {
    try {
      const res = await fetch("http://localhost:5500/api/misc/vote", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          identifier: identifier,
          slug: slug,
          value: value
        })
      });
      const resJ = await res.json();

      setUserVoteDisp(resJ.userVote);
      setVoteScoreDisp(resJ.voteScore);
      console.log(res.body);
    } catch (error) {
      console.log(error);
    }
  };

  const [userVoteDisp, setUserVoteDisp] = useState(userVote);
  const [voteScoreDisp, setVoteScoreDisp] = useState(voteScore);

  return (
    <Box
      mb={4}
      key={identifier}
      id={identifier}
      borderRadius="lg"
      borderWidth="1px"
      p={4}
      maxW="xl"
    >
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Box fontWeight="semibold" as="h3" overflow="hidden">
          <NextLink href={url} passHref>
            {title}
          </NextLink>
        </Box>
        <Link href={`/p/${tagName}`}>
          <Badge colorScheme="orange" mt={2}>
            {tagName}
          </Badge>
        </Link>
      </Flex>
      <Box fontSize="sm">
        <Flex gap={1}>
          <div>
            Publié par <Link href={`/u/${userName}`}>{userName}</Link>
          </div>
          <TimeAgo date={createdAt} formatter={formatter} />
        </Flex>
      </Box>
      <Link color="" href={url} style={{ textDecoration: "none" }}>
        <Box mt={2}>
          <Text noOfLines={4}>{body === "" ? null : body}</Text>
        </Box>
        <Box mt={2}>
          {imgUrl === "" ? null : (
            <ChakraImage
              w={"100px "}
              src={`http://localhost:5500/images/${imgUrl}`}
            />
          )}
        </Box>
      </Link>
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        <NextLink href={url} passHref>
          <Button
            aria-label="J'aime"
            leftIcon={<MessageText />}
            variant="ghost"
          >
            {commentCount} {commentCount === 1 ? "Commentaire" : "Commentaires"}
          </Button>
        </NextLink>
        <Flex gap={1} alignItems={"center"}>
          {/* Upvote */}
          <IconButton
            aria-label="J'aime"
            icon={<UpRoundArrow />}
            variant="ghost"
            color={userVoteDisp === 1 ? "orange" : ""}
            onClick={() => vote(1)}
          />
          {voteScoreDisp}
          {/* Downvote */}
          <IconButton
            aria-label="Je n'aime pas"
            icon={<DownRoundArrow />}
            variant="ghost"
            color={userVoteDisp === -1 ? "orange" : ""}
            onClick={() => vote(-1)}
          />
        </Flex>
      </Flex>
    </Box>
  );
}

export default PostCard;
