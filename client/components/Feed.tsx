import React, { useEffect, useState } from "react";
import { Box, Flex, Button } from "@chakra-ui/react";
import { PostType } from "../src/types";
// import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { Trophy, BubbleStar, Flower } from "iconoir-react";

import fetcher from "../src/utils/fetcher";
import PostCard from "./PostCard";

function Feed({}) {
  // Setting up infinite scrolling
  const [observedPost, setObservedPost] = useState("");

  // order of posts of the Feed is set here
  const voteDesc = () => {
    return (a: PostType, b: PostType) => (a.voteScore > b.voteScore ? -1 : 1);
  };
  const commentDesc = () => {
    return (a: PostType, b: PostType) =>
      a.commentCount > b.commentCount ? -1 : 1;
  };
  const dateDesc = () => {
    return (a: PostType, b: PostType) => (a.createdAt > b.createdAt ? -1 : 1);
  };

  const setVoteDesc = () => setSortOptions(voteDesc);
  const setCommentDesc = () => setSortOptions(commentDesc);
  const setDateDesc = () => setSortOptions(dateDesc);

  const [sortOptions, setSortOptions] = useState(dateDesc);

  // const getPostsUrl = "http://localhost:5500/api/posts";
  // const { data: posts, error: postsError } = useSWR(getPostsUrl, fetcher);

  const {
    data,
    error,
    mutate,
    size: page,
    setSize: setPage,
    isValidating
  } = useSWRInfinite<PostType[]>(
    index => `http://localhost:5500/api/posts?page=${index}`,
    fetcher
  );

  const posts: PostType[] = data ? [].concat(...data) : [];

  useEffect(() => {
    if (!posts || posts.length === 0) return;

    const id = posts[posts.length - 1].identifier;
    if (id !== observedPost) {
      setObservedPost(id);
      observeElement(document.getElementById(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);

  const observeElement = (element: HTMLElement) => {
    // code
    if (!element) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting === true) {
          console.log("Bottom reached => get more");
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      { threshold: 1 }
    );
    observer.observe(element);
  };

  return (
    <Box>
      <Flex gap={8} my={8}>
        <Button onClick={setVoteDesc} variant="ghost" leftIcon={<Trophy />}>
          Meilleur
        </Button>
        <Button
          onClick={setCommentDesc}
          variant="ghost"
          leftIcon={<BubbleStar />}
        >
          Populaire
        </Button>
        <Button onClick={setDateDesc} variant="ghost" leftIcon={<Flower />}>
          Nouveau
        </Button>
      </Flex>
      <Box my={8}>
        {posts
          ? posts
              .sort(sortOptions)
              .map((post: PostType) => (
                <PostCard post={post} key={post.identifier} />
              ))
          : "Loading"}
      </Box>
    </Box>
  );
}

export default Feed;
