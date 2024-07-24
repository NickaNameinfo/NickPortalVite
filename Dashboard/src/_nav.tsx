import { IconHome } from "./Components/Icons";

export const _nav = [
  {
    menuType: "multiple",
    name: "Vendor",
    key: "Vendor",
    link: "/",
    icons: <IconHome />,
    menuItems: [
      {
        menuType: "single",
        name: "Add",
        key: "Add",
        link: "/Vendors/Add",
        icons: <IconHome />,
      },
      {
        menuType: "single",
        name: "List",
        key: "List",
        link: "/Vendors/List",
        icons: <IconHome />,
      },
      {
        menuType: "single",
        name: "Stock",
        key: "Stock",
        link: "/AddStock",
        icons: <IconHome />,
      },
    ],
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
        link: "/CategoriesAdd",
        icons: <IconHome />,
      },
    ],
  },
  {
    menuType: "multiple",
    name: "Products",
    key: "Products",
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
    menuType: "multiple",
    name: "Stores",
    key: "Stores",
    link: "/",
    icons: <IconHome />,
    menuItems: [
      {
        menuType: "single",
        name: "Add",
        key: "Add",
        link: "/Stores/Add",
        icons: <IconHome />,
      },
      {
        menuType: "single",
        name: "List",
        key: "List",
        link: "/Stores/List",
        icons: <IconHome />,
      },
    ],
  },
  {
    menuType: "single",
    name: "Customer",
    key: "Customer",
    link: "/",
    icons: <IconHome />,
  },
  {
    menuType: "multiple",
    name: "Requests",
    key: "Requests",
    link: "/",
    icons: <IconHome />,
    menuItems: [
      {
        menuType: "single",
        name: "Stores",
        key: "Stores",
        link: "/",
        icons: <IconHome />,
      },
      {
        menuType: "single",
        name: "Vendors",
        key: "Vendors",
        link: "/",
        icons: <IconHome />,
      },
      {
        menuType: "single",
        name: "Customers",
        key: "Customers",
        link: "/",
        icons: <IconHome />,
      },
    ],
  },
  {
    menuType: "multiple",
    name: "Orders",
    key: "Orders",
    link: "/",
    icons: <IconHome />,
    menuItems: [
      {
        menuType: "single",
        name: "Stores",
        key: "Stores",
        link: "/",
        icons: <IconHome />,
      },
      {
        menuType: "single",
        name: "Customers",
        key: "Customers",
        link: "/",
        icons: <IconHome />,
      },
    ],
  },
  {
    menuType: "multiple",
    name: "Transaction",
    key: "Transaction",
    link: "/",
    icons: <IconHome />,
    menuItems: [
      {
        menuType: "single",
        name: "Stores",
        key: "Stores",
        link: "/",
        icons: <IconHome />,
      },
      {
        menuType: "single",
        name: "Vendors",
        key: "Vendors",
        link: "/",
        icons: <IconHome />,
      },
      {
        menuType: "single",
        name: "Customers",
        key: "Customers",
        link: "/",
        icons: <IconHome />,
      },
    ],
  },
];
