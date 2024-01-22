export async function getStoreList(brandCode) {
  const response = await fetch(`/store/list?brand_code=${brandCode}`, {
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
}
