export const getDashboardBrandList = async (companyCode, yesterday, thisMonth) => {
  const response = await fetch(`/api_default/dashboard/all?company_code=${companyCode}&sale_month=${thisMonth}&sale_date=${yesterday}`, {
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

export const getDashboardYesterdayList = async (companyCode, yesterday) => {
  const response = await fetch(`/api_default/dashboard/day?company_code=${companyCode}&sale_date=${yesterday}`, {
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

export const getDashboardThisMonthList = async (companyCode, thisMonth) => {
  const response = await fetch(`/api_default/dashboard/day?company_code=${companyCode}&sale_month=${thisMonth}`, {
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
