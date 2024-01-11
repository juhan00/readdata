import SearchItem from "@/src/components/data/searchItem";
import { SEARCH_TYPE_SELECT, SEARCH_TYPE_INPUT } from "@/consts/common";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import SearchBrand from "@/src/components/data/popup/searchBrand";

//styles
import styles from "./brand.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const Brand = () => {
  const { t } = useTranslation(["common", "dataUser"]);

  const [isPopup, setIsPopup] = useState(true);
  return (
    <>
      {isPopup && <SearchBrand setIsPopup={setIsPopup} />}

      <div className={cx("brand")}>
        <div className={cx("row")}>
          <div className={cx("col")}>
            <div className={cx("item")}>
              <SearchItem searchType={SEARCH_TYPE_SELECT} />
            </div>
            <div className={cx("item")}>
              <SearchItem searchType={SEARCH_TYPE_INPUT} />
            </div>
            <button className={cx("submit")}>{t("search")}</button>
          </div>
        </div>
        <div className={cx("row")}>
          <div className={cx("col")}>dsfsdfs</div>
        </div>
      </div>
    </>
  );
};

export default Brand;
