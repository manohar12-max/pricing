import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-slate-800 text-white px-6 py-3 shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          🚖 Smart Fare Manager
        </div>
        <div className="flex space-x-4 text-sm sm:text-base">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-yellow-300 font-semibold" : "hover:text-yellow-200"
            }
          >
            Home
          </NavLink>
          
          <NavLink
            to="/configs"
            className={({ isActive }) =>
              isActive ? "text-yellow-300 font-semibold" : "hover:text-yellow-200"
            }
          >
            Configs
          </NavLink>
          <NavLink
            to="/calculate"
            className={({ isActive }) =>
              isActive ? "text-yellow-300 font-semibold" : "hover:text-yellow-200"
            }
          >
            Simulate
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
