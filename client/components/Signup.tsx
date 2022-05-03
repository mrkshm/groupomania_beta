import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  SimpleGrid,
  GridItem,
  Button
} from "@chakra-ui/react";
import { SessionUserProps } from "../src/types";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useState } from "react";

const Signup = ({ dispatch }) => {
  const router = useRouter();

  const [signupError, setSignupError] = useState("");
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: ""
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(2, "Le nom d'utilisateur·rice doit avoir au moins 2 caractères")
        .max(20, "Le nom d'utilisateur·rice doit avoir maximum 20 caractères")
        .matches(
          /^[a-zA-Z0-9]+$/,
          "Le nom d'utilisateur·rice ne peut pas contenir des espaces ou des caractères spéciaux"
        )
        .required("Un nom d'utilisateur·rice est requis"),
      email: Yup.string()
        .email("L'adresse email doit être valide")
        .required("Une adresse email est requise"),
      password: Yup.string()
        .min(6, "Le mot de passe doit avoir au moins 6 caractères")
        .max(50, "Le mot de passe peut avoir maximum 50 caractères")
        .required("Un mot de passe est requis")
    }),
    onSubmit: values => {
      submitForm(values);
    }
  });
  const submitForm = async (values: any) => {
    const url = "http://localhost:5500/api/auth/register";

    const signupAttempt = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8"
      },
      body: JSON.stringify({
        email: values.email,
        username: values.username,
        password: values.password
      })
    });

    if (!signupAttempt.ok) {
      signupAttempt
        .json()
        .then(json => {
          console.log(json);
          setSignupError(json);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      const loginUrl = "http://localhost:5500/api/auth/login";
      fetch(loginUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password
        })
      })
        .then(res => {
          res.json();
        })
        .then(res => {
          dispatch("LOGIN", res);
          router.push("/");
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start">
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Conditions d&apos;utilisation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Voici un jour les conditions d&apos;utilisation du service. En
            attendant un peu de lorem ipsum: Lorem ipsum dolor sit amet,
            consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Fermer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <VStack spacing={3} alignItems="flex-start">
        <Heading size="2xl">Inscrivez-vous</Heading>
        <Text>
          Vous avez déjà un compte ? <Link href="/login">Connectez-vous !</Link>
        </Text>
      </VStack>
      <form onSubmit={formik.handleSubmit}>
        <SimpleGrid columns={2} columnGap={3} rowGap={6} w="full">
          <GridItem colSpan={2}>
            <FormControl
              // @ts-ignore
              isInvalid={formik.touched.username && formik.errors.username}
            >
              <FormLabel>nom d&apos; utilisateur</FormLabel>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Jean"
                value={formik.values.username}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              {formik.touched.username && formik.errors.username ? (
                <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
              ) : null}
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl
              // @ts-ignore
              isInvalid={formik.touched.email && formik.errors.email}
            >
              <FormLabel>adresse email</FormLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="jean@gabin.fr"
                value={formik.values.email}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              {formik.touched.email && formik.errors.email ? (
                <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
              ) : null}
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl
              // @ts-ignore
              isInvalid={formik.touched.password && formik.errors.password}
            >
              <FormLabel>mot de passe</FormLabel>
              <Input
                id="password"
                name="password"
                type="text"
                placeholder="qwertyu"
                value={formik.values.password}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              {formik.touched.password && formik.errors.password ? (
                <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
              ) : null}
            </FormControl>
          </GridItem>
          <FormControl isInvalid={signupError.length > 1}>
            {signupError.length > 1 ? (
              <FormErrorMessage>{signupError}</FormErrorMessage>
            ) : null}
          </FormControl>
          <GridItem colSpan={2}>
            <Button type="submit" colorScheme="blue">
              Je m&apos;inscris
            </Button>
          </GridItem>
          <GridItem colSpan={2}>
            <Text fontSize="xs" mb={8}>
              En cliquant sur &quot;Je m&apos;inscris&quot;, vous acceptez les{" "}
              <Link onClick={onOpen}>CGU</Link> de Groupomania.
              <br />
              Nous gardons vos données strictement confidentielles.
            </Text>
          </GridItem>
        </SimpleGrid>
      </form>
    </VStack>
  );
};

export default Signup;
