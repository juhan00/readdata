import { useRouter } from "next/router";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { COOKIE_NAME } from "@/consts/common";

const Data = () => {
  const router = useRouter();

  useEffect(() => {
    const cookie = getCookie(COOKIE_NAME);
    if (cookie) {
      const cookieObj = JSON.parse(cookie);
      const userType = cookieObj.user_type;
      const superAdmin = cookieObj.super_admin;

      if (userType === 0) {
        router.push("/data/user");
      } else if (userType === 1) {
        router.push("/data/admin");
      }
    } else {
      router.push("/data/login");
    }
  }, []);

  return <></>;
};

export default Data;
