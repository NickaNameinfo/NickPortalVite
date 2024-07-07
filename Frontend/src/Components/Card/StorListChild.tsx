import * as React from "react";
import "../style.scss";
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  CardFooter,
  Divider,
} from "@nextui-org/react";
import {
  IconCall,
  IconMap,
  IconMapRound,
  IconStar,
  IconstoreCardNext,
  Iconwhatsup,
} from "../Icons";
export const StoreListChild = () => {
  return (
    <Card shadow="md" className="max-w-[500px] bg-white px-3">
      <CardHeader className="py-3 px-0 flex items-center justify-center text-black font-medium text-base">
        Store List
      </CardHeader>
      <Divider className="storeListDivider" />
      <CardBody className="overflow-visible pt-2 pb-3.5 px-0">
        <div className="flex">
          <div className="col-span-5">
            <Image
              isZoomed
              shadow="md"
              width="100%"
              radius="lg"
              className="w-full object-cover min-h-[170px]"
              alt="Card background"
              src="https://nextui.org/images/hero-card-complete.jpeg"
            />
          </div>
          <div className="flex">
            <h2 className="font-medium text-sm TextMaincolor">Open :</h2>
            <p className="font-normal text-xs StortimingColor tracking-tight mt-1">
              09: 30am-10:00pm
            </p>
            <div className="flex items-center ">
              <p className="mt-1 ">
                <IconStar fill="#FF9900" />
              </p>
              <p className="font-normal text-sm mt-1 ps-2 StortimingColor">
                4.3
              </p>
            </div>
            <div className="flex flex-row">
              <p className="flex mt-1 justify-between basis-9/12 pe-2 items-center">
                <p className="cursor-pointer">
                  <Iconwhatsup fill="#6942CB" />
                </p>
                <p className="cursor-pointer">
                  <IconCall fill="#6942CB" />
                </p>
                <p className="cursor-pointer">
                  <IconMap fill="#6942CB" />
                </p>
                <p className="cursor-pointer">
                  <IconMapRound fill="#6942CB" />
                </p>
              </p>

              <div className="mt-1 basis-3/12 justify-center flex">
                <div className="iconbox flex items-center justify-center cursor-pointer">
                  <IconstoreCardNext fill="#6942CB" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>

      {/* <CardFooter className="p-0">
        <div className="w-full flex justify-between ps-2 pe-1 pb-3">
          <p className=" font-normal text-sm  TextMaincolor ">Products : 150</p>
          <p className=" font-normal text-sm  TextMaincolor ">
            Near By : 15 Km
          </p>
        </div>
      </CardFooter> */}
    </Card>
  );
};
export default StoreListChild;
