import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Image,
  Switch,
  cn,
} from "@nextui-org/react";
import * as React from "react";
import { IconHome } from "./Icons";
import { _nav } from "../_nav";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../utils/authUtils.mjs";
import { BuyCard } from "./Cards/BuyCard";
import { useAppSelector } from "../Common/hooks";
import { getCookie } from "../JsFiles/CommonFunction.mjs";
export const AppSidebar = () => {
  const [menuToggle, setMenuToggle] = React.useState(false);
  const [mobileExpand, setMobileExpand] = React.useState(false);

  const isOpenCartModal = useAppSelector(
    (state) => state.globalConfig.isOpenCartModal
  );
  
  const currentloginDetails = useAppSelector(
    (state) => state.globalConfig.currentloginDetails
  );
  
  const navigate = useNavigate();
  const location = useLocation();

  // Filter navigation items based on subscription validation and menu permissions
  const filteredNav = React.useMemo(() => {
    const currentRole = getCookie("role");
    const isSubUser = currentloginDetails?.data?.isSubUser || false;
    // Get menu permissions - works for both sub-users and regular store/vendor users
    // Check both menuPermissions object and data object directly (in case structure differs)
    const menuPermissions = currentloginDetails?.data?.menuPermissions || currentloginDetails?.data || {};

    // Helper function to check if a menu key is allowed
    // STRICT: Only allow if permission is explicitly set to true (handles both boolean and string "true")
    const isMenuAllowed = (menuKey: string): boolean => {
      // Check if permission exists and is explicitly true (handles boolean true or string "true")
      // If undefined, null, or false, deny access
      const permission = menuPermissions[menuKey];
      const allowed = permission === true || permission === "true" || permission === 1;
      
      // Debug logging (always log for troubleshooting Stores and other menus)
      if (menuKey === "Stores" || (currentRole === "2" || currentRole === "3")) {
        console.log(`[AppSidebar] Permission check for "${menuKey}":`, {
          permission,
          allowed,
          type: typeof permission,
          isSubUser,
          menuPermissions: menuPermissions,
        });
      }
      
      return allowed;
    };

    // Debug logging (always log for troubleshooting)
    if (currentRole === "2" || currentRole === "3") {
      console.log('[AppSidebar] Menu permissions navigation filter:', {
        isSubUser,
        currentRole,
        hasPermissions: !!menuPermissions && Object.keys(menuPermissions).length > 0,
        permissions: menuPermissions,
        permissionCount: Object.keys(menuPermissions).length,
        allMenuKeys: _nav.map(item => item.key),
        hasStoresInNav: _nav.some(item => item.key === "Stores"),
        currentloginDetails: currentloginDetails?.data,
      });
    }

    // Ensure "Stores" menu is in navigation if user has permission
    // This handles cases where _nav was built before role cookie was set or role doesn't match
    let navWithStores = [..._nav];
    const hasStoresInNav = navWithStores.some(item => item.key === "Stores");
    const storesPermission = menuPermissions["Stores"];
    const hasStoresPermission = storesPermission === true || storesPermission === "true" || storesPermission === 1;
    
    console.log('[AppSidebar] Stores menu check before filtering:', {
      hasStoresInNav,
      hasStoresPermission,
      currentRole,
      storesPermissionValue: menuPermissions["Stores"],
      storesPermissionType: typeof menuPermissions["Stores"],
      allPermissions: menuPermissions,
      navLength: navWithStores.length,
    });
    
    // Always add Stores if user has permission (for roles 2 and 3)
    if (hasStoresPermission && (currentRole === "2" || currentRole === "3")) {
      if (!hasStoresInNav) {
        console.log('[AppSidebar] Adding Stores menu dynamically - has permission but missing from nav');
        navWithStores.splice(2, 0, {
          menuType: currentRole === "3" ? "single" : "multiple",
          name: currentRole === "3" ? "Profile" : "Stores",
          key: "Stores",
          link: "/Stores/Add",
          icons: <IconHome />,
          menuItems: currentRole === "3" 
            ? [{
                menuType: "single",
                name: "Add",
                key: "Add",
                link: "/Stores/Add",
                icons: <IconHome />,
              }]
            : [
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
        });
      } else {
        console.log('[AppSidebar] Stores menu already in nav, will check permission');
        // Ensure Stores menu has List item if it's missing (for roles 2 and 0)
        const storesMenuIndex = navWithStores.findIndex((item: any) => item.key === "Stores");
        if (storesMenuIndex >= 0) {
          const storesMenu = navWithStores[storesMenuIndex];
          if (storesMenu.menuItems && Array.isArray(storesMenu.menuItems)) {
            const hasList = storesMenu.menuItems.some((item: any) => item.key === "List");
            if (!hasList && (currentRole === "2" || currentRole === "0")) {
              console.log('[AppSidebar] Adding List menu item to Stores menu');
              // Add List menu item for vendors and admins
              storesMenu.menuItems.push({
                menuType: "single",
                name: "List",
                key: "List",
                link: "/Stores/List",
                icons: <IconHome />,
              });
            }
          } else if (!storesMenu.menuItems && currentRole === "2") {
            // If menuItems doesn't exist, create it with Add and List
            console.log('[AppSidebar] Creating menuItems array for Stores menu');
            storesMenu.menuItems = [
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
            ];
            // Change menuType to multiple if it was single
            if (storesMenu.menuType === "single") {
              storesMenu.menuType = "multiple";
            }
          }
        }
      }
    }

    const filtered = navWithStores
      .map((item: any) => {
        // Always show LogOut - no permission check needed
        if (item.key === "LogOut") {
          return item;
        }

        // For store/vendor users (both sub-users and regular users), check menu permissions STRICTLY
        if (currentRole === "2" || currentRole === "3") {
          // If no permissions are loaded, hide all menus except LogOut
          const hasPermissionsLoaded = menuPermissions && Object.keys(menuPermissions).length > 0;
          if (!hasPermissionsLoaded) {
            // Only show LogOut if no permissions are loaded
            return item.key === "LogOut" ? item : null;
          }
          
          const menuKey = item.key;
          
          // SPECIAL CASE: Always show Stores if permission exists (bypass all other checks)
          if (menuKey === "Stores") {
            // Check permissions in multiple places
            const storesPerm1 = menuPermissions["Stores"];
            const storesPerm2 = currentloginDetails?.data?.menuPermissions?.["Stores"];
            const storesPerm3 = currentloginDetails?.data?.["Stores"];
            const storesPerm = storesPerm1 || storesPerm2 || storesPerm3;
            const hasStoresPerm = storesPerm === true || storesPerm === "true" || storesPerm === 1;
            console.log(`[AppSidebar] Stores menu SPECIAL CHECK:`, {
              menuKey,
              hasStoresPerm,
              permission: storesPerm,
              permissionType: typeof storesPerm,
              storesPerm1,
              storesPerm2,
              storesPerm3,
              menuPermissions: menuPermissions,
              currentloginDetailsData: currentloginDetails?.data,
              hasMenuItems: !!(item.menuItems && Array.isArray(item.menuItems)),
              menuItemsLength: item.menuItems?.length || 0,
              menuType: item.menuType,
              item: item,
            });
            if (hasStoresPerm) {
              console.log('[AppSidebar] Stores menu ALLOWED - returning item directly');
              return item; // Always return Stores if permission exists
            } else {
              console.log('[AppSidebar] Stores menu DENIED - no permission found in any location');
              return null;
            }
          }
          
          const isParentAllowed = isMenuAllowed(menuKey);

          // Special handling for Billing: If user has permission, show it (ignore subscription check)
          if (menuKey === "Billing" && isParentAllowed) {
            // User has permission for Billing, show it regardless of subscription
            return item;
          }

          // Check permission for ALL menus (both with and without sub-items)
          // If parent is not allowed, hide entire menu
          if (!isParentAllowed) {
            console.log(`[AppSidebar] Hiding menu "${menuKey}" - permission is false`);
            return null;
          }

          // If parent is allowed, show the menu (with or without sub-items)
          // Sub-items inherit parent permission (API doesn't return sub-item permissions)
          return item;
        }

        // For Billing menu item, validate subscription (only for admin users)
        // Store/Vendor users with permission already handled above
        if (item.key === "Billing" && currentRole === "0") {
          const hasValidSubscription = currentloginDetails?.data?.subscriptions?.some(
            (sub: any) => 
              sub.subscriptionPlan === "PL1_005" && 
              sub.subscriptionType === "Plan1" &&
              sub.status === "1"
          );
          if (!hasValidSubscription) {
            return null; // Filter out Billing if no valid subscription (admin only)
          }
        }

        // For regular users (non-sub-users) or admin, show all menus
        return item;
      })
      .filter((item: any) => item !== null); // Remove null items
    
    // FORCE INCLUDE Stores if user has permission (bypass all other checks)
    // Check permissions in multiple places
    const storesPermissionFinal1 = menuPermissions["Stores"];
    const storesPermissionFinal2 = currentloginDetails?.data?.menuPermissions?.["Stores"];
    const storesPermissionFinal3 = currentloginDetails?.data?.["Stores"];
    const storesPermissionFinal = storesPermissionFinal1 || storesPermissionFinal2 || storesPermissionFinal3;
    const hasStoresPermissionFinal = storesPermissionFinal === true || storesPermissionFinal === "true" || storesPermissionFinal === 1;
    const hasStoresInFiltered = filtered.some((item: any) => item?.key === "Stores");
    
    console.log('[AppSidebar] Force include check for Stores:', {
      hasStoresPermissionFinal,
      storesPermissionFinal1,
      storesPermissionFinal2,
      storesPermissionFinal3,
      hasStoresInFiltered,
      currentRole,
      willForceInclude: hasStoresPermissionFinal && (currentRole === "2" || currentRole === "3") && !hasStoresInFiltered,
    });
    
    if (hasStoresPermissionFinal && (currentRole === "2" || currentRole === "3") && !hasStoresInFiltered) {
      console.log('[AppSidebar] FORCING Stores menu into filtered array - has permission but was filtered out');
      const storesMenu = {
        menuType: currentRole === "3" ? "single" : "multiple",
        name: currentRole === "3" ? "Profile" : "Stores",
        key: "Stores",
        link: "/Stores/Add",
        icons: <IconHome />,
        menuItems: currentRole === "3" 
          ? [{
              menuType: "single",
              name: "Add",
              key: "Add",
              link: "/Stores/Add",
              icons: <IconHome />,
            }]
          : [],
      };
      // Insert Stores menu after Vendor menu or at position 2
      const vendorIndex = filtered.findIndex((item: any) => item?.key === "Vendor");
      if (vendorIndex >= 0) {
        filtered.splice(vendorIndex + 1, 0, storesMenu);
      } else {
        filtered.splice(2, 0, storesMenu);
      }
    }
    
    // Final debug log to see what menus are actually being returned
    if (currentRole === "2" || currentRole === "3") {
      const finalHasStores = filtered.some((item: any) => item?.key === "Stores");
      console.log('[AppSidebar] Final filtered navigation:', {
        totalMenus: filtered.length,
        menuKeys: filtered.map((item: any) => item?.key),
        hasStores: finalHasStores,
        storesMenu: filtered.find((item: any) => item?.key === "Stores"),
        storesPermission: storesPermissionFinal,
        hasStoresPermission: hasStoresPermissionFinal,
        currentloginDetailsData: currentloginDetails?.data,
      });
      
      // Alert if Stores should be there but isn't
      if (hasStoresPermissionFinal && !finalHasStores) {
        console.error('[AppSidebar] ERROR: Stores permission is true but menu is missing from filtered array!', {
          filteredArray: filtered,
          menuPermissions: menuPermissions,
        });
      } else if (hasStoresPermissionFinal && finalHasStores) {
        console.log('[AppSidebar] SUCCESS: Stores menu is in filtered array with permission');
      }
    }
    
    return filtered;
  }, [currentloginDetails]);

  const itemClasses = {
    title: "font-medium text-sm text-white ms-1",
    indicator: "text-white",
    content: "text-small px-2 py-1",
  };

  const handleLogOut = () => {
    // Use centralized logout utility
    logout(navigate);
  };

  return (
    <>
      <div className="md:hidden">
        <Button
          isIconOnly
          color="primary"
          className="bg-white absolute md:hidden top-[32px] z-10 left-[-7px]"
          aria-label="Take a photo"
          onClick={() => setMobileExpand((prev) => !prev)}
        >
          <IconHome height="14px" width="14px" />
        </Button>
      </div>
      <div
        className={`navBarStyle xm:absolute xm:z-10 md:relative md:left-0 ${
          mobileExpand ? "xm:left-[0%]" : "xm:left-[-100%]"
        } ${menuToggle ? "min-w-[150px]" : "min-w-[250px]"}`}
      >
        <Link
          to="/Dashboard"
          className="flex items-center justify-between px-4 border-b-2 border-b-white text-gray-900 dark:text-white group logoCls"
        >
          {/* <span className="">Logo</span>{" "} */}
          <div>
            <Card className="p-0 m-0 w-20">
              <Image
                alt="Woman listing to music"
                className="object-fit min-w-[100%]"
                src="https://nicknameinfotech.com/img/new-logo.png"
              />
              {/* <CardHeader className="p-0 m-0"></CardHeader> */}
              <CardBody className="p-0 m-0">
                {/* <Image
                  isZoomed
                  alt="Here no Image"
                  className="w-full object-contain max-h-[40px] min-w-[140px]"
                  src="https://nextui-docs-v2.vercel.app/images/album-cover.png"
                  // height={30}
                  // width={140}
                /> */}
              </CardBody>
            </Card>
          </div>
          {mobileExpand && (
            <span onClick={() => setMobileExpand((prev) => !prev)}>
              <IconHome />
            </span>
          )}
        </Link>
        <aside id="default-sidebar" className="h-[84vh]" aria-label="Sidebar">
          <div className="h-full px-3 pb-4 pt-0 overflow-y-auto custom-scrollbar">
            <div className="scroll-content h-fit left-0 top-0 transition-transform z-40">
              <ul role="list" className="space-y-2 font-medium list-disc">
                {filteredNav?.map((result: any) => {
                  // Force Stores menu to always display as "Stores" regardless of role
                  let displayName = result?.name;
                  if (result?.key === "Stores") {
                    displayName = "Stores"; // Always show as "Stores" not "Profile"
                    console.log('[AppSidebar] Rendering Stores menu:', {
                      key: result.key,
                      originalName: result.name,
                      displayName: displayName,
                      menuType: result.menuType,
                      hasMenuItems: !!(result.menuItems && Array.isArray(result.menuItems)),
                      menuItemsLength: result.menuItems?.length || 0,
                      link: result.link,
                    });
                  }
                  
                  // If menu is "multiple" type but has no menuItems, treat it as single
                  // Also handle Stores menu specially - if it has menuItems but is type "single", check if we should render as multiple
                  const isEffectivelySingle = result?.menuType === "single" && (!result?.menuItems || result?.menuItems?.length === 0) ||
                    (result?.menuType === "multiple" && (!result?.menuItems || result?.menuItems?.length === 0));
                  
                  // Special case: If Stores has menuItems, render as multiple even if type is "single"
                  const shouldRenderAsMultiple = result?.key === "Stores" && result?.menuItems && result?.menuItems?.length > 0;
                  
                  return (isEffectivelySingle && !shouldRenderAsMultiple) ? (
                    result?.["key"] === "LogOut" ? (
                      <li className="bg-white rounded-xl cursor-pointer">
                        <div
                          onClick={() => handleLogOut()}
                          className="mt-4 p-3 text-sm flex items-center text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        >
                          <div className="flex justify-between w-full items-center">
                            <p>{result?.key === "Stores" ? displayName : result?.["name"]}</p>
                            {result?.["isToggle"] && (
                              <Switch
                                color="secondary"
                                // size="lg"
                                defaultSelected
                                classNames={{
                                  wrapper: "p-0 h-5 w-9 overflow-visible",
                                  thumb: cn(
                                    "w-4 h-4 border-2 shadow-lg",
                                    "group-data-[hover=true]:border-secondary",
                                    //selected
                                    "group-data-[selected=true]:ml-4  bg-secondary",

                                    // pressed
                                    "group-data-[pressed=true]:w-7",
                                    "group-data-[selected]:group-data-[pressed]:ml-4"
                                  ),
                                }}
                                aria-label="Automatic updates"
                              />
                            )}
                          </div>
                        </div>
                      </li>
                    ) : (
                      <li className="bg-white rounded-xl">
                        <Link
                          to={result?.link}
                          className="mt-4 p-3 text-sm flex items-center text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        >
                          <div className="flex justify-between w-full items-center">
                            <p>{result?.key === "Stores" ? displayName : result?.["name"]}</p>
                            {result?.["isToggle"] && (
                              <Switch
                                color="secondary"
                                // size="lg"
                                defaultSelected
                                classNames={{
                                  wrapper: "p-0 h-5 w-9 overflow-visible",
                                  thumb: cn(
                                    "w-4 h-4 border-2 shadow-lg",
                                    "group-data-[hover=true]:border-secondary",
                                    //selected
                                    "group-data-[selected=true]:ml-4  bg-secondary",

                                    // pressed
                                    "group-data-[pressed=true]:w-7",
                                    "group-data-[selected]:group-data-[pressed]:ml-4"
                                  ),
                                }}
                                aria-label="Automatic updates"
                              />
                            )}
                          </div>
                        </Link>
                      </li>
                    )
                  ) : (
                    <li
                      className="rounded-xl mt-3 overflow-hidden shadow-sm"
                      style={{ backgroundColor: "#49a84cd9" }}
                    >
                      <Accordion
                        itemClasses={itemClasses}
                        className="customAccordion"
                        selectionMode="multiple"
                        defaultExpandedKeys={["2"]}
                      >
                        <AccordionItem
                          key="2"
                          aria-label="Accordion 1"
                          title={
                            <div className="flex justify-between items-center w-full">
                              <p className="font-semibold">{result?.key === "Stores" ? displayName : result?.["name"]}</p>
                              <div className="flex items-center gap-2">
                                <span className="rounded-full bg-white/20 text-white px-2 py-0.5 text-xs font-medium">
                                  {result?.["menuItems"]?.length}
                                </span>
                              </div>
                            </div>
                          }
                          className="text-white"
                        >
                          <ul className="space-y-1.5 py-2">
                            {result?.["menuItems"]?.map(
                              (subMenu: any, index: number) => {
                                const isActive = location.pathname === subMenu?.link || 
                                                 (subMenu?.link && location.pathname.startsWith(subMenu.link) && subMenu.link !== "/");
                                return (
                                  <li key={subMenu?.key || index} className="px-2">
                                    <Link 
                                      to={subMenu?.link}
                                      className={`
                                        group flex items-center gap-3 px-3 py-2.5 rounded-lg
                                        transition-all duration-200 ease-in-out
                                        ${
                                          isActive
                                            ? "bg-white text-secondary font-medium shadow-sm"
                                            : "text-gray-700 hover:bg-white/60 hover:text-secondary"
                                        }
                                      `}
                                    >
                                      <div className={`
                                        w-1.5 h-1.5 rounded-full transition-all duration-200 flex-shrink-0
                                        ${isActive ? "bg-secondary" : "bg-gray-300 group-hover:bg-secondary/50"}
                                      `} />
                                      <span className={`text-sm ${isActive ? "font-medium" : "font-normal"}`}>
                                        {subMenu?.name}
                                      </span>
                                    </Link>
                                  </li>
                                );
                              }
                            )}
                          </ul>
                        </AccordionItem>
                      </Accordion>
                      </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </aside>
      </div>
      {/* {isOPenOrderModal && <OrderCard />} */}
      {isOpenCartModal && <BuyCard />}
    </>
  );
};
