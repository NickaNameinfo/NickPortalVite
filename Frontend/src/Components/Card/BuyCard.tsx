import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Divider,
  useDisclosure,
  Tooltip,
  User,
  ModalFooter,
  Button,
  ScrollShadow,
  Radio,
  RadioGroup,
} from "@nextui-org/react";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/react";
import { IconDelete } from "../Icons";
import { useBoolean } from "../Common/CustomHooks";
const columns = [
  { name: "Sl.No", uid: "no" },
  { name: "Product", uid: "name" },
  { name: "Store Name", uid: "StoreName" },
  { name: "Quantity", uid: "actions" },
  { name: "Price", uid: "Price" },
];

const users = [
  {
    id: 1,
    name: "Tony Reichert",
    no: "1",
    team: "Management",
    status: "active",
    StoreName: "Samz Stroe",
    age: "29",
    avatar:
      "https://app.requestly.io/delay/1000/https://nextui.org/images/hero-card-complete.jpeg",
    Price: "45",
    email: "4",
  },
  {
    id: 2,
    name: "Zoey Lang",
    no: "2",
    team: "Development",
    status: "paused",
    age: "25",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    Price: "657",
    email: "4",
    StoreName: "Fruits Stroe",
  },
  {
    id: 3,
    name: "Jane Fisher",
    no: "3",
    team: "Development",
    status: "active",
    age: "22",
    avatar:
      "https://app.requestly.io/delay/1000/https://nextui.org/images/hero-card-complete.jpeg",
    Price: "657",
    email: "4",
    StoreName: "Grocery Stroe",
  },
  {
    id: 4,
    name: "William Howard",
    no: "4",
    team: "Marketing",
    status: "vacation",
    age: "28",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    Price: "657",
    email: "4",
    StoreName: "Bike Stroe",
  },
  {
    id: 5,
    name: "Kristen Copper",
    no: "5",
    team: "Sales",
    status: "active",
    age: "24",
    avatar:
      "https://app.requestly.io/delay/1000/https://nextui.org/images/hero-card-complete.jpeg",
    Price: "657",
    email: "4",
    StoreName: "Arul's Stroe",
  },
  {
    id: 6,
    name: "Kristen Copper",
    no: "6",
    team: "Sales",
    status: "active",
    age: "24",
    avatar:
      "https://app.requestly.io/delay/1000/https://nextui.org/images/hero-card-complete.jpeg",
    Price: "657",
    email: "4",
    StoreName: "Arul's Stroe",
  },
  {
    id: 7,
    name: "Kristen Copper",
    no: "7",
    team: "Sales",
    status: "active",
    age: "24",
    avatar:
      "https://app.requestly.io/delay/1000/https://nextui.org/images/hero-card-complete.jpeg",
    Price: "657",
    email: "4",
    StoreName: "Arul's Stroe",
  },
  {
    id: 8,
    name: "Kristen Copper",
    no: "8",
    team: "Sales",
    status: "active",
    age: "24",
    avatar:
      "https://app.requestly.io/delay/1000/https://nextui.org/images/hero-card-complete.jpeg",
    Price: "657",
    email: "4",
    StoreName: "Arul's Stroe",
  },
  {
    id: 9,
    name: "Kristen Copper",
    no: "9",
    team: "Sales",
    status: "active",
    age: "24",
    avatar:
      "https://app.requestly.io/delay/1000/https://nextui.org/images/hero-card-complete.jpeg",
    Price: "657",
    email: "4",
    StoreName: "Arul's Stroe",
  },
  {
    id: 10,
    name: "Kristen Copper",
    no: "10",
    team: "Sales",
    status: "active",
    age: "24",
    avatar:
      "https://app.requestly.io/delay/1000/https://nextui.org/images/hero-card-complete.jpeg",
    Price: "657",
    email: "4",
    StoreName: "Arul's Stroe",
  },
];
export const BuyCard = (props: any) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const renderCell = React.useCallback(
    (
      user: {
        [x: string]: any;
        avatar: any;
        email:any;
        team:any;
      },
      columnKey: string | number
    ) => {
      const cellValue = user[columnKey];

      switch (columnKey) {
        case "name":
          return (
            <User
              className="p-0 m-0"
              avatarProps={{ radius: "lg", src: user.avatar }}
              //   description={user.email}
              name={null}
            >
              {/* {user.email} */}
            </User>
          );
        case "role":
          return (
            <div className="flex flex-col items-center">
              <p className="text-bold xm:text-sm mm:text-sm ml:text-sm capitalize flex items-center">
                {cellValue}
              </p>
            </div>
          );

        case "actions":
          return (
            <div className=" flex items-center">
              <div className="rounded-lg bg-gray-200 flex justify-between items-center">
                <Button
                  className="bgnone 3xl:w-unit-10 3xl:h-unit-8 3xl:min-h-unit-8 2xl:w-unit-10 2xl:h-unit-8 2xl:min-h-unit-8 xl:w-unit-10 xl:h-unit-8 xl:min-h-unit-8 lg:w-unit-10 lg:h-unit-8 lg:min-h-unit-8 xm:min-w-unit-6 ml:min-h-unit-6 xm:min-h-unit-6 mm:min-h-unit-6 xm:w-unit-4 xm:h-unit-4 mm:min-w-unit-6 mm:w-unit-4 mm:h-unit-4 ml:min-w-unit-6 ml:w-unit-4 ml:h-unit-4"
                  radius="full"
                  isIconOnly
                  size="md"
                >
                  -
                </Button>
                <p className="bgnone p-0 m-0 text-sm font-semibold ">7</p>

                <Button
                  className="bgnone 3xl:w-unit-10 3xl:h-unit-8 3xl:min-h-unit-8 2xl:w-unit-10 2xl:h-unit-8 2xl:min-h-unit-8 xl:w-unit-10 xl:h-unit-8 xl:min-h-unit-8 lg:w-unit-10 lg:h-unit-8 lg:min-h-unit-8 ml:min-h-unit-6 xm:min-h-unit-6 mm:min-h-unit-6 xm:min-w-unit-6 xm:w-unit-4 xm:h-unit-4 mm:min-w-unit-6 mm:w-unit-4 mm:h-unit-4 ml:min-w-unit-6 ml:w-unit-4 ml:h-unit-4"
                  radius="full"
                  isIconOnly
                  size="md"
                >
                  +
                </Button>
              </div>

              {/* <div className="text-sm text-danger cursor-pointer active:opacity-50"> xm:h-unit-4 ml:h-unit-4 mm:h-unit-4 xm:w-unit-4 mm:w-unit-4 ml::w-unit-4*/}
              <Button
                className="bgnone  lg:w-unit-10 lg:h-unit-10 lg:min-h-unit-8 ml:min-h-unit-6 xm:min-h-unit-6 mm:min-h-unit-6 xm:min-w-unit-6 xm:w-unit-4 xm:h-unit-4 mm:min-w-unit-6 mm:w-unit-4 mm:h-unit-4 ml:min-w-unit-6 ml:w-unit-4 ml:h-unit-4"
                isIconOnly
                onPress={onOpen}
                size="md"
              >
                <IconDelete fill="#ff0000" />
                {/* <Tooltip
                  color="danger"
                  content="Delete"
                  closeDelay={0}
                  size="sm"
                  radius="lg"
                  showArrow={true}
                >
                  <p className="p-0 m-0">
                    
                  </p>
                </Tooltip> */}
              </Button>
              {/* </div> */}
            </div>
          );
        default:
          return <p className="m-0 p-0">{cellValue}</p>;
      }
    },
    []
  );
  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onClose={props.onClose}
        size={"5xl"}
        shadow="md"
        placement="bottom"
        backdrop="blur"
        scrollBehavior="inside"
      >
        <ModalContent className="pb-3">
          <>
            <ModalHeader></ModalHeader>
            <ModalBody className=" p-0 m-0 mt-1 ">
              <div className="grid xm:grid-cols-1 mm:grid-cols-1  sm:grid-cols-1 ml:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-2 4xl:grid-cols-2">
                <div className="">
                  <Table
                    isStriped 
                    classNames={{
                      base: " xm:max-h-[250px] mm:max-h-[250px] ml:max-h-[250px] md:max-h-[340px] lg:max-h-[340px] xl:max-h-[340px] 2xl:max-h-[340px] 3xl:max-h-[340px] 3xl:max-h-[340px] overflow-scroll",
                      table:
                        "xm:min-h-[350px] ml:min-h-[350px] mm:min-h-[350px] lg:min-h-[340px] md:max-h-[340px] xl:max-h-[340px] 2xl:max-h-[340px] 3xl:max-h-[340px] 3xl:max-h-[340px] ",
                    }}
                  >
                    <TableHeader columns={columns} className="">
                      {(column) => (
                        <TableColumn
                          className="ps-0 m-0"
                          key={column.uid}
                          align={column.uid === "actions" ? "center" : "start"}
                        >
                          {column.name}
                        </TableColumn>
                      )}
                    </TableHeader>

                    <TableBody items={users} className="m-0 p-0">
                      {(item) => (
                        <TableRow key={item.id} className="p-0 m-0">
                          {(columnKey) => (
                            <TableCell className="p-1 m-0">
                              {renderCell(item, columnKey)}
                            </TableCell>
                          )}
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <div className="items-center flex justify-center ">
                    <Button
                      size="sm"
                      color="primary"
                      className="me-3"
                      // className="ml:min-h-unit-6 xm:min-h-unit-6 mm:min-h-unit-6 xm:min-w-unit-6 xm:w-unit-4 xm:h-unit-4 mm:min-w-unit-6 mm:w-unit-4 mm:h-unit-4 ml:min-w-unit-6 ml:w-unit-4 ml:h-unit-4"
                    >
                      Clear Cart
                    </Button>
                    <Button
                      size="sm"
                      color="primary"
                      variant="bordered"
                      className="ms-3"
                      // className="ml:min-h-unit-6 xm:min-h-unit-6 mm:min-h-unit-6 xm:min-w-unit-6 xm:w-unit-4 xm:h-unit-4 mm:min-w-unit-6 mm:w-unit-4 mm:h-unit-4 ml:min-w-unit-6 ml:w-unit-4 ml:h-unit-4"
                    >
                      Buy More Items
                    </Button>
                  </div>
                  {/* <div className="items-center flex justify-center">
                    <ModalFooter>
                      <Button size="sm" color="primary" className="me-5">
                        Clear Cart
                      </Button>
                      <Button size="sm" color="primary" variant="bordered">
                        Buy More Items
                      </Button>
                    </ModalFooter>
                  </div> */}
                </div>
                <div>
                  <div className=" BuycarBg mx-3">
                    <div className="flex justify-between py-1 mx-3 font-medium text-sm m-1">
                      <div>Total Products (4 Items )</div>
                      <div> Rs : 5050</div>
                    </div>
                    <div className="flex justify-between py-1 mx-3 font-medium text-sm m-1">
                      <div>Discount</div>
                      <div> 100%</div>
                    </div>
                    <div className="flex justify-between py-1 mx-3 font-medium text-sm m-1">
                      <div>Delivery Charge</div>
                      <div> Free</div>
                    </div>
                    <Divider orientation="horizontal" className="my-3.5" />
                    <div className="flex justify-between py-1 mx-3 text-base font-medium  m-1">
                      <div>Total Amount</div>
                      <div> Rs. 3500</div>
                    </div>
                    <Divider orientation="horizontal" className="my-2" />
                    <div className="paymetoptionBg mx-3 mt-2 rounded-lg">
                      <div className="font-medium paymetoption text-base mx-3 pb-2 pt-2">
                        Payment Options
                      </div>
                      <RadioGroup className="w-full">
                        <div className="flex  justify-between items-center mx-3 w-full">
                          <div className="w-2/4 m-1 items-center">
                            <Radio
                              value=" Google-Pay "
                              size="sm"
                              className="items-center"
                            >
                              Google Pay
                            </Radio>
                          </div>
                          <div className="w-2/4 m-1 items-center">
                            <Radio
                              value="Phone-Pay"
                              size="sm"
                              className="items-center"
                            >
                              Phone Pay
                            </Radio>
                          </div>
                        </div>
                        <div className="flex  justify-between items-center mx-3 w-full">
                          <div className="w-2/4 m-1 items-center">
                            <Radio
                              value=" Debit-Card"
                              size="sm"
                              className="items-center"
                            >
                              Debit Card
                            </Radio>
                          </div>
                          <div className="w-2/4 m-1 items-center">
                            <Radio
                              value="Credit-Card"
                              size="sm"
                              className="items-center"
                            >
                              Credit Card
                            </Radio>
                          </div>
                        </div>
                        <div className="justify-between mx-3 flex w-full items-center">
                          <div className="w-2/4 m-1 items-center">
                            <Radio
                              value="Cash-on-Delivery"
                              size="sm"
                              className="items-center"
                            >
                              Cash on Delivery
                            </Radio>
                          </div>
                        </div>
                      </RadioGroup>
                      <div className="flex items-center justify-center mt-4 mb-1">
                        <Button size="sm" color="primary" className="me-5">
                          Book Order
                        </Button>
                        <Button size="sm" color="primary" variant="bordered">
                          Back To Shop
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className=" BuycarBg mx-4">
                  <div className="flex justify-between py-1 mx-3 font-medium text-sm m-2.5">
                    <div>Total Products (4 Items )</div>
                    <div> Rs : 5050</div>
                  </div>
                  <div className="flex justify-between py-1 mx-3 font-medium text-sm m-2.5">
                    <div>Discount</div>
                    <div> 100%</div>
                  </div>
                  <div className="flex justify-between py-1 mx-3 font-medium text-sm m-2.5">
                    <div>Delivery Charge</div>
                    <div> Free</div>
                  </div>
                  <Divider orientation="horizontal" className="my-3" />
                  <div className="flex justify-between py-1 mx-3 text-base font-medium  m-2.5">
                    <div>Total Amount</div>
                    <div> Rs. 3500</div>
                  </div>
                  <Divider orientation="horizontal" className="my-3" />
                  <div className="paymetoptionBg mx-3 mt-2 rounded-lg">
                    <div className="font-medium paymetoption text-base mx-3 pb-4 pt-2">
                      Payment Options
                    </div>
                    <RadioGroup className="w-full">
                      <div className="flex  justify-between items-center mx-3 w-full">
                        <div className="w-2/4 m-1 items-center">
                          <Radio
                            value=" Google-Pay "
                            size="sm"
                            className="items-center"
                          >
                            Google Pay
                          </Radio>
                        </div>
                        <div className="w-2/4 m-1 items-center">
                          <Radio
                            value="Phone-Pay"
                            size="sm"
                            className="items-center"
                          >
                            Phone Pay
                          </Radio>
                        </div>
                      </div>
                      <div className="flex  justify-between items-center mx-3 w-full">
                        <div className="w-2/4 m-1 items-center">
                          <Radio
                            value=" Debit-Card"
                            size="sm"
                            className="items-center"
                          >
                            Debit Card
                          </Radio>
                        </div>
                        <div className="w-2/4 m-1 items-center">
                          <Radio
                            value="Credit-Card"
                            size="sm"
                            className="items-center"
                          >
                            Credit Card
                          </Radio>
                        </div>
                      </div>
                      <div className="justify-between mx-3 flex w-full items-center">
                        <div className="w-2/4 m-1 items-center">
                          <Radio
                            value="Cash-on-Delivery"
                            size="sm"
                            className="items-center"
                          >
                            Cash on Delivery
                          </Radio>
                        </div>
                      </div>
                    </RadioGroup>
                    <div className="flex items-center justify-center mt-4 pb-3">
                      <Button size="sm" color="primary" className="me-5">
                        Book Order
                      </Button>
                      <Button size="sm" color="primary" variant="bordered">
                        Back To Shop
                      </Button>
                    </div>
                  </div>
                </div> */}
              </div>
            </ModalBody>
          </>
        </ModalContent>
      </Modal>

      <>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          size="md"
          placement="center"
          backdrop="blur"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Delete Product
                </ModalHeader>
                <ModalBody>
                  Are you sure you want to delete this product ?
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
                  <Button color="danger" size="sm" onPress={onClose}>
                    Delete
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </>
  );
};
