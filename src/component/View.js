import React, { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  get,
  update,
  orderByChild,
  equalTo,
  query as firebaseQuery,
} from "firebase/database";
import Header from "./Header";
import app from "../utils/firebase";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { getIndianDateTime } from '../utils/constsnts/constant';
import { PencilIcon, TrashIcon  } from '@heroicons/react/24/outline';
import Alert from "./user/alert/Alert";
import { useSelector } from "react-redux";
const View = () => {
  const user = useSelector(store => store.user)
  const place = user?.displayName?.split(',')[1]?.trim()

  const [viewOrders, setViewOrders] = useState([]);
  const [totalSale, setTotalSale] = useState([]);
  const [successAlert, setSuccessAlert] = useState(null);



  // useEffect(() => {
  //   const { toDayDate } = getIndianDateTime(); 

  //   const db = getDatabase(app);
  //   const dbRef = ref(db, `juice/${place}``);

  //   // IIFE (Immediately Invoked Function Expression) to handle the async/await inside useEffect
  //   (async () => {
  //     try {
  //       const query = firebaseQuery(
  //         dbRef,
  //         orderByChild("toDayDate"),
  //         equalTo(toDayDate),
  //         orderByChild("isActive"),
  //         equalTo(true),
  //         orderByChild("isDeleted"),
  //         equalTo(false),
  //       );

  //       const allOrders = await get(query);

  //       if (allOrders.exists()) {
  //         const ordersArray = Object.values(allOrders.val());

  //         // Calculate total sales before updating the state
  //         const total = ordersArray.reduce((sum, order) => sum + order.total, 0);

  //         setViewOrders(ordersArray); // Update the orders
  //         setTotalSale(total); // Update the total sales
  //         console.log("hi")
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   })();
  // }, []);

  // Function to get the details of the selected order
 
  useEffect(() => {
    const { toDayDate } = getIndianDateTime(); 
    const db = getDatabase(app);
    const dbRef = ref(db, `juice/${place}`);
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
          ordersArray = ordersArray.filter(order => order.isActive && !order.isDeleted);
          // Calculate total sales
          const total = ordersArray.reduce((sum, order) => sum + order.total, 0);
          setViewOrders(ordersArray); // Update the orders
          setTotalSale(total); // Update the total sales
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, [successAlert, place]);
 
 
  const getOrderDetailsForPrintAndUpdate = (orderId) => {
    return viewOrders?.find((order) => order.id === orderId);
  };

  const orderDelete = async (orderId) => {
    if (window.confirm("Are you sure you want to Delete ?")) {
    const db = getDatabase();
    const orderRef = ref(db, `juice/${place}/${orderId}`); // Reference to the specific order  
    try {
      // Updating the fields `isActive` and `isDeleted`
    await update(orderRef, {
        isActive: false,
        isDeleted: true,
      });      
      // Log success message after successful update
      setSuccessAlert(true);

    } catch (error) {
      console.error("Error updating order:", error.message);
    }
  }};


  // prontPDF
  // const printTable = (orderId) => {
  //   const order = getOrderDetailsForPrintAndUpdate(orderId);
  //   if (order) {
  //     // Create a new instance of jsPDF
  //     const doc = new jsPDF();
  
  //     // Define margin values
  //     const titleMarginBottom = 20;
  //     const dateTimeMarginBottom = 10;
  
  //     // Add title (Centered)
  //     doc.setFontSize(40);
  //     const titleY = 15;
  //     doc.text(`LeBanana ${order.place}`, doc.internal.pageSize.getWidth() / 2, titleY, { align: "center" });
  
  //     // Calculate Y position for Date and Time
  //     const dateTimeY = titleY + titleMarginBottom;
  
  //     // Add Date and Time
  //     doc.setFontSize(32);
  //     const pageWidth = doc.internal.pageSize.getWidth();
  
  //     // Left-aligned date
  //     doc.text(`Date: ${order.toDayDate}`, 15, dateTimeY);
  
  //     // Right-aligned time (manually calculate position)
  //     const timeText = `Time: ${order.orderedTime}`;
  //     const timeTextWidth = doc.getTextWidth(timeText);
  //     doc.text(timeText, pageWidth - timeTextWidth - 15, dateTimeY);
  
  //     // Add table with increased font size for the header and body
  //     doc.autoTable({
  //       head: [["Juices", "Qty", "Amnt"]],
  //       body: order?.orders?.map(item => [
  //         item.juiceId,
  //         { content: item.qty, styles: { halign: 'right' } }, // Right-align Qty
  //         { content: `${item.amount}`, styles: { halign: 'right' } }, // Right-align Amount
  //       ]),
  //       headStyles: {
  //         fillColor: [255, 255, 255], // White background for the header
  //         textColor: [0, 0, 0], // Black text for the header
  //         lineWidth: 1, // Border width
  //         fontSize: 28, // Font size for the table head
  //       },
  //       bodyStyles: {
  //         fillColor: [255, 255, 255], // No background color for all rows
  //         textColor: [0, 0, 0], // Black text for body cells
  //         lineWidth: 1, // Border width for body cells
  //         fontSize: 28, // Font size for the table body
  //       },
  //       alternateRowStyles: {
  //         fillColor: null, // Remove the alternate row background color
  //       },
  //       tableLineWidth: 0.1, // Border width for the table
  //       tableLineColor: [0, 0, 0], // Black border color
  //       margin: { top: dateTimeY + dateTimeMarginBottom }, // Adding top margin to ensure the table does not overlap with the date and time
  //     });
  
  //     // Add total (Right-aligned manually)
  //     const finalY = doc.lastAutoTable.finalY; // Get the final Y position after the table
  //     doc.setFontSize(32);
  //     const totalText = `Total    ${order.total}`;
  //     const totalTextWidth = doc.getTextWidth(totalText);
  //     doc.text(totalText, pageWidth - totalTextWidth - 18, finalY + 15);
  
  //     // Add a thank you note (Centered)
  //     doc.text("*** Thank You Visit Again ***", pageWidth / 2, finalY + 35, { align: "center" });
  
  //     // Save the PDF
  //     doc.save(`Order_${orderId}.pdf`);

  //   // // Automatically close the current window/tab after printing
  //   // setTimeout(() => {
  //   //   window.close(); // This will close the current tab or window
  //   // }, 500); // Slight delay to ensure the download starts before closing
  //   }
  // };
  
  const printTable = (orderId) => {
    const order = getOrderDetailsForPrintAndUpdate(orderId);
    const printWindow = window.open("", "", "width=100%");
  
    if (printWindow && order) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>.</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0px;
              }
              table {
                border-collapse: collapse;
                margin: 0px;

              }
              th, tbody {
                padding: 4px; /* Adjust padding value as needed */
                font-size: 24px;
                margin: 0px;
              }
            </style>
          </head>
          <body>
          <h3 align="center">LeBanana ${order.place}</h3>
            <table width="100%" border=0 padding:0>
              <tr>
                <td>
                  <table width="100%" border="1">
                    <thead>
                      <tr>
                        <th colspan="0" align="left">&nbsp;Juice</th>
                        <th colspan="0" align="left">Qty</th>
                        <th colspan="0" align="left">Amt</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${order.orders
                        .map((item) => `
                          <tr padding=1>
                            <td colspan="0" width="90%">&nbsp;${item.juiceId}</td>
                            <td colspan="0" align="right" width="3%"> ${item.qty}</td>
                            <td colspan="0" align="right" width="7%"> ${item.rate}</td>
                          </tr>
                        `)
                        .join("")}
                      <tr>
                        <td align="right" colspan="2"><strong>Total</strong></td>
                        <td colspan="0" align="right"><strong>${order.total}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </table>
            <p align="center">*** Thank You Visit Again ***</p>
  
            <script>window.print(); window.close();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };
  
  

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
        <Header totalSale={totalSale}/>
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
            <td className="p-2 font-bold">{order.waiter}     
            </td>
            <td className="p-2 font-bold text-right">
             
              <table>
                <tr>
                  <td width="80%" align="left"> {order.orderedTime}</td>
                  <td>
                  <button onClick={() => getOrderDetailsForPrintAndUpdate(order.id)} className="w-6 h-6">
                    <PencilIcon className="w-5 h-5 font-bold hover:text-green-700 text-blue-700 rounded  focus:outline-none focus:ring-2" />
                  </button>
                  </td>
                  <td>
                  <button onClick={() => orderDelete(order.id)} className="w-6 h-6">
                  <TrashIcon className="w-5 h-5 font-bold hover:text-red-700 text-red-500 rounded  focus:outline-none focus:ring-2" />
                  </button>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Accordion for each order */}
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-black bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
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
                      <td className="px-4 py-2 text-right">₹{item.rate}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="0" className="text-left">
                      <button
                        onClick={() => printTable(order.id, order)}
                        className="bg-red-500 p-2 text-white font-bold rounded"
                      >
                        PRINT..
                      </button>
                    </td>
                    <td className="text-center font-bold">
                      Total
                    </td>
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

    <div>    
      {successAlert !== null && <Alert successAlert={successAlert} />}
    </div>
      </div>
    </div>
  );
};

export default View;
