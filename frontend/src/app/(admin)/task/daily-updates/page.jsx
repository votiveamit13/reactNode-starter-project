"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import { formatDate } from "@/utils/dateFormatter";
import Pagination from "@/components/common/Pagination";

export default function DailyUpdatesPage() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const { user } = useAuth();
  const [viewData, setViewData] = useState(null);
  const isAdmin = user?.role_id === 1;

  const [activeTab, setActiveTab] = useState("project");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [filters, setFilters] = useState({
    project_id: "",
    date: "",
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");

  const token = typeof window !== "undefined" && localStorage.getItem("token");

  // ---------------- FETCH ----------------

  const fetchProjects = async () => {
    const res = await fetch(`${API}/projects/dropdown`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProjects(data.projects || []);
  };

  const fetchEmployees = async () => {
    if (!isAdmin) return;

    const res = await fetch(`${API}/task-management/employees`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setEmployees(data.employees || []);
  };

  const fetchUpdates = async () => {
    let url;
    
    if (isAdmin) {
      if (activeTab === "employee") {
        if (!selectedEmployee) return;
        
        const query = new URLSearchParams({
          employee_id: selectedEmployee.id,
          page,
          limit: rowsPerPage,
          ...(filters.project_id && { project_id: filters.project_id }),
          ...(filters.date && { date: filters.date }),
        });
        
        url = `${API}/task-management?${query}`;
      } else {
        // Project wise - use the dedicated project API
        if (!selectedProject) return;
        
        const query = new URLSearchParams({
          project_id: selectedProject.id,
          page,
          limit: rowsPerPage,
          ...(filters.date && { date: filters.date }),
        });
        
        url = `${API}/task-management/project?${query}`;
      }
    } else {
      // For non-admin users - fetch their own updates
      const query = new URLSearchParams({
        page,
        limit: rowsPerPage,
      });
      
      url = `${API}/task-management/my?${query}`;
    }

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    setUpdates(data.data || []);
    setTotalPages(data.totalPages || 1);
    setTotalCount(data.total || 0);
  };

  useEffect(() => {
    if (!user) return;

    fetchProjects();
    fetchEmployees();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    
    if (isAdmin) {
      // For admin: fetch only when employee or project is selected
      if (activeTab === "employee") {
        if (selectedEmployee) {
          fetchUpdates();
        }
      } else {
        if (selectedProject) {
          fetchUpdates();
        }
      }
    } else {
      // For non-admin: always fetch updates
      fetchUpdates();
    }
  }, [user, page, filters, selectedEmployee, selectedProject, activeTab, rowsPerPage, isAdmin]);

  const handleSubmit = async () => {
    if (!projectId || !description.trim()) {
      toast.error("All fields required");
      return;
    }

    const res = await fetch(`${API}/task-management`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        project_id: projectId,
        description,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.msg || "Error");
      return;
    }

    toast.success("Update added");

    setShowModal(false);
    setDescription("");
    setProjectId("");

    if (isAdmin) {
      if (activeTab === "employee" && selectedEmployee) {
        fetchUpdates();
      } else if (activeTab === "project" && selectedProject) {
        fetchUpdates();
      }
    } else {
      fetchUpdates();
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-4 bg-white dark:bg-gray-800 md:px-4 md:py-6 p-4 rounded-lg shadow">
        <div>
          <h2 className="md:text-2xl text-xl font-semibold text-gray-800 dark:text-white">
            Daily Updates
          </h2>
          <p className="text-sm text-gray-500">
            Track and manage daily work updates
          </p>
        </div>
         {/* <button
            onClick={() => {
              setSelectedEmployee(null);
              setSelectedProject(null);
              setPage(1);
              setFilters({ project_id: "", date: "" });
            }}
            className="px-3 py-1 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            ← Back to {activeTab === "employee" ? "Employees" : "Projects"}
          </button> */}

        {!isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg shadow"
          >
            + Add Update
          </button>
        )}
      </div>

      {/* ================= ADMIN VIEW ================= */}
      {isAdmin && !selectedEmployee && !selectedProject && (
        <>
          {/* TABS */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setActiveTab("project");
                  setSelectedEmployee(null);
                  setSelectedProject(null);
                  setPage(1);
                  setFilters({ project_id: "", date: "" });
                }}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === "project"
                    ? "text-brand-600 border-b-2 border-brand-600 dark:text-brand-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
              >
                Project Wise
              </button>
              <button
                onClick={() => {
                  setActiveTab("employee");
                  setSelectedEmployee(null);
                  setSelectedProject(null);
                  setPage(1);
                  setFilters({ project_id: "", date: "" });
                }}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === "employee"
                    ? "text-brand-600 border-b-2 border-brand-600 dark:text-brand-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
              >
                Employee Wise
              </button>
            </div>
          </div>

          {/* EMPLOYEE WISE LIST */}
          {activeTab === "employee" && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Employees</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="px-4 py-2 text-left">S. No.</th>
                      <th className="px-4 py-2 text-left">EMP Code</th>
                      <th className="px-4 py-2 text-left">Employee</th>
                      <th className="px-4 py-2 text-left">Action</th>
                     </tr>
                  </thead>
                  <tbody>
                    {employees.map((e, index) => (
                      <tr key={e.id} className="border-b dark:border-gray-700">
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{e.employee_code}</td>
                        <td className="px-4 py-2">{e.full_name}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => {
                              setSelectedEmployee(e);
                              setPage(1);
                            }}
                            className="text-blue-500 hover:text-blue-600"
                          >
                            View Updates
                          </button>
                        </td>
                       </tr>
                    ))}
                  </tbody>
                 </table>
              </div>
            </div>
          )}

          {/* PROJECT WISE LIST */}
          {activeTab === "project" && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Projects</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="px-4 py-2 text-left">S. No.</th>
                      <th className="px-4 py-2 text-left">Project Name</th>
                      <th className="px-4 py-2 text-left">Action</th>
                     </tr>
                  </thead>
                  <tbody>
                    {projects.map((p, index) => (
                      <tr key={p.id} className="border-b dark:border-gray-700">
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{p.project_name}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => {
                              setSelectedProject(p);
                              setPage(1);
                            }}
                            className="text-blue-500 hover:text-blue-600"
                          >
                            View Updates
                          </button>
                        </td>
                       </tr>
                    ))}
                  </tbody>
                 </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ================= MAIN VIEW (After Selection for Admin) ================= */}
      {isAdmin && (selectedEmployee || selectedProject) && (
        <>
          {/* BACK BUTTON */}
          {/* <button
            onClick={() => {
              setSelectedEmployee(null);
              setSelectedProject(null);
              setPage(1);
              setFilters({ project_id: "", date: "" });
            }}
            className="px-3 py-1 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            ← Back to {activeTab === "employee" ? "Employees" : "Projects"}
          </button> */}

          {/* FILTER CARD */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Project Filter - Only show in employee wise */}
              {activeTab === "employee" && (
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Project
                  </label>
                  <select
                    value={filters.project_id}
                    onChange={(e) =>
                      setFilters({ ...filters, project_id: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800"
                  >
                    <option value="">All Projects</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.project_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Date Filter */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Date
                </label>
                <Flatpickr
                  value={filters.date}
                  onChange={(selectedDates, dateStr) =>
                    setFilters({ ...filters, date: dateStr })
                  }
                  options={{
                    dateFormat: "Y-m-d",
                    allowInput: true,
                  }}
                  className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800"
                  placeholder="Select date"
                />
              </div>
            </div>
          </div>

          {/* TABLE CARD */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left">S. No.</th>
                  <th className="px-4 py-3 text-left">Employee</th>
                  {activeTab === "employee" && <th className="px-4 py-3 text-left">Project</th>}
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Time</th>
                </tr>
              </thead>

              <tbody>
                {updates.length === 0 ? (
                  <tr>
                    <td colSpan={activeTab === "employee" ? 6 : 5} className="text-center py-10 text-gray-500">
                      No updates found
                    </td>
                  </tr>
                ) : (
                  updates.map((u, index) => (
                    <tr key={u.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3">
                        {(page - 1) * rowsPerPage + index + 1}
                      </td>

                      <td className="px-4 py-3">{u.employee_name}</td>

                      {/* Project column - only show in employee wise view */}
                      {activeTab === "employee" && (
                        <td className="px-4 py-3">{u.project_name}</td>
                      )}

                      <td className="px-4 py-3">{formatDate(u.date)}</td>

                      <td className="px-4 py-3 max-w-[300px]">
                        <div className="truncate">
                          {u.description}
                        </div>
                        <button
                          className="text-blue-500 text-xs mt-1 hover:text-blue-600"
                          onClick={() => setViewData(u)}
                        >
                          View
                        </button>
                      </td>

                      <td className="px-4 py-3">
                        {new Date(u.created_at).toLocaleTimeString()}
                      </td>
                     </tr>
                  ))
                )}
              </tbody>
             </table>
          </div>

          {/* PAGINATION - Only show when totalCount > 10 */}
          {totalCount > 10 && (
            <Pagination
              count={totalCount}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(p) => setPage(p)}
              onRowsPerPageChange={(val) => {
                setRowsPerPage(val);
                setPage(1);
              }}
            />
          )}
        </>
      )}

      {/* ================= NON-ADMIN VIEW ================= */}
      {!isAdmin && (
        <>
          {/* TABLE CARD */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left">S. No.</th>
                  <th className="px-4 py-3 text-left">Project</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Time</th>
                </tr>
              </thead>

              <tbody>
                {updates.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500">
                      No updates found
                    </td>
                  </tr>
                ) : (
                  updates.map((u, index) => (
                    <tr key={u.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3">
                        {(page - 1) * rowsPerPage + index + 1}
                      </td>
                      <td className="px-4 py-3">{u.project_name}</td>
                      <td className="px-4 py-3">{formatDate(u.date)}</td>
                      <td className="px-4 py-3 max-w-[300px]">
                        <div className="truncate">
                          {u.description}
                        </div>
                        <button
                          className="text-blue-500 text-xs mt-1 hover:text-blue-600"
                          onClick={() => setViewData(u)}
                        >
                          View
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        {new Date(u.created_at).toLocaleTimeString()}
                      </td>
                     </tr>
                  ))
                )}
              </tbody>
             </table>
          </div>

          {/* PAGINATION - Only show when totalCount > 10 */}
          {totalCount > 10 && (
            <Pagination
              count={totalCount}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(p) => setPage(p)}
              onRowsPerPageChange={(val) => {
                setRowsPerPage(val);
                setPage(1);
              }}
            />
          )}
        </>
      )}

      {/* DESCRIPTION MODAL */}
      {viewData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-[600px]">
            <h3 className="font-semibold mb-3 text-gray-800 dark:text-white">Full Description</h3>
            <div className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-300">
              {viewData.description}
            </div>
            <button
              onClick={() => setViewData(null)}
              className="mt-4 px-4 py-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ADD UPDATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-[500px] space-y-4 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Add Daily Update
            </h3>

            <select
              className="w-full border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.project_name}
                </option>
              ))}
            </select>

            <textarea
              className="w-full border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
              rows={5}
              placeholder="Write your update..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}