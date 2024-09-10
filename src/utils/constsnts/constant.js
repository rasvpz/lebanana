import { getDatabase, ref, push, set } from "firebase/database";

export const getIndianDateTime = () => {
  const indianDate = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const toDayDate = indianDate?.split(',')[0]?.trim();
  const orderedTime = indianDate?.split(',')[1]?.trim();
  return { indianDate, toDayDate, orderedTime };
};


// orderUtils.js

// Save data to Firebase
export const saveData = async (noOfItems, totalValue, waiter, place) => {
  const { indianDate, toDayDate, orderedTime } = getIndianDateTime();
  const db = getDatabase();

  const itemsArray = Array.isArray(noOfItems) ? noOfItems : Object.values(noOfItems);
  const orders = itemsArray.map((data) => ({
    category: data.categoryName || 0,
    juiceName: data.juiceName || '',
    juiceId: data.juiceId || 0,
    qty: data.count || 0,
    rate: data.rate || 0,
    amount: (data.count || 0) * (data.rate || 0),
    cardBg: data.cardBg || '',
    btnBg: data.btnBg || '',
    btnBrdr: data.btnBrdr || '',
    updatedAt: indianDate,
    isDeleted: false,
    isActive: true,
  }));

  try {
    const newDocRef = totalValue ? push(ref(db, "juice/orders")) : '';
    await set(newDocRef, {
      id: newDocRef.key,
      total: totalValue,
      waiter,
      place,
      toDayDate,
      orderedTime,
      createdAt: indianDate,
      isDeleted: false,
      isActive: true,
      orders,
    });
    return true;
  } catch (error) {
    console.error("Error saving orders:", error.message);
    throw error;
  }
};


export const printTable = (place, toDayDate, orderedTime, filteredItems, noOfItems, totalValue) => {
  const printWindow = window.open('', '', 'width=400');
  const tableHTML = `
    <html>
      <head>
        <title>Print</title>
        <style>
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 4px; text-align: left; }
        </style>
      </head>
      <body>
        <table border="0">
          <tr>
            <td><h2 align="center" text-3xl>LeBanana <small>${place}</small></h2></td>
          </tr>
        </table>
        <table border="0" style="margin-top:-25px; margin-bottom:2px">
          <tr>
            <td><p align="left">${toDayDate}</p></td>
            <td><p align="right">${orderedTime}</p></td>
          </tr>
        </table>
        <table border="1">
          <thead>
            <tr>
              <th>No</th>
              <th width="75%">Item</th>
              <th>Qty</th>
              <th>Amnt</th>
            </tr>
          </thead>
          <tbody>
            ${filteredItems.map((key, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td>${key}</td>
                <td><p align="right">${noOfItems[key]?.count || 0}</p></td>
                <td><p align="right">${(noOfItems[key]?.count || 0) * (noOfItems[key]?.rate || 0)}</p></td>
              </tr>
            `).join('')}
            <tr>
              <td colspan="2"></td>
              <td>Total</td>
              <td><p align="right">${totalValue}</p></td>
            </tr>
          </tbody>
        </table>
        <p align="center"> *** Thank you *** </p>
      </body>
    </html>
  `;
  printWindow.document.open();
  printWindow.document.write(tableHTML);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};


