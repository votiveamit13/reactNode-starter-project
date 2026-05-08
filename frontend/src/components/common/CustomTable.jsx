"use client";

import React from "react";

const CustomTable = ({
  columns,
  data,
  sortConfig,
  onSort,
  loading = false,
  emptyMessage = "No Data Available",
}) => {
  return (
    <div className="bg-white dark:bg-white/[0.03] rounded-xl overflow-hidden border border-gray-200 dark:border-white/[0.05]">
      <div className="w-full overflow-x-auto">
        <table className="min-w-full">

          {/* HEADER */}
          <thead className="bg-gray-100 dark:bg-white/[0.05]">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  onClick={() => col.sortable && onSort?.(col.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap ${col.sortable ? "cursor-pointer select-none" : ""
                    }`}
                >
                  <div className="flex items-center justify-between">
                    {col.label}

                    {/* SORT ICON */}
                    {col.sortable && (
                      <span className="flex flex-col ml-2">
                        <span
                          className={`text-[8px] leading-none ${sortConfig?.key === col.key &&
                              sortConfig.direction === "asc"
                              ? "text-black dark:text-white"
                              : "text-gray-400"
                            }`}
                        >
                          ▲
                        </span>
                        <span
                          className={`text-[8px] leading-none ${sortConfig?.key === col.key &&
                              sortConfig.direction === "desc"
                              ? "text-black dark:text-white"
                              : "text-gray-400"
                            }`}
                        >
                          ▼
                        </span>
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            ) : data?.length > 0 ? (
              data.map((row, i) => (
                <tr
                  key={row.id || i}
                  className="border-t border-gray-100 dark:border-white/[0.05] hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                >
                  {columns.map((col, j) => (
                    <td
                      key={j}
                      className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 align-middle"
                    >
                      {col.render
                        ? col.render(row, i)
                        : row[col.key] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomTable;