export const getSalesDayList = async (companyCode, startDate, endDate) => {
  const response = await fetch(`/api_default/sales/day/search?company_code=${companyCode}&from_date=${startDate}&to_date=${endDate}`, {
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

export const getSalesMonthList = async (companyCode, startMonth, endMonth) => {
  const response = await fetch(`/api_default/sales/month/search?company_code=${companyCode}&from_month=${startMonth}&to_month=${endMonth}`, {
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

export const getSalesHeadersList = async (brandCode) => {
  const response = await fetch(`/api_default/header/list?brand_code=${brandCode}`, {
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

export const getSalesRegionList = async (companyCode, startDate, endDate) => {
  const response = await fetch(`/api_default/sales/area?company_code=${companyCode}&from_date=${startDate}&to_date=${endDate}&yn=1`, {
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
