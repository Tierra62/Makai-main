import React, { useCallback, useEffect, useState } from "react";
import debug from "sabio-debug";
import ProductsCard from "./ProductsCard";
import productService from "services/productService";
import lookUpService from "services/lookUpService";
import standsService from "services/standsService";
import shoppingCartService from "services/shoppingCartService";
import { Formik, Form, Field } from "formik";
import Pagination from "rc-pagination";
import locale from "rc-pagination/lib/locale/en_US";
import "rc-pagination/assets/index.css";
import toastr from "toastr";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import moment from "moment";
import PropTypes from "prop-types";
import "./productitem.css";
import Select from "react-select";
import swal from "sweetalert";

const Products = (props) => {
  const _logger = debug.extend("Products.jsx");

  const [pageData, setPageData] = useState({
    productsComponents: [],
    favoriteProducts: [],
    pageIndex: 0,
    pageSize: 8,
    totalCount: 0,
    currentPage: 1,
    totalPages: 0,
    productTypeId: null,
    standId: null,
  });

  const [formData] = useState({ search: "" });

  const [renderFaves, setRenderFaves] = useState({ show: true });

  const [isRenderFound, setIsRenderFound] = useState({ show: false });

  const [productsStandsState, setproductsStandsState] = useState({
    mappedProducts: [],
    mappedStands: [],
    individualState: [],
  });

  useEffect(() => {
    _logger("useEffect firing for getProducts");
    productService
      .getAllPag(pageData.pageIndex, pageData.pageSize)
      .then(onGetAllSuccess)
      .catch(onGetAllError);
  }, [pageData.pageIndex, formData.search]);

  useEffect(() => {
    lookUpService
      .LookUp(["ProductTypes"])
      .then(onLookupSuccess)
      .catch(onLookupError);

    standsService
      .getAll()
      .then(onGetAllStandsSuccess)
      .catch(onGetAllStandsError);
  }, []);

  const onGetAllStandsSuccess = (data) => {
    let standsList = data.item;
    _logger("StandsList", standsList, productsStandsState);
    setproductsStandsState((prevState) => {
      let newSt = { ...prevState };
      newSt.mappedStands = standsList.map(mapStands);
      _logger(newSt.mappedStands);
      return newSt;
    });
  };

  const onGetAllStandsError = (err) => {
    _logger(err);
    Toastify({
      text: "Looks like we ran into an error! Please try again.",
      backgroundColor: "red",
      duration: 3000,
    }).showToast();
  };

  const mapStands = (aStand) => {
    // map stands data to feed form select options
    return {
      value: aStand.id,
      label: `${aStand.location.city}, ${aStand.location.lineOne}`,
    };
  };

  const mapProductTypes = (aProductType) => {
    return (
      <option key={aProductType.id} value={aProductType.id}>
        {aProductType.name}
      </option>
    );
  };

  const mapProducts = (aProduct) => {
    return (
      <ProductsCard
        product={aProduct}
        key={aProduct.id + " " + aProduct.fileId + " " + aProduct.createdBy}
        onFaveClicked={onFaveRequested}
        onUnfaveClicked={onUnfaveRequested}
        onCartClick={onCartClick}
        {...props}
      />
    );
  };

  const handleSubmit = (values) => {
    _logger("submit clicked");
    if (!values.search || values.search === "") {
      productService
        .getAllPag(pageData.pageIndex, pageData.pageSize)
        .then(onGetAllSuccess)
        .catch(onGetAllError);
    } else {
      _logger("===search");
      productService
        .search(pageData.pageIndex, pageData.pageSize, values.search)
        .then(onSearchSuccess)
        .catch(onSearchError);
    }
  };

  const onSelectProductType = (event) => {
    let productTypeId = event.target.value;
    _logger("BeforeSetState", pageData.productTypeId, productTypeId);

    if (productTypeId >= 0 || productTypeId === "select") {
      setPageData((prevState) => {
        const newSt = { ...prevState };
        newSt.productTypeId = productTypeId;
        return newSt;
      });
    }
  };

  const onSelectStand = (event) => {
    _logger("this is my event", event);
    let standValues = [];
    for (let i = 0; i < event.length; i++) {
      const value = event[i].value;
      standValues.push(value);
      _logger("pushing into array", standValues);
    }
    setPageData((prevState) => {
      const pd = { ...prevState };
      pd.standId = standValues;
      return pd;
    });

    _logger("This is in state now", pageData.standId);
  };

  const onGetMultipleSuccess = (response) => {
    _logger(response);
    let productsArray = response.item.pagedItems;
    _logger("Hitting get multipleSucess", pageData.standId, productsArray);
    setPageData((prevState) => {
      const pd = { ...prevState };
      pd.productsComponents = productsArray.map(mapProducts);
      pd.totalCount = response.item.totalCount;
      pd.totalPages = response.item.totalPages;
      return pd;
    });
    if (isRenderFound.show === true) {
      setIsRenderFound((prevState) => {
        const newSt = { ...prevState };
        newSt.show = false;
        return newSt;
      });
    }
  };

  const onGetMultipleError = (error) => {
    _logger(error);
    if (error.message === "Request failed with status code 404") {
      Toastify({
        text: "We could not find what you were looking for!",
        className: "Danger",
        style: {
          background: "red",
        },
      }).showToast();
      setPageData((prevState) => {
        const pd = { ...prevState };
        pd.productsComponents = "";
        pd.totalCount = pageData.totalCount;
        pd.totalPages = pageData.totalPages;
        return pd;
      });
      if (isRenderFound.show === false) {
        setIsRenderFound((prevState) => {
          const newSt = { ...prevState };
          newSt.show = true;
          return newSt;
        });
      }
    }
  };

  const onPageClicked = (current) => {
    setPageData((prevState) => {
      const pagProducts = { ...prevState };
      pagProducts.pageIndex = current - 1;
      pagProducts.currentPage = current;
      return pagProducts;
    });
  };

  const onFaveClicked = () => {
    setTextState((b) => !b);
    _logger("favorites toggle button clicked");
    setRenderFaves((prevState) => {
      const renderedCard = { ...prevState };
      if (renderedCard.show) {
        renderedCard.show = false;
        productService
          .getAllFavePag(pageData.pageIndex, pageData.pageSize)
          .then(onGetFaveSuccess)
          .catch(onGetFaveError);
      } else {
        renderedCard.show = true;
        productService
          .getAllPag(pageData.pageIndex, pageData.pageSize)
          .then(onGetAllSuccess)
          .catch(onGetAllError);
      }
      return renderedCard;
    });
  };

  const onFaveRequested = (myProductId) => {
    _logger(myProductId);
    productService
      .addFavorite(myProductId)
      .then(onFaveSuccess)
      .catch(onFaveError);
  };

  const onUnfaveRequested = (myProductId) => {
    _logger(myProductId);
    productService
      .deleteFavorite(myProductId)
      .then(onUnfaveSuccess)
      .catch(onUnfaveError);
  };

  const onCartClick = useCallback((productObj) => {
    let startTimeObj = moment(new Date()).add(30, "m").toDate();

    let endTimeObj = moment(new Date()).add(60, "m").toDate();

    const payload = {
      productId: productObj.id,
      startTime: startTimeObj,
      endTime: endTimeObj,
      quantity: 1,
    };

    const handler = addCartSuccessHandler(productObj);

    shoppingCartService.addCart(payload).then(handler).catch(onAddCartError);
  }, []);

  //#region Event Handlers

  const onLookupSuccess = (data) => {
    let productList = data.item.productTypes;
    setproductsStandsState((prevState) => {
      let newSt = { ...prevState };
      newSt.mappedProducts = productList.map(mapProductTypes);
      return newSt;
    });
  };

  const onLookupError = (data) => {
    _logger(data);
    Toastify({
      text: "Looks like we ran into an error! Please try again.",
      backgroundColor: "red",
      duration: 3000,
    }).showToast();
  };

  const onGetAllSuccess = (response) => {
    let productsArray = response.data.item.pagedItems;
    setPageData((prevState) => {
      const pd = { ...prevState };
      pd.productsComponents = productsArray.map(mapProducts);
      pd.totalCount = response.data.item.totalCount;
      return pd;
    });
  };

  const onGetAllError = (error) => {
    _logger({ error });
  };

  const onSearchSuccess = (response) => {
    _logger(response);
    let productsArray = response.data.item.pagedItems;
    setPageData((prevState) => {
      const pd = { ...prevState };
      pd.productsComponents = productsArray.map(mapProducts);
      pd.totalCount = response.data.item.totalCount;
      pd.totalPages = response.data.item.totalPages;
      return pd;
    });
  };

  const onSearchError = (error) => {
    _logger({ error });
  };

  const onGetProdTypeSuccess = (response) => {
    let productsArray = response.data.item.pagedItems;
    setPageData((prevState) => {
      const pd = { ...prevState };
      pd.productsComponents = productsArray.map(mapProducts);
      pd.totalCount = response.data.item.totalCount;
      pd.totalPages = response.data.item.totalPages;
      return pd;
    });
    setIsRenderFound((prevState) => {
      const newSt = { ...prevState };
      newSt.show = false;
      return newSt;
    });
  };

  const onGetProdTypeError = (error) => {
    if (error.message === "Request failed with status code 404") {
      Toastify({
        text: "We could not find what you were looking for!",
        className: "Danger",
        style: {
          background: "red",
        },
      }).showToast();
      setPageData((prevState) => {
        const pd = { ...prevState };
        pd.productsComponents = "";
        pd.totalCount = pageData.totalCount;
        pd.totalPages = pageData.totalPages;
        return pd;
      });
      if (isRenderFound.show === false) {
        setIsRenderFound((prevState) => {
          const newSt = { ...prevState };
          newSt.show = true;
          return newSt;
        });
      }
    }
  };

  const onFaveSuccess = (response) => {
    _logger(response);
    Toastify({
      text: "Product successfully added to favorites!",
      className: "Success",
      style: {
        background: "green",
      },
    }).showToast();

    if (
      productService
        .getAllPag(pageData.pageIndex, pageData.pageSize)
        .then(onGetAllSuccess)
        .catch(onGetAllError)
    )
      if (
        productService
          .getAllFavePag(pageData.pageIndex, pageData.pageSize)
          .then(onGetFaveSuccess)
          .catch(onGetFaveError)
      );
  };

  const onFaveError = (error) => {
    if (error.response.status === 500) {
      onUnfaveRequested(error.config.data);
    } else {
      toastr("message", "title");
      Toastify({
        text: "Something went wrong, please try again!",
        className: "Error",
        style: {
          background: "crimson",
        },
      }).showToast();
    }
  };

  const onUnfaveSuccess = (response) => {
    _logger(response);
    Toastify({
      text: "Product successfully removed from favorites!",
      className: "Success",
      style: {
        background: "gray",
      },
    }).showToast();
    if (
      productService
        .getAllPag(pageData.pageIndex, pageData.pageSize)
        .then(onGetAllSuccess)
        .catch(onGetAllError)
    )
      if (
        productService
          .getAllFavePag(pageData.pageIndex, pageData.pageSize)
          .then(onGetFaveSuccess)
          .catch(onGetFaveError)
      );
  };

  const onUnfaveError = (error) => {
    _logger({ error });
    Toastify({
      text: "Something went wrong, please try again!",
      className: "Error",
      style: {
        background: "crimson",
      },
    }).showToast();
  };
  onGetFaveError;

  const onGetFaveSuccess = (response) => {
    _logger(response);
    let productsArray = response.data.item.pagedItems;
    setPageData((prevState) => {
      const pd = { ...prevState };
      pd.favoriteProducts = productsArray.map(mapProducts);
      pd.totalCount = response.data.item.totalCount;
      pd.totalPages = response.data.item.totalPages;
      return pd;
    });
  };

  const onGetFaveError = (error) => {
    _logger({ error });
    swal(
      "You currently don't have any favorites, click the heart button to add favorites."
    );
  };

  useEffect(() => {
    if (pageData.productTypeId > 0 && pageData.standId === null) {
      productService
        .getByProdTypeAndStandId(
          pageData.pageIndex,
          pageData.pageSize,
          pageData.productTypeId
        )
        .then(onGetProdTypeSuccess)
        .catch(onGetProdTypeError);
    } else if (
      //If no productTypeId/re-set filter selected but standId value selected
      (pageData.productTypeId === null ||
        pageData.productTypeId === "select") &&
      Array.isArray(pageData.standId)
    ) {
      _logger(
        "hitting first if else",
        pageData.pageIndex,
        pageData.pageSize,
        pageData.productTypeId,
        pageData.standId
      );
      productService
        .getByProdTypeAndMultipleStandId(
          pageData.pageIndex,
          pageData.pageSize,
          null,
          pageData.standId
        )
        .then(onGetMultipleSuccess)
        .catch(onGetMultipleError);
    } else if (pageData.productTypeId > 0 && Array.isArray(pageData.standId)) {
      //If productTypeId value selected AND standId value selected

      _logger(
        "This should have both values",
        pageData.productTypeId,
        pageData.standId
      );
      productService
        .getByProdTypeAndMultipleStandId(
          pageData.pageIndex,
          pageData.pageSize,
          pageData.productTypeId,
          pageData.standId
        )
        .then(onGetMultipleSuccess)
        .catch(onGetMultipleError);
    } else if (
      (pageData.productTypeId === null ||
        pageData.productTypeId === "select") &&
      pageData.standId === null
    ) {
      productService
        .getAllPag(pageData.pageIndex, pageData.pageSize)
        .then(onGetAllSuccess)
        .catch(onGetAllError);
    }
  }, [pageData.productTypeId, pageData.standId]);

  const addCartSuccessHandler = (productObj) => {
    _logger("onAddCartSuccessHandler: ", productObj);

    toastr["success"]("Added to cart", `${productObj.name}`);

    toastr.options = {
      closeButton: false,
      debug: false,
      newestOnTop: true,
      progressBar: false,
      positionClass: "toast-top-right",
      preventDuplicates: false,
      onclick: null,
      showDuration: "300",
      hideDuration: "1000",
      timeOut: "2500",
      extendedTimeOut: "1000",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
    };
  };

  const onAddCartError = (error) => {
    _logger("onGetCartError: ", error);
    toastr["error"]("Oops! Unable to add to cart", "Error");
  };

  const [textState, setTextState] = useState(false);
  //#endregion

  return (
    <div className="base-content-card d-flex justify-content-center">
      <div className="content w-75">
        <div className="mb-3 card">
          <div className="card-body">
            <div className="flex-between-center row">
              <div className="col mw-15">
                <div className="gx-2 align-items-center row">
                  <div className="gx-2 row">
                    <div className="col-auto">
                      <label
                        htmlFor="productTypeIdSelect"
                        className="product-filter-Labels"
                      >
                        Sort by product type
                      </label>
                      <select
                        className="pe-5 form-select"
                        onChange={onSelectProductType}
                        name="productTypeIdSelect"
                      >
                        <option value="select" defaultValue="">
                          Select product type
                        </option>
                        {productsStandsState.mappedProducts}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col mw-15">
                <label
                  htmlFor="standIdSelect"
                  className="product-filter-Labels"
                >
                  Sort by stand location
                </label>
                <Select
                  defaultValue={""}
                  isMulti
                  name="Stands"
                  //store selected data
                  options={productsStandsState.mappedStands}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={onSelectStand}
                />
              </div>

              <div className="col-auto mt-4">
                <Pagination
                  onChange={onPageClicked}
                  current={pageData.currentPage}
                  pageSize={pageData.pageSize}
                  total={pageData.totalCount}
                  className="d-flex justify-content-center my-3"
                  locale={locale}
                />
              </div>
              {props.currentUser.roles.includes("User") ? (
                <div className="col-auto mt-4">
                  <button
                    type="button"
                    onClick={onFaveClicked}
                    className="btn btn-success rounded-pill"
                  >
                    {textState ? "Show All" : "Favorites"}
                  </button>
                </div>
              ) : (
                ""
              )}
              <div className="col-auto mt-4">
                <Formik
                  enableReinitialize={true}
                  initialValues={formData}
                  onSubmit={handleSubmit}
                >
                  <Form className="position-relative input-group ">
                    <Field
                      id="search"
                      name="search"
                      placeholder="Search..."
                      aria-label="Search"
                      type="search"
                      className="rounded-pill search-input form-control mx-2 "
                    />
                    <button
                      className="rounded-pill btn btn-primary mx-2 "
                      type="submit"
                    >
                      Search
                    </button>
                  </Form>
                </Formik>
              </div>
              <div></div>
            </div>
          </div>
        </div>
        <div className="mb-2 card">
          <div className="pb-2 card-body">
            {isRenderFound.show ? (
              <div className="d-grid">
                <img
                  className="mx-auto"
                  src="https://tinyurl.com/bdhpp6yt"
                  alt="not found"
                />
                <h1 className="mx-auto">
                  We could not find what you are looking for!
                </h1>
              </div>
            ) : (
              ""
            )}
            {renderFaves.show ? (
              <div className="row">{pageData.productsComponents}</div>
            ) : (
              <div className="row">{pageData.favoriteProducts}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Products.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    roles: PropTypes.arrayOf(PropTypes.string),
  }),
};
export default Products;
