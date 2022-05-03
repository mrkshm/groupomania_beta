import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import {
  Badge,
  Box,
  Container,
  Flex,
  Heading,
  Input,
  Link,
  Text,
  Image as ChakraImage,
  Button,
  IconButton
} from "@chakra-ui/react";
import Header from "../../../../components/Header";
import Comments from "../../../../components/Comments";
import CreateComment from "../../../../components/CreateComment";
import Head from "next/head";
import { PostType, CommentType } from "../../../../src/types";
import useSWR from "swr";
import fetcher from "../../../../src/utils/fetcher";
import TimeAgo from "react-timeago";
// @ts-ignore
import frenchStrings from "react-timeago/lib/language-strings/fr";
// @ts-ignore
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { DownRoundArrow, MessageText, UpRoundArrow } from "iconoir-react";
import { useAuthState } from "../../../../src/context/auth";
import NotAuthMessage from "../../../../components/NotAuthMessage";

function PostPage() {
  const router = useRouter();
  const { user, authenticated } = useAuthState();

  const [userVoteDisp, setUserVoteDisp] = useState(0);
  const [voteScoreDisp, setVoteScoreDisp] = useState(0);

  // @ts-ignore
  const [post, setPost] = useState<PostType>({});

  const { identifier, tag, slug } = router.query;

  const formatter = buildFormatter(frenchStrings);

  // Getting comments from DB
  const swrUrl = `http://localhost:5500/api/posts/${identifier}/${slug}/comments`;

  const {
    data: comments,
    mutate: commentsMutate,
    error: commentsError
  } = useSWR(swrUrl, fetcher);
  if (commentsError) {
    console.log(commentsError);
  }

  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const fetchUrl = `http://localhost:5500/api/posts/${identifier}/${slug}`;
    fetch(fetchUrl, {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.json())
      .then(res => {
        setPost(res);

        setVoteScoreDisp(res.voteScore);
        setUserVoteDisp(res.userVote);
        setCommentCount(res.commentCount);
      })
      .catch(err => console.log(err));
  }, [identifier, slug]);

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
    } catch (error) {
      console.log(error);
    }
  };
  const editPost = async () => {
    router.push(`/e/${post.tagName}/${post.identifier}/${post.slug}`);
  };
  if (!authenticated) {
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
        <Flex justifyContent={"center"}>
          <Box maxW={"2xl"} borderWidth="1px" borderRadius={"lg"} p={8}>
            <Flex justifyContent={"space-between"}>
              <Heading mb={4}>{post.title}</Heading>
              <Link href={`/p/${post.tagName}`}>
                <Badge
                  // alignSelf={"center"}
                  colorScheme="orange"
                  maxH={8}
                  mt={2}
                  p="2"
                >
                  {post.tagName}
                </Badge>
              </Link>
            </Flex>
            <Box fontSize="sm">
              <Flex gap={1}>
                <div>
                  Publié par{" "}
                  <Link href={`/u/${post.userName}`}>{post.userName}</Link>
                </div>
                <TimeAgo date={post.createdAt} formatter={formatter} />
              </Flex>
            </Box>
            <Box mt={2}>
              <Text>{post.body === "" ? null : post.body}</Text>
            </Box>
            <Box mt={2}>
              {post.imgUrl === "" ? null : (
                <ChakraImage
                  w={"100%"}
                  mb={8}
                  src={`http://localhost:5500/images/${post.imgUrl}`}
                />
              )}
            </Box>
            <Flex justifyContent={"space-between"} alignItems={"center"}>
              <Flex gap={2} mr={4}>
                <MessageText />
                {commentCount ? commentCount : 0}{" "}
                {commentCount === 1 ? "Commentaire" : "Commentaires"}
              </Flex>

              {user && user.username === post.userName ? (
                <Button mr={4} onClick={editPost} colorScheme={"blue"}>
                  Edit
                </Button>
              ) : null}
              {user && user.isAdmin ? (
                <Button mr={4} onClick={editPost} colorScheme={"red"}>
                  Supprimer
                </Button>
              ) : null}

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
        </Flex>
        <CreateComment
          mutate={commentsMutate}
          // @ts-ignore
          identifier={identifier}
          // @ts-ignore
          slug={slug}
          commentCount={commentCount}
          setCommentCount={setCommentCount}
        />

        <Comments
          comments={comments}
          mutate={commentsMutate}
          commentCount={commentCount}
          setCommentCount={setCommentCount}
        />
      </Container>
    );
  }
}

export default PostPage;
