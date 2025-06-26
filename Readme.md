
# Pricing Configuration Module

This project is a pricing configuration system built using React (frontend) and Node.js with Express (backend). It allows administrators to define and manage dynamic pricing rules for transportation or delivery services.

---

##  Features

- Create and edit pricing configurations
- Set base prices per day with distance slabs
- Configure additional price per km
- Add time-based multipliers for long-duration rides
- Define waiting charges (free minutes, interval, and charge)
- Input validation with Joi and custom middleware
- Clean and minimal UI using Tailwind CSS

---

##  Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Joi for validation
- Custom Express middleware

---

## 📁 Project Structure

```
pricing/
│
├── frontend/pricing-ui/          # React frontend
│   └── src/
│       ├── components/           # CreatePricingForm, Navbar, PricingList, etc.
│       ├── pages/                # Home, PricingPage
│       └── App.js
│
├── server/                       # Node.js backend
│   ├── controllers/             # Controller logic
│   ├── middleware/              # validate.js (middleware for request validation)
│   ├── modal/                   # Mongoose schema (pricingModal.js)
│   ├── routes/                  # Express routes (pricingRoutes.js)
│   ├── services/                # Any helper/business logic services
│   ├── validations/             # configValidation.js, priceValidation.js
│   ├── .env                     # Environment variables
│   └── server.js                # Entry point
```

---

## ✅ Prerequisites

- Node.js (v18+)
- MongoDB running locally or via MongoDB Atlas

---

##  Getting Started

### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory with the following:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/pricing-config
```

Start the backend:

```bash
npm run dev
```

---

### 2. Frontend Setup

```bash
cd frontend/pricing-ui
npm install
npm run dev
```

---

## 📦 Build for Production

```bash
cd frontend/pricing-ui
npm run build
```

---

## 🧪 Validation

All incoming requests to create or update pricing configurations go through:

- `middleware/validate.js`: Express middleware for validating request bodies.
- `validations/configValidation.js`: Joi schema for full configuration object.
- `validations/priceValidation.js`:  Modular Joi schemas for individual parts

---

## 🌐 API Endpoints (Sample)

| Method | Endpoint             | Description                       |
|--------|----------------------|-----------------------------------|
| POST   | `/create`            | Create a new pricing config       |
| POST   | `/calculate`         | Calculates a active pricing config|
| PUT    | `/update/:id`        | Update existing config            |
| GET    | `/all`               | List all pricing configurations   |
| GET    | `/:id`               | Get config by ID                  |
| GET    | `/active`            | Get config by active field true   |
| GET    | `/delete/:id`        | Delete config by id               |

---

## 🧠 Future Improvements

- Role-based admin authentication
- Pagination for config listing
- Export configurations
- Dashboard with analytics
- Versioning of pricing policies
---
