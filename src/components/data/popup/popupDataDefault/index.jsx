import { useGlobalState } from "@/context/globalStateContext";
import DataPopupLayout from "@/layouts/dataPopupLayout";
import { POPUP_DEFAULT, POPUP_SEARCH} from "@/consts/popup";
import {useMemo, useCallback} from "react";
import _debounce from 'lodash/debounce';

//i18n
import { useTranslation } from "next-i18next";

//styles
import className from "classnames/bind";
import styles from "./popupDataDefault.module.scss";
import { useEffect, useState } from "react";
import BtnSearch from "@/src/components/data/button/btnSearch";
const cx = className.bind(styles);

export default function PopupDataDefault({ onSelectItem, salesDayData }) {
  const searchFieldData = {
    chk_fran_name: ""
  };
  const [{ popupState }, setGlobalState] = useGlobalState();
  const [isPopup, setIsPopup] = useState(false);
  const { t } = useTranslation("popup");

  const [localData, setLocalData] = useState([]); // Local state for data within the popup

  //조회기간 테이블
  const [tableState, setTableState] = useState([]);
  //조회기간 검색
  const [searchData, setSearchData] = useState(searchFieldData);
  const [searchField, setSearchField] = useState(searchFieldData);


  useEffect(() => {
    setIsPopup(popupState.isOn); // 'popupState.isOn' 값으로 로컬 상태 'isPopup'을 업데이트합니다.

    // 'popupState.content'가 존재하고 'props'와 'salesDayData'를 포함하는지 확인합니다.
    if (popupState.content && popupState.content.props && popupState.content.props.salesDayData) {
      // 조건이 충족되면 로컬 상태 'localData'를 'popupState.content.props.salesDayData'의 값으로 업데이트합니다.
      setLocalData(popupState.content.props.salesDayData);
    }
  }, [popupState.isOn, popupState.content]);

  console.log("검색창 누르면 localData=",localData);

  //조회기간
   const memoizedData = useMemo(() => {
       return localData?.filter((row) =>
           (!searchData.chk_fran_name || row.chk_fran_name?.toString().toLowerCase().includes(searchData.chk_fran_name.toLowerCase()))
          )
   }, [tableState, searchData]);

   console.log("tableState!!!!",tableState);
   console.log("searchData!!!!",searchData);
   console.log("memoizedData!!!!",memoizedData);

    const uniqueValuesSet = new Set(memoizedData.map(item => item.chk_fran_name));

// Convert the Set back to an array
    const uniqueMemoizedData = Array.from(uniqueValuesSet);
    console.log("uniqueMemoizedData@@@",uniqueMemoizedData);

 useEffect(() => {
   if (popupState.isOn) {
     setIsPopup(true);
   } else {
     setIsPopup(false);
   }
 }, [popupState.isOn]);

 const handleFieldChange = (field, e) => {
   e.preventDefault();
   setSearchField((prevData) => ({
     ...prevData,
     [field]: e.target.value,
   }));
 };

 const handleSearchSubmit = (e) => {
   setSearchData((prevData) => ({
     ...prevData,
     ...searchField,
   }));
   // gotoPage(0);
 };



    const handleItemClick = (selectedItem) => {
        // Call the onSelectItem function from props and pass the selected item

        if (onSelectItem) {
            onSelectItem(selectedItem);
        }
        console.log("selectedItem===",selectedItem);
        console.log("onSelectItem===",onSelectItem);
    };


 return (
     isPopup && (
         <>
           <DataPopupLayout title={popupState.title} setIsPopup={setIsPopup} setGlobalState={setGlobalState}>
             <div className={cx("popup_default_wrap")}>
               {popupState.popup === POPUP_SEARCH ? (
                   <div>
                     <input
                         type="text"
                         placeholder="검색어를 입력하세요"
                         value={searchField.chk_fran_name}  // Replace "yourFieldName" with the actual field name you want to update
                         onChange={(e) => handleFieldChange('chk_fran_name', e)}  // Again, replace "yourFieldName" accordingly
                     />
                     <div className={cx("btn-submit")}>
                       <BtnSearch onClick={handleSearchSubmit}/>
                     </div>

                       <ul>
                           {uniqueMemoizedData.map((item, index) => (
                               <li key={index} onClick={() => handleItemClick(item)}>
                                   {item}
                               </li>
                           ))}
                       </ul>
                   </div>
               ) : (
                   // 기존 코드 유지
                   <div
                       className={cx("popup_default_wrap")}>{popupState.popup === POPUP_DEFAULT && popupState.content}</div>
                )}
              </div>
            </DataPopupLayout>
          </>
      )
  );
}