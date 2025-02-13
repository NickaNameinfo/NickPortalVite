import { useGetProductsQuery } from "./Service.mjs";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Input,
  User,
} from "@nextui-org/react";
import React from "react";
import { TableList } from "../../Components/Table/TableList";
import { getCookie } from "../../JsFiles/CommonFunction.mjs";
import { useGetVendorsProductByIdQuery } from "../VendorProducts/Service.mjs";
import { useGetStoresProductByIDQuery } from "../Store/Service.mjs";
import { infoData } from "../../configData";
import { useNavigate } from "react-router-dom";
const ProductsList = () => {
  const { data, error, refetch } = useGetProductsQuery();
  const vendorId = getCookie("vendorId");
  const storeId = getCookie("storeId");
  const nativegate = useNavigate();
  const {
    data: vendorProducts,
    error: vendorError,
    refetch: vendorRefetch,
  } = useGetVendorsProductByIdQuery(Number(vendorId));
  const {
    data: storeProducts,
    error: storeError,
    refetch: stroeRefetch,
  } = useGetStoresProductByIDQuery(Number(storeId));

  const currentRole = getCookie("role");
  const defaultCloumns = [
    "id",
    "name",
    "actions",
    "total",
    "sortDesc",
    "photo",
    "status",
    "createdType",
  ];
  const byuserProduct = [
    "total",
    "unitSize",
    "product",
    "photo",
    "actions",
    "status",
  ];
  const byuserCloumn = [
    { name: "Price", id: "total", sortable: true },
    { name: "Unit Size", id: "unitSize", sortable: true },
    { name: "Products", id: "product", sortable: true },
    { name: "Image", id: "photo", sortable: true },
    { name: "Status", id: "status", sortable: false },
    { name: "Action", id: "actions", sortable: false },
  ];
  const columns = [
    { name: "S.No", id: "id", sortable: true },
    { name: "name", id: "name", sortable: true },
    { name: "total", id: "total", sortable: true },
    { name: "sortDesc", id: "sortDesc", sortable: true },
    { name: "image", id: "photo", sortable: true },
    { name: "Status", id: "status" },
    { name: "Created", id: "createdType" },
    ...(currentRole !== "1" ? [{ name: "Actions", id: "actions" }] : []),
  ];

  React.useEffect(() => {
    if (storeId || vendorId) {
      refetch();
      vendorRefetch();
      stroeRefetch();
    }
  }, [vendorId, storeId]);

  const renderCell = React.useCallback((data, columnKey) => {
    switch (columnKey) {
      case "product":
        return <p>{data?.product?.name}</p>;
      case "storename":
        return (
          <User
            avatarProps={{ radius: "lg", src: data.avatar }}
            description={data.email}
            name={data?.[columnKey]}
          >
            {data.email}
          </User>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button size="sm" variant="flat">
                  Action
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  onClick={() => nativegate(`/AddProducts/${data.product?.id}`)}
                >
                  View
                </DropdownItem>
                <DropdownItem
                  onClick={() => nativegate(`/AddProducts/${data.product?.id}`)}
                >
                  Edit
                </DropdownItem>
                {/* <DropdownItem>Delete</DropdownItem> */}
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      case "photo":
        return (
          <div className="relative flex justify-center items-center gap-2">
            {
              <Image
                src={`${infoData?.baseApi}/${
                  data?.product?.photo ? data?.product?.photo : data?.photo
                }`}
                width={50}
                height={50}
              />
            }
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={
              data?.product?.status === "1" || data?.status === "1"
                ? "success"
                : "danger"
            }
            size="lg"
            variant="flat"
          >
            {data?.product?.status === "1" || data?.status === "1"
              ? "Active"
              : "In Active"}
          </Chip>
        );
      default:
        return data?.product?.[columnKey]
          ? data?.product?.[columnKey]
          : data?.[columnKey];
    }
  }, []);

  return (
    <div className="mx-2">
      {data && (
        <TableList
          defaultCloumns={currentRole !== "1" ? byuserProduct : defaultCloumns}
          renderCell={renderCell}
          columns={currentRole !== "1" ? byuserCloumn : columns}
          tableItems={
            currentRole === "0"
              ? data?.["data"]
              : currentRole === "2"
              ? vendorProducts?.data
              : storeProducts?.data
          }
          isStatusFilter={false}
        />
      )}
    </div>
  );
};

export default ProductsList;
