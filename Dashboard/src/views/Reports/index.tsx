import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Select,
  SelectItem,
  Input,
  Spinner,
  Chip,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { getCookie } from "../../JsFiles/CommonFunction.mjs";
import { useGetAllOrderListQuery } from "../../Service.mjs";
import { useGetProductsQuery } from "../Products/Service.mjs";
import { useGetVendorsProductByIdQuery } from "../VendorProducts/Service.mjs";
import { useGetStoresProductByIDQuery } from "../Store/Service.mjs";
import {
  useGetInboundTransactionsQuery,
  useGetOutboundTransactionsQuery,
} from "../Inventory/Service.mjs";
import { useGetSubUsersQuery } from "../Settings/Service.mjs";
import { useGetStoreQuery } from "../Store/Service.mjs";
import { useGetVendorsQuery } from "../vendors/Service.mjs";

const Reports = () => {
  const currentRole = getCookie("role");
  const vendorId = getCookie("vendorId");
  const storeId = getCookie("storeId");
  const [selectedReport, setSelectedReport] = React.useState<string>("orders");
  const [startDate, setStartDate] = React.useState<string>("");
  const [endDate, setEndDate] = React.useState<string>("");
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);

  // Set default date range (last 30 days)
  React.useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    setEndDate(end.toISOString().split("T")[0]);
    setStartDate(start.toISOString().split("T")[0]);
  }, []);

  // Fetch data based on report type
  const { data: ordersData, isLoading: ordersLoading } = useGetAllOrderListQuery(undefined, {
    skip: selectedReport !== "orders" || (!!vendorId && !!storeId),
    refetchOnMountOrArgChange: true,
  });

  const { data: productsData, isLoading: productsLoading } = useGetProductsQuery(undefined, {
    skip: selectedReport !== "products" || !!vendorId || !!storeId,
    refetchOnMountOrArgChange: true,
  });

  const { data: vendorProducts, isLoading: vendorProductsLoading } = useGetVendorsProductByIdQuery(
    Number(vendorId),
    {
      skip: selectedReport !== "products" || !vendorId,
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: storeProducts, isLoading: storeProductsLoading } = useGetStoresProductByIDQuery(
    Number(storeId),
    {
      skip: selectedReport !== "products" || !storeId,
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: inboundData, isLoading: inboundLoading } = useGetInboundTransactionsQuery(
    { startDate, endDate },
    {
      skip: selectedReport !== "inventory" || (!vendorId && !storeId && currentRole !== "0"),
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: outboundData, isLoading: outboundLoading } = useGetOutboundTransactionsQuery(
    { startDate, endDate },
    {
      skip: selectedReport !== "inventory" || (!vendorId && !storeId && currentRole !== "0"),
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: subUsersData, isLoading: subUsersLoading } = useGetSubUsersQuery(undefined, {
    skip: selectedReport !== "sub-users" || currentRole === "0",
    refetchOnMountOrArgChange: true,
  });

  const { data: storesData } = useGetStoreQuery(undefined, {
    skip: currentRole !== "0",
    refetchOnMountOrArgChange: true,
  });

  const { data: vendorsData } = useGetVendorsQuery(undefined, {
    skip: currentRole !== "0",
    refetchOnMountOrArgChange: true,
  });

  // Generate Excel file
  const generateExcel = async (data: any[], headers: string[], filename: string) => {
    try {
      // Dynamic import for xlsx
      const XLSX = await import("xlsx");
      
      // Prepare worksheet data
      const worksheetData = [
        headers,
        ...data.map((row) => headers.map((header) => {
          // Handle nested properties
          const keys = header.split(".");
          let value = row;
          for (const key of keys) {
            value = value?.[key];
          }
          return value ?? "";
        })),
      ];

      // Create workbook and worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

      // Generate Excel file
      XLSX.writeFile(workbook, `${filename}.xlsx`);
    } catch (error) {
      console.error("Error generating Excel:", error);
      alert("Failed to generate Excel file. Please try again.");
    }
  };

  // Generate PDF file
  const generatePDF = async (data: any[], headers: string[], filename: string, title: string) => {
    try {
      // Dynamic import for jspdf and jspdf-autotable
      const { default: jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text(title, 14, 15);
      
      // Add date range if available
      if (startDate && endDate) {
        doc.setFontSize(10);
        doc.text(`Date Range: ${startDate} to ${endDate}`, 14, 22);
      }

      // Prepare table data - data is already transformed
      const tableData = data.map((row) => headers.map((header) => row[header] ?? ""));

      // Add table
      autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: startDate && endDate ? 28 : 22,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 139, 202] },
      });

      // Save PDF
      doc.save(`${filename}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF file. Please try again.");
    }
  };

  // Handle report download
  const handleDownload = async (format: "excel" | "pdf") => {
    setIsGenerating(true);
    try {
      let transformedData: any[] = [];
      let headers: string[] = [];
      let filename = "";
      let title = "";

      switch (selectedReport) {
        case "orders":
          const orders = ordersData?.data || [];
          headers = ["ID", "Order Number", "Customer Name", "Email", "Phone", "Total Amount", "Status", "Date"];
          filename = `Orders_Report_${new Date().toISOString().split("T")[0]}`;
          title = "Orders Report";
          transformedData = orders.map((order: any) => ({
            "ID": order.id || order.orderId || "-",
            "Order Number": order.orderNumber || order.orderNo || "-",
            "Customer Name": order.customerName || order.user?.name || order.customer?.name || "-",
            "Email": order.email || order.user?.email || order.customer?.email || "-",
            "Phone": order.phone || order.user?.phone || order.customer?.phone || "-",
            "Total Amount": order.total || order.totalAmount || order.amount || "0",
            "Status": order.status === "1" || order.status === "completed" ? "Completed" : order.status === "0" || order.status === "pending" ? "Pending" : order.status || "-",
            "Date": order.createdAt || order.date || order.orderDate || "-",
          }));
          break;

        case "products":
          let products: any[] = [];
          if (currentRole === "0") {
            products = productsData?.data || [];
          } else if (currentRole === "2") {
            products = vendorProducts?.data || [];
          } else {
            products = storeProducts?.data || [];
          }
          headers = ["ID", "Name", "Price", "Stock", "Category", "Status", "Created Date"];
          filename = `Products_Report_${new Date().toISOString().split("T")[0]}`;
          title = "Products Report";
          transformedData = products.map((item: any) => {
            const product = item?.product || item;
            return {
              "ID": product?.id || item?.id || "-",
              "Name": product?.name || item?.name || "-",
              "Price": product?.price || item?.price || "0",
              "Stock": product?.stock || item?.stock || product?.quantity || item?.quantity || "0",
              "Category": product?.category?.name || item?.category?.name || product?.categoryName || item?.categoryName || "-",
              "Status": (product?.status === "1" || item?.status === "1") ? "Active" : "Inactive",
              "Created Date": product?.createdAt || item?.createdAt || "-",
            };
          });
          break;

        case "inventory":
          const inbound = inboundData?.data || [];
          const outbound = outboundData?.data || [];
          headers = ["ID", "Type", "Product Name", "Quantity", "Price", "Date", "Status"];
          filename = `Inventory_Report_${new Date().toISOString().split("T")[0]}`;
          title = "Inventory Report";
          
          const inboundTransformed = inbound.map((item: any) => ({
            "ID": item.id || "-",
            "Type": "Inbound",
            "Product Name": item.product?.name || item.productName || "-",
            "Quantity": item.quantity || "0",
            "Price": item.price || item.total || "0",
            "Date": item.date || item.createdAt || "-",
            "Status": item.status || "Completed",
          }));
          
          const outboundTransformed = outbound.map((item: any) => ({
            "ID": item.id || "-",
            "Type": "Outbound",
            "Product Name": item.product?.name || item.productName || "-",
            "Quantity": item.quantity || "0",
            "Price": item.price || item.total || "0",
            "Date": item.date || item.createdAt || "-",
            "Status": item.status || "Completed",
          }));
          
          transformedData = [...inboundTransformed, ...outboundTransformed];
          break;

        case "sub-users":
          const subUsers = subUsersData?.data || [];
          headers = ["ID", "First Name", "Last Name", "Email", "Phone", "Status", "Created Date"];
          filename = `SubUsers_Report_${new Date().toISOString().split("T")[0]}`;
          title = "Sub-Users Report";
          transformedData = subUsers.map((user: any) => ({
            "ID": user.id || "-",
            "First Name": user.firstName || "-",
            "Last Name": user.lastName || "-",
            "Email": user.email || "-",
            "Phone": user.phone || "-",
            "Status": user.status === "approved" ? "Approved" : user.status === "pending" ? "Pending" : user.status === "rejected" ? "Rejected" : user.status || "-",
            "Created Date": user.createdAt || user.createdDate || "-",
          }));
          break;

        default:
          alert("Please select a report type");
          setIsGenerating(false);
          return;
      }

      if (transformedData.length === 0) {
        alert("No data available for the selected report");
        setIsGenerating(false);
        return;
      }

      if (format === "excel") {
        await generateExcel(transformedData, headers, filename);
      } else {
        await generatePDF(transformedData, headers, filename, title);
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const isLoading =
    (selectedReport === "orders" && ordersLoading) ||
    (selectedReport === "products" && (productsLoading || vendorProductsLoading || storeProductsLoading)) ||
    (selectedReport === "inventory" && (inboundLoading || outboundLoading)) ||
    (selectedReport === "sub-users" && subUsersLoading);

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-gray-600">
            Generate and download reports in Excel or PDF format
          </p>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-4">
            {/* Report Type Selection */}
            <div className="flex gap-4 items-end flex-wrap">
              <Select
                label="Report Type"
                placeholder="Select a report"
                selectedKeys={[selectedReport]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setSelectedReport(selected || "");
                }}
                className="max-w-xs"
              >
                <SelectItem key="orders" value="orders">
                  Orders Report
                </SelectItem>
                {(currentRole === "0" || currentRole === "2" || currentRole === "3") && (
                  <SelectItem key="products" value="products">
                    Products Report
                  </SelectItem>
                )}
                {(currentRole === "0" || currentRole === "2" || currentRole === "3") && (
                  <SelectItem key="inventory" value="inventory">
                    Inventory Report
                  </SelectItem>
                )}
                {(currentRole === "2" || currentRole === "3") && (
                  <SelectItem key="sub-users" value="sub-users">
                    Sub-Users Report
                  </SelectItem>
                )}
              </Select>

              {/* Date Range (for inventory reports) */}
              {(selectedReport === "inventory" || selectedReport === "orders") && (
                <>
                  <Input
                    type="date"
                    label="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="max-w-xs"
                  />
                  <Input
                    type="date"
                    label="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="max-w-xs"
                  />
                </>
              )}

              {/* Download Buttons */}
              <div className="flex gap-2">
                <Button
                  color="success"
                  onPress={() => handleDownload("excel")}
                  isLoading={isGenerating}
                  isDisabled={isLoading || isGenerating}
                >
                  {isGenerating ? "Generating..." : "Download Excel"}
                </Button>
                <Button
                  color="danger"
                  onPress={() => handleDownload("pdf")}
                  isLoading={isGenerating}
                  isDisabled={isLoading || isGenerating}
                >
                  {isGenerating ? "Generating..." : "Download PDF"}
                </Button>
              </div>
            </div>

            {/* Report Preview/Info */}
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner size="lg" />
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">
                    {selectedReport === "orders" && "Orders Report"}
                    {selectedReport === "products" && "Products Report"}
                    {selectedReport === "inventory" && "Inventory Report"}
                    {selectedReport === "sub-users" && "Sub-Users Report"}
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Records:</span>
                      <Chip color="primary" variant="flat">
                        {selectedReport === "orders" && (ordersData?.data?.length || 0)}
                        {selectedReport === "products" &&
                          (currentRole === "0"
                            ? productsData?.data?.length || 0
                            : currentRole === "2"
                            ? vendorProducts?.data?.length || 0
                            : storeProducts?.data?.length || 0)}
                        {selectedReport === "inventory" &&
                          ((inboundData?.data?.length || 0) + (outboundData?.data?.length || 0))}
                        {selectedReport === "sub-users" && (subUsersData?.data?.length || 0)}
                      </Chip>
                    </div>
                    {(selectedReport === "inventory" || selectedReport === "orders") && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Date Range:</span>
                        <span className="text-sm">
                          {startDate && endDate
                            ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
                            : "All dates"}
                        </span>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Reports;

