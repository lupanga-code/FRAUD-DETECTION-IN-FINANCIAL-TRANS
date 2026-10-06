export interface Transaction {
  TransactionID: string;
  CustomerID: string;
  Timestamp: string;
  Amount: number | string;
  Merchant: string;
  Location: string;
  Channel: string;
  FraudLabel: number | string;
}

export interface PredictionInput {
  amount: number;
  merchant: string;
  location: string;
  channel: string;
  hour?: number;
}

export interface RiskFactor {
  name: string;
  description: string;
  impact: 'high' | 'medium' | 'low' | 'neutral' | 'safe';
  score: number;
}

export interface PredictionResult {
  isFraud: boolean;
  fraudPercentage: number;
  legitPercentage: number;
  rawScore: number;
  confidence: 'High' | 'Moderate' | 'Low';
  riskFactors: RiskFactor[];
  input: PredictionInput;
  timestamp: string;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  tp: number;
  fp: number;
  tn: number;
  fn: number;
  total_samples: number;
  fraud_samples: number;
  genuine_samples: number;
}
