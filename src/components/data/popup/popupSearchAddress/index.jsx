import { useState, useEffect, useRef } from "react";
import DaumPostcode from "react-daum-postcode";

//styles
import styles from "./popupSearchAddress.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const PopupSearchAddress = ({ onSelectAddress, orgAddress, onClose }) => {
  const handleClickClose = () => {
    onClose();
  };

  const handleComplete = (data) => {
    const fullAddress = data.address;

    onSelectAddress(fullAddress);

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
