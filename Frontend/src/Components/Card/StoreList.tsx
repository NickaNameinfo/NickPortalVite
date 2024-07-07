"use client";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Divider,
  Popover,
  Button,
  PopoverTrigger,
  PopoverContent,
  Input,
} from "@nextui-org/react";
import React from "react";
import { IconsEye } from "../Icons";

export const StoreList = (props: {
  isOpen?: boolean | undefined;
  onClose?: (() => void) | undefined;
}) => {
  const [isOpens, setIsOpens] = React.useState(false);
  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onClose={props.onClose}
        size={"sm"}
        backdrop="opaque"
      >
        <ModalContent className="px-5 pb-3">
          <>
            <ModalHeader className="py-3 px-0 flex items-center justify-center text-black font-medium text-base">
              Store List
            </ModalHeader>
            <Divider className="storeListDivider" />
            <ModalBody className="p-0 m-0 mt-1 w-full">
              <div className="flex items-center w-full  cursor-pointer">
                <Popover
                  placement="right"
                  className="ms-5"
                  isOpen={isOpens}
                  onOpenChange={(open) => setIsOpens(open)}
                >
                  <PopoverTrigger className="w-full">
                    <Button
                      className="bgnone p-0 m-0 text-small font-normal flex items-center justify-between"
                      isIconOnly
                      size="sm"
                    >
                      <p> Krishna Stores</p>
                      <p>
                        <IconsEye fill="#4C86F9" />
                      </p>
                    </Button>
                  </PopoverTrigger>
                  {isOpens ? (
                    <PopoverContent className="min-w-[290px]">
                      <div className="px-1  ">
                        <div className="text-small font-bold">Store Card</div>
                        <div className="text-tiny">
                          <Button>
                            Samz
                            <IconsEye fill="#49A84C" />
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  ) : (
                    false
                  )}
                </Popover>
              </div>

              <div className="flex items-center w-full  cursor-pointer">
                <Popover
                  placement="right"
                  className="ms-5"
                  isOpen={isOpens}
                  onOpenChange={(open) => setIsOpens(open)}
                >
                  <PopoverTrigger className="w-full">
                    <Button
                      className="bgnone p-0 m-0 text-small font-normal flex items-center justify-between"
                      isIconOnly
                      size="sm"
                    >
                      <p> Krishna Stores</p>
                      <p>
                        <IconsEye fill="#4C86F9" />
                      </p>
                    </Button>
                  </PopoverTrigger>
                  {isOpens ? (
                    <PopoverContent className="min-w-[290px]">
                      <div className="px-1  ">
                        <div className="text-small font-bold">Store Card</div>
                        <div className="text-tiny">
                          <Button>
                            Samz
                            <IconsEye fill="#49A84C" />
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  ) : (
                    false
                  )}
                </Popover>
              </div>
              {/* <div className="flex items-center w-full  cursor-pointer">
                <Popover placement="right" className="ms-5">
                  <PopoverTrigger className="w-full">
                    <Button
                      className="bgnone p-0 m-0 text-small font-normal flex items-center justify-between"
                      isIconOnly
                      size="sm"
                    >
                      <p> Krishna Stores</p>
                      <p>
                        <IconsEye fill="#4C86F9" />
                      </p>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="min-w-[290px]">
                    <div className="px-1  ">
                      <div className="text-small font-bold">Store Card</div>
                      <div className="text-tiny">
                        <Button>
                          Samz
                          <IconsEye fill="#49A84C" />
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center w-full  cursor-pointer">
                <Popover placement="right" className="ms-5">
                  <PopoverTrigger className="w-full">
                    <Button
                      className="bgnone p-0 m-0 text-small font-normal flex items-center justify-between"
                      isIconOnly
                      size="sm"
                    >
                      <p> Krishna Stores</p>
                      <p>
                        <IconsEye fill="#4C86F9" />
                      </p>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="min-w-[290px]">
                    <div className="px-1  ">
                      <div className="text-small font-bold">Store Card</div>
                      <div className="text-tiny">
                        <Button>
                          Samz
                          <IconsEye fill="#49A84C" />
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center w-full  cursor-pointer">
                <Popover placement="right" className="ms-5">
                  <PopoverTrigger className="w-full">
                    <Button
                      className="bgnone p-0 m-0 text-small font-normal flex items-center justify-between"
                      isIconOnly
                      size="sm"
                    >
                      <p> Krishna Stores</p>
                      <p>
                        <IconsEye fill="#4C86F9" />
                      </p>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="min-w-[290px]">
                    <div className="px-1  ">
                      <div className="text-small font-bold">Store Card</div>
                      <div className="text-tiny">
                        <Button>
                          Samz
                          <IconsEye fill="#49A84C" />
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center w-full  cursor-pointer">
                <Popover placement="right" className="ms-5">
                  <PopoverTrigger className="w-full">
                    <Button
                      className="bgnone p-0 m-0 text-small font-normal flex items-center justify-between"
                      isIconOnly
                      size="sm"
                    >
                      <p> Krishna Stores</p>
                      <p>
                        <IconsEye fill="#4C86F9" />
                      </p>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="min-w-[290px]">
                    <div className="px-1  ">
                      <div className="text-small font-bold">Store Card</div>
                      <div className="text-tiny">
                        <Button>
                          Samz
                          <IconsEye fill="#49A84C" />
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div> */}
            </ModalBody>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};
