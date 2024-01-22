export const getBrandList = async (companyCode) => {
  console.log(`/brand/list?brand_code=${companyCode}`);
  const response = await fetch(`/brand/mng/list?company_code=${companyCode}`, {
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

export const updateBrandList = async (data) => {
  const response = await fetch(`/brand/mng/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      company_code: data.company_code,
      brand_name: data.brand_name,
      brand_flag: data.use_flag,
      joinFlag: "unjoin",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }

  console.log("업데이트 완료");
};

export const addBrandList = async (data) => {
  const response = await fetch(`/brand/mng/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      company_code: data.company_code,
      brand_name: data.brand_name,
      brand_flag: data.use_flag,
      joinFlag: "join",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }

  console.log("추가 완료");
};
