import React from 'react';

const Spinner = () => {
  return (
    <div className='flex'>
    <div className="mb-2 spinner-border animate-spin inline-block w-8 h-8 border-2 border-blue-200 rounded-full opacity-75" role="status">
      <span className="text-white"></span>--
    </div>
    <h1 className="font-bold text-3xl text-[#F5F5F5] ml-4 mt-[-4px]">Checking</h1>
    </div>
  );
};

export default Spinner;