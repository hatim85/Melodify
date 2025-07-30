import React from 'react';

const Input = ({ inputType, title, handleClick, ...rest }) => (
  <div className="flex flex-col w-full my-4">
    <label className="text-sm text-gray-600 mb-1">{title}</label>
    {inputType === 'textarea' ? (
      <textarea
        className="w-full p-3 rounded-xl border border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
        rows={4}
        onChange={handleClick}
        {...rest}
      />
    ) : (
      <input
        type={inputType}
        className="w-full p-3 rounded-xl border border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
        onChange={handleClick}
        {...rest}
      />
    )}
  </div>
);

export default Input;