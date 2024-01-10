import { useGlobalState } from "@/context/globalStateContext";

import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { submitContactForm } from "@/utils/api/contact_us";
import { POPUP_DEFAULT, POPUP_AGREE_TYPE, POPUP_AGREE1_TYPE, POPUP_AGREE2_TYPE } from "@/consts/popup";

//i18n
import { useTranslation } from "next-i18next";

//styles
import styles from "./popupContactUs.module.scss";
import className from "classnames/bind";
import Link from "next/link";
const cx = className.bind(styles);

export default function PopupContactUs() {
  const { t } = useTranslation(["popup", "agree"]);
  const [{ popupState }, setGlobalState] = useGlobalState();
  const mutation = useMutation(submitContactForm);
  const [agreeType, setAgreeType] = useState(POPUP_AGREE_TYPE);

  const [formData, setFormData] = useState({
    company_name: "",
    name: "",
    email: "",
    phone_number: "",
    inquiry: "",
    message: "",
    agree1: false,
    agree2: false,
  });

  const [fieldCheck, setFieldCheck] = useState({
    company_name: false,
    name: false,
    email: false,
    emailRegex: false,
    phone_number: false,
    inquiry: false,
    message: false,
    agree1: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "phone_number" && value !== "" && !/^[0-9]+$/.test(value)) {
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.company_name) {
      setFieldCheck({ ...fieldCheck, company_name: true });
      return;
    }
    if (!formData.name) {
      setFieldCheck({ ...fieldCheck, name: true });
      return;
    }

    // if (!formData.email) {
    //   setFieldCheck({ ...fieldCheck, email: true });
    //   return;
    // }

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (formData.email && !emailRegex.test(formData.email)) {
    //   setFieldCheck({ ...fieldCheck, emailRegex: true });
    //   setFormData({ ...formData, email: "" });
    //   return;
    // }

    if (!formData.phone_number) {
      setFieldCheck({ ...fieldCheck, phone_number: true });
      return;
    }

    if (!formData.inquiry) {
      setFieldCheck({ ...fieldCheck, inquiry: true });
      return;
    }

    // if (!formData.message) {
    //   setFieldCheck({ ...fieldCheck, message: true });
    //   return;
    // }

    if (!formData.agree1) {
      setFieldCheck({ ...fieldCheck, agree1: true });
      return;
    }

    try {
      const data = await mutation.mutateAsync(formData);

      console.log("Email sent successfully:", data);

      handlePopupOpenSuccess();
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };

  const handlePopupOpenSuccess = () => {
    setGlobalState({
      popupState: {
        isOn: true,
        popup: POPUP_DEFAULT,
        content: t("popup:contact_us.alert.success"),
      },
    });
  };

  const handleClickAgree1 = () => {
    setGlobalState((prevGlobalState) => ({
      ...prevGlobalState,
      popupState: {
        ...prevGlobalState.popupState,
        title: t("agree:title"),
      },
    }));
    setAgreeType(POPUP_AGREE1_TYPE);
  };

  const handleClickAgree2 = () => {
    setAgreeType(POPUP_AGREE2_TYPE);
  };

  const handleClickBack = () => {
    setGlobalState((prevGlobalState) => ({
      ...prevGlobalState,
      popupState: {
        ...prevGlobalState.popupState,
        title: t("popup:default.contact_us_title"),
      },
    }));
    setFormData((prevformData) => ({ ...prevformData, agree1: true }));
    setAgreeType(POPUP_AGREE_TYPE);
  };

  return (
    <>
      {agreeType != POPUP_AGREE_TYPE && <div className={cx("btn-back")} onClick={() => handleClickBack()}></div>}
      {agreeType === POPUP_AGREE_TYPE ? (
        <div className={cx("contact-us")}>
          <div className={cx("contact-us-wrap")}>
            <Link href="http://pf.kakao.com/_DqyxfG" target="_blank" className={cx("btn-kakao")}>
              {t("popup:contact_us.kakao")}
              <div className={cx("click")}>
                <img src="/assets/images/hand_click.png" alt="hand click" />
              </div>
            </Link>
            <form onSubmit={(e) => handleSubmit(e)}>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={(e) => handleChange(e)}
                placeholder={
                  fieldCheck.company_name && !formData.company_name ? t("popup:contact_us.alert.company_name") : t("popup:contact_us.company_name")
                }
                className={fieldCheck.company_name ? cx("alert") : undefined}
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => handleChange(e)}
                placeholder={fieldCheck.name && !formData.name ? t("popup:contact_us.alert.name") : t("popup:contact_us.name")}
                className={fieldCheck.name ? cx("alert") : undefined}
              />
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={(e) => handleChange(e)}
                placeholder={
                  fieldCheck.email && !formData.email
                    ? fieldCheck.emailRegex
                      ? t("popup:contact_us.alert.email2")
                      : t("popup:contact_us.alert.email")
                    : fieldCheck.emailRegex
                    ? t("popup:contact_us.alert.email2")
                    : t("popup:contact_us.email")
                }
                className={fieldCheck.email || fieldCheck.emailRegex ? cx("alert") : undefined}
              />
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={(e) => handleChange(e)}
                placeholder={
                  fieldCheck.phone_number && !formData.phone_number ? t("popup:contact_us.alert.phone_number") : t("popup:contact_us.phone_number")
                }
                className={fieldCheck.phone_number ? cx("alert") : undefined}
              />
              <select
                name="inquiry"
                value={formData.inquiry}
                className={!formData.inquiry && fieldCheck.inquiry ? cx("alert") : undefined}
                onChange={(e) => handleChange(e)}
              >
                <option hidden>
                  {fieldCheck.inquiry && !formData.inquiry ? t("popup:contact_us.alert.inquiry") : t("popup:contact_us.inquiry_title")}
                </option>
                <option value={1}>{t("popup:contact_us.inquiry1")}</option>
                <option value={2}>{t("popup:contact_us.inquiry2")}</option>
                <option value={3}>{t("popup:contact_us.inquiry3")}</option>
                <option value={4}>{t("popup:contact_us.inquiry4")}</option>
                <option value={5}>{t("popup:contact_us.inquiry5")}</option>
              </select>
              <textarea
                name="message"
                value={formData.message}
                onChange={(e) => handleChange(e)}
                cols="30"
                rows="5"
                placeholder={fieldCheck.message && !formData.message ? t("popup:contact_us.alert.message") : t("popup:contact_us.message")}
                className={fieldCheck.message ? cx("alert") : undefined}
              ></textarea>

              <div className={cx("checkbox-wrap")}>
                <div className={cx("checkbox")}>
                  <input
                    type="checkbox"
                    name="agree1"
                    id="agree1"
                    value={formData.agree1}
                    checked={formData.agree1}
                    onChange={(e) => handleChange(e)}
                  />
                  <label htmlFor="agree1">
                    <span>{t("popup:contact_us.agree1")}</span>
                  </label>
                  <span className={cx("detail_view")} onClick={() => handleClickAgree1()}>
                    [{t("common:detail_view")}]
                  </span>
                  {fieldCheck.agree1 && <span className={cx("alert")}>{t("popup:contact_us.alert.agree1")}</span>}
                </div>

                <div className={cx("checkbox")}>
                  <input
                    type="checkbox"
                    name="agree2"
                    id="agree2"
                    value={formData.agree2}
                    checked={formData.agree2}
                    onChange={(e) => handleChange(e)}
                  />
                  <label htmlFor="agree2">
                    <span>{t("popup:contact_us.agree2")}</span>
                  </label>
                </div>
              </div>
              <div className={cx("button-wrap")}>
                <button type="submit" disabled={mutation.isLoading}>
                  {t("popup:contact_us.button")}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : agreeType === POPUP_AGREE1_TYPE ? (
        <div className={cx("agree1")}>
          <div className={cx("agree1-wrap")}>{t("agree:text")}</div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
