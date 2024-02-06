export const useGetDateArray = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dateArray = [];

  let currentDate = new Date(start);
  while (formatDate(currentDate) <= formatDate(end)) {
    dateArray.push(formatDate(currentDate));
    currentDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
};

export const useGetMonthArray = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dateArray = [];

  let currentMonth = new Date(start);
  currentMonth.setDate(1); // 각 월의 1일로 설정

  while (currentMonth <= end) {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    dateArray.push(`${year}-${month}`);

    // 다음 월로 이동
    currentMonth.setMonth(currentMonth.getMonth() + 1);
  }

  return dateArray;
};
