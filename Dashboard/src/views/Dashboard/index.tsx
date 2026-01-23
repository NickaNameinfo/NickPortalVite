import { Card, CardBody, CardFooter, Image, Chip, Spinner } from "@nextui-org/react";
import { useGetVendorsProductByIdQuery } from "../VendorProducts/Service.mjs";
import { useGetStoresProductByIDQuery, useGetStoreQuery } from "../Store/Service.mjs";
import { useGetProductsQuery } from "../Products/Service.mjs";
import { getCookie } from "../../JsFiles/CommonFunction.mjs";
import { useGetOrderByOrderIdQuery } from "../VendorProducts/Service.mjs";
import { useNavigate } from "react-router-dom";
import {
  useGetAllOrderListQuery,
  useGetAllOrderListByStoreQuery,
  useGetAllUserQuery,
} from "../../Service.mjs";
import {
  useGetInventorySummaryQuery,
  useGetInboundTransactionsQuery,
} from "../Inventory/Service.mjs";
import { useGetVendorsQuery } from "../vendors/Service.mjs";
import { useMemo } from "react";

const Dashboard = () => {
  const userId = getCookie("id");
  const vendorId = getCookie("vendorId");
  const storeId = getCookie("storeId");
  const currentRole = getCookie("role");
  let ids = vendorId ? vendorId : storeId;
  const nativegate = useNavigate();

  // Admin queries (only for role "0")
  const { data: allOrder, error: allOrderError, isLoading: allOrderLoading } = useGetAllOrderListQuery(undefined, { skip: !!vendorId || !!storeId });
  const { data, error, refetch, isLoading: productsLoading } = useGetProductsQuery(undefined, { skip: !!vendorId || !!storeId });
  const { data: vendorsData, isLoading: vendorsLoading } = useGetVendorsQuery(undefined, { skip: currentRole !== "0" });
  const { data: storesData, isLoading: storesLoading } = useGetStoreQuery(undefined, { skip: currentRole !== "0" });
  const { data: customersData, isLoading: customersLoading } = useGetAllUserQuery(undefined, { skip: currentRole !== "0" });

  const {
    data: orderList,
    error: orderListError,
    refetch: orderListRefetch,
    isLoading: orderListLoading,
  } = useGetOrderByOrderIdQuery(Number(userId), { skip: !userId });
  const {
    data: storeOrder,
    error: storeOrderError,
    refetch: storeOrderRefetch,
    isLoading: storeOrderLoading,
  } = useGetAllOrderListByStoreQuery(ids, { skip: !vendorId || !!storeId });
  const {
    data: vendorProducts,
    error: vendorError,
    refetch: vendorRefetch,
    isLoading: vendorProductsLoading,
  } = useGetVendorsProductByIdQuery(Number(vendorId), { skip: !vendorId });
  const {
    data: storeProducts,
    error: storeError,
    refetch: stroeRefetch,
    isLoading: storeProductsLoading,
  } = useGetStoresProductByIDQuery(Number(storeId), { skip: !storeId });

  // Inventory queries - Allow for vendor, store, or admin
  const { data: inventorySummary, isLoading: inventoryLoading } = useGetInventorySummaryQuery(undefined, {
    skip: !vendorId && !storeId && currentRole !== "0",
  });
  const { data: inboundData, isLoading: inboundLoading } = useGetInboundTransactionsQuery(
    {},
    { skip: !vendorId && !storeId && currentRole !== "0" }
  );

  // Calculate overall summary statistics
  const overallSummary = useMemo(() => {
    const totalProducts = data?.count || vendorProducts?.count || storeProducts?.count || 0;
    const totalOrders = allOrder?.count || storeOrder?.count || orderList?.count || 0;
    const totalVendors = vendorsData?.data?.length || vendorsData?.count || 0;
    const totalStores = storesData?.data?.length || storesData?.count || 0;
    const totalCustomers = customersData?.data?.length || customersData?.count || 0;
    const customizeOrders = storeOrder?.["data"]?.filter((item) => item?.customization)?.length || 
                           allOrder?.["data"]?.filter((item) => item?.customization)?.length || 0;
    const totalInbound = inventorySummary?.data?.totalInbound || inboundData?.count || 0;
    const lowStockAlerts = inventorySummary?.data?.lowStockAlerts || 0;

    return {
      totalProducts,
      totalOrders,
      totalVendors,
      totalStores,
      totalCustomers,
      customizeOrders,
      totalInbound,
      lowStockAlerts,
    };
  }, [
    data,
    vendorProducts,
    storeProducts,
    allOrder,
    storeOrder,
    orderList,
    vendorsData,
    storesData,
    customersData,
    inventorySummary,
    inboundData,
  ]);

  const isLoading = productsLoading || vendorProductsLoading || storeProductsLoading || 
                   allOrderLoading || storeOrderLoading || orderListLoading ||
                   vendorsLoading || storesLoading || customersLoading ||
                   inventoryLoading || inboundLoading;

  const list = [
    {
      title: "Products",
      img: "https://nextui.org/images/fruit-1.jpeg",
      price: data?.count || vendorProducts?.count || storeProducts?.count || 0,
    },
    // {
    //   title: "Customers",
    //   img: "https://nextui.org/images/fruit-2.jpeg",
    //   price: "$3.00",
    // },
    // {
    //   title: "Customer Requests",
    //   img: "https://nextui.org/images/fruit-3.jpeg",
    //   price: "$10.00",
    // },
    {
      title: "Customer Orders",
      img: "https://nextui.org/images/fruit-4.jpeg",
      price: allOrder?.count || storeOrder?.count || 0,
    },
    {
      title: "Customize Orders",
      img: "https://nextui.org/images/fruit-5.jpeg",
      price: storeOrder?.["data"]?.filter((item) => item?.customization)?.length || data?.["data"]?.filter((item) => item?.customization).length || 0,
    },
    {
      title: "Store Orders",
      img: "https://nextui.org/images/fruit-5.jpeg",
      price: orderList?.count || 0,
    },
    {
      title: "Inbound Inventory",
      img: "https://nextui.org/images/fruit-6.jpeg",
      price: inventorySummary?.data?.totalInbound || inboundData?.count || 0,
      route: "/Inventory/Inbound",
    },
    {
      title: "Low Stock Alerts",
      img: "https://nextui.org/images/fruit-9.jpeg",
      price: inventorySummary?.data?.lowStockAlerts || 0,
      route: "/Inventory/Summary",
    },
    // {
    //   title: "Transactions",
    //   img: "https://nextui.org/images/fruit-6.jpeg",
    //   price: "$8.00",
    // },
    // {
    //   title: "Over all Reports",
    //   img: "https://nextui.org/images/fruit-7.jpeg",
    //   price: "$7.50",
    // },
    // {
    //   title: "Today Sale",
    //   img: "https://nextui.org/images/fruit-8.jpeg",
    //   price: "$12.20",
    // },
    // {
    //   title: "Weekly Sale",
    //   img: "https://nextui.org/images/fruit-8.jpeg",
    //   price: "$12.20",
    // },
    // {
    //   title: "Monthly Sale",
    //   img: "https://nextui.org/images/fruit-8.jpeg",
    //   price: "$12.20",
    // },
    // {
    //   title: "Yearly Sale",
    //   img: "https://nextui.org/images/fruit-8.jpeg",
    //   price: "$12.20",
    // },
    // {
    //   title: "Other Details",
    //   img: "https://nextui.org/images/fruit-8.jpeg",
    //   price: "$12.20",
    // },
  ];

  return (
    <div className="space-y-6">
      {/* Overall Summary Section */}
      <Card className="w-full">
        <CardBody className="p-6">
          <h2 className="text-2xl font-bold mb-4">Overall Summary</h2>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {/* Products */}
              <Card className="border-l-4 border-l-blue-500">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Products</p>
                      <p className="text-2xl font-bold text-blue-600">{overallSummary.totalProducts}</p>
                    </div>
                    <Chip color="primary" variant="flat">📦</Chip>
                  </div>
                </CardBody>
              </Card>

              {/* Orders */}
              <Card className="border-l-4 border-l-green-500">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-green-600">{overallSummary.totalOrders}</p>
                    </div>
                    <Chip color="success" variant="flat">🛒</Chip>
                  </div>
                </CardBody>
              </Card>

              {/* Customize Orders */}
              <Card className="border-l-4 border-l-purple-500">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Customize Orders</p>
                      <p className="text-2xl font-bold text-purple-600">{overallSummary.customizeOrders}</p>
                    </div>
                    <Chip color="secondary" variant="flat">✨</Chip>
                  </div>
                </CardBody>
              </Card>

              {/* Inventory */}
              <Card className="border-l-4 border-l-orange-500">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Inbound Inventory</p>
                      <p className="text-2xl font-bold text-orange-600">{overallSummary.totalInbound}</p>
                    </div>
                    <Chip color="warning" variant="flat">📊</Chip>
                  </div>
                </CardBody>
              </Card>

              {/* Low Stock Alerts */}
              <Card className="border-l-4 border-l-red-500">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Low Stock Alerts</p>
                      <p className="text-2xl font-bold text-red-600">{overallSummary.lowStockAlerts}</p>
                    </div>
                    <Chip color="danger" variant="flat">⚠️</Chip>
                  </div>
                </CardBody>
              </Card>

              {/* Admin Only Stats */}
              {currentRole === "0" && (
                <>
                  <Card className="border-l-4 border-l-indigo-500">
                    <CardBody className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Vendors</p>
                          <p className="text-2xl font-bold text-indigo-600">{overallSummary.totalVendors}</p>
                        </div>
                        <Chip color="primary" variant="flat">🏪</Chip>
                      </div>
                    </CardBody>
                  </Card>

                  <Card className="border-l-4 border-l-teal-500">
                    <CardBody className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Stores</p>
                          <p className="text-2xl font-bold text-teal-600">{overallSummary.totalStores}</p>
                        </div>
                        <Chip color="success" variant="flat">🏬</Chip>
                      </div>
                    </CardBody>
                  </Card>

                  <Card className="border-l-4 border-l-pink-500">
                    <CardBody className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Customers</p>
                          <p className="text-2xl font-bold text-pink-600">{overallSummary.totalCustomers}</p>
                        </div>
                        <Chip color="secondary" variant="flat">👥</Chip>
                      </div>
                    </CardBody>
                  </Card>
                </>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
export default Dashboard;
