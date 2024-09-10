import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import Header from "../Header";
import { useEffect, useState } from "react";
import { getIndianDateTime } from "../../utils/constsnts/constant";
import {   getDatabase,
    ref,
    get,
    orderByChild,
    equalTo,
    query as firebaseQuery, } from "firebase/database";
import app from "../../utils/firebase";

const Admin = () =>{
  const [viewOrders, setViewOrders] = useState([]);
  const [totalSale, setTotalSale] = useState([]);


  useEffect(() => {
    const { toDayDate } = getIndianDateTime();
    const db = getDatabase(app);
    const dbRef = ref(db, "juice/orders");
    (async () => {
      try {
        const query = firebaseQuery(
          dbRef,
          orderByChild("toDayDate"),
          equalTo(toDayDate) // We can only order by one field in the query
        );
        const allOrdersSnapshot = await get(query);

        if (allOrdersSnapshot.exists()) {
          let ordersArray = Object.values(allOrdersSnapshot.val());
          // Filter the orders manually
        //   ordersArray = ordersArray.filter(
        //     (order) => order.isActive && !order.isDeleted
        //   );
          // Calculate total sales
          const total = ordersArray.reduce((sum, order) => {
            if (order.isActive && !order.isDeleted) {
              return sum + order.total;
            }
            return sum;
          }, 0);
          

          setViewOrders(ordersArray); // Update the orders
          setTotalSale(total); // Update the total sales
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, []);

    return (
        <div className="relative min-h-screen">
          <div className="absolute inset-0">
            <img
              className="w-full h-full object-cover"
              src="https://cdn.pixabay.com/photo/2017/03/23/17/00/oranges-2168865_1280.jpg"
              alt="background"
            />
          </div>
          <div className="relative z-10">
            <Header totalSale={totalSale} />
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
                        <td className="p-2 font-bold text-right">{order.orderedTime}</td>
                      </tr>
                    </tbody>
                  </table>
    
                  {/* Accordion for each order */}
                  <Disclosure>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className={`flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-blackfocus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75
                        ${!order.isActive ? `bg-red-600 rounded-lg hover:bg-red-500 ` : ` bg-gray-200 rounded-lg hover:bg-gray-300 `}`}
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
                                <td colSpan="0" className="text-left">

                                </td>
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
        </div>
      );
}
export default Admin