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
import { Link, useNavigate, useParams } from "react-router-dom";
import { infoData } from "../../configData";
import {
  useGetStoresByIdQuery,
  useGetStoresProductByIDQuery,
  useGetStoresQuery,
} from "../../views/pages/Store/Service.mjs";
import { toast } from "react-toastify";
import { useAppSelector } from "../Common/hooks";
export const StoreHeaderCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, error, refetch } = useGetStoresByIdQuery(Number(id));
  const storeList = useAppSelector((state) => state.globalConfig.storeList);

  const {
    data: productData,
    error: productError,
    refetch: productRefetch,
  } = useGetStoresProductByIDQuery(Number(id));
  const notify = (value) => toast(value);

  const handleShare = () => {
    const url = window.location.href; // Get the current URL
    navigator.clipboard
      .writeText(url)
      .then(() => {
        notify("URL copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy the URL: ", err);
      });
  };

  return (
    <div className="mt-2 grid md:grid-cols-2 StorecardHeader mb-2">
    {/* Left Section */}
    <div className="flex">
      <div className="ps-2 items-center flex justify-start">
        <Image
          isZoomed
          alt="Here no Image"
          className="w-full object-cover max-h-[85px] p-1"
          src={`${infoData.baseApi}/${data?.data?.storeImage}`}
        />
      </div>
      <div className="px-3">
        <div className="xm:mt-1 mm:mt-2 maincolor text-sm font-semibold items-center">
          {data?.data?.storename}
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
            {data?.data?.openTime} AM - {data?.data?.closeTime} PM
          </div>
        </div>
        <div className="textColortimingColor lg:mt-0.5 text-sm font-normal flex items-center">
          <div> Products :</div>
          <div className="ms-1">
            {productData?.data?.length ? productData?.data?.length : 0}
          </div>
        </div>
      </div>
    </div>
  
    {/* Right Section */}
    <div className="xl:order-2 2xl:order-3 3xl:order-3 md:flex w-full items-center justify-between px-2 md:pb-2 xm:pb-2 mm:pb-2 ml:pb-2 sm:pb-2 lg:pb-2">
      <div className="w-full pe-2 md:w-8/12 flex items-center justify-between">
        {/* WhatsApp Button */}
        <div className="flex items-center justify-around my-2">
          <Link
            to={`https://api.whatsapp.com/send?phone=+91${data?.data?.phone}&&text=Hello`}
            target="_blank"
          >
            <Button
              radius="full"
              variant="shadow"
              isIconOnly
              aria-label="Like"
              className="Iconwhatsup md:w-10"
            >
              <Iconwhatsup
                fill="#FFFFFF"
                width="20"
                height="22"
                className="cursor-pointer"
              />
            </Button>
          </Link>
        </div>
  
        {/* Call Button */}
        <div className="flex items-center justify-around">
          <a href={`tel:+91${data?.data?.phone}`}>
            <Button
              radius="full"
              variant="shadow"
              isIconOnly
              aria-label="Like"
              className="IconCall md:w-10"
              size="md"
            >
              <IconCall
                fill="#FFFFFF"
                width="20"
                height="22"
                className="cursor-pointer"
              />
            </Button>
          </a>
        </div>
  
        {/* Location Button */}
        <div className="flex items-center justify-around">
          <a href={data?.data?.location} target="_blank">
            <Button
              radius="full"
              variant="shadow"
              isIconOnly
              aria-label="Like"
              className="Iconlocation md:w-10"
              size="md"
            >
              <IconMap
                fill="#FFFFFF"
                width="20"
                height="22"
                className="cursor-pointer"
              />
            </Button>
          </a>
        </div>
  
        {/* Website Button */}
        <div className="flex items-center justify-around">
          <Link to={data?.data?.website} target="_blank">
            <Button
              radius="full"
              variant="shadow"
              isIconOnly
              aria-label="Like"
              size="md"
              className="Iconweb md:w-10"
            >
              <IconMapRound
                fill="#FFFFFF"
                width="20"
                height="22"
                className="cursor-pointer"
              />
            </Button>
          </Link>
        </div>
  
        {/* Share Button */}
        <div className="flex items-center justify-around">
          <Button
            onClick={() => handleShare()}
            radius="full"
            variant="shadow"
            isIconOnly
            aria-label="Like"
            className="IconShare md:w-10"
            size="md"
          >
            <IconShare2
              fill="#FFFFFF"
              width="20"
              height="22"
              className="cursor-pointer"
            />
          </Button>
        </div>
      </div>
  
      {/* Navigation Buttons */}
      <div className="md:w-4/12 items-center justify-between flex">
        <div className="p-1 w-full items-center justify-between Boxshadow rounded-xl in-h-[45px] flex">
          <Button
            onClick={() => navigate(`/`)}
            radius="full"
            isIconOnly
            aria-label="Like"
            className="bgnone"
          >
            <IconMinus
              fill="#6942CB"
              width="18px"
              height="18px"
              className="cursor-pointer ml:h-[16px] ml:w-[18px] xm:h-[12px] xm:w-[16px]"
            />
          </Button>
  
          <Button
            onClick={() =>
              storeList.findIndex((store) => store.id === data?.data?.id) !== 0 &&
              storeList?.[
                Number(
                  storeList?.findIndex((store) => store.id === data?.data?.id)
                ) - 1
              ]?.status
                ? navigate(
                    `/Store/StoreDetails/${
                      storeList?.[
                        Number(
                          storeList?.findIndex(
                            (store) => store.id === data?.data?.id
                          )
                        ) - 1
                      ]?.id
                    }`
                  )
                : navigate(`/`)
            }
            radius="full"
            isIconOnly
            aria-label="Like"
            size="md"
            className={`bgnone ml:min-w-unit-8 ml:w-unit-8 ml:h-unit-8 mm:min-w-unit-8 mm:w-unit-8 mm:h-unit-8 xm:min-w-unit-6 xm:w-unit-6 xm:h-unit-6 ${
              !data ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <IconPrev
              fill="#636060"
              width="18px"
              height="18px"
              className="ml:h-[16px] ml:w-[18px] xm:h-[12px] xm:w-[16px]"
            />
          </Button>
  
          <Button
            onClick={() =>
              storeList?.[storeList?.length - 1]?.id !== data?.data?.id &&
              storeList?.[
                Number(
                  storeList?.findIndex((store) => store.id === data?.data?.id)
                ) + 1
              ]?.status
                ? navigate(
                    `/Store/StoreDetails/${
                      storeList?.[
                        Number(
                          storeList?.findIndex(
                            (store) => store.id === data?.data?.id
                          )
                        ) + 1
                      ]?.id
                    }`
                  )
                : navigate(`/`)
            }
            disabled={
              storeList?.[storeList?.length - 1]?.id !== data?.data?.id
                ? false
                : true
            }
            radius="full"
            isIconOnly
            aria-label="Like"
            size="md"
            className={`bgnone flex mm:justify-start ml:justify-center ml:min-w-unit-8 ml:w-unit-8 ml:h-unit-8 mm:min-w-unit-8 mm:w-unit-8 mm:h-unit-8 xm:min-w-unit-6 xm:w-unit-6 xm:h-unit-6 ${
              storeList?.[storeList?.length - 1]?.id !== data?.data?.id
                ? "cursor-pointer"
                : "cursor-not-allowed"
            }`}
          >
            <IconNext
              fill="#4C86F9"
              width="18px"
              height="18px"
              className="ml:h-[16px] ml:w-[16px] xm:h-[12px] xm:w-[16px]"
            />
          </Button>
        </div>
      </div>
    </div>
  </div>
  );
};
export default StoreHeaderCard;
