import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import useSWR from "swr";
import fetcher from "../src/utils/fetcher";
import { CommentType } from "../src/types";
import CommentCard from "../components/CommentCard";

function UserComments({ user }) {
  const getUserCommentsUrl = `http://localhost:5500/api/posts/comments/from/${user.username}`;
  const { data, error } = useSWR(getUserCommentsUrl, fetcher);
  if (error) {
    console.log(error);
  }

  return (
    <Box my={8}>
      <Heading size={"md"} mb={8}>
        Mes commentaires
      </Heading>
      {data ? (
        data?.map((comment: CommentType) => (
          <CommentCard comment={comment} key={comment.identifier} />
        ))
      ) : (
        <h1>Loading...</h1>
      )}
    </Box>
  );
}

export default UserComments;
