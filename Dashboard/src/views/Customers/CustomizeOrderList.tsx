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

const CustomizeOrderList = () => {
  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  let tempFormData = watch();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const vendorId = getCookie("vendorId");
  const storeId = getCookie("storeId");
  const currentRole = getCookie("role");
  let ids = vendorId ? vendorId : storeId;
  const {
    data: storeOrder,
    error: storeOrderError,
    refetch: storeOrderRefetch,
  } = useGetAllOrderListByStoreQuery(ids);
  const { data, error, refetch } = useGetAllOrderListQuery();
  const [updateOrder] = useUpdatOrderMutation();

  const [selectedId, setSelectedId] = React.useState(null);
  const [orderStatus, serteOrderStatus] = React.useState([
    "processing",
    "shipping",
    "delivered",
    "cancelled",
  ]);
  const defaultCloumns = [
    "custId",
    "paymentmethod",
    "deliverydate",
    "grandtotal",
    "status",
    "productIds",
    "qty",
    "customization",
    "actions",
  ];

  React.useEffect(() => {
    storeOrderRefetch();
    refetch();
  }, [ids]);

  const columns = [
    { name: "S.No", id: "id", sortable: true },
    { name: "custId", id: "custId", sortable: true },
    { name: "paymentmethod", id: "paymentmethod", sortable: true },
    { name: "deliverydate", id: "deliverydate" },
    { name: "grandtotal", id: "grandtotal" },
    { name: "status", id: "status" },
    { name: "productIds", id: "productIds" },
    { name: "qty", id: "qty" },
    { name: "customization", id: "customization" },
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
            className="bg-warning-500"
            onPress={onOpen}
            onClick={() => {
              console.log(user, "asdfa70s98d7fa");
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
      onClose();
    }
  };

  return (
    <div className="mx-2">
      {data && (
        <TableList
          defaultCloumns={defaultCloumns}
          renderCell={renderCell}
          columns={columns}
          tableItems={
            currentRole === 0
              ? data?.["data"]?.filter((item) => item?.customization)
              : storeOrder?.["data"]?.filter((item) => item?.customization)
          }
          isStatusFilter={false}
        />
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
                  onClick={() => {}}
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

export default CustomizeOrderList;
