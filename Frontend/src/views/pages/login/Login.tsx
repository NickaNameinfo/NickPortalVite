import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
} from "@nextui-org/react";
import { NewPassword } from "./NewPassword";
import { Register } from "./Register";
import {
  EyeFilledIcon,
  EyeSlashFilledIcon,
  IconForgotSVG,
  IconLogin,
  IconLoginSVG,
  IconNewPasswordSVG,
  IconOTPSVG,
  IconProfile,
  IconRegisterSVG,
} from "../../../Icons";
import { Otp } from "./Otp";
import { ForgotPassword } from "./ForgotPassword";
const Login = () => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [isForgetPassword, setIsForgetPassword] = React.useState(false);
  const [isOTP, setIsOTP] = React.useState(false);
  const [isNewPassword, setIsNewPassword] = React.useState(false);
  const [isRegister, setIsRegister] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const onCloseModal = () => {
    onClose();
    setIsForgetPassword(false);
    setIsOTP(false);
    setIsNewPassword(false);
    setIsRegister(false);
  };
  const onClickLogin = () => {
    if (isForgetPassword) {
      setIsOTP(true);
      if (isOTP) {
        setIsNewPassword(true);
      }
    }
  };
  const onClickRegister = () => {
    setIsRegister(true);
  };

  return (
    <div>
      <Button
        isIconOnly
        color="primary"
        className="bg-primary-900"
        aria-label="Take a photo"
        onPress={onOpen}
      >
        <IconProfile />
      </Button>
      <Modal
        isDismissable={false}
        isOpen={isOpen}
        onOpenChange={onCloseModal}
        placement="top-center"
        size="lg"
        // closeButton={
        //   <>
        //     <IconCLose
        //       width={30}
        //       height={30}
        //       className={
        //         "p-2 cursor-pointer rounded-full IconCloseBtn absolute -top-3 -right-3"
        //       }
        //     />
        //   </>
        // }
      >
        <ModalContent className="p-0 m-0">
          {(onClose) => (
            <>
              <ModalHeader className="flex self-center flex-col gap-1 p-0 m-0">
                <div className="flex justify-center">
                  {isRegister ? (
                    <IconRegisterSVG width="150px" height="150px" />
                  ) : isNewPassword ? (
                    <IconNewPasswordSVG width="150px" height="150px" />
                  ) : isOTP ? (
                    <IconOTPSVG width="150px" height="150px" />
                  ) : isForgetPassword ? (
                    <IconForgotSVG width="150px" height="150px" />
                  ) : (
                    <IconLoginSVG width="150px" height="150px" />
                  )}
                </div>
                <div
                  className="self-center  font-bold text-2xl mt-0"
                  // style={{
                  //   fontFamily: "Helvetica Neue Bold",
                  // }}
                >
                  {isRegister
                    ? "Register"
                    : isNewPassword
                    ? "Create New Password"
                    : isOTP
                    ? "Enter OTP"
                    : isForgetPassword
                    ? "Forgot password"
                    : "Login"}
                </div>
              </ModalHeader>
              <ModalBody className="px-3 m-0">
                {isRegister ? (
                  <Register />
                ) : isNewPassword ? (
                  <NewPassword />
                ) : isOTP ? (
                  <Otp />
                ) : isForgetPassword ? (
                  <ForgotPassword />
                ) : (
                  <>
                    <div className="my-2">
                      <div className="flex justify-center mb-4">
                        <Input
                          className="max-w-md"
                          classNames={{
                            label: "text-black/50 dark:text-white/50",
                            input: [
                              "bg-transparent",
                              "text-black/90 dark:text-white/100",
                              "placeholder:text-default-100/50 dark:placeholder:text-white/10",
                            ],
                            innerWrapper: "bg-transparent",
                            inputWrapper: [
                              // "shadow-xl",
                              "bg-default-100/50",
                              "dark:bg-default/60",
                              "backdrop-blur-xl",
                              "backdrop-saturate-50",
                              "hover:bg-default-100/40",
                              "focus-within:!bg-default-50/10",
                              "dark:hover:bg-default/10",
                              "dark:focus-within:!bg-default/90",
                              "!cursor-text",
                            ],
                          }}
                          // isRequired

                          autoFocus
                          label="Enter Your Email Address"
                          labelPlacement="inside"
                          color="default"
                          variant="faded"
                          size="sm"
                        />
                      </div>
                      <div className="flex justify-center mt-3">
                        <Input
                          classNames={{
                            label: "text-black/50 dark:text-white/50",
                            input: [
                              "bg-transparent",
                              "text-black/90 dark:text-white/100",
                              "placeholder:text-default-100/50 dark:placeholder:text-white/10",
                            ],
                            innerWrapper: "bg-transparent",
                            inputWrapper: [
                              // "shadow-xl",
                              "bg-default-100/50",
                              "dark:bg-default/60",
                              "backdrop-blur-xl",
                              "backdrop-saturate-50",
                              "hover:bg-default-100/40",
                              "focus-within:!bg-default-50/10",
                              "dark:hover:bg-default/10",
                              "dark:focus-within:!bg-default/90",
                              "!cursor-text",
                            ],
                          }}
                          // isRequired
                          className="max-w-md"
                          autoFocus
                          label="Enter Your Password"
                          labelPlacement="inside"
                          color="default"
                          variant="faded"
                          size="sm"
                          endContent={
                            <button
                              className="focus:outline-none"
                              type="button"
                              onClick={toggleVisibility}
                            >
                              {isVisible ? (
                                <EyeSlashFilledIcon
                                  className="text-2xl text-default-400 pointer-events-none"
                                  fill="#8E99A4"
                                />
                              ) : (
                                <EyeFilledIcon
                                  className="text-2xl text-default-400 pointer-events-none"
                                  fill="#8E99A4"
                                />
                              )}
                            </button>
                          }
                          type={isVisible ? "text" : "password"}
                          // className="w-full"
                        />
                      </div>
                    </div>

                    <div className="w-full flex">
                      <div className="flex w-1/2 ps-4">
                        <Checkbox
                          className="justify-center flex"
                          style={{
                            color: "#A5A5A5",
                          }}
                          color="primary"
                          classNames={{
                            label: "text-small",
                          }}
                        >
                          Remember me
                        </Checkbox>
                      </div>
                      <div className="w-1/2 justify-end pe-5 flex ">
                        <Link
                          className="cursor-pointer p-0 m-0 #7358D7 max-w-md "
                          style={{
                            color: "#4C86F9",
                          }}
                          // color="foreground"
                          onPress={() => setIsForgetPassword(true)}
                          size="sm"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    </div>
                  </>
                )}

                <div className="w-full justify-center px-4">
                  <Button
                    // color=""
                    onPress={() => onClickLogin()}
                    size="md"
                    className="w-full  font-normal "
                    style={{
                      padding: 0,
                      margin: 0,
                      background: "#4C86F9",
                      color: "#FFFFFF",
                    }}
                  >
                    {isRegister
                      ? "Register"
                      : isForgetPassword
                      ? "SUBMIT"
                      : "LOGIN"}
                    <IconLogin fill="white" />
                  </Button>
                </div>
              </ModalBody>
              <ModalFooter className="justify-center p-0 m-0">
                <div className="flex items-center my-3">
                  <p
                    className="text-sm pe-2 Iconweb"
                    style={{
                      color: "#A5A5A5",
                    }}
                  >
                    {isRegister ? "Already have a member ?" : "Not A Member ? "}
                  </p>
                  <Link
                    className="cursor-pointer font-medium p-0 m-0"
                    style={{
                      color: "#4C86F9",
                    }}
                    onPress={() => onClickRegister()}
                    size="sm"
                  >
                    {isRegister ? "Login" : "Register Now"}
                  </Link>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Login;
