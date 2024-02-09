export const getCompanyList = async (companyCode) => {
  const response = await fetch(`/api_default/company/list?company_code=${companyCode}`, {
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

export const updateCompanyList = async (data) => {
  const response = await fetch(`/api_default/company/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      company_name: data.company_name,
      bizno: data.bizno,
      boss_name: data.boss,
      email: data.email,
      phone_num: data.phone,
      company_addr: data.addr,
      company_flag: data.flag,
      joinFlag: "unjoin",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }

  // console.log("업데이트 완료");
};

export const addCompanyList = async (data) => {
  console.log("addCompanyList", data);
  const response = await fetch(`/api_default/company/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      company_name: data.company_name,
      bizno: data.bizno,
      boss_name: data.boss,
      email: data.email,
      phone_num: data.phone,
      company_addr: data.addr,
      company_flag: data.flag,
      joinFlag: "join",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }

  // console.log("추가 완료");
};
