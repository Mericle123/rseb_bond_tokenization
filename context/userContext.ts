"use client";

import { createContext, useContext } from "react";

export const UserContext = createContext<any>(null);

export function useUser() {
  return useContext(UserContext);
}

export async function UserProvider({
  currentUser,
  children,
}: {
  currentUser: any;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={currentUser}>{children}</UserContext.Provider>
  );
}
