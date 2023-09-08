import React from "react";
import Hero from "./Hero";
import Partners from "./Partners";
import Cta from "./Cta";
import Processes from "./Processes";
import Services from "./Services";
import NewsletterSubscription from "./NewsletterSubscription";
import "../landing/Landing.css";
import HighlightReelCarousel from "components/highlightreels/HighlightReelCarousel";
const Landing = () => {
  return (
    <>
      <Hero />
      <Partners />
      <Processes />
      <Services />
      <HighlightReelCarousel />
      <NewsletterSubscription />
      <Cta />
    </>
  );
};

export default Landing;
