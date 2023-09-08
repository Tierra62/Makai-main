import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CheckoutButton from "./CheckoutButtonConfirmCard";

const defualtDateTime = new Date("0001-01-01");

function CheckoutPage() {
  const [cartDetails, setCartDetails] = useState({
    id: 0,
    price: 0,
    name: "",
    photoUrl: "",
    finalCost: 100,
    startTime: defualtDateTime,
    rentalTime: 0,
    endTime: defualtDateTime,
    quantity: 0,
    hasInsurance: false,
    insuranceCost: 0,
    productId: 0,
    userId: 0,
  });

  const { state } = useLocation();

  useEffect(() => {
    if (state?.type === "ORDER_DETAILS_FOR_CART") {
      setCartDetails(state.payload);
    }
  }, [state]);

  return (
    <div className="container cart showMore text-center">
      <div className="col-12">
        <CheckoutButton order={cartDetails} />
      </div>
    </div>
  );
}

export default CheckoutPage;
