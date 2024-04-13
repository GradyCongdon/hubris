"use server"

import { cookies } from "next/headers"

export const setThemeCookie = (theme: string) => {
  const cookieStore = cookies();
  cookieStore.set("theme", theme);
}

export const setCookie = (name: string, value: string) => {
  const cookieStore = cookies();
  cookieStore.set(name, value);
}
