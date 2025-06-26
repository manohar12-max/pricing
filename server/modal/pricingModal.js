const mongoose = require("mongoose");

const PricingConfigSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    basePrices: [
      {
        day: {
          type: String,
          enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        upto_km: {
          type: Number,
          required: true,
        },
      },
    ],

    additionalPricePerKm: {
      type: Number,
      required: true,
      default:10,
    },

    timeMultipliers: [
      {
        minDuration: {
          type: Number,
          required: true,
        },
        maxDuration: {
          type: Number,
          required: true,
        },
        multiplier: {
          type: Number,
          required: true,
        },
      },
    ],

    waitingCharge: {
      initialFreeMinutes: {
        type: Number,
        default: 3,
      },
      intervalMinutes: {
        type: Number,
        default: 3,
      },
      chargePerMinutes: {
        type: Number,
        required: true,
      },
    },

    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pricing", PricingConfigSchema);
