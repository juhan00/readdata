import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko";

//styles
import styles from "./searchDateItems.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const SearchDateItem = ({ startDate, endDate, handleStartDateChange, handleEndDateChange }) => {
  return (
    <div className={cx("search-date-items")}>
      <label>검색기간</label>
      <div className={cx("date-picker")}>
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          locale={ko}
          dateFormat="yyyy-MM-dd"
          placeholderText=""
        />
      </div>
      <span className={cx("tilde")}>~</span>
      <div className={cx("date-picker")}>
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          locale={ko}
          dateFormat="yyyy-MM-dd"
          placeholderText=""
        />
      </div>
    </div>
  );
};

export default SearchDateItem;
