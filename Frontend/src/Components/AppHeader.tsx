import {
  Button,
  Input,
  Tab,
  Tabs,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import * as React from "react";
import "./style.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  IconCall,
  IconHome,
  IconInfo,
  IconMap,
  IconNext,
  IconPrev,
  IconProfile,
  Iconwhatsup,
} from "./Icons";
import { NavHeaderSearchIcon, NavSearchIcon } from "../Icons";
import { InfoCard } from "./Card/InfoCard";
import Login from "../views/pages/login/Login";
import { useGetCategoryQuery } from "../views/pages/Category/Service.mjs";

export const AppHeader = () => {
  const location = useLocation();
  const currLocation = location?.pathname?.split("/");
  console.log(location, "123ccsdf", currLocation);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [startIndex, setStartIndex] = React.useState(0);
  const [sliderLabel, setSliderLabel] = React.useState([]);
  const { data: category } = useGetCategoryQuery();
  const itemsPerPage = 4;
  console.log(sliderLabel, "sliderLabel");

  React.useEffect(() => {
    if (category?.data) {
      const labels = category.data.map((item) => item?.name);
      setSliderLabel(labels);
    } else {
      setSliderLabel([]);
    }
  }, [category?.data]);

  const displayedLabels =
    sliderLabel?.slice(startIndex, startIndex + itemsPerPage) || [];

  const handlePrev = () => {
    setStartIndex(Math.max(startIndex - 1, 0));
  };

  const handleNext = () => {
    setStartIndex((prevIndex) =>
      Math.min(prevIndex + 1, sliderLabel?.length - itemsPerPage)
    );
  };

  return (
    <>
      <div className="flex justify-between navBarStyle gap-4 items-center p-3">
        <div className="flex w-1/3">
          <div className="text-center mx-2">
            <Link to={"/"}>
              <Button
                isIconOnly
                color="primary"
                className="bg-white"
                aria-label="Take a photo"
              >
                <IconHome height="16px" width="16px" />
              </Button>
            </Link>
          </div>
          {/* <div className="xm:hidden md:block w-webkit-fill-available"> */}
          <div className=" flex justify-start">
            <Input
              autoFocus={false}
              isClearable
              className="w-[280px]"
              radius="lg"
              size="md"
              type="Search"
              // autoFocus
              // color="default"
              variant="flat"
              placeholder="Search Here..."
              // style={{ backgroundColor:"whitesmoke"}}
              classNames={{
                label: " bg-[#ffffff3b] text-black/90 dark:text-black/90",
                input: [
                  "bg-[#ffffff3b]",
                  "text-black/90 dark:text-black/100",
                  "placeholder:text-black-100/30 dark:placeholder:text-black/10",
                  "font-normal",
                  "group-data-[has-value=true]:text-black/90",
                ],
                innerWrapper: " text-black/90 dark:text-black/70",
                inputWrapper: [
                  // "shadow-xl",
                  // "bg-default-200/190",
                  // "dark:bg-default/90",
                  // "backdrop-blur-xl",
                  "bg-[#ffffff3b]",
                  "dark:bg-[#ffffff3b]",
                  "backdrop-blur-xl",
                  "backdrop-saturate-50",
                  "hover:bg-[#ffffff3b]",
                  "hover:border-gray-600/10",
                  "focus-within:!bg-[#ffffff3b]",
                  "dark:hover:bg-[#ffffff3b]",
                  "dark:focus-within:!bg-[#ffffff3b]",
                  "!cursor-text",
                  "shadow-none",
                  "border-0",
                  "data-[hover=true]:bg-[#ffffff3b]",
                  "data-[hover=true]:bg-[#ffffff3b]",
                  "dark:data-[hover=true]:bg-[#ffffff3b]",
                ],
              }}
              startContent={
                <p className="me-1.5">
                  <NavHeaderSearchIcon />
                </p>
              }
            />
          </div>
        </div>

        <div className="w-2/3 flex justify-end ">
          <div className=" mx-3 flex  justify-around">
            <div className="mx-1">
              {/* <Tooltip
                showArrow={true}
                color="foreground"
                offset={3}
                content="Store View"
              > */}
              <Button
                onClick={() => navigate(`/`)}
                radius="lg"
                // variant="shadow"
                color="primary"
                aria-label="Like"
                className={`${
                  currLocation?.[1] === "" ? "" : "text-slate-400 bg-white"
                }  Iconwhatsup ml:min-w-unit-8 ml:w-unit-8 ml:h-unit-8 mm:min-w-unit-8 mm:w-unit-8 mm:h-unit-8 xm:min-w-unit-6 xm:w-unit-6 xm:h-unit-6`}
                size="md"
              >
                <div className="">
                  <div>Store View</div>
                  {currLocation?.[1] === "" && (
                    <div className="flex justify-center">
                      <svg
                        width="6"
                        height="6"
                        viewBox="0 0 6 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="3" cy="3" r="3" fill="white" />
                      </svg>
                    </div>
                  )}
                </div>
              </Button>
              {/* </Tooltip> */}
            </div>
            <div className="mx-1">
              <Button
                onClick={() => navigate(`/ProductView`)}
                radius="lg"
                color="primary"
                // variant="shadow"
                aria-label="Like"
                className={` ${
                  currLocation?.[1] === "ProductView"
                    ? ""
                    : "text-slate-400 bg-white"
                } IconCall ml:min-w-unit-8 ml:w-unit-8 ml:h-unit-8 mm:min-w-unit-8 mm:w-unit-8 mm:h-unit-8 xm:min-w-unit-6 xm:w-unit-6 xm:h-unit-6`}
                size="md"
              >
                <div className="">
                  <div>Product View</div>
                  {currLocation?.[1] === "ProductView" && (
                    <div className="flex justify-center">
                      <svg
                        width="6"
                        height="6"
                        viewBox="0 0 6 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="3" cy="3" r="3" fill="white" />
                      </svg>
                    </div>
                  )}
                </div>
              </Button>
            </div>
            <div className="mx-1">
              <Button
                onClick={() => navigate(`/VendoreView`)}
                radius="lg"
                color="primary"
                // variant="shadow"
                aria-label="Like"
                className={` ${
                  currLocation?.[1] === "VendoreView"
                    ? ""
                    : "text-slate-400 bg-white"
                } IconCall ml:min-w-unit-8 ml:w-unit-8 ml:h-unit-8 mm:min-w-unit-8 mm:w-unit-8 mm:h-unit-8 xm:min-w-unit-6 xm:w-unit-6 xm:h-unit-6`}
                size="md"
              >
                <div className="">
                  <div>Vendor View</div>
                  {currLocation?.[1] === "VendoreView" && (
                    <div className="flex justify-center">
                      <svg
                        width="6"
                        height="6"
                        viewBox="0 0 6 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="3" cy="3" r="3" fill="white" />
                      </svg>
                    </div>
                  )}
                </div>
              </Button>
            </div>
            <div className="ms-1">
              <Button
                onClick={() => navigate(`/MapView`)}
                radius="lg"
                color="primary"
                aria-label="Like"
                className={` ${
                  currLocation?.[1] === "MapView"
                    ? ""
                    : "text-slate-400 bg-white"
                } IconCall ml:min-w-unit-8 ml:w-unit-8 ml:h-unit-8 mm:min-w-unit-8 mm:w-unit-8 mm:h-unit-8 xm:min-w-unit-6 xm:w-unit-6 xm:h-unit-6`}
                size="md"
              >
                <div className="">
                  <div>Map View</div>
                  {currLocation?.[1] === "MapView" && (
                    <div className="flex justify-center">
                      <svg
                        width="6"
                        height="6"
                        viewBox="0 0 6 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="3" cy="3" r="3" fill="white" />
                      </svg>
                    </div>
                  )}
                </div>
              </Button>
            </div>
          </div>

          <div className="flex">
            <div>
              <Button
                onPress={() => onOpen()}
                isIconOnly
                color="warning"
                aria-label="Like"
                className="bg-warning-900"
              >
                <IconInfo />
              </Button>
            </div>
            <div className="ms-3">
              <Login />
            </div>
          </div>
        </div>
      </div>

      {/* //--------------------------- */}
      <div className="flex justify-between pt-3 pb-2">
        <div className="w-full">
          <div className="flex w-full justify-between">
            <Button
              radius="sm"
              // variant="shadow"
              isIconOnly
              aria-label="Previous"
              className={`Iconwhatsup ml:min-w-unit-8 ml:w-unit-8 ml:h-unit-8 mm:min-w-unit-8 mm:w-unit-8 mm:h-unit-8 xm:min-w-unit-6 xm:w-unit-6 xm:h-unit-6 ${
                startIndex === 0 ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={handlePrev}
              disabled={startIndex === 0}
            >
              <IconPrev
                fill="#FFFFFF"
                width="21px"
                height="18px"
                className="ml:h-[16px] ml:w-[18px] xm:h-[12px] xm:w-[16px]"
              />
            </Button>
            <div className="w-[calc(100%_-_16px)] overflow-hidden">
              <div
                className="slider-container"
                // style={{
                //   transform: `translateX(-${
                //     (startIndex * 100) / itemsPerPage
                //   }%)`,
                // }}
              >
                {displayedLabels.length > 0 &&
                  displayedLabels.map((item, index) => (
                    <div className="slider-item" key={index}>
                      <Button
                        size="sm"
                        className="font-medium text-sm w-11/12 h-10 bg-stripe-gradient"
                        radius="full"
                      >
                        {item}
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
            <Button
              radius="sm"
              isIconOnly
              aria-label="Next"
              className={`Iconwhatsup ml:min-w-unit-8 ml:w-unit-8 ml:h-unit-8 mm:min-w-unit-8 mm:w-unit-8 mm:h-unit-8 xm:min-w-unit-6 xm:w-unit-6 xm:h-unit-6 ${
                startIndex + itemsPerPage >= sliderLabel?.length
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              onClick={handleNext}
              disabled={startIndex + itemsPerPage >= sliderLabel?.length}
            >
              <IconNext
                fill="#FFFFFF"
                width="21px"
                height="18px"
                className="ml:h-[16px] ml:w-[16px] xm:h-[12px] xm:w-[16px]"
              />
            </Button>
          </div>
        </div>
      </div>

      <InfoCard isOpen={isOpen} onClose={onClose} />
    </>
  );
};
