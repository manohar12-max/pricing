const Joi = require("joi");

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const basePriceSchema = Joi.object({
  day: Joi.string().valid(...daysOfWeek).required(),
  price: Joi.number().min(0).required(),
  upto_km: Joi.number().min(0).required(),
});

const timeMultiplierSchema = Joi.object({
  minDuration: Joi.number().min(0).required(),
  maxDuration: Joi.number().min(Joi.ref("minDuration")).required(),
  multiplier: Joi.number().min(0).required(),
});

const waitingChargeSchema = Joi.object({
  initialFreeMinutes: Joi.number().min(0).required(),
  intervalMinutes: Joi.number().min(1).required(),
  chargePerMinutes: Joi.number().min(0).required(),
});

const configSchema = Joi.object({
  name: Joi.string().required(),
  isActive: Joi.boolean().required(),
  basePrices: Joi.array()
    .items(basePriceSchema)
    .min(1)
    .required()
    .custom((value, helpers) => {
      const seen = new Set();
      for (const item of value) {
        if (seen.has(item.day)) {
          return helpers.message(`Duplicate base price entry for day: ${item.day}`);
        }
        seen.add(item.day);
      }
      return value;
    }, "Unique days check"),
  additionalPricePerKm: Joi.number().min(5).required(),
  timeMultipliers: Joi.array()
    .items(timeMultiplierSchema)
    .custom((value, helpers) => {
      for (let i = 1; i < value.length; i++) {
        const prev = value[i - 1];
        const curr = value[i];
        if (curr.minDuration <= prev.maxDuration) {
          return helpers.message(
            `Time multiplier overlap: entry ${i} starts at ${curr.minDuration} which overlaps with previous ending at ${prev.maxDuration}`
          );
        }
      }
      return value;
    }, "Non-overlapping time durations")
    .required(),
  waitingCharge: waitingChargeSchema.required(),
});

module.exports = {
  configSchema,
};
