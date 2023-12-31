import { useGlobalState } from "@/context/globalStateContext";

import { useState } from "react";
import { useMutation } from "react-query";
import { submitContactForm } from "@/utils/api/contact_us";

//i18n
import { useTranslation } from "next-i18next";

//styles
import styles from "./popupContactUs.module.scss";
import className from "classnames/bind";
import Link from "next/link";
const cx = className.bind(styles);

export default function PopupContactUs() {
  const { t } = useTranslation("popup");
  const [{ popupState }, setGlobalState] = useGlobalState();
  const mutation = useMutation(submitContactForm);

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
      alert(t("contact_us.alert.company_name"));
      return;
    }
    if (!formData.name) {
      alert(t("contact_us.alert.name"));
      return;
    }
    if (!formData.email) {
      alert(t("contact_us.alert.email"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      alert(t("contact_us.alert.email2"));
      return;
    }

    if (!formData.phone_number) {
      alert(t("contact_us.alert.phone_number"));
      return;
    }
    if (!formData.inquiry) {
      alert(t("contact_us.alert.inquiry"));
      return;
    }

    if (!formData.message) {
      alert(t("contact_us.alert.message"));
      return;
    }

    if (!formData.agree1) {
      alert(t("contact_us.alert.agree1"));
      return;
    }

    try {
      const data = await mutation.mutateAsync(formData);

      console.log("Email sent successfully:", data);

      handlePopupClose();
      alert(t("contact_us.alert.success"));
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };

  const handlePopupClose = () => {
    setGlobalState({
      popupState: {
        isOn: !popupState.isOn,
      },
    });
  };

  return (
    <div className={cx("contact-us")}>
      <div className={cx("contact-us-wrap")}>
        <Link href="" className={cx("btn-kakao")}>
          {t("contact_us.kakao")}
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
            placeholder={t("contact_us.company_name")}
          />
          <input type="text" name="name" value={formData.name} onChange={(e) => handleChange(e)} placeholder={t("contact_us.name")} />
          <input type="text" name="email" value={formData.email} onChange={(e) => handleChange(e)} placeholder={t("contact_us.email")} />
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={(e) => handleChange(e)}
            placeholder={t("contact_us.phone_number")}
          />
          <select name="inquiry" value={formData.inquiry} onChange={(e) => handleChange(e)}>
            <option value={1}>{t("contact_us.inquiry1")}</option>
            <option value={2}>{t("contact_us.inquiry2")}</option>
            <option value={3}>{t("contact_us.inquiry3")}</option>
            <option value={4}>{t("contact_us.inquiry4")}</option>
            <option value={5}>{t("contact_us.inquiry5")}</option>
            <option value={6}>{t("contact_us.inquiry6")}</option>
          </select>
          <textarea
            name="message"
            value={formData.message}
            onChange={(e) => handleChange(e)}
            cols="30"
            rows="5"
            placeholder={t("contact_us.message")}
          ></textarea>

          <div className={cx("checkbox-wrap")}>
            <div className={cx("checkbox")}>
              <input type="checkbox" name="agree1" id="agree1" value={formData.agree1} onChange={(e) => handleChange(e)} />
              <label htmlFor="agree1">
                <span>{t("contact_us.agree1")}</span>
              </label>
            </div>
            <div className={cx("checkbox")}>
              <input type="checkbox" name="agree2" id="agree2" value={formData.agree2} onChange={(e) => handleChange(e)} />
              <label htmlFor="agree2">
                <span>{t("contact_us.agree2")}</span>
              </label>
            </div>
          </div>
          <div className={cx("button-wrap")}>
            <button type="submit" disabled={mutation.isLoading}>
              {t("contact_us.button")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
