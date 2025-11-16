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
import { IconDelete, ModalCloseIcon } from "../Icons";
import { useNavigate, useParams } from "react-router-dom";
import { infoData } from "../../configData";
import { getCookie } from "../../JsFiles/CommonFunction.mjs";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { onRefreshCart, onUpdateCartModal } from "../../Common/globalSlice";
import { useAppSelector, useAppDispatch } from "../../Common/hooks";
import {
  useGetCartByOrderIdQuery,
  useUpdateCartMutation,
  useDeleteCartItemMutation,
  useAddOrderMutation,
} from "../../views/VendorProducts/Service.mjs";
const columns = [
  { name: "Sl.No", uid: "id" },
  { name: "Product", uid: "photo" },
  { name: "Quantity", uid: "actions" },
  { name: "Price", uid: "price" },
];

export const BuyCard = (props: any) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const onRefresh = useAppSelector((state) => state.globalConfig.onRefreshCart);

  const isOpenCartModal = useAppSelector(
    (state) => state.globalConfig.isOpenCartModal
  );
  const userId = getCookie("id");
  const { id } = useParams();
  const {
    data: cart,
    error: cartError,
    refetch: cartRefetch,
  } = useGetCartByOrderIdQuery(Number(userId), { skip: !userId });

  const [updateCart] = useUpdateCartMutation();
  const [deleteCartItem] = useDeleteCartItemMutation();
  const [addOrder] = useAddOrderMutation();
  const [deletId, setDeleteId] = React.useState(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  React.useEffect(() => {
    onRefresh && dispatch(onRefreshCart(false));
  }, [userId, onRefresh]);

  const handleAddCart = async (type, product) => {
    let tempCartValue = {
      productId: product?.productId,
      name: product?.name,
      orderId: userId,
      price: Number(product?.price),
      total: Number(product?.qty) * Number(product?.price),
      qty: product?.qty
        ? type === "add"
          ? Number(product?.qty) + 1
          : Number(product?.qty) - 1
        : 1,
      photo: props?.item?.product?.photo,
    };
    try {
      const result = await updateCart(tempCartValue);
      if (result) {
        cartRefetch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddOrder = async () => {
    if (cart?.data?.length > 0) {
      const promises = cart.data.map(async (item) => {
        try {
          const tempCartValue = {
            customerId: item?.orderId,
            paymentmethod: 3,
            orderId: Number(userId),
            grandTotal: Number(item?.qty * item?.price),
            productIds: item?.productId,
            qty: item?.qty,
            storeId: id,
          };
          return await addOrder(tempCartValue);
        } catch (error) {
          console.error("Failed to add order for item:", item, error);
          return null; // Return null for failed orders
        }
      });
      if (promises) {
        cart.data.map(async (item) => {
          onDeleteCartItems(item?.productId);
        });
        MySwal.fire({
          title: <p>Your order placed please vist your order page</p>,
        });
      }
    }
  };

  const onDeleteCartItems = async (productId?) => {
    let apiInfo = {
      orderId: userId,
      productId: productId ? productId : deletId,
    };
    const result = await deleteCartItem(apiInfo);
    if (result) {
      onClose();
      setDeleteId(null);
      dispatch(onRefreshCart(true));
    }
  };

  const renderCell = React.useCallback((data, columnKey) => {
    switch (columnKey) {
      case "photo":
        return (
          <User
            className="p-0 m-0"
            avatarProps={{
              radius: "lg",
              src: `${infoData.baseApi}/${data.photo}`,
            }}
            name={null}
          ></User>
        );
      case "actions":
        return (
          <div className=" flex items-center">
            <div className="rounded-lg bg-gray-200 flex justify-between items-center mr-1">
              <Button
                className="bg-gray-200 3xl:w-unit-10 3xl:h-unit-8 3xl:min-h-unit-8 2xl:w-unit-10 2xl:h-unit-8 2xl:min-h-unit-8 xl:w-unit-10 xl:h-unit-8 xl:min-h-unit-8 lg:w-unit-10 lg:h-unit-8 lg:min-h-unit-8 xm:min-w-unit-6 ml:min-h-unit-6 xm:min-h-unit-6 mm:min-h-unit-6 xm:w-unit-4 xm:h-unit-4 mm:min-w-unit-6 mm:w-unit-4 mm:h-unit-4 ml:min-w-unit-6 ml:w-unit-4 ml:h-unit-4"
                radius="full"
                isIconOnly
                size="md"
                onClick={() => handleAddCart("remove", data)}
              >
                -
              </Button>
              <p className="bg-gray-200 p-0 m-0 text-sm font-semibold ">
                {data?.qty ? data?.qty : 0}
              </p>

              <Button
                className="bg-gray-200 3xl:w-unit-10 3xl:h-unit-8 3xl:min-h-unit-8 2xl:w-unit-10 2xl:h-unit-8 2xl:min-h-unit-8 xl:w-unit-10 xl:h-unit-8 xl:min-h-unit-8 lg:w-unit-10 lg:h-unit-8 lg:min-h-unit-8 ml:min-h-unit-6 xm:min-h-unit-6 mm:min-h-unit-6 xm:min-w-unit-6 xm:w-unit-4 xm:h-unit-4 mm:min-w-unit-6 mm:w-unit-4 mm:h-unit-4 ml:min-w-unit-6 ml:w-unit-4 ml:h-unit-4"
                radius="full"
                isIconOnly
                size="md"
                onClick={() => handleAddCart("add", data)}
              >
                +
              </Button>
            </div>
            <Button
              className=" bg-gray-200 lg:w-unit-10 lg:h-unit-10 lg:min-h-unit-8 ml:min-h-unit-6 xm:min-h-unit-6 mm:min-h-unit-6 xm:min-w-unit-6 xm:w-unit-4 xm:h-unit-4 mm:min-w-unit-6 mm:w-unit-4 mm:h-unit-4 ml:min-w-unit-6 ml:w-unit-4 ml:h-unit-4"
              isIconOnly
              onPress={onOpen}
              onClick={() => setDeleteId(data.productId)}
              size="md"
            >
              <IconDelete fill="#ff0000" />
            </Button>
          </div>
        );
      default:
        return <p className="m-0 p-0">{data?.[columnKey]}</p>;
    }
  }, []);

  return (
    <>
      <Modal
        isOpen={isOpenCartModal}
        onClose={() => {
          if (isOpenCartModal) {
            dispatch(onUpdateCartModal({
              isOpen: false,
              item: null,
              qty: 0,
              type: null,
            }));
          }
        }}
        size={"5xl"}
        shadow="md"
        placement="center"
        backdrop="blur"
        scrollBehavior="inside"
        hideCloseButton
      >
        <ModalContent className="pb-3">
          <>
            <ModalCloseIcon
              onClick={() => {
                dispatch(onUpdateCartModal({
                  isOpen: false,
                  item: null,
                  qty: 0,
                  type: null,
                }));
              }}
              className="modalIconClose"
            />
            <ModalBody className="p-0 m-0 mt-1 pt-2">
              <div className="grid xm:grid-cols-1 mm:grid-cols-1  sm:grid-cols-1 ml:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-2 4xl:grid-cols-2">
                <div className="">
                  {!cart || cart?.data?.length <= 0 ? (
                    <p className="text-center my-3">No Item in Your Cart</p>
                  ) : (
                    <Table
                      isHeaderSticky
                      classNames={{
                        base: "xm:max-h-[250px] mm:max-h-[250px] ml:max-h-[250px] md:max-h-[340px] lg:max-h-[340px] xl:max-h-[340px] 2xl:max-h-[340px] 3xl:max-h-[340px] overflow-hidden",
                        table: "w-full",
                      }}
                    >
                      <TableHeader
                        columns={columns}
                        className="sticky top-0 bg-white z-10"
                      >
                        {(column) => (
                          <TableColumn
                            className="ps-0 m-0"
                            key={column.uid}
                            align={
                              column.uid === "actions" ? "center" : "start"
                            }
                          >
                            {column.name}
                          </TableColumn>
                        )}
                      </TableHeader>

                      <TableBody
                        items={cart?.data}
                        className="max-h-[340px] overflow-y-auto p-0 m-0"
                      >
                        {(item: any) => (
                          <TableRow key={item?.["id"]} className="p-0 m-0">
                            {(columnKey) => (
                              <TableCell className="p-1 m-0">
                                {renderCell(item, columnKey)}
                              </TableCell>
                            )}
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                  <div className="items-center flex justify-center ">
                    <Button
                      size="sm"
                      color="primary"
                      variant="bordered"
                      className={`ms-3 ${
                        cart?.data?.length <= 0 ? "cursor-not-allowed" : ""
                      }`}
                      onClick={() => navigate(-1)}
                      disabled={cart?.data?.length <= 0}
                    >
                      Buy More Items
                    </Button>
                  </div>
                </div>
                <div>
                  <div className=" BuycarBg mx-3">
                    <div className="flex justify-between py-1 mx-3 font-medium text-sm m-1">
                      <div>
                        Total Products (<b>{cart?.data?.length}</b> Items )
                      </div>
                      <div>
                        {" "}
                        Rs :{" "}
                        {cart?.data
                          ?.reduce(
                            (sum, item) => sum + item.price * item.qty,
                            0
                          ) // Multiply price with qty
                          .toFixed(2) // Ensures two decimal places
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </div>
                    </div>
                    {/* <div className="flex justify-between py-1 mx-3 font-medium text-sm m-1">
                      <div>Discount</div>
                      <div> 100%</div>
                    </div> */}
                    <div className="flex justify-between py-1 mx-3 font-medium text-sm m-1">
                      <div>Delivery Charge</div>
                      <div> Free</div>
                    </div>
                    <Divider orientation="horizontal" className="my-3.5" />
                    <div className="flex justify-between py-1 mx-3 text-base font-medium  m-1">
                      <div>Total Amount</div>
                      <div>
                        {" "}
                        Rs.{" "}
                        {cart?.data
                          ?.reduce(
                            (sum, item) => sum + item.price * item.qty,
                            0
                          ) // Multiply price with qty
                          .toFixed(2) // Ensures two decimal places
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </div>
                    </div>
                    <Divider orientation="horizontal" className="my-2" />
                    <div className="paymetoptionBg mx-3 mt-2 rounded-lg">
                      <div className="font-medium paymetoption text-base mx-3 pb-2 pt-2">
                        Payment Options
                      </div>
                      <RadioGroup className="w-full">
                        {/* <div className="flex  justify-between items-center mx-3 w-full"> */}
                        {/* <div className="w-2/4 m-1 items-center">
                            <Radio
                              value="Google-Pay"
                              size="sm"
                              className="items-center"
                              disabled
                            >
                              Google Pay
                            </Radio>
                          </div>
                          <div className="w-2/4 m-1 items-center">
                            <Radio
                              value="Phone-Pay"
                              size="sm"
                              className="items-center"
                              disabled
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
                              disabled
                            >
                              Debit Card
                            </Radio>
                          </div>
                          <div className="w-2/4 m-1 items-center">
                            <Radio
                              value="Credit-Card"
                              size="sm"
                              className="items-center"
                              disabled
                            >
                              Credit Card
                            </Radio>
                          </div>
                        </div> */}
                        <div className="justify-between mx-3 flex w-full items-center">
                          <div className="w-2/4 m-1 items-center">
                            <Radio
                              value={"3"}
                              size="sm"
                              className="items-center"
                              checked={true}
                            >
                              Cash on Delivery
                            </Radio>
                          </div>
                        </div>
                      </RadioGroup>
                      <div className="flex items-center justify-center mt-4 mb-1">
                        <Button
                          size="sm"
                          color="primary"
                          className={`me-5 ${
                            cart?.data?.length <= 0 ? "cursor-not-allowed" : ""
                          }`}
                          disabled={cart?.data?.length <= 0}
                          onClick={() => handleAddOrder()}
                        >
                          Book Order
                        </Button>
                        <Button
                          size="sm"
                          color="primary"
                          variant="bordered"
                          onClick={() => navigate(-1)}
                        >
                          Back To Shop
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
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
                  <Button
                    color="danger"
                    size="sm"
                    onPress={onClose}
                    onClick={() => onDeleteCartItems()}
                  >
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
