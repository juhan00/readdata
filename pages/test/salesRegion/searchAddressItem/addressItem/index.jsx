import { SEARCH_ADDRESS } from "@/consts/common";
import Select, { components } from "react-select";
import { useMemo, useState } from "react";
//styles
import className from "classnames/bind";
import styles from "./addressItem.module.scss";

const cx = className.bind(styles);

const AddressItem = ({ type = SEARCH_ADDRESS.SIDO, data, id, value, onChange }) => {
  const [prevSelectedCount, setPrevSelectedCount] = useState(0);

  const handleChange = (newValue) => {
    onChange(newValue);
  };

  // const MultiValueOption = ({ data }) => {
  //   const selectedCount = data?.length || 0;

  //   // 이전 선택된 옵션 개수와 현재 선택된 옵션 개수가 다르다면 업데이트
  //   if (prevSelectedCount !== selectedCount) {
  //     setPrevSelectedCount(selectedCount);
  //   }

  //   return <span>{`${selectedCount} / ${optionsData.length} selected`}</span>;
  // };

  // 옵션 선택 또는 취소 시 처리하는 함수
  const handleChangeOption = (option) => {
    const newValue = value ? [...value] : [];
    const index = newValue.findIndex((v) => v.value === option.value);

    if (index === -1) {
      newValue.push(option); // 선택된 옵션에 추가
    } else {
      newValue.splice(index, 1); // 선택된 옵션에서 제거
    }

    onChange(newValue); // 변경된 값을 부모 컴포넌트에 전달
  };

  const optionsData = useMemo(() => {
    const newArray = [];
    if (type === SEARCH_ADDRESS.SIDO) {
      data?.map((item) => {
        newArray.push({
          value: item.properties.ctprvn_cd,
          label: item.properties.ctp_kor_nm,
        });
      });
    } else {
      data?.map((item) => {
        newArray.push({
          value: item.properties.sig_cd,
          label: item.properties.sig_kor_nm,
        });
      });
    }
    return newArray;
  }, [data]);

  return (
    <>
      <Select isMulti id={id} value={value} onChange={handleChange} options={optionsData} components={{ MultiValue: MultiValueOption }} />

      {/* <select id={id} value={value || ""} onChange={onChange}>
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
      </select> */}
    </>
  );
};

export default AddressItem;
