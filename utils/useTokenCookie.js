import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { COOKIE_NAME } from "@/consts/common";

export const setTokenCookie = (userId, superAdmin, userType, companyCode, userName, token, expirationTime) => {
  const expiryDate = new Date(Number(new Date()) + expirationTime);
  setCookie(
    COOKIE_NAME,
    { user_id: userId, super_admin: superAdmin, user_type: userType, company_code: companyCode, user_name: userName, token: token },
    { expires: expiryDate }
  );
};
