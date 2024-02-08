import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko";
import { useChangeFormatMonth } from "@/utils/useChangeFormatDate";

//styles
import styles from "./searchDateItems.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const SearchDateItem = ({ startDate, endDate, handleStartDateChange, handleEndDateChange, isMonth, updateDate }) => {
    const handleEndDateSelect = (date) => {
        if (date.getTime() === endDate.getTime()) {
            updateDate(date);
        }
    };

    return (
        <div className={cx("search-date-items")}>
            <label>검색기간</label>
            <div className={cx("date-picker")}>
                {isMonth ? (
                    <DatePicker
                        selected={startDate}
                        onChange={handleStartDateChange}
                        selectsStart
                        locale={ko}
                        dateFormat="yyyy-MM"
                        placeholderText=""
                        showMonthYearPicker
                    />
                ) : (
                    <DatePicker
                        selected={startDate}
                        onChange={handleStartDateChange}
                        // selectsStart
                        // startDate={startDate}
                        // endDate={endDate}
                        locale={ko}
                        dateFormat="yyyy-MM-dd"
                        placeholderText=""
                    />
                )}
            </div>
            <span className={cx("tilde")}>~</span>
            <div className={cx("date-picker")}>
                {isMonth ? (
                    <DatePicker
                        selected={endDate}
                        onChange={handleEndDateChange}
                        onSelect={handleEndDateSelect}
                        locale={ko}
                        dateFormat="yyyy-MM"
                        placeholderText=""
                        showMonthYearPicker
                    />
                ) : (
                    <DatePicker
                        selected={endDate}
                        onChange={handleEndDateChange}
                        onSelect={handleEndDateSelect}
                        // selectsEnd
                        // startDate={startDate}
                        // endDate={endDate}
                        // minDate={startDate}
                        locale={ko}
                        dateFormat="yyyy-MM-dd"
                        placeholderText=""
                    />
                )}
            </div>
        </div>
    );
};

export default SearchDateItem;