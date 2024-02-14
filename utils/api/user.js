export const getUserList = async (companyCode) => {
  const response = await fetch(`/api_default/user/list?company_code=${companyCode}`, {
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

export const updateUserList = async (data) => {
  const response = await fetch(`/api_default/user/post`, {
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
      joinFlag: "unjoin",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }

  // console.log("업데이트 완료");
};

export const addUserList = async (data) => {
  try {
    const tokenResponse = await fetch(`/api/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: data.uid,
        user_name: data.uname,
        email: data.email,
        companyCode: data.company_code,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to fetch token.");
    }

    const tokenData = await tokenResponse.json();
    const token = tokenData.token;

    const response = await fetch(`/api_default/user/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tk: token,
        user_id: data.uid,
        user_pw: data.upw,
        user_name: data.uname,
        email: data.email,
        phone_num: data.phone,
        authority: data.authority,
        useflag: data.use_flag,
        companyCode: data.company_code,
        joinFlag: "join",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data.");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add user.");
  }

  // console.log("추가 완료");
};
