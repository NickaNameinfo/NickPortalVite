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
const ProductsList = () => {
  const { data, error, refetch } = useGetProductsQuery();
  const vendorId = getCookie("vendorId");
  const storeId = getCookie("storeId");
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

  const currentPlan = getCookie("role");
  console.log(data, "data769867", storeProducts, vendorProducts);

  const defaultCloumns = ["id", "name", "actions", "price", "sortDesc", "photo"];
  const byuserProduct = ["price", "unitSize", "product", "photo"];
  const byuserCloumn = [
    { name: "Price", id: "price", sortable: true },
    { name: "Unit Size", id: "unitSize", sortable: true },
    { name: "Products", id: "product", sortable: true },
    { name: "Image", id: "photo", sortable: true },
  ];
  const columns = [
    { name: "S.No", id: "id", sortable: true },
    { name: "name", id: "name", sortable: true },
    { name: "price", id: "price", sortable: true },
    { name: "sortDesc", id: "sortDesc", sortable: true },
    { name: "image", id: "photo", sortable: true },
    { name: "Actions", id: "actions" },
  ];

  React.useEffect(() => {
    refetch();
    vendorRefetch();
    stroeRefetch();
  }, [vendorId, storeId]);

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];
    console.log(cellValue, "cellValue23", cellValue?.photo, user)
    switch (columnKey) {
      case "product":
        return (
          <p>{user?.product?.name}</p>
        );
      case "storename":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.avatar }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button size="sm" variant="flat">
                  action
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>View</DropdownItem>
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      case "photo":
        return (
          <div className="relative flex justify-center items-center gap-2">
            {<Image src={`${infoData?.baseApi}/${user?.product?.photo}`} width ={50} height={50}/>}
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div>
      {data && (
        <TableList
          defaultCloumns={currentPlan !== "1" ? byuserProduct : defaultCloumns}
          renderCell={renderCell}
          columns={currentPlan !== "1" ? byuserCloumn : columns}
          tableItems={currentPlan === "1" ? data?.["data"] : currentPlan === "2" ? storeProducts?.data : vendorProducts?.data}
          isStatusFilter={false}
        />
      )}
    </div>
  );
};

export default ProductsList;
