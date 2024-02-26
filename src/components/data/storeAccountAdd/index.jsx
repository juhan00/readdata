import { QueryClient, useMutation, useQuery } from "react-query";
import { getStoreAccountPosName, getStoreAccountEtcName } from "@/utils/api/store";
import { updateStoreAccountList } from "@/utils/api/store";
import BtnSave from "../button/btnSave";
import { useGlobalState } from "@/context/globalStateContext";
import { POPUP_DEFAULT } from "@/consts/popup";

//styles
import className from "classnames/bind";
import styles from "./storeAccountAdd.module.scss";
import { useState, useEffect } from "react";
const cx = className.bind(styles);

const StoreAccountAdd = ({ selectStoreState }) => {
  const [{ popupState, userInfo }, setGlobalState] = useGlobalState();
  const [franName, setFranName] = useState("");
  const [fieldData, setFieldData] = useState({});

  useEffect(() => {
    setFieldData(() => ({
      ...selectStoreState,
    }));
  }, [selectStoreState]);

  const {
    data: storeAccountPosName,
    isLoading: isLoadingStoreAccountPosName,
    refetch: refetchStoreAccountPosName,
  } = useQuery("getStoreAccountPosName", () => getStoreAccountPosName(), { enabled: true });

  const {
    data: storeAccountEtcName,
    isLoading: isLoadingStoreAccountEtcName,
    refetch: refetchStoreAccountEtcName,
  } = useQuery("getStoreAccountEtcName", () => getStoreAccountEtcName(), { enabled: true });

  useEffect(() => {
    setFranName(selectStoreState.fran_name);
  }, [selectStoreState]);

  const updateMutation = useMutation(async () => await updateStoreAccountList(fieldData), {
    onSuccess: () => {
      refetchStoreData();
    },
    onError: (error) => {
      console.error("Update error:", error);

      setGlobalState((prevGlobalState) => ({
        ...prevGlobalState,
        popupState: {
          isOn: true,
          popup: POPUP_DEFAULT,
          content: "업데이트에 실패했습니다.",
        },
      }));
    },
  });

  const handleChangeFieldData = (e) => {
    const fieldId = e.target.id;
    const fieldValue = e.target.value;

    setFieldData((preData) => ({ ...preData, [fieldId]: fieldValue }));
  };

  const handleUpdateData = () => {
    if (!fieldData.fran_code) {
      setGlobalState((prevGlobalState) => ({
        ...prevGlobalState,
        popupState: {
          isOn: true,
          popup: POPUP_DEFAULT,
          content: "가맹점을 선택해주세요.",
        },
      }));
    } else {
      updateMutation.mutate();
    }
  };

  useEffect(() => {
    console.log("fieldData", fieldData);
    console.log("storeAccountPosName", storeAccountPosName);
    console.log("storeAccountEtcName", storeAccountEtcName);
  }, [fieldData, storeAccountPosName, storeAccountEtcName]);

  return (
    <div className={cx("store-account-add")}>
      <div className={cx("content-btn-wrap")}>
        <BtnSave onClick={() => handleUpdateData()} />
      </div>
      <div className={cx("group")}>
        <div className={cx("title")}>가맹점 명</div>
        <div className={cx("input-wrap")}>
          <input value={franName || ""} readOnly />
        </div>
      </div>
      <div className={cx("group")}>
        <div className={cx("title")}>POS</div>
        <div className={cx("item-wrap")}>
          <div className={cx("item")}>
            <label>구분</label>
            <select id={"pos_name"} value={fieldData.pos_name || ""} onChange={(e) => handleChangeFieldData(e)}>
              <option value={""}>선택</option>
              {storeAccountPosName?.map((item) => (
                <option key={item.chanel_id} value={item.chanel_id}>
                  {item.chanel_name}
                </option>
              ))}
            </select>
          </div>
          <div className={cx("item")}>
            <label>STORE ID</label>
            <input type="text" value={fieldData.pos_sid || ""} id={"pos_sid"} onChange={(e) => handleChangeFieldData(e)} />
          </div>
        </div>
        <div className={cx("item-wrap")}>
          <div className={cx("item")}>
            <label>ID</label>
            <input type="text" value={fieldData.pos_id || ""} id={"pos_id"} onChange={(e) => handleChangeFieldData(e)} />
          </div>
          <div className={cx("item")}>
            <label>PW</label>
            <input type="text" value={fieldData.pos_pw || ""} id={"pos_pw"} onChange={(e) => handleChangeFieldData(e)} />
          </div>
        </div>
      </div>

      <div className={cx("group")}>
        <div className={cx("title")}>배달의민족</div>
        <div className={cx("item-wrap")}>
          <div className={cx("item")}>
            <label>
              STORE ID
              <br />
              배민
            </label>
            <input type="text" value={fieldData.bae_sid || ""} id={"bae_sid"} onChange={(e) => handleChangeFieldData(e)} />
          </div>
          <div className={cx("item")}>
            <label>
              STORE ID
              <br />
              배민1
            </label>
            <input type="text" value={fieldData.bae1_sid || ""} id={"bae1_sid"} onChange={(e) => handleChangeFieldData(e)} />
          </div>
        </div>
        <div className={cx("item-wrap")}>
          <div className={cx("item")}>
            <label>ID</label>
            <input type="text" value={fieldData.bae_id || ""} id={"bae_id"} onChange={(e) => handleChangeFieldData(e)} />
          </div>
          <div className={cx("item")}>
            <label>PW</label>
            <input type="text" value={fieldData.bae_pw || ""} id={"bae_pw"} onChange={(e) => handleChangeFieldData(e)} />
          </div>
        </div>
      </div>

      <div className={cx("group")}>
        <div className={cx("title")}>요기요</div>
        <div className={cx("item-wrap")}>
          <div className={cx("item")}>
            <label>STORE ID</label>
            <input type="text" value={fieldData.yogi_sid || ""} id={"yogi_sid"} onChange={(e) => handleChangeFieldData(e)} />
          </div>
        </div>
        <div className={cx("item-wrap")}>
          <div className={cx("item")}>
            <label>ID</label>
            <input type="text" value={fieldData.yogi_id || ""} id={"yogi_id"} onChange={(e) => handleChangeFieldData(e)} />
          </div>
          <div className={cx("item")}>
            <label>PW</label>
            <input type="text" value={fieldData.yogi_pw || ""} id={"yogi_pw"} onChange={(e) => handleChangeFieldData(e)} />
          </div>
        </div>
      </div>

      <div className={cx("group")}>
        <div className={cx("title")}>쿠팡이츠</div>
        <div className={cx("item-wrap")}>
          <div className={cx("item")}>
            <label>STORE ID</label>
            <input type="text" value={fieldData.cupang_sid || ""} id={"cupang_sid"} onChange={(e) => handleChangeFieldData(e)} />
          </div>
        </div>
        <div className={cx("item-wrap")}>
          <div className={cx("item")}>
            <label>ID</label>
            <input type="text" value={fieldData.cupang_id || ""} id={"cupang_id"} onChange={(e) => handleChangeFieldData(e)} />
          </div>
          <div className={cx("item")}>
            <label>PW</label>
            <input type="text" value={fieldData.cupang_pw || ""} id={"cupang_pw"} onChange={(e) => handleChangeFieldData(e)} />
          </div>
        </div>
      </div>

      <div className={cx("group")}>
        <div className={cx("title")}>배달앱1</div>
        <div className={cx("item-wrap")}>
          <div className={cx("item")}>
            <label>구분</label>
            <select id={"etc1_name"} value={fieldData.etc1_name || ""} onChange={(e) => handleChangeFieldData(e)}>
              <option value={""}>선택</option>
              {storeAccountEtcName?.map((item) => (
                <option key={item.chanel_id} value={item.chanel_id}>
                  {item.chanel_name}
                </option>
              ))}
            </select>
          </div>
          <div className={cx("item")}>
            <label>STORE ID</label>
            <input type="text" value={fieldData.etc1_sid || ""} id={"etc1_sid"} onChange={(e) => handleChangeFieldData(e)} />
          </div>
        </div>
        <div className={cx("item-wrap")}>
          <div className={cx("item")}>
            <label>ID</label>
            <input type="text" value={fieldData.etc1_id || ""} id={"etc1_id"} onChange={(e) => handleChangeFieldData(e)} />
          </div>
          <div className={cx("item")}>
            <label>PW</label>
            <input type="text" value={fieldData.etc1_pw || ""} id={"etc1_pw"} onChange={(e) => handleChangeFieldData(e)} />
          </div>
        </div>
      </div>

      <div className={cx("group")}>
        <div className={cx("title")}>배달앱2</div>
        <div className={cx("item-wrap")}>
          <div className={cx("item")}>
            <label>구분</label>
            <select id={"etc2_name"} value={fieldData.etc2_name || ""} onChange={(e) => handleChangeFieldData(e)}>
              <option value={""}>선택</option>
              {storeAccountEtcName?.map((item) => (
                <option key={item.chanel_id} value={item.chanel_id}>
                  {item.chanel_name}
                </option>
              ))}
            </select>
          </div>
          <div className={cx("item")}>
            <label>STORE ID</label>
            <input type="text" value={fieldData.etc2_sid || ""} id={"etc2_sid"} onChange={(e) => handleChangeFieldData(e)} />
          </div>
        </div>
        <div className={cx("item-wrap")}>
          <div className={cx("item")}>
            <label>ID</label>
            <input type="text" value={fieldData.etc2_id || ""} id={"etc2_id"} onChange={(e) => handleChangeFieldData(e)} />
          </div>
          <div className={cx("item")}>
            <label>PW</label>
            <input type="text" value={fieldData.etc2_pw || ""} id={"etc2_pw"} onChange={(e) => handleChangeFieldData(e)} />
          </div>
        </div>
      </div>

      <div className={cx("group")}>
        <div className={cx("title")}>배달앱3</div>
        <div className={cx("item-wrap")}>
          <div className={cx("item")}>
            <label>구분</label>
            <select id={"etc3_name"} value={fieldData.etc3_name || ""} onChange={(e) => handleChangeFieldData(e)}>
              <option value={""}>선택</option>
              {storeAccountEtcName?.map((item) => (
                <option key={item.chanel_id} value={item.chanel_id}>
                  {item.chanel_name}
                </option>
              ))}
            </select>
          </div>
          <div className={cx("item")}>
            <label>STORE ID</label>
            <input type="text" value={fieldData.etc3_sid || ""} id={"etc3_sid"} onChange={(e) => handleChangeFieldData(e)} />
          </div>
        </div>
        <div className={cx("item-wrap")}>
          <div className={cx("item")}>
            <label>ID</label>
            <input type="text" value={fieldData.etc3_id || ""} id={"etc3_id"} onChange={(e) => handleChangeFieldData(e)} />
          </div>
          <div className={cx("item")}>
            <label>PW</label>
            <input type="text" value={fieldData.etc3_pw || ""} id={"etc3_pw"} onChange={(e) => handleChangeFieldData(e)} />
          </div>
        </div>
      </div>

      <div className={cx("group")}>
        <div className={cx("title")}>배달앱4</div>
        <div className={cx("item-wrap")}>
          <div className={cx("item")}>
            <label>구분</label>
            <select id={"etc4_name"} value={fieldData.etc4_name || ""} onChange={(e) => handleChangeFieldData(e)}>
              <option value={""}>선택</option>
              {storeAccountEtcName?.map((item) => (
                <option key={item.chanel_id} value={item.chanel_id}>
                  {item.chanel_name}
                </option>
              ))}
            </select>
          </div>
          <div className={cx("item")}>
            <label>STORE ID</label>
            <input type="text" value={fieldData.etc4_sid || ""} id={"etc4_sid"} onChange={(e) => handleChangeFieldData(e)} />
          </div>
        </div>
        <div className={cx("item-wrap")}>
          <div className={cx("item")}>
            <label>ID</label>
            <input type="text" value={fieldData.etc4_id || ""} id={"etc4_id"} onChange={(e) => handleChangeFieldData(e)} />
          </div>
          <div className={cx("item")}>
            <label>PW</label>
            <input type="text" value={fieldData.etc4_pw || ""} id={"etc4_pw"} onChange={(e) => handleChangeFieldData(e)} />
          </div>
        </div>
      </div>

      <div className={cx("group")}>
        <div className={cx("title")}>배달앱5</div>
        <div className={cx("item-wrap")}>
          <div className={cx("item")}>
            <label>구분</label>
            <select id={"etc5_name"} value={fieldData.etc5_name || ""} onChange={(e) => handleChangeFieldData(e)}>
              <option value={""}>선택</option>
              {storeAccountEtcName?.map((item) => (
                <option key={item.chanel_id} value={item.chanel_id}>
                  {item.chanel_name}
                </option>
              ))}
            </select>
          </div>
          <div className={cx("item")}>
            <label>STORE ID</label>
            <input type="text" value={fieldData.etc5_sid || ""} id={"etc5_sid"} onChange={(e) => handleChangeFieldData(e)} />
          </div>
        </div>
        <div className={cx("item-wrap")}>
          <div className={cx("item")}>
            <label>ID</label>
            <input type="text" value={fieldData.etc5_id || ""} id={"etc5_id"} onChange={(e) => handleChangeFieldData(e)} />
          </div>
          <div className={cx("item")}>
            <label>PW</label>
            <input type="text" value={fieldData.etc5_pw || ""} id={"etc5_pw"} onChange={(e) => handleChangeFieldData(e)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreAccountAdd;
