const web3 = new Web3(window.ethereum);
let accounts;
let contract;

const connectWallet = async () => {
  try {
    accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const networkId = await window.ethereum.request({ method: "net_version" });
    const deployedNetwork = OFuelNFTMarketplace.networks[networkId];
    contract = new web3.eth.Contract(
      OFuelNFTMarketplace.abi,
      deployedNetwork && deployedNetwork.address
    );
  } catch (error) {
    console.error(error);
  }
};

const mintNFT = async (name, description, imageURL) => {
  try {
    const result = await contract.methods.mintNFT(name, description, imageURL).send({ from: accounts[0] });
    alert(`Transaction hash: ${result.transactionHash}`);
  } catch (error) {
    console.error(error);
    alert(`Error: ${error.message}`);
  }
};

const handleFormSubmit = (event) => {
  event.preventDefault();
  const name = document.getElementById("nameInput").value.trim();
  const description = document.getElementById("descriptionInput").value.trim();
  const imageURL = document.getElementById("imageURLInput").value.trim();
  if (name && description && imageURL) {
    mintNFT(name, description, imageURL);
  } else {
    alert("Please fill in all fields.");
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  if (window.ethereum) {
    try {
      await connectWallet();
      document.getElementById("connectButton").addEventListener("click", connectWallet);
      document.getElementById("mintButton").addEventListener("click", handleFormSubmit);
    } catch (error) {
      console.error(error);
    }
  } else {
    alert("Please install MetaMask to use this dApp.");
  }
});
