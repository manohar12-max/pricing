const Pricing = require("../modal/pricingModal");

const createPricing = async (req, res) => {
  console.log("Creating new pricing configuration...", req.body);
  try {
    const { isActive } = req.body;
    if (isActive) {
      await Pricing.updateMany({}, { isActive: false });
      const newPricingConfig = new Pricing(req.body);
      await newPricingConfig.save();
      return res.status(201).json({
        success: true,
        message: "Pricing configuration created successfully",
        data: newPricingConfig,
      });
    }
    res
      .status(400)
      .json({
        success: false,
        message: "Missing or invalid 'isActive' field.",
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create pricing configuration",
      error: err.message,
    });
  }
};

const getAllConfigs = async (req, res) => {
  console.log("Fetching all pricing configurations...");
  try {
    const configs = await Pricing.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "All pricing configurations fetched successfully",
      data: configs,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getActiveConfig = async (req, res) => {
  console.log("Fetching active pricing configuration...");
  try {
    const activeConfig = await Pricing.findOne({ isActive: true });
    if (!activeConfig) {
      return res
        .status(404)
        .json({ error: "No active pricing configuration found" });
    }
    res.status(200).json({
      message: "Active pricing configuration fetched successfully",
      data: activeConfig,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPricingConfigById = async (req, res) => {
  try {
    const configId = req.params.id;
    const config = await Pricing.findById(configId);
    if (!config) {
      return res.status(404).json({ error: "Pricing configuration not found" });
    }
    res.status(200).json({
      message: "Pricing configuration fetched successfully",
      data: config,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePricingConfig = async (req, res) => {
  try {
    const configId = req.params.id;
    const { isActive } = req.body;
    if (isActive) {
      await Pricing.updateMany({}, { isActive: false });
    }
    const updatedConfig = await Pricing.findByIdAndUpdate(configId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedConfig) {
      return res.status(404).json({ error: "Pricing config not found" });
    }
    res.status(200).json({
      message: "Pricing configuration updated successfully",
      data: updatedConfig,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePricingConfig = async (req, res) => {
  try {
    const configId = req.params.id;
    const deleted = await Pricing.findByIdAndDelete(configId);
    if (!deleted) {
      return res.status(404).json({ error: "Pricing configuration not found" });
    }
    res.status(200).json({
      message: "Pricing configuration deleted successfully",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculatePrice = async (req, res) => {
  try {
    const { distanceKm, totalMinutes, waitingMinutes = 0, day } = req.body;

    if (typeof distanceKm !== "number" || typeof totalMinutes !== "number") {
      return res
        .status(400)
        .json({ error: "distanceKm and totalMinutes must be numbers." });
    }

    const config = await Pricing.findOne({ isActive: true });
    if (!config) {
      return res
        .status(404)
        .json({ error: "No active pricing configuration found." });
    }

    const targetDay =
      day || new Date().toLocaleDateString("en-US", { weekday: "short" });
    const base = config.basePrices.find((b) => b.day === targetDay);
    if (!base) {
      return res
        .status(400)
        .json({ error: `No base price defined for day: ${targetDay}` });
    }

    const DBP = base.price;
    const upto_km = base.upto_km;
    const DAP = config.additionalPricePerKm;
    const Dn = Math.max(0, distanceKm - upto_km);
    const distanceCost = DBP + Dn * DAP;

    let TMF = 1;

    for (const slab of config.timeMultipliers || []) {
      if (
        totalMinutes >= slab.minDuration &&
        totalMinutes <= slab.maxDuration
      ) {
        TMF = Math.max(TMF, slab.multiplier);
      }
    }
    const timeCost = totalMinutes * TMF;
    const {
      initialFreeMinutes = 0,
      intervalMinutes = 1,
      chargePerMinutes = 0,
    } = config.waitingCharge || {};

    let WC = 0;
    if (waitingMinutes > initialFreeMinutes) {
      const chargeableMinutes = waitingMinutes - initialFreeMinutes;
      const intervals = Math.ceil(chargeableMinutes / intervalMinutes);
      WC = intervals * chargePerMinutes;
    }

    const totalPrice = distanceCost + timeCost + WC;

    return res.status(200).json({
      message: "Price calculated successfully",
      day: targetDay,
      formulaBreakdown: {
        DBP,
        Dn,
        DAP,
        distanceCost: Math.round(distanceCost),
        Tn: totalMinutes,
        TMF,
        timeCost: Math.round(timeCost),
        WC,
        totalPrice: Math.round(totalPrice),
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Server error calculating price." });
  }
};

module.exports = {
  createPricing,
  getAllConfigs,
  getActiveConfig,
  getPricingConfigById,
  updatePricingConfig,
  deletePricingConfig,
  calculatePrice,
};
