"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const SidebarContext = createContext(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [isExpanded, setIsExpanded]   = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile]       = useState(false);
  const [isHovered, setIsHovered]     = useState(false);
  const [activeItem, setActiveItem]   = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  // ── NEW: sidebar modules live here so any page can trigger a refresh ───────
  const [modules, setModules] = useState([]);

  const fetchSidebarModules = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/modules/sidebar`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }
      );
      const data = await res.json();
      setModules(data);
    } catch (err) {
      console.log("Sidebar fetch error:", err);
    }
  }, []);

  // fetch once on app load
  useEffect(() => {
    fetchSidebarModules();
  }, [fetchSidebarModules]);
  // ─────────────────────────────────────────────────────────────────────────

  // your original resize logic — untouched
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsMobileOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar       = () => setIsExpanded((prev) => !prev);
  const toggleMobileSidebar = () => setIsMobileOpen((prev) => !prev);
  const toggleSubmenu       = (item) => setOpenSubmenu((prev) => (prev === item ? null : item));

  return (
    <SidebarContext.Provider
      value={{
        // ── your original values — nothing removed ──
        isExpanded: isMobile ? false : isExpanded,
        isMobileOpen,
        setIsMobileOpen,
        isHovered,
        activeItem,
        openSubmenu,
        toggleSidebar,
        toggleMobileSidebar,
        setIsHovered,
        setActiveItem,
        toggleSubmenu,
        // ── NEW: two additions ──
        modules,
        refreshSidebar: fetchSidebarModules,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};