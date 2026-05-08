"use client";
import { useAuth } from "@/context/AuthContext";

import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import SalesStatsCards from "@/components/dashboard/SalesStatsCards";

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  const isSuperAdmin = user?.role === "Super Admin";
  const isSales = user?.role === "Sales";

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      {isSuperAdmin && (
        <>
          <div className="col-span-12 space-y-6 xl:col-span-7">
            <EcommerceMetrics />
            <MonthlySalesChart />
          </div>

          <div className="col-span-12 xl:col-span-5">
            <MonthlyTarget />
          </div>

          <div className="col-span-12">
            <StatisticsChart />
          </div>

          <div className="col-span-12 xl:col-span-5">
            <DemographicCard />
          </div>
      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div>
        </>
      )}

      {isSales && (
      <div className="col-span-12">
        <SalesStatsCards />
      </div>
    )}


    </div>
  );
}