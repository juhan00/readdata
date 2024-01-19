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

export const updateUserList = async ({ user_id, user_pw, user_name, email, phone_num, authority, useflag, company_code, company_name }) => {
  const response = await fetch(`/user/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: user_id,
      user_pw: user_pw,
      user_name: user_name,
      email: email,
      phone_num: phone_num,
      authority: authority,
      useflag: useflag,
      company_code: company_code,
      company_name: company_name,
      joinFlag: "unjoin",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }

  console.log("업데이트 완료");
};
