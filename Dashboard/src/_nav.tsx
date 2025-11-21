import { IconHome } from "./Components/Icons";
import { getCookie } from "../src/JsFiles/CommonFunction.mjs";
// Assuming getCookie is imported correctly
const tempRole = getCookie("role");
export const _nav = [
  ...(tempRole === "0"
    ? [
        {
          menuType: "single",
          name: "Vendors",
          key: "Vendors",
          link: "/Vendors/Products",
          icons: <IconHome />,
        },
      ]
    : []),
  ...(tempRole === "2" || tempRole === "1" || tempRole === "0"
    ? [
        {
          menuType: tempRole === "2" ? "single" : "multiple",
          name: tempRole === "2" ? "Profile" : "Vendor",
          key: "Vendor",
          link: tempRole === "2" ? "/Vendors/Add" : "/",
          icons: <IconHome />,
          menuItems: [
            ...(tempRole === "2"
              ? [
                  {
                    menuType: "single",
                    name: "Add",
                    key: "Add",
                    link: "/Vendors/Add",
                    icons: <IconHome />,
                  },
                ]
              : []),
            {
              menuType: "single",
              name: "List",
              key: "List",
              link: "/Vendors/List",
              icons: <IconHome />,
            },
          ],
        },
      ]
    : []),
  ...(tempRole === "3" || tempRole === "1" || tempRole === "0"
    ? [
        {
          menuType: tempRole === "3" ? "single" : "multiple",
          name: tempRole === "3" ? "Profile" : "Stores",
          key: "Stores",
          link: "/Stores/Add",
          icons: <IconHome />,
          menuItems: [
            ...(tempRole === "3"
              ? [
                  {
                    menuType: "single",
                    name: "Add",
                    key: "Add",
                    link: "/Stores/Add",
                    icons: <IconHome />,
                  },
                ]
              : []),
            ...(tempRole === "0"
              ? [
                  {
                    menuType: "single",
                    name: "List",
                    key: "List",
                    link: "/Stores/List",
                    icons: <IconHome />,
                  },
                ]
              : []),
          ],
        },
      ]
    : []),
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
      // ...(tempRole !== "0"
      //   ? [
      //       {
      //         menuType: "single",
      //         name: "Add",
      //         key: "Add",
      //         link: "/AddProducts",
      //         icons: <IconHome />,
      //       },
      //     ]
      //   : []),
      ...(tempRole === "2"
        ? [
            {
              menuType: "single",
              name: "Stock",
              key: "Stock",
              link: "/AddStock",
              icons: <IconHome />,
            },
          ]
        : []),
      {
        menuType: "single",
        name: "List",
        key: "List",
        link: "/ProductsList",
        icons: <IconHome />,
      },
    ],
  },
  ...(tempRole === "0"
    ? [
        {
          menuType: "single",
          name: "Customer",
          key: "Customer",
          link: "/Customers",
          icons: <IconHome />,
        },
      ]
    : []),
  {
    menuType: "single",
    name: "Subscriptions",
    key: "Subscriptions",
    link: "/Subscriptions",
    icons: <IconHome />,
  },

  {
    menuType: "multiple",
    name: "Orders",
    key: "Orders",
    link: "/",
    icons: <IconHome />,
    menuItems: [
      // ...(tempRole !== "3"
      //   ? [
      //       {
      //         menuType: "single",
      //         name: "Stores",
      //         key: "Stores",
      //         link: "/",
      //         icons: <IconHome />,
      //       },
      //     ]
      //   : []),
      {
        menuType: "single",
        name: "Orders",
        key: "Orders",
        link: "/CustomersOrderList",
        icons: <IconHome />,
      },
      {
        menuType: "single",
        name: "Customized Orders",
        key: "Customizedorders",
        link: "/CustomizeOrderList",
        icons: <IconHome />,
      },
    ],
  },
  // {
  //   menuType: "multiple",
  //   name: "Requests",
  //   key: "Requests",
  //   link: "/",
  //   icons: <IconHome />,
  //   menuItems: [
  //     ...(tempRole !== "3"
  //       ? [
  //           {
  //             menuType: "single",
  //             name: "Stores",
  //             key: "Stores",
  //             link: "/",
  //             icons: <IconHome />,
  //           },
  //         ]
  //       : []),
  //     ...(tempRole === "0"
  //       ? [
  //           {
  //             menuType: "single",
  //             name: "Vendors",
  //             key: "Vendors",
  //             link: "/",
  //             icons: <IconHome />,
  //           },
  //         ]
  //       : []),
  //     {
  //       menuType: "single",
  //       name: "Customers",
  //       key: "Customers",
  //       link: "/",
  //       icons: <IconHome />,
  //     },
  //   ],
  // },
  // {
  //   menuType: "multiple",
  //   name: "Transaction",
  //   key: "Transaction",
  //   link: "/",
  //   icons: <IconHome />,
  //   menuItems: [
  //     ...(tempRole !== "3"
  //       ? [
  //           {
  //             menuType: "single",
  //             name: "Stores",
  //             key: "Stores",
  //             link: "/",
  //             icons: <IconHome />,
  //           },
  //         ]
  //       : []),
  //     ...(tempRole === "0"
  //       ? [
  //           {
  //             menuType: "single",
  //             name: "Vendors",
  //             key: "Vendors",
  //             link: "/",
  //             icons: <IconHome />,
  //           },
  //         ]
  //       : []),
  //     {
  //       menuType: "single",
  //       name: "Customers",
  //       key: "Customers",
  //       link: "/",
  //       icons: <IconHome />,
  //     },
  //   ],
  // },
  {
    menuType: "single",
    name: "LogOut",
    key: "LogOut",
    icons: <IconHome />,
  },
  // ...(tempRole === "3"
  //   ? [
  //       {
  //         menuType: "single",
  //         name: "YourOrders",
  //         key: "YourOrders",
  //         link: "/YourOrders",
  //         icons: <IconHome />,
  //       },
  //     ]
  //   : []),
  ...(tempRole === "0" || tempRole === "3"
    ? [
        {
          menuType: "single",
          name: "Billing (Only for subscribed stores)",
          key: "Billing",
          // link: "/Billing/List",
          icons: <IconHome />,
        },
      ]
    : []),
];
