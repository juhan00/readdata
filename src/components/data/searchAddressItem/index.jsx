import AddressItem from "./addressItem";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { SEARCH_ADDRESS } from "@/consts/common";
import { getSidoDataList, getSigoonDataList } from "@/utils/api/address";

//styles
import className from "classnames/bind";
import styles from "./searchAddressItem.module.scss";

const cx = className.bind(styles);

const SearchAddressItem = ({ title, type, data, id, value, onChange }) => {
  return (
    <div className={cx("search-item")}>
      <label>{title}</label>
      <AddressItem type={type} data={data} id={id} value={value} onChange={(e) => onChange(id, e)} />
    </div>
  );
};

export default SearchAddressItem;
