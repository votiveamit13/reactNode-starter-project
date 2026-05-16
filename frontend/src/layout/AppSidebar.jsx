"use client";

import React, { useEffect, useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { ChevronDownIcon, GridIcon, HorizontaLDots } from "../icons/index";

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, modules,setIsMobileOpen } = useSidebar();
  //  pulled from context — no local fetch needed
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  // const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = useCallback((path) => path === pathname, [pathname]);

const dynamicNavItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <GridIcon />,
  },

  {
    name: "Product Management",
    icon: <GridIcon />,
    subItems: [
      {
        name: "Category",
        path: "/product-management/category",
      },
      {
        name: "Products",
        path: "/product-management/products",
      },
      {
        name: "Brands",
        path: "/product-management/brands",
      },
      {
        name: "Inventory",
        path: "/product-management/inventory",
      },
    ],
  },

    {
    name: "User Management",
    icon: <GridIcon />,
    subItems: [
          {
            name: "Users",
            path: "/user-management/users",
          },
        ],
  },

  {
  name: "Event Management",
  icon: <GridIcon />,
  subItems: [
    {
      name: "Categories",
      path: "/event-management/categories",
    },
    {
      name: "Events",
      path: "/event-management/events",
    },
  ],
},

  ...(Array.isArray(modules) ? modules : []).map((m) => ({
    name: m.name,
    icon: <GridIcon />,
    subItems:
      m.children && m.children.length > 0
        ? m.children.map((c) => ({
            name: c.name,
            path: c.route,
          }))
        : undefined,
    path: !m.children || m.children.length === 0 ? m.route : undefined,
  })),
];

  useEffect(() => {
    let matched = false;
    dynamicNavItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((sub) => {
          if (isActive(sub.path)) {
            setOpenSubmenu({ type: "main", index });
            matched = true;
          }
        });
      }
    });
    if (!matched) setOpenSubmenu(null);
  }, [pathname, modules]); // modules in deps so active state recalculates after refresh

  const handleSubmenuToggle = (index, type) => {
    setOpenSubmenu((prev) =>
      prev && prev.type === type && prev.index === index ? null : { type, index }
    );
  };

  const handleMobileClose = (e) => {
  // Let Next.js handle navigation FIRST
  setTimeout(() => {
    setIsMobileOpen(false);
  }, 0);
};

  const renderMenuItems = (navItems, menuType) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={`${nav.name}-${index}`}>
          {nav.subItems ? (
            <>
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                  } cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
                  }`}
              >
                <span
                  className={`${openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text text-left">{nav.name}</span>
                )}

                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto w-5 h-5 transition-transform duration-300 ${openSubmenu?.type === menuType && openSubmenu?.index === index
                        ? "rotate-180 text-brand-500"
                        : ""
                      }`}
                  />
                )}
              </button>

              {(isExpanded || isHovered || isMobileOpen) && (
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight:
                      openSubmenu?.type === menuType && openSubmenu?.index === index
                        ? "500px"
                        : "0px",
                  }}
                >
                  <ul className="mt-2 space-y-1 ml-9">
                    {nav.subItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.path}
                          onClick={handleMobileClose}
                          className={`menu-dropdown-item ${
                            isActive(subItem.path)
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                            }`}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                onClick={handleMobileClose}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 h-screen transition-all duration-300 z-50 border-r
      ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className={`py-4 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link href="/" className="max-md:hidden">
          <Image
            src={
              !isExpanded && !isHovered && !isMobileOpen
                ? "/images/logo/v-logo.jfif"
                : "/images/logo/auth-logo.png"
            }
            alt="Logo"
            width={!isExpanded && !isHovered && !isMobileOpen ? 40 : 250}
            height={40}
          />
        </Link>
      </div>

      {/* Menu */}
      <div className="flex flex-col overflow-y-auto no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="mb-4 text-xs uppercase text-gray-400">Menu</h2>
              {renderMenuItems(dynamicNavItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;