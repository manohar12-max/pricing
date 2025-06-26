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
const { configSchema } = require('../validations/configValidation');
const { calculateSchema } = require('../validations/priceValidation');
const validate = require('../middleware/validate');

router.post('/create', validate(configSchema), createPricing);
router.get('/all', getAllConfigs);
router.get('/active', getActiveConfig);
router.get('/:id', getPricingConfigById);
router.put('/update/:id', validate(configSchema), updatePricingConfig);
router.delete('/delete/:id', deletePricingConfig);
router.post('/calculate', validate(calculateSchema), calculatePrice);

module.exports = router;
