const express = require('express');
const router = express.Router();
const {
  createPricing,
  getAllConfigs,
  getActiveConfig,
  updatePricingConfig,
  deletePricingConfig,
  calculatePrice,
  getPricingConfigById
} = require('../controllers/pricingControllers');

router.post('/create', createPricing);
router.get('/all', getAllConfigs);
router.get('/active', getActiveConfig);
router.get('/:id', getPricingConfigById);
router.put('/update/:id', updatePricingConfig);
router.delete('/delete/:id', deletePricingConfig);
router.post('/calculate', calculatePrice);

module.exports = router;