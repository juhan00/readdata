const jwt = require("jsonwebtoken");
import { QueryClient, useMutation, useQuery } from "react-query";
import { getLoginInfo, getKeyCheck, getTokenCheck } from "@/utils/api/login";
import { setTokenCookie } from "@/utils/useTokenCookie";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { COOKIE_EXPIRATION_TIME } from "@/consts/common";
import { useRouter } from "next/router";
import { COOKIE_NAME, COOKIE_SUPERADMIN_ID } from "@/consts/common";
import { useGlobalState } from "@/context/globalStateContext";
import { POPUP_DEFAULT } from "@/consts/popup";
import PopupDataDefault from "@/src/components/data/popup/popupDataDefault";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

//styles
import className from "classnames/bind";
import styles from "./login.module.scss";
import { useEffect, useState } from "react";

const cx = className.bind(styles);

const Login = () => {
  const router = useRouter();
  const { key } = router.query;
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [{ popupState }, setGlobalState] = useGlobalState();

  const {
    data: loginInfo,
    isLoading: isLoadingLoginInfo,
    isFetching: isFetchingLoginInfo,
    refetch: refetchLoginInfo,
  } = useQuery("getLoginInfo", () => getLoginInfo(id, pw), { enabled: false });

  const {
    data: tokenCheckInfo,
    isLoading: isLoadingTokenCheckInfo,
    refetch: refetchTokenCheckInfo,
  } = useQuery("getTokenCheckInfo", () => getTokenCheck(key), { enabled: false });

  const handleIdChange = (e) => {
    setId(e.target.value);
  };
  const handlePwChange = (e) => {
    setPw(e.target.value);
  };

  const handleSubmitClick = () => {
    if (id && pw) {
      refetchLoginInfo();
    } else {
      setGlobalState((prevGlobalState) => ({
        ...prevGlobalState,
        popupState: {
          isOn: true,
          popup: POPUP_DEFAULT,
          content: "아이디나 패스워드를 확인해주세요.",
        },
      }));
    }
  };

  const userLogin = (token, admin, companyCode, userName) => {
    if (admin !== null) {
      const decodedToken = jwt.decode(token);
      if (token) {
        const superAdmin = decodedToken.user_id === COOKIE_SUPERADMIN_ID ? true : false;

        setTokenCookie(decodedToken.user_id, superAdmin, admin, companyCode, decodedToken.user_name, token, COOKIE_EXPIRATION_TIME);
      } else {
        if (id === COOKIE_SUPERADMIN_ID) {
          setTokenCookie(COOKIE_SUPERADMIN_ID, true, admin, companyCode, "ADMIN", token, COOKIE_EXPIRATION_TIME);
        } else {
          console.log("No token");
          return;
        }
      }

      router.push("/data");
    }
  };

  useEffect(() => {
    const cookie = getCookie(COOKIE_NAME);
    if (cookie) {
      router.push("/data");
    }

    if (!loginInfo || isFetchingLoginInfo) {
      return;
    }

    const token = loginInfo.tk;
    const admin = loginInfo.admin;
    const companyCode = loginInfo.companyCode;

    if (!token && !admin) {
      setGlobalState((prevGlobalState) => ({
        ...prevGlobalState,
        popupState: {
          isOn: true,
          popup: POPUP_DEFAULT,
          content: "아이디나 패스워드를 확인해주세요.",
        },
      }));
    } else {
      userLogin(token, admin, companyCode);
    }
  }, [loginInfo, isFetchingLoginInfo]);

  useEffect(() => {
    if (key) {
      refetchTokenCheckInfo();
    }
  }, [key]);

  useEffect(() => {
    if (!tokenCheckInfo) {
      return;
    }
    const token = tokenCheckInfo.tk;
    const admin = tokenCheckInfo.admin;
    const companyCode = tokenCheckInfo.companyCode;

    userLogin(token, admin, companyCode);
  }, [tokenCheckInfo]);

  return (
    <>
      <PopupDataDefault />
      <div className={cx("login")}>
        <div className={cx("box")}>
          <div className={cx("content-wrap")}>
            <div className={cx("logo")}>
              <img src="/assets/images/logo.png" alt="logo" />
            </div>
            <div className={cx("input-wrap")}>
              <input type="text" className={cx("id")} placeholder={"ID"} value={id} onChange={(e) => handleIdChange(e)} />
              <input type="password" className={cx("pw")} placeholder={"PASSWORD"} value={pw} onChange={(e) => handlePwChange(e)} />
            </div>
            <button className={cx("btn-submit")} onClick={handleSubmitClick}>
              로그인
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "popup"])),
    },
  };
};
