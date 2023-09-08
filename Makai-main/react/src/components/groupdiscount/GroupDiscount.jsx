import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import ViewGroupDiscounts from "./ViewGroupDiscounts";

function GroupDiscount() {
  return (
    <React.Fragment>
      <div className="container d-flex justify-content-center mt-5">
        <div className="bg-dark border card w-100">
          <div className="col mt-2 text-center">
            <h1 className="mt-2 text-center text-white">Group Discounts</h1>
            <figcaption className="text-white text-center my-4">
              Here you chan choose to create a Discount OR see the current
              Available Discounts
            </figcaption>
          </div>
        </div>
      </div>
      <div className="row m-3">
        <div className="d-flex justify-content-center ">
          <Button
            as={Link}
            variant="outline-light"
            to="/groupdiscounts/form"
            className="mt-2  text-light  discount-color-button  "
          >
            Create new Discount
          </Button>
        </div>

        <div className="mt-3">
          {" "}
          <ViewGroupDiscounts></ViewGroupDiscounts>
        </div>
      </div>
    </React.Fragment>
  );
}

export default GroupDiscount;
