const Button = ({ label, onClick, className = '' }) => (
  <button
    className={`px-4 py-2 rounded bg-indigo-600 text-white ${className}`}
    onClick={onClick}
  >
    {label}
  </button>
);

export default Button;