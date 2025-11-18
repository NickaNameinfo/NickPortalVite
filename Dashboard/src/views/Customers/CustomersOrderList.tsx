import React from "react";
import { TableList } from "../../Components/Table/TableList";
import {
  Button,
  Chip,
  DatePicker,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
  User,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import {
  useGetAllOrderListQuery,
  useGetAllOrderListByStoreQuery,
  useUpdatOrderMutation,
} from "../../Service.mjs";
import { getCookie } from "../../JsFiles/CommonFunction.mjs";
import { Controller, useForm } from "react-hook-form";
import { parseDate, getLocalTimeZone } from "@internationalized/date";

const CustomersOrderList = () => {
  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  let tempFormData = watch();
  const nativegate = useNavigate();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const vendorId = getCookie("vendorId");
  const storeId = getCookie("storeId");
  const currentRole = getCookie("role");
  let ids = vendorId ? vendorId : storeId;
  const {
    data: storeOrder,
    error: storeOrderError,
    refetch: storeOrderRefetch,
  } = useGetAllOrderListByStoreQuery(ids, { skip: !ids });
  const { data, error, refetch } = useGetAllOrderListQuery({ refetchOnMountOrArgChange: true, skip: ids });
  const [updateOrder] = useUpdatOrderMutation();

  const [selectedId, setSelectedId] = React.useState(null);
  const [refreshOrder, setRefreshOrder] = React.useState(false);

  const [orderStatus, serteOrderStatus] = React.useState([
    "processing",
    "shipping",
    "delivered",
    "cancelled",
  ]);
  const defaultCloumns = [
    "custId",
    "storeId",
    "paymentmethod",
    "deliverydate",
    "deliveryAddress",
    "grandtotal",
    "status",
    "productIds",
    "qty",
    "actions",
  ];


  const paymentOption = {
    1: "Online payment",
    2: "Pre Order",
    3: "Cash on Delivery",
    4: "Delivery in future"
  }

  const columns = [
    { name: "S.No", id: "id", sortable: true },
    ...(Number(currentRole) === 0 ? [{ name: "custId", id: "custId", sortable: true },
    { name: "storeId", id: "storeId" }] : []),
    { name: "paymentmethod", id: "paymentmethod", sortable: true },
    { name: "deliverydate", id: "deliverydate" },
    { name: "deliveryAddress", id: "deliveryAddress" },
    { name: "grandtotal", id: "grandtotal" },
    { name: "status", id: "status" },
    { name: "productIds", id: "productIds" },
    { name: "qty", id: "qty" },
    { name: "Actions", id: "actions" },
  ];

  const statusColorMap = {
    delivered: "success",
    cancelled: "danger",
    processing: "warning",
  };

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
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
      case "paymentmethod":
        return (
          <p>{paymentOption[user.paymentmethod]}</p>
        );
      case "deliveryAddress":
        // Get the deliveryAddress string
        const fullAddressString = user.deliveryAddress;
        // Split the string by comma and trim whitespace from each part
        const parts = fullAddressString.split(',').map(part => part.trim());
        const addressParts = [
          parts[0],       // e.g., '26'
          parts[1],       // e.g., 'Arul'
          parts[6],       // e.g., 'chennai'
          parts[7],       // e.g., 'chennai'
        ];

        // Join the selected address parts into a clean address string
        const address = addressParts.filter(Boolean).join(', ');

        // The date is the 11th element (index 10): 2025-11-06T14:40:03.000Z
        const dateString = parts[10];

        // Format the date to a more readable, date-only format
        let deliveryDate = '';
        if (dateString) {
          try {
            // Create a Date object
            const dateObject = new Date(dateString);
            // Format it as YYYY-MM-DD (or use 'en-US' for MM/DD/YYYY if preferred)
            deliveryDate = dateObject.toLocaleDateString('en-CA');
            // Alternative: deliveryDate = dateObject.toDateString(); // e.g., "Wed Nov 06 2025"
          } catch (e) {
            console.error("Error formatting date:", e);
            deliveryDate = 'Invalid Date';
          }
        }

        return (
          <p>
            <span className="text-primary">Address: </span>{address}
            <br />
            <span className="text-danger">Date:</span> {deliveryDate}
          </p>
        );
      case "productIds":
        return (
          <Chip
            key={user.productIds}
            size="sm"
            color="primary"
            variant="flat"
            className="cursor-pointer"
            onClick={() => nativegate(`/AddProducts/${user.productIds}`)}
          >
            {user.productIds}
          </Chip>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.status]}
            size="lg"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <Button
            className="border-l-indigo-500"
            onPress={onOpen}
            onClick={() => {
              setValue("status", user?.status);
              setValue(
                "deliverydate",
                user?.deliverydate ? parseDate(user?.deliverydate) : undefined
              );
              setSelectedId(user?.id);
            }}
          >
            Update Order
          </Button>
        );
      default:
        return cellValue;
    }
  }, []);

  const onSubmit = async (data: any) => {
    setRefreshOrder(true);
    const { year, month, day } = data.deliverydate;
    // Create a Date object (Note: JavaScript months are 0-indexed)
    const date = new Date(year, month - 1, day);
    // Format the date (Optional, for readability)
    const formattedDate = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    let tempApiParams = {
      ...data,
      deliverydate: formattedDate,
      id: selectedId,
    };
    const result = await updateOrder(tempApiParams).unwrap();
    if (result?.success) {
      storeOrderRefetch();
      setRefreshOrder(false);
    }
  };

  return (
    <div className="mx-2">
      {!refreshOrder ? (
        <TableList
          defaultCloumns={defaultCloumns}
          renderCell={renderCell}
          columns={columns}
          tableItems={
            Number(currentRole) === 0
              ? data?.["data"]
              : storeOrder?.["data"]?.filter((item) => !item?.customization)
          }
          isStatusFilter={false}
          refreshOrder={refreshOrder}
        />
      ) : (
        "Loading..."
      )}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="md"
        placement="center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1">
                Update Order {selectedId}
              </ModalHeader>
              <ModalBody>
                <Controller
                  name="deliverydate" // Changed to reflect a text input
                  control={control}
                  rules={{ required: "Please enter value" }}
                  render={({ field }) => (
                    <DatePicker
                      isRequired={true}
                      label="Delivery Date"
                      variant="bordered"
                      {...field}
                      className="mb-2"
                    />
                  )}
                />
                <Controller
                  name="status" // Changed to reflect a text input
                  control={control}
                  rules={{ required: "Please select value" }}
                  render={({ field }) => (
                    <Select
                      classNames={{
                        label: "group-data-[filled=true]:-translate-y-3",
                        trigger: [
                          "bg-transparent",
                          "border-1",
                          "text-default-500",
                          "transition-opacity",
                          "data-[hover=true]:bg-transparent",
                          "data-[hover=true]:bg-transparent",
                          "dark:data-[hover=true]:bg-transparent",
                          "data-[selectable=true]:focus:bg-transparent",
                        ],
                      }}
                      listboxProps={{
                        itemClasses: {
                          base: [
                            "rounded-md",
                            "text-default-500",
                            "transition-opacity",
                            "data-[hover=true]:text-foreground",
                            "data-[hover=true]:bg-default-100",
                            "dark:data-[hover=true]:bg-default-50",
                            "data-[selectable=true]:focus:bg-default-50",
                            "data-[pressed=true]:opacity-90",
                            "data-[focus-visible=true]:ring-default-500",
                            "shadow-none",
                            // "border-1",
                          ],
                        },
                      }}
                      label="Status"
                      variant="bordered"
                      size="sm"
                      selectedKeys={[String(tempFormData?.status)]}
                      {...field}
                      isRequired={true}
                      isInvalid={errors?.["status"] ? true : false}
                      errorMessage={errors?.["status"]?.message}
                    >
                      {orderStatus?.map((item) => {
                        return (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        );
                      })}
                    </Select>
                  )}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="ghost"
                  color="default"
                  size="sm"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  size="sm"
                  type="submit"
                  onPress={onClose}
                  onClick={() => { }}
                >
                  Update
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CustomersOrderList;
