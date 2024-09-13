import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { useRef } from "react";




const ViewByPlace = ({viewOrders, setCurrentDate}) => {

  const day = useRef(null);
  const month = useRef(null);
  const year = useRef(null);

  const changeDate = (event) => {
    event.preventDefault();
    const selectedDay = day.current?.value || '';
    const selectedMonth = month.current?.value || '';
    const selectedYear = year.current?.value || '';
    setCurrentDate(`${selectedDay}/${selectedMonth}/${selectedYear}`);
    console.log("Date", selectedDay, selectedMonth, selectedYear);
  };



  return (
    <div className="flex flex-wrap justify-center w-full max-w-screen-lg mx-auto mb-4 gap-1">

    <form className="flex space-x-1 mt-2 mb-4 ">
    <input
      ref={day}
      type="text"
      name="day"
      placeholder="D"
      className="text-center lg:text-red-500 w-12 h-9 mt-2 lg:bg-transparent sm:bg-transparent lg:border-b lg:border-red-500 sm:text-black sm:border-black sm:border-b"
    />
    <input
      ref={month}
      type="text"
      name="month"
      placeholder="M"
      className="text-center lg:text-red-500 w-12 h-9 mt-2 p-1 lg:bg-transparent sm:bg-transparent lg:border-b lg:border-red-500 sm:text-black sm:border-black sm:border-b"
    />
    <input
      ref={year}
      type="text"
      name="year"
      placeholder="YYYY"
      className="text-center lg:text-red-500 w-12 h-9 mt-2 p-1 lg:bg-transparent sm:bg-transparent lg:border-b lg:border-red-500 sm:text-black sm:border-black sm:border-b"
    />
    <button type="submit" className="text-white text-center cursor-pointer mt-2 flex bg-red-500 p-2 px-8 rounded" onClick={changeDate}>
      {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-8 w-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5c4.36 0 7.89 3.94 7.98 4.04.15.17.22.4.2.63-.02.23-.11.45-.27.62-.09.1-3.64 4.05-7.91 4.05s-7.82-3.95-7.91-4.05a.875.875 0 0 1-.27-.62c-.02-.23.05-.46.2-.63C4.11 8.44 7.64 4.5 12 4.5zm0 6.75a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5z" />
      </svg> */} Selected bills
    </button>
  </form>

      <div className="flex flex-wrap justify-center w-full max-w-screen-lg mx-auto gap-1">
          {/* Display orders */}
          {viewOrders?.map((order, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-2 w-full max-w-xs" // Change w-1/2 to w-full
            >
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="p-2 font-bold">{order.waiter}</td>
                    <td className="p-2 font-bold text-right">
                      {order.orderedTime}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Accordion for each order */}
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button
                      className={`flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-blackfocus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75
                        ${
                          !order.isActive
                            ? `bg-red-600 rounded-lg hover:bg-red-500 `
                            : ` bg-gray-200 rounded-lg hover:bg-gray-300 `
                        }`}
                    >
                      <span>View Orders</span>
                      <ChevronUpIcon
                        className={`${
                          open ? "transform rotate-180" : ""
                        } w-5 h-5 text-black`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-600">
                      {/* Nested table for each order */}
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left">Juice</th>
                            <th className="px-4 py-2 text-left">Quantity</th>
                            <th className="px-4 py-2 text-left">Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.orders.map((item, idx) => (
                            <tr key={idx}>
                              <td className="px-4 py-2">{item.juiceId}</td>
                              <td className="px-4 py-2">{item.qty}</td>
                              <td className="px-4 py-2 text-right">
                                ₹{item.rate}
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan="0" className="text-left"></td>
                            <td className="text-center font-bold">Total</td>
                            <td className="text-center">
                              <h3 className=" font-bold">₹{order.total}</h3>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          ))}
        </div>
</div>
  );
};
export default ViewByPlace;
