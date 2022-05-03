import React from "react";
import Image from "next/image";
import {
  Box,
  useColorMode,
  useColorModeValue,
  Flex,
  chakra
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./colorModeSwitcher";
import { Logo } from "./Logo";

function HeaderSignup() {
  // const { toggleColorMode } = useColorMode();

  return (
    <Box mt={8} mb={0} ml={{ base: 0, sm: 8 }}>
      <Flex
        justifyContent="space-between"
        direction={{ base: "column", sm: "row" }}
      >
        <Flex
          alignItems="center"
          justifyContent={{ base: "center", sm: "space-between" }}
        >
          <Logo />
          <chakra.img
            src={useColorModeValue(
              "/assets/logo-text-red.png",
              "/assets/logo-text-dark.png"
            )}
            alt="logo"
            height={{ md: "100", base: "50" }}
            mt={4}
          ></chakra.img>
        </Flex>
        <Flex
          visibility={{ base: "hidden", sm: "visible" }}
          alignItems="center"
          gap={4}
        >
          <ColorModeSwitcher />
        </Flex>
      </Flex>
    </Box>
  );
}

export default HeaderSignup;
