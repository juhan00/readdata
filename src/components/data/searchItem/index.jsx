import { SEARCH_TYPE_SELECT_FLAG, SEARCH_TYPE_INPUT } from "@/consts/common";

//styles
import styles from "./searchItem.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const SearchItem = ({ searchType, title, value, id, onClick, onChange, readOnly }) => {
  return (
    <div className={cx("search-item")}>
      <label>{title}</label>
      {searchType === SEARCH_TYPE_SELECT_FLAG && (
        <select id={id} onClick={onClick} onChange={(e) => onChange(id, e)}>
          <option value="">전체</option>
          <option value="0">사용안함</option>
          <option value="1">사용</option>
        </select>
      )}
      {searchType === SEARCH_TYPE_INPUT && (
        <input type="text" value={value} id={id} onClick={onClick} onChange={(e) => onChange(id, e)} readOnly={readOnly} />
      )}
    </div>
  );
};

export default SearchItem;
