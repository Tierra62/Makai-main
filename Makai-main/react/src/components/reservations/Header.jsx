import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
// import "../../App.css";
export default function Header(props) {
  const { title, crumbs } = props;
  const mapCrumb = (crumb, i) => {
    return (
      <li key={`crumblist_${i}`} className="breadcrumb-item">
        <Link key={`crumblink_${i}`} to={crumb.path}>
          {crumb.name}
        </Link>
      </li>
    );
  };
  return (
    <>
      <div className="page-title-box">
        <div className="page-title-right">
          <nav>
            <ol className="breadcrumb m-0 flex">
              <li className="breadcrumb-item">
                <Link to="/">Makai</Link>
              </li>
              {crumbs?.map(mapCrumb)}
            </ol>
          </nav>
        </div>
        <h4 className="page-title">{title}</h4>
      </div>
    </>
  );
}
Header.propTypes = {
  title: PropTypes.string.isRequired,
  crumbs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
};
