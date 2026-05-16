"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function EventsPage() {

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL;

  const UPLOAD_URL =
    process.env.NEXT_PUBLIC_UPLOAD_URL;

  const [events, setEvents] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [image, setImage] =
    useState(null);

  const [editId, setEditId] =
    useState(null);

  const [formData, setFormData] =
    useState({
      category_id: "",
      title: "",
      sub_title: "",
      organizer_name: "",
      event_date: "",
      start_time: "",
      end_time: "",
      venue_address: "",
      price: "",
      number_of_person: "",
      description: "",
      policy_description: "",
      wifi_available: "0",
      rules_regulations: "",
      waste_disposal_time: "",
      status: "active",
    });


  // GET EVENTS
  const fetchEvents = async () => {

    try {

      const res = await axios.get(
        `${API_URL}/event`
      );

      setEvents(res.data);

    } catch (error) {

      console.log(error);

    }

  };


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

    fetchEvents();

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

      const data = new FormData();

      Object.keys(formData).forEach((key) => {

        data.append(key, formData[key]);

      });

      if (image) {

        data.append("image", image);

      }

      if (editId) {

        await axios.put(
          `${API_URL}/event/update/${editId}`,
          data
        );

        alert("Event updated");

      } else {

        await axios.post(
          `${API_URL}/event/add`,
          data
        );

        alert("Event added");

      }

      setFormData({
        category_id: "",
        title: "",
        sub_title: "",
        organizer_name: "",
        event_date: "",
        start_time: "",
        end_time: "",
        venue_address: "",
        price: "",
        number_of_person: "",
        description: "",
        policy_description: "",
        wifi_available: "0",
        rules_regulations: "",
        waste_disposal_time: "",
        status: "active",
      });

      setImage(null);

      setEditId(null);

      fetchEvents();

    } catch (error) {

      console.log(error);

    }

  };


  // DELETE
  const handleDelete = async (id) => {

    if (!confirm("Delete Event?"))
      return;

    try {

      await axios.delete(
        `${API_URL}/event/delete/${id}`
      );

      fetchEvents();

    } catch (error) {

      console.log(error);

    }

  };


  // EDIT
  const handleEdit = (event) => {

    setEditId(event.id);

    setFormData({
      category_id: event.category_id,
      title: event.title,
      sub_title: event.sub_title,
      organizer_name: event.organizer_name,
      event_date: event.event_date,
      start_time: event.start_time,
      end_time: event.end_time,
      venue_address: event.venue_address,
      price: event.price,
      number_of_person: event.number_of_person,
      description: event.description,
      policy_description: event.policy_description,
      wifi_available: event.wifi_available,
      rules_regulations: event.rules_regulations,
      waste_disposal_time:
        event.waste_disposal_time,
      status: event.status,
    });

  };


  return (

    <div className="p-6">

      <div className="rounded-2xl border bg-white p-6">

        <h2 className="mb-5 text-2xl font-bold">
          Event Management
        </h2>


        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4 mb-8"
        >

          {/* CATEGORY */}

          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="rounded border p-3"
            required
          >

            <option value="">
              Select Category
            </option>

            {categories.map((category) => (

              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>

            ))}

          </select>


          {/* TITLE */}

          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            className="rounded border p-3"
            required
          />


          {/* SUB TITLE */}

          <input
            type="text"
            name="sub_title"
            placeholder="Sub Title"
            value={formData.sub_title}
            onChange={handleChange}
            className="rounded border p-3"
          />


          {/* ORGANIZER */}

          <input
            type="text"
            name="organizer_name"
            placeholder="Organizer Name"
            value={formData.organizer_name}
            onChange={handleChange}
            className="rounded border p-3"
          />


          {/* DATE */}

          <input
            type="date"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            className="rounded border p-3"
          />


          {/* START TIME */}

          <input
            type="time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            className="rounded border p-3"
          />


          {/* END TIME */}

          <input
            type="time"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            className="rounded border p-3"
          />


          {/* VENUE */}

          <input
            type="text"
            name="venue_address"
            placeholder="Venue Address"
            value={formData.venue_address}
            onChange={handleChange}
            className="rounded border p-3"
          />


          {/* PRICE */}

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="rounded border p-3"
          />


          {/* NUMBER OF PERSON */}

          <input
            type="number"
            name="number_of_person"
            placeholder="Number Of Person"
            value={formData.number_of_person}
            onChange={handleChange}
            className="rounded border p-3"
          />


          {/* IMAGE */}

          <input
            type="file"
            onChange={(e) =>
              setImage(e.target.files[0])
            }
            className="rounded border p-3"
          />


          {/* WIFI */}

          <select
            name="wifi_available"
            value={formData.wifi_available}
            onChange={handleChange}
            className="rounded border p-3"
          >

            <option value="1">
              Wifi Available
            </option>

            <option value="0">
              No Wifi
            </option>

          </select>


          {/* DESCRIPTION */}

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="rounded border p-3 col-span-2"
            rows={4}
          />


          {/* POLICY */}

          <textarea
            name="policy_description"
            placeholder="Policy Description"
            value={formData.policy_description}
            onChange={handleChange}
            className="rounded border p-3 col-span-2"
            rows={3}
          />


          {/* RULES */}

          <textarea
            name="rules_regulations"
            placeholder="Rules & Regulations"
            value={formData.rules_regulations}
            onChange={handleChange}
            className="rounded border p-3 col-span-2"
            rows={3}
          />


          {/* WASTE */}

          <input
            type="text"
            name="waste_disposal_time"
            placeholder="Waste Disposal Time"
            value={formData.waste_disposal_time}
            onChange={handleChange}
            className="rounded border p-3"
          />


          {/* STATUS */}

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


          {/* BUTTON */}

          <button
            type="submit"
            className="rounded bg-blue-600 p-3 text-white col-span-2"
          >
            {editId
              ? "Update Event"
              : "Add Event"}
          </button>

        </form>


        {/* TABLE */}

        <table className="w-full border-collapse">

          <thead>

            <tr className="border-b">

              <th className="p-3 text-left">
                Image
              </th>

              <th className="p-3 text-left">
                Event
              </th>

              <th className="p-3 text-left">
                Category
              </th>

              <th className="p-3 text-left">
                Date
              </th>

              <th className="p-3 text-left">
                Price
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

            {events.map((event) => (

              <tr
                key={event.id}
                className="border-b"
              >

                <td className="p-3">

                  <img
                    src={`${UPLOAD_URL}${event.image}`}
                    alt=""
                    className="h-16 w-20 rounded object-cover"
                  />

                </td>

                <td className="p-3">

                  <div className="font-semibold">
                    {event.title}
                  </div>

                  <div className="text-sm text-gray-500">
                    {event.sub_title}
                  </div>

                </td>

                <td className="p-3">
                  {event.category_name}
                </td>

                <td className="p-3">
                  {event.event_date}
                </td>

                <td className="p-3">
                  ₹ {event.price}
                </td>

                <td className="p-3">

                  <span
                    className={`rounded px-2 py-1 text-white
                    ${
                      event.status === "active"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {event.status}
                  </span>

                </td>

                <td className="flex gap-2 p-3">

                  <button
                    onClick={() =>
                      handleEdit(event)
                    }
                    className="rounded bg-green-600 px-3 py-1 text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(event.id)
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