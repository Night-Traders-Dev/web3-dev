// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract NFTMarketplace {
    using SafeMath for uint256;

    address public owner;

    struct Listing {
        address nftContract;
        uint256 tokenId;
        uint256 price;
        bool active;
    }

    Listing[] public listings;

    event ListingCreated(uint256 indexed listingId, address indexed nftContract, uint256 indexed tokenId, uint256 price);
    event ListingCancelled(uint256 indexed listingId, address indexed nftContract, uint256 indexed tokenId);
    event ListingSold(uint256 indexed listingId, address indexed nftContract, uint256 indexed tokenId, address buyer);

    constructor() {
        owner = msg.sender;
    }

    function createListing(address _nftContract, uint256 _tokenId, uint256 _price) external {
        IERC721(_nftContract).transferFrom(msg.sender, address(this), _tokenId);
        listings.push(Listing({
            nftContract: _nftContract,
            tokenId: _tokenId,
            price: _price,
            active: true
        }));
        uint256 listingId = listings.length.sub(1);
        emit ListingCreated(listingId, _nftContract, _tokenId, _price);
    }

    function cancelListing(uint256 _listingId) external {
        Listing storage listing = listings[_listingId];
        require(msg.sender == owner || msg.sender == IERC721(listing.nftContract).ownerOf(listing.tokenId), "Not authorized");
        IERC721(listing.nftContract).transferFrom(address(this), msg.sender, listing.tokenId);
        listing.active = false;
        emit ListingCancelled(_listingId, listing.nftContract, listing.tokenId);
    }

    function buyListing(uint256 _listingId) external payable {
        Listing storage listing = listings[_listingId];
        require(listing.active, "Listing not active");
        require(msg.value == listing.price, "Incorrect payment amount");
        address seller = IERC721(listing.nftContract).ownerOf(listing.tokenId);
        IERC721(listing.nftContract).transferFrom(seller, msg.sender, listing.tokenId);
        payable(owner).transfer(msg.value);
        listing.active = false;
        emit ListingSold(_listingId, listing.nftContract, listing.tokenId, msg.sender);
    }

    function withdraw() external {
        require(msg.sender == owner, "Not authorized");
        payable(owner).transfer(address(this).balance);
    }

    function getListingCount() external view returns (uint256) {
        return listings.length;
    }

    function getListing(uint256 _listingId) external view returns (address nftContract, uint256 tokenId, uint256 price, bool active) {
        Listing storage listing = listings[_listingId];
        nftContract = listing.nftContract;
        tokenId = listing.tokenId;
        price = listing.price;
        active = listing.active;
    }
}
