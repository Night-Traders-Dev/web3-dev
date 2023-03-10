import { getExchangeRate } from './exchange.js';
import { handleTokenSwap } from './swap.js';

// DOM Elements
const form = document.querySelector('form');
const exchangeRateEl = document.querySelector('.exchange-rate .value');
const swapSummaryFromEl = document.querySelector('.swap-summary .from-amount');
const swapSummaryToEl = document.querySelector('.swap-summary .to-amount');
const successMessageEl = document.querySelector('.success-message');

// Event Listeners
form.addEventListener('submit', handleTokenSwap);

// On Load
async function init() {
  // Display exchange rate
  const exchangeRate = await getExchangeRate();
  exchangeRateEl.textContent = `1 ETH = ${exchangeRate} ōFuel`;

  // Clear swap summary
  swapSummaryFromEl.textContent = '';
  swapSummaryToEl.textContent = '';
  successMessageEl.textContent = '';
}

init();
