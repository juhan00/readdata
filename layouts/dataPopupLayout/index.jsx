//styles
import styles from "./dataPopupLayout.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const DataPopupLayout = ({ children, title, setIsPopup, setGlobalState }) => {
  const handleClickClose = () => {
    setIsPopup(false);
    if (setGlobalState) {
      setGlobalState((prevGlobalState) => ({
        ...prevGlobalState,
        popupState: {
          isOn: false,
        },
      }));
    }
  };
  return (
    <div className={cx("popup")}>
      <div className={cx("popup-wrap")}>
        <div className={cx("box")}>
          <button className={cx("close")} onClick={() => handleClickClose()}></button>
          {title && <div className={cx("title")}>{title}</div>}
          <div className={cx("content-wrap")}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DataPopupLayout;
