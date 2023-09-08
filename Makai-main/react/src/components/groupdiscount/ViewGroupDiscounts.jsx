import React, { useEffect, useState } from "react";
import GroupDiscountCard from "./GroupDiscountCard";
import * as groupDiscountService from "../../services/groupDiscountService";
import debug from "sabio-debug";
import { Row } from "react-bootstrap";
const _logger = debug.extend("GroupDiscount");
import Container from "react-bootstrap/Container";
import Pagination from "rc-pagination";
import locale from "rc-pagination/lib/locale/en_US";
import "rc-pagination/assets/index.css";
import toastr from "toastr";

export default function ViewGroupDiscounts() {
  const [allData, setAllData] = useState({
    data: null,
    components: null,
    currentPage: 1,
    pageSize: 5,
    totalCount: 0,
  });

  useEffect(() => {
    _logger("useeffect woroking");
    groupDiscountService
      .getGroupDiscounts(allData.currentPage - 1, allData.pageSize)
      .then(onGetDiscountsSuccess)
      .catch(onGetDiscountsError);
  }, [allData.currentPage, allData.pageSize]);

  const onChangePage = (page) => {
    setAllData((prevState) => {
      const newState = { ...prevState };
      newState.currentPage = page;
      return newState;
    });
  };

  const onDeleteSuccess = (idToDelete) => {
    _logger("From Parent DELETING THIS :::", idToDelete);
    setAllData((prevState) => {
      const newState = { ...prevState };
      const filteredItems = prevState.data.filter(
        (aGroup) => aGroup.id !== idToDelete
      );
      newState.data = filteredItems;
      newState.components = filteredItems.map(mapDiscounts);
      return newState;
    });
  };

  const onActivateSuccess = (idToActivate) => {
    _logger("From Parent Activating THIS :::", idToActivate);
    setAllData((prevState) => {
      const newState = { ...prevState };
      return newState;
    });
  };

  const mapDiscounts = (discount) => (
    <Container>
      <GroupDiscountCard
        key={`id_Discount_ ${discount.id}`}
        discount={discount}
        onDeleteSuccess={onDeleteSuccess}
        onActivateSuccess={onActivateSuccess}
      />
    </Container>
  );

  const onGetDiscountsSuccess = (response) => {
    _logger("this is the response", response);
    setAllData((prev) => {
      const newState = { ...prev };
      newState.data = response.item.pagedItems;
      newState.components = newState.data.map(mapDiscounts);
      newState.totalCount = response.item.totalCount;
      return newState;
    });
  };
  const onGetDiscountsError = (err) => {
    _logger("this is the error", err);
    toastr.error("There is an error or no existing Discounts", err);
  };

  return (
    <>
      <Container fluid>
        <Row className="justify-content-md-center">{allData.components}</Row>
        <Row>
          <div className="d-flex align-items-center bg-dark mb-2 ">
            <Pagination
              onChange={onChangePage}
              current={allData.currentPage}
              pageSize={allData.pageSize}
              total={allData.totalCount}
              className="d-flex justify-content-center "
              locale={locale}
            />
          </div>
        </Row>
      </Container>
    </>
  );
}
