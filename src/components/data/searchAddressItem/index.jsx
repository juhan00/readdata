import { useQuery } from "react-query";
import { getSidoDataList, getSigoonDataList } from "@/utils/api/address";
import { SEARCH_ADDRESS } from "@/consts/common";

//styles
import styles from "./searchAddressItem.module.scss";
import className from "classnames/bind";
import { useEffect } from "react";
const cx = className.bind(styles);

const SearchAddressItem = ({ title, type = SEARCH_ADDRESS.SIDO }) => {
  const {
    data: sidoData,
    isLoading: isLoadingSidoDataData,
    refetch: refetchSidoData,
  } = useQuery("getSidoData", () => getSidoDataList(), {
    enabled: true,
  });

  const {
    data: sigoonData,
    isLoading: isLoadingSigoonDataData,
    refetch: refetchSigoonData,
  } = useQuery("getSigoonData", () => getSigoonDataList(), {
    enabled: true,
  });

  useEffect(() => {
    console.log("sidoData", sidoData);
    console.log("sigoonData", sigoonData);
  }, [sidoData, sigoonData]);

  return (
    <div className={cx("search-item")}>
      <label>{title}</label>
      <select onChange={(e) => onChange(id, e)}>
        <option>선택</option>
        {type === SEARCH_ADDRESS.SIDO &&
          sidoData?.map((item) => (
            <option key={item.properties.ctprvn_cd} value={item.properties.ctprvn_cd}>
              {item.properties.ctp_kor_nm}
            </option>
          ))}

        {type === SEARCH_ADDRESS.SIGOON &&
          sigoonData?.map((item) => (
            <option key={item.properties.sig_cd} value={item.properties.sig_cd}>
              {item.properties.sig_kor_nm}
            </option>
          ))}
      </select>
    </div>
  );
};

export default SearchAddressItem;
