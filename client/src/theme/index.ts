import { extendTheme } from "@chakra-ui/react";
import { Bluetooth } from "iconoir-react";

const theme = extendTheme({
  components: {
    Link: {
      baseStyle: {
        color: "#346beb"
      }
    },
    Button: {
      baseStyle: {}
    }
  }
});

export default theme;
