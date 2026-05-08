"use client";

import { useState, useMemo } from "react";

export default function MultiSelectDropdown({
  options = [],
  value = [],
  onChange,
  placeholder = "Select",
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Filtered options
  const filteredOptions = useMemo(() => {
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const toggle = (val) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  // Select All
  const handleSelectAll = () => {
    const allIds = filteredOptions.map((o) => o.value);
    onChange([...new Set([...value, ...allIds])]);
  };

  // Clear All
  const handleClear = () => {
    onChange([]);
  };

  // Display selected labels
  const selectedLabels = options
    .filter((o) => value.includes(o.value))
    .map((o) => o.label);

  return (
    <div className="relative w-full">

      {/* SELECT BOX */}
      <div
        onClick={() => setOpen(!open)}
        className="border p-2 rounded bg-white cursor-pointer text-sm"
      >
        {selectedLabels.length > 0
          ? selectedLabels.slice(0, 2).join(", ") +
            (selectedLabels.length > 2
              ? ` +${selectedLabels.length - 2}`
              : "")
          : placeholder}
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-20 bg-white border rounded mt-1 w-full shadow max-h-64 overflow-hidden">

          {/* 🔍 SEARCH */}
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border px-2 py-1 rounded text-sm"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-between px-3 py-2 text-xs border-b">
            <button
              onClick={handleSelectAll}
              className="text-blue-500"
            >
              Select All
            </button>
            <button
              onClick={handleClear}
              className="text-red-500"
            >
              Clear
            </button>
          </div>

          {/* OPTIONS */}
          <div className="max-h-40 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-sm text-gray-400">
                No results
              </div>
            ) : (
              filteredOptions.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={value.includes(opt.value)}
                    onChange={() => toggle(opt.value)}
                  />
                  {opt.label}
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}