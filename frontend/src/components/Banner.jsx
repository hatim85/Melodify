import React from 'react';

const Banner = ({ name, subtext }) => {
  return (
    <div className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-xl text-white shadow-lg mb-8">
      <h1 className="text-3xl font-bold mb-2">{name}</h1>
      <p className="text-sm">{subtext}</p>
    </div>
  );
};

export default Banner;
