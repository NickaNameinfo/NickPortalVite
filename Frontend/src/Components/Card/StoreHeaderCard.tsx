import * as React from "react";
import "../style.scss";
import {
  IconCall,
  IconMap,
  IconMapRound,
  IconMinus,
  IconNext,
  IconPrev,
  IconShare2,
  IconStar,
  Iconwhatsup,
} from "../Icons";
import { Button, Image } from "@nextui-org/react";

export const StoreHeaderCard = () => {
  return (
    <div className="grid xm:grid-cols-1 mm:grid-cols-1  sm:grid-cols-1 ml:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-3 4xl:grid-cols-3  StorecardHeader  mb-2">
      <div className="grid xm:grid-cols-3">
        <div className="xm:p-2  items-center flex justify-center">
          <Image
            isZoomed
            alt="Here no Image"
            className="w-full object-cover max-h-[85px]"
            src="https://nextui-docs-v2.vercel.app/images/album-cover.png"
          />
        </div>
        <div className="col-span-2">
          <div className="xm:mt-1 mm:mt-2 maincolor text-sm font-semibold items-center">
            Lorem dolor Samz..
          </div>
          <div className="flex items-center">
            <IconStar fill="#FF9900" />
            <div className="textColortimingColor text-sm font-normal ms-2">
              4:2
            </div>
          </div>
          <div className="textColortimingColor flex items-center lg:text-sm">
            <div className="lg:text-sm mm:text-sm ml:text-sm xm:text-xs xm:font-normal mm:font-normal">
              Open :
            </div>
            <div className="ms-1 xm:text-xs xm:font-normal">
              09:30am-10:00pm
            </div>
          </div>
          <div className="textColortimingColor lg:mt-0.5 text-sm font-normal  flex items-center">
            <div> Products :</div>
            <div className="ms-1">150</div>
          </div>
        </div>
        <div></div>
      </div>
      <div className="md:order-3 "></div>
      <div className="xl:order-3 2xl:order-3 3xl:order-3  flex w-full items-center justify-between px-2 md:pb-2 xm:pb-2 mm:pb-2 ml:pb-2 sm:pb-2 lg:pb-2">
        <div className="pe-2 w-8/12 flex items-center justify-between">
          <div className="flex items-center justify-around ">
            <Button
              radius="full"
              variant="shadow"
              isIconOnly
              aria-label="Like"
              className="Iconwhatsup ml:min-w-unit-8 ml:w-unit-8 ml:h-unit-8 mm:min-w-unit-8 mm:w-unit-8 mm:h-unit-8 xm:min-w-unit-6 xm:w-unit-6 xm:h-unit-6"
              size="md"
            >
              <Iconwhatsup
                fill="#FFFFFF"
                width="20"
                height="22"
                className="cursor-pointer ml:h-[16px] ml:w-[18px] xm:h-[12px] xm:w-[16px]"
              />
            </Button>
          </div>
          <div className="flex items-center justify-around">
            <Button
              radius="full"
              variant="shadow"
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
          </div>
          <div className="flex items-center justify-around">
            <Button
              radius="full"
              variant="shadow"
              isIconOnly
              aria-label="Like"
              className="Iconlocation ml:min-w-unit-8 ml:w-unit-8 ml:h-unit-8 mm:min-w-unit-8 mm:w-unit-8 mm:h-unit-8 xm:min-w-unit-6 xm:w-unit-6 xm:h-unit-6"
              size="md"
            >
              <IconMap
                fill="#FFFFFF"
                width="20"
                height="22"
                className="cursor-pointer ml:h-[16px] ml:w-[18px] xm:h-[12px] xm:w-[16px]"
              />
            </Button>
          </div>
          <div className="flex items-center justify-around">
            <Button
              radius="full"
              variant="shadow"
              isIconOnly
              aria-label="Like"
              size="md"
              className="Iconweb ml:min-w-unit-8 ml:w-unit-8 ml:h-unit-8 mm:min-w-unit-8 mm:w-unit-8 mm:h-unit-8 xm:min-w-unit-6 xm:w-unit-6 xm:h-unit-6"
            >
              <IconMapRound
                fill="#FFFFFF"
                width="20"
                height="22"
                className="cursor-pointer ml:h-[16px] ml:w-[18px] xm:h-[12px] xm:w-[16px]"
              />
            </Button>
          </div>
          <div className="flex items-center justify-around">
            <Button
              radius="full"
              variant="shadow"
              isIconOnly
              aria-label="Like"
              className="IconShare ml:min-w-unit-8 ml:w-unit-8 ml:h-unit-8 mm:min-w-unit-8 mm:w-unit-8 mm:h-unit-8 xm:min-w-unit-6 xm:w-unit-6 xm:h-unit-6"
              size="md"
            >
              <IconShare2
                fill="#FFFFFF"
                width="20"
                height="22"
                className="cursor-pointer ml:h-[16px] ml:w-[18px] xm:h-[12px] xm:w-[16px]"
              />
            </Button>
          </div>
        </div>
        <div className="w-4/12 items-center justify-between flex  ">
          <div className="w-full items-center justify-between Boxshadow rounded-xl xm:min-h-[30px] mm:min-h-[35px] ml:min-h-[35px] lg:min-h-[45px] xl:min-h-[45px] 2xl:min-h-[45px] 3x l:min-h-[45px] flex ">
            <div className="size-1/4 flex items-center justify-end">
              <Button
                radius="full"
                isIconOnly
                aria-label="Like"
                size="md"
                className="bgnone ml:min-w-unit-8 ml:w-unit-8 ml:h-unit-8 mm:min-w-unit-8 mm:w-unit-8 mm:h-unit-8 xm:min-w-unit-6 xm:w-unit-6 xm:h-unit-6"
              >
                <IconMinus
                  fill="#6942CB"
                  width="23px"
                  height="5px"
                  className="cursor-pointer ml:h-[16px] ml:w-[18px] xm:h-[12px] xm:w-[16px]"
                />
              </Button>
            </div>
            <div className="h-4/6 w-0.5 Divider cursor-pointer ">|</div>
            <div className="size-3/4 flex items-center justify-end">
              <Button
                radius="full"
                isIconOnly
                aria-label="Like"
                size="md"
                className="bgnone ml:min-w-unit-8 ml:w-unit-8 ml:h-unit-8 mm:min-w-unit-8 mm:w-unit-8 mm:h-unit-8 xm:min-w-unit-6 xm:w-unit-6 xm:h-unit-6"
              >
                <IconPrev
                  fill="#636060"
                  width="21px"
                  height="18px"
                  className="cursor-pointer ml:h-[16px] ml:w-[18px] xm:h-[12px] xm:w-[16px]"
                />
              </Button>

              <Button
                radius="full"
                isIconOnly
                aria-label="Like"
                size="md"
                className="bgnone flex mm:justify-start ml:justify-center ml:min-w-unit-8 ml:w-unit-8 ml:h-unit-8 mm:min-w-unit-8 mm:w-unit-8 mm:h-unit-8 xm:min-w-unit-6 xm:w-unit-6 xm:h-unit-6"
              >
                <IconNext
                  fill="#4C86F9"
                  width="21px"
                  height="18px"
                  className="cursor-pointer ml:h-[16px] ml:w-[16px] xm:h-[12px] xm:w-[16px]"
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StoreHeaderCard;
