import React from "react";

const CanseAllOrders = ({ setNoOfItems }) => {
  const confirmCancellation = () => {
    const userConfirmed = window.confirm("Are you sure you want to cancel all orders?");
    if (userConfirmed) {
      setNoOfItems({});
    }
  };

  return (
    <button
      onClick={confirmCancellation}
      className="fixed top-60 right-[-4px] z-50 bg-yellow-400 text-black px-4 py-2 border-2 border-red-50 rounded-md"
    >
      cAll
    </button>
  );
};

export default CanseAllOrders;
