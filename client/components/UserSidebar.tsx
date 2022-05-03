import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Flex,
  Input,
  Box,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Link,
  Text,
  Image as ChakraImage,
  useDisclosure,
  Textarea
} from "@chakra-ui/react";
import { Mail } from "iconoir-react";
import TimeAgo from "react-timeago";
// @ts-ignore
import frenchStrings from "react-timeago/lib/language-strings/fr";
// @ts-ignore
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { useRouter } from "next/router";
import { useAuthDispatch, useAuthState } from "../src/context/auth";
import NotAuthMessage from "./NotAuthMessage";

const modUrl = "http://localhost:5500/api/auth/me";

// @ts-ignore
function UserSidebar({ user }) {
  const router = useRouter();
  const dispatch = useAuthDispatch();
  const { user: sessionUser, authenticated } = useAuthState();

  const [localUser, setLocalUser] = useState(user);

  const logout = () => {
    // code
    fetch("http://localhost:5500/api/auth/logout", {
      method: "GET",
      credentials: "include"
    })
      .then(() => router.push("/login"))
      .catch(err => console.log(err));
  };
  const baseUrl = "http://localhost:5500/api/auth/";
  const closeAccount = async () => {
    console.log("closing");
    const url = `${baseUrl}deactivate/${user.username}`;
    const res = await fetch(url, { method: "POST", credentials: "include" });
    const result = await res.json();
    console.log(result);
    logout();
  };
  const { isOpen, onOpen, onClose } = useDisclosure();

  const changeUsername = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const newUsername = event.target.form.username.value;
    const res = await fetch(modUrl, {
      body: JSON.stringify({
        username: newUsername
      }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      credentials: "include"
    });
    const result = await res.json();
    setLocalUser(result);
    dispatch("LOGIN", result);
    onClose();
  };

  const changeEmail = async (event: any) => {
    event.preventDefault();
    const newEmail = event.target.email.value;

    const res = await fetch(modUrl, {
      body: JSON.stringify({
        email: newEmail
      }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      credentials: "include"
    });
    const result = await res.json();
    setLocalUser(result);
    await dispatch("LOGOUT", null);
    onClose();
    router.push("/login");
  };

  const changeBody = async (event: any) => {
    event.preventDefault();
    const newBody = event.target.body.value;
    const res = await fetch(modUrl, {
      body: JSON.stringify({
        body: newBody
      }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      credentials: "include"
    });
    const result = await res.json();
    setLocalUser(result);
    dispatch("LOGIN", result);
    onClose();
  };

  const changeImage = async (event: any) => {
    event.preventDefault();
    const newImage = event.target.newImage.files[0];
    console.log(newImage);

    const formData = new FormData();
    formData.append("image", newImage);
    const res = await fetch(modUrl, {
      method: "POST",
      credentials: "include",
      body: formData
    });
    const result = await res.json();
    setLocalUser(result);
    dispatch("LOGIN", result);
    onClose();
  };

  const deletePhoto = async () => {
    const res = await fetch(modUrl, {
      method: "DELETE",
      credentials: "include"
    });
    const result = await res.json();
    setLocalUser(result);

    onClose();
  };

  interface profileModType {
    id: string;
  }

  const formatter = buildFormatter(frenchStrings);
  const [msg, setMsg] = useState(<h4>placeholder</h4>);
  const changeProfile = (event: Event) => {
    const profileMod: any = event.target;
    if (profileMod.id === "username") {
      setMsg(
        <Box>
          <Heading my={4} size={"sm"}>
            changer votre nom d utilisateur
          </Heading>
          <form>
            <FormControl>
              <FormLabel htmlFor="username">
                votre nouveau nom d&apos;utilisateur
              </FormLabel>
              <Input type="text" id="username" name="username" />
            </FormControl>
            <FormControl>
              <Button
                onClick={changeUsername as any}
                colorScheme={"blue"}
                mr={4}
                my={8}
              >
                Modifier
              </Button>
              <Button variant={"ghost"} onClick={onClose}>
                Fermer
              </Button>
            </FormControl>
          </form>
        </Box>
      );
    } else if (profileMod.id === "email") {
      setMsg(
        <Box>
          <Heading my={4} size={"sm"}>
            changer votre adresse email
          </Heading>
          <Text mb={4}>
            Après avoir changé votre adresse email, vous allez être obligé de
            vous connecter à nouveau.
          </Text>
          <form onSubmit={changeEmail as any}>
            <FormControl>
              <FormLabel htmlFor="email">
                votre nouvelle adresse email
              </FormLabel>
              <Input type="email" id="email" name="email" />
            </FormControl>
            <FormControl>
              <Button type="submit" colorScheme={"blue"} mr={4} my={8}>
                Modifier
              </Button>
              <Button variant={"ghost"} onClick={onClose}>
                Fermer
              </Button>
            </FormControl>
          </form>
        </Box>
      );
    } else if (profileMod.id === "body") {
      setMsg(
        <Box>
          <Heading my={4} size={"sm"}>
            changer votre description
          </Heading>
          <form onSubmit={changeBody as any}>
            <FormControl>
              <FormLabel htmlFor="body">votre nouvelle description</FormLabel>
              <Textarea id="body" name="body" />
            </FormControl>
            <FormControl>
              <Button type="submit" colorScheme={"blue"} mr={4} my={8}>
                Modifier
              </Button>
              <Button variant={"ghost"} onClick={onClose}>
                Fermer
              </Button>
            </FormControl>
          </form>
        </Box>
      );
    } else if (profileMod.id === "image") {
      setMsg(
        <Box>
          <Heading my={4} size={"sm"}>
            changer votre photo de profil
          </Heading>
          <form onSubmit={changeImage as any}>
            <FormControl>
              <FormLabel htmlFor="newImage">votre nouveau photo</FormLabel>
              <input
                type="file"
                accept="image/*"
                id="newImage"
                name="newImage"
              ></input>
            </FormControl>
            <FormControl>
              <Button type="submit" colorScheme={"blue"} mr={4} my={8}>
                Envoyer
              </Button>
              <Button variant={"ghost"} onClick={onClose}>
                Fermer
              </Button>
            </FormControl>
          </form>
        </Box>
      );
    }
    onOpen();
  };

  if (!authenticated) {
    return <NotAuthMessage />;
  } else {
    return (
      <Box w={{ base: "100%" }} p={4}>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modifier votre profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody>{msg}</ModalBody>
          </ModalContent>
        </Modal>
        <Heading mb={4}>
          {localUser.username}
          {sessionUser.username === localUser.username ? (
            <Button
              ml={4}
              id="username"
              onClick={changeProfile as any}
              size={"xs"}
            >
              Modifier
            </Button>
          ) : null}
        </Heading>

        <Text mb={4} fontSize={"sm"}>
          active depuis{" "}
          <TimeAgo date={localUser.createdAt} formatter={formatter} />
        </Text>
        <Box my={2}>
          <Flex mb={4} gap={4} alignItems={"center"}>
            <Link href={`mailto:${localUser.email}`}>
              <Flex mt={1} gap={2}>
                <Mail />
                {localUser.email}
              </Flex>
            </Link>
            {sessionUser.username === localUser.username ? (
              <Button id="email" onClick={changeProfile as any} size={"xs"}>
                Modifier
              </Button>
            ) : null}
          </Flex>
        </Box>
        <Text>{user.body}</Text>
        {sessionUser.username === localUser.username ? (
          <Button mt={2} id="body" onClick={changeProfile as any} size={"xs"}>
            Modifier
          </Button>
        ) : null}
        <Box mb={4}>
          {user.imageUrn === "http://www.localhost:5500/images/" ||
          !user.imageUrn ? null : (
            <ChakraImage
              mt={4}
              maxW={"90%"}
              alt="Photo de l'utilisateur·rice"
              src={`http://localhost:5500/images/${localUser.imageUrn}`}
            ></ChakraImage>
          )}

          {sessionUser.username === localUser.username ? (
            <Box>
              <Button
                mt={4}
                id="image"
                onClick={changeProfile as any}
                size={"xs"}
              >
                {"Modifier l'image"}
              </Button>

              {user.imageUrn ? (
                <Button
                  mt={4}
                  ml={4}
                  colorScheme={"red"}
                  id="image"
                  onClick={deletePhoto}
                  size={"xs"}
                >
                  Supprimer l&apos;image
                </Button>
              ) : null}
            </Box>
          ) : null}
        </Box>

        {sessionUser.username === user.username ? (
          <Accordion allowToggle>
            <AccordionItem>
              <AccordionButton mb={4} mt={8}>
                <Box mr={4}>Autres actions</Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <Button colorScheme={"red"} onClick={closeAccount}>
                  Supprimer le compte
                </Button>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        ) : null}
      </Box>
    );
  }
}

export default UserSidebar;
