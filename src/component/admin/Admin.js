import Header from "../Header";
import { useEffect, useState } from "react";
import { getIndianDateTime } from "../../utils/constsnts/constant";
import {
  getDatabase,
  ref,
  get,
  orderByChild,
  equalTo,
  query as firebaseQuery,
} from "firebase/database";
import app from "../../utils/firebase";
import { branches } from "../../utils/menu/branches";
import ViewByPlace from "./ViewByPlace";

const Admin = () => {
  const { toDayDate } = getIndianDateTime();

  const [viewOrders, setViewOrders] = useState([]);
  const [totalSale, setTotalSale] = useState([]);

  const [branch, setBranch] = useState("Alathur");
  const [currentDate, setCurrentDate] = useState(toDayDate);
  const [activeBranchId, setActiveBranchId] = useState(101);


  const changeDate = (branch, id) => {

    if (branch === "Alathur") {
      setActiveBranchId(id);
    }
    setBranch(branch)
    // const selectedday = currentDate
    // const selectedId = id
    setActiveBranchId(id);
  }

  useEffect(() => {
    const db = getDatabase(app);
    const dbRef = ref(db, `juice/${branch}`);
  
    (async () => {
      try {
        const query = firebaseQuery(
          dbRef,
          orderByChild("toDayDate"),
          equalTo(currentDate)
        );
        const allOrdersSnapshot = await get(query);
  
        if (allOrdersSnapshot.exists()) {
          let ordersArray = Object.values(allOrdersSnapshot.val());
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
  }, [currentDate, branch]); // Dependency array
  
  // Ensure that `currentDate` and `branch` are updated elsewhere if necessary
  

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
        <Header />

 <div className="flex flex-wrap justify-center w-full max-w-screen-lg mx-auto mb-4 gap-1">
 {branches.map((branch) => (
        <div
          key={branch.id}
          className={`group rounded-lg shadow p-2 w-full max-w-xs text-white 
            ${activeBranchId === branch.id ? 'shadow-[0_0_15px_4px_rgba(96,165,250,1)] border border-[#61abfa]' : ''} 
            ${branch.bgColor} transition-all duration-300 ease-in-out
            ${branch.branchName !== "Alathur" ? 'opacity-50 cursor-not-allowed' : ''}`} // Disabled styling
          onClick={() => changeDate(branch.branchName, branch.id)}
        >
          <div className="flex items-center justify-between">
            <span>
              {branch.branchName} {branch.branchName === "Alathur" ? <span className="font-bold ml-1">{"₹" + totalSale}</span> : "₹" + 0}
            </span>

            <form className="flex space-x-1">
              <span className={`text-[#b6b6b6] cursor-pointer mt-2 flex ${activeBranchId === branch.id ? 'text-white' : ''}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className={`h-8 w-8 ${activeBranchId === branch.id ? 'text-white' : 'text-[#b6b6b6]'}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5c4.36 0 7.89 3.94 7.98 4.04.15.17.22.4.2.63-.02.23-.11.45-.27.62-.09.1-3.64 4.05-7.91 4.05s-7.82-3.95-7.91-4.05a.875.875 0 0 1-.27-.62c-.02-.23.05-.46.2-.63C4.11 8.44 7.64 4.5 12 4.5zm0 6.75a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5z" />
                </svg>
              </span>
            </form>
          </div>
        </div>
      ))}
    </div>
      <ViewByPlace viewOrders={viewOrders} setCurrentDate={setCurrentDate} />


      </div>
    </div>
  );
};
export default Admin;
