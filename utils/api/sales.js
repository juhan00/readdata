export const getSalesDayList = async (startDate, endDate) => {
  const response = await fetch(`/sales/day/search?from_date=${startDate}&to_date=${endDate}`, {
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
