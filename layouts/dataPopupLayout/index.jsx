//styles
import styles from "./dataPopupLayout.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const DataPopupLayout = ({ children, title, setIsPopup }) => {
  const handleClickClose = () => {
    setIsPopup(false);
  };
  return (
    <div className={cx("popup")}>
      <div className={cx("popup-wrap")}>
        <div className={cx("box")}>
          <button className={cx("close")} onClick={() => handleClickClose()}></button>
          <div className={cx("title")}>{title}</div>
          <div className={cx("content-wrap")}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DataPopupLayout;
