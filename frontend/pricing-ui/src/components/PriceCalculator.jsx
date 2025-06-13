import React, { useState } from "react";
import API from "../api/api";

const PriceCalculator = () => {
  const [distanceKm, setDistanceKm] = useState("");
  const [totalMinutes, setTotalMinutes] = useState("");
  const [waitingMinutes, setWaitingMinutes] = useState("");
  const [day, setDay] = useState(""); // optional day input
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    try {
      const payload = {
        distanceKm: Number(distanceKm),
        totalMinutes: Number(totalMinutes),
        waitingMinutes: Number(waitingMinutes),
      };

      if (day) payload.day = day;

      const res = await API.post("/calculate", payload);
      setResult(res.data.formulaBreakdown || res.data.data); // fallback if backend uses 'data'
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded bg-white shadow">
      <h2 className="text-xl font-bold mb-6">Ride Price Calculator</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Distance (in km)</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={distanceKm}
            onChange={(e) => setDistanceKm(e.target.value)}
            placeholder="e.g. 12"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ride Duration (in minutes)</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={totalMinutes}
            onChange={(e) => setTotalMinutes(e.target.value)}
            placeholder="e.g. 75"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Waiting Time (in minutes)</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={waitingMinutes}
            onChange={(e) => setWaitingMinutes(e.target.value)}
            placeholder="e.g. 10"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Day (optional)</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          >
            <option value="">Today</option>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Calculate Price
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-400 rounded">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Total Price: ₹{result.totalPrice}
          </h3>
          <ul className="text-sm space-y-1">
            <li><strong>Day:</strong> {result.day || day || "Today"}</li>
            <li><strong>DBP (Base Price):</strong> ₹{result.DBP}</li>
            <li><strong>Dn (Extra Distance):</strong> {result.Dn} km</li>
            <li><strong>DAP (Additional/km):</strong> ₹{result.DAP}</li>
            <li><strong>Distance Cost:</strong> ₹{result.distanceCost}</li>
            <li><strong>Tn (Total Minutes):</strong> {result.Tn}</li>
            <li><strong>TMF (Time Multiplier):</strong> ×{result.TMF}</li>
            <li><strong>Time Cost:</strong> ₹{result.timeCost}</li>
            <li><strong>WC (Waiting Charge):</strong> ₹{result.WC}</li>
          </ul>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-600 text-sm font-medium">{error}</div>
      )}
    </div>
  );
};

export default PriceCalculator;
