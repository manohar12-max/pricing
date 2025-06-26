const Joi = require("joi");

const validDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const calculateSchema = Joi.object({
  distanceKm: Joi.number().positive().required().messages({
    "number.base": `"distanceKm" must be a number`,
    "number.positive": `"distanceKm" must be positive`,
    "any.required": `"distanceKm" is required`,
  }),

  totalMinutes: Joi.number().positive().required().messages({
    "number.base": `"totalMinutes" must be a number`,
    "number.positive": `"totalMinutes" must be positive`,
    "any.required": `"totalMinutes" is required`,
  }),

  waitingMinutes: Joi.number().min(0).optional().messages({
    "number.base": `"waitingMinutes" must be a number`,
    "number.min": `"waitingMinutes" cannot be negative`,
  }),

  day: Joi.string()
    .valid(...validDays)
    .optional()
    .messages({
      "any.only": `"day" must be a valid weekday (Mon, Tue, ...)`,
    }),
});

module.exports = { calculateSchema };
