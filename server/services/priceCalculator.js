function calculatePriceLogic(
  config,
  { distanceKm, totalMinutes, waitingMinutes = 0, day }
) {
  const targetDay =
    day || new Date().toLocaleDateString("en-US", { weekday: "short" });

  const base = config.basePrices.find((b) => b.day === targetDay);
  if (!base) throw new Error(`No base price for day: ${targetDay}`);

  const DBP = base.price;
  const upto_km = base.upto_km;
  const DAP = config.additionalPricePerKm;
  const Dn = Math.max(0, distanceKm - upto_km);
  const distanceCost = DBP + Dn * DAP;

  let TMF = 1;
  let found = false;

  for (const slab of config.timeMultipliers || []) {
    if (totalMinutes >= slab.minDuration && totalMinutes <= slab.maxDuration) {
      TMF = slab.multiplier;
      found = true;
      break;
    }
  }


  if (!found) {
    const fallback = config.timeMultipliers
      .filter((slab) => totalMinutes > slab.maxDuration)
      .sort((a, b) => b.maxDuration - a.maxDuration)[0];

    if (fallback) TMF = fallback.multiplier;
  }

  const timeCost = totalMinutes * TMF;

  const {
    initialFreeMinutes = 0,
    intervalMinutes = 1,
    chargePerMinutes = 0,
  } = config.waitingCharge || {};

  const actualInterval = intervalMinutes === 0 ? 1 : intervalMinutes;

  let WC = 0;
  if (waitingMinutes > initialFreeMinutes) {
    const chargeableMinutes = waitingMinutes - initialFreeMinutes;
    const intervals = Math.ceil(chargeableMinutes / actualInterval);
    WC = intervals * chargePerMinutes;
  }

  const totalPrice = distanceCost + timeCost + WC;

  return {
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
  };
}

module.exports = calculatePriceLogic;
