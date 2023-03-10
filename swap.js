import { getExchangeRate } from './exchange.js';

// DOM Elements
const fromAmountEl = document.querySelector('#fromAmount');
const toAmountEl = document.querySelector('#toAmount');
const swapSummaryFromEl = document.querySelector('.swap-summary .from-amount');
const swapSummaryToEl = document.querySelector('.swap-summary .to-amount');
const successMessageEl = document.querySelector('.success-message');

export async function handleTokenSwap(event) {
  event.preventDefault();

  // Get input values
  const fromAmount = parseFloat(fromAmountEl.value);
  const toAmount = await convertToToken(fromAmount);

  // Update swap summary
  swapSummaryFromEl.textContent = `${fromAmount.toFixed(2)} ETH`;
  swapSummaryToEl.textContent = `${toAmount.toFixed(2)} ōFuel`;

  // Clear input fields
  fromAmountEl.value = '';
  toAmountEl.value = '';

  // Show success message
  successMessageEl.textContent = 'Token swap successful!';
}

async function convertToToken(ethAmount) {
  const exchangeRate = await getExchangeRate();
  return ethAmount * exchangeRate;
}
