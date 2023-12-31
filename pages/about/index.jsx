import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";

//구조분해
export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["about"])),
  },
});
const AboutPage = () => {
  const router = useRouter();
  const { t } = useTranslation("about");
  return (
    <div>
      <h1>{t("h1")}</h1>
      <ul>
        <li>
          {t("currentUrl")} : http://localhost:3000
          {router.locale !== "ko" && "/" + router.locale}
          {router.pathname}
        </li>
        <li>locale:{router.locale}</li>
        <li>pathname: {router.pathname}</li>
      </ul>
      <div>
        <Link href="/about" locale="en">
          <button style={{ width: 70, height: 70 }}>{t("English")}</button>
        </Link>
        <Link href="/about" locale="ko">
          <button style={{ width: 70, height: 70 }}>{t("Korean")}</button>
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
