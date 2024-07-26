import { Button, Input, Tooltip, useDisclosure } from "@nextui-org/react";
import * as React from "react";
import "./style.scss";
import { Link } from "react-router-dom";
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
import { NavSearchIcon } from "../Icons";
import { InfoCard } from "./Card/InfoCard";
import Login from "../views/pages/login/Login";
import { useGetCategoryQuery } from "../views/pages/Category/Service.mjs";

export const AppHeader = () => {
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
        <div className="items-center flex justify-between w-webkit-fill-available">
          <div className="text-center">
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
          <div className="xm:hidden md:block w-webkit-fill-available">
            <Input
              isClearable
              radius="full"
              size="sm"
              variant="underlined"
              className="ms-2"
              classNames={
                {
                  // label: "text-white",
                  // input: [
                  //   "bg-transparent",
                  //   "text-white dark:text-white",
                  //   "text-white",
                  //   "placeholder:text-text-white dark:placeholder:text-",
                  // ],
                  // innerWrapper: "bg-transparent",
                  // inputWrapper: [
                  //   "shadow-xl",
                  //   "bg-blue-600",
                  //   "bg-blue-600",
                  //   "backdrop-blur-xl",
                  //   "backdrop-saturate-900",
                  //   "hover:bg-blue-600",
                  //   "hover:bg-blue-600",
                  //   "group-data-[focused=true]:bg-blue-600",
                  //   ":group-data-[focused=true]:bg-blue-600",
                  //   "!cursor-text",
                  // ],
                }
              }
              placeholder="Type to search..."
              startContent={
                <NavSearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
              }
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="md:hidden">
            <Button
              onPress={onOpen}
              isIconOnly
              color="warning"
              aria-label="Search"
              className="bg-warning-900"
            >
              <NavSearchIcon />
            </Button>
          </div>
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
      <div className="flex justify-between mt-2">
        <div className="w-3/12  justify-between flex overflow-auto ms-2 me-5">
          <div className="flex items-center justify-around">
            <Link to={"/"}>
              <Tooltip
                showArrow={false}
                color="primary"
                offset={3}
                content=" Store View"
              >
                <Button
                  radius="lg"
                  // variant="shadow"
                  isIconOnly
                  aria-label="Like"
                  className=" Iconwhatsup ml:min-w-unit-8 ml:w-unit-8 ml:h-unit-8 mm:min-w-unit-8 mm:w-unit-8 mm:h-unit-8 xm:min-w-unit-6 xm:w-unit-6 xm:h-unit-6"
                  size="md"
                >
                  <Iconwhatsup
                    fill="#FFFFFF"
                    width="20"
                    height="22"
                    className="cursor-pointer ml:h-[16px] ml:w-[18px] xm:h-[12px] xm:w-[16px]"
                  />
                </Button>
              </Tooltip>
            </Link>
          </div>
          <div className="flex items-center justify-around">
            <Link to={"/ProductView"}>
              <Tooltip
                showArrow={false}
                color="primary"
                offset={3}
                content="Product View"
              >
                <Button
                  radius="lg"
                  // variant="shadow"
                  isIconOnly
                  aria-label="Like"
                  className="IconCall ml:min-w-unit-8 ml:w-unit-8 ml:h-unit-8 mm:min-w-unit-8 mm:w-unit-8 mm:h-unit-8 xm:min-w-unit-6 xm:w-unit-6 xm:h-unit-6"
                  size="md"
                >
                  <IconCall
                    fill="#FFFFFF"
                    width="20"
                    height="22"
                    className="cursor-pointer ml:h-[16px] ml:w-[18px] xm:h-[12px] xm:w-[16px]"
                  />
                </Button>
              </Tooltip>
            </Link>
          </div>
          <div className="flex items-center justify-around">
            <Link to={"/VendoreView"}>
              <Tooltip
                showArrow={false}
                color="primary"
                offset={3}
                content="Vendor View"
              >
                <Button
                  radius="lg"
                  // variant="shadow"
                  isIconOnly
                  aria-label="Like"
                  className="Iconwhatsup  ml:min-w-unit-8 ml:w-unit-8 ml:h-unit-8 mm:min-w-unit-8 mm:w-unit-8 mm:h-unit-8 xm:min-w-unit-6 xm:w-unit-6 xm:h-unit-6"
                  size="md"
                >
                  <Iconwhatsup
                    fill="#FFFFFF"
                    width="20"
                    height="22"
                    className="cursor-pointer ml:h-[16px] ml:w-[18px] xm:h-[12px] xm:w-[16px]"
                  />
                </Button>
              </Tooltip>
            </Link>
          </div>
          <div className="flex items-center justify-around">
            <Link to={""}>
              <Tooltip
                showArrow={false}
                color="primary"
                offset={3}
                content="Map View"
              >
                <Button
                  radius="lg"
                  // color="primary"
                  // variant="shadow"
                  isIconOnly
                  aria-label="Like"
                  className=" ml:min-w-unit-8 ml:w-unit-8 ml:h-unit-8 mm:min-w-unit-8 mm:w-unit-8 mm:h-unit-8 xm:min-w-unit-6 xm:w-unit-6 xm:h-unit-6"
                  size="md"
                >
                  <IconMap
                    fill="#FFFFFF"
                    width="20"
                    height="22"
                    className="cursor-pointer ml:h-[16px] ml:w-[18px] xm:h-[12px] xm:w-[16px]"
                  />
                </Button>
              </Tooltip>
            </Link>
          </div>
        </div>

        <div className="w-9/12 ms-4 me-4">
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
                        className="font-medium text-sm w-11/12 h-10"
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
