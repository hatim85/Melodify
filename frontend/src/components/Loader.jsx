const Loader = ({ message = "Loading..." }) => (
  <div className="flex flex-col justify-center items-center py-12 space-y-4">
    <div className="relative">
      {/* Outer ring */}
      <div className="w-16 h-16 border-4 border-indigo-200 dark:border-slate-600 rounded-full animate-spin"></div>
      {/* Inner ring */}
      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-pulse"></div>
    </div>
    
    <div className="text-center space-y-2">
      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{message}</p>
      <div className="flex items-center justify-center space-x-1">
        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  </div>
);

export default Loader;