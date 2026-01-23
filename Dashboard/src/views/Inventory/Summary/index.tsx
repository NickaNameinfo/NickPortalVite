import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Spinner,
  Button,
  Tabs,
  Tab,
} from "@nextui-org/react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  useGetInventorySummaryQuery,
  useGetInboundTransactionsQuery,
  useGetOutboundTransactionsQuery,
  useGetVendorInventoryStatsQuery,
} from "../Service.mjs";
import { useGetBillsQuery } from "../../Billing/Service.mjs";
import { getCookie } from "../../../JsFiles/CommonFunction.mjs";
import { useNavigate } from "react-router-dom";

type DateFilterType = "daily" | "weekly" | "monthly" | "yearly" | "6months" | "9months";

const InventorySummary = () => {
  const vendorId = getCookie("vendorId");
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = React.useState<DateFilterType>("monthly");

  // Calculate date range based on selected filter
  const getDateRange = React.useCallback((filter: DateFilterType) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const startDate = new Date();

    switch (filter) {
      case "daily":
        startDate.setDate(today.getDate() - 30); // Last 30 days for daily view
        break;
      case "weekly":
        startDate.setDate(today.getDate() - 84); // Last 12 weeks
        break;
      case "monthly":
        startDate.setMonth(today.getMonth() - 12); // Last 12 months
        break;
      case "yearly":
        startDate.setFullYear(today.getFullYear() - 5); // Last 5 years
        break;
      case "6months":
        startDate.setMonth(today.getMonth() - 6); // Last 6 months
        break;
      case "9months":
        startDate.setMonth(today.getMonth() - 9); // Last 9 months
        break;
      default:
        startDate.setMonth(today.getMonth() - 12);
    }

    startDate.setHours(0, 0, 0, 0);
    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: today.toISOString().split("T")[0],
    };
  }, []);

  const { startDate, endDate } = getDateRange(dateFilter);

  // Fetch all APIs - Backend extracts vendorId from authenticated session
  // Note: These queries don't require parameters, but RTK Query needs an argument
  const { 
    data: summaryData, 
    isLoading: summaryLoading, 
    error: summaryError,
    refetch: refetchSummary
  } = useGetInventorySummaryQuery(undefined, { 
    refetchOnMountOrArgChange: true 
  });

  const { 
    data: vendorStats, 
    isLoading: vendorStatsLoading,
    error: vendorStatsError,
    refetch: refetchVendorStats
  } = useGetVendorInventoryStatsQuery(undefined, { 
    refetchOnMountOrArgChange: true 
  });

  const storeId = getCookie("storeId");
  const { 
    data: inboundData, 
    isLoading: inboundLoading,
    error: inboundError,
    refetch: refetchInbound
  } = useGetInboundTransactionsQuery(
    { startDate, endDate },
    { 
      refetchOnMountOrArgChange: true,
      skip: !vendorId && !storeId
    }
  );

  // Debug: Log inbound data
  React.useEffect(() => {
    console.log("Purchase Chart Debug:", {
      vendorId,
      storeId,
      hasInboundData: !!inboundData,
      inboundDataStructure: inboundData,
      inboundDataArray: inboundData?.data,
      inboundDataLength: inboundData?.data?.length,
      startDate,
      endDate,
      dateFilter,
      inboundError: inboundError?.data?.message || inboundError?.message,
    });
  }, [inboundData, vendorId, storeId, startDate, endDate, dateFilter, inboundError]);

  const { 
    data: outboundData, 
    isLoading: outboundLoading,
    error: outboundError,
    refetch: refetchOutbound
  } = useGetOutboundTransactionsQuery(
    { startDate, endDate },
    { 
      refetchOnMountOrArgChange: true,
      skip: !vendorId && !storeId
    }
  );
  const { 
    data: billsData, 
    isLoading: billsLoading,
    error: billsError,
    refetch: refetchBills
  } = useGetBillsQuery(Number(storeId), {
    refetchOnMountOrArgChange: true,
    skip: !storeId
  });


  // Calculate additional statistics
  const recentInboundTotal = React.useMemo(() => {
    if (!inboundData?.data || !Array.isArray(inboundData.data)) return 0;
    return inboundData.data.reduce(
      (sum: number, item: any) => sum + (Number(item.quantity) || 0),
      0
    );
  }, [inboundData]);

  const recentOutboundTotal = React.useMemo(() => {
    if (!outboundData?.data || !Array.isArray(outboundData.data)) return 0;
    return outboundData.data.reduce(
      (sum: number, item: any) => sum + (Number(item.quantity) || 0),
      0
    );
  }, [outboundData]);

  // Calculate total sales from billing data (last 30 days)
  const recentBillsTotal = React.useMemo(() => {
    if (!billsData?.data || !Array.isArray(billsData.data)) return 0;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return billsData.data
      .filter((bill: any) => {
        if (!bill.createdAt) return false;
        const billDate = new Date(bill.createdAt);
        return billDate >= thirtyDaysAgo;
      })
      .reduce((sum: number, bill: any) => sum + (Number(bill.total) || 0), 0);
  }, [billsData]);

  const netStockChange = recentInboundTotal - recentOutboundTotal;

  // Process chart data based on date filter
  const processChartData = React.useCallback((data: any[], filter: DateFilterType, isSales: boolean = false) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn("processChartData: No data provided", { data, filter, isSales });
      return [];
    }

    const grouped: { [key: string]: { date: string; value: number; count: number } } = {};

    data.forEach((item: any) => {
      const dateStr = item.date || item.createdAt;
      if (!dateStr) {
        console.warn("processChartData: Item missing date", item);
        return;
      }

      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        console.warn("processChartData: Invalid date", dateStr, item);
        return;
      }
      let key = "";

      switch (filter) {
        case "daily":
          key = date.toISOString().split("T")[0]; // YYYY-MM-DD
          break;
        case "weekly":
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = `Week ${weekStart.toISOString().split("T")[0]}`;
          break;
        case "monthly":
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          break;
        case "yearly":
          key = String(date.getFullYear());
          break;
        case "6months":
        case "9months":
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          break;
        default:
          key = date.toISOString().split("T")[0];
      }

      if (!grouped[key]) {
        grouped[key] = { date: key, value: 0, count: 0 };
      }

      if (isSales) {
        grouped[key].value += Number(item.total || 0);
      } else {
        grouped[key].value += Number(item.quantity || 0);
      }
      grouped[key].count += 1;
    });

    return Object.values(grouped)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((item) => ({
        ...item,
        label: filter === "daily" 
          ? new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
          : filter === "weekly"
          ? item.date.replace("Week ", "")
          : filter === "monthly" || filter === "6months" || filter === "9months"
          ? new Date(item.date + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" })
          : item.date,
      }));
  }, []);

  // Chart data for purchases
  const purchaseChartData = React.useMemo(() => {
    const data = inboundData?.data || [];
    console.log("Processing Purchase Chart Data:", {
      rawData: data,
      dataLength: data.length,
      dateFilter,
      startDate,
      endDate,
      firstItem: data[0],
    });
    
    if (!data || data.length === 0) {
      console.warn("No purchase data available for chart");
      return [];
    }
    
    // Filter data by date range (in case API doesn't filter)
    const filteredData = data.filter((item: any) => {
      const itemDate = item.date || item.createdAt;
      if (!itemDate) return false;
      const date = new Date(itemDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      return date >= start && date <= end;
    });
    
    console.log("Filtered Purchase Data:", {
      originalLength: data.length,
      filteredLength: filteredData.length,
    });
    
    if (filteredData.length === 0) {
      console.warn("No purchase data within date range");
      return [];
    }
    
    const processed = processChartData(filteredData, dateFilter, false);
    console.log("Processed Purchase Chart Data:", processed);
    return processed;
  }, [inboundData, dateFilter, startDate, endDate, processChartData]);

  // Chart data for sales
  const salesChartData = React.useMemo(() => {
    if (!billsData?.data) return [];
    const filteredBills = billsData.data.filter((bill: any) => {
      if (!bill.createdAt) return false;
      const billDate = new Date(bill.createdAt);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return billDate >= start && billDate <= end;
    });
    return processChartData(filteredBills, dateFilter, true);
  }, [billsData, dateFilter, startDate, endDate, processChartData]);

  // Combined chart data - merge purchases and sales by date
  const combinedChartData = React.useMemo(() => {
    const purchaseMap = new Map(purchaseChartData.map(item => [item.date, item.value]));
    const salesMap = new Map(salesChartData.map(item => [item.date, item.value]));
    
    // Get all unique dates
    const allDates = new Set([...purchaseMap.keys(), ...salesMap.keys()]);
    
    return Array.from(allDates)
      .sort()
      .map(date => {
        const purchaseItem = purchaseChartData.find(item => item.date === date);
        return {
          date,
          label: purchaseItem?.label || salesChartData.find(item => item.date === date)?.label || date,
          purchases: purchaseMap.get(date) || 0,
          sales: salesMap.get(date) || 0,
        };
      });
  }, [purchaseChartData, salesChartData]);

  // Get recent transactions (last 5)
  const recentInbound = React.useMemo(() => {
    if (!inboundData?.data || !Array.isArray(inboundData.data)) return [];
    return [...inboundData.data]
      .sort(
        (a: any, b: any) =>
          new Date(b.date || b.createdAt).getTime() -
          new Date(a.date || a.createdAt).getTime()
      )
      .slice(0, 5);
  }, [inboundData]);

  const recentOutbound = React.useMemo(() => {
    if (!outboundData?.data || !Array.isArray(outboundData.data)) return [];
    return [...outboundData.data]
      .sort(
        (a: any, b: any) =>
          new Date(b.date || b.createdAt).getTime() -
          new Date(a.date || a.createdAt).getTime()
      )
      .slice(0, 5);
  }, [outboundData]);

  // Get recent sales from billing data (last 5 bills)
  const recentSales = React.useMemo(() => {
    if (!billsData?.data || !Array.isArray(billsData.data)) return [];
    return [...billsData.data]
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt || b.date).getTime() -
          new Date(a.createdAt || a.date).getTime()
      )
      .slice(0, 5);
  }, [billsData]);

  const isLoading =
    summaryLoading || vendorStatsLoading || inboundLoading || outboundLoading || billsLoading;

  // Debug: Log API calls and status (after all data is computed)
  React.useEffect(() => {
    console.log("Inventory Summary - API Status:", {
      vendorIdFromCookie: vendorId || "Not in cookie (backend extracts from session)",
      storeIdFromCookie: storeId || "Not in cookie",
      hasSummaryData: !!summaryData,
      hasVendorStats: !!vendorStats,
      hasInboundData: !!inboundData,
      hasOutboundData: !!outboundData,
      hasBillsData: !!billsData,
      recentSalesCount: recentSales.length,
      recentBillsTotal,
      summaryLoading,
      vendorStatsLoading,
      inboundLoading,
      outboundLoading,
      billsLoading,
      summaryError: summaryError?.data?.message || summaryError?.message,
      vendorStatsError: vendorStatsError?.data?.message || vendorStatsError?.message,
      inboundError: inboundError?.data?.message || inboundError?.message,
      outboundError: outboundError?.data?.message || outboundError?.message,
      billsError: billsError?.data?.message || billsError?.message,
    });
  }, [vendorId, storeId, summaryData, vendorStats, inboundData, outboundData, billsData, recentSales, recentBillsTotal, summaryLoading, vendorStatsLoading, inboundLoading, outboundLoading, billsLoading, summaryError, vendorStatsError, inboundError, outboundError, billsError]);

  return (
    <div className="mx-1">
      <div className="px-2 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Inventory Summary</h2>
          <div className="flex gap-2">
            <Button
              color="default"
              onClick={() => {
                refetchSummary();
                refetchVendorStats();
                refetchInbound();
                refetchOutbound();
                refetchBills();
              }}
              size="sm"
              variant="flat"
              isLoading={isLoading}
            >
              Refresh
            </Button>
            <Button
              color="primary"
              onClick={() => navigate("/Inventory/Inbound")}
              size="sm"
              variant="flat"
            >
              Add Purchase
            </Button>
            <Button
              color="secondary"
              onClick={() => navigate("/Inventory/PurchaseList")}
              size="sm"
              variant="flat"
            >
              View All Purchases
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Spinner size="lg" color="primary" />
          <p className="ml-4 text-default-500">Loading inventory data...</p>
        </div>
      ) : summaryError || vendorStatsError || inboundError || outboundError || billsError ? (
        <Card>
          <CardBody>
            <div className="flex flex-col items-center justify-center p-8">
              <p className="text-danger mb-2 font-semibold">
                Error loading inventory data
              </p>
              <div className="text-sm text-default-500 mb-4 space-y-1">
                {summaryError && (
                  <p>Summary: {summaryError?.data?.message || summaryError?.message || "Unknown error"}</p>
                )}
                {vendorStatsError && (
                  <p>Vendor Stats: {vendorStatsError?.data?.message || vendorStatsError?.message || "Unknown error"}</p>
                )}
                {inboundError && (
                  <p>Inbound: {inboundError?.data?.message || inboundError?.message || "Unknown error"}</p>
                )}
                {outboundError && (
                  <p>Outbound: {outboundError?.data?.message || outboundError?.message || "Unknown error"}</p>
                )}
                {billsError && (
                  <p>Billing: {billsError?.data?.message || billsError?.message || "Unknown error"}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  color="primary"
                  onClick={() => {
                    refetchSummary();
                    refetchVendorStats();
                    refetchInbound();
                    refetchOutbound();
                    refetchBills();
                  }}
                  size="md"
                  variant="flat"
                >
                  Retry All
                </Button>
                <Button
                  color="default"
                  onClick={() => window.location.reload()}
                  size="md"
                  variant="flat"
                >
                  Reload Page
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      ) : (
        <>
          {/* Overall Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 px-2">
            <Card className="border-l-4 border-l-success">
              <CardHeader className="flex gap-3 pb-2">
                <div className="flex flex-col w-full">
                  <p className="text-sm text-default-500">Total Inbound</p>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="text-3xl font-bold text-success">
                  {summaryData?.data?.totalInbound || 0}
                </p>
                <p className="text-xs text-default-400 mt-1">
                  Total purchase transactions
                </p>
              </CardBody>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader className="flex gap-3 pb-2">
                <div className="flex flex-col w-full">
                  <p className="text-sm text-default-500">Current Stock</p>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="text-3xl font-bold text-primary">
                  {summaryData?.data?.currentStock || 0}
                </p>
                <p className="text-xs text-default-400 mt-1">
                  Total units in stock
                </p>
              </CardBody>
            </Card>

            <Card className="border-l-4 border-l-warning">
              <CardHeader className="flex gap-3 pb-2">
                <div className="flex flex-col w-full">
                  <p className="text-sm text-default-500">Low Stock Alerts</p>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="text-3xl font-bold text-warning">
                  {summaryData?.data?.lowStockAlerts || 0}
                </p>
                <p className="text-xs text-default-400 mt-1">
                  Products need restocking
                </p>
              </CardBody>
            </Card>

            <Card className="border-l-4 border-l-secondary">
              <CardHeader className="flex gap-3 pb-2">
                <div className="flex flex-col w-full">
                  <p className="text-sm text-default-500">Total Products</p>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="text-3xl font-bold text-secondary">
                  {vendorStats?.data?.totalProducts || 0}
                </p>
                <p className="text-xs text-default-400 mt-1">
                  Active products
                </p>
              </CardBody>
            </Card>
          </div>


          {/* Recent Activity Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 px-2">
            <Card>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">Recent Activity (30 Days)</p>
                  <p className="text-xs text-default-400">
                    Last 30 days transactions
                  </p>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-success-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-success">
                        Total Inbound
                      </p>
                      <p className="text-xs text-default-500">
                        Purchases this month
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-success">
                      {recentInboundTotal}
                    </p>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-danger-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-danger">
                        Total Sales
                      </p>
                      <p className="text-xs text-default-500">
                        Billing this month
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-danger">
                      ₹{recentBillsTotal.toFixed(2)}
                    </p>
                  </div>
                  <div
                    className={`flex justify-between items-center p-3 rounded-lg ${
                      netStockChange >= 0
                        ? "bg-success-50"
                        : "bg-warning-50"
                    }`}
                  >
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          netStockChange >= 0 ? "text-success" : "text-warning"
                        }`}
                      >
                        Net Stock Change
                      </p>
                      <p className="text-xs text-default-500">
                        Inbound - Outbound
                      </p>
                    </div>
                    <p
                      className={`text-2xl font-bold ${
                        netStockChange >= 0 ? "text-success" : "text-warning"
                      }`}
                    >
                      {netStockChange >= 0 ? "+" : ""}
                      {netStockChange}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Low Stock Products */}
            <Card>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">Low Stock Products</p>
                  <p className="text-xs text-default-400">
                    Products below threshold
                  </p>
                </div>
                {vendorStats?.data?.lowStockProducts?.length > 0 && (
                  <Chip color="warning" variant="flat" size="sm">
                    {vendorStats.data.lowStockProducts.length}
                  </Chip>
                )}
              </CardHeader>
              <CardBody>
                {vendorStats?.data?.lowStockProducts?.length > 0 ? (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {vendorStats.data.lowStockProducts.map((product: any) => (
                      <div
                        key={product.productId}
                        className="flex justify-between items-center p-2 bg-warning-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {product.productName}
                          </p>
                          <p className="text-xs text-default-500">
                            Current: {product.currentStock} | Min:{" "}
                            {product.minThreshold}
                          </p>
                        </div>
                        <Chip color="warning" size="sm" variant="flat">
                          Low
                        </Chip>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8">
                    <p className="text-default-500 text-sm">
                      No low stock products
                    </p>
                    <p className="text-xs text-default-400 mt-1">
                      All products are well stocked
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Recent Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 px-2">
            {/* Recent Inbound */}
            <Card>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">Recent Purchases</p>
                  <p className="text-xs text-default-400">Last 5 transactions</p>
                </div>
                <Button
                  size="sm"
                  variant="light"
                  onClick={() => navigate("/Inventory/PurchaseList")}
                >
                  View All
                </Button>
              </CardHeader>
              <CardBody>
                {recentInbound.length > 0 ? (
                  <div className="space-y-2">
                    {recentInbound.map((transaction: any) => (
                      <div
                        key={transaction.id}
                        className="flex justify-between items-center p-3 border-b border-default-100 last:border-0 hover:bg-default-50 rounded-lg transition-colors"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {transaction.product?.name || "Unknown Product"}
                          </p>
                          <div className="flex gap-2 mt-1">
                            <Chip size="sm" variant="flat" color="success">
                              Qty: {transaction.quantity}
                            </Chip>
                            {transaction.invoiceNumber && (
                              <Chip size="sm" variant="flat" color="default">
                                {transaction.invoiceNumber}
                              </Chip>
                            )}
                          </div>
                          <p className="text-xs text-default-400 mt-1">
                            {transaction.date
                              ? new Date(transaction.date).toLocaleDateString()
                              : "No date"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8">
                    <p className="text-default-500 text-sm">
                      No recent purchases
                    </p>
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      onClick={() => navigate("/Inventory/Inbound")}
                      className="mt-2"
                    >
                      Add Purchase
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Recent Sales from Billing */}
            <Card>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">Recent Sales</p>
                  <p className="text-xs text-default-400">Last 5 bills</p>
                </div>
                <Button
                  size="sm"
                  variant="light"
                  onClick={() => navigate("/Billing/List")}
                >
                  View All
                </Button>
              </CardHeader>
              <CardBody>
                {recentSales.length > 0 ? (
                  <div className="space-y-2">
                    {recentSales.map((bill: any) => (
                      <div
                        key={bill.id}
                        className="flex justify-between items-center p-3 border-b border-default-100 last:border-0 hover:bg-default-50 rounded-lg transition-colors cursor-pointer"
                        onClick={() => navigate(`/Billing/View/${bill.id}`)}
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {bill.customerName || "Customer"}
                          </p>
                          <div className="flex gap-2 mt-1">
                            <Chip size="sm" variant="flat" color="danger">
                              ₹{Number(bill.total || 0).toFixed(2)}
                            </Chip>
                            {bill.id && (
                              <Chip size="sm" variant="flat" color="default">
                                Bill #{bill.id}
                              </Chip>
                            )}
                          </div>
                          <p className="text-xs text-default-400 mt-1">
                            {bill.createdAt
                              ? new Date(bill.createdAt).toLocaleDateString()
                              : "No date"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8">
                    <p className="text-default-500 text-sm">No recent sales</p>
                    <p className="text-xs text-default-400 mt-1">
                      Sales will appear here
                    </p>
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      onClick={() => navigate("/Billing/Add")}
                      className="mt-2"
                    >
                      Create Bill
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="mb-6 px-2">
            <Card className="mb-4">
              <CardHeader className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">Date Filter</p>
                  <p className="text-xs text-default-400">Select time period for charts</p>
                </div>
              </CardHeader>

              <CardBody>
                <Tabs
                  selectedKey={dateFilter}
                  onSelectionChange={(key) => setDateFilter(key as DateFilterType)}
                  variant="underlined"
                  classNames={{
                    tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                    cursor: "w-full bg-primary",
                    tab: "max-w-fit px-0 h-12",
                    tabContent: "group-data-[selected=true]:text-primary",
                  }}
                >
                  <Tab key="daily" title="Daily" />
                  <Tab key="weekly" title="Weekly" />
                  <Tab key="monthly" title="Monthly" />
                  <Tab key="6months" title="6 Months" />
                  <Tab key="9months" title="9 Months" />
                  <Tab key="yearly" title="Yearly" />
                </Tabs>
              </CardBody>
            </Card>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Purchase Chart */}
            <Card className="mb-4">
              <CardHeader className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">Purchase Trends</p>
                  <p className="text-xs text-default-400">
                    Total quantity purchased over time
                  </p>
                </div>
                <Chip color="success" variant="flat">
                  Total: {purchaseChartData.reduce((sum, item) => sum + item.value, 0)}
                </Chip>
              </CardHeader>
              <CardBody>
                {inboundLoading ? (
                  <div className="flex flex-col items-center justify-center p-8">
                    <Spinner size="lg" color="primary" />
                    <p className="text-default-500 text-sm mt-4">Loading purchase data...</p>
                  </div>
                ) : inboundError ? (
                  <div className="flex flex-col items-center justify-center p-8">
                    <p className="text-danger text-sm font-semibold">Error loading purchase data</p>
                    <p className="text-xs text-default-400 mt-1">
                      {inboundError?.data?.message || inboundError?.message || "Unknown error"}
                    </p>
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      onClick={() => refetchInbound()}
                      className="mt-2"
                    >
                      Retry
                    </Button>
                  </div>
                ) : purchaseChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={purchaseChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="label" 
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        interval={dateFilter === "daily" ? Math.floor(purchaseChartData.length / 10) : 0}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => [value, "Quantity"]}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Legend />
                      <Bar 
                        dataKey="value" 
                        name="Purchases (Qty)" 
                        fill="#18c964"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8">
                    <p className="text-default-500 text-sm">No purchase data available</p>
                    <p className="text-xs text-default-400 mt-1">
                      {inboundData?.data?.length === 0 
                        ? "No purchases found for the selected date range" 
                        : "Purchase data will appear here"}
                    </p>
                    {(!vendorId && !storeId) && (
                      <p className="text-xs text-warning mt-2">
                        Note: You need to be logged in as a vendor or store to view purchase data
                      </p>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Sales Chart */}
            <Card className="mb-4">
              <CardHeader className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">Sales Trends</p>
                  <p className="text-xs text-default-400">
                    Total sales amount over time
                  </p>
                </div>
                <Chip color="danger" variant="flat">
                  Total: ₹{salesChartData.reduce((sum, item) => sum + item.value, 0).toFixed(2)}
                </Chip>
              </CardHeader>
              <CardBody>
                {salesChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={salesChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="label" 
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        interval={dateFilter === "daily" ? Math.floor(salesChartData.length / 10) : 0}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => [`₹${value.toFixed(2)}`, "Sales"]}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        name="Sales (₹)" 
                        stroke="#f31260"
                        strokeWidth={3}
                        dot={{ fill: "#f31260", r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8">
                    <p className="text-default-500 text-sm">No sales data available</p>
                    <p className="text-xs text-default-400 mt-1">
                      Sales data will appear here
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
            {/* Combined Chart */}
            <Card className="mb-4">
              <CardHeader className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">Purchase vs Sales</p>
                  <p className="text-xs text-default-400">
                    Compare purchases and sales trends
                  </p>
                </div>
              </CardHeader>
              <CardBody>
                {combinedChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={combinedChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="label" 
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        interval={dateFilter === "daily" ? Math.floor(combinedChartData.length / 10) : 0}
                      />
                      <YAxis yAxisId="left" label={{ value: "", angle: -90, position: "insideLeft" }} />
                      <YAxis yAxisId="right" orientation="right" label={{ value: "Sales (₹)", angle: 90, position: "insideRight" }} />
                      <Tooltip 
                        formatter={(value: number, name: string) => {
                          if (name === "purchases") return [value, "Purchases (Qty)"];
                          if (name === "sales") return [`₹${value.toFixed(2)}`, "Sales (₹)"];
                          return [value, name];
                        }}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="purchases" 
                        name="Purchases (Qty)" 
                        stroke="#18c964"
                        strokeWidth={3}
                        dot={{ fill: "#18c964", r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="sales" 
                        name="Sales (₹)" 
                        stroke="#f31260"
                        strokeWidth={3}
                        dot={{ fill: "#f31260", r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8">
                    <p className="text-default-500 text-sm">No data available</p>
                    <p className="text-xs text-default-400 mt-1">
                      Data will appear here
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>

            </div>
          </div>
          {/* Quick Actions */}
          <div className="px-2 mb-6">
            <Card>
              <CardHeader>
                <p className="text-lg font-semibold">Quick Actions</p>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    color="primary"
                    variant="flat"
                    className="h-auto py-4"
                    onClick={() => navigate("/Inventory/Inbound")}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">📦</span>
                      <span className="text-sm">Add Purchase</span>
                    </div>
                  </Button>
                  <Button
                    color="secondary"
                    variant="flat"
                    className="h-auto py-4"
                    onClick={() => navigate("/Inventory/PurchaseList")}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">📋</span>
                      <span className="text-sm">Purchase List</span>
                    </div>
                  </Button>
                  <Button
                    color="success"
                    variant="flat"
                    className="h-auto py-4"
                    onClick={() => navigate("/Inventory/ClientProducts/Add")}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">➕</span>
                      <span className="text-sm">Add Product</span>
                    </div>
                  </Button>
                  <Button
                    color="warning"
                    variant="flat"
                    className="h-auto py-4"
                    onClick={() => navigate("/Inventory/Clients/Add")}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">👤</span>
                      <span className="text-sm">Add Client</span>
                    </div>
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default InventorySummary;
