import { QueryClient, useMutation, useQuery } from "react-query";
import { SEARCH_TYPE } from "@/consts/common";
import { getBrandList } from "@/utils/api/brand";
import { useEffect } from "react";

//styles
import styles from "./searchItem.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const SearchItem = ({ searchType, title, value, setDefaultValue, id, onClick, onChange, readOnly, companyCode }) => {
  const {
    data: brandData,
    isLoading: isLoadingBrandData,
    refetch: refetchBrandData,
  } = useQuery(["getBrandSelectData", companyCode], () => getBrandList(companyCode), { enabled: companyCode !== undefined });

  useEffect(() => {
    if (brandData && setDefaultValue) {
      setDefaultValue(brandData[0].brand_code);
    }
  }, [brandData]);

  return (
    <div className={cx("search-item")}>
      <label>{title}</label>
      {searchType === SEARCH_TYPE.SELECT_BRAND && (
        <select id={id} onClick={onClick} onChange={(e) => onChange(id, e)}>
          {!setDefaultValue && <option value="">전체</option>}
          {brandData?.map((data) => {
            return (
              <option key={data.brand_code} value={data.brand_code}>
                {data.brand_name}
              </option>
            );
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
