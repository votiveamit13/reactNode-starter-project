"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function BrandsPage() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [brands, setBrands] = useState([]);

  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");

  const [editId, setEditId] = useState(null);

  // FETCH
  const fetchBrands = async () => {
    try {
      const res = await axios.get(`${API}/brands`);
      setBrands(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // ADD / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`${API}/brands/${editId}`, {
          name,
          status,
        });

        alert("Brand updated");
      } else {
        await axios.post(`${API}/brands`, {
          name,
          status,
        });

        alert("Brand added");
      }

      setName("");
      setStatus("active");
      setEditId(null);

      fetchBrands();
    } catch (error) {
      console.log(error);
    }
  };

  // EDIT
  const handleEdit = (brand) => {
    setEditId(brand.id);
    setName(brand.name);
    setStatus(brand.status);
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!confirm("Delete this brand?")) return;

    try {
      await axios.delete(`${API}/brands/${id}`);

      alert("Deleted");

      fetchBrands();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Brand Management
      </h1>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6"
      >
        <div className="mb-4">
          <label className="block mb-2">
            Brand Name
          </label>

          <input
            type="text"
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">
            Status
          </label>

          <select
            className="w-full border p-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editId ? "Update Brand" : "Add Brand"}
        </button>
      </form>

      {/* TABLE */}

      <div className="bg-white shadow rounded p-4">
        <table className="w-full border">

          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">
                ID
              </th>

              <th className="border p-2">
                Name
              </th>

              <th className="border p-2">
                Status
              </th>

              <th className="border p-2">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id}>

                <td className="border p-2">
                  {brand.id}
                </td>

                <td className="border p-2">
                  {brand.name}
                </td>

                <td className="border p-2">
                  {brand.status}
                </td>

                <td className="border p-2 flex gap-2">

                  <button
                    onClick={() => handleEdit(brand)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(brand.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}