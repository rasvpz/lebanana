import React, { useState, useEffect } from 'react';

const Alert = ({ successAlert }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (successAlert !== null) {
      setShow(true);
      const timeoutId = setTimeout(() => setShow(false), 1000); // Show for 1 second
      return () => clearTimeout(timeoutId);
    }
  }, [successAlert]);

  return (
    show && (
      <div className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-500 opacity-100">
        <div className={`border-4 border-white px-6 py-8 rounded-lg shadow-lg text-center 
                        ${successAlert ? 'bg-red-600' : 'bg-green-600'} text-white`}>
          <span className="text-2xl font-semibold">
            {successAlert ? "Order deleted successfully!" : "Failed to delete the order."}
          </span>
        </div>
      </div>
    )
  );
};

export default Alert;
