export const useChangeFormatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const useChangeFormatMonth = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}`;
};

export const useChangeFormatDateUTC = (date) => {
  const originalDate = new Date(date);
  const formattedDate = originalDate.toISOString().split("T")[0];
  return formattedDate;
};
