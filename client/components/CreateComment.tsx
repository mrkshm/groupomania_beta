import React from "react";
import {
  Box,
  Flex,
  Input,
  Modal,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  FormControl,
  FormLabel
} from "@chakra-ui/react";
import { CommentType, PostFetchProps } from "../src/types";
import CommentCard from "./CommentCard";
import useSWR from "swr";
import { MessageText } from "iconoir-react";
import Comments from "./Comments";

interface CreateCommentProps {
  identifier: string;
  slug: string;
  mutate: Function;
  commentCount: number;
  setCommentCount: Function;
}

function CreateComment({
  identifier,
  slug,
  mutate,
  commentCount,
  setCommentCount
}: CreateCommentProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const createComment = async (event: Event) => {
    event.preventDefault();
    const postCommentUrl = `http://localhost:5500/api/posts/${identifier}/${slug}/comments`;
    const res = await fetch(postCommentUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // @ts-ignore
        body: event.target.newComment.value
      })
    });
    // @ts-ignore
    console.log(event.target.newComment.value);
    const result = await res.json();
    console.log(result);
    mutate();
    setCommentCount(commentCount + 1);
    onClose();
  };
  return (
    <Flex mt={8} justifyContent="center">
      <Box maxW="2xl">
        <Flex alignItems={"center"} gap={2} onClick={onOpen}>
          <MessageText />
          <Input readOnly placeholder="Écrire un commentaire" width={"100%"} />
        </Flex>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Écrire un commentaire</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* @ts-ignore */}
            <form onSubmit={createComment}>
              <FormControl>
                <FormLabel htmlFor="newComment">Votre commentaire</FormLabel>
                <Textarea id="newComment" name="newComment" required />
              </FormControl>
              <FormControl mt={8}>
                <Button colorScheme="blue" mr={3} type="submit">
                  Publier
                </Button>
                <Button onClick={onClose} variant="ghost">
                  Secondary Action
                </Button>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default CreateComment;
