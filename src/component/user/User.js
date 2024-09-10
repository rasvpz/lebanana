import React, { useEffect, useRef, useState } from "react";
import { categories } from "../../utils/menu/categories";
import SlidingMenu from "./SlidingMenu";
import CanseAllOrders from "./CanseAllOrders";
import Header from "../Header";

const User = () => {
  const [cateName, setCateName] = useState("Avil Milk");
  const [noOfItems, setNoOfItems] = useState({});
  const [catId, setCatId] = useState(1);
  const [show, setShow] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);

  const scrollContainerRef = useRef(null);

  let isDragging = false;
  let startX;
  let scrollLeft;

  const startDragging = (e) => {
    isDragging = true;
    startX = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeft = scrollContainerRef.current.scrollLeft;
  };

  const stopDragging = () => {
    isDragging = false;
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Adjust the scroll speed
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };


  useEffect(() => {
    if (successAlert) {
      setShow(true);
      const timeoutId = setTimeout(() => setShow(false), 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [successAlert]);

  // Filter items with count > 0
  const filteredItems = Object.keys(noOfItems).filter(
    (key) => noOfItems[key]?.count > 0
  );

  // Handle increment
  const handleIncrement = (
    juiceName,
    itemId,
    rate,
    categoryName,
    bgColor,
    fgColor,
    brdr
  ) => {
    setSuccessAlert(false);
    setNoOfItems((prevCounts) => ({
      ...prevCounts,
      [itemId]: {
        count: (prevCounts[itemId]?.count || 0) + 1,
        rate: rate,
        juiceId: itemId,
        juiceName: juiceName,
        categoryName: categoryName,
        cardBg: bgColor,
        btnBg: fgColor,
        btnBrdr: brdr,
      },
    }));
  };

  // Handle decrement
  const handleDecrement = (itemId) => {
    setNoOfItems((prevCounts) => {
      const currentCount = prevCounts[itemId]?.count || 0;

      // Ensure count doesn't drop below 0
      if (currentCount > 0) {
        return {
          ...prevCounts,
          [itemId]: {
            ...prevCounts[itemId],
            count: currentCount - 1,
          },
        };
      } else {
        // setIsOpen(false);
        return prevCounts; // No change if count is 0 or less
      }
    });
  };

  // Filter categories based on selected name
  const filteredCategories = cateName
    ? categories.filter((category) => category.id === catId)
    : categories;

  return (
    <div className="ml-3">
     <Header />
      {successAlert ? (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-500 ${
            show ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="border-4 border-white bg-[#166800] text-white px-6 py-8 rounded-lg shadow-lg text-center">
            <span className="text-2xl font-semibold">
              Order added successfully!
            </span>
          </div>
        </div>
      ) : (
        ""
      )}
      {/* Category Buttons */}
      <div
      ref={scrollContainerRef}
      className="mb-4 flex overflow-y-hidden scrollbar-none"
      onMouseDown={startDragging}
      onMouseLeave={stopDragging}
      onMouseUp={stopDragging}
      onMouseMove={onMouseMove}
    >
      {categories.map((category) => {
        const totalItemsForCategory = category.itemsDetails
          ? category.itemsDetails.reduce((total, item) => {
              return total + (noOfItems[item.id]?.count || 0);
            }, 0)
          : 0;

        return (
          <button
            onClick={() => {
              setCateName(category?.name);
              setCatId(category?.id);
            }}
            key={category.id}
            className={`${category.bg} ${category.fg} 
              rounded-md 
              lg:text-lg 
              text-sm 
              xs:font-semibold 
              sm:font-semibold 
              lg:font-semibold 
              m-1.5 px-2 py-1
              relative
              ${
                catId === category.id
                  ? "text-white shadow-[0_0_15px_4px_rgba(96,165,250,1)] border border-[#61abfa]"
                  : "hover:text-white hover:shadow-[0_0_15px_4px_rgba(96,165,250,1)] hover:border hover:border-[#61abfa]"
              }`}
          >
            {totalItemsForCategory > 0 && (
              <p className="absolute right-0 top-[-6px] text-white bg-[#14862d] border-2 textborder-[#22fc35] border-[#22fc35] rounded-full px-2 text-sm font-semibold">
                {totalItemsForCategory}
              </p>
            )}
            <div className="whitespace-nowrap">{category.name}</div>
          </button>
        );
      })}
    </div>

      {/* Item Spans within the Map Function */}
      <div className="m-2">
        {filteredCategories.map((category) => (
          <div key={category.id} className="flex flex-wrap">
            {category.itemsDetails?.map((item) => (
              <div
                key={item.id}
                className={`bg-opacity-[.9] rounded-md p-2 m-2 w-auto lg:min-w-[200px] 
                                ${
                                  noOfItems[item.id]?.count > 0
                                    ? "border border-[#61abfa] shadow-[0_0_20px_8px_rgba(96,165,250,1)]"
                                    : "border-[#000102] shadow-[0_0_4px_2px_rgba(6,16,25,.5)]"
                                } hover:shadow-[0_0_15px_4px_rgba(96,165,250,1)] hover:border hover:border-[#61abfa]  ${
                  item.bgColor
                } text-gray-200`}
              >
                <span className="sm:text-2xl sm:font-bolder lg:text-3xl text-white drop-shadow-[0px_2px_2px_rgba(0,0,0,0.7)] relative">
                  {/* Item name */}
                  <span>{item.itemsName}</span>

                  {/* Badge */}
                  {noOfItems[item.id]?.count > 0 && (
                    <span
                      className={`absolute top-0 right-0 text-white rounded-full bg-[#000e03] border-2 textborder-[#22fc35] border-[#22fc35] px-2 py-0 text-lg font-semibold`}
                      style={{ transform: "translate(50%, -50%)" }}
                    >
                      {noOfItems[item.id].count}
                    </span>
                  )}
                </span>

                <div className="flex justify-between items-center mt-3 mb-2">
                  <span
                    onClick={() => handleDecrement(item.id)} // Corrected: Pass only item.id
                    className={`cursor-pointer ${item.textColor} border-2 ${item.brdr} rounded-full px-3 text-2xl mr-1`}
                  >
                    -
                  </span>
                  <span
                    onClick={() =>
                      handleIncrement(
                        item.itemsName,
                        item.id,
                        item.rate,
                        category.name,
                        item.bgColor,
                        item.fgColor,
                        item.brdr
                      )
                    }
                    className={`border-2 ${item.brdr} cursor-pointer text-[#c9c7c7] rounded-full px-2 ${item.fgColor} ${item.brdr} text-2xl`}
                  >
                    +
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {Object.keys(noOfItems).length > 0 ? (
        <div>
          <CanseAllOrders setNoOfItems={setNoOfItems} />
          <SlidingMenu
            setSuccessAlert={setSuccessAlert}
            setNoOfItems={setNoOfItems}
            filteredItems={filteredItems}
            noOfItems={noOfItems}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default User;
