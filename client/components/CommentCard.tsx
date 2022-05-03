import React, { useState } from "react";
import {
  Box,
  Text,
  Link,
  Flex,
  Button,
  Modal,
  FormControl,
  FormLabel,
  Textarea,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from "@chakra-ui/react";
import { CommentType } from "../src/types";
import { useAuthState } from "../src/context/auth";

import TimeAgo from "react-timeago";
// @ts-ignore
import frenchStrings from "react-timeago/lib/language-strings/fr";
// @ts-ignore
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

interface CommentCardProps {
  comment: CommentType;
  comments?: CommentType[];
  mutate?: Function;
  setCommentCount?: Function;
  commentCount?: number;
}

function CommentCard({
  comment,
  comments,
  mutate,
  commentCount,
  setCommentCount
}: CommentCardProps) {
  const formatter = buildFormatter(frenchStrings);
  const { user } = useAuthState();

  const deleteComment = async () => {
    const delUrl = `http://localhost:5500/api/posts/${comment.identifier}`;
    const res = await fetch(delUrl, {
      method: "DELETE",
      credentials: "include"
    });
    const result = await res.json();
    console.log(result);
    if (setCommentCount) {
      setCommentCount(commentCount - 1);
    }

    mutate();
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const editComment = async (event: Event) => {
    event.preventDefault();
    console.log("edit this thing", comment.identifier);
    console.log("Body", commentBody);
    const res = await fetch(
      `http://localhost:5500/api/posts/${comment.identifier}`,
      {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({ body: commentBody }),
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    const result = await res.json();
    mutate();
    onClose();
  };
  const [commentBody, setCommentBody] = useState<string>(comment.body);
  return (
    <Box borderWidth="1px" borderRadius={"lg"} p={4} my={2}>
      <Text>{comment.body}</Text>
      <Box fontSize="sm">
        <Flex gap={1} mt={2}>
          <div>
            Publié par{" "}
            <Link href={`u/${comment.username}`}>{comment.username}</Link>
          </div>
          <TimeAgo date={comment.createdAt} formatter={formatter} />
        </Flex>
        {user.isAdmin || user.username === comment.username ? (
          <Button
            onClick={deleteComment}
            mt={2}
            colorScheme={"red"}
            size={"xs"}
          >
            effacer
          </Button>
        ) : null}
        {user.username === comment.username ? (
          <Button
            onClick={onOpen}
            mt={2}
            ml={2}
            colorScheme={"green"}
            size={"xs"}
          >
            modifier
          </Button>
        ) : null}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modifier le commentaire</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* @ts-ignore */}
            <form onSubmit={editComment}>
              <FormControl>
                <FormLabel htmlFor="body">Votre commentaire</FormLabel>
                <Textarea
                  value={commentBody}
                  name="body"
                  id="body"
                  onChange={event => setCommentBody(event.target.value)}
                />
              </FormControl>
              <FormControl mt={8}>
                <Button colorScheme="blue" mr={3} type="submit">
                  Publier
                </Button>
                <Button onClick={onClose} variant="ghost">
                  Fermer
                </Button>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default CommentCard;
