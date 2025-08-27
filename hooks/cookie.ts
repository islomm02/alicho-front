"use client";
// @ts-ignore
import Cookies from "js-cookie";
import { FC } from "react";
export const setCookies = ( title:string, data:string  ) => {
    Cookies.set(`${title}`, `${data}`, { expires: 7 });
};

export const getCookies = (title: string) => {
    return Cookies.get(`${title}`);
};
