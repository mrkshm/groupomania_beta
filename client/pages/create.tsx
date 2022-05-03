import React, { useEffect, useState } from "react";

import { Formik, Form } from "formik";
import * as Yup from "yup";

import {
  Container,
  Flex,
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Tooltip,
  UnorderedList,
  ListItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormHelperText,
  Textarea,
  Input,
  Heading,
  Select,
  useDisclosure,
  Image as ChakraImage
} from "@chakra-ui/react";
import Head from "next/head";
import Header from "../components/Header";
import CodesOfConduct from "../components/CodesOfConduct";
import { TagType } from "../src/types";
import { useRouter } from "next/router";
import { useAuthState } from "../src/context/auth";

function Create() {
  const router = useRouter();
  const { user } = useAuthState();

  // WITH STATE
  const [tags, setTags] = useState<TagType[]>();
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = () => {
    fetch("http://localhost:5500/api/tags", {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.json())
      .then(res => setTags(res))
      .catch(error => console.log(error));
  };

  const cleanTags = async () => {
    const url = "http://localhost:5500/api/tags/clean/tags";
    const res = await fetch(url, { method: "GET", credentials: "include" });
    const result = res.json();
    console.log(result);

    console.log("cleaning");
    fetchTags();
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const createTag = async (event: Event) => {
    event.preventDefault();
    // @ts-ignore
    console.log(event.target.tagname.value);

    const res = await fetch("http://localhost:5500/api/tags", {
      body: JSON.stringify({
        // @ts-ignore
        name: event.target.tagname.value
      }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      credentials: "include"
    });

    const result = await res.json();
    fetchTags();
    console.log("Tag Created");
    onClose();
  };

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

      <Flex
        flexDirection={{ base: "column", sm: "row" }}
        justifyContent="center"
        alignItems="flex-start"
        gap={4}
      >
        <Box w={{ base: "100%", sm: "50%" }} p={4}>
          <Heading my={8}>Publier un nouveau message</Heading>
          <Formik
            initialValues={{ file: "", body: "", title: "", tag: "" }}
            validationSchema={Yup.object({
              title: Yup.string()
                .required("un titre est requis")
                .min(2, "Le titre doit avoir au moins 2 caractères")
                .max(60, "Le titre doit avoir maximum 60 caractères"),
              body: Yup.string().max(
                1000,
                "On apprecie votre enthusiasme mais n'essayez pas d'écrire un roman. :)"
              ),
              tag: Yup.string().matches(
                /^[a-zA-Z0-9]+$/,
                "Un tag ne peut pas contenir des espaces ou des caractères spéciaux"
              )
            })}
            onSubmit={values => {
              let post = new FormData();
              post.append("image", values.file);
              post.append("title", values.title);
              post.append("body", values.body);
              post.append("tag", "reactJS");

              fetch("http://localhost:5500/api/posts", {
                method: "POST",
                credentials: "include",
                body: post
              })
                .then(res => res.json())
                .then(res => console.log(res))
                .then(() => router.push("/"))
                .catch();
            }}
          >
            {formProps => (
              <Form>
                <FormControl
                  isInvalid={
                    formProps.touched.title &&
                    formProps.errors.title !== undefined
                  }
                >
                  <FormLabel htmlFor="title">Titre</FormLabel>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="le titre de votre message"
                    onBlur={formProps.handleBlur("title")}
                    onChange={formProps.handleChange("title")}
                  />
                  {formProps.touched.title && formProps.errors.title ? (
                    <FormErrorMessage>
                      {formProps.errors.title}
                    </FormErrorMessage>
                  ) : null}
                </FormControl>

                <FormControl
                  isInvalid={
                    formProps.touched.body &&
                    formProps.errors.body !== undefined
                  }
                  my={8}
                >
                  <FormLabel htmlFor="body">Message</FormLabel>

                  <Textarea
                    id="body"
                    onBlur={formProps.handleBlur("body")}
                    onChange={formProps.handleChange("body")}
                    name="body"
                    minH={64}
                    placeholder="votre message"
                  />
                  {formProps.touched.body && formProps.errors.body ? (
                    <FormErrorMessage>{formProps.errors.body}</FormErrorMessage>
                  ) : null}
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="file">Télécharger une image</FormLabel>
                  <input
                    type="file"
                    accept="image/*"
                    id="file"
                    name="file"
                    onChange={event =>
                      // @ts-ignore
                      formProps.setFieldValue("file", event.target.files[0])
                    }
                  ></input>
                  <Button
                    onClick={() => {
                      formProps.setFieldValue("file", null);
                      // @ts-ignore
                      document.getElementById("file").value = "";
                    }}
                  >
                    Supprimer l&apos;image
                  </Button>
                </FormControl>
                <FormControl maxW={64}>
                  <FormLabel htmlFor="altTag">Alternative Tag</FormLabel>
                  <Input
                    list={"list"}
                    name="tag"
                    value={formProps.values.tag}
                    onBlur={formProps.handleBlur("tag")}
                    onChange={formProps.handleChange("tag")}
                  ></Input>
                  <datalist id="list">
                    {tags?.map(tag => (
                      <option key={tag.name} value={tag.name} />
                    ))}
                  </datalist>
                </FormControl>

                <FormControl mt={8}>
                  <FormLabel htmlFor="tag">Choisir un tag</FormLabel>
                  <Select
                    maxW={64}
                    value={formProps.values.tag}
                    onBlur={formProps.handleBlur("tag")}
                    onChange={formProps.handleChange("tag")}
                    id="tag"
                    name="tag"
                    placeholder="Choisir un tag"
                  >
                    {!tags
                      ? "Loading"
                      : tags
                          .sort((a: TagType, b: TagType) =>
                            a.name > b.name ? 1 : -1
                          )
                          .map((tag: TagType) => (
                            <option key={tag.name}>{tag.name}</option>
                          ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <Button colorScheme={"blue"} my={8} type="submit">
                    Publier
                  </Button>
                </FormControl>
              </Form>
            )}
          </Formik>
        </Box>
        <Box w={{ base: "100%", sm: "35%" }}>
          <CodesOfConduct />
          <Box maxH={16} mx={16}>
            <Heading mt={8} mb={4}>
              Tags - Top 10
            </Heading>
            <Flex flexDir={"column"} gap={2}>
              <UnorderedList>
                {!tags
                  ? "Loading..."
                  : tags
                      .sort((a: TagType, b: TagType) =>
                        a.tagCount > b.tagCount ? -1 : 1
                      )
                      .map((tag: TagType) => (
                        <ListItem mb={1} key={tag.name}>
                          {tag.name}
                        </ListItem>
                      ))}
              </UnorderedList>
              <Button onClick={onOpen}>Créer un nouveau Tag</Button>
              {user && user.isAdmin ? (
                <Tooltip label="Supprimer tous les tags qui ne sont pas associé à un post">
                  <Button colorScheme={"red"} onClick={cleanTags}>
                    Nettoyer tags
                  </Button>
                </Tooltip>
              ) : null}
            </Flex>
          </Box>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Créer un nouveau tag</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {/* @ts-ignore */}
                <form onSubmit={createTag}>
                  <FormControl>
                    <FormLabel htmlFor="tagname">
                      Le nom pour votre tag (ni espaces, ni caractères spéciaux
                      svp)
                    </FormLabel>
                    <Input id="tagname" type="text" pattern="[^\s]+" required />
                  </FormControl>
                  <FormControl mt={8}>
                    <Button type="submit" colorScheme="blue">
                      Créer le tag
                    </Button>
                    <Button mx={4} variant="ghost" onClick={onClose}>
                      Fermer
                    </Button>
                  </FormControl>
                </form>
              </ModalBody>

              <ModalFooter></ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </Flex>
    </Container>
  );
}

export default Create;
