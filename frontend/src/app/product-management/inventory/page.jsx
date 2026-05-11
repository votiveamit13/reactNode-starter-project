"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function InventoryPage() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [inventories, setInventories] = useState([]);
  const [products, setProducts] = useState([]);

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [stockStatus, setStockStatus] = useState("in_stock");

  const [editId, setEditId] = useState(null);

  // FETCH INVENTORY
  const fetchInventories = async () => {
    try {
      const res = await axios.get(`${API}/inventories`);
      setInventories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/product`);
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInventories();
    fetchProducts();
  }, []);

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      product_id: productId,
      quantity,
      purchase_price: purchasePrice,
      selling_price: sellingPrice,
      stock_status: stockStatus,
    };

    try {
      if (editId) {
        await axios.put(`${API}/inventories/${editId}`, payload);

        alert("Inventory updated");
      } else {
        await axios.post(`${API}/inventories`, payload);

        alert("Inventory added");
      }

      resetForm();

      fetchInventories();
    } catch (error) {
      console.log(error);
    }
  };

  // RESET
  const resetForm = () => {
    setProductId("");
    setQuantity("");
    setPurchasePrice("");
    setSellingPrice("");
    setStockStatus("in_stock");

    setEditId(null);
  };

  // EDIT
  const handleEdit = (item) => {
    setEditId(item.id);

    setProductId(item.product_id);

    setQuantity(item.quantity);

    setPurchasePrice(item.purchase_price);

    setSellingPrice(item.selling_price);

    setStockStatus(item.stock_status);
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!confirm("Delete inventory?")) return;

    try {
      await axios.delete(`${API}/inventories/${id}`);

      fetchInventories();

      alert("Deleted");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Inventory Management
      </h1>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded p-4 mb-6"
      >

        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="block mb-2">
              Product
            </label>

            <select
              className="w-full border p-2 rounded"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            >
              <option value="">
                Select Product
              </option>

              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">
              Quantity
            </label>

            <input
              type="number"
              className="w-full border p-2 rounded"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-2">
              Purchase Price
            </label>

            <input
              type="number"
              className="w-full border p-2 rounded"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2">
              Selling Price
            </label>

            <input
              type="number"
              className="w-full border p-2 rounded"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2">
              Stock Status
            </label>

            <select
              className="w-full border p-2 rounded"
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value)}
            >
              <option value="in_stock">
                In Stock
              </option>

              <option value="out_stock">
                Out Of Stock
              </option>
            </select>
          </div>

        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
          {editId ? "Update Inventory" : "Add Inventory"}
        </button>

      </form>

      {/* TABLE */}

      <div className="bg-white shadow rounded p-4 overflow-auto">

        <table className="w-full border">

          <thead>
            <tr className="bg-gray-100">

              <th className="border p-2">
                ID
              </th>

              <th className="border p-2">
                Product
              </th>

              <th className="border p-2">
                Quantity
              </th>

              <th className="border p-2">
                Purchase
              </th>

              <th className="border p-2">
                Selling
              </th>

              <th className="border p-2">
                Status
              </th>

              <th className="border p-2">
                Action
              </th>

            </tr>
          </thead>

          <tbody>

            {inventories.map((item) => (
              <tr key={item.id}>

                <td className="border p-2">
                  {item.id}
                </td>

                <td className="border p-2">
                  {item.product?.name}
                </td>

                <td className="border p-2">
                  {item.quantity}
                </td>

                <td className="border p-2">
                  {item.purchase_price}
                </td>

                <td className="border p-2">
                  {item.selling_price}
                </td>

                <td className="border p-2">
                  {item.stock_status}
                </td>

                <td className="border p-2 flex gap-2">

                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
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