"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function EventCategoryPage() {

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL;

  const [categories, setCategories] =
    useState([]);

  const [editId, setEditId] =
    useState(null);

  const [formData, setFormData] =
    useState({
      name: "",
      status: "active",
    });


  // GET CATEGORIES
  const fetchCategories = async () => {

    try {

      const res = await axios.get(
        `${API_URL}/event-category`
      );

      setCategories(res.data);

    } catch (error) {

      console.log(error);

    }

  };


  useEffect(() => {

    fetchCategories();

  }, []);


  // HANDLE CHANGE
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  // SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (editId) {

        await axios.put(
          `${API_URL}/event-category/update/${editId}`,
          formData
        );

        alert("Category updated");

      } else {

        await axios.post(
          `${API_URL}/event-category/add`,
          formData
        );

        alert("Category added");

      }

      setFormData({
        name: "",
        status: "active",
      });

      setEditId(null);

      fetchCategories();

    } catch (error) {

      console.log(error);

    }

  };


  // DELETE
  const handleDelete = async (id) => {

    if (!confirm("Delete category?"))
      return;

    try {

      await axios.delete(
        `${API_URL}/event-category/delete/${id}`
      );

      fetchCategories();

    } catch (error) {

      console.log(error);

    }

  };


  // EDIT
  const handleEdit = (category) => {

    setEditId(category.id);

    setFormData({
      name: category.name,
      status: category.status,
    });

  };


  return (

    <div className="p-6">

      <div className="rounded-2xl border bg-white p-6">

        <h2 className="mb-5 text-2xl font-bold">
          Event Categories
        </h2>


        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="mb-6 grid grid-cols-2 gap-4"
        >

          <input
            type="text"
            name="name"
            placeholder="Category Name"
            value={formData.name}
            onChange={handleChange}
            className="rounded border p-3"
            required
          />


          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="rounded border p-3"
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
            className="rounded bg-blue-600 p-3 text-white"
          >
            {editId
              ? "Update Category"
              : "Add Category"}
          </button>

        </form>


        {/* TABLE */}

        <table className="w-full border-collapse">

          <thead>

            <tr className="border-b">

              <th className="p-3 text-left">
                ID
              </th>

              <th className="p-3 text-left">
                Name
              </th>

              <th className="p-3 text-left">
                Status
              </th>

              <th className="p-3 text-left">
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

                <td className="p-3">
                  {category.id}
                </td>

                <td className="p-3">
                  {category.name}
                </td>

                <td className="p-3">

                  <span
                    className={`rounded px-2 py-1 text-white
                    ${
                      category.status === "active"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {category.status}
                  </span>

                </td>

                <td className="flex gap-2 p-3">

                  <button
                    onClick={() =>
                      handleEdit(category)
                    }
                    className="rounded bg-green-600 px-3 py-1 text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(category.id)
                    }
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