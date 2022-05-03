import React from "react";
import { useRouter } from "next/router";
import {
  Menu as ChakraMenu,
  MenuButton,
  useColorModeValue,
  useColorMode,
  IconButton,
  MenuItem,
  MenuList,
  Text,
  Flex
} from "@chakra-ui/react";

import {
  User,
  Menu as MenuIcon,
  Group,
  LogOut,
  LightBulb,
  HalfMoon,
  Home
} from "iconoir-react";
import { useAuthDispatch, useAuthState } from "../src/context/auth";

function Menu() {
  const router = useRouter();
  const dispatch = useAuthDispatch();
  const { user } = useAuthState();

  const goHome = () => {
    router.push("/");
  };
  const goToUserlist = () => {
    router.push("/u");
  };
  const goToProfile = () => {
    router.push("/profile");
  };

  const logout = () => {
    fetch("http://localhost:5500/api/auth/logout", {
      method: "GET",
      credentials: "include"
    })
      .then(() => {
        dispatch("LOGOUT", null);
        router.push("/login");
      })
      .catch(err => console.log(err));
  };

  const { toggleColorMode } = useColorMode();
  const SwitchIcon = useColorModeValue(HalfMoon, LightBulb);

  const MENUITEMS = [
    { name: "Home", function: goHome, icon: <Home /> },
    { name: "Profil", function: goToProfile, icon: <User /> },
    { name: "Annuaire", function: goToUserlist, icon: <Group /> },
    { name: "Mode sombre", function: toggleColorMode, icon: <SwitchIcon /> },
    { name: "Déconnexion", function: logout, icon: <LogOut /> }
  ];

  return (
    <div>
      <ChakraMenu>
        <MenuButton
          as={IconButton}
          aria-label="Menu"
          variant="outline"
          icon={<MenuIcon />}
        />

        <MenuList>
          {MENUITEMS.map(item => (
            <MenuItem onClick={item.function} key={item.name}>
              <Flex gap={4} mb={2}>
                {item.icon}
                <Text>{item.name}</Text>
              </Flex>
            </MenuItem>
          ))}
        </MenuList>
      </ChakraMenu>
    </div>
  );
}

export default Menu;
