import { Box, Flex } from "@chakra-ui/react";
import { CommentType, PostFetchProps } from "../src/types";
import CommentCard from "./CommentCard";

interface CommentsProps {
  comments: CommentType[];
  mutate: Function;
  setCommentCount: Function;
  commentCount: number;
}

function Comments({
  comments,
  mutate,
  setCommentCount,
  commentCount
}: CommentsProps) {
  return (
    <Flex mt={8} justifyContent="center">
      <Box maxW="2xl">
        {console.log(comments)}

        {comments ? (
          comments?.map((comment: CommentType) => (
            <CommentCard
              comment={comment}
              key={comment.identifier}
              comments={comments}
              mutate={mutate}
              setCommentCount={setCommentCount}
              commentCount={commentCount}
            />
          ))
        ) : (
          <h1>Loading</h1>
        )}
      </Box>
    </Flex>
  );
}

export default Comments;
