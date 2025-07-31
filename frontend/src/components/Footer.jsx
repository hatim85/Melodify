const Footer = () => (
  <footer className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-t border-gray-200 dark:border-slate-700 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🎵</span>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Melodify
          </span>
        </div>
        
        <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center space-x-2">
            <span>Built with</span>
            <span className="text-red-500 animate-pulse">❤️</span>
            <span>for decentralized music</span>
            <span className="text-lg">🎶</span>
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Powered by Ethereum</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700 text-center text-xs text-gray-500 dark:text-gray-400">
        <p>© 2025 Melodify. Empowering artists through blockchain technology.</p>
      </div>
    </div>
  </footer>
);

export default Footer;