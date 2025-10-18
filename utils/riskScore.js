export function computeRiskScore(params){
  const {
    tradeValueUSD = 0,
    avgDailyVolumeUSD = 1,
    priceImpactPercent = 0,
    insiderSellRatio = 0,
    timeSinceLastTradeDays = 30
  } = params || {};

  const volFactor = Math.min(1, tradeValueUSD / Math.max(1, avgDailyVolumeUSD));
  const impactFactor = Math.min(1, priceImpactPercent / 5);
  const sellRatioFactor = Math.min(1, insiderSellRatio);
  const recencyFactor = Math.max(0, 1 - Math.min(30, timeSinceLastTradeDays) / 30);

  const score = (
    volFactor * 0.35 +
    impactFactor * 0.30 +
    sellRatioFactor * 0.20 +
    recencyFactor * 0.15
  ) * 100;

  return Math.round(score);
}
