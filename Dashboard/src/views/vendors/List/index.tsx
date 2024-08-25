"use client";
import React from "react";
import { useGetVendorsQuery, useDeleteVendorsMutation } from "../Service.mjs";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Image,
} from "@nextui-org/react";
import { TableList } from "../../../Components/Table/TableList";
import { useNavigate } from "react-router-dom";
import { infoData } from "../../../configData";

const List = () => {
  const { data, error, refetch } = useGetVendorsQuery();
  const [DeleteData] = useDeleteVendorsMutation();
  console.log(data, "data5234523452345", data?.["data"]);
  const navigate = useNavigate();
  // modal
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [deleteID, setDeleteID] = React.useState(null);

  React.useEffect(() => {
    refetch();
  }, []);

  const defaultCloumns = [
    "storename",
    "shopaddress",
    "vendorImage",
    "ownername",
    "phone",
    "email",
    "actions",
    "status",
  ];

  const statusColorMap = {
    active: "success",
    paused: "danger",
    vacation: "warning",
  };

  const columns = [
    { name: "S.No", id: "id", sortable: true },
    { name: "storename", id: "storename", sortable: true },
    { name: "shopaddress", id: "shopaddress", sortable: false },
    { name: "vendorImage", id: "vendorImage", sortable: false },
    { name: "email", id: "email", sortable: true },
    { name: "phone", id: "phone" },
    { name: "Actions", id: "actions" },
    { name: "Status", id: "status" },
  ];

  const onDelete = async () => {
    if (deleteID) {
      const result = await DeleteData(deleteID);
      console.log(result, "DeleteData");

      if (result?.data?.success) {
        onClose();
        refetch();
      }
    }
  };

  const renderCell = React.useCallback((user, columnKey) => {
    console.log(user, columnKey, "asdfoij89wernk");

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
      case "vendorImage":
        return (
          <Image src={`${infoData.baseApi}/${user.vendorImage}`} width={100} height={100}/>
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
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button size="sm" variant="flat">
                  Action
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {/* <DropdownItem>View</DropdownItem> */}
                <DropdownItem
                  onClick={() => {
                    console.log("isclickine");
                    navigate(`/Vendors/Edit/${user?.id}`);
                  }}
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    onOpen();
                    setDeleteID(user?.id);
                  }}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="mx-2">
      {data && (
        <TableList
          defaultCloumns={defaultCloumns}
          renderCell={renderCell}
          columns={columns}
          tableItems={data?.["data"]}
          isStatusFilter={false}
        />
      )}

      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        radius="lg"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Delete</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete these items?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={() => onDelete()}>
                  Yes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default List;
