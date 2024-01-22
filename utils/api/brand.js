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
