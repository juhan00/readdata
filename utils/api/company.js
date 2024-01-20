export const getCompanyList = async () => {
  const response = await fetch(`/company/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }

  const data = await response.json();
  console.log("data.data", data.data);
  return data.data;
};

export const updateCompanyList = async (data) => {
  const response = await fetch(`/company/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      company_name: data.company_name,
      bizno: data.bizno,
      boss_name: data.boss,
      phone_num: data.phone,
      company_addr: data.addr,
      company_flag: data.flag,
      joinFlag: "unjoin",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }

  console.log("업데이트 완료");
};

export const addUserList = async (data) => {
  const response = await fetch(`/user/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      company_name: data.company_name,
      bizno: data.bizno,
      boss_name: data.boss,
      phone_num: data.phone,
      company_addr: data.addr,
      company_flag: data.flag,
      joinFlag: "join",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }

  console.log("추가 완료");
};
