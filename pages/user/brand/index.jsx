import SearchItem from "@/src/components/data/searchItem";
import { SEARCH_TYPE_SELECT, SEARCH_TYPE_INPUT } from "@/consts/common";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import PopupSearchBrand from "@/src/components/data/popup/popupSearchBrand";

//styles
import styles from "./brand.module.scss";
import className from "classnames/bind";

const cx = className.bind(styles);

const Brand = () => {
  const { t } = useTranslation(["common", "dataUser"]);

  const [brandState, setBrandState] = useState("초기 데이터");

  const [isPopup, setIsPopup] = useState(true);
  return (
    <>
      {isPopup && <PopupSearchBrand setReturnState={setBrandState} setIsPopup={setIsPopup} />}

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
          <div className={cx("col")}>{brandState}</div>
        </div>
      </div>
    </>
  );
};

export default Brand;
