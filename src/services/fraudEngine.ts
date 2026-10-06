import { MODEL_CONFIG } from '../data/modelData';
import { PredictionInput, PredictionResult, RiskFactor } from '../types';

export function normalizeChannel(channel: string): string {
  const c = channel.trim().toLowerCase();
  if (c.includes('atm')) return 'ATM';
  if (c.includes('mobile') || c.includes('app')) return 'MobileApp';
  if (c.includes('pos') || c.includes('point of sale')) return 'POS';
  if (c.includes('web') || c.includes('online')) return 'Web';
  return 'Web';
}

export function normalizeLocation(location: string): string {
  const loc = location.trim().toLowerCase().replace(/[\s_]+/g, '-');
  if (loc.includes('dar')) return 'Dar-es-Salaam';
  if (loc.includes('zan')) return 'Zanzibar';
  if (loc.includes('aru')) return 'Arusha';
  if (loc.includes('dod')) return 'Dodoma';
  if (loc.includes('mbe')) return 'Mbeya';
  if (loc.includes('mwa')) return 'Mwanza';
  return 'Dar-es-Salaam';
}

export function normalizeMerchant(merchant: string): string {
  const m = merchant.trim().toLowerCase().replace(/[\s_]+/g, '');
  if (m.includes('kahawa')) return 'KahawaCafe';
  if (m.includes('airtel')) return 'AirtelMoney';
  if (m.includes('crdb')) return 'CRDB_Bank';
  if (m.includes('nbc')) return 'NBC_Bank';
  if (m.includes('nmb')) return 'NMB_Bank';
  if (m.includes('shoprite')) return 'Shoprite';
  if (m.includes('tigo')) return 'TigoPesa';
  if (m.includes('voda') || m.includes('mpesa')) return 'Vodacom_M-Pesa';
  return merchant;
}

export function predictFraud(input: PredictionInput): PredictionResult {
  const normMerchant = normalizeMerchant(input.merchant);
  const normLocation = normalizeLocation(input.location);
  const normChannel = normalizeChannel(input.channel);
  const hour = input.hour !== undefined ? input.hour : 12;

  const { mean_amt, std_amt, weights } = MODEL_CONFIG;

  // Normalized amount
  const normAmount = (input.amount - mean_amt) / std_amt;
  const isUnusualHour = hour < 6 || hour > 22 ? 1 : 0;

  // Compute logit score
  let z = weights.bias || 0.05;
  const riskFactors: RiskFactor[] = [];

  // Amount contribution
  const amtContribution = normAmount * (weights.Amount_norm || 0.23);
  z += amtContribution;
  if (input.amount > mean_amt + std_amt) {
    riskFactors.push({
      name: 'High Transaction Amount',
      description: `Amount (TSh ${input.amount.toLocaleString()}) is significantly higher than average (TSh ${mean_amt.toLocaleString()}).`,
      impact: 'high',
      score: Math.round(amtContribution * 25),
    });
  } else if (input.amount > mean_amt) {
    riskFactors.push({
      name: 'Elevated Amount',
      description: `Amount is slightly above the benchmark mean (TSh ${mean_amt.toLocaleString()}).`,
      impact: 'medium',
      score: Math.round(amtContribution * 20),
    });
  } else {
    riskFactors.push({
      name: 'Standard Amount Range',
      description: `Amount is within normal baseline parameters.`,
      impact: 'safe',
      score: Math.round(amtContribution * 15),
    });
  }

  // Channel contribution
  const channelKey = `Channel_${normChannel}`;
  const channelWeight = weights[channelKey] || 0;
  z += channelWeight;

  if (normChannel === 'ATM') {
    riskFactors.push({
      name: 'High-Risk Channel (ATM)',
      description: 'ATM withdrawals demonstrate the highest fraud concentration (93.2%) in historical data.',
      impact: 'high',
      score: 35,
    });
  } else if (normChannel === 'Web') {
    riskFactors.push({
      name: 'Online/Web Channel',
      description: 'Web checkout sessions carry moderate card-not-present risk.',
      impact: 'medium',
      score: 15,
    });
  } else if (normChannel === 'POS') {
    riskFactors.push({
      name: 'Low-Risk In-Person POS',
      description: 'Physical terminal chip/swipe verification reduces fraudulent exposure.',
      impact: 'safe',
      score: -20,
    });
  } else {
    riskFactors.push({
      name: 'Mobile App Channel',
      description: 'Device-authenticated mobile application transaction.',
      impact: 'safe',
      score: -15,
    });
  }

  // Merchant contribution
  const merchantKey = `Merchant_${normMerchant}`;
  const merchantWeight = weights[merchantKey] || 0;
  z += merchantWeight;

  if (normMerchant === 'AirtelMoney' || normMerchant === 'Vodacom_M-Pesa') {
    riskFactors.push({
      name: `Telecom Wallet (${normMerchant})`,
      description: 'Digital money transfers show higher velocity risk in mobile payment corridors.',
      impact: 'medium',
      score: 12,
    });
  } else if (normMerchant === 'KahawaCafe' || normMerchant === 'CRDB_Bank' || normMerchant === 'TigoPesa') {
    riskFactors.push({
      name: `Established Merchant (${normMerchant})`,
      description: 'Reputable vendor with lower historical dispute and fraud rates.',
      impact: 'safe',
      score: -18,
    });
  }

  // Location contribution
  const locSafeKey = `Location_${normLocation.replace(/-/g, '_')}`;
  const locWeight = weights[locSafeKey] || weights[`Location_${normLocation}`] || 0;
  z += locWeight;

  if (normLocation === 'Arusha' || normLocation === 'Dar-es-Salaam') {
    riskFactors.push({
      name: `High-Activity Metro Hub (${normLocation})`,
      description: 'High transaction frequency zone with elevated fraud incident density.',
      impact: 'medium',
      score: 10,
    });
  }

  // Unusual hour
  if (isUnusualHour) {
    const hourWeight = weights.UnusualHour || 0.036;
    z += hourWeight;
    riskFactors.push({
      name: 'Nighttime / Off-Hours Transaction',
      description: `Transaction initiated at ${hour}:00, outside regular daytime shopping hours (6am-10pm).`,
      impact: 'medium',
      score: 15,
    });
  }

  // Sigmoid probability calculation
  const clampedZ = Math.max(-10, Math.min(10, z));
  const rawProb = 1 / (1 + Math.exp(-clampedZ));
  const fraudPercentage = Math.min(99.9, Math.max(0.1, Number((rawProb * 100).toFixed(2))));
  const legitPercentage = Number((100 - fraudPercentage).toFixed(2));
  const isFraud = fraudPercentage >= 50.0;

  let confidence: 'High' | 'Moderate' | 'Low' = 'Moderate';
  if (fraudPercentage >= 75 || fraudPercentage <= 25) {
    confidence = 'High';
  } else if (fraudPercentage >= 60 || fraudPercentage <= 40) {
    confidence = 'Moderate';
  } else {
    confidence = 'Low';
  }

  return {
    isFraud,
    fraudPercentage,
    legitPercentage,
    rawScore: Number(clampedZ.toFixed(3)),
    confidence,
    riskFactors,
    input,
    timestamp: new Date().toISOString(),
  };
}
