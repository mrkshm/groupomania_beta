import create from "zustand";
import { persist } from "zustand/middleware";
import { UserObjectType } from "../types";

const nullUser: UserObjectType = {
  username: "",
  email: "",
  imageUrn: "",
  body: "",
  isActive: false,
  isAdmin: false,
  createdAt: "",
  updatedAt: ""
};

export const useStore = create(
  persist(
    (set, get) => ({
      sessionUser: null,
      setSessionUser: (user: UserObjectType) =>
        set(state => ({ sessionUser: user }))
    }),
    {
      name: "sessionStorage", // unique name
      getStorage: () => sessionStorage // (optional) by default the 'localStorage' is used
    }
  )
);
