const Pricing = require("../modal/pricingModal");
const calculatePriceLogic = require("../services/priceCalculator");

const createPricing = async (req, res) => {
  try {
    const { isActive } = req.body;
    if (isActive) {
      await Pricing.updateMany({}, { isActive: false });
    }

    const newPricing = new Pricing(req.body);
    await newPricing.save();

    res.status(201).json({
      success: true,
      message: "Pricing configuration created successfully",
      data: newPricing,
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
  try {
    const configs = await Pricing.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "All pricing configurations fetched successfully",
      data: configs,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getActiveConfig = async (req, res) => {
  try {
    const config = await Pricing.findOne({ isActive: true });
    if (!config) {
      return res.status(404).json({
        success: false,
        error: "No active pricing configuration found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Active pricing configuration fetched successfully",
      data: config,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getPricingConfigById = async (req, res) => {
  try {
    const config = await Pricing.findById(req.params.id);
    if (!config) {
      return res.status(404).json({
        success: false,
        error: "Pricing configuration not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Pricing configuration fetched successfully",
      data: config,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const updatePricingConfig = async (req, res) => {
  try {
    const { isActive } = req.body;
    if (isActive) {
      await Pricing.updateMany({}, { isActive: false });
    }

    const updatedConfig = await Pricing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedConfig) {
      return res.status(404).json({
        success: false,
        error: "Pricing config not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pricing configuration updated successfully",
      data: updatedConfig,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const deletePricingConfig = async (req, res) => {
  try {
    const deleted = await Pricing.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Pricing configuration not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Pricing configuration deleted successfully",
      data: deleted,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const calculatePrice = async (req, res) => {
  try {
    const config = await Pricing.findOne({ isActive: true });
    if (!config) {
      return res.status(404).json({
        success: false,
        error: "No active pricing configuration found.",
      });
    }

    const result = calculatePriceLogic(config, req.body);

    res.status(200).json({
      success: true,
      message: "Price calculated successfully",
      ...result,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
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
