import React, { useState, useEffect } from "react";
import API from "../api/api";
import { useParams, useNavigate } from "react-router-dom";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CreatePricingForm = () => {
  const { id: editId } = useParams();
  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    isActive: true,
    basePrices: [{ day: "Mon", upto_km: 4, price: 80 }],
    additionalPricePerKm: "",
    timeMultipliers: [{ minDuration: 0, maxDuration: 60, multiplier: 1 }],
    waitingCharge: {
      initialFreeMinutes: 0,
      intervalMinutes: 0,
      chargePerMinutes: 0,
    },
  });

  useEffect(() => {
    if (editId) {
      const fetchData = async () => {
        try {
          const res = await API.get(`/${editId}`);
          const data = res.data.data;

          setFormData({
            name: data.name || "",
            isActive: data.isActive ?? true,
            basePrices: data.basePrices || [],
            additionalPricePerKm: data.additionalPricePerKm || "",
            timeMultipliers: data.timeMultipliers || [],
            waitingCharge: {
              initialFreeMinutes: data.waitingCharge?.initialFreeMinutes || 0,
              intervalMinutes: data.waitingCharge?.intervalMinutes || 0,
              chargePerMinutes: data.waitingCharge?.chargePerMinutes || 0,
            },
          });
          setIsEditMode(true);
        } catch (err) {
          console.error("Failed to load config", err);
        }
      };

      fetchData();
    }
  }, [editId]);

  const addBasePrice = () => {
    setFormData((prev) => ({
      ...prev,
      basePrices: [...prev.basePrices, { day: "Mon", upto_km: "", price: "" }],
    }));
  };

  const updateBasePrice = (index, field, value) => {
    const updated = [...formData.basePrices];
    updated[index][field] = value;
    setFormData({ ...formData, basePrices: updated });
  };

  const addTimeMultiplier = () => {
    setFormData((prev) => ({
      ...prev,
      timeMultipliers: [
        ...prev.timeMultipliers,
        { minDuration: "", maxDuration: "", multiplier: "" },
      ],
    }));
  };

  const updateTimeMultiplier = (index, field, value) => {
    const updated = [...formData.timeMultipliers];
    updated[index][field] = value;
    setFormData({ ...formData, timeMultipliers: updated });
  };

  const validateForm = () => {
    if (!formData.name.trim()) return alert("Configuration name is required.");
    if (isNaN(Number(formData.additionalPricePerKm)))
      return alert("Additional price per KM must be a number.");

    for (const [i, b] of formData.basePrices.entries()) {
      if (!b.day || isNaN(Number(b.price)) || isNaN(Number(b.upto_km))) {
        return alert(`Base price entry #${i + 1} is invalid.`);
      }
    }

    for (const [i, t] of formData.timeMultipliers.entries()) {
      if (
        isNaN(Number(t.minDuration)) ||
        isNaN(Number(t.maxDuration)) ||
        isNaN(Number(t.multiplier))
      ) {
        return alert(`Time multiplier #${i + 1} is invalid.`);
      }
    }

    const { initialFreeMinutes, intervalMinutes, chargePerMinutes } =
      formData.waitingCharge;
    if (
      isNaN(Number(initialFreeMinutes)) ||
      isNaN(Number(intervalMinutes)) ||
      isNaN(Number(chargePerMinutes))
    ) {
      return alert("Waiting charge fields must be valid numbers.");
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const cleanedData = {
      ...formData,
      additionalPricePerKm: Number(formData.additionalPricePerKm),
      basePrices: formData.basePrices.map((b) => ({
        ...b,
        price: Number(b.price),
        upto_km: Number(b.upto_km),
      })),
      timeMultipliers: formData.timeMultipliers.map((t) => ({
        ...t,
        minDuration: Number(t.minDuration),
        maxDuration: Number(t.maxDuration),
        multiplier: Number(t.multiplier),
      })),
      waitingCharge: {
        initialFreeMinutes: Number(formData.waitingCharge.initialFreeMinutes),
        intervalMinutes: Number(formData.waitingCharge.intervalMinutes),
        chargePerMinutes: Number(formData.waitingCharge.chargePerMinutes),
      },
    };

    try {
      if (isEditMode) {
        await API.put(`/update/${editId}`, cleanedData);
        alert("Pricing config updated!");
      } else {
        await API.post("/create", cleanedData);
        alert("Pricing config created!");
      }
      navigate("/configs");
    } catch (error) {
      console.error(error);
      alert("Failed to submit pricing config.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 p-4 border rounded shadow bg-white">
      <h2 className="text-xl font-semibold mb-4">
        {isEditMode ? "Edit Pricing Configuration" : "Create Pricing Configuration"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Configuration Name */}
        <div>
          <label className="block font-medium">Configuration Name</label>
          <input
            type="text"
            className="w-full p-2 border"
            placeholder="eg: City Bike Weekday Plan"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        {/* Active Status */}
        <div>
          <label className="block font-medium">Is Active</label>
          <select
            className="w-full p-2 border"
            value={formData.isActive}
            onChange={(e) =>
              setFormData({ ...formData, isActive: e.target.value === "true" })
            }
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Base Prices */}
        <div>
          <h3 className="font-medium">Base Prices</h3>
          {formData.basePrices.map((bp, index) => (
            <div key={index} className="bg-gray-50 p-3 mt-2 rounded">
              <label className="block">Day</label>
              <select
                className="w-full p-2 border"
                value={bp.day}
                onChange={(e) => updateBasePrice(index, "day", e.target.value)}
              >
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>

              <label className="block mt-2">Up to KM</label>
              <input
                type="text"
                className="w-full p-2 border"
                placeholder="eg: 4"
                value={bp.upto_km}
                onChange={(e) => updateBasePrice(index, "upto_km", e.target.value)}
              />

              <label className="block mt-2">Price (₹)</label>
              <input
                type="text"
                className="w-full p-2 border"
                placeholder="eg: 80"
                value={bp.price}
                onChange={(e) => updateBasePrice(index, "price", e.target.value)}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addBasePrice}
            className="mt-2 bg-gray-200 px-3 py-1 rounded"
          >
            + Add Base Price
          </button>
        </div>

        {/* Additional Price per KM */}
        <div>
          <label className="block font-medium">Additional Price Per KM</label>
          <input
            type="text"
            className="w-full p-2 border"
            placeholder="eg: 5"
            value={formData.additionalPricePerKm}
            onChange={(e) =>
              setFormData({ ...formData, additionalPricePerKm: e.target.value })
            }
          />
        </div>

        {/* Time Multipliers */}
        <div>
          <h3 className="font-medium">Time Multipliers</h3>
          {formData.timeMultipliers.map((tm, index) => (
            <div key={index} className="bg-gray-50 p-3 mt-2 rounded">
              <label className="block">Min Duration (min)</label>
              <input
                type="text"
                className="w-full p-2 border"
                placeholder="eg: 60"
                value={tm.minDuration}
                onChange={(e) =>
                  updateTimeMultiplier(index, "minDuration", e.target.value)
                }
              />

              <label className="block mt-2">Max Duration (min)</label>
              <input
                type="text"
                className="w-full p-2 border"
                placeholder="eg: 120"
                value={tm.maxDuration}
                onChange={(e) =>
                  updateTimeMultiplier(index, "maxDuration", e.target.value)
                }
              />

              <label className="block mt-2">Multiplier</label>
              <input
                type="text"
                className="w-full p-2 border"
                placeholder="eg: 1.5"
                value={tm.multiplier}
                onChange={(e) =>
                  updateTimeMultiplier(index, "multiplier", e.target.value)
                }
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addTimeMultiplier}
            className="mt-2 bg-gray-200 px-3 py-1 rounded"
          >
            + Add Time Multiplier
          </button>
        </div>

        {/* Waiting Charges */}
        <div>
          <h3 className="font-medium">Waiting Charges</h3>

          <label className="block">Initial Free Minutes</label>
          <input
            type="text"
            className="w-full p-2 border"
            placeholder="eg: 10"
            value={formData.waitingCharge.initialFreeMinutes}
            onChange={(e) =>
              setFormData({
                ...formData,
                waitingCharge: {
                  ...formData.waitingCharge,
                  initialFreeMinutes: e.target.value,
                },
              })
            }
          />

          <label className="block mt-2">Interval Minutes</label>
          <input
            type="text"
            className="w-full p-2 border"
            placeholder="eg: 5"
            value={formData.waitingCharge.intervalMinutes}
            onChange={(e) =>
              setFormData({
                ...formData,
                waitingCharge: {
                  ...formData.waitingCharge,
                  intervalMinutes: e.target.value,
                },
              })
            }
          />

          <label className="block mt-2">Charge Per Interval (₹)</label>
          <input
            type="text"
            className="w-full p-2 border"
            placeholder="eg: 2.5"
            value={formData.waitingCharge.chargePerMinutes}
            onChange={(e) =>
              setFormData({
                ...formData,
                waitingCharge: {
                  ...formData.waitingCharge,
                  chargePerMinutes: e.target.value,
                },
              })
            }
          />
        </div>

        {/* Submit */}
        <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
          {isEditMode ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default CreatePricingForm;
