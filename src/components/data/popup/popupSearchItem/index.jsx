import { SEARCH_TYPE } from "@/consts/common";

//styles
import styles from "./popupSearchItem.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const PopupSearchItem = ({ searchType }) => {
  return (
    <div className={cx("search-item")}>
      <label>브랜드 명</label>
      {searchType === SEARCH_TYPE.SELECT && (
        <select>
          <option value="all">All</option>
          <option value="brand1">브랜드1</option>
          <option value="brand2">브랜드2</option>
          <option value="brand3">브랜드3</option>
        </select>
      )}
      {searchType === SEARCH_TYPE.INPUT && <input type="text" />}
    </div>
  );
};

export default PopupSearchItem;
