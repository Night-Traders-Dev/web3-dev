// Connect to Web3 Provider
let web3;
try {
  // Modern dapp browsers...
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider);
  }
  // Non-dapp browsers...
  else {
    alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    return;
  }
} catch (error) {
  alert(`Failed to connect to Web3 Provider: ${error.message}`);
  return;
}

export default web3;
