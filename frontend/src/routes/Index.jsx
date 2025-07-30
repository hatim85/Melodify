import React from 'react';
import { Routes, Route, Router } from 'react-router-dom';
import Home from '../pages/Home';
import CreateNFT from '../pages/CreateNFT';
import ListedNFTs from '../pages/ListedNFTs';
import MyNFTs from '../pages/MyNFTs';
import NFTDetails from '../pages/NFTDetails';
import ResellNFT from '../pages/ResellNFT';

const AppRoutes = () => (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create-nft" element={<CreateNFT />} />
      <Route path="/listed-nfts" element={<ListedNFTs />} />
      <Route path="/my-nfts" element={<MyNFTs />} />
      <Route path="/nft-details/:tokenId" element={<NFTDetails />} />
      <Route path="/resell-nft/:tokenId" element={<ResellNFT />} />
    </Routes>
);

export default AppRoutes;
