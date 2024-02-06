import { SEARCH_ADDRESS } from "@/consts/common";

//styles
import className from "classnames/bind";
import styles from "./addressItem.module.scss";

const cx = className.bind(styles);

const AddressItem = ({ type = SEARCH_ADDRESS.SIDO, data, id, value, onChange }) => {
  return (
    <>
      <select id={id} value={value || ""} onChange={onChange}>
        <option value={""}>선택</option>
        {type === SEARCH_ADDRESS.SIDO &&
          data?.map((item) => (
            <option key={item.properties.ctprvn_cd} value={item.properties.ctprvn_cd}>
              {item.properties.ctp_kor_nm}
            </option>
          ))}
        {type === SEARCH_ADDRESS.SIGOON &&
          data?.map((item) => (
            <option key={item.properties.sig_cd} value={item.properties.sig_cd}>
              {item.properties.sig_kor_nm}
            </option>
          ))}
      </select>
    </>
  );
};

export default AddressItem;
