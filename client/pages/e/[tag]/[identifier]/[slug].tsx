import React, { useEffect, useState } from "react";
// import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import fetcher from "../../../../src/utils/fetcher";
import {
  Container,
  Flex,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  FormErrorMessage,
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
  Link,
  Select,
  useDisclosure,
  Text,
  Image as ChakraImage
} from "@chakra-ui/react";
import Head from "next/head";
import Header from "../../../../components/Header";
import CodesOfConduct from "../../../../components/CodesOfConduct";
import { TagType } from "../../../../src/types";
import { useRouter } from "next/router";
import { useAuthState } from "../../../../src/context/auth";
import NotAuthMessage from "../../../../components/NotAuthMessage";

function EditPost() {
  const { authenticated } = useAuthState();

  const [currentImage, setCurrentImage] = useState("");
  const router = useRouter();
  const { identifier, slug } = router.query;
  const [initialValues, setInitialValues] = useState({
    body: "",
    title: "",
    tagName: "",
    file: "",
    deleteImage: false
  });

  const swrUrl = `http://localhost:5500/api/posts/${identifier}/${slug}`;
  const { data, error } = useSWR(swrUrl, fetcher);
  if (error) {
    console.log(error);
  }

  useEffect(() => {
    fetch(`http://localhost:5500/api/posts/${identifier}/${slug}`, {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.json())
      .then(res => {
        console.log("res is ", res);
        setInitialValues({
          body: res.body,
          title: res.title,
          tagName: res.tagName,
          file: "",
          deleteImage: false
        });
        setCurrentImage(`http://localhost:5500/images/${res.imgUrl}`);
      })
      .catch();
  }, [identifier, slug]);

  // WITH STATE
  const [tags, setTags] = useState<TagType[]>();
  useEffect(() => {
    console.log("using an fx");
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

        <Flex
          flexDirection={{ base: "column", sm: "row" }}
          justifyContent="center"
          alignItems="flex-start"
          gap={4}
        >
          {data ? (
            <Box w={{ base: "100%", sm: "50%" }} p={4}>
              <Heading my={8}>Modifier votre message</Heading>
              <Formik
                initialValues={initialValues}
                validationSchema={Yup.object({
                  title: Yup.string()
                    .required("un titre est requis")
                    .min(2, "Le titre doit avoir au moins 2 caractères")
                    .max(60, "Le titre doit avoir maximum 60 caractères"),
                  body: Yup.string()
                    .nullable()
                    .max(
                      1000,
                      "On apprecie votre enthusiasme mais n'essayez pas d'écrire un roman. :)"
                    ),
                  tagName: Yup.string().matches(
                    /^[a-zA-Z0-9]+$/,
                    "Un tag ne peut pas contenir des espaces ou des caractères spéciaux"
                  )
                })}
                enableReinitialize={true}
                onSubmit={values => {
                  let post = new FormData();

                  post.append("image", values.file);

                  post.append("title", values.title);
                  post.append("body", values.body);
                  post.append("tagName", values.tagName);

                  // @ts-ignore
                  post.append("deleteImage", values.deleteImage);

                  fetch(
                    `http://localhost:5500/api/posts/${identifier}/${slug}`,
                    {
                      method: "PUT",
                      credentials: "include",
                      body: post
                    }
                  )
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
                        value={formProps.values.title}
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
                        value={formProps.values.body}
                        placeholder="votre message"
                      />
                      {formProps.touched.body && formProps.errors.body ? (
                        <FormErrorMessage>
                          {formProps.errors.body}
                        </FormErrorMessage>
                      ) : null}
                    </FormControl>
                    {console.log("current image is ", currentImage)}
                    {!currentImage ||
                    currentImage === "http://localhost:5500/images/" ? null : (
                      <FormControl>
                        <Flex gap={4}>
                          <FormLabel htmlFor="deleteImage">
                            <Checkbox
                              id="deleteImage"
                              name="deleteImage"
                              // @ts-ignore
                              value={formProps.values.deleteImage}
                              onChange={formProps.handleChange("deleteImage")}
                              colorScheme={"red"}
                            >
                              Supprimer l&apos;image
                            </Checkbox>
                          </FormLabel>
                        </Flex>
                      </FormControl>
                    )}

                    <Flex gap={2} alignItems={"center"}>
                      {!currentImage ||
                      currentImage === "http://localhost:5500/images/" ||
                      formProps.values.deleteImage ? null : (
                        <ChakraImage
                          alt={"photo du moment"}
                          maxW={24}
                          maxH={24}
                          src={currentImage}
                        ></ChakraImage>
                      )}
                      <FormControl mt={8}>
                        <FormLabel htmlFor="file">
                          {currentImage
                            ? "Changer l'image"
                            : "Télécharger une image"}
                        </FormLabel>

                        <input
                          type="file"
                          accept="image/*"
                          id="file"
                          name="file"
                          onChange={event =>
                            // @ts-ignore
                            formProps.setFieldValue(
                              "file",
                              event.target.files[0]
                            )
                          }
                        ></input>
                        <Button
                          onClick={() => {
                            formProps.setFieldValue("file", null);
                            // @ts-ignore
                            document.getElementById("file").value = "";
                          }}
                        >
                          Réinitialiser l&apos;image
                        </Button>
                      </FormControl>
                    </Flex>

                    <FormControl mt={8}>
                      <FormLabel htmlFor="tag">Choisir un tag</FormLabel>
                      <Select
                        maxW={64}
                        value={formProps.values.tagName}
                        onBlur={formProps.handleBlur("tagName")}
                        onChange={formProps.handleChange("tagName")}
                        id="tagName"
                        name="tagName"
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
          ) : (
            "loading"
          )}
          <Box w={{ base: "100%", sm: "35%" }}>
            <CodesOfConduct />
            <Box maxH={16} mx={16}>
              <Heading mt={8}>Tags</Heading>
              <Flex flexDir={"column"} gap={2}>
                <UnorderedList>
                  {!tags
                    ? "Loading..."
                    : tags
                        .sort((a: TagType, b: TagType) =>
                          a.name > b.name ? 1 : -1
                        )
                        .map((tag: TagType) => (
                          <ListItem key={tag.name}>{tag.name}</ListItem>
                        ))}
                </UnorderedList>
                <Button onClick={onOpen}>Créer un nouveau Tag</Button>
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
                        Le nom pour votre tag (ni espaces, ni caractères
                        spéciaux svp)
                      </FormLabel>
                      <Input id="tagname" type="text" required />
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
}

export default EditPost;
