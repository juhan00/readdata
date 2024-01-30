import { QueryClient, useMutation, useQuery } from "react-query";
import { SEARCH_TYPE } from "@/consts/common";
import { getBrandList } from "@/utils/api/brand";

//styles
import styles from "./searchItem.module.scss";
import className from "classnames/bind";
import { useEffect } from "react";
const cx = className.bind(styles);

const SearchItem = ({ searchType, title, value, id, onClick, onChange, readOnly, companyCode }) => {
  const {
    data: brandData,
    isLoading: isLoadingBrandData,
    refetch: refetchBrandData,
  } = useQuery(["getBrandSelectData", companyCode], () => getBrandList(companyCode), { enabled: companyCode !== undefined });

  useEffect(() => {
    console.log("brandData", brandData);
  }, [brandData]);

  return (
    <div className={cx("search-item")}>
      <label>{title}</label>
      {searchType === SEARCH_TYPE.SELECT_BRAND && (
        <select id={id} onClick={onClick} onChange={(e) => onChange(id, e)}>
          <option value="">전체</option>
          {brandData?.map((data) => {
            return <option value={data.brand_code}>{data.brand_name}</option>;
          })}
        </select>
      )}
      {searchType === SEARCH_TYPE.SELECT_FLAG && (
        <select id={id} onClick={onClick} onChange={(e) => onChange(id, e)}>
          <option value="">전체</option>
          <option value="0">사용안함</option>
          <option value="1">사용</option>
        </select>
      )}
      {searchType === SEARCH_TYPE.SELECT_MAPPING && (
        <select id={id} onClick={onClick} onChange={(e) => onChange(id, e)}>
          <option value="">전체</option>
          <option value="0">맵핑전</option>
          <option value="1">맵핑</option>
        </select>
      )}
      {searchType === SEARCH_TYPE.INPUT && (
        <input type="text" value={value} id={id} onClick={onClick} onChange={(e) => onChange(id, e)} readOnly={readOnly} />
      )}
    </div>
  );
};

export default SearchItem;
