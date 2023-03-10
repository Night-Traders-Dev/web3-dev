import contract from './contract';

// Get Elements from DOM
const cardsContainer = document.querySelector('.cards-container');
const createNFTForm = document.querySelector('.create-nft-form');
const createNFTButton = document.querySelector('.create-nft-button');

// Listen for Submit on Create NFT Form
createNFTForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Get Form Data
  const formData = new FormData(createNFTForm);

  // Create New NFT
  try {
    await contract.methods.createNFT(formData.get('name'), formData.get('description'), formData.get('imageURL')).send({ from: web3.eth.defaultAccount });
    alert('NFT created successfully!');
    window.location.reload();
  } catch (error) {
    alert(`Failed to create NFT: ${error.message}`);
  }
});

// Load NFTs
try {
  const nfts = await contract.methods.getNFTs().call();
  nfts.forEach((nft) => {
    const card = createNFTCard(nft);
    cardsContainer.appendChild(card);
  });
} catch (error) {
  alert(`Failed to load NFTs: ${error.message}`);
}

// Create NFT Card
function createNFTCard(nft) {
  const card = document.createElement('div');
  card.classList.add('card');

  const image = document.createElement('img');
  image.src = nft.imageURL;
  card.appendChild(image);

  const title = document.createElement('h2');
  title.textContent = nft.name;
  card.appendChild(title);

  const description = document.createElement('p');
  description.textContent = nft.description;
  card.appendChild(description);

  const button = document.createElement('button');
  button.textContent = 'Buy';
  button.addEventListener('click', async () => {
    try {
      await contract.methods.buyNFT(nft.id).send({ from: web3.eth.defaultAccount, value: web3.utils.toWei(nft.price, 'ether') });
      alert(`You bought ${nft.name} for ${nft.price} ETH!`);
      window.location.reload();
    } catch (error) {
      alert(`Failed to buy NFT: ${error.message}`);
    }
  });

  return card;
}
