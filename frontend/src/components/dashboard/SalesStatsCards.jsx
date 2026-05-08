"use client";
import { useEffect, useState, useRef } from "react";

function getThisWeekRange() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  const start = new Date(now);
  start.setDate(now.getDate() - daysToMonday);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
}

function getThisMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
}
export default function SalesStatsCards() {
  const [data, setData] = useState(null);

  // ===== ANALYSIS STATES (SAME AS ORIGINAL) =====
  const [analysis, setAnalysis] = useState({});
  const [bdeData, setBdeData] = useState([]);
  const [bdePatterns, setBdePatterns] = useState([]);
  const [filter, setFilter] = useState("today");

  const [showCustom, setShowCustom] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const startRef = useRef(null);
  const endRef = useRef(null);

  // ===== KPI FETCH =====
  const fetchKpi = async () => {
    const now = new Date();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/bid-analysis/progress?year=${now.getFullYear()}&month=${now.getMonth() + 1}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const json = await res.json();

    if (json.success && json.data.length > 0) {
      setData(json.data[0]);
    }
  };

  // ===== ANALYSIS FETCH (SAME AS ORIGINAL) =====
  // const fetchAnalysis = async (customStart, customEnd) => {
  //   try {
  //     let params;

  //     if (filter === "custom" && customStart && customEnd) {
  //       params = `filter=custom&start=${customStart}&end=${customEnd}`;
  //     } else if (filter !== "custom") {
  //       params = `filter=${filter}`;
  //     } else {
  //       return;
  //     }

  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/bid-analysis/sales-dashboard?${params}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );

  //     const json = await res.json();

  //     if (json.success) {
  //       setAnalysis(json.kpi);
  //       setBdeData(json.bdePerformance);
  //       setBdePatterns(json.bdePatterns);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  const fetchAnalysis = async (customStart, customEnd) => {
  try {
    let startDate, endDate;

    if (filter === "custom" && customStart && customEnd) {
      startDate = customStart;
      endDate = customEnd;
    } else if (filter === "week") {
      const weekRange = getThisWeekRange();
      startDate = weekRange.start.toISOString().split('T')[0];
      endDate = weekRange.end.toISOString().split('T')[0];
    } else if (filter === "month") {
      const monthRange = getThisMonthRange();
      startDate = monthRange.start.toISOString().split('T')[0];
      endDate = monthRange.end.toISOString().split('T')[0];
    } else if (filter === "today") {
      const today = new Date();
      startDate = today.toISOString().split('T')[0];
      endDate = today.toISOString().split('T')[0];
    } else if (filter === "yesterday") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      startDate = yesterday.toISOString().split('T')[0];
      endDate = yesterday.toISOString().split('T')[0];
    } else {
      return;
    }

    const params = `filter=custom&start=${startDate}&end=${endDate}`;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/bid-analysis/sales-dashboard?${params}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const json = await res.json();

    if (json.success) {
      setAnalysis(json.kpi);
      setBdeData(json.bdePerformance);
      setBdePatterns(json.bdePatterns);
    }
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    fetchKpi();
  }, []);

  useEffect(() => {
    if (filter !== "custom") {
      fetchAnalysis();
    }
  }, [filter]);

  if (!data) return <div>Loading...</div>;

  // ===== CARD =====
  const Card = ({ title, value, pct, color }) => (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      <p className="text-xs text-gray-400">{title}</p>
      <p className="text-xl font-semibold text-gray-800">{value}</p>
      <p className={`text-xs font-medium ${color}`}>
        {pct == null ? "—" : `${pct > 0 ? "+" : ""}${pct}%`}
      </p>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* ================= TOP KPI ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card title="Target" value={data.totalMonthTarget} pct={data.totalMonthTargetPct} color="text-gray-400" />
        <Card title="Achieved" value={data.bidAchieved} pct={data.bidAchievedPct} color="text-green-500" />
        <Card title="Bid Left" value={data.bidLeft} pct={100 - data.bidAchievedPct} color="text-red-500" />
        <Card title="Days Worked" value={data.daysWorked} pct={data.daysWorkedPct} color="text-green-500" />
        <Card title="Days Left" value={data.daysLeft} pct={100 - data.daysWorkedPct} color="text-red-500" />
      </div>

      {/* ================= BID ANALYZER SECTION ================= */}
<div className="bg-white rounded-xl border border-gray-100 shadow-sm">

  {/* ===== HEADER + FILTER ===== */}
  <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
    
    <h2 className="text-sm font-semibold text-gray-700">
      Bid Analyzer
    </h2>

    <div className="flex gap-2 overflow-x-auto ">
      {[
        { key: "today", label: "Today" },
        { key: "yesterday", label: "Yesterday" },
        { key: "week", label: "This Week" },
        { key: "month", label: "This Month" },
      ].map(({ key, label }) => (
        <button
          key={key}
          onClick={() => {
            setShowCustom(false);
            setFilter(key);
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
            filter === key
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {label}
        </button>
      ))}

      {/* Custom Button */}
      <button
        onClick={() => {
          setFilter("custom");
          setShowCustom((prev) => !prev);
        }}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
          filter === "custom"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        Custom
      </button>
    </div>
  </div>

  {/* ===== CUSTOM DATE ===== */}
  {showCustom && (
    <div className="sm:px-5 px-2 py-3 flex items-center justify-start sm:justify-end gap-2 border-b border-gray-100 overflow-x-auto">
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border rounded-lg px-2 py-1 text-sm"
      />
      <span className="text-gray-400 text-sm">→</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="border rounded-lg px-2 py-1 text-sm"
      />
      <button
        onClick={() => fetchAnalysis(startDate, endDate)}
        className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs"
      >
        Apply
      </button>
    </div>
  )}

  {/* ===== KPI ===== */}
  <div className="px-5 py-4">
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {[
        { label: "Total Bids", val: analysis.totalBids, pct: analysis.totalBidsPct },
        { label: "Replies", val: analysis.replies, pct: analysis.repliesPct },
        { label: "Meetings", val: analysis.meetings, pct: analysis.meetingsPct },
        { label: "Wins", val: analysis.wins, pct: analysis.winsPct },
        { label: "Revenue", val: `$${analysis.revenue ?? 0}`, pct: analysis.revenuePct },
      ].map((item) => (
        <Card
          key={item.label}
          title={item.label}
          value={item.val}
          pct={item.pct}
          color="text-blue-500"
        />
      ))}
    </div>
  </div>

  {/* ===== MY PERFORMANCE ===== */}
  {bdeData.length > 0 && (
    <div className="px-5 pb-4">
      <h3 className="text-xs font-semibold text-gray-500 mb-2">
        My Performance
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Bids", value: bdeData[0].bids },
          { label: "Replies", value: bdeData[0].replies },
          { label: "Wins", value: bdeData[0].wins },
          { label: "Revenue", value: `$${bdeData[0].revenue}` },
        ].map((item) => (
          <div key={item.label} className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-400">{item.label}</p>
            <p className="text-lg font-semibold text-gray-800">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* ===== BIDDING PATTERN ===== */}
  {bdePatterns.length > 0 && (
    <div className="px-5 pb-5">
      <h3 className="text-xs font-semibold text-gray-500 mb-2">
        My Bidding Pattern
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-sm">
        {[
          { label: "Project Types", data: bdePatterns[0].projectTypes },
          { label: "Budget Fixed", data: bdePatterns[0].budgetFixed },
          { label: "Budget Hourly", data: bdePatterns[0].budgetHourly },
          { label: "Job Type", data: bdePatterns[0].jobType },
          { label: "Time Gap", data: bdePatterns[0].timeGap },
        ].map(({ label, data }) => (
          <div key={label}>
            <div className="text-xs text-gray-400 mb-2">{label}</div>
            {data?.map((p, i) => (
              <div key={i} className="text-xs text-gray-600">
                {p.label} — {p.count}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )}

</div>
    </div>
  );
}