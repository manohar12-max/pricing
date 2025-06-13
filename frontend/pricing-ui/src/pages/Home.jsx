import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="max-w-5xl mx-auto p-8 mt-10 bg-white shadow rounded-xl">
      <h1 className="text-3xl font-bold mb-4 text-slate-800">🚖 Welcome to Smart Fare Manager</h1>
      <p className="text-gray-700 mb-6">
        Manage dynamic pricing rules, simulate trip fares, and streamline your fare strategy.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link to="/create">
          <div className="bg-blue-100 hover:bg-blue-200 p-6 rounded-xl shadow text-center transition">
            <h2 className="text-xl font-semibold text-blue-800">➕ Create Config</h2>
            <p className="text-sm mt-2 text-blue-700">Define new pricing strategy</p>
          </div>
        </Link>

        <Link to="/configs">
          <div className="bg-green-100 hover:bg-green-200 p-6 rounded-xl shadow text-center transition">
            <h2 className="text-xl font-semibold text-green-800">📋 View Configs</h2>
            <p className="text-sm mt-2 text-green-700">Browse & manage all configs</p>
          </div>
        </Link>

        <Link to="/calculate">
          <div className="bg-purple-100 hover:bg-purple-200 p-6 rounded-xl shadow text-center transition">
            <h2 className="text-xl font-semibold text-purple-800">🧮 Simulate Price</h2>
            <p className="text-sm mt-2 text-purple-700">Test trip pricing logic</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
