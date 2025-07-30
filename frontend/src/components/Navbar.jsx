import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { NFTContext } from '../context/NFTContext';
import { shortenAddress } from '../utils/shortenAddress';

const Navbar = () => {
  const { currentAccount, connectWallet } = useContext(NFTContext);

  return (
    <nav className="w-full flex justify-between items-center p-4 border-b border-gray-300">
      <Link to="/" className="text-xl font-bold">🎵 Melodify</Link>
      <div className="flex items-center space-x-4">
        <Link to="/">Explore nft</Link>
        <Link to="/create-nft">Create</Link>
        <Link to="/listed-nfts">Listed</Link>
        <Link to="/my-nfts">My NFTs</Link>
        {currentAccount ? (
          <span className="text-sm">{shortenAddress(currentAccount)}</span>
        ) : (
          <button
            className="bg-black text-white px-4 py-2 rounded"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;