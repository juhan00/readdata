import DataPopupLayout from "@/layouts/dataPopupLayout";
import PopupSearchItem from "../popupSearchItem";
import { SEARCH_TYPE_INPUT } from "@/consts/common";
import BtnPopupSearch from "../../button/btnPopupSearch";

//styles
import styles from "./popupSearchBrand.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const PopupSearchBrand = ({ setReturnState, setIsPopup }) => {
  const handleClickReturn = () => {
    setReturnState("팝업 리턴데이터");
    setIsPopup(false);
  };

  return (
    <DataPopupLayout title={"테스트 타이틀"} setIsPopup={setIsPopup}>
      <div className={cx("search-brand")}>
        <div className={cx("search-wrap")}>
          <PopupSearchItem searchType={SEARCH_TYPE_INPUT} />
          <BtnPopupSearch />
        </div>
        <div className={cx("content-wrap")}>
          skdlfjlsdkjflkdsjflkdsajflsdaj
          <br />
          dfjdsklfjskdlfjsd;lafsa;ddfs
          <br />
          fjsdlfjsldfjldsajfladsjfladsj
          <br />
          kldjflsdjflksdajflsadjfl;sdajfasd
          <br />
          fsdjflksdjfklsdjfklsdajflksdajfl
          <br />
          <button onClick={() => handleClickReturn()}>데이터 반환</button>
        </div>
      </div>
    </DataPopupLayout>
  );
};

export default PopupSearchBrand;
