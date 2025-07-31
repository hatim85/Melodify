import React from 'react';

const Input = ({ inputType, title, handleClick, ...rest }) => (
  <div className="flex flex-col w-full my-4">
    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
      <span>{title}</span>
      {rest.required && <span className="text-red-500">*</span>}
    </label>
    {inputType === 'textarea' ? (
      <textarea
        className="w-full p-4 rounded-xl border-2 border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 resize-none"
        rows={4}
        onChange={handleClick}
        {...rest}
      />
    ) : (
      <input
        type={inputType}
        className="w-full p-4 rounded-xl border-2 border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
        onChange={handleClick}
        {...rest}
      />
    )}
  </div>
);

export default Input;