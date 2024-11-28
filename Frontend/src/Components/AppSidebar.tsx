import {
  Accordion,
  AccordionItem,
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Switch,
  User,
  cn,
  Listbox,
  ListboxItem,
  useDisclosure,
} from "@nextui-org/react";
import * as React from "react";
import {
  Arrowleft,
  Arrowright,
  FormeIcon,
  IconHome,
  IconMap,
  IconMapRound,
} from "./Icons";
import { _nav } from "../_nav";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./Common/hooks";
import Login from "../views/pages/login/Login";
import { eraseCookie, getCookie } from "../JsFiles/CommonFunction.mjs";
import {
  onGlobalCategorySearch,
  onGlobalPaymentSearch,
  onSearchGlobal,
  onUpdateCartModal,
  onUpdateOpenStore,
  updateLoginDetails,
} from "../Components/Common/globalSlice";
import { useGetCategoryQuery } from "../views/pages/Category/Service.mjs";
import { useGetCartByOrderIdQuery, useGetOrderByOrderIdQuery } from "../views/pages/Store/Service.mjs";
import { OrderCard } from "./Card/OrderCard";
import { BuyCard } from "./Card/BuyCard";

export const AppSidebar = () => {
  const [menuToggle, setMenuToggle] = React.useState(false);
  const [mobileExpand, setMobileExpand] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState([]);
  const currentloginDetails = useAppSelector(
    (state) => state.globalConfig.currentloginDetails
  );
  const isOpenCartModal = useAppSelector(
    (state) => state.globalConfig.isOpenCartModal
  );
  const { data, refetch } = useGetCategoryQuery();
  const [onSeletedItem, setOnSelectedItem] = React.useState(null);
  const [oderIsOpen, setOrderIsOpen] = React.useState(false);
  const id = getCookie("id");
  const {
    data: cart,
    error: cartError,
    refetch: cartRefetch,
  } = useGetCartByOrderIdQuery(Number(id));
  const {
    data: orderList,
    error: orderListError,
    refetch: orderListRefetch,
  } = useGetOrderByOrderIdQuery(Number(id));

  const itemClasses = {
    base: "py-0 w-full",
    title: "text-white text-sm font-normal",
    trigger:
      "px-2 py-0 data-[hover=true]:bg-default-10 rounded-lg h-10 flex items-center",
    indicator: "text-medium",
    content: "text-small px-2",
  };

  React.useEffect(() => {
    refetch();
    cartRefetch();
    orderListRefetch();
  }, []);

  React.useEffect(() => {
    onSearchByCategory(
      selectedCategory?.length > 0 ? selectedCategory?.join(",") : null
    );
  }, [selectedCategory]);

  const handleLogOut = () => {
    eraseCookie("token");
    eraseCookie("role");
    eraseCookie("id");
    eraseCookie("vendorId");
    eraseCookie("storeId");
    eraseCookie("plan");
    dispatch(updateLoginDetails(null));
    location.reload();
  };

  const dispatch = useAppDispatch();
  const onSearchByPayment = (item) => {
    dispatch(onSearchGlobal(null));
    dispatch(onGlobalCategorySearch(null));
    dispatch(onGlobalPaymentSearch(item?.key));
  };

  const onSearchByCategory = (id) => {
    dispatch(onSearchGlobal(null));
    dispatch(onGlobalCategorySearch(id));
    dispatch(onGlobalPaymentSearch(null));
  };

  return (
    <>
      <div className="md:hidden">
        <Button
          isIconOnly
          color="primary"
          className="bg-white absolute md:hidden top-[32px] z-10 left-[-7px]"
          aria-label="Take a photo"
          onClick={() => setMobileExpand((prev) => !prev)}
        >
          <IconHome height="14px" width="14px" />
        </Button>
      </div>
      <div
        className={`navBarStyle xm:absolute xm:z-10 md:relative md:left-0 ${
          mobileExpand ? "xm:left-[0%]" : "xm:left-[-100%]"
        } ${menuToggle ? "min-w-[150px]" : "min-w-[250px]"}`}
      >
        <Link
          to="/"
          className="flex items-center justify-between px-4 border-b-2 border-b-white text-gray-900 dark:text-white group logoCls"
        >
          <div className="rounded-sm">
            <Image
              alt="Woman listing to music"
              className={` rounded-xl object-fit ${
                menuToggle
                  ? "max-h-[42px] min-w-[100px]"
                  : "max-h-[42px] min-w-[80px]"
              }`}
              src="https://nicknameinfotech.com/img/new-logo.png"
              // src="../assets/logo.jpg"
            />
          </div>
          {mobileExpand ? (
            <span onClick={() => setMobileExpand((prev) => !prev)}>
              {menuToggle ? (
                <svg
                  width="9"
                  height="14"
                  viewBox="0 0 9 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L8 7L1 13"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              ) : (
                <p>No</p>
              )}
            </span>
          ) : (
            <span
              className="ms-2"
              onClick={() => setMenuToggle((prev) => !prev)}
            >
              {menuToggle ? <Arrowright /> : <Arrowleft />}
            </span>
          )}
        </Link>
        <aside id="default-sidebar" className="h-[72vh]" aria-label="Sidebar">
          <div className="h-full px-3 pb-2 pt-0 overflow-y-auto custom-scrollbar">
            <div className="scroll-content h-fit left-0 top-0 transition-transform z-40">
              {_nav?.map((result) =>
                result?.menuType === "single" ? (
                  <div
                    style={
                      !result?.isSoon
                        ? {
                            backgroundColor: `${
                              result?.key === onSeletedItem
                                ? "white"
                                : "#49a84cd4"
                            } `,
                          }
                        : {}
                    }
                    className={"rounded-lg cursor-pointer"}
                    onClick={() => {
                      if (onSeletedItem === result.key) {
                        onSearchByPayment(result);
                        dispatch(onUpdateOpenStore(false));
                        setOnSelectedItem(null);
                        dispatch(onSearchGlobal(null));
                        dispatch(onGlobalCategorySearch(null));
                        dispatch(onGlobalPaymentSearch(null));
                      } else {
                        setOnSelectedItem(result.key);
                      }

                      if (result?.key === "Hospitals") {
                        onSearchByCategory(20);
                        dispatch(onUpdateOpenStore(false));
                      } else if (result?.key === "Hotels") {
                        onSearchByCategory(21);
                        dispatch(onUpdateOpenStore(false));
                      } else if (result?.key === "Open Shop") {
                        dispatch(onSearchGlobal(null));
                        dispatch(onGlobalCategorySearch(null));
                        dispatch(onGlobalPaymentSearch(null));
                        dispatch(onUpdateOpenStore(true));
                      } else {
                        onSearchByPayment(result);
                        dispatch(onUpdateOpenStore(false));
                      }
                    }}
                  >
                    <div
                      className={`my-3 p-2 text-sm flex items-center text-gray-900 rounded-lg ${
                        result?.isSoon ? "bg-[#f6bc0085]" : "dark:text-white"
                      } `}
                    >
                      <div className="flex justify-between w-full items-center">
                        {menuToggle ? (
                          <span>
                            <FormeIcon />
                          </span>
                        ) : (
                          <div
                            className={
                              result?.isSoon || result?.key === onSeletedItem
                                ? "flex w-full justify-between"
                                : ""
                            }
                          >
                            <p className="text-black text-sm font-normal">
                              {result?.name}
                            </p>
                            {result?.isSoon ? (
                              <p className="text-green-700 text-[0.6rem] font-mono me-2">
                                coming soon
                              </p>
                            ) : result?.key === onSeletedItem ? (
                              <p className="text-green-700 text-[0.6rem] font-mono me-2">
                                Selected
                              </p>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg mb-3">
                    <Accordion
                      itemClasses={itemClasses}
                      className="text-foreground rounded-lg"
                      style={{
                        backgroundColor: "#4c86f9",
                        // opacity: 4,
                      }}
                    >
                      <AccordionItem
                        key="1"
                        aria-label={result?.name}
                        title={result?.name}
                        className="p-0 m-0 text-white"
                      >
                        <ul>
                          {data?.data?.map((data) => {
                            return (
                              <li className="pb-2 m-0">
                                <div className="flex items-center justify-between mb-0.5">
                                  <div className="flex items-center">
                                    <p
                                      className="me-2 text-white mt-0.5"
                                      style={{
                                        height: "4px",
                                        width: "4px",
                                        borderRadius: "8px",
                                        backgroundColor: "#f6bc00",
                                      }}
                                    ></p>
                                    <p className="ms-2 text-white font-normal text-sm">
                                      {data?.name}
                                    </p>
                                  </div>
                                  <div>
                                    <Checkbox
                                      classNames={{
                                        label: [
                                          "text-small",
                                          "text-yellow-300",
                                          "font-light",
                                          "hover:bg-cyan-500",
                                          "data-[hover=true]:bg-cyan-500",
                                        ],
                                        wrapper: [
                                          "before:border-0",
                                          "before:bg-cyan-500",
                                          "data-[hover=true]:bg-cyan-500",
                                        ],
                                      }}
                                      value={data?.id}
                                      className="m-0 p-0"
                                      onChange={(e) => {
                                        setSelectedCategory((prev) => {
                                          // Check if the category is already selected
                                          if (prev.includes(data?.id)) {
                                            // If it is, remove it from the array
                                            return prev.filter(
                                              (id) => id !== data?.id
                                            );
                                          } else {
                                            // If not, add it to the array
                                            return [...prev, data?.id];
                                          }
                                        });
                                      }}
                                      size="sm"
                                      color="success"
                                      radius="none"
                                    />
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )
              )}
            </div>
            <div
              style={{
                textAlign: currentloginDetails?.data?.email ? "left" : "right",
              }}
              className={`absolute bottom-[3%] rounded-lg w-11/12 ${
                currentloginDetails?.data?.email ? "bg-white" : ""
              } p-1`}
            >
              {!currentloginDetails?.data?.email ? (
                <Login />
              ) : (
                <div className="flex justify-between w-full items-center">
                  {menuToggle ? (
                    <span>
                      <FormeIcon />
                    </span>
                  ) : (
                    <p className="text-black text-sm font-normal w-full">
                      <Popover showArrow placement="bottom" className="w-full">
                        <PopoverTrigger>
                          <User
                            as="button"
                            name={currentloginDetails?.data?.firstName}
                            description="Your Details"
                            className="transition-transform"
                            avatarProps={{
                              src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                            }}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Card
                            shadow="none"
                            className="min-w-[230px] border-none bg-transparent p-0"
                          >
                            <CardBody className="p-0 w-full">
                              <Listbox
                                aria-label="User Menu"
                                onAction={(key) => {
                                  if (key === "logOut") {
                                    handleLogOut();
                                  }
                                }}
                                itemClasses={{
                                  base: "first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80",
                                }}
                              >
                                <ListboxItem
                                  key="issues"
                                  endContent={orderList?.data?.length}
                                  startContent={<IconHome />}
                                  onClick={() => setOrderIsOpen(true)}
                                >
                                  Orders
                                </ListboxItem>
                                <ListboxItem
                                  key="pull_requests"
                                  endContent={cart?.data?.length}
                                  startContent={<IconHome />}
                                  onClick={() =>
                                    dispatch(onUpdateCartModal(true))
                                  }
                                >
                                  Cart
                                </ListboxItem>
                                <ListboxItem
                                  key="discussions"
                                  // endContent={90}
                                  startContent={<IconHome />}
                                >
                                  Profile
                                </ListboxItem>
                                <ListboxItem
                                  key="logOut"
                                  startContent={<IconHome />}
                                >
                                  Log Out
                                </ListboxItem>
                              </Listbox>
                            </CardBody>
                          </Card>
                        </PopoverContent>
                      </Popover>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
      <OrderCard isOpen={oderIsOpen} onClose={() => setOrderIsOpen(false)} />
      {isOpenCartModal && <BuyCard isOpen={isOpenCartModal} />}
    </>
  );
};
