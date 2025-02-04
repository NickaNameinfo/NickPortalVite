import * as React from "react";
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
  onUpdateSidebarExpand,
} from "../Components/Common/globalSlice";
import { useGetCategoryQuery } from "../views/pages/Category/Service.mjs";
import {
  useGetCartByOrderIdQuery,
  useGetOrderByOrderIdQuery,
} from "../views/pages/Store/Service.mjs";
import { OrderCard } from "./Card/OrderCard";
import { BuyCard } from "./Card/BuyCard";

export const AppSidebar = () => {
  const [selectedCategory, setSelectedCategory] = React.useState([]);
  const currentloginDetails = useAppSelector(
    (state) => state.globalConfig.currentloginDetails
  );
  const isOpenCartModal = useAppSelector(
    (state) => state.globalConfig.isOpenCartModal
  );
  const isSideBarExpand = useAppSelector(
    (state) => state.globalConfig.isSideBarExpand
  );
  const { data, refetch } = useGetCategoryQuery();
  const [onSeletedItem, setOnSelectedItem] = React.useState(null);
  const [oderIsOpen, setOrderIsOpen] = React.useState(false);
  const id = getCookie("id");
  const dispatch = useAppDispatch();

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

  const onSearchByCategory = (id) => {
    dispatch(onSearchGlobal(null));
    dispatch(onGlobalCategorySearch(id));
    dispatch(onGlobalPaymentSearch(null));
  };

  const handleFilters = (result) => {
    console.log(result, "asdf9a7s0df78sa");

    if (onSeletedItem === result.key) {
      dispatch(onGlobalPaymentSearch(null));
      dispatch(onUpdateOpenStore(false));
      setOnSelectedItem(null);
      dispatch(onSearchGlobal(null));
      dispatch(onGlobalCategorySearch(null));
    } else {
      dispatch(onGlobalPaymentSearch(result?.key));
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
    }
  };

  return (
    <>
      <div
        className={`navBarStyle 
          transition-all duration-300 fixed top-0 h-full shadow-md z-20
           overflow-y-auto
          ${
            isSideBarExpand
              ? "left-0 md:-left-full"
              : "-left-full md:left-0 md:relative min-w-[230px]"
          }       
        `}
      >
        <Link
          to="/"
          className="flex items-center justify-between px-4 border-b-2 border-b-white text-gray-900 dark:text-white group logoCls"
        >
          <div className="rounded-sm">
            <Image
              alt="Woman listing to music"
              className={` rounded-xl object-fit max-h-[42px] min-w-[80px]`}
              src="https://nicknameinfotech.com/img/new-logo.png"
              // src="../assets/logo.jpg"
            />
          </div>
          <span
            onClick={() => {
              dispatch(onUpdateSidebarExpand(!isSideBarExpand));
            }}
          >
            {isSideBarExpand ? <Arrowleft /> : <Arrowright />}
          </span>
        </Link>
        <aside id="default-sidebar" className="h-[87vh]" aria-label="Sidebar">
          <div className="h-full px-3 pb-2 pt-0 overflow-y-auto custom-scrollbar">
            <div
              className="scroll-content h-fit left-0 top-0 transition-transform z-40"
              style={{
                paddingBottom: "21%",
              }}
            >
              {_nav?.map((result) =>
                result?.menuType === "single" ? (
                  <div
                    style={
                      !result?.isSoon
                        ? {
                            backgroundColor: `${
                              result?.key === onSeletedItem
                                ? "#49a84cd4"
                                : "white"
                            } `,
                          }
                        : {}
                    }
                    className={"rounded-lg cursor-pointer"}
                    onClick={() => {
                      handleFilters(result);
                    }}
                  >
                    <div
                      className={`my-3 p-2 text-sm flex items-center text-gray-900 rounded-lg ${
                        result?.isSoon ? "bg-[#d3d3d385]" : "dark:text-white"
                      } `}
                    >
                      <div className="flex justify-between w-full items-center">
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
              className={`absolute bottom-0 rounded-lg w-11/12 ${
                currentloginDetails?.data?.email ? "bg-white" : ""
              } p-1`}
            >
              {!currentloginDetails?.data?.email ? (
                <Login />
              ) : (
                <div className="flex justify-between w-full items-center">
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
