"use client";
import { createContext, useContext } from "react";

export const UserContext = createContext<any>(null);

export function useCurrentUser() {
  return useContext(UserContext);
}

export function UserProvider({ value, children }: any) {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
