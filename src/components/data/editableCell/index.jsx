import { useState, useEffect } from "react";
import PopupSearchAddress from "@/src/components/data/popup/popupSearchAddress";

//styles
import styles from "./editableCell.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const EditableCell = ({ cell: { value: initialValue }, row: { index }, column, updateMyData, agreeOptions }) => {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false);

  const handleDocumentClick = (e) => {
    // 팝업 영역을 제외한 다른 부분이 클릭되었을 때 팝업을 닫습니다.
    if (!e.target.closest("#addressPopup")) {
      setIsAddressPopupOpen(false);
    }
  };

  // 팝업 영역 외의 다른 부분이 클릭되었을 때 처리
  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const handleChange = (e) => setValue(e.target.value);

  const handleBlur = () => {
    setIsEditing(false);
    updateMyData(index, column.id, value);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSelectAddress = (selectedAddress) => {
    // 주소 검색 팝업에서 선택한 주소를 업데이트
    setValue(selectedAddress);
    // 업데이트된 주소를 상위 컴포넌트로 전달
    updateMyData(index, column.id, selectedAddress);
    // 팝업 닫기
    setIsEditing(false);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const isAgreeColumn = column.id === "agree";
  const isAddressColumn = column.id === "address";

  return (
    <div onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        // "동의" 컬럼에 대해서만 select 엘리먼트 렌더링
        isAgreeColumn ? (
          <select value={value} onChange={handleChange} onBlur={handleBlur} autoFocus>
            {agreeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : // 주소 컬럼에 대해서만 주소 검색 팝업 렌더링
        isAddressColumn ? (
          <PopupSearchAddress
            onSelectAddress={handleSelectAddress}
            orgAddress={value}
            isAddressPopupOpen={isAddressPopupOpen}
            onClose={() => setIsEditing(false)}
          />
        ) : (
          // 나머지 컬럼에 대해서는 input 엘리먼트 렌더링
          <input value={value} onChange={handleChange} onBlur={handleBlur} autoFocus />
        )
      ) : (
        // 편집 모드가 아닐 때는 나머지 컬럼에 대해서는 <div>{value}</div> 렌더링
        <div>{value}</div>
      )}
    </div>
  );
};

export default EditableCell;
