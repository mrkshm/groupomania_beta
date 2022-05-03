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
  useDisclosure,
  SimpleGrid,
  GridItem,
  Button
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useState } from "react";
import InitialModal from "./loginModals/InitialModal";
import ConfirmationModal from "./loginModals/ConfirmationModal";

const LoginComp = ({ dispatch }: any) => {
  const router = useRouter();

  const [loginError, setLoginError] = useState("");
  const [pwError, setPwError] = useState("");
  const [sentModal, setSentModal] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("l'adresse email n'est pas valide")
        .required("une adresse email est requise"),
      password: Yup.string().required("un mot de passe est requis")
    }),
    onSubmit: values => {
      loginForm(values);
    }
  });

  const loginForm = async (values: any) => {
    try {
      const res = await fetch("http://localhost:5500/api/auth/login", {
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
      });
      if (res.ok) {
        const resJ = await res.json();

        dispatch("LOGIN", resJ);
      } else {
        console.log("No one here");
        setLoginError("Username");

        // router.push("/login");
      }

      // router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <VStack
      w="full"
      h="full"
      p={10}
      pt={{ base: 0, sm: 10 }}
      spacing={10}
      alignItems="flex-start"
    >
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        {sentModal ? (
          <ConfirmationModal
            onClose={onClose}
            setPwError={setPwError}
            pwError={pwError}
            setSentModal={setSentModal}
          />
        ) : (
          <InitialModal
            setSentModal={setSentModal}
            setPwError={setPwError}
            pwError={pwError}
          />
        )}
      </Modal>

      <VStack spacing={3} alignItems="flex-start">
        <Heading size={"2xl"}>Connectez-vous</Heading>
        <Text>
          Vous n&apos;avez pas encore un compte ?{" "}
          <Link href="/register">Inscrivez-vous !</Link>
        </Text>
      </VStack>
      <form onSubmit={formik.handleSubmit}>
        <FormControl isInvalid={loginError ? true : false}>
          {loginError ? (
            <FormErrorMessage mb={4}>
              nom d&apos;utilisateur ou mot de passe incorrect
            </FormErrorMessage>
          ) : null}
        </FormControl>
        <SimpleGrid columns={2} columnGap={3} rowGap={6} w="full">
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
          <GridItem colSpan={2}>
            <Link onClick={onOpen}>Mot de passe oublié ?</Link>
          </GridItem>
          <GridItem colSpan={2}>
            <Button colorScheme="blue" type="submit">
              Connexion
            </Button>
          </GridItem>
        </SimpleGrid>
      </form>
    </VStack>
  );
};

export default LoginComp;
