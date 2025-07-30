const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow p-6 min-w-[300px]">
        <button className="float-right" onClick={onClose}>✖</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;