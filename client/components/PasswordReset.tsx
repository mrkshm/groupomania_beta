import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Link,
  VStack,
  Heading,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid,
  GridItem,
  Button
} from "@chakra-ui/react";
import { Form, useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useState } from "react";

const PasswordReset = () => {
  const [resetError, setResetError] = useState("");
  const query = useRouter();
  const { username, token } = query.query;

  const formik = useFormik({
    initialValues: {
      password: "",
      password2: ""
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, "le mot de passe doit avoir au moins 6 caractères")
        .max(50, "le mot de passe peut avoir maximum 50 caractères")
        .required("un mot de passe est requis"),
      password2: Yup.string().oneOf(
        [Yup.ref("password"), null],
        "les deux mots de passe doivent être identiques"
      )
    }),
    onSubmit: values => {
      resetForm(values);
    }
  });

  const router = useRouter();

  const resetForm = (values: any) => {
    const url = `http://localhost:5500/api/auth/reset-password/${username}/${token}`;

    fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8"
      },
      body: JSON.stringify({
        password: values.password,
        password2: values.password2
      })
    })
      .then(response => {
        if (response.ok === false) {
          setResetError(
            "Il y avait un probleme. Veuillez contacter l'administrateur."
          );
          return null;
        }
        setResetError("");
        router.push("/login");
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start">
      <VStack spacing={3} alignItems="flex-start">
        <Heading size="2xl">Réinitialisation</Heading>
        <Text>Réinitialisez votre mot de passe</Text>
      </VStack>
      <form onSubmit={formik.handleSubmit}>
        <FormControl isInvalid={resetError ? true : false}>
          {resetError ? (
            <FormErrorMessage mb={4}>
              nom d&apos;utilisateur ou mot de passe incorrect
            </FormErrorMessage>
          ) : null}
        </FormControl>
        <SimpleGrid columns={2} columnGap={3} rowGap={6} w="full">
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
          <GridItem colSpan={2}>
            <FormControl
              // @ts-ignore
              isInvalid={formik.touched.password2 && formik.errors.password2}
            >
              <FormLabel>mot de passe confirmation</FormLabel>
              <Input
                id="password2"
                name="password2"
                type="text"
                placeholder="qwertyu"
                value={formik.values.password2}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              {formik.touched.password2 && formik.errors.password2 ? (
                <FormErrorMessage>{formik.errors.password2}</FormErrorMessage>
              ) : null}
            </FormControl>
          </GridItem>

          <GridItem colSpan={2}>
            <Button colorScheme="blue" type="submit">
              Réinitialiser
            </Button>
          </GridItem>
        </SimpleGrid>
      </form>
      {/* <SimpleGrid id="confirm" display="none">
        <Text fontSize="lg">
          Un email avec un lien pour réinitialiser le mot de passe a été envoyé.
        </Text>
      </SimpleGrid> */}
    </VStack>
  );
};

export default PasswordReset;
