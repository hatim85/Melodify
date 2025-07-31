import React from 'react';

const Banner = ({ name, subtext, gradient = "from-indigo-600 to-purple-600", icon = "🎵" }) => {
  return (
    <div className={`w-full bg-gradient-to-r ${gradient} p-8 rounded-2xl text-white shadow-2xl mb-8 relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white rounded-full"></div>
      </div>
      
      <div className="relative z-10 flex items-center space-x-4">
        <div className="text-4xl md:text-5xl">{icon}</div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">{name}</h1>
          <p className="text-lg md:text-xl opacity-90 leading-relaxed">{subtext}</p>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-4 right-4 flex space-x-2 opacity-30">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default Banner;