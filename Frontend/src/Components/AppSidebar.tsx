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
import { useAppSelector } from "./Common/hooks";
import Login from "../views/pages/login/Login";
import {eraseCookie} from "../JsFiles/CommonFunction.mjs"
export const AppSidebar = () => {
  const [menuToggle, setMenuToggle] = React.useState(false);
  const [mobileExpand, setMobileExpand] = React.useState(false);
  const navigate = useNavigate();
  const currentloginDetails = useAppSelector(
    (state) => state.globalConfig.currentloginDetails
  );
  const itemClasses = {
    base: "py-0 w-full",
    title: "text-black text-sm font-normal",
    trigger:
      "px-2 py-0 data-[hover=true]:bg-default-10 rounded-lg h-14 flex items-center",
    indicator: "text-medium",
    content: "text-small px-2",
  };
  const slots = {
    base: "border-default hover:bg-default-200",
    content: "text-default-500",
  };

  const handleLogOut = () => {
    eraseCookie("token");
    eraseCookie("role");
    eraseCookie("id");
    eraseCookie("vendorId");
    eraseCookie("storeId");
    eraseCookie("plan");
    navigate("/")
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
          to="#"
          className="flex items-center justify-between px-4 border-b-2 border-b-white text-gray-900 dark:text-white group logoCls"
        >
          <div className="rounded-sm">
            <Image
              alt="Woman listing to music"
              className={` rounded-xl object-cover ${
                menuToggle
                  ? "max-h-[42px] min-w-[100px]"
                  : "max-h-[42px] min-w-[190px]"
              }`}
              src="https://nextui-docs-v2.vercel.app/images/album-cover.png"
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
        <aside id="default-sidebar" className="h-[84vh]" aria-label="Sidebar">
          <div className="h-full px-3 pb-4 pt-0 overflow-y-auto custom-scrollbar">
            <div className="scroll-content h-fit left-0 top-0 transition-transform z-40">
              {_nav?.map((result) =>
                result?.menuType === "single" ? (
                  <div
                    style={{ backgroundColor: "#ffffff80" }}
                    className="rounded-lg"
                  >
                    <Link
                      to="#"
                      className="my-3 p-2 text-sm flex items-center text-gray-900 rounded-lg dark:text-white"
                    >
                      <div className="flex justify-between w-full items-center">
                        {menuToggle ? (
                          <span>
                            <FormeIcon />
                          </span>
                        ) : (
                          <p className="text-black text-sm font-normal">
                            {result?.name}
                          </p>
                        )}
                        <Switch
                          color="secondary"
                          size="md"
                          defaultSelected
                          classNames={{
                            wrapper: [
                              "p-0 h-3 w-9   overflow-visible group-data-[selected=true]: bg-cyan-400",
                            ],
                            thumb: cn(
                              "w-5 h-5  shadow-lg",

                              "group-data-[hover=true]:border-secondary",

                              //selected bg-teal-400 , bg-yellow-600
                              "group-data-[selected=true]:bg-green-500",
                              "group-data-[selected=true]:ml-4 ",

                              // pressed bg-green-600
                              "group-data-[pressed=true]:w-7 ",
                              "group-data-[selected]:group-data-[pressed]:ml-4 ",
                              "group-data-[selected=true]: bg-cyan-500"
                            ),
                          }}
                          aria-label="Automatic updates"
                        />
                      </div>
                    </Link>
                  </div>
                ) : (
                  <div className="rounded-lg mb-3">
                    <Accordion
                      itemClasses={itemClasses}
                      className="text-foreground rounded-lg"
                      style={{
                        backgroundColor: "rgba(236, 247, 255, 0.5)",
                        // color: "black !important",
                        // opacity: 4,
                      }}
                    >
                      <AccordionItem
                        key="1"
                        aria-label={result?.name}
                        title={result?.name}
                        className="p-0 m-0 text-foreground"
                      >
                        <ul className="">
                          <li className="p-0 m-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <div className="flex  items-center">
                                <p
                                  className="me-2 text-black mt-0.5"
                                  style={{
                                    height: "4px",
                                    width: "4px",
                                    borderRadius: "8px",
                                    backgroundColor: "black",
                                  }}
                                ></p>
                                <p className="ms-2 text-black font-normal text-sm">
                                  Grocery
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
                                  className="m-0 p-0"
                                  // defaultSelected
                                  size="sm"
                                  color="success"
                                  radius="none"
                                />
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="flex items-center justify-between mb-0.5">
                              <div className="flex  items-center">
                                <p
                                  className="me-2 text-black mt-0.5"
                                  style={{
                                    height: "4px",
                                    width: "4px",
                                    borderRadius: "8px",
                                    backgroundColor: "black",
                                  }}
                                ></p>
                                <p className="ms-2 text-black font-normal text-sm">
                                  Mobiles
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
                                  className="m-0 p-0"
                                  // defaultSelected
                                  size="sm"
                                  color="success"
                                  radius="none"
                                />
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="flex items-center justify-between">
                              <div className="flex  items-center">
                                <p
                                  className="me-2 text-black mt-0.5"
                                  style={{
                                    height: "4px",
                                    width: "4px",
                                    borderRadius: "8px",
                                    backgroundColor: "black",
                                  }}
                                ></p>
                                <p className="ms-2 text-black font-normal text-sm">
                                  Beauty, Toys & More
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
                                  className="m-0 p-0"
                                  // defaultSelected
                                  size="sm"
                                  color="success"
                                  radius="none"
                                />
                              </div>
                            </div>
                          </li>
                        </ul>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )
              )}
            </div>
            <div
              style={{ backgroundColor: "#ffffff80" }}
              className="absolute bottom-[5%] rounded-lg w-11/12"
            >
              {!currentloginDetails?.token ? (
                <Login />
              ) : (
                <div className="flex justify-between w-full items-center">
                  {menuToggle ? (
                    <span>
                      <FormeIcon />
                    </span>
                  ) : (
                    <p className="text-black text-sm font-normal">
                      <Popover showArrow placement="bottom">
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
                                onAction={(key) => alert(key)}
                                itemClasses={{
                                  base: "first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80",
                                }}
                              >
                                <ListboxItem
                                  key="issues"
                                  endContent={90}
                                  startContent={<IconHome />}
                                >
                                  Orders
                                </ListboxItem>
                                <ListboxItem
                                  key="pull_requests"
                                  endContent={90}
                                  startContent={<IconHome />}
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
                                  key="discussions"
                                  // endContent={90}
                                  startContent={<IconHome />}
                                  onClick={() => handleLogOut()}
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
    </>
  );
};
