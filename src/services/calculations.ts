/**
 * EXPANCE Calculation Services
 * Centralized, pure, deterministic calculation engine.
 * Protects against division by zero, float inaccuracies, and #REF! Excel anomalies.
 */

export const safeDiv = (numerator: number, denominator: number, fallback = 0): number => {
  if (!denominator || isNaN(denominator) || denominator === 0 || !isFinite(denominator)) {
    return fallback;
  }
  const result = numerator / denominator;
  return isFinite(result) ? Math.round(result * 100) / 100 : fallback;
};

export const round2 = (num: number): number => {
  if (isNaN(num) || !isFinite(num)) return 0;
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

export const formatCurrency = (amount: number, symbol = '৳'): string => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${symbol} 0.00`;
  }
  const isNegative = amount < 0;
  const absFormatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return isNegative ? `- ${symbol} ${absFormatted}` : `${symbol} ${absFormatted}`;
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const [year, month, day] = dateString.split('-');
    if (year && month && day) {
      return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
    }
    const d = new Date(dateString);
    if (!isNaN(d.getTime())) {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    }
  } catch {
    return dateString;
  }
  return dateString;
};

export const getDayName = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { weekday: 'long' });
    }
  } catch {
    return '';
  }
  return '';
};

export interface BikeLogInput {
  startingOdometer: number;
  endingOdometer: number;
  privateMileage?: number;
  earnAmount: number;
  platformRentCommission: number;
  fuelCost: number;
  engineOilCost: number;
  maintenanceCost: number;
  otherCost: number;
}

export const computeBikeDailyMetrics = (input: BikeLogInput) => {
  const starting = Math.max(0, Number(input.startingOdometer) || 0);
  const ending = Math.max(starting, Number(input.endingOdometer) || 0);
  const totalMileage = round2(ending - starting);

  const privateMileage = Math.max(0, Math.min(totalMileage, Number(input.privateMileage) || 0));
  const rideSharingMileage = round2(totalMileage - privateMileage);

  const earnAmount = Number(input.earnAmount) || 0;
  const commission = Number(input.platformRentCommission) || 0;
  const actualIncome = round2(earnAmount - commission);

  const fuelCost = Number(input.fuelCost) || 0;
  const engineOilCost = Number(input.engineOilCost) || 0;
  const maintenanceCost = Number(input.maintenanceCost) || 0;
  const otherCost = Number(input.otherCost) || 0;
  const totalBikeExpense = round2(fuelCost + engineOilCost + maintenanceCost + otherCost);

  const netBikeIncome = round2(actualIncome - totalBikeExpense);

  const incomePerKm = safeDiv(actualIncome, rideSharingMileage > 0 ? rideSharingMileage : totalMileage);
  const expensePerKm = safeDiv(totalBikeExpense, totalMileage);
  const profitPerKm = safeDiv(netBikeIncome, totalMileage);

  return {
    totalMileage,
    rideSharingMileage,
    privateMileage,
    actualIncome,
    totalBikeExpense,
    netBikeIncome,
    incomePerKm,
    expensePerKm,
    profitPerKm,
  };
};

export const computeFuelMetrics = (
  quantityLiters: number,
  pricePerUnit: number,
  kmDriven: number
) => {
  const qty = Math.max(0, Number(quantityLiters) || 0);
  const rate = Math.max(0, Number(pricePerUnit) || 0);
  const km = Math.max(0, Number(kmDriven) || 0);

  const totalCost = round2(qty * rate);
  const fuelEfficiencyKmPerL = safeDiv(km, qty);
  const fuelCostPerKm = safeDiv(totalCost, km);

  return {
    totalCost,
    fuelEfficiencyKmPerL,
    fuelCostPerKm,
  };
};
