export const getLoginInfo = async (userId, userPw) => {
  const response = await fetch(`/api_default/login/data?id=${userId}&pw=${userPw}`, {
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

export const getKeyCheck = async (tk) => {
  const response = await fetch(`/api_default/login/chk?tk=${tk}`, {
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

export const getTokenCheck = async (keyCheckInfo) => {
  const response = await fetch(`/api_default/login/chk?tk=${keyCheckInfo}`, {
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
