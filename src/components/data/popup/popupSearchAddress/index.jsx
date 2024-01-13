import { useState, useEffect, useRef } from "react";
import DaumPostcode from "react-daum-postcode";

const PopupSearchAddress = ({ onSelectAddress, orgAddress, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleDocumentClick = (e) => {
    onSelectAddress(orgAddress);
    setIsOpen(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const handleComplete = (data) => {
    const fullAddress = data.address;
    // 팝업에서 선택한 주소를 상위 컴포넌트로 전달
    onSelectAddress(fullAddress);

    setIsOpen(false);
    // 추가로 필요한 동작 수행
    onClose();
  };

  return (
    <div>
      {/* <button onClick={() => setIsOpen(true)}>Open Address Search</button>
      {isOpen && ( */}
      {isOpen && (
        <DaumPostcode
          onComplete={handleComplete}
          autoClose
          height={400}
          animation
          style={{ position: "fixed", zIndex: 1000, border: "1px solid #000", overflow: "hidden", maxWidth: "500px" }}
        />
      )}
      {/* )} */}
    </div>
  );
};

export default PopupSearchAddress;
