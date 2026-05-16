"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductsPage() {

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL;

  const UPLOAD_URL =
    process.env.NEXT_PUBLIC_UPLOAD_URL;

  const [products, setProducts] = useState([]);

  const [brands, setBrands] = useState([]);

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    category_id: "",
    brand_id: "",
    name: "",
    price: "",
    status: "active",
  });

  const [image, setImage] = useState(null);

  const [editId, setEditId] = useState(null);


  // GET PRODUCTS
  const fetchProducts = async () => {

    try {

      const res = await axios.get(
        `${API_URL}/product`
      );

      setProducts(res.data);

    } catch (error) {

      console.log(error);

    }

  };


  // GET CATEGORIES
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


  // FETCH BRANDS
const fetchBrands = async () => {
  try {
    const res = await axios.get(`${API_URL}/brands`);

    setBrands(res.data);
  } catch (error) {
    console.log(error);
  }
};


  useEffect(() => {

    fetchProducts();

    fetchCategories();

    fetchBrands();

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

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (image) {
        data.append("image", image);
      }

      if (editId) {

        await axios.put(
          `${API_URL}/product/update/${editId}`,
          data
        );

        alert("Product updated");

      } else {

        await axios.post(
          `${API_URL}/product/add`,
          data
        );

        alert("Product added");

      }

      setFormData({
        category_id: "",
        brand_id: "",
        name: "",
        price: "",
        qty: "",
        status: "active",
      });

      setImage(null);

      setEditId(null);

      fetchProducts();

    } catch (error) {

      console.log(error);

    }

  };


  // DELETE
  const handleDelete = async (id) => {

    if (!confirm("Delete product?")) return;

    try {

      await axios.delete(
        `${API_URL}/product/delete/${id}`
      );

      fetchProducts();

    } catch (error) {

      console.log(error);

    }

  };


  // EDIT
  const handleEdit = (product) => {

    setEditId(product.id);

    setFormData({
      category_id: product.category_id,
      brand_id: product.brand_id,
      name: product.name,
      price: product.price,
      qty: product.qty,
      status: product.status,
    });

  };


  return (

    <div className="p-6">

      <div className="rounded-2xl border bg-white p-6">

        <h2 className="mb-5 text-2xl font-bold">
          Product Management
        </h2>


        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="mb-6 grid grid-cols-2 gap-4"
        >

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


        <select
        name="brand_id"
        value={formData.brand_id}
        onChange={handleChange}
        className="rounded border p-3"
        >
          <option value="">
            Select Brand
          </option>

          {brands.map((brand) => (
            <option
              key={brand.id}
              value={brand.id}
            >
              {brand.name}
            </option>
          ))}
        </select>



          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="rounded border p-3"
            required
          />


          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="rounded border p-3"
          />



          <input
            type="file"
            onChange={(e) =>
              setImage(e.target.files[0])
            }
            className="rounded border p-3"
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
            {editId ? "Update Product" : "Add Product"}
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
                Product
              </th>

              <th className="p-3 text-left">
                Category
              </th>

              <th className="p-3 text-left">
                Brand
              </th>

              <th className="p-3 text-left">
                Price
              </th>

              <th className="p-3 text-left">
                Qty
              </th>

              <th className="p-3 text-left">
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            {products.map((product) => (

              <tr
                key={product.id}
                className="border-b"
              >

                <td className="p-3">

                  <img
                    src={`${UPLOAD_URL}${product.image}`}
                    alt=""
                    className="h-14 w-14 rounded object-cover"
                  />

                </td>

                <td className="p-3">
                  {product.name}
                </td>

                <td className="p-3">
                  {product.category_name}
                </td>

                <td className="p-3">
                  {product.brand_name}
                </td>

                <td className="p-3">
                  ₹ {product.price}
                </td>

                <td className="p-3"> 
                  {product.qty ?? 0}
                </td>

                <td className="flex gap-2 p-3">

                  <button
                    onClick={() => handleEdit(product)}
                    className="rounded bg-green-600 px-3 py-1 text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(product.id)}
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