//styles
import styles from "./checkBox.module.scss";
import className from "classnames/bind";

const cx = className.bind(styles);

const CheckBox = ({ title, id, checked, onChange }) => {
  return (
    <div className={cx("checkbox-wrap")}>
      <input id={id} type="checkbox" checked={checked} onChange={onChange} />
      <label htmlFor={id}>
        <span>{title}</span>
      </label>
    </div>
  );
};

export default CheckBox;
