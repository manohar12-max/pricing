# Pricing Configuration Module

This project is a pricing configuration system built using React (frontend) and Node.js with Express (backend). It allows administrators to define and manage dynamic pricing rules for transportation or delivery services.

## Features

- Create and edit pricing configurations
- Set base prices per day with distance slabs
- Configure additional price per km
- Add time-based multipliers for long-duration rides
- Define waiting charges (free minutes, interval, and charge)
- Input validation for numeric fields
- Clean and minimal UI using Tailwind CSS

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose

## Project Structure

│
├── frontend/pricing-ui/ # React frontend
│ └── src/
│ ├── components/ # CreatePricingForm,navbar,priceCalculator,PricingList
| |── pages/Home
│ └── App.js
│
├── server/ # Node.js backend
│ ├── modal/
│ ├── routes/
| |── controllers/
│ └── server.js

## Prerequisites

- Node.js (v18+)
- MongoDB running locally or via Atlas

## Getting Started

Backend/server
cd server
npm install
Create a .env file inside the server/ directory:
env

PORT=5000
MONGO_URI=mongodb://localhost:27017/pricing-config
npm run dev

Frontend
cd pricing-ui
npm install
npm run dev

Build for Production
cd client
npm run build
