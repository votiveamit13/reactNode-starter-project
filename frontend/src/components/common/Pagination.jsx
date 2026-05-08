"use client";

import { FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";

const Pagination = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  hideRowsPerPage = false,
}) => {
  const totalPages = Math.ceil(count / rowsPerPage);

  const start = (page - 1) * rowsPerPage + 1;
  const end = Math.min(page * rowsPerPage, count);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:gap-4 gap-1 sm:flex-row flex-col">

      {/* LEFT */}
      {!hideRowsPerPage && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 ">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="border rounded px-2 py-1 bg-white dark:bg-gray-800"
          >
            {[5, 10, 25, 50].map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* CENTER */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {start}–{end} of {count}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="p-2 border rounded disabled:opacity-50"
        >
          <FaAngleDoubleLeft />
        </button>

        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-2 border rounded disabled:opacity-50"
        >
          <FaAngleLeft />
        </button>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-2 border rounded disabled:opacity-50"
        >
          <FaAngleRight />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          className="p-2 border rounded disabled:opacity-50"
        >
          <FaAngleDoubleRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;