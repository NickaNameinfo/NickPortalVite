import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Image,
  Switch,
  cn,
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
import { Link } from "react-router-dom";

export const AppSidebar = () => {
  const [menuToggle, setMenuToggle] = React.useState(false);
  const [mobileExpand, setMobileExpand] = React.useState(false);

  const itemClasses = {
    base: "py-0 w-full",
    title: "text-black text-sm font-normal",
    trigger:
      "px-2 py-0 data-[hover=true]:bg-default-10 rounded-lg h-14 flex items-center",
    indicator: "text-medium",
    content: "text-small px-2",
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
              <div
                style={{ backgroundColor: "#ffffff80" }}
                className="rounded-lg"
              >
                {" "}
                <Link
                  to="#"
                  className="mt-5 p-2 text-sm flex items-center text-gray-900 rounded-lg dark:text-white "
                >
                  <div className="flex justify-between w-full items-center">
                    {menuToggle ? (
                      <span>
                        <FormeIcon />
                      </span>
                    ) : (
                      <p className="text-black text-sm font-normal">For Me</p>
                    )}
                    <Switch
                      color="secondary"
                      size="md"
                      defaultSelected
                      classNames={{
                        wrapper: "p-0 h-3 w-9   overflow-visible",
                        thumb: cn(
                          "w-5 h-5  shadow-lg",
                          "group-data-[hover=true]:border-secondary",
                          //selected
                          "group-data-[selected=true]:ml-4  bg-secondary",

                          // pressed
                          "group-data-[pressed=true]:w-7",
                          "group-data-[selected]:group-data-[pressed]:ml-4"
                        ),
                      }}
                      aria-label="Automatic updates"
                    />
                  </div>
                </Link>
              </div>
              <div
                style={{ backgroundColor: "#ffffff80" }}
                className="rounded-lg"
              >
                <Link
                  to="#"
                  className="my-3 p-2 text-sm flex items-center text-gray-900 rounded-lg dark:text-white "
                >
                  <div className="flex justify-between w-full items-center">
                    {menuToggle ? (
                      <span>
                        <FormeIcon />
                      </span>
                    ) : (
                      <p className="text-black text-sm font-normal">
                        Within 5Km
                      </p>
                    )}
                    <Switch
                      color="secondary"
                      size="md"
                      defaultSelected
                      classNames={{
                        wrapper: "p-0 h-3 w-9   overflow-visible",
                        thumb: cn(
                          "w-5 h-5  shadow-lg",
                          "group-data-[hover=true]:border-secondary",
                          //selected
                          "group-data-[selected=true]:ml-4  bg-secondary",

                          // pressed
                          "group-data-[pressed=true]:w-7",
                          "group-data-[selected]:group-data-[pressed]:ml-4"
                        ),
                      }}
                      aria-label="Automatic updates"
                    />
                  </div>
                </Link>
              </div>
              <div className="rounded-lg">
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
                    aria-label="Categories"
                    title="Categories"
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
                              className="m-0 p-0"
                              defaultSelected
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
                              className="m-0 p-0"
                              defaultSelected
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
                              className="m-0 p-0"
                              defaultSelected
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
              <div className="mt-3">
                <Accordion
                  variant="light"
                  className="text-foreground rounded-lg"
                  itemClasses={itemClasses}
                  style={{
                    backgroundColor: "rgba(236, 247, 255, 0.5)",
                    // opacity: 1,
                    // color: "black !important",
                    // opacity: 4,
                  }}
                >
                  <AccordionItem
                    key="1"
                    aria-label="Other For You"
                    title="Other For You"
                    className="p-0 m-0"
                  >
                    <ul className="">
                      <li className="p-0 m-0">
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
                              Grocery
                            </p>
                          </div>
                          <div>
                            <Checkbox
                              className="m-0 p-0"
                              defaultSelected
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
                              Home
                            </p>
                          </div>
                          <div>
                            <Checkbox
                              className="m-0 p-0"
                              defaultSelected
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
                              Electronics
                            </p>
                          </div>
                          <div>
                            <Checkbox
                              className="m-0 p-0"
                              defaultSelected
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
              <div
                style={{ backgroundColor: "#ffffff80" }}
                className="rounded-lg"
              >
                {" "}
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
                        Cash on Delivery
                      </p>
                    )}
                    <Switch
                      color="secondary"
                      size="md"
                      defaultSelected
                      classNames={{
                        wrapper: "p-0 h-3 w-9   overflow-visible",
                        thumb: cn(
                          "w-5 h-5  shadow-lg",
                          "group-data-[hover=true]:border-secondary",
                          //selected
                          "group-data-[selected=true]:ml-4  bg-secondary",

                          // pressed
                          "group-data-[pressed=true]:w-7",
                          "group-data-[selected]:group-data-[pressed]:ml-4"
                        ),
                      }}
                      aria-label="Automatic updates"
                    />
                  </div>
                </Link>
              </div>
              <div
                style={{ backgroundColor: "#ffffff80" }}
                className="rounded-lg"
              >
                {" "}
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
                        Pre Booking
                      </p>
                    )}
                    <Switch
                      color="secondary"
                      size="md"
                      defaultSelected
                      classNames={{
                        wrapper: "p-0 h-3 w-9   overflow-visible",
                        thumb: cn(
                          "w-5 h-5  shadow-lg",
                          "group-data-[hover=true]:border-secondary",
                          //selected
                          "group-data-[selected=true]:ml-4  bg-secondary",

                          // pressed
                          "group-data-[pressed=true]:w-7",
                          "group-data-[selected]:group-data-[pressed]:ml-4"
                        ),
                      }}
                      aria-label="Automatic updates"
                    />
                  </div>
                </Link>
              </div>
              <div
                style={{ backgroundColor: "#ffffff80" }}
                className="rounded-lg"
              >
                {" "}
                <Link
                  to="#"
                  className="my-3 p-2 text-sm flex items-center text-gray-900 rounded-lg dark:text-white "
                >
                  <div className="flex justify-between w-full items-center">
                    {menuToggle ? (
                      <span>
                        <FormeIcon />
                      </span>
                    ) : (
                      <p className="text-black text-sm font-normal">
                        Open Shop
                      </p>
                    )}
                    <Switch
                      color="secondary"
                      size="md"
                      defaultSelected
                      classNames={{
                        wrapper: "p-0 h-3 w-9   overflow-visible",
                        thumb: cn(
                          "w-5 h-5  shadow-lg",
                          "group-data-[hover=true]:border-secondary",
                          //selected
                          "group-data-[selected=true]:ml-4  bg-secondary",

                          // pressed
                          "group-data-[pressed=true]:w-7",
                          "group-data-[selected]:group-data-[pressed]:ml-4"
                        ),
                      }}
                      aria-label="Automatic updates"
                    />
                  </div>
                </Link>
              </div>
              <div
                style={{ backgroundColor: "#ffffff80" }}
                className="rounded-lg"
              >
                <Link
                  to="#"
                  className="my-3 p-2 text-sm flex items-center text-gray-900 rounded-lg dark:text-white "
                >
                  <div className="flex justify-between w-full items-center">
                    {menuToggle ? (
                      <span>
                        <FormeIcon />
                      </span>
                    ) : (
                      <p className="text-black text-sm font-normal">
                        Hospitals
                      </p>
                    )}
                    <Switch
                      color="secondary"
                      size="md"
                      defaultSelected
                      classNames={{
                        wrapper: "p-0 h-3 w-9   overflow-visible",
                        thumb: cn(
                          "w-5 h-5  shadow-lg",
                          "group-data-[hover=true]:border-secondary",
                          //selected
                          "group-data-[selected=true]:ml-4  bg-secondary",

                          // pressed
                          "group-data-[pressed=true]:w-7",
                          "group-data-[selected]:group-data-[pressed]:ml-4"
                        ),
                      }}
                      aria-label="Automatic updates"
                    />
                  </div>
                </Link>
              </div>
              <div
                style={{ backgroundColor: "#ffffff80" }}
                className="rounded-lg"
              >
                {" "}
                <Link
                  to="#"
                  className="my-3 p-2 text-sm flex items-center text-gray-900 rounded-lg dark:text-white "
                >
                  <div className="flex justify-between w-full items-center">
                    {menuToggle ? (
                      <span>
                        <FormeIcon />
                      </span>
                    ) : (
                      <p className="text-black text-sm font-normal">Hotels</p>
                    )}
                    <Switch
                      color="secondary"
                      size="md"
                      defaultSelected
                      classNames={{
                        wrapper: "p-0 h-3 w-9   overflow-visible",
                        thumb: cn(
                          "w-5 h-5  shadow-lg",
                          "group-data-[hover=true]:border-secondary",
                          //selected
                          "group-data-[selected=true]:ml-4  bg-secondary",

                          // pressed
                          "group-data-[pressed=true]:w-7",
                          "group-data-[selected]:group-data-[pressed]:ml-4"
                        ),
                      }}
                      aria-label="Automatic updates"
                    />
                  </div>
                </Link>
              </div>

              {/* <ul role="list" className="space-y-2 font-medium list-disc">
                {_nav?.map((result) =>
                  result?.menuType === "single" ? (
                    <li className="bg-white rounded-xl">
                      <Link
                        to="#"
                        className="mt-7 p-2 text-sm flex items-center text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                      >
                        <div className="flex justify-between w-full items-center">
                          {menuToggle ? (
                            <span>
                              <FormeIcon />
                            </span>
                          ) : (
                            <p>For Me</p>
                          )}
                          <Switch
                            color="secondary"
                            size="sm"
                            defaultSelected
                            classNames={{
                              wrapper: "p-0 h-3 w-9  border-1 overflow-visible",
                              thumb: cn(
                                "w-5 h-5 border-1 shadow-lg",
                                "group-data-[hover=true]:border-secondary",
                                //selected
                                "group-data-[selected=true]:ml-4  bg-secondary",

                                // pressed
                                "group-data-[pressed=true]:w-7",
                                "group-data-[selected]:group-data-[pressed]:ml-4"
                              ),
                            }}
                            aria-label="Automatic updates"
                          />
                        </div>
                      </Link>
                    </li>
                  ) : (
                    <li
                      className="rounded-xl hover:bg-gray-100"
                      style={{ backgroundColor: "var(--secondary-500)" }}
                    >
                      <Accordion
                        itemClasses={itemClasses}
                        className="customAccordion"
                      >
                        <AccordionItem
                          key="2"
                          aria-label="Accordion 1"
                          title={
                            <div className="flex justify-between">
                              {menuToggle ? (
                                <span>
                                  <IconHome />
                                </span>
                              ) : (
                                <p>For Me</p>
                              )}
                              <p className="rounded-full bg-secondary text-secondary border-1 px-1 py-0 leading-4 text-xs">
                                3
                              </p>
                            </div>
                          }
                          className="text-black"
                        >
                          <ul className="list-disc pl-10">
                            {result?.["menuItems"]?.map((subMenu) => (
                              <li className="flex justify-between pb-2.5">
                                <div>Grocery</div>
                                <Checkbox
                                  className="m-0 p-0"
                                  defaultSelected
                                  size="md"
                                  color="success"
                                ></Checkbox>
                              </li>
                            ))}
                          </ul>
                        </AccordionItem>
                      </Accordion>
                    </li>
                  )
                )}
              </ul> */}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};
