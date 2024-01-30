import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko";

//styles
import styles from "./searchDateItems.module.scss";
import className from "classnames/bind";

const cx = className.bind(styles);

const SearchDateItem = ({startDate, endDate, handleStartDateChange, handleEndDateChange, isMonth, labelText}) => {
    return (<div className={cx("search-date-items")}>
            {/*매출분석 페이지는 '조회기간','대비기간' 라벨 변경*/}
            {labelText === 1 ? <label>검색기간</label> : (labelText === 2 ? <label>조회기간</label> : <label>대비기간</label>)}

            <div className={cx("date-picker")}>
                {isMonth ? (<DatePicker
                        selected={startDate}
                        onChange={handleStartDateChange}
                        selectsStart
                        locale={ko}
                        dateFormat="yyyy-MM"
                        placeholderText=""
                        showMonthYearPicker
                    />) : (<DatePicker
                        selected={startDate}
                        onChange={handleStartDateChange}
                        // selectsStart
                        // startDate={startDate}
                        // endDate={endDate}
                        locale={ko}
                        dateFormat="yyyy-MM-dd"
                        placeholderText=""
                    />)}
            </div>
            <span className={cx("tilde")}>~</span>
            <div className={cx("date-picker")}>
                {isMonth ? (
                    <DatePicker selected={endDate} onChange={handleEndDateChange} locale={ko} dateFormat="yyyy-MM"
                                placeholderText="" showMonthYearPicker/>) : (<DatePicker
                        selected={endDate}
                        onChange={handleEndDateChange}
                        // selectsEnd
                        // startDate={startDate}
                        // endDate={endDate}
                        // minDate={startDate}
                        locale={ko}
                        dateFormat="yyyy-MM-dd"
                        placeholderText=""
                    />)}
            </div>
        </div>);
};

export default SearchDateItem;
