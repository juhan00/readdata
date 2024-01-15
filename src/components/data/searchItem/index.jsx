import { SEARCH_TYPE_SELECT, SEARCH_TYPE_INPUT } from "@/consts/common";

//styles
import styles from "./searchItem.module.scss";
import className from "classnames/bind";
import { useEffect } from "react";
const cx = className.bind(styles);

const SearchItem = ({ searchType, title, name, onChange }) => {
  return (
    <div className={cx("search-item")}>
      <label>{title}</label>
      {searchType === SEARCH_TYPE_SELECT && (
        <select>
          <option value="all">All</option>
          <option value="brand1">브랜드1</option>
          <option value="brand2">브랜드2</option>
          <option value="brand3">브랜드3</option>
        </select>
      )}
      {searchType === SEARCH_TYPE_INPUT && <input type="text" name={name} onChange={(e) => onChange(name, e)} />}
    </div>
  );
};

export default SearchItem;
