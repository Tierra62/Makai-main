import illustration1 from "assets/img/illustrations/MakaiSurfboard.png";
import illustration2 from "assets/img/illustrations/beachmap.jpg";
import illustration3 from "assets/img/illustrations/jetski.jpg";

export default [
  {
    icon: ["far", "lightbulb"],
    iconText: "How It Works",
    color: "warning",
    title: "Providing Our Service",
    description:
      "Giving customers the means to easily rent beach gear and owners to effortlessly manage their locations and equipment onling or using our app.",
    image: illustration1,
  },
  {
    icon: ["far", "object-ungroup"],
    iconText: "Where",
    color: "info",
    title: "Numerous locations",
    description: "We have multiple locations in the Pensacola, Florida area.",
    image: illustration2,
    inverse: true,
  },
  {
    icon: ["far", "paper-plane"],
    iconText: "Tested",
    color: "success",
    title: "Reviewed and tested",
    description:
      "We have conducted testing for our products at multiple beach locations.",
    image: illustration3,
  },
];
