import React from "react";
import { Button, useDisclosure, Checkbox, Link } from "@nextui-org/react";
import { IconLogin, IconLoginSVG, IconProfile } from "../../../Icons";
import InputNextUI from "../../../Components/Input/input";
import ModalUI from "../../../Components/Modal";
import { useDispatch } from "react-redux";
import { onOpenResigter } from "../../../Components/Common/globalSlice";
import { useAppSelector } from "../../../Components/Common/hooks";
import { Register } from "./Register";
const Login = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // set Login Values
  const [loginData, setLoginData] = React.useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = React.useState({
    email: "",
    password: "",
  });

  const isOpenRegister = useAppSelector(
    (state) => state.globalConfig.isOpenRegister
  );
  console.log(isOpenRegister, "panelReloadlknsdf");
  const onCloseModal = () => {
    onClose();
    setErrorMessage({
      email: "",
      password: "",
    });
  };
  const onClickLogin = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let flag1 = false;
    let flag2 = false;
    let flag3 = false;

    if (!loginData.email) {
      setErrorMessage((prev) => ({
        ...prev,
        email: "Please enter Email Address",
      }));
      flag1 = true;
    } else if (!emailRegex.test(loginData.email)) {
      setErrorMessage((prev) => ({
        ...prev,
        email: "Please enter a valid Email Address",
      }));
      flag2 = true;
    } else {
      setErrorMessage((prev) => ({
        ...prev,
        email: "",
      }));
    }

    if (!loginData.password) {
      setErrorMessage((prev) => ({
        ...prev,
        password: "Please enter Password",
      }));
      flag3 = true;
    } else {
      setErrorMessage((prev) => ({
        ...prev,
        password: "",
      }));
    }

    if (flag1 || flag2 || flag3) {
      return;
    } else {
      setErrorMessage({
        email: "",
        password: "",
      });
    }
  };

  const onClickRegister = () => {
    dispatch(onOpenResigter(true));
    onClose();
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

      <ModalUI
        isOpen={isOpen}
        onOpenChange={onCloseModal}
        heading={"Login"}
        headerIcon={<IconLoginSVG width="200px" height="155px" />}
        content={
          <div className="px-3 m-0">
            <div className="mt-2">
              <div className="flex justify-center mb-4">
                <InputNextUI
                  type="text"
                  label="Enter Your Email Address"
                  onChange={(value) => {
                    setLoginData((prev) => ({
                      ...prev,
                      email: value,
                    }));
                  }}
                  errorMessage={errorMessage?.email}
                />
              </div>
              <div className="flex justify-center  mt-3">
                <InputNextUI
                  type="password"
                  label="Enter Your Password"
                  onChange={(value) => {
                    setLoginData((prev) => ({
                      ...prev,
                      password: value,
                    }));
                  }}
                  errorMessage={errorMessage?.password}
                />
              </div>
            </div>

            <div className="w-full flex pt-5">
              <div className="flex w-1/2">
                <Checkbox
                  className="justify-center flex"
                  color="primary"
                  radius="sm"
                  classNames={{
                    label: ["text-small", "text-gray-400", "font-light"],
                    wrapper: ["before:border-1", "before:border-gray-300"],
                  }}
                >
                  Remember Me
                </Checkbox>
              </div>
              <div className="w-1/2 justify-end flex ">
                <Link
                  className="cursor-pointer p-0 m-0 #7358D7 max-w-md "
                  style={{
                    color: "#4C86F9",
                  }}
                  // color="foreground"
                  onPress={() => {}}
                  size="sm"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
            <div className="w-full justify-center pt-5">
              <Button
                onPress={() => onClickLogin()}
                size="sm"
                className="w-full  font-normal "
                style={{
                  padding: 0,
                  margin: 0,
                  background: "#4C86F9",
                  color: "#FFFFFF",
                }}
              >
                {"LOGIN"}
                <IconLogin fill="white" />
              </Button>
            </div>
          </div>
        }
        footerContent={
          <div className="w-full flex justify-center">
            <div className="flex items-center my-3">
              <p
                className="text-sm pe-2 Iconweb"
                style={{
                  color: "#A5A5A5",
                }}
              >
                {"Not A Member ? "}
              </p>
              <Link
                className="cursor-pointer font-medium p-0 m-0"
                style={{
                  color: "#4C86F9",
                }}
                onPress={() => onClickRegister()}
                size="sm"
              >
                {"Register Now"}
              </Link>
            </div>
          </div>
        }
      />
      {isOpenRegister && <Register />}

      {/* <Modal
        isDismissable={false}
        isOpen={isOpen}
        onOpenChange={onCloseModal}
        placement="top-center"
        size="sm"
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
                    <IconRegisterSVG width="140px" height="130px" />
                  ) : isNewPassword ? (
                    <IconNewPasswordSVG width="150px" height="150px" />
                  ) : isOTP ? (
                    <IconOTPSVG width="150px" height="150px" />
                  ) : isForgetPassword ? (
                    <IconForgotSVG width="150px" height="235px" />
                  ) : (
                    <IconLoginSVG width="150px" height="155px" />
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
                  <Register registration={registration}/>
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
                        <InputNextUI
                          type="text"
                          label="Enter Your Email Address"
                          onChange={(value) => {
                            console.log(value, "storename");
                          }}
                        />
                      </div>
                      <div className="flex justify-center  mt-3">
                        <InputNextUI
                          type="password"
                          label="Enter Your Password"
                          onChange={(value) => {
                            console.log(value, "storename");
                          }}
                        />
                      </div>
                    </div>

                    <div className="w-full flex">
                      <div className="flex w-1/2 ps-5">
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

                <div className="w-full justify-center px-5">
                  <Button
                    // color=""
                    onPress={() => onClickLogin()}
                    size="sm"
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
      </Modal> */}
    </div>
  );
};

export default Login;
