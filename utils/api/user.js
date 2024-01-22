export const getUserList = async () => {
  const response = await fetch(`/user/list`, {
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

export const updateUserList = async (data) => {
  const response = await fetch(`/user/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: data.uid,
      user_pw: data.upw,
      user_name: data.uname,
      email: data.email,
      phone_num: data.phone,
      authority: data.authority,
      useflag: data.use_flag,
      companyCode: data.company_code,
      company_name: data.company_name,
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
      user_id: data.uid,
      user_pw: data.upw,
      user_name: data.uname,
      email: data.email,
      phone_num: data.phone,
      authority: data.authority,
      useflag: data.use_flag,
      companyCode: data.company_code,
      company_name: data.company_name,
      joinFlag: "join",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }

  console.log("추가 완료");
};
