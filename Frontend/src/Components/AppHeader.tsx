import {
  Avatar,
  Button,
  Input,
  Tab,
  Tabs,
  Tooltip,
  useDisclosure,
  User,
} from "@nextui-org/react";
import * as React from "react";
import "./style.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Arrowright,
  IconCall,
  IconHome,
  IconInfo,
  IconMap,
  IconNext,
  IconPrev,
  IconProfile,
  Iconwhatsup,
  SearchIcon,
} from "./Icons";
import { NavHeaderSearchIcon, NavSearchIcon } from "../Icons";
import { InfoCard } from "./Card/InfoCard";
import Login from "../views/pages/login/Login";
import { useGetCategoryQuery } from "../views/pages/Category/Service.mjs";
import { useAppDispatch, useAppSelector } from "./Common/hooks";
import {
  onGlobalCategorySearch,
  onSearchGlobal,
  onUpdateOpenStore,
  onUpdateSidebarExpand,
} from "../Components/Common/globalSlice";
export const AppHeader = () => {
  const location = useLocation();
  const currentloginDetails = useAppSelector(
    (state) => state.globalConfig.currentloginDetails
  );
  const currLocation = location?.pathname?.split("/");
  const isSideBarExpand = useAppSelector(
    (state) => state.globalConfig.isSideBarExpand
  );
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [startIndex, setStartIndex] = React.useState(0);
  const [sliderLabel, setSliderLabel] = React.useState([]);
  const [searchValues, setSearchValues] = React.useState(null);
  const { data: category } = useGetCategoryQuery();
  const dispatch = useAppDispatch();

  const itemsPerPage = 12;
  React.useEffect(() => {
    if (category?.data) {
      const labels = category.data.map((item) => item);
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

  const globalCategorySearch = useAppSelector(
    (state) => state.globalConfig.globalCategorySearch
  );

  console.log(globalCategorySearch, "globalCategorySearch790");

  const handleNext = () => {
    setStartIndex((prevIndex) =>
      Math.min(prevIndex + 1, sliderLabel?.length - itemsPerPage)
    );
  };

  const onSearchByCategory = (id) => {
    dispatch(onSearchGlobal(null));
    dispatch(onGlobalCategorySearch(id));
    dispatch(onUpdateOpenStore(false));
  };

  const onSearch = () => {
    dispatch(onSearchGlobal(searchValues));
    dispatch(onUpdateOpenStore(false));
  };

  return (
    <>
      <div className="flex flex-wrap md:flex-nowrap justify-between navBarStyle gap-4 items-center p-3">
        {/* Left Section */}
        <div className="flex w-full items-center md:w-1/3">
          {isSideBarExpand && (
            <Button
              isIconOnly
              color="primary"
              className="hidden bg-white mx-2 md:flex"
              aria-label="Home"
              onClick={() => dispatch(onUpdateSidebarExpand(false))}
            >
              <Arrowright height="16px" width="16px" />
            </Button>
          )}
          <Button
            isIconOnly
            color="primary"
            className="bg-white mx-2 md:hidden"
            aria-label="Home"
            onClick={() => dispatch(onUpdateSidebarExpand(!isSideBarExpand))}
          >
            <Arrowright height="16px" width="16px" />
          </Button>

          <Link to={"/"}>
            <Button
              isIconOnly
              color="primary"
              className="hidden bg-white mx-2 md:flex"
              aria-label="Home"
            >
              <IconHome height="16px" width="16px" />
            </Button>
          </Link>
          <Input
            className="w-full md:w-[280px] md:mt-0"
            radius="lg"
            size="md"
            isClearable
            placeholder="Search Here..."
            onChange={(e) => setSearchValues(e.target.value)}
            onClear={() => {
              dispatch(onSearchGlobal(null));
              setSearchValues(null);
            }}
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
          <Button
            className="ml-2 md:flex bg-[#ffffff3b] items-cente"
            onClick={() => onSearch()}
          >
            <SearchIcon color="blue" />
          </Button>
        </div>

        {/* Right Section */}
        <div className="flex flex-wrap md:flex-nowrap w-full md:w-2/3 justify-end">
          {/* Navigation Buttons */}
          <div className="flex mx-auto md:mx-0">
            {[
              { name: "Store View", key: "" },
              { name: "Product View", key: "ProductView" },
              { name: "Vendor View", key: "VendorView" },
              { name: "Map View", key: "MapView" },
            ].map((view, index) => (
              <div>
                <Button
                  key={index}
                  color="primary"
                  className={`mx-1 IconCalls ${
                    currLocation[1] === view?.key
                      ? ""
                      : "text-slate-400 bg-white"
                  }`}
                  onClick={() => navigate(`/${view?.key}`)}
                >
                  <span className="hidden sm:block">{view?.name}</span>
                  <span className="block md:hidden">
                    <IconHome />
                  </span>
                  {currLocation[1] === view?.key && (
                    <div className="justify-center">
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
                </Button>
              </div>
            ))}
          </div>

          {/* User Info */}
          <div className="hidden md:flex items-center mt-3 md:mt-0">
            <Button
              isIconOnly
              color="warning"
              className="bg-warning-900"
              onPress={() => onOpen()}
            >
              <IconInfo />
            </Button>
            <div className="ml-3">
              {!currentloginDetails?.data?.email ? (
                <Login />
              ) : (
                <User
                  name={currentloginDetails?.data?.name}
                  avatarProps={{
                    src: "https://avatars.githubusercontent.com/u/30373425?v=4",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="slider-wrapper w-full overflow-hidden">
        <div className="flex items-center justify-between px-4 my-2">
          <Button
            isIconOnly
            className={`Iconwhatsup w-7 min-w-7 h-7 ${
              startIndex === 0 ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            style={{ backgroundColor: "#0000004a" }}
            onClick={handlePrev}
            disabled={startIndex === 0}
          >
            <IconPrev fill="#ffffffcc" width="12px" height="12px" />
          </Button>
          <div className="slider-container custom-scrollbar">
            {displayedLabels?.map((item, index) => (
              <Button
                key={index}
                onClick={() => {
                  if (globalCategorySearch) {
                    dispatch(onGlobalCategorySearch(null));
                  } else {
                    onSearchByCategory(item?.id);
                  }
                }}
                className="mx-2 font-medium text-sm w-auto h-10 text-black"
                style={{
                  backgroundColor:
                    globalCategorySearch === item?.id ? "#f6bc00" : "#ffffff80",
                  borderRadius: "14px",
                }}
                size="sm"
              >
                {item?.name}
              </Button>
            ))}
          </div>
          <Button
            radius="sm"
            isIconOnly
            style={{ backgroundColor: "#0000004a" }}
            onClick={handleNext}
            disabled={startIndex + itemsPerPage >= sliderLabel.length}
            className={`Iconwhatsup w-7 min-w-7 h-7 ${
              startIndex + itemsPerPage >= sliderLabel?.length
                ? "cursor-not-allowed"
                : "cursor-pointer "
            }`}
          >
            <IconNext fill="#ffffffcc" width="12px" height="12px" />
          </Button>
        </div>
      </div>
    </>
  );
};
