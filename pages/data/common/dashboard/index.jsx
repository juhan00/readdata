import { useQuery } from "react-query";
import { useChangeFormatDate } from "@/utils/useChangeFormatDate";
import { getDashboardBrandList, getDashboardYesterdayList, getDashboardThisMonthList } from "@/utils/api/dashboard";
import { usePagination, useSortBy, useTable } from "react-table";
import { changeDashBrandColumns, changeDashDayMonthColumns } from "@/consts/dashboardColumns";
import RenderTable from "@/src/components/data/renderTable";
import { useTranslation } from "next-i18next";
import { useGlobalState } from "@/context/globalStateContext";

//styles
import className from "classnames/bind";
import styles from "./dashboard.module.scss";
import { useEffect, useMemo, useState } from "react";
const cx = className.bind(styles);

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const yesterdayData = useChangeFormatDate(yesterday);
const thisMonthData = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}`;

const BrandTable = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state: { pageIndex, pageSize },
    gotoPage,
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    pageCount,
  } = useTable(
    {
      columns: columns,
      data: useMemo(() => data, [data]),
      initialState: { pageIndex: 0, pageSize: 10 },
      autoResetPage: false,
    },
    useSortBy,
    usePagination
  );

  return (
    <RenderTable
      tableProps={{
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        pageIndex,
        pageSize,
        gotoPage,
        previousPage,
        nextPage,
        canPreviousPage,
        canNextPage,
        pageCount,
      }}
      editMode={false}
      tableHeight={"auto"}
      totalRow={true}
    />
  );
};

const DayTable = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state: { pageIndex, pageSize },
    gotoPage,
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    pageCount,
  } = useTable(
    {
      columns: columns,
      data: useMemo(() => data, [data]),
      initialState: { pageIndex: 0, pageSize: data.length || 50 },
      autoResetPage: false,
    },
    useSortBy,
    usePagination
  );

  return (
    <RenderTable
      tableProps={{
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        pageIndex,
        pageSize,
        gotoPage,
        previousPage,
        nextPage,
        canPreviousPage,
        canNextPage,
        pageCount,
      }}
      editMode={false}
      tableHeight={"auto"}
      totalRow={true}
    />
  );
};

const MonthTable = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state: { pageIndex, pageSize },
    gotoPage,
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    pageCount,
  } = useTable(
    {
      columns: columns,
      data: useMemo(() => data, [data]),
      initialState: { pageIndex: 0, pageSize: data.length || 50 },
      autoResetPage: false,
    },
    useSortBy,
    usePagination
  );

  return (
    <RenderTable
      tableProps={{
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        pageIndex,
        pageSize,
        gotoPage,
        previousPage,
        nextPage,
        canPreviousPage,
        canNextPage,
        pageCount,
      }}
      editMode={false}
      tableHeight={"auto"}
      totalRow={true}
    />
  );
};

const Dashboard = () => {
  const [{ popupState, userInfo }, setGlobalState] = useGlobalState();
  const [companyCode, setCompanyCode] = useState(userInfo.companyCode);
  const [yesterday, setYesterday] = useState("2023-12-31");
  const [thisMonth, setThisMonth] = useState("2023-12");
  const { t } = useTranslation(["common", "columns"]);

  const dashBrandColumns = changeDashBrandColumns(t, yesterday, thisMonth);
  const dashDayMonthColumns = changeDashDayMonthColumns(t);

  const {
    data: dashBrandData,
    isLoading: isLoadingDashBrandData,
    refetch: refetchDashBrandData,
  } = useQuery("getDashBrandData", () => getDashboardBrandList(companyCode, yesterday, thisMonth), {
    enabled: companyCode !== undefined && yesterday !== undefined && thisMonth !== undefined,
  });

  const {
    data: dashYesterdayData,
    isLoading: isLoadingDashYesterdayData,
    refetch: refetchDashYesterdayData,
  } = useQuery("getDashYesterdayData", () => getDashboardYesterdayList(companyCode, yesterday), {
    enabled: companyCode !== undefined && yesterday !== undefined,
  });

  const {
    data: dashThisMonthData,
    isLoading: isLoadingDashThisMonthData,
    refetch: refetchDashThisMonthData,
  } = useQuery("getDashThisMonthData", () => getDashboardThisMonthList(companyCode, thisMonth), {
    enabled: companyCode !== undefined && thisMonth !== undefined,
  });

  const memoizedDashboardColumns = useMemo(() => {
    return yesterday && thisMonth ? dashBrandColumns : [];
  }, [yesterday, thisMonth]);

  const typeByDashBrandData = useMemo(() => {
    if (!dashBrandData) {
      return;
    }
    const groupedData = dashBrandData?.reduce((result, item) => {
      const { brand_name, type, ...rest } = item;
      const existingBrand = result.find((data) => data.brand_name === brand_name);

      if (existingBrand) {
        existingBrand[type] = { ...rest, type };
      } else {
        const newBrand = {
          brand_name,
          Mon: type === "Mon" ? { ...rest, type } : {},
          Day: type === "Day" ? { ...rest, type } : {},
        };

        result.push(newBrand);
      }

      return result;
    }, []);

    const totalRow = {
      brand_name: "합계",
      Mon: {
        cnt: groupedData?.reduce((sum, data) => sum + (Number(data.Mon.cnt) || 0), 0),
        total: groupedData?.reduce((sum, data) => sum + (Number(data.Mon.total) || 0), 0),
      },
      Day: {
        cnt: groupedData?.reduce((sum, data) => sum + (Number(data.Day.cnt) || 0), 0),
        total: groupedData?.reduce((sum, data) => sum + (Number(data.Day.total) || 0), 0),
        avg: groupedData?.reduce((sum, data) => sum + (Number(data.Day.avg) || 0), 0),
      },
    };

    groupedData?.push(totalRow);

    return groupedData || [];
  }, [dashBrandData]);

  const typeByDashYesterdayData = useMemo(() => {
    if (dashYesterdayData) {
      return;
    }
    const high5Data = dashYesterdayData?.filter((item) => item.low5 === 0);
    const low5Data = dashYesterdayData?.filter((item) => item.high5 === 0);

    const groupedData = high5Data?.map((item, index) => ({
      high5: {
        fran_name: item.fran_name,
        high5: item.high5,
      },
      low5: {
        fran_name: low5Data[index].fran_name,
        low5: low5Data[index].low5,
      },
    }));

    const totalRow = {
      high5: {
        fran_name: "합계",
        high5: groupedData?.reduce((sum, data) => sum + (Number(data.high5.high5) || 0), 0),
      },
      low5: {
        fran_name: "합계",
        low5: groupedData?.reduce((sum, data) => sum + (Number(data.low5.low5) || 0), 0),
      },
    };
    groupedData?.push(totalRow);

    return groupedData || [];
  }, [dashYesterdayData]);

  const typeByDashThisMonthData = useMemo(() => {
    if (dashThisMonthData) {
      return;
    }

    const high5Data = dashThisMonthData?.filter((item) => item.low5 === 0);
    const low5Data = dashThisMonthData?.filter((item) => item.high5 === 0);

    const groupedData = high5Data?.map((item, index) => ({
      high5: {
        fran_name: item.fran_name,
        high5: item.high5,
      },
      low5: {
        fran_name: low5Data[index].fran_name,
        low5: low5Data[index].low5,
      },
    }));

    const totalRow = {
      high5: {
        fran_name: "합계",
        high5: groupedData?.reduce((sum, data) => sum + (Number(data.high5.high5) || 0), 0),
      },
      low5: {
        fran_name: "합계",
        low5: groupedData?.reduce((sum, data) => sum + (Number(data.low5.low5) || 0), 0),
      },
    };
    groupedData?.push(totalRow);

    return groupedData || [];
  }, [dashThisMonthData]);

  return (
    <div className={cx("dashboard")}>
      <div className={cx("row")}>
        <div className={cx("box", "content-wrap")}>
          <div className={cx("item")}>
            <div className={cx("title", "brand")}>
              <strong>브랜드별</strong> 매출 추이
            </div>
            {isLoadingDashBrandData ? (
              <div className={cx("loading-data")}>데이터를 가져오고 있습니다.</div>
            ) : !typeByDashBrandData.length ? (
              <div className={cx("no-data")}>데이터가 없습니다.</div>
            ) : (
              <BrandTable columns={memoizedDashboardColumns} data={typeByDashBrandData} />
            )}
            <div className={cx("text")}>단위: 원</div>
          </div>
        </div>
      </div>
      <div className={cx("row", "flex")}>
        <div className={cx("box", "content-wrap")}>
          <div className={cx("item")}>
            <div className={cx("title", "yesterday")}>
              <strong>전일</strong> 매출 순위 <span className={cx("date")}>({yesterday})</span>
            </div>
            {isLoadingDashYesterdayData ? (
              <div className={cx("loading-data")}>데이터를 가져오고 있습니다.</div>
            ) : !typeByDashYesterdayData ? (
              <div className={cx("no-data")}>데이터가 없습니다.</div>
            ) : (
              <DayTable columns={dashDayMonthColumns} data={typeByDashYesterdayData} />
            )}
            <div className={cx("text")}>단위: 원</div>
          </div>
        </div>
        <div className={cx("box", "content-wrap")}>
          <div className={cx("item")}>
            <div className={cx("title", "thisMonth")}>
              <strong>당월</strong> 매출 순위 <span className={cx("date")}>({thisMonth})</span>
            </div>
            {isLoadingDashThisMonthData ? (
              <div className={cx("loading-data")}>데이터를 가져오고 있습니다.</div>
            ) : !typeByDashThisMonthData ? (
              <div className={cx("no-data")}>데이터가 없습니다.</div>
            ) : (
              <MonthTable columns={dashDayMonthColumns} data={typeByDashThisMonthData} />
            )}
            <div className={cx("text")}>단위: 원</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
