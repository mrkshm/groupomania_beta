import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import { PostType } from "../src/types";
import PostCard from "../components/PostCard";
import useSWR from "swr";
import fetcher from "../src/utils/fetcher";

function UserPosts({ user }: any) {
  const getUserPostsUrl = `http://localhost:5500/api/posts/posts/from/${user.username}`;
  const { data, error } = useSWR(getUserPostsUrl, fetcher);

  if (!data || typeof data !== "object") {
    return <Box>Loading</Box>;
  } else {
    console.log(data);

    return (
      <Box my={8}>
        <Heading size={"md"} mb={8}>
          Mes posts
        </Heading>
        {data ? (
          data.map((post: PostType) => (
            <PostCard post={post} key={post.identifier} />
          ))
        ) : (
          <h1>Loading...</h1>
        )}
      </Box>
    );
  }
}

export default UserPosts;
