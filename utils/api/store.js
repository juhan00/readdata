export const getStoreList = async (companyCode) => {
  const response = await fetch(`/api_default/franchise/list?company_code=${companyCode}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }

  const data = await response.json();

  return data.data;
};

export const updateStoreList = async (data) => {

  const response = await fetch(`/api_default/store/mng/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      brand_code: data.brand_code,
      brand_name: data.brand_name,
      fran_code: data.fran_code,
      fran_name: data.fran_name,
      bizno: data.bizno,
      supervisor: data.supervisor,
      addr: data.addr,
      gubun1: data.gubun1,
      gubun1_h: data.gubun1_h,
      gubun2: data.gubun2,
      gubun2_h: data.gubun2_h,
      use_flag: data.use_flag,
      joinFlag: "unjoin",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }

  // console.log("업데이트 완료");
};

export const addStoreList = async (data) => {

  const response = await fetch(`/api_default/store/mng/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      brand_code: data.brand_code,
      brand_name: data.brand_name,
      fran_code: data.fran_code,
      fran_name: data.fran_name,
      bizno: data.bizno,
      supervisor: data.supervisor,
      addr: data.addr,
      gubun1: data.gubun1,
      gubun1_h: data.gubun1_h,
      gubun2: data.gubun2,
      gubun2_h: data.gubun2_h,
      use_flag: data.use_flag,
      joinFlag: "join",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }

  // console.log("추가 완료");
};

export const getStoreAccountList = async (companyCode) => {
  const response = await fetch(`/api_default/store/mng/list?company_code=${companyCode}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }

  const data = await response.json();

  return data.data;
};

export const updateStoreAccountList = async (data) => {
  const response = await fetch(`/api_default/store/acc/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fran_code: data.fran_code,
      fran_name: data.fran_name,
      bizno: data.bizno,
      pos_name: data.pos_name,
      pos_id: data.pos_id,
      pos_pw: data.pos_pw,
      pos_sid: data.pos_sid,
      bae_id: data.bae_id,
      bae_pw: data.bae_pw,
      bae_sid: data.bae_sid,
      bae1_sid: data.bae1_sid,
      yogi_id: data.yogi_id,
      yogi_pw: data.yogi_pw,
      yogi_sid: data.yogi_sid,
      cupang_id: data.cupang_id,
      cupang_pw: data.cupang_pw,
      cupang_sid: data.cupang_sid,
      etc1_id: data.etc1_id,
      etc1_pw: data.etc1_pw,
      etc1_sid: data.etc1_sid,
      etc1_site: data.etc1_name,
      etc2_id: data.etc2_id,
      etc2_pw: data.etc2_pw,
      etc2_sid: data.etc2_sid,
      etc2_site: data.etc2_name,
      etc3_id: data.etc3_id,
      etc3_pw: data.etc3_pw,
      etc3_sid: data.etc3_sid,
      etc3_site: data.etc3_name,
      etc4_id: data.etc4_id,
      etc4_pw: data.etc4_pw,
      etc4_sid: data.etc4_sid,
      etc4_site: data.etc4_name,
      etc5_id: data.etc5_id,
      etc5_pw: data.etc5_pw,
      etc5_sid: data.etc5_sid,
      etc5_site: data.etc5_name,
      brand_name: data.brand_name,
      use_flag: data.use_flag,
      joinFlag: "unjoin",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }

  // console.log("업데이트 완료");
};

export const getStoreMapingList = async (companyCode) => {
  const response = await fetch(`/api_default/mapping/list?company_code=${companyCode}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }

  const data = await response.json();

  return data.data;
};

export const updateStoreMapingList = async (data) => {
  const response = await fetch(`/api_default/franchise/mapping`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      scrap_name: data.scrap_name,
      fran_name: data.fran_name,
      fran_code: data.fran_code,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }

  // console.log("업데이트 완료");
};

export const getScrapingList = async (companyCode, checkedJoinFlag) => {
  const joinFlag = checkedJoinFlag ? "join" : "unjoin";
  const response = await fetch(`/api_default/franchise/scrap?company_code=${companyCode}&joinflag=${joinFlag}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }

  const data = await response.json();

  return data.data;
};
