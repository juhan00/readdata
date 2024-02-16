require("dotenv").config();

export const getSidoDataList = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_ADDRESSITEM_SIDO_URL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }

  const data = await response.json();
  return data.response.result.featureCollection.features;
};

export const getSigoonDataList = async (addressItem1) => {
  console.log("addressItem1", addressItem1);
  const response = await fetch(`${process.env.NEXT_PUBLIC_ADDRESSITEM_SIGUN_URL}${addressItem1}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }

  const data = await response.json();

  return data.response.result.featureCollection.features;
};
