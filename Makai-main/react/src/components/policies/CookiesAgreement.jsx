import React from "react";
import CookieConsent from "react-cookie-consent";

function CookiesAgreement() {
  return (
    <CookieConsent
      debug={false}
      style={{ textAlign: "center" }}
      buttonText="Accept"
      expires={1}
    >
      We use cookies to improve your experience on our website and to show you
      personalized content. Some cookies are essential for the website to
      function properly, while others help us to analyze and optimize our
      website. By clicking Accept, you consent to the use of all cookies.
      Alternatively, you can see our <a href="/cookiespolicy">Cookies </a>and
      <a href="/privacypolicy"> Privacy</a> policies for more information.
    </CookieConsent>
  );
}

export default CookiesAgreement;
