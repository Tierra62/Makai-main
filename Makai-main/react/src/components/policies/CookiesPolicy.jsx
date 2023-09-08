import React from "react";
import { Card } from "react-bootstrap";

function CookiesPolicy() {
  return (
    <React.Fragment>
      <h1>Cookies Policy</h1>
      <Card className="mb-3" id="account">
        <Card.Header className="bg-light">
          <h5 className="mb-0">About Cookies</h5>
        </Card.Header>
        <Card.Body>
          <h6 className="text-primary">What are cookies?</h6>
          <p className="mb-0 ps-3">
            Cookies are simple text files that are stored on your computer or
            mobile device by a website’s server. Each cookie is unique to your
            web browser. It will contain some anonymous information such as a
            unique identifier, website’s domain name, and some digits and
            numbers.
          </p>
          <hr className="my-4" />
          <h6 className="text-primary">What types of cookies do we use?</h6>
          <p className="fs-0 mb-0 fw-semi-bold">Necessary cookies</p>
          <ul type="1">
            <li>
              Necessary cookies allow us to offer you the best possible
              experience when accessing and navigating through our website and
              using its features. For example, these cookies let us recognize
              that you have created an account and have logged into that
            </li>
          </ul>
          <hr className="my-4" />
          <p className="fs-0 mb-0 fw-semi-bold">Functionality cookies</p>
          <ul type="1">
            <li>
              Functionality cookies let us operate the site in accordance with
              the choices you make. For example, we will recognize your username
              and remember how you customized the site during future visits.
            </li>
          </ul>
          <hr className="my-4" />
          <p className="fs-0 mb-0 fw-semi-bold">Analytical cookies</p>
          <ul type="1">
            <li>
              These cookies enable us and third-party services to collect
              aggregated data for statistical purposes on how our visitors use
              the website. These cookies do not contain personal information
              such as names and email addresses and are used to help us improve
              your user experience of the website.
            </li>
          </ul>
          <hr className="my-4" />

          <h6 className="text-primary">How to delete cookies?</h6>
          <p className="mb-0 ps-3">
            If you want to restrict or block the cookies that are set by our
            website, you can do so through your browser setting. Alternatively,
            you can visit{" "}
            <a href="https://www.internetcookies.com/">
              www.internetcookies.com
            </a>
            , which contains comprehensive information on how to do this on a
            wide variety of browsers and devices. You will find general
            information about cookies and details on how to delete cookies from
            your device.
          </p>
          <hr className="my-4" />
          <h6 className="text-primary">Contacting us</h6>
          <p className="mb-0 ps-3">
            If you have any questions about this policy or our use of cookies,
            please contact us.
          </p>
        </Card.Body>
      </Card>
    </React.Fragment>
  );
}

export default CookiesPolicy;
