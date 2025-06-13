import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const PricingList = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ Hook for navigation

  const fetchConfigs = async () => {
    try {
      const res = await API.get("/all");
      setConfigs(res.data.data);
    } catch (err) {
      console.error("Failed to fetch configs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this configuration?");
    if (!confirm) return;

    try {
      await API.delete(`/delete/${id}`);
      fetchConfigs();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Something went wrong during deletion.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`); // ✅ Navigate to the edit page
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto mt-8 p-6 bg-white border rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Pricing Configurations</h2>

      {configs.length === 0 ? (
        <p className="text-gray-600">No configurations found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border text-sm text-left">
            <thead className="bg-slate-100 text-gray-700">
              <tr>
                <th className="px-3 py-2 border">Name</th>
                <th className="px-3 py-2 border">Active</th>
                <th className="px-3 py-2 border">Base Prices</th>
                <th className="px-3 py-2 border">Price/KM</th>
                <th className="px-3 py-2 border">Time Multipliers</th>
                <th className="px-3 py-2 border">Waiting Charges</th>
                <th className="px-3 py-2 border">Created</th>
                <th className="px-3 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {configs.map((cfg) => (
                <tr key={cfg._id} className={cfg.isActive ? "bg-green-50" : ""}>
                  <td className="border px-3 py-2 font-semibold">{cfg.name}</td>
                  <td className="border px-3 py-2 text-center">{cfg.isActive ? "✅" : "❌"}</td>
                  <td className="border px-3 py-2">
                    {cfg.basePrices?.length ? (
                      cfg.basePrices.map((bp, i) => (
                        <div key={i}>
                          <strong>{bp.day}:</strong> ₹{bp.price} up to {bp.upto_km} km
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-500">Not set</span>
                    )}
                  </td>
                  <td className="border px-3 py-2">₹{cfg.additionalPricePerKm}</td>
                  <td className="border px-3 py-2">
                    {cfg.timeMultipliers?.length ? (
                      cfg.timeMultipliers.map((tm, i) => (
                        <div key={i}>
                          {tm.minDuration}–{tm.maxDuration} min → ×{tm.multiplier}
                        </div>
                      ))
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="border px-3 py-2">
                    Free: {cfg.waitingCharge?.initialFreeMinutes ?? "-"} min<br />
                    +₹{cfg.waitingCharge?.chargePerMinutes ?? "-"} every {cfg.waitingCharge?.intervalMinutes ?? "-"} min
                  </td>
                  <td className="border px-3 py-2">
                    {new Date(cfg.createdAt).toLocaleString()}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <button
                      onClick={() => handleEdit(cfg._id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cfg._id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PricingList;
