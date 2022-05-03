import React from "react";
import { Box, Link } from "@chakra-ui/react";

function NotAuthMessage() {
  return (
    <Box>
      Veuillez-vous <Link href="/login">connecter</Link>, s&apos;il vous plaît
    </Box>
  );
}

export default NotAuthMessage;
