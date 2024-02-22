export const getSalesAnalysisList = async (companyCode, startDate, endDate) => {
    const response = await fetch(`/api_default/profile/chk/all?company_code=${companyCode}&from_date=${startDate}&to_date=${endDate}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch data.");
    }

    const data = await response.json();
    // console.log("조회기간 data=",data.data);
    return data.data;

};

export const getSalesCompareAnalysisList = async (companyCode, startDate, endDate) => {
    const response = await fetch(`/api_default/profile/pre/all?company_code=${companyCode}&from_date=${startDate}&to_date=${endDate}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch data.");
    }

    const data = await response.json();
    // console.log("대비기간 data=",data.data);
    return data.data;
};


//이건 월별이라 필요없을 것 같음
/*
export const getSalesAnalysisMonthList = async (startMonth, endMonth) => {
    const response = await fetch(`/sales/month/search?from_month=${startMonth}&to_month=${endMonth}`, {
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
*/
