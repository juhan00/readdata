//components
import MainHeader from "@/src/components/main/mainHeader";
import MainBanner from "@/src/components/main/mainBanner";
import MainFooter from "@/src/components/main/mainFooter";

import PopupDefault from "@/src/components/popup/popupDefault";
import MainSection1 from "@/src/components/main/mainSection1";
import MainSection2 from "@/src/components/main/mainSection2";
import MainSection3 from "@/src/components/main/mainSection3";
import MainSection4 from "@/src/components/main/mainSection4";
import MainSection5 from "@/src/components/main/mainSection5";

//styles
import styles from "./index.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

// import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export default function Home() {
  const { t } = useTranslation("common");

  return (
    <main className={cx("main")}>
      <PopupDefault />
      <MainHeader />
      <MainSection1 />
      <MainSection2 />
      <MainSection3 />
      <MainSection4 />
      <MainBanner />
      <MainSection5 />
      <MainFooter />
    </main>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "popup"])),
  },
});
