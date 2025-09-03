import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { useGetVendorsProductByIdQuery } from "../VendorProducts/Service.mjs";
import { useGetStoresProductByIDQuery } from "../Store/Service.mjs";
import { useGetProductsQuery } from "../Products/Service.mjs";
import { getCookie } from "../../JsFiles/CommonFunction.mjs";
import { useGetOrderByOrderIdQuery } from "../VendorProducts/Service.mjs";
import { useNavigate } from "react-router-dom";
import {
  useGetAllOrderListQuery,
  useGetAllOrderListByStoreQuery,
} from "../../Service.mjs";

const Dashboard = () => {
  const userId = getCookie("id");
  const vendorId = getCookie("vendorId");
  const storeId = getCookie("storeId");
  let ids = vendorId ? vendorId : storeId;
  const nativegate = useNavigate();

  const { data: allOrder, error: allOrderError } = useGetAllOrderListQuery(undefined, { skip: !!vendorId || !!storeId });
  const { data, error, refetch } = useGetProductsQuery(undefined, { skip: !!vendorId || !!storeId });

  const {
    data: orderList,
    error: orderListError,
    refetch: orderListRefetch,
  } = useGetOrderByOrderIdQuery(Number(userId), { skip: !userId });
  const {
    data: storeOrder,
    error: storeOrderError,
    refetch: storeOrderRefetch,
  } = useGetAllOrderListByStoreQuery(ids, { skip: !vendorId || !!storeId });
  const {
    data: vendorProducts,
    error: vendorError,
    refetch: vendorRefetch,
  } = useGetVendorsProductByIdQuery(Number(vendorId), { skip: !vendorId });
  const {
    data: storeProducts,
    error: storeError,
    refetch: stroeRefetch,
  } = useGetStoresProductByIDQuery(Number(storeId), { skip: !storeId });

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
    <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
      {list.map((item, index) => (
        <Card
          shadow="sm"
          key={index}
          isPressable
          onPress={() => console.log("item pressed")}
        >
          <CardBody className="overflow-visible p-0">
            <Image
              shadow="sm"
              radius="lg"
              width="100%"
              alt={item.title}
              className="w-full object-cover h-[140px]"
              src={item.img}
            />
          </CardBody>
          <CardFooter className="text-small justify-between">
            <b>{item.title}</b>
            <p className="text-default-500">{item.price}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
export default Dashboard;
