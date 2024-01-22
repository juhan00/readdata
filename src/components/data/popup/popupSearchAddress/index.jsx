import { useState, useEffect, useRef } from "react";
import DaumPostcode from "react-daum-postcode";

//styles
import styles from "./popupSearchAddress.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const PopupSearchAddress = ({ onSelectAddress, orgAddress, onClose }) => {
  // const [isOpen, setIsOpen] = useState(true);

  const handleClickClose = () => {
    // onSelectAddress(orgAddress);
    onClose();
  };

  // useEffect(() => {
  //   document.addEventListener("click", handleDocumentClick);

  //   return () => {
  //     document.removeEventListener("click", handleDocumentClick);
  //   };
  // }, []);

  const handleComplete = (data) => {
    const fullAddress = data.address;
    // 팝업에서 선택한 주소를 상위 컴포넌트로 전달
    onSelectAddress(fullAddress);

    // setIsOpen(false);
    // 추가로 필요한 동작 수행
    onClose();
  };

  return (
    <div>
      <div className={cx("search-address-wrap")} onClick={() => handleClickClose()}>
        <div className={cx("search-address")}>
          <DaumPostcode onComplete={handleComplete} autoClose height={400} animation />
        </div>
      </div>
    </div>
  );
};

export default PopupSearchAddress;
