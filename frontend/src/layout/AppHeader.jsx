"use client";

import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import NotificationDropdown from "@/components/header/NotificationDropdown";
import UserDropdown from "@/components/header/UserDropdown";
import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext"; // ✅ ADD THIS
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const AppHeader = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const router = useRouter();

  const { user } = useAuth(); // ✅ GET USER

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-50 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex items-center justify-between grow  lg:px-6 border-b border-gray-200  dark:border-gray-800 ">

        {/* LEFT SIDE (NO CHANGE) */}
        <div className="flex items-center justify-start items-center w-full gap-1 px-3 py-3 md:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          
          {/* Toggle Button */}
          <button onClick={handleToggle} className="items-center justify-center text-gray-500 border-gray-200 rounded-lg dark:border-gray-800 lg:flex dark:text-gray-400 lg:border px-4 py-1">
            ☰
          </button>

          {/* Logo */}
          <div   onClick={() => router.push("/dashboard")} className="lg:hidden cursor-pointer">
            {/* <Image width={154} height={32} src="./images/logo/logo.svg" alt="Logo" /> */}
                 <Image
                        src={
                            // "/images/logo/v-logo.jfif"
                             "/images/logo/auth-logo.png"
                        }
                        alt="Logo"
                        width={200}
                        height={40}
                      />
          </div> 

          {/* Search */}
          <div className="hidden lg:block">
            <input
              ref={inputRef}
              placeholder="Search..."
              className="h-11 w-[300px] rounded-lg border px-4"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center md:gap-4 gap-2 px-5 py-4 lg:px-0">

          <ThemeToggleButton />
          {/* <NotificationDropdown /> */}

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              {/* <p className="text-sm font-medium text-gray-800 dark:text-white">
                {user?.name || "User"}
              </p> */}
              <p className="text-xs text-gray-500">
                {user?.role || "Role"}
              </p>
            </div>

            {/* Existing Dropdown */}
            <UserDropdown user={user} />
          </div>

        </div>
      </div>
    </header>
  );
};

export default AppHeader;