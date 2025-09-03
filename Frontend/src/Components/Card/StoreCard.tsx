"use client";
import * as React from "react";
import "../style.scss";
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  CardFooter,
  Button,
} from "@nextui-org/react";
import {
  IconCall,
  IconMap,
  IconMapRound,
  IconStar,
  IconstoreCardNext,
  Iconwhatsup,
} from "../Icons";
import { infoData } from "../../configData";
import { useGetStoresProductByIDQuery } from "../../views/pages/Store/Service.mjs";
import { useAppSelector } from "../Common/hooks";
import { Link, useNavigate } from "react-router-dom";

export const StoreCard = ({ item = null, key = null }) => {
  // const { data, error, refetch } = useGetStoresProductByIDQuery(
  //   Number(item?.id)
  // );

  const navigate = useNavigate();

  return (
    <Card className="ps-1 Storecard p-0">
      <CardHeader className="pb-0 pt-3 ps-2 flex-col items-start ">
        <p className="p-0 font-semibold text-base TextMaincolor">
          {item?.storename}
        </p>
      </CardHeader>
      <CardBody className="overflow-visible pt-2 pb-3.5 ps-2 pe-2  ">
        <div className="grid grid-cols-12">
          <div
            className="col-span-5"
            onClick={() => navigate(`/Store/StoreDetails/${item?.id}`)}
          >
            <Image
              isZoomed
              shadow="md"
              width="100%"
              radius="lg"
              className="w-full object-cover h-[112px] cursor-pointer"
              alt="Card background"
              src={`${item?.storeImage}`}
            />
          </div>
          <div className="col-span-7 ps-3">
            <h2 className="font-medium text-sm TextMaincolor">Open :</h2>
            <p className="font-normal text-xs StortimingColor tracking-tight mt-2">
              {item?.openTime} AM : {item?.closeTime} PM
            </p>
            <div className="flex items-center mt-2">
              <p className="mt-1 ">
                <IconStar fill="#FF9900" />
              </p>
              <p className="font-normal text-sm mt-1 ps-2 StortimingColor">
                4.3
              </p>
            </div>
            <div className="flex flex-row ">
              <div className="flex  justify-between basis-9/12  items-center">
                <p className="cursor-pointer pe-1">
                  <Link
                    to={`https://api.whatsapp.com/send?phone=+91${item?.phone}&&text=Hello`}
                    target="_blank"
                  >
                    <Iconwhatsup fill="#6942CB" />
                  </Link>
                </p>
                <a href={`tel:+91${item?.phone}`}>
                  <Button
                    className="bgnone p-0 m-0"
                    radius="full"
                    isIconOnly
                    size="sm"
                  >
                    <IconCall fill="#6942CB" />
                  </Button>
                </a>
                <a href={item?.location} target="_blank">
                  <Button
                    className="bgnone p-0 m-0"
                    radius="full"
                    isIconOnly
                    size="sm"
                  >
                    <IconMap fill="#6942CB" />
                  </Button>
                </a>
                <Link to={item?.website} target="_blank">
                  <Button
                    className="bgnone p-0 m-0"
                    radius="full"
                    isIconOnly
                    size="sm"
                  >
                    <IconMapRound fill="#6942CB" />
                  </Button>
                </Link>
              </div>

              <div className="mt-0 basis-3/12 justify-end flex pe-0">
                <div className="iconbox flex items-center justify-center cursor-pointer">
                  <Button
                    radius="full"
                    isIconOnly
                    size="sm"
                    className="iconbox"
                    type="button"
                    onClick={() => navigate(`/Store/StoreDetails/${item?.id}`)}
                  >
                    <IconstoreCardNext fill="#6942CB" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>

      <CardFooter className="p-0 m-0">
        <div className="w-full px-2.5  pb-3 flex">
          <div className="font-normal text-sm  TextMaincolor w-6/12">
            Products : {item?.totalProducts}
          </div>
          <div className="font-normal text-sm  TextMaincolor w-6/12 justify-end flex">
            Near By :{" "}
            <small
              style={{
                color: "#999",
                paddingLeft: "10px",
              }}
            >
              Coming soon
            </small>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
export default StoreCard;
