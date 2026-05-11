"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function CategoryPage() {

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");

  const [status, setStatus] = useState("active");

  const [editId, setEditId] = useState(null);


  // GET CATEGORY
  const fetchCategories = async () => {

    try {

      const res = await axios.get(
        `${API_URL}/category`
      );

      setCategories(res.data);

    } catch (error) {

      console.log(error);

    }

  };


  useEffect(() => {

    fetchCategories();

  }, []);


  // ADD CATEGORY
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (editId) {

        // UPDATE
        await axios.put(
          `${API_URL}/category/update/${editId}`,
          {
            name,
            status,
          }
        );

        alert("Category updated successfully");

      } else {

        // ADD
        await axios.post(
          `${API_URL}/category/add`,
          {
            name,
            status,
          }
        );

        alert("Category added successfully");

      }

      setName("");
      setStatus("active");
      setEditId(null);

      fetchCategories();

    } catch (error) {

      console.log(error);

    }

  };


  // DELETE CATEGORY
  const handleDelete = async (id) => {

    if (!confirm("Delete category?")) return;

    try {

      await axios.delete(
        `${API_URL}/category/delete/${id}`
      );

      fetchCategories();

    } catch (error) {

      console.log(error);

    }

  };


  // EDIT CATEGORY
  const handleEdit = (category) => {

    setEditId(category.id);

    setName(category.name);

    setStatus(category.status);

  };


  return (

    <div className="p-6">

      <div className="rounded-2xl border border-gray-200 bg-white p-6">

        <h2 className="mb-5 text-2xl font-bold">
          Category Management
        </h2>


        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="mb-6 flex gap-3"
        >

          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border px-4 py-2"
            required
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border px-4 py-2"
          >
            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>

          </select>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2 text-white"
          >
            {editId ? "Update" : "Add"}
          </button>

        </form>


        {/* TABLE */}

        <table className="w-full border-collapse">

          <thead>

            <tr className="border-b">

              <th className="px-4 py-3 text-left">
                ID
              </th>

              <th className="px-4 py-3 text-left">
                Name
              </th>

              <th className="px-4 py-3 text-left">
                Status
              </th>

              <th className="px-4 py-3 text-left">
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            {categories.map((category) => (

              <tr
                key={category.id}
                className="border-b"
              >

                <td className="px-4 py-3">
                  {category.id}
                </td>

                <td className="px-4 py-3">
                  {category.name}
                </td>

                <td className="px-4 py-3">
                  {category.status}
                </td>

                <td className="flex gap-2 px-4 py-3">

                  <button
                    onClick={() => handleEdit(category)}
                    className="rounded bg-green-600 px-3 py-1 text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(category.id)}
                    className="rounded bg-red-600 px-3 py-1 text-white"
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