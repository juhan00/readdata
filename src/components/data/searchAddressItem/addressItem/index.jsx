import { SEARCH_ADDRESS } from "@/consts/common";
import Select from "react-select";
import { useMemo } from "react";
//styles
import className from "classnames/bind";
import styles from "./addressItem.module.scss";

const cx = className.bind(styles);

const AddressItem = ({ type = SEARCH_ADDRESS.SIDO, data, id, value, onChange }) => {
  // const optionsData = useMemo(() => {
  //   const newArray = [
  //     {
  //       value: "",
  //       label: "선택",
  //     },
  //   ];
  //   if (type === SEARCH_ADDRESS.SIDO) {
  //     data?.map((item) => {
  //       newArray.push({
  //         value: item.properties.ctprvn_cd,
  //         label: item.properties.ctp_kor_nm,
  //       });
  //     });
  //   } else {
  //     data?.map((item) => {
  //       newArray.push({
  //         value: item.properties.sig_cd,
  //         label: item.properties.sig_kor_nm,
  //       });
  //     });
  //   }
  //   return newArray;
  // }, [data]);

  return (
    <>
      {/* <Select isMulti id={id} value={value} onChange={onChange} options={optionsData} /> */}

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
