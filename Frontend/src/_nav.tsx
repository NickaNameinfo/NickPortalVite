import { IconHome } from "./Components/Icons";

export const _nav = [
  {
    menuType: "single",
    name: "For Me",
    key: "For Me",
    link: "/",
    icons: <IconHome />,
  },
  {
    menuType: "single",
    name: "Within 5Km",
    key: "Within 5Km",
    link: "/",
    icons: <IconHome />,
  },
  {
    menuType: "multiple",
    name: "Categories",
    key: "Categories",
    link: "/",
    icons: <IconHome />,
    menuItems: [
      {
        menuType: "single",
        name: "Add",
        key: "Add",
        link: "/AddProducts",
        icons: <IconHome />,
      },
      {
        menuType: "single",
        name: "List",
        key: "List",
        link: "/ProductsList",
        icons: <IconHome />,
      },
    ],
  },
  {
    menuType: "single",
    name: "Other For You",
    key: "Other For You",
    link: "/",
    icons: <IconHome />,
  },
  {
    menuType: "single",
    name: "Cash on Delivery",
    key: "Cash on Delivery",
    link: "/",
    icons: <IconHome />,
  },
  {
    menuType: "single",
    name: "Pre Booking",
    key: "Pre Booking",
    link: "/",
    icons: <IconHome />,
  },
  {
    menuType: "single",
    name: "Open Shop",
    key: "Open Shop",
    link: "/",
    icons: <IconHome />,
  },
  {
    menuType: "single",
    name: "Hospitals",
    key: "Hospitals",
    link: "/",
    icons: <IconHome />,
  },
  {
    menuType: "single",
    name: "Hotels",
    key: "Hotels",
    link: "/",
    icons: <IconHome />,
  },
];
