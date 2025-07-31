// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "hardhat/console.sol";

contract NFTMarketplace is ERC721URIStorage, ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    uint256 public platformFeeBasisPoints = 250; // 2.5% = 250 / 10,000
    address payable public owner;

    mapping(uint256 => MarketItem) private idToMarketItem;
    mapping(uint256 => address) private minters;

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    event MarketItemCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    constructor() ERC721("Metaverse Tokens", "METT") {
        owner = payable(msg.sender);
    }

    // Admin can update the fee
    function updatePlatformFee(uint256 newFeeBps) public {
        require(msg.sender == owner, "Only owner can update fee");
        require(newFeeBps <= 1000, "Fee too high"); // max 10%
        platformFeeBasisPoints = newFeeBps;
    }

    function getMarketItem(uint256 tokenId)
        public
        view
        returns (MarketItem memory)
    {
        return idToMarketItem[tokenId];
    }

    function createToken(string memory metadataURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, metadataURI);
        minters[newTokenId] = msg.sender;

        return newTokenId;
    }

    function getMinter(uint256 tokenId) public view returns (address) {
        return minters[tokenId];
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function listToken(uint256 tokenId, uint256 price) public {
        require(price > 0, "Price must be at least 1 wei");
        require(ownerOf(tokenId) == msg.sender, "You must own the token");

        idToMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );

        _transfer(msg.sender, address(this), tokenId);
        emit MarketItemCreated(
            tokenId,
            msg.sender,
            address(this),
            price,
            false
        );
    }

    function resellToken(uint256 tokenId, uint256 price) public {
        require(
            idToMarketItem[tokenId].owner == msg.sender,
            "Only item owner can resell"
        );
        require(price > 0, "Price must be greater than 0");

        idToMarketItem[tokenId].sold = false;
        idToMarketItem[tokenId].price = price;
        idToMarketItem[tokenId].seller = payable(msg.sender);
        idToMarketItem[tokenId].owner = payable(address(this));
        _itemsSold.decrement();

        _transfer(msg.sender, address(this), tokenId);
    }

    function createMarketSale(uint256 tokenId) public payable {
        uint256 price = idToMarketItem[tokenId].price;
        address seller = idToMarketItem[tokenId].seller;

        require(msg.value == price, "Submit full price");

        // Calculate platform fee
        uint256 feeAmount = (price * platformFeeBasisPoints) / 10000;
        uint256 sellerAmount = price - feeAmount;

        idToMarketItem[tokenId].owner = payable(msg.sender);
        idToMarketItem[tokenId].sold = true;
        idToMarketItem[tokenId].seller = payable(address(0));

        _itemsSold.increment();
        _transfer(address(this), msg.sender, tokenId);

        // Payouts
        payable(seller).transfer(sellerAmount);
    }

    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _tokenIds.current();
        uint256 unsoldItemCount = itemCount - _itemsSold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(this)) {
                items[currentIndex] = idToMarketItem[i + 1];
                currentIndex++;
            }
        }
        return items;
    }

    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount++;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                items[currentIndex] = idToMarketItem[i + 1];
                currentIndex++;
            }
        }
        return items;
    }

    function fetchItemsListed() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount++;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                items[currentIndex] = idToMarketItem[i + 1];
                currentIndex++;
            }
        }
        return items;
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdrawFees() external {
        require(msg.sender == owner, "Only owner can withdraw");
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(owner).transfer(balance);
    }
}
