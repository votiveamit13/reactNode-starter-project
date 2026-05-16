"use client";

import { useEffect, useState } from "react";

import axios from "axios";

export default function UsersPage() {

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL;

  const [users, setUsers] = useState([]);

  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role_id: "2",
    is_active: "1",
  });



  // FETCH USERS
  const fetchUsers = async () => {

    try {

      const res = await axios.get(
        `${API_URL}/users`
      );

      setUsers(res.data);

    } catch (error) {

      console.log(error);

    }

  };


  useEffect(() => {

    fetchUsers();

  }, []);



  // HANDLE INPUT
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
          `${API_URL}/users/update/${editId}`,
          formData
        );

        alert("User updated successfully");

      } else {

        await axios.post(
          `${API_URL}/users/add`,
          formData
        );

        alert("User added successfully");

      }


      setFormData({
        name: "",
        email: "",
        password: "",
        role_id: "2",
        is_active: "1",
      });

      setEditId(null);

      fetchUsers();

    } catch (error) {

      console.log(error);

      alert(
        error?.response?.data?.msg ||
        "Something went wrong"
      );

    }

  };



  // EDIT
  const handleEdit = (user) => {

    setEditId(user.id);

    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role_id: String(user.role_id),
      is_active: String(user.is_active),
    });

  };



  // DELETE
  const handleDelete = async (id) => {

    if (!confirm("Delete user?")) return;

    try {

      await axios.delete(
        `${API_URL}/users/delete/${id}`
      );

      fetchUsers();

      alert("User deleted");

    } catch (error) {

      console.log(error);

    }

  };



  return (

    <div className="p-6">

      <div className="rounded-2xl border bg-white p-6">

        <h2 className="mb-6 text-2xl font-bold">
          User Management
        </h2>


        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="mb-6 grid grid-cols-2 gap-4"
        >

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="rounded border p-3"
            required
          />


          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="rounded border p-3"
            required
          />


          {!editId && (

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="rounded border p-3"
              required
            />

          )}


          <select
            name="role_id"
            value={formData.role_id}
            onChange={handleChange}
            className="rounded border p-3"
          >

            {/*<option value="1">
              Admin
            </option>*/}

            <option value="2">
              User
            </option>

          </select>


          <select
            name="is_active"
            value={formData.is_active}
            onChange={handleChange}
            className="rounded border p-3"
          >

            <option value="1">
              Active
            </option>

            <option value="0">
              Inactive
            </option>

          </select>


          <button
            type="submit"
            className="rounded bg-blue-600 p-3 text-white"
          >
            {editId
              ? "Update User"
              : "Add User"}
          </button>

        </form>



        {/* TABLE */}

        <div className="overflow-auto">

          <table className="w-full border-collapse">

            <thead>

              <tr className="border-b bg-gray-100">

                <th className="p-3 text-left">
                  ID
                </th>

                <th className="p-3 text-left">
                  Name
                </th>

                <th className="p-3 text-left">
                  Email
                </th>

                <th className="p-3 text-left">
                  Role
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

              {users.map((user) => (

                <tr
                  key={user.id}
                  className="border-b"
                >

                  <td className="p-3">
                    {user.id}
                  </td>

                  <td className="p-3">
                    {user.name}
                  </td>

                  <td className="p-3">
                    {user.email}
                  </td>

                  <td className="p-3">

                    {user.role_id == 1
                      ? "Admin"
                      : "User"}

                  </td>

                  <td className="p-3">

                    {user.is_active == 1
                      ? "Active"
                      : "Inactive"}

                  </td>

                  <td className="flex gap-2 p-3">

                    <button
                      onClick={() => handleEdit(user)}
                      className="rounded bg-green-600 px-3 py-1 text-white"
                    >
                      Edit
                    </button>


                    <button
                      onClick={() => handleDelete(user.id)}
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

    </div>

  );

}